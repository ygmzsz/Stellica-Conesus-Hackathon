import StellarSdk from 'stellar-sdk';

const server = new StellarSdk.Server('https://horizon.stellar.org');

interface BalanceInfo {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

export async function getAccountBalance(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey);

    const balances = account.balances.map((balance: BalanceInfo) => ({
      asset: balance.asset_type === 'native'
        ? 'XLM'
        : `${balance.asset_code}:${balance.asset_issuer}`,
      balance: balance.balance,
      asset_type: balance.asset_type,
    }));

    return balances;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Account does not exist or is unfunded
      return [{ asset: 'XLM', balance: '0', asset_type: 'native' }];
    }

    // Re-throw other errors
    throw error;
  }
}
