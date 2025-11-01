rontend/app/api/storage/upload/route.ts</path>
<content">/**
 * File Upload API with AI Processing Integration
 * Phase 2: Storage & AI Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const fileType = formData.get('fileType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      );
    }

    // Store file metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('file_metadata')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        file_type: fileType,
        storage_bucket: 'documents'
      })
      .select()
      .single();

    if (metadataError) {
      console.error('Metadata error:', metadataError);
      return NextResponse.json(
        { error: 'Failed to store metadata', details: metadataError.message },
        { status: 500 }
      );
    }

    // Queue AI processing if applicable
    if (['pdf', 'image', 'document'].includes(fileType)) {
      await supabase
        .from('ai_processing_queue')
        .insert({
          user_id: userId,
          file_id: metadata.id,
          processing_type: 'analysis',
          priority: 5
        });
    }

    return NextResponse.json({
      success: true,
      data: {
        file: uploadData,
        metadata: metadata,
        message: 'File uploaded and queued for processing'
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get user's files
    const { data: files, error } = await supabase
      .from('file_metadata')
      .select(`
        *,
        document_processing (
          processing_type,
          result,
          processing_time,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Files query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch files', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('Files API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}