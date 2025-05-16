// lib/stellar.ts
//const StellarSdk = require('stellar-sdk');
//import { Server, Networks } from 'stellar-sdk';
import StellarSdk from 'stellar-sdk';

// Network configuration
const TESTNET = true; // Switch to false for production
const SERVER_URL = TESTNET 
  ? 'https://horizon-testnet.stellar.org' 
  : 'https://horizon.stellar.org';
  
export const server = new StellarSdk.Horizon.Server(SERVER_URL);
export const networkPassphrase = TESTNET 
  ? StellarSdk.Networks.TESTNET 
  : StellarSdk.Networks.PUBLIC;

// Utility functions
export async function getAccountInfo(publicKey: string) {
  try {
    return await server.loadAccount(publicKey);
  } catch (error) {
    console.error('Error loading account:', error);
    throw error;
  }
}

export async function getAccountBalance(publicKey: string) {
  try {
    const account = await getAccountInfo(publicKey);
    const balances = account.balances.map((balance: any) => {
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

export async function createAccount() {
  // Generate a new keypair
  const pair = StellarSdk.Keypair.random();
  const publicKey = pair.publicKey();
  const secretKey = pair.secret();
  
  // For testnet, you can fund the account automatically using Friendbot
  if (TESTNET) {
    try {
      await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    } catch (error) {
      console.error('Error funding testnet account:', error);
      throw error;
    }
  }
  
  return {
    publicKey,
    secretKey
  };
}

export async function sendPayment({
  senderSecretKey,
  destinationPublicKey,
  amount,
  asset = 'XLM',
  memo = '',
}: {
  senderSecretKey: string;
  destinationPublicKey: string;
  amount: string;
  asset?: string;
  memo?: string;
}) {
  try {
    // Load sender account
    const sourceKeypair = StellarSdk.Keypair.fromSecret(senderSecretKey);
    const sourcePublicKey = sourceKeypair.publicKey();
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    
    // Start building the transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    });
    
    // Add the payment operation
    // If using XLM, use the native asset
    if (asset === 'XLM') {
      transaction.addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      );
    } else {
      // For other assets, you need the asset code and issuer
      const [assetCode, assetIssuer] = asset.split(':');
      const stellarAsset = new StellarSdk.Asset(assetCode, assetIssuer);
      
      transaction.addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: stellarAsset,
          amount,
        })
      );
    }
    
    // Add a memo if provided
    if (memo) {
      transaction.addMemo(StellarSdk.Memo.text(memo));
    }
    
    // Set a timeout of 30 seconds for the transaction
    transaction.setTimeout(30);
    
    // Build and sign the transaction
    const builtTransaction = transaction.build();
    builtTransaction.sign(sourceKeypair);
    
    // Submit the transaction to the network
    const result = await server.submitTransaction(builtTransaction);
    return result;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
}

export async function watchAccount(publicKey: string, callback: (tx: any) => void) {
  // This function sets up a stream to monitor transactions involving this account
  const es = server.transactions()
    .forAccount(publicKey)
    .cursor('now')
    .stream({
      onmessage: (tx: any) => {
        callback(tx);
      },
      onerror: (error: any) => {
        console.error('Error watching account:', error);
      }
    });
  
  return es; // Return the event source so it can be closed if needed
}

export async function getTransactionHistory(publicKey: string, limit = 10) {
  try {
    const transactions = await server.transactions()
      .forAccount(publicKey)
      .limit(limit)
      .order('desc')
      .call();
    
    return transactions.records;
  } catch (error) {
    console.error('Error getting transaction history:', error);
    throw error;
  }
}