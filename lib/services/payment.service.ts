/* @ts-nocheck */
import { PrismaClient } from '@prisma/client';
import { AirtelMoneyService } from './providers/airtel-money.service';
import { MoovMoneyService } from './providers/moov-money.service';
import crypto from 'crypto';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerPhone: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

interface PaymentResponse {
  transactionId: string;
  status: any;
  message: string;
  reference?: string;
  fees?: number;
}

interface PaymentProvider {
  initiate(data: PaymentData): Promise<PaymentResponse>;
  verify(transactionId: string): Promise<PaymentResponse>;
  refund(transactionId: string, amount?: number): Promise<PaymentResponse>;
}

export class PaymentService {
  private prisma: PrismaClient;
  private providers = new Map<string, PaymentProvider>();

  constructor(
    prisma: PrismaClient,
    airtelMoneyService: AirtelMoneyService,
    moovMoneyService: MoovMoneyService
  ) {
    this.prisma = prisma;
    this.providers = new Map([
      ['AIRTEL_MONEY', airtelMoneyService],
      ['MOOV_MONEY', moovMoneyService],
    ] as any);
  }

  async initiatePayment(
    paymentData: PaymentData,
    method: string,
    userId: string,
    requestId?: string
  ): Promise<any> {
    const provider = this.providers.get(method);
    if (!provider) {
      throw new Error(`Payment method ${method} not supported`);
    }

    // Generate payment reference
    const reference = this.generatePaymentReference();

    try {
      // Create payment record
      const payment = await (this.prisma as any).payment.create({
        data: {
          reference,
          amount: paymentData.amount,
          currency: paymentData.currency,
          method: method as any,
          status: 'PENDING' as any,
          description: paymentData.description,
          customerPhone: paymentData.customerPhone,
          customerEmail: paymentData.customerEmail,
          userId,
          requestId,
          metadata: paymentData.metadata || {},
        },
      });

      // Initiate payment with provider
      const response = await provider.initiate({
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          paymentId: payment.id,
          reference,
        },
      });

      // Update payment with provider response
      await (this.prisma as any).payment.update({
        where: { id: payment.id },
        data: {
          providerTransactionId: response.transactionId,
          providerResponse: response,
          status: response.status,
        },
      });

      return {
        paymentId: payment.id,
        reference,
        ...response,
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  async verifyPayment(paymentId: string): Promise<any> {
    const payment = await (this.prisma as any).payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    const provider = this.providers.get(payment.method);
    if (!provider) {
      throw new Error(`Payment provider ${payment.method} not available`);
    }

    try {
      const response = await provider.verify(payment.providerTransactionId);
      
      // Update payment status
      const updatedPayment = await (this.prisma as any).payment.update({
        where: { id: paymentId },
        data: {
          status: response.status,
          verifiedAt: new Date(),
          providerResponse: response,
        },
      });

      // Handle successful payment
      if (response.status === 'COMPLETED') {
        await this.handleSuccessfulPayment(updatedPayment);
      } else if (response.status === 'FAILED') {
        await this.handleFailedPayment(updatedPayment);
      }

      return response;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  async handleWebhook(
    provider: string,
    payload: any,
    signature?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verify webhook signature
      const isValidSignature = await this.verifyWebhookSignature(provider, payload, signature);
      if (!isValidSignature) {
        return { success: false, message: 'Invalid signature' };
      }

      // Extract payment data from webhook
      const { transactionId, status, amount, reference } = this.extractWebhookData(provider, payload);

      // Find payment by provider transaction ID or reference
      const payment = await (this.prisma as any).payment.findFirst({
        where: {
          OR: [
            { providerTransactionId: transactionId },
            { reference },
          ],
        },
      });

      if (!payment) {
        return { success: false, message: 'Payment not found' };
      }

      // Update payment status
      const updatedPayment = await (this.prisma as any).payment.update({
        where: { id: payment.id },
        data: {
          status,
          webhookData: payload,
          updatedAt: new Date(),
        },
      });

      // Handle status changes
      if (status === 'COMPLETED' && payment.status !== 'COMPLETED') {
        await this.handleSuccessfulPayment(updatedPayment);
      } else if (status === 'FAILED' && payment.status !== 'FAILED') {
        await this.handleFailedPayment(updatedPayment);
      }

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { success: false, message: 'Webhook processing failed' };
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<any> {
    const payment = await (this.prisma as any).payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.status !== 'COMPLETED') {
      throw new Error('Payment not found or not eligible for refund');
    }

    const provider = this.providers.get(payment.method);
    if (!provider) {
      throw new Error(`Payment provider ${payment.method} not available`);
    }

    try {
      const refundAmount = amount || payment.amount;
      const response = await provider.refund(payment.providerTransactionId, refundAmount);

      // Create refund record
      const refund = await (this.prisma as any).payment.create({
        data: {
          reference: this.generatePaymentReference(),
          amount: -refundAmount,
          currency: payment.currency,
          method: payment.method,
          status: response.status,
          description: `Refund: ${reason || 'No reason provided'}`,
          customerPhone: payment.customerPhone,
          customerEmail: payment.customerEmail,
          userId: payment.userId,
          requestId: payment.requestId,
          parentPaymentId: paymentId,
          providerTransactionId: response.transactionId,
          providerResponse: response,
          metadata: { refundReason: reason },
        },
      });

      return refund;
    } catch (error) {
      console.error('Refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  async getUserPayments(userId: string, limit: number = 20, offset: number = 0): Promise<any[]> {
    return await (this.prisma as any).payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        request: {
          select: {
            id: true,
            type: true,
            trackingNumber: true,
          },
        },
      },
    });
  }

  async getPaymentStats(
    startDate: Date,
    endDate: Date,
    organizationId?: string
  ): Promise<any> {
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (organizationId) {
      whereClause.request = {
        organizationId,
      };
    }

    const [totalPayments, completedPayments, totalAmount, stats] = await Promise.all([
      (this.prisma as any).payment.count({ where: whereClause }),
      (this.prisma as any).payment.count({
        where: { ...whereClause, status: 'COMPLETED' },
      }),
      (this.prisma as any).payment.aggregate({
        where: { ...whereClause, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      (this.prisma as any).payment.groupBy({
        by: ['method', 'status'],
        where: whereClause,
        _count: true,
        _sum: { amount: true },
      }),
    ]);

    return {
      totalPayments,
      completedPayments,
      totalAmount: totalAmount._sum.amount || 0,
      successRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0,
      byMethod: this.groupStatsByMethod(stats),
      byStatus: this.groupStatsByStatus(stats),
    };
  }

  async generatePaymentReport(
    startDate: Date,
    endDate: Date,
    format: 'CSV' | 'PDF' = 'CSV'
  ): Promise<string> {
    const payments = await (this.prisma as any).payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        request: {
          select: {
            trackingNumber: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'CSV') {
      return this.generateCSVReport(payments);
    } else {
      return this.generatePDFReport(payments);
    }
  }

  // Private helper methods
  private generatePaymentReference(): string {
    return `PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  private async handleSuccessfulPayment(payment: any): Promise<void> {
    // Update related service request status if applicable
    if (payment.requestId) {
      await (this.prisma as any).serviceRequest.update({
        where: { id: payment.requestId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    }

    // Send payment confirmation notification
    // TODO: Implement notification service call
  }

  private async handleFailedPayment(payment: any): Promise<void> {
    // Send payment failure notification
    // TODO: Implement notification service call
  }

  private async verifyWebhookSignature(
    provider: string,
    payload: any,
    signature?: string
  ): Promise<boolean> {
    const providerService = this.providers.get(provider);
    if (!providerService || !signature) return false;

    // TODO: Implement provider-specific signature verification
    return true;
  }

  private extractWebhookData(provider: string, payload: any): any {
    // Provider-specific data extraction logic
    switch (provider) {
      case 'AIRTEL_MONEY':
        return {
          transactionId: payload.transaction_id,
          status: payload.status,
          amount: payload.amount,
          reference: payload.reference,
        };
      case 'MOOV_MONEY':
        return {
          transactionId: payload.txnid,
          status: payload.status,
          amount: payload.amount,
          reference: payload.reference,
        };
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private groupStatsByMethod(stats: any[]): Record<string, any> {
    return stats.reduce((acc, stat) => {
      if (!acc[stat.method]) {
        acc[stat.method] = { count: 0, amount: 0 };
      }
      acc[stat.method].count += stat._count;
      acc[stat.method].amount += stat._sum.amount || 0;
      return acc;
    }, {});
  }

  private groupStatsByStatus(stats: any[]): Record<string, any> {
    return stats.reduce((acc, stat) => {
      if (!acc[stat.status]) {
        acc[stat.status] = { count: 0, amount: 0 };
      }
      acc[stat.status].count += stat._count;
      acc[stat.status].amount += stat._sum.amount || 0;
      return acc;
    }, {});
  }

  private generateCSVReport(payments: any[]): string {
    const headers = [
      'ID',
      'Reference',
      'Amount',
      'Currency',
      'Method',
      'Status',
      'Customer',
      'Phone',
      'Email',
      'Request',
      'Created At',
    ];

    const rows = payments.map(payment => [
      payment.id,
      payment.reference,
      payment.amount,
      payment.currency,
      payment.method,
      payment.status,
      payment.user ? `${payment.user.firstName} ${payment.user.lastName}` : '',
      payment.customerPhone,
      payment.customerEmail || '',
      payment.request?.trackingNumber || '',
      payment.createdAt.toISOString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private generatePDFReport(payments: any[]): string {
    // TODO: Implement PDF generation
    throw new Error('PDF report generation not implemented');
  }
} 