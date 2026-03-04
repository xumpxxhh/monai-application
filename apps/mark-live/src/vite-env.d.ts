/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_BASE_URL: string;
  readonly VITE_MARK_LIVE_API_BASE_URL: string;
  readonly VITE_APP_MARK_LIVE_NAME: string;
  readonly VITE_APP_MARK_LIVE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
