import { NextResponse } from 'next/server';

/**
 * Upload file to Cloudflare R2 Storage
 * Proxy endpoint that handles R2 uploads server-side
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;
    const contentType = formData.get('contentType') as string;
    const isPublic = formData.get('public') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to R2 via Cloudflare API
    const r2Endpoint = process.env.R2_ENDPOINT;
    const r2Bucket = process.env.R2_BUCKET || 'converto-storage';
    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) {
      return NextResponse.json(
        { error: 'R2 not configured' },
        { status: 500 }
      );
    }

    // Generate unique key
    const timestamp = Date.now();
    const key = `${timestamp}-${filename}`;

    // Upload to R2 using S3-compatible API
    const fileBuffer = await file.arrayBuffer();
    const uploadUrl = `${r2Endpoint}/${r2Bucket}/${key}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Authorization': `AWS ${r2AccessKeyId}:${r2SecretAccessKey}`,
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`R2 upload failed: ${uploadResponse.statusText}`);
    }

    // Generate public URL if public
    const publicUrl = isPublic
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
      : null;

    return NextResponse.json({
      success: true,
      key,
      publicUrl,
    });
  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

