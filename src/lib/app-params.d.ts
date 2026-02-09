declare module '@/lib/app-params' {
  export const appParams: {
    appId: string | null;
    token: string | null;
    fromUrl: string | null;
    functionsVersion: string | null;
    appBaseUrl: string | null;
  };
}
