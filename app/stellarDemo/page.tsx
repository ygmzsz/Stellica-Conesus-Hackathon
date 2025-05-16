"use client";

import React, { useState, useEffect } from 'react';

// Style definitions
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#2d89ef',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  padding: '10px 16px',
  fontSize: 16,
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const buttonHoverStyle: React.CSSProperties = {
  backgroundColor: '#1b5dab',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: 12,
  padding: 10,
  borderRadius: 6,
  border: '1.5px solid #333',
  backgroundColor: '#111',
  color: 'white',
  fontSize: 16,
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.3s ease',
};

const walletListStyle: React.CSSProperties = {
  backgroundColor: '#111',
  padding: 15,
  borderRadius: 8,
  marginBottom: 20,
  maxHeight: '300px',
  overflowY: 'auto',
  border: '1px solid #333',
};

const walletItemStyle: React.CSSProperties = {
  padding: '8px 12px',
  margin: '6px 0',
  backgroundColor: '#1a1a1a',
  borderRadius: 6,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  color: 'white',
};

const activeWalletStyle: React.CSSProperties = {
  borderLeft: '4px solid #2d89ef',
  backgroundColor: '#222',
};

// Interface for wallet data
interface Wallet {
  publicKey: string;
  secretKey: string;
  balance: string;
  lastUpdated: number; // timestamp
}

export default function StellarDemo() {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [destPublicKey, setDestPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [createBtnHover, setCreateBtnHover] = useState(false);
  const [sendBtnHover, setSendBtnHover] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number | null>(null);

  // Load wallets from localStorage on component mount
  useEffect(() => {
    const storedWallets = localStorage.getItem('stellar_wallets');
    if (storedWallets) {
      try {
        const parsedWallets = JSON.parse(storedWallets);
        setWallets(parsedWallets);
      } catch (err) {
        console.error('Error parsing stored wallets:', err);
      }
    }
  }, []);

  // Update localStorage whenever wallets change
  useEffect(() => {
    localStorage.setItem('stellar_wallets', JSON.stringify(wallets));
  }, [wallets]);

  // Update all wallet balances periodically or after transactions
  const updateAllWalletBalances = async () => {
    if (wallets.length === 0) return;

    const updatedWallets = [...wallets];
    let hasUpdates = false;

    for (let i = 0; i < updatedWallets.length; i++) {
      const wallet = updatedWallets[i];
      try {
        const balance = await fetchBalanceForKey(wallet.publicKey);
        
        // Only update if balance changed
        if (balance !== wallet.balance) {
          updatedWallets[i] = {
            ...wallet,
            balance,
            lastUpdated: Date.now()
          };
          hasUpdates = true;
        }
      } catch (err) {
        console.error(`Error updating balance for wallet ${wallet.publicKey}:`, err);
      }
    }

    if (hasUpdates) {
      setWallets(updatedWallets);
    }
  };

  // Set up automatic balance refresh after transactions
  useEffect(() => {
    // Update all balances whenever the current wallet's balance changes
    if (balance !== null) {
      updateAllWalletBalances();
    }
  }, [balance]);

  // Call API route to create account
  async function handleCreateAccount() {
    setStatus('Creating account...');
    try {
      const res = await fetch('/api/stellar/createAccount');
      const account = await res.json();
      if (res.ok) {
        const newPublicKey = account.publicKey;
        const newSecretKey = account.secretKey;
        
        setPublicKey(newPublicKey);
        setSecretKey(newSecretKey);

        // Fetch balance after creation
        const newBalance = await fetchBalanceForKey(newPublicKey);
        setBalance(newBalance);
        
        // Add to wallets list
        const newWallet: Wallet = {
          publicKey: newPublicKey,
          secretKey: newSecretKey,
          balance: newBalance,
          lastUpdated: Date.now()
        };
        
        const updatedWallets = [...wallets, newWallet];
        setWallets(updatedWallets);
        setSelectedWalletIndex(updatedWallets.length - 1);
        
        setStatus('Account created and funded on testnet!');
      } else {
        setStatus(account.error || 'Failed to create account');
      }
    } catch (err) {
      setStatus('Failed to create account');
      console.error(err);
    }
  }

  // Helper function to fetch balance for a given public key
  async function fetchBalanceForKey(pubKey: string): Promise<string> {
    try {
      const res = await fetch(`/api/stellar/getAccountBalance?publicKey=${encodeURIComponent(pubKey)}`);
      const balances = await res.json();
      if (res.ok) {
        const xlmBalance = balances.find((b: { asset: string; balance: string }) => b.asset === 'XLM');
        return xlmBalance ? xlmBalance.balance : '0';
      } else {
        return '0';
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      return '0';
    }
  }

  // Call API route to get balance for current wallet
  async function fetchBalance(pubKey: string) {
    const balance = await fetchBalanceForKey(pubKey);
    setBalance(balance);
    
    // Also update the wallet in our list
    if (selectedWalletIndex !== null) {
      const updatedWallets = [...wallets];
      updatedWallets[selectedWalletIndex] = {
        ...updatedWallets[selectedWalletIndex],
        balance,
        lastUpdated: Date.now()
      };
      setWallets(updatedWallets);
    }
  }

  // Call API route to send payment
  async function handleSendPayment() {
    if (!secretKey || !destPublicKey || !amount) {
      setStatus('Please fill all fields');
      return;
    }

    setStatus('Sending payment...');
    try {
      const res = await fetch('/api/stellar/sendPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderSecretKey: secretKey,
          destinationPublicKey: destPublicKey,
          amount,
          asset: 'XLM',
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setStatus('Payment sent! Updating balances...');
        
        // Update sender's balance
        await fetchBalance(publicKey);
        
        // Check if destination is one of our wallets and update all balances
        await updateAllWalletBalances();
      } else {
        setStatus(result.error || 'Payment failed');
      }
    } catch (err) {
      setStatus('Payment failed');
      console.error(err);
    }
  }

  // Function to select a wallet from the list
  function selectWallet(index: number) {
    const wallet = wallets[index];
    setPublicKey(wallet.publicKey);
    setSecretKey(wallet.secretKey);
    setBalance(wallet.balance);
    setSelectedWalletIndex(index);
  }

  // Format the address for display (truncate the middle)
  function formatAddress(address: string): string {
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  }

  return (
    <div style={{ 
      display: 'flex', 
      maxWidth: '100%', 
      margin: 'auto', 
      padding: 20, 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#000',
      color: 'white',
      minHeight: '100vh'
    }}>
      {/* Wallet List Sidebar */}
      <div style={{ width: '30%', paddingRight: 20 }}>
        <h2 style={{ marginTop: 0, color: 'white' }}>My Wallets</h2>
        
        {wallets.length === 0 ? (
          <p style={{ color: '#999' }}>No wallets yet. Create your first wallet to get started!</p>
        ) : (
          <div style={walletListStyle}>
            {wallets.map((wallet, index) => (
              <div 
                key={wallet.publicKey}
                style={{
                  ...walletItemStyle,
                  ...(selectedWalletIndex === index ? activeWalletStyle : {})
                }}
                onClick={() => selectWallet(index)}
              >
                <div style={{ fontWeight: 'bold', color: '#fff' }}>Wallet {index + 1}</div>
                <div style={{ fontSize: 14, marginTop: 4, color: '#ccc' }}>{formatAddress(wallet.publicKey)}</div>
                <div style={{ fontSize: 14, color: '#2d89ef', marginTop: 4 }}>
                  {wallet.balance} XLM
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          style={createBtnHover ? { ...buttonStyle, ...buttonHoverStyle, width: '100%' } : { ...buttonStyle, width: '100%' }}
          onMouseEnter={() => setCreateBtnHover(true)}
          onMouseLeave={() => setCreateBtnHover(false)}
          onClick={handleCreateAccount}
        >
          Create New Wallet
        </button>
      </div>
      
      {/* Main Content */}
      <div style={{ width: '70%' }}>
        <h1 style={{ textAlign: 'center', color: 'white' }}>Stellar Testnet Demo</h1>

        {publicKey && (
          <div style={{ backgroundColor: '#111', padding: 15, borderRadius: 8, marginBottom: 20, border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'white' }}>Active Wallet</h3>
            <p><strong style={{ color: '#999' }}>Public Key:</strong> <code style={{ wordBreak: 'break-all', color: 'white' }}>{publicKey}</code></p>
            <p><strong style={{ color: '#999' }}>Secret Key:</strong> <code style={{ wordBreak: 'break-all', color: 'white' }}>{secretKey}</code></p>
            <p><strong style={{ color: '#999' }}>Balance:</strong> <span style={{ color: '#2d89ef' }}>{balance ?? 'Loading...'} XLM</span></p>
          </div>
        )}

        <hr style={{ margin: '24px 0', borderColor: '#333', borderWidth: '1px' }} />

        <h3 style={{ color: 'white' }}>Send XLM Payment</h3>
        <input
          type="text"
          placeholder="Destination Public Key"
          value={destPublicKey}
          onChange={e => setDestPublicKey(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Amount (XLM)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={inputStyle}
        />
        <button
          style={sendBtnHover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setSendBtnHover(true)}
          onMouseLeave={() => setSendBtnHover(false)}
          onClick={handleSendPayment}
          disabled={!publicKey}
        >
          Send Payment
        </button>

        <p style={{ 
          marginTop: 16, 
          color: status.includes('failed') ? 'red' : '#2d89ef',
          backgroundColor: status ? '#111' : 'transparent',
          padding: status ? '10px' : '0',
          borderRadius: status ? '4px' : '0',
          border: status ? '1px solid #333' : 'none'
        }}>{status}</p>
      </div>
    </div>
  );
}