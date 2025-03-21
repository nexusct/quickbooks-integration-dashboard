import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickBooksContext } from '../../contexts/QuickBooksContext';

const AuthenticationSetup = () => {
  const { auth, updateAuth, saveAuthInfo, generateAuthUrl, refreshToken } = useContext(QuickBooksContext);
  const [localAuth, setLocalAuth] = useState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Update local state when context changes
  useEffect(() => {
    setLocalAuth(auth);
  }, [auth]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalAuth((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle saving authentication information
  const handleSaveAuthInfo = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Update the context with local changes
      updateAuth(localAuth);
      
      const result = await saveAuthInfo();
      
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Error saving authentication: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle generating authorization URL
  const handleGenerateAuthUrl = () => {
    setError(null);
    setSuccessMessage(null);
    
    const result = generateAuthUrl();
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 8000);
    } else {
      setError(result.message);
    }
  };

  // Handle token refresh
  const handleRefreshToken = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await refreshToken();
      
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Error refreshing token: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle continue to operations
  const handleContinueToOperations = () => {
    navigate('/operations');
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">OAuth 2.0 Authentication Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
            <input
              type="text"
              name="clientId"
              value={localAuth.clientId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
            <input
              type="password"
              name="clientSecret"
              value={localAuth.clientSecret}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
            <input
              type="text"
              name="redirectUri"
              value={localAuth.redirectUri}
              onChange={handleChange}
              placeholder="https://yourdomain.com/callback"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <select
              name="environment"
              value={localAuth.environment}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Realm ID (Company ID)</label>
            <input
              type="text"
              name="realmId"
              value={localAuth.realmId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        <h2 className="text-xl font-bold mb-4">OAuth 2.0 Tokens</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
            <textarea
              name="accessToken"
              value={localAuth.accessToken}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Token</label>
            <textarea
              name="refreshToken"
              value={localAuth.refreshToken}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4 col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Token Expiry Date</label>
            <input
              type="text"
              name="tokenExpiryDate"
              value={localAuth.tokenExpiryDate}
              onChange={handleChange}
              placeholder="YYYY-MM-DDTHH:MM:SSZ"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          <button 
            onClick={handleSaveAuthInfo}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {isLoading ? 'Saving...' : 'Save Authentication Info'}
          </button>
          
          <button 
            onClick={handleGenerateAuthUrl}
            disabled={isLoading || !localAuth.clientId || !localAuth.redirectUri}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded"
          >
            Start OAuth Flow
          </button>
          
          <button 
            onClick={handleRefreshToken}
            disabled={isLoading || !localAuth.refreshToken}
            className="flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 py-2 px-4 rounded"
          >
            Refresh Token
          </button>
          
          {localAuth.isAuthenticated && (
            <button 
              onClick={handleContinueToOperations}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ml-auto"
            >
              Continue to Operations
            </button>
          )}
        </div>
        
        {localAuth.isAuthenticated && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-800 p-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Authentication Status: Authenticated
          </div>
        )}
        
        {successMessage && (
          <div className="mt-4 bg-green-50 text-green-800 p-4 rounded">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mt-4 bg-red-50 text-red-800 p-4 rounded">
            {error}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
        <h3 className="font-bold mb-2">Authentication Process Overview</h3>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-600">
          <li>Enter your application's Client ID and Client Secret from the Intuit Developer Portal</li>
          <li>Configure a valid Redirect URI that matches what you set in the Developer Portal</li>
          <li>Click "Start OAuth Flow" to begin the authorization process</li>
          <li>After authorization, enter the tokens you receive</li>
          <li>Save your authentication information</li>
          <li>Use "Refresh Token" when your access token expires</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthenticationSetup;
