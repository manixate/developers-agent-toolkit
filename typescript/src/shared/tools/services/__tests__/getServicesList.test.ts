import {
  execute,
  getParameters,
} from '@/shared/tools/services/getServicesList';
import api from '@/shared/api';

jest.mock<typeof api>('@/shared/api');

const mockApi = api as jest.Mocked<typeof api>;

describe('execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get list of services and return the result', async () => {
    const mockResult = 'mock services list';
    mockApi.listServices.mockResolvedValue(mockResult);

    const result = await execute({}, {});

    expect(mockApi.listServices).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResult);
  });
});

describe('getParameters', () => {
  it('should return the correct parameters if no context', () => {
    const parameters = getParameters({});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual([]);
    expect(fields.length).toBe(0);
  });
});
