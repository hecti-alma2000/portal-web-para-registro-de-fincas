import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Support JSON { fileName, data: base64 } or form-data with a file
    const contentType = req.headers.get('content-type') || '';
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { fileName, data } = body as { fileName: string; data: string };
      if (!fileName || !data)
        return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
      const matches = data.match(/^data:(.+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = path.extname(fileName) || '.png';
      if (matches) {
        buffer = Buffer.from(matches[2], 'base64');
        const mime = matches[1];
        // optionally derive ext from mime
      } else {
        buffer = Buffer.from(data, 'base64');
      }
      const safeName = `${Date.now()}-${fileName}`.replace(/[^a-zA-Z0-9._-]/g, '-');
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;
      return NextResponse.json({ ok: true, url: publicUrl });
    }

    // For multipart/form-data, use a simple parsing fallback for small files
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ ok: false, message: 'No file' }, { status: 400 });
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `${Date.now()}-${(file as any).name || 'upload'}`.replace(
        /[^a-zA-Z0-9._-]/g,
        '-'
      );
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;
      return NextResponse.json({ ok: true, url: publicUrl });
    }

    return NextResponse.json({ ok: false, message: 'Unsupported content type' }, { status: 415 });
  } catch (error) {
    return NextResponse.json({ ok: false, message: 'Upload failed' }, { status: 500 });
  }
}
