import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const url = `https://firebasestorage.googleapis.com/v0/b/visionboard-e3o1o.firebasestorage.app/o/${encodeURIComponent(path)}`;
    
    // Forward the request to Firebase Storage
    const response = await fetch(url, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Firebase Storage' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error proxying Firebase Storage request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    }
  });
}