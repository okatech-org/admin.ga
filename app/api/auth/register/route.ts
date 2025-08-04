import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // TODO: Réactiver quand le modèle User sera ajouté au schéma Prisma
    // Check if user already exists
    // const existingUser = await prisma.user.findFirst({
    //   where: {
    //     OR: [
    //       { email: validatedData.email },
    //       { phone: validatedData.phone || undefined }
    //     ]
    //   }
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: 'Un compte avec cet email ou téléphone existe déjà' },
    //     { status: 400 }
    //   );
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // TODO: Réactiver quand le modèle User sera ajouté au schéma Prisma
    // Create user
    // const user = await prisma.user.create({
    //   data: {
    //     email: validatedData.email,
    //     phone: validatedData.phone || null,
    //     firstName: validatedData.firstName,
    //     lastName: validatedData.lastName,
    //     password: hashedPassword,
    //     role: 'USER', // Default role for citizens
    //     isActive: true,
    //     isVerified: false,
    //   }
    // });

    // Temporaire: simuler la création d'un utilisateur
    const user = {
      id: 'temp-' + Date.now(),
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName
    };

    // TODO: Réactiver quand les modèles Profile et AuditLog seront ajoutés au schéma Prisma
    // Create empty profile
    // await prisma.profile.create({
    //   data: {
    //     userId: user.id,
    //   }
    // });

    // Log registration
    // await prisma.auditLog.create({
    //   data: {
    //     userId: user.id,
    //     action: 'REGISTER',
    //     details: {
    //       email: user.email,
    //       role: user.role
    //     }
    //   }
    // });

    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        userId: user.id
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Un compte avec ces informations existe déjà' },
        { status: 400 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
