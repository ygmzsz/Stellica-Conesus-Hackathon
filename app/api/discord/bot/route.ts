import { NextResponse } from 'next/server';
import { createWallet, getPublicKey, transferTokens } from '@/lib/wallet-services';
import { verifyDiscordRequest } from '@/lib/discord-utils';

interface WalletCommandParams {
    walletAddress?: string;
    from?: string;
    to?: string;
    amount?: string;
}

interface BotCommand {
    command: 'create-wallet' | 'get-public-key' | 'transfer';
    params: WalletCommandParams;
}

export async function POST(req: Request) {
    try {
        const supabase = createClientComponentClient();
        const { data: discordBot } = await supabase
            .from('discord_bots')
            .select('bot_token, application_id')
            .single();

        if (!discordBot) {
            return NextResponse.json({ 
                error: true,
                message: 'Bot configuration not found'
            }, { status: 401 });
        }

        // Verify the request signature using Discord's public key
        const signature = req.headers.get('x-signature-ed25519');
        const timestamp = req.headers.get('x-signature-timestamp');
        
        if (!signature || !timestamp) {
            return NextResponse.json({ 
                error: true,
                message: 'Missing authentication headers'
            }, { status: 401 });
        }

        const isValid = await verifyDiscordRequest({
            publicKey: discordBot.application_id,
            signature,
            timestamp,
            rawBody: await req.text()
        });

        if (!isValid) {
            return NextResponse.json({ 
                error: true,
                message: 'Invalid request signature'
            }, { status: 401 });
        }

        const { command, params } = await req.json() as BotCommand;

        switch (command) {
            case 'create-wallet':
                try {
                    const newWallet = await createWallet();
                    return NextResponse.json({
                        success: true,
                        message: '🎉 New wallet created!',
                        address: newWallet.address
                    });
                } catch (error) {
                    throw new Error('Failed to create wallet');
                }

            case 'get-public-key':
                if (!params.walletAddress) {
                    return NextResponse.json({
                        error: true,
                        message: '⚠️ Wallet address is required'
                    }, { status: 400 });
                }

                try {
                    const publicKey = await getPublicKey(params.walletAddress);
                    return NextResponse.json({
                        success: true,
                        message: '🔑 Public key retrieved',
                        publicKey,
                        address: params.walletAddress
                    });
                } catch (error) {
                    throw new Error(`Failed to get public key for ${params.walletAddress}`);
                }

            case 'transfer':
                if (!params.from || !params.to || !params.amount) {
                    return NextResponse.json({
                        error: true,
                        message: '⚠️ Missing required parameters: from, to, amount'
                    }, { status: 400 });
                }

                try {
                    const transaction = await transferTokens(params.from, params.to, params.amount);
                    return NextResponse.json({
                        success: true,
                        message: '💸 Transfer complete!',
                        transactionId: transaction.id,
                        details: {
                            from: params.from,
                            to: params.to,
                            amount: params.amount
                        }
                    });
                } catch (error) {
                    throw new Error('Transfer failed');
                }

            default:
                return NextResponse.json({
                    error: true,
                    message: '❌ Invalid command',
                    availableCommands: ['create-wallet', 'get-public-key', 'transfer']
                }, { status: 400 });
        }
    } catch (error) {
        console.error('Bot command error:', error);
        return NextResponse.json({
            error: true,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }, { status: 500 });
    }
}