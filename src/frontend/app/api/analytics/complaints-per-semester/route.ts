// app/api/analytics/complaints-per-semester/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Construct the full backend URL
    const backendUrl = `${process.env.BACKEND_API_BASE_URL}/analytics/complaints-per-semester/`;
    
    // 2. Forward all query parameters from client to backend
    const { searchParams } = new URL(request.url);
    const backendResponse = await fetch(`${backendUrl}?${searchParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    // 3. Handle non-200 responses
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(
        `Backend responded with ${backendResponse.status}: ${JSON.stringify(errorData)}`
      );
    }

    // 4. Return the backend response directly
    const data = await backendResponse.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60' // Browser cache
      }
    });

  } catch (error) {
    console.error('API Proxy Error:', {
      url: request.url,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: false,
        error: "Analytics service unavailable",
        message: error.message 
      },
      { status: backendResponse?.status || 502 }
    );
  }
}