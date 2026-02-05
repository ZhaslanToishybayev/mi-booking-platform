/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Добавь здесь другие переменные окружения, если они будут использоваться в фронтенде
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
