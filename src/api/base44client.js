// Base44 SDK removed — provide a minimal stub to avoid accidental usage during migration.
// Replace calls with the new backend services in `src/api/services`.

export const base44 = {
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
  },
  entities: {},
  appLogs: { logUserInApp: async () => {} },
};
