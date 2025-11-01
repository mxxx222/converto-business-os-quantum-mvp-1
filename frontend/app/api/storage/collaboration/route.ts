rontend/app/api/storage/collaboration/route.ts</path>
<content">/**
 * Real-time Collaboration API
 * Phase 2: Storage & AI Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { action, sessionId, documentId, userId, sessionName } = body;

    switch (action) {
      case 'create_session':
        // Create new collaboration session
        const { data: session, error: sessionError } = await supabase
          .from('collaboration_sessions')
          .insert({
            document_id: documentId,
            session_name: sessionName,
            host_user_id: userId,
            participants: [userId]
          })
          .select()
          .single();

        if (sessionError) {
          return NextResponse.json(
            { error: 'Failed to create session', details: sessionError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: session
        });

      case 'join_session':
        // Join existing session
        const { data: updatedSession, error: joinError } = await supabase
          .from('collaboration_sessions')
          .update({
            participants: supabase.rpc('array_append', {
              arr: 'participants',
              elem: userId
            })
          })
          .eq('id', sessionId)
          .eq('is_active', true)
          .select()
          .single();

        if (joinError) {
          return NextResponse.json(
            { error: 'Failed to join session', details: joinError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: updatedSession
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Collaboration API error:', error);
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

    // Get user's active sessions
    const { data: sessions, error } = await supabase
      .from('collaboration_sessions')
      .select(`
        *,
        file_metadata!document_id (
          file_name,
          mime_type
        )
      `)
      .or(`host_user_id.eq.${userId},participants.cs.{${userId}}`)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch sessions', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Sessions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}