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

// Get all users
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
};

// Get user by email
export const getUserByEmail = async (email) => {
  const response = await fetch(`${API_BASE_URL}/users/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
};

// Create/Register a new user
export const createUser = async (userData) => {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to create user' }));
    
    // Handle validation errors array
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessage = errorData.errors.join('. ');
      throw new Error(errorMessage);
    }
    
    // Handle single error message
    throw new Error(errorData.error || 'Failed to create user');
  }
  
  return response.json();
};

// Login user
export const loginUser = async (credentials) => {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to login' }));
    
    // Handle validation errors array
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessage = errorData.errors.join('. ');
      throw new Error(errorMessage);
    }
    
    // Handle single error message
    throw new Error(errorData.error || 'Failed to login');
  }
  
  return response.json();
};

// Logout user
export const logoutUser = async () => {
  const csrfToken = await getCsrfToken();
  
  const response = await fetch(`${API_BASE_URL}/users/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to logout' }));
    
    // Handle validation errors array
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessage = errorData.errors.join('. ');
      throw new Error(errorMessage);
    }
    
    // Handle single error message
    throw new Error(errorData.error || 'Failed to logout');
  }
  
  return response.json();
};
