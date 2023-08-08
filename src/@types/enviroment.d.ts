export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_KEY: string;
      LOCAL_HOST: string
    }
  }
}
