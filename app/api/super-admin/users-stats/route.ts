/* @ts-nocheck */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    console.log('🧹 Users stats - retour de statistiques vides (base nettoyée)');

    const stats = {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
      statusDistribution: {
        active: 0,
        inactive: 0
      },
      usersByRole: {
        SUPER_ADMIN: 0,
        ADMIN: 0,
        MANAGER: 0,
        AGENT: 0,
        CITOYEN: 0
      },
      usersByOrganization: {},
      recentUsers: [],
      loginStats: {
        dailyLogins: 0,
        weeklyLogins: 0,
        monthlyLogins: 0
      },
      trends: {
        newUsersThisMonth: 0,
        activeToday: 0,
        growth: 0
      },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur users stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur'
      },
      { status: 500 }
    );
  }
}
