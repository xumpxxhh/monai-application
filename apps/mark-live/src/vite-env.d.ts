/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_BASE_URL: string;
  readonly VITE_MARK_LIVE_API_BASE_URL: string;
  readonly VITE_APP_MARK_LIVE_NAME: string;
  readonly VITE_APP_MARK_LIVE_BASE_PATH?: string;
  readonly VITE_AUTH_API_REDIRECT_URI_SESSION_NAME: string;
  readonly VITE_AUTH_API_CODE_VERIFIER_SESSION_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
