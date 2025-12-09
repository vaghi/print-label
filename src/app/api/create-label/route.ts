import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, parcel } = body;

    const apiKey = process.env.EASYPOST_API_KEY;
    const apiUrl = process.env.EASYPOST_API_URL || 'https://api.easypost.com/v2';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    // 1. Create Shipment
    const shipmentResponse = await fetch(`${apiUrl}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        shipment: {
          to_address: to,
          from_address: from,
          parcel: parcel,
        },
      }),
    });

    const shipmentData = await shipmentResponse.json();

    if (!shipmentResponse.ok) {
      return NextResponse.json(
        { error: shipmentData.error?.message || 'Failed to create shipment' },
        { status: shipmentResponse.status }
      );
    }

    // 2. Buy Lowest Rate
    // EasyPost automatically calculates rates. We just need to pick the lowest one.
    // The buy endpoint can technically be used directly with a rate ID,
    // or we can filter client-side.
    // For simplicity, we'll find the lowest rate here.
    const rates = shipmentData.rates || [];
    if (rates.length === 0) {
      return NextResponse.json(
        { error: 'No rates found for this shipment' },
        { status: 400 }
      );
    }

    // Sort rates by rate (price) ascending
    const sortedRates = rates.sort(
      (a: any, b: any) => parseFloat(a.rate) - parseFloat(b.rate)
    );
    const lowestRate = sortedRates[0];

    // 3. Purchase Label
    const buyResponse = await fetch(
      `${apiUrl}/shipments/${shipmentData.id}/buy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        },
        body: JSON.stringify({
          rate: {
            id: lowestRate.id,
          },
        }),
      }
    );

    const buyData = await buyResponse.json();

    if (!buyResponse.ok) {
      return NextResponse.json(
        { error: buyData.error?.message || 'Failed to purchase label' },
        { status: buyResponse.status }
      );
    }

    return NextResponse.json({
      labelUrl: buyData.postage_label.label_url,
      trackerUrl: buyData.tracker?.public_url,
      rate: lowestRate.rate,
      currency: lowestRate.currency,
      carrier: lowestRate.carrier,
      service: lowestRate.service,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
