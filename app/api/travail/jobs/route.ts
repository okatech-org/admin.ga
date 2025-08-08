import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * API Route pour la gestion des emplois TRAVAIL.GA
 * URL: /api/travail/jobs
 */

// GET - Récupérer la liste des emplois
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    // Simulation de données d'emplois
    const mockJobs = [
      {
        id: '1',
        title: 'Développeur Full Stack',
        company: 'DGDI Gabon',
        location: 'Libreville',
        category: 'Informatique',
        salary: '800000-1200000',
        type: 'CDI',
        description: 'Développement d\'applications web pour l\'administration',
        publishedAt: new Date('2024-01-15'),
        expiresAt: new Date('2024-02-15'),
        status: 'active',
        applications: 15
      },
      {
        id: '2',
        title: 'Gestionnaire RH',
        company: 'Ministère de la Fonction Publique',
        location: 'Libreville',
        category: 'Ressources Humaines',
        salary: '600000-900000',
        type: 'CDI',
        description: 'Gestion des ressources humaines de l\'administration',
        publishedAt: new Date('2024-01-10'),
        expiresAt: new Date('2024-02-10'),
        status: 'active',
        applications: 23
      },
      {
        id: '3',
        title: 'Infirmier(e) Spécialisé(e)',
        company: 'CHU de Libreville',
        location: 'Libreville',
        category: 'Santé',
        salary: '500000-750000',
        type: 'CDI',
        description: 'Soins spécialisés en cardiologie',
        publishedAt: new Date('2024-01-12'),
        expiresAt: new Date('2024-02-12'),
        status: 'active',
        applications: 8
      }
    ];

    // Filtrage des emplois selon les paramètres
    let filteredJobs = mockJobs;

    if (category) {
      filteredJobs = filteredJobs.filter(job =>
        job.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (search) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          page,
          limit,
          total: filteredJobs.length,
          pages: Math.ceil(filteredJobs.length / limit)
        },
        filters: {
          category,
          location,
          search
        }
      }
    });

  } catch (error) {
    console.error('Erreur API GET /api/travail/jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des emplois' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel emploi
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      company,
      location,
      category,
      salary,
      type,
      description,
      requirements,
      benefits,
      expiresAt
    } = body;

    // Validation des données
    if (!title || !company || !location || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Simulation de création d'emploi
    const newJob = {
      id: Date.now().toString(),
      title,
      company,
      location,
      category,
      salary,
      type: type || 'CDI',
      description,
      requirements: requirements || [],
      benefits: benefits || [],
      publishedAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      status: 'pending', // En attente de modération
      applications: 0,
      employerId: session.user?.id,
      createdBy: session.user?.email
    };

    // En production, sauvegarder en base de données
    // await prisma.job.create({ data: newJob });

    return NextResponse.json({
      success: true,
      message: 'Emploi créé avec succès - En attente de modération',
      data: newJob
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur API POST /api/travail/jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de l\'emploi' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les statistiques (usage interne)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Accès super admin requis' },
        { status: 403 }
      );
    }

    // Simulation de mise à jour des statistiques emplois
    const updatedStats = {
      totalJobs: 3456,
      activeJobs: 2834,
      pendingJobs: 127,
      expiredJobs: 495,
      totalApplications: 15789,
      averageApplicationsPerJob: 4.6,
      successfulHirings: 2843,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Statistiques emplois mises à jour',
      data: updatedStats
    });

  } catch (error) {
    console.error('Erreur API PUT /api/travail/jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
