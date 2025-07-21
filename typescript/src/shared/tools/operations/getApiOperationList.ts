import { z } from 'zod';
import { Tool, ToolContext } from '@/shared/types';
import api from '@/shared/api';

const getDescription = (context: ToolContext): string => {
  const baseDescription = `Provides a summary of all API operations for a specific Mastercard API 
specification including HTTP methods, request paths, titles, and descriptions.`;

  if (context.apiSpecificationPath) {
    return `${baseDescription}

Uses the configured API specification: ${context.apiSpecificationPath}`;
  }

  return `${baseDescription}

It takes one argument:
- apiSpecificationPath (str): The path to the API specification file e.g., '/open-banking-us/swagger/openbanking-us.yaml')`;
};

export const getParameters = (context: ToolContext): z.ZodObject<any> => {
  if (context.apiSpecificationPath) {
    return z.object({});
  }

  return z.object({
    apiSpecificationPath: z
      .string()
      .describe(
        'The path to the API specification file (e.g., /open-banking-us/swagger/openbanking-us.yaml)'
      ),
  });
};

export const execute = async (
  context: ToolContext,
  params: z.infer<ReturnType<typeof getParameters>>
): Promise<string> => {
  if (context.apiSpecificationPath) {
    return await api.getApiOperations(context.apiSpecificationPath);
  } else {
    return await api.getApiOperations(params.apiSpecificationPath);
  }
};

export const getApiOperationList = (context: ToolContext): Tool => ({
  method: 'get-api-operation-list',
  name: 'Get API Operation List',
  description: getDescription(context),
  parameters: getParameters(context),
  execute: (params) => execute(context, params),
});
