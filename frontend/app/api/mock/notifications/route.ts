import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, recipient } = body;

    console.log(`Mock notification: ${type}`, { message, recipient });

    // Simuloi viivettä
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: `${type} notification sent (mock)`,
      mock: true,
      data: {
        type,
        message,
        recipient,
        sent_at: new Date().toISOString(),
        delivery_status: 'mock_delivered'
      }
    });

  } catch (error: any) {
    console.error('Mock notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Notification failed', mock: true },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Mock Notifications Ready',
    services: ['resend', 'slack', 'whatsapp'],
    message: 'All notifications are mocked - no real services connected'
  });
}




