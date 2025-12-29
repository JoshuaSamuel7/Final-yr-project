import { ethers } from 'ethers';

/**
 * Wallet utility functions for MetaMask integration
 */

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

/**
 * Get the currently connected account from MetaMask
 */
export const getConnectedAccount = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (err) {
    console.error('Error getting connected account:', err);
    return null;
  }
};

/**
 * Get wallet balance in ETH
 */
export const getWalletBalance = async (address) => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (err) {
    console.error('Error getting wallet balance:', err);
    return '0';
  }
};

/**
 * Get current network information
 */
export const getCurrentNetwork = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId,
      chainIdHex: '0x' + network.chainId.toString(16)
    };
  } catch (err) {
    console.error('Error getting network:', err);
    return null;
  }
};

/**
 * Request network switch (adds network if not present)
 */
export const switchNetwork = async (chainId) => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    const chainIdHex = '0x' + chainId.toString(16);
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (err) {
    if (err.code === 4902) {
      console.log('Chain not found in MetaMask. User needs to add it manually.');
      return false;
    }
    console.error('Error switching network:', err);
    return false;
  }
};

/**
 * Request to add a new network to MetaMask
 */
export const addNetwork = async (networkParams) => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
    return true;
  } catch (err) {
    console.error('Error adding network:', err);
    return false;
  }
};

/**
 * Format address for display (0x1234...5678)
 */
export const formatAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
};

/**
 * Validate if a string is a valid Ethereum address
 */
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Get provider and signer from MetaMask
 */
export const getProviderAndSigner = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  } catch (err) {
    console.error('Error getting provider and signer:', err);
    return null;
  }
};

/**
 * Request signature from user (for authentication)
 */
export const requestSignature = async (message) => {
  try {
    const { signer } = await getProviderAndSigner();
    if (!signer) throw new Error('Could not get signer');
    
    const signature = await signer.signMessage(message);
    return signature;
  } catch (err) {
    console.error('Error requesting signature:', err);
    throw err;
  }
};

/**
 * Watch for wallet and network changes
 */
export const watchWalletChanges = (onAccountChange, onChainChange, onDisconnect) => {
  if (!isMetaMaskInstalled()) {
    console.warn('MetaMask not installed, cannot watch for changes');
    return () => {};
  }

  const handleAccountsChanged = (accounts) => {
    onAccountChange?.(accounts.length > 0 ? accounts[0] : null);
  };

  const handleChainChanged = (chainId) => {
    onChainChange?.(chainId);
  };

  const handleDisconnect = (error) => {
    onDisconnect?.(error);
  };

  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('chainChanged', handleChainChanged);
  window.ethereum.on('disconnect', handleDisconnect);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
    window.ethereum.removeListener('disconnect', handleDisconnect);
  };
};

export default {
  isMetaMaskInstalled,
  getConnectedAccount,
  getWalletBalance,
  getCurrentNetwork,
  switchNetwork,
  addNetwork,
  formatAddress,
  isValidAddress,
  getProviderAndSigner,
  requestSignature,
  watchWalletChanges,
};
