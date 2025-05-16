import { NextResponse } from 'next/server';
//import { server, networkPassphrase } from '../../../lib/stellar';
import StellarSdk from 'stellar-sdk';

export async function GET() {
  try {
    // Generate keypair
    const pair = StellarSdk.Keypair.random();

    // Fund account on testnet via Friendbot
    const friendbotUrl = `https://friendbot.stellar.org?addr=${pair.publicKey()}`;
    //await fetch(friendbotUrl);
    const response = await fetch(friendbotUrl);
    if (!response.ok) throw new Error('Friendbot funding failed');

    return NextResponse.json({
      publicKey: pair.publicKey(),
      secretKey: pair.secret(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
