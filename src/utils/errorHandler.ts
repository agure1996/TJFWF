// src/utils/errorHandler.ts

/**
 * Parse backend error and return user-friendly message
 * Works seamlessly with your toastHelper - no emojis needed since toast handles styling
 */
export function parseBackendError(error: any): string {
  // Handle Axios errors
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Extract message from various response formats
    const message = 
      data?.message || 
      data?.error || 
      data?.errors?.[0]?.message ||
      data?.msg ||
      'An error occurred';

    // Stock-specific errors - make them more user-friendly
    if (message.includes('Insufficient stock')) {
      const match = message.match(/variant: (.+?)(?:\s|$)/);
      const sku = match ? match[1] : 'selected product';
      return `Not enough stock for ${sku}. Please reduce quantity or restock.`;
    }

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        // Return validation messages as-is (they're usually clear)
        return message;
        
      case 404:
        if (message.includes('not found')) {
          return message;
        }
        return 'The requested item could not be found.';
        
      case 409:
        return message; // Conflict messages are usually clear
        
      case 500:
        return `Server error: ${message}. Please try again later.`;
        
      default:
        return message;
    }
  }

  // Handle network errors
  if (error?.request && !error?.response) {
    return 'Network error: Unable to reach the server. Please check your connection.';
  }

  // Handle other errors
  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Enhanced error object with detailed categorization
 * Useful if you want to handle different error types differently in the UI
 */
export interface ParsedError {
  userMessage: string;
  technicalMessage: string;
  status?: number;
  type: 'stock' | 'validation' | 'not_found' | 'conflict' | 'server' | 'network' | 'unknown';
}

/**
 * Parse error with detailed categorization
 * Use this when you need to know the error type for different handling
 */
export function parseDetailedError(error: any): ParsedError {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = 
    data?.message || 
    data?.error || 
    data?.errors?.[0]?.message ||
    data?.msg ||
    error?.message ||
    'Unknown error';

  // Stock errors
  if (message.includes('Insufficient stock') || message.includes('out of stock')) {
    const match = message.match(/variant: (.+?)(?:\s|$)/);
    const sku = match ? match[1] : 'selected product';
    return {
      userMessage: `Not enough stock for ${sku}. Please reduce quantity or restock.`,
      technicalMessage: message,
      status,
      type: 'stock',
    };
  }

  // Validation errors
  if (status === 400) {
    return {
      userMessage: message,
      technicalMessage: message,
      status,
      type: 'validation',
    };
  }

  // Not found errors
  if (status === 404 || message.includes('not found')) {
    return {
      userMessage: message.includes('not found') ? message : 'The requested item could not be found.',
      technicalMessage: message,
      status,
      type: 'not_found',
    };
  }

  // Conflict errors (e.g., duplicate entries)
  if (status === 409 || message.includes('already exists')) {
    return {
      userMessage: message,
      technicalMessage: message,
      status,
      type: 'conflict',
    };
  }

  // Server errors
  if (status && status >= 500) {
    return {
      userMessage: 'Server error occurred. Please try again later.',
      technicalMessage: message,
      status,
      type: 'server',
    };
  }

  // Network errors
  if (error?.request && !error?.response) {
    return {
      userMessage: 'Unable to reach the server. Please check your connection.',
      technicalMessage: 'Network error',
      status: 0,
      type: 'network',
    };
  }

  // Unknown errors
  return {
    userMessage: message || 'An unexpected error occurred.',
    technicalMessage: message || 'Unknown error',
    status,
    type: 'unknown',
  };
}