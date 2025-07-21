import { z } from 'zod';
import { Tool, ToolContext } from '@/shared/types';
import api from '@/shared/api';

const getDescription = (_context: ToolContext): string => {
  return `Retrieves the comprehensive OAuth 1.0a integration guide including step-by-step instructions,
code examples, and best practices for Mastercard APIs.`;
};

export const getParameters = (_context: ToolContext): z.ZodObject<any> => {
  return z.object({});
};

export const execute = async (
  _context: ToolContext,
  _params: z.infer<ReturnType<typeof getParameters>>
): Promise<string> => {
  return await api.getDocumentationPage(
    '/platform/documentation/authentication/using-oauth-1a-to-access-mastercard-apis/index.md'
  );
};

export const getOAuth10aGuide = (context: ToolContext): Tool => ({
  method: 'get-oauth10a-integration-guide',
  name: 'Get OAuth 1.0a Integration Guide',
  description: getDescription(context),
  parameters: getParameters(context),
  execute: (params) => execute(context, params),
});
