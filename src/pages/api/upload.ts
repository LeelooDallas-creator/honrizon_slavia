export const prerender = false;

import type { APIRoute } from 'astro';
import { requireAuth } from '@/lib/auth';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Vérifier l'authentification
    requireAuth(cookies);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que c'est bien un PDF
    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'Seuls les fichiers PDF sont acceptés' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Limiter la taille à 10 MB
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'Le fichier est trop volumineux (max 10 MB)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const sanitizedName = file.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9.]/g, '-');
    
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(process.cwd(), 'public', 'uploads', 'pdfs', filename);

    // Sauvegarder le fichier
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filepath, buffer);

    // Retourner l'URL publique
    const url = `/uploads/pdfs/${filename}`;

    return new Response(
      JSON.stringify({ url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erreur upload:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'upload' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
