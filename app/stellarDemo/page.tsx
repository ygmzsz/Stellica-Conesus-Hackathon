"use client";

import React, { useState } from 'react';

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
  border: '1.5px solid #ccc',
  fontSize: 16,
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.3s ease',
};


export default function StellarDemo() {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [destPublicKey, setDestPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [createBtnHover, setCreateBtnHover] = useState(false);
  const [sendBtnHover, setSendBtnHover] = useState(false);

  // Call API route to create account
  async function handleCreateAccount() {
    setStatus('Creating account...');
    try {
      const res = await fetch('/api/stellar/createAccount');
      const account = await res.json();
      if (res.ok) {
        setPublicKey(account.publicKey);
        setSecretKey(account.secretKey);

        // Fetch balance after creation
        await fetchBalance(account.publicKey);
        setStatus('Account created and funded on testnet!');
      } else {
        setStatus(account.error || 'Failed to create account');
      }
    } catch (err) {
      setStatus('Failed to create account');
      console.error(err);
    }
  }

  // Call API route to get balance
  async function fetchBalance(pubKey: string) {
    try {
      const res = await fetch(`/api/stellar/getAccountBalance?publicKey=${encodeURIComponent(pubKey)}`);
      const balances = await res.json();
      if (res.ok) {
        const xlmBalance = balances.find((b: { asset: string; balance: string }) => b.asset === 'XLM');
        setBalance(xlmBalance ? xlmBalance.balance : '0');
      } else {
        setBalance('0');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance('0');
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
        setStatus('Payment sent! Updating balance...');
        await fetchBalance(publicKey);
      } else {
        setStatus(result.error || 'Payment failed');
      }
    } catch (err) {
      setStatus('Payment failed');
      console.error(err);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Stellar Testnet Demo</h1>

      <button
        style={createBtnHover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onMouseEnter={() => setCreateBtnHover(true)}
        onMouseLeave={() => setCreateBtnHover(false)}
        onClick={handleCreateAccount}
      >
        Create New Account (Testnet)
      </button>

      {publicKey && (
        <>
          <h3>Your Account</h3>
          <p><strong>Public Key:</strong> <code style={{ wordBreak: 'break-all' }}>{publicKey}</code></p>
          <p><strong>Secret Key:</strong> <code style={{ wordBreak: 'break-all' }}>{secretKey}</code></p>
          <p><strong>Balance:</strong> {balance ?? 'Loading...'} XLM</p>
        </>
      )}

      <hr style={{ margin: '24px 0' }} />

      <h3>Send XLM Payment</h3>
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
      >
        Send Payment
      </button>

      <p style={{ marginTop: 16, color: status.includes('failed') ? 'red' : 'blue' }}>{status}</p>
    </div>
  );
}
