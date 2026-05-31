/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_NAME: string;
  readonly VITE_STORE_TAGLINE: string;
  readonly VITE_OWNER_NAME: string;
  readonly VITE_STORE_LOCATION: string;

  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_PHONE_DISPLAY: string;
  readonly VITE_STORE_EMAIL: string;

  readonly VITE_ADMIN_EMAIL: string;
  readonly VITE_ADMIN_PASSWORD: string;

  readonly VITE_DEV_NAME: string;
  readonly VITE_DEV_EMAIL: string;
  readonly VITE_DEV_PHONE: string;
  readonly VITE_DEV_TAGLINE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
