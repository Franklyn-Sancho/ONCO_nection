export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_KEY: string;
      SECRET_KEY: string;
    }
  }
}
