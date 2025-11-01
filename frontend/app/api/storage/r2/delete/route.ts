import { NextResponse } from 'next/server';

/**
 * Delete file from Cloudflare R2 Storage
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Key required' },
        { status: 400 }
      );
    }

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

    // Delete from R2 using S3-compatible API
    const deleteUrl = `${r2Endpoint}/${r2Bucket}/${key}`;
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `AWS ${r2AccessKeyId}:${r2SecretAccessKey}`,
      },
    });

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      throw new Error(`R2 delete failed: ${deleteResponse.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted',
    });
  } catch (error) {
    console.error('R2 delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}

