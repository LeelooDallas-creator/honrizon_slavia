export const prerender = false;

import type { APIRoute } from 'astro';
import { requireAuth, verifyCsrfToken } from '@/lib/auth';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAuth(cookies);

    // Verify CSRF token
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !verifyCsrfToken(cookies, csrfToken)) {
      return new Response(
        JSON.stringify({ error: 'Token CSRF invalide' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'Seuls les fichiers PDF sont acceptés' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Limit size to 10 MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'Le fichier est trop volumineux (max 10 MB)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ext = extname(file.name).toLowerCase();
    const nameWithoutExt = basename(file.name, ext);

    if (ext !== '.pdf') {
      return new Response(
        JSON.stringify({ error: 'Extension de fichier invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize filename - remove dangerous characters
    const safeName = nameWithoutExt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]/gi, '-')     // Replace non-alphanumeric with dashes
      .replace(/-+/g, '-')              // Merge multiple dashes
      .replace(/^-|-$/g, '')            // Remove leading/trailing dashes
      .substring(0, 50);                // Limit length

    const timestamp = Date.now();
    const filename = `${timestamp}-${safeName}${ext}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'pdfs');
    const filepath = join(uploadsDir, filename);

    // Verify final path is within uploads directory
    if (!filepath.startsWith(uploadsDir)) {
      return new Response(
        JSON.stringify({ error: 'Chemin de fichier invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await mkdir(uploadsDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filepath, buffer);

    const url = `/uploads/pdfs/${filename}`;

    return new Response(
      JSON.stringify({ url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur upload:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'upload' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
