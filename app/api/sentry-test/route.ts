import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
  try {
    throw new Error("Erreur de test côté serveur Sentry");
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ success: false, error: "Erreur serveur générée" }, { status: 500 });
  }
}
