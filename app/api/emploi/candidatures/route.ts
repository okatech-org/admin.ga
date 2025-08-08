import { NextRequest, NextResponse } from 'next/server';
import type { Candidature } from '@/lib/types/emploi';

// Stockage temporaire des candidatures (en production, utiliser une base de données)
const candidatures: Candidature[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offreId = searchParams.get('offreId');
    const email = searchParams.get('email');
    const statut = searchParams.get('statut');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Filtrer les candidatures
    let filteredCandidatures = candidatures;

    if (offreId) {
      filteredCandidatures = filteredCandidatures.filter(c => c.offreId === offreId);
    }

    if (email) {
      filteredCandidatures = filteredCandidatures.filter(c =>
        c.candidat.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (statut) {
      filteredCandidatures = filteredCandidatures.filter(c =>
        c.statut === statut
      );
    }

    // Tri par date de candidature (plus récent en premier)
    filteredCandidatures.sort((a, b) =>
      new Date(b.dateCandidature).getTime() - new Date(a.dateCandidature).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCandidatures = filteredCandidatures.slice(startIndex, endIndex);

    return NextResponse.json({
      candidatures: paginatedCandidatures,
      total: filteredCandidatures.length,
      page,
      totalPages: Math.ceil(filteredCandidatures.length / limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des candidatures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Récupération des données du formulaire
    const offreId = formData.get('offreId') as string;
    const nom = formData.get('nom') as string;
    const prenom = formData.get('prenom') as string;
    const email = formData.get('email') as string;
    const telephone = formData.get('telephone') as string;
    const cvFile = formData.get('cv') as File;
    const lettreMotivation = formData.get('lettreMotivation') as string;
    const pretentionsSalariales = formData.get('pretentionsSalariales') as string;
    const disponibilite = formData.get('disponibilite') as string;
    const competences = formData.get('competences') as string;
    const experience = formData.get('experience') as string;

    // Validation des données obligatoires
    if (!offreId || !nom || !prenom || !email || !cvFile) {
      return NextResponse.json(
        { error: 'Données obligatoires manquantes' },
        { status: 400 }
      );
    }

    // Vérifier si le candidat a déjà postulé à cette offre
    const candidatureExistante = candidatures.find(c =>
      c.offreId === offreId && c.candidat.email.toLowerCase() === email.toLowerCase()
    );

    if (candidatureExistante) {
      return NextResponse.json(
        { error: 'Vous avez déjà postulé à cette offre' },
        { status: 400 }
      );
    }

    // Traitement du CV (dans une vraie application, uploader vers un service de stockage)
    const cvBuffer = await cvFile.arrayBuffer();
    const cvUrl = `/uploads/cv/${Date.now()}-${cvFile.name}`; // URL simulée

    // Créer la nouvelle candidature
    const nouvelleCandidature: Candidature = {
      id: `cand-${Date.now()}`,
      offreId,
      candidat: {
        nom,
        prenom,
        email,
        telephone,
        adresse: formData.get('adresse') as string || undefined,
        nationalite: 'Gabonaise'
      },
      cv: {
        url: cvUrl,
        nom: cvFile.name,
        taille: cvFile.size
      },
      lettreMotivation: lettreMotivation ? { texte: lettreMotivation } : undefined,
      competences: competences ? competences.split(',').map(c => c.trim()) : undefined,
      pretentionsSalariales: pretentionsSalariales ? parseInt(pretentionsSalariales) : undefined,
      disponibilite: disponibilite ? new Date(disponibilite) : undefined,
      statut: 'nouvelle',
      dateCandidature: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Ajouter l'expérience si fournie
    if (experience) {
      // Parser l'expérience (format simple pour l'exemple)
      nouvelleCandidature.notes = `Expérience: ${experience}`;
    }

    // Sauvegarder la candidature
    candidatures.push(nouvelleCandidature);

    // Envoyer un email de confirmation (simulé)
    console.log(`Email de confirmation envoyé à ${email}`);

    return NextResponse.json({
      message: 'Candidature envoyée avec succès',
      candidature: {
        id: nouvelleCandidature.id,
        statut: nouvelleCandidature.statut
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la candidature:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la candidature' },
      { status: 500 }
    );
  }
}
