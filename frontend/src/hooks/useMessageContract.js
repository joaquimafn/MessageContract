import { useState, useEffect, useCallback } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import MessageContractABI from '../contracts/MessageContract.json';

const EXPECTED_CHAIN_ID = '31337'; // Local testnet - adjust as needed
const CONTRACT_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'; // Updated contract address

export function useMessageContract() {
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contract, setContract] = useState(null);

    const handleError = (err) => {
        console.error('Contract error:', err);

        // Handle specific error cases
        if (err.code === 'UNSUPPORTED_OPERATION') {
            return 'No wallet detected. Please install MetaMask.';
        }

        if (err.code === 'NETWORK_ERROR') {
            return 'Network error. Please check your connection.';
        }

        if (err.code === 'INSUFFICIENT_FUNDS') {
            return 'Insufficient funds for gas. Please add more ETH to your wallet.';
        }

        if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
            return 'Transaction would fail. Please check your input and try again.';
        }

        if (err.code === 'ACTION_REJECTED') {
            return 'Transaction rejected. Please check your input or change to wallet.';
        }

        if (err.code === 'UNKNOWN_ERROR') {
            return 'Transaction rejected. Please check your input or change to wallet.';
        }
    };

    const checkNetwork = async (provider) => {
        const network = await provider.getNetwork();
        if (network.chainId.toString() !== EXPECTED_CHAIN_ID) {
            throw new Error(`Please connect to ${network.name} network.`);
        }
    };

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum === 'undefined') {
            setError('MetaMask not found. Please install MetaMask.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const provider = new BrowserProvider(window.ethereum);
            // Check if we're on the correct network
            await checkNetwork(provider);

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);

            // Initialize contract
            const contractAddress = CONTRACT_ADDRESS;
            if (!contractAddress) {
                throw new Error('Contract address not configured');
            }

            const messageContract = new Contract(
                contractAddress,
                MessageContractABI.abi,
                signer
            );
            setContract(messageContract);

            // Get initial message
            try {
                const currentMessage = await messageContract.getMessage();
                setMessage(currentMessage);
            } catch (err) {
                setError('Failed to fetch initial message: ' + err.message);
            }
        } catch (err) {
            console.error('Error in connectWallet:', err);
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMessage = useCallback(async (newMessage) => {
        if (!contract) {
            setError('Contract not initialized. Please connect your wallet first.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const tx = await contract.setMessage(newMessage);
            await tx.wait();

            const updatedMessage = await contract.getMessage();
            setMessage(updatedMessage);
        } catch (err) {
            setError(handleError(err));
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setContract(null);
        setMessage('');
        setError(null);
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (accounts) => {
                setAccount(accounts[0] || null);
            };

            const handleChainChanged = () => {
                window.location.reload();
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    useEffect(() => {
        if (!contract) return;

        const handleMessageUpdated = async (newMessage, sender) => {
            console.log('MessageUpdated event received:', { newMessage, sender });
            try {
                const currentMessage = await contract.getMessage();
                setMessage(currentMessage);
            } catch (err) {
                console.error('Error fetching message after event:', err);
            }
        };

        contract.on('MessageUpdated', handleMessageUpdated);

        return () => {
            contract.removeAllListeners('MessageUpdated');
        };
    }, [contract]);

    return {
        account,
        message,
        loading,
        error,
        connectWallet,
        disconnectWallet,
        updateMessage
    };
} 