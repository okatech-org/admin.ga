import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';
    const isActive = searchParams.get('isActive');

    // Construire les conditions de filtrage
    const whereConditions: any = {};

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      whereConditions.type = type;
    }

    if (city) {
      whereConditions.city = { contains: city, mode: 'insensitive' };
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      whereConditions.isActive = isActive === 'true';
    }

    // Récupérer les organismes avec pagination
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where: whereConditions,
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ],
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          description: true,
          city: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              users: true
            }
          }
        }
      }),
      prisma.organization.count({ where: whereConditions })
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    const result = {
      success: true,
      data: {
        organizations: organizations.map(org => ({
          ...org,
          userCount: org._count.users,
          requestCount: 0, // À implémenter quand le modèle Request existera
          appointmentCount: 0, // À implémenter quand le modèle Appointment existera
          _count: undefined
        })),
        total,
        page,
        limit,
        hasMore,
        totalPages,
        metadata: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: total,
          totalPages,
          hasNextPage: hasMore,
          hasPreviousPage: page > 1
        }
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur organizations list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors du chargement des organismes',
        data: {
          organizations: [],
          total: 0,
          page: 1,
          limit: 20,
          hasMore: false,
          totalPages: 0
        }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
