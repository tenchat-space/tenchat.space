/// <reference types="vite/client" />

// Environment Variables
interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_AUTH_SUBDOMAIN: string;
  readonly VITE_DOMAIN: string;
  readonly VITE_WEB3_FUNCTION_ID: string;
  readonly VITE_DATABASE_MAIN: string;
  readonly VITE_DATABASE_SOCIAL: string;
  readonly VITE_DATABASE_WEB3: string;
  readonly VITE_DATABASE_CONTENT: string;
  readonly VITE_DATABASE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

