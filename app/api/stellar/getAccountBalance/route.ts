import StellarSdk from 'stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get('publicKey');
    if (!publicKey) {
      return new Response(JSON.stringify({ error: 'Missing publicKey' }), { status: 400 });
    }

    const account = await server.loadAccount(publicKey);

    const balances = account.balances.map((bal: { asset_type: string; asset_code?: string; balance: string }) => ({
      asset: bal.asset_type === 'native' ? 'XLM' : bal.asset_code,
      balance: bal.balance,
    }));

    return new Response(JSON.stringify(balances), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching account balance:', error);

    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch balance' }),
      { status: 500 }
    );
  }
}
