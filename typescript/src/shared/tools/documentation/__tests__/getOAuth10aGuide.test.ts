import {
  execute,
  getParameters,
} from '@/shared/tools/documentation/getOAuth10aGuide';
import api from '@/shared/api';
import fetch from 'node-fetch';

jest.mock<typeof api>('@/shared/api');
jest.mock('node-fetch');

const mockApi = api as jest.Mocked<typeof api>;
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get generic OAuth 1.0a integration guide and return it when no language is specified', async () => {
    const mockResult = 'mock OAuth 1.0a guide content';
    mockApi.getDocumentationPage.mockResolvedValue(mockResult);

    const result = await execute({}, {});

    expect(mockApi.getDocumentationPage).toHaveBeenCalledWith(
      '/platform/documentation/authentication/using-oauth-1a-to-access-mastercard-apis/index.md'
    );
    expect(result).toBe(mockResult);
  });

  it.each([
    ['java', 'oauth1-signer-java'],
    ['kotlin', 'oauth1-signer-java'],
    ['c#', 'oauth1-signer-csharp'],
    ['python', 'oauth1-signer-python'],
    ['javascript', 'oauth1-signer-nodejs'],
    ['typescript', 'oauth1-signer-nodejs'],
    ['golang', 'oauth1-signer-golang'],
  ])(
    'should get OAuth 1.0a integration guide with %s language from GitHub',
    async (language, expectedRepo) => {
      const mockGithubContent = `mock OAuth 1.0a guide content with ${language} examples from GitHub`;
      mockFetch.mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue(mockGithubContent),
      } as any);

      const result = await execute({}, { language: language as any });

      expect(mockFetch).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/Mastercard/${expectedRepo}/refs/heads/main/README.md`
      );
      expect(result).toBe(mockGithubContent);
    }
  );

  it('should fallback to API when GitHub fetch fails', async () => {
    const mockApiResult = 'mock OAuth 1.0a guide content from API';
    mockFetch.mockResolvedValue({
      ok: false,
    } as any);
    mockApi.getDocumentationPage.mockResolvedValue(mockApiResult);

    const result = await execute({}, { language: 'java' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/Mastercard/oauth1-signer-java/refs/heads/main/README.md'
    );
    expect(mockApi.getDocumentationPage).toHaveBeenCalledWith(
      '/platform/documentation/authentication/using-oauth-1a-to-access-mastercard-apis/index.md'
    );
    expect(result).toBe(mockApiResult);
  });
});

describe('getParameters', () => {
  it('should return the correct parameters if no context', () => {
    const parameters = getParameters({});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['language']);
    expect(fields.length).toBe(1);
    expect(parameters.shape.language).toBeDefined();
    expect(parameters.shape.language.isOptional()).toBe(true);
  });
});
