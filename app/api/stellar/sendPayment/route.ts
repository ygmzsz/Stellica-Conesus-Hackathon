// app/api/stellar/sendPayment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendPayment } from '@/lib/stellar';

export async function POST(request: NextRequest) {
  try {
    const { senderSecretKey, destinationPublicKey, amount, asset, memo } = await request.json();
    const result = await sendPayment({ senderSecretKey, destinationPublicKey, amount, asset, memo });
    return NextResponse.json(result);
  }
  catch (error) {
    return NextResponse.json({ error: 'Failed to send payment' }, { status: 500 });
  }
}
