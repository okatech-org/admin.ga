declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }

  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}

// Augment react-hook-form types
declare module 'react-hook-form' {
  interface FieldError {
    message?: string | React.ReactNode;
  }
}

// Augment chart types
declare module 'recharts' {
  interface TooltipProps {
    payload?: any[];
    label?: any;
    active?: boolean;
  }
  
  interface LegendProps {
    payload?: any[];
    verticalAlign?: string;
  }
}

export {}; 