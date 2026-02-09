import client from '@/api/springBootClient';

export const authService = {
  me: () => client.get('/auth/me'),
  // Logout handled by clearing tokens on the client and redirecting
};
