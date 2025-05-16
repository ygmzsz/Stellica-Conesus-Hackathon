import { server } from '@/lib/stellar'; // Adjust path if needed

interface BalanceInfo {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

export async function getAccountBalance(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey);

    const balances = account.balances.map((balance: BalanceInfo) => {
      if (balance.asset_type === 'native') {
        return {
          asset: 'XLM',
          balance: balance.balance,
          asset_type: balance.asset_type,
        };
      } else {
        return {
          asset: `${balance.asset_code}:${balance.asset_issuer}`,
          balance: balance.balance,
          asset_type: balance.asset_type,
        };
      }
    });

    return balances;
  } catch (error) {
    console.error('Error getting account balance:', error);
    throw error;
  }
}
