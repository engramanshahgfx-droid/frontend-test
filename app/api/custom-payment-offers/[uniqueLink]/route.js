import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(request, { params }) {
  try {
    const { uniqueLink } = params;
    
    const response = await fetch(`${API_URL}/custom-payment-offers/${uniqueLink}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching custom payment offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment offer' },
      { status: 500 }
    );
  }
}
