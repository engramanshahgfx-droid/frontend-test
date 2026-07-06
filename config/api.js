/**
 * Centralized API configuration
 * This file should be the single source of truth for all API endpoints
 */

export const getApiUrl = () => {
  // Use environment variable if available
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For client-side, detect from current URL
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol; // https: or http:
    const hostname = window.location.hostname; // test.tilalr.com or localhost
    const port = window.location.port ? ':' + window.location.port : '';
    
    // Don't include port for standard ports (80 for http, 443 for https)
    const portStr = (protocol === 'https:' && port === ':443') || 
                    (protocol === 'http:' && port === ':80') ? '' : port;
    
    // Backend is on same domain on port 8000 locally, or just /api on production
    const backendHost = hostname === 'localhost' 
      ? `${protocol}//${hostname}:8000/api`
      : `${protocol}//${hostname}/api`;
    
    return backendHost;
  }
  
  // Server-side default
  return 'http://localhost:8000/api';
};

export const API_URL = getApiUrl();

export default {
  API_URL,
  getApiUrl,
};
