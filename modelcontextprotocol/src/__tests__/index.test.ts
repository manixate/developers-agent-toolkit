import { main, parseArgs } from '..';
import { MastercardDevelopersMCPServer } from '@mastercard/developers-agent-toolkit/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

jest.mock('@mastercard/developers-agent-toolkit/mcp');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('parseArgs function', () => {
  describe('success cases', () => {
    it('should parse service', () => {
      const result = parseArgs([
        '--service=https://developer.mastercard.com/payment-gateway/documentation/',
      ]);
      expect(result).toEqual({
        service:
          'https://developer.mastercard.com/payment-gateway/documentation/',
      });
    });

    it('should parse valid api-specification-path argument', () => {
      const result = parseArgs([
        '--api-specification=https://static.developer.mastercard.com/content/open-banking-us/swagger/spec.yaml',
      ]);
      expect(result).toEqual({
        apiSpecification:
          'https://static.developer.mastercard.com/content/open-banking-us/swagger/spec.yaml',
      });
    });

    it('should parse both arguments together', () => {
      const result = parseArgs([
        '--service=https://developer.mastercard.com/payment-gateway/documentation/',
        '--api-specification=https://static.developer.mastercard.com/content/open-banking-us/swagger/spec.yaml',
      ]);
      expect(result).toEqual({
        service:
          'https://developer.mastercard.com/payment-gateway/documentation/',
        apiSpecification:
          'https://static.developer.mastercard.com/content/open-banking-us/swagger/spec.yaml',
      });
    });

    it('should ignore arguments that do not start with --', () => {
      const result = parseArgs([
        'some-arg',
        '--service=https://developer.mastercard.com/payment-gateway/documentation/',
      ]);
      expect(result).toEqual({
        service:
          'https://developer.mastercard.com/payment-gateway/documentation/',
      });
    });
  });

  describe('error cases', () => {
    it('should handle invalid argument format', () => {
      const result = parseArgs(['--invalid-format']);
      expect(result).toEqual({});
    });

    it('should handle unknown argument', () => {
      const result = parseArgs(['--unknown=value']);
      expect(result).toEqual({});
    });
  });
});

describe('main function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start server with no configuration', async () => {
    process.argv = ['node', 'index.js'];

    await main();

    expect(MastercardDevelopersMCPServer).toHaveBeenCalledWith({});
    expect(StdioServerTransport).toHaveBeenCalled();
  });

  it('should start server with service configuration', async () => {
    process.argv = [
      'node',
      'index.js',
      '--service=https://developer.mastercard.com/open-banking-us/documentation/',
    ];

    await main();

    expect(MastercardDevelopersMCPServer).toHaveBeenCalledWith({
      service:
        'https://developer.mastercard.com/open-banking-us/documentation/',
    });
  });

  it('should start server with API specification configuration', async () => {
    process.argv = [
      'node',
      'index.js',
      '--api-specification=https://static.developer.mastercard.com/content/test-service/swagger/api.yaml',
    ];

    await main();

    expect(MastercardDevelopersMCPServer).toHaveBeenCalledWith({
      apiSpecification:
        'https://static.developer.mastercard.com/content/test-service/swagger/api.yaml',
    });
  });

  it('should start server with both configurations', async () => {
    process.argv = [
      'node',
      'index.js',
      '--service=https://developer.mastercard.com/payment-gateway/documentation/',
      '--api-specification=https://static.developer.mastercard.com/content/payment-gateway/swagger/api.yaml',
    ];

    await main();

    expect(MastercardDevelopersMCPServer).toHaveBeenCalledWith({
      service:
        'https://developer.mastercard.com/payment-gateway/documentation/',
      apiSpecification:
        'https://static.developer.mastercard.com/content/payment-gateway/swagger/api.yaml',
    });
  });

  it('should handle errors in main function', async () => {
    process.argv = ['node', 'index.js'];

    const error = new Error('Test error');
    (
      MastercardDevelopersMCPServer as jest.MockedClass<
        typeof MastercardDevelopersMCPServer
      >
    ).mockImplementation(() => {
      throw error;
    });

    await expect(main()).rejects.toThrow('Test error');
  });
});
