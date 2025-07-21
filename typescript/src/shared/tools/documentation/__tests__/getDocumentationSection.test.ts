import {
  execute,
  getParameters,
} from '@/shared/tools/documentation/getDocumentationSection';
import api from '@/shared/api';

jest.mock<typeof api>('@/shared/api');

const mockApi = api as jest.Mocked<typeof api>;

describe('execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get documentation section and return it', async () => {
    const mockResult = 'mock documentation section content';
    mockApi.getDocumentationSection.mockResolvedValue(mockResult);

    const result = await execute(
      {},
      { serviceId: 'test-service', sectionId: 'test-section' }
    );

    expect(mockApi.getDocumentationSection).toHaveBeenCalledWith(
      'test-service',
      'test-section'
    );
    expect(result).toBe(mockResult);
  });

  it('should use context serviceId when provided', async () => {
    const mockResult = 'mock documentation section content';
    mockApi.getDocumentationSection.mockResolvedValue(mockResult);

    const result = await execute(
      { serviceId: 'context-service' },
      { sectionId: 'test-section' }
    );

    expect(mockApi.getDocumentationSection).toHaveBeenCalledWith(
      'context-service',
      'test-section'
    );
    expect(result).toBe(mockResult);
  });
});

describe('getParameters', () => {
  it('should return the correct parameters if no context', () => {
    const parameters = getParameters({});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['serviceId', 'sectionId']);
    expect(fields.length).toBe(2);
  });

  it('should return the correct parameters if serviceId is specified in context', () => {
    const parameters = getParameters({ serviceId: 'test-service' });

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['sectionId']);
    expect(fields.length).toBe(1);
  });
});
