/**
 * Cloudflare R2 Storage client for Converto Business OS
 * S3-compatible storage for receipts, documents, and images
 */

const R2_ENDPOINT = process.env.NEXT_PUBLIC_R2_ENDPOINT || '';
const R2_BUCKET = process.env.NEXT_PUBLIC_R2_BUCKET || 'converto-storage';
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

interface UploadOptions {
  filename: string;
  contentType: string;
  public?: boolean;
}

/**
 * Upload file to R2 Storage
 */
export async function uploadToR2(
  file: File | Blob,
  options: UploadOptions
): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', options.filename);
  formData.append('contentType', options.contentType);
  formData.append('public', options.public ? 'true' : 'false');

  const response = await fetch('/api/storage/r2/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`R2 upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.publicUrl || `${R2_PUBLIC_URL}/${data.key}`,
    key: data.key,
  };
}

/**
 * Get public URL for R2 object
 */
export function getR2PublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Delete file from R2 Storage
 */
export async function deleteFromR2(key: string): Promise<void> {
  const response = await fetch(`/api/storage/r2/delete?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`R2 delete failed: ${response.statusText}`);
  }
}

