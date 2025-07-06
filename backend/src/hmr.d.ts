declare module NodeJS {
    interface Module {
      hot?: {
        accept(callback?: () => void): void;
        dispose(callback: (data: any) => void): void;
      };
    }
  }
  
