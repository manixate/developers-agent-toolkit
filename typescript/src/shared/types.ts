import { z } from 'zod';

export interface Tool {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any>;
  execute: (params: any) => Promise<string>;
}

export interface ToolContext {
  serviceId?: string;
  apiSpecificationPath?: string;
}
