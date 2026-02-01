import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request, { params }) {
  try {
    const { uniqueLink } = params;
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/custom-payment-offers/${uniqueLink}/payment-success`, {
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
    console.error('Error processing payment success:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  // Handle GET redirect from Moyasar
  try {
    const { uniqueLink } = params;
    const { searchParams } = new URL(request.url);
    
    const body = {
      id: searchParams.get('id'),
      status: searchParams.get('status'),
      transaction_id: searchParams.get('id'),
    };
    
    const response = await fetch(`${API_URL}/custom-payment-offers/${uniqueLink}/payment-success`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Redirect back to the payment page with status
    const redirectUrl = new URL(`/en/pay-custom-offer/${uniqueLink}`, request.url);
    redirectUrl.searchParams.set('status', searchParams.get('status') || 'paid');
    redirectUrl.searchParams.set('id', searchParams.get('id') || '');
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing payment callback:', error);
    const { uniqueLink } = params;
    const redirectUrl = new URL(`/en/pay-custom-offer/${uniqueLink}`, request.url);
    redirectUrl.searchParams.set('status', 'failed');
    redirectUrl.searchParams.set('message', 'Payment processing error');
    
    return NextResponse.redirect(redirectUrl);
  }
}
