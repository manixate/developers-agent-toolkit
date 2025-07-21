import {
  execute,
  getParameters,
} from '@/shared/tools/documentation/getDocumentationPage';
import api from '@/shared/api';

jest.mock<typeof api>('@/shared/api');

const mockApi = api as jest.Mocked<typeof api>;

describe('execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get documentation page and return it', async () => {
    const mockResult = 'mock documentation page content';
    mockApi.getDocumentationPage.mockResolvedValue(mockResult);

    const result = await execute({}, { pagePath: '/test/page.md' });

    expect(mockApi.getDocumentationPage).toHaveBeenCalledWith('/test/page.md');
    expect(result).toBe(mockResult);
  });
});

describe('getParameters', () => {
  it('should return the correct parameters if no context', () => {
    const parameters = getParameters({});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['pagePath']);
    expect(fields.length).toBe(1);
  });
});
