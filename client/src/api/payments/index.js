const API_BASE_URL = '/api';

// Helper function to get CSRF token
const getCsrfToken = async () => {
  const response = await fetch('/csrf', {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to get CSRF token');
  }
  
  const data = await response.json();
  return data.csrfToken;
};

// Get all payments for current user
export const getPayments = async () => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch payments' }));
    throw new Error(errorData.error || 'Failed to fetch payments');
  }
  
  return response.json();
};

// Create a new payment
export const createPayment = async (paymentData) => {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(paymentData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to create payment' }));
    
    // Handle validation errors array
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessage = errorData.errors.join('. ');
      throw new Error(errorMessage);
    }
    
    // Handle single error message
    throw new Error(errorData.error || 'Failed to create payment');
  }
  
  return response.json();
};

// Get payment by ID
export const getPaymentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch payment' }));
    throw new Error(error.error || 'Failed to fetch payment');
  }
  
  return response.json();
};

// Send payment via SWIFT
export const sendPaymentSwift = async (id) => {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${API_BASE_URL}/paymments/send-payment/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to send payment' }));
    throw new Error(error.error || 'Failed to send payment');
  }
  
  return response.json();
};

// Get current user session info
export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch user info' }));
    throw new Error(error.error || 'Failed to fetch user info');
  }
  
  return response.json();
};
