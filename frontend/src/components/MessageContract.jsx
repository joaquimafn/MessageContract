import React, { useState } from 'react';
import { useMessageContract } from '../hooks/useMessageContract';

const MessageContract = () => {
    const { account, message, loading, error, connectWallet, disconnectWallet, updateMessage } = useMessageContract();
    const [newMessage, setNewMessage] = useState('');
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMessage(newMessage);
            showNotification('success', 'Message updated successfully.');
            console.log('Message updated successfully.', message, newMessage);
        } catch (err) {
            showNotification('error', `Transaction failed: ${err.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Message Contract</h1>

                {/* Notification */}
                {notification.show && (
                    <div className={`mb-4 p-4 rounded ${notification.type === 'success'
                        ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
                        : 'bg-red-100 border-l-4 border-red-500 text-red-700'
                        }`} role="alert">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {notification.type === 'success' ? (
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{notification.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wallet Connection */}
                {!account ? (
                    <button
                        onClick={connectWallet}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Connected Wallet:</p>
                                <p className="font-mono text-sm">{account}</p>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message Display */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Current Message:</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        {message || 'No message available'}
                    </div>
                </div>

                {/* Message Update Form */}
                {account && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="newMessage" className="block text-sm font-medium text-gray-700 mb-2">
                                New Message:
                            </label>
                            <input
                                type="text"
                                id="newMessage"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newMessage.trim()}
                            className={`w-full px-4 py-2 rounded text-white ${loading || !newMessage.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                                } transition-colors`}
                        >
                            {loading ? 'Transaction pending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MessageContract; 