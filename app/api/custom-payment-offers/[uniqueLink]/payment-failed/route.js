import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request, { params }) {
  try {
    const { uniqueLink } = params;
    const body = await request.json().catch(() => ({}));
    
    const response = await fetch(`${API_URL}/custom-payment-offers/${uniqueLink}/payment-failed`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error processing payment failure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process payment failure' },
      { status: 500 }
    );
  }
}
