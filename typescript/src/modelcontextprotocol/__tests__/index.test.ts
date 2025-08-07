import { MastercardDevelopersAgentToolkit } from '../';
import { buildContext } from '../toolkit';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { tools } from '@/shared/tools';

const mockTool = jest.spyOn(McpServer.prototype, 'tool');

describe('MastercardDevelopersAgentToolkit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register all tools with correct method/description when no config', () => {
    new MastercardDevelopersAgentToolkit({});

    const expectedTools = tools({});
    expect(mockTool).toHaveBeenCalledTimes(expectedTools.length);

    expectedTools.forEach((expectedTool, index) => {
      const [method, description] = mockTool.mock.calls[index];
      expect(method).toBe(expectedTool.method);
      expect(description).toBe(expectedTool.description);
    });
  });

  it('should register context-aware tools when apiSpecificationPath configured', () => {
    new MastercardDevelopersAgentToolkit({
      apiSpecification:
        'https://static.developer.mastercard.com/content/service/swagger/path.yaml',
    });

    const expectedTools = tools({
      serviceId: 'service',
      apiSpecificationPath: '/service/swagger/path.yaml',
    }).filter((tool) => tool.method !== 'get-services-list');
    expect(mockTool).toHaveBeenCalledTimes(expectedTools.length);

    expectedTools.forEach((expectedTool, index) => {
      const [method, description] = mockTool.mock.calls[index];
      expect(method).toBe(expectedTool.method);
      expect(description).toBe(expectedTool.description);
    });
  });

  it('should exclude get-services-list when serviceId configured', () => {
    new MastercardDevelopersAgentToolkit({
      service: 'https://developer.mastercard.com/test-service/documentation/',
    });

    const expectedTools = tools({ serviceId: 'test-service' }).filter(
      (tool) => tool.method !== 'get-services-list'
    );
    const registeredMethods = mockTool.mock.calls.map((call) => call[0]);

    expect(registeredMethods).not.toContain('get-services-list');
    expect(mockTool).toHaveBeenCalledTimes(expectedTools.length);

    expectedTools.forEach((expectedTool, index) => {
      const [method, description] = mockTool.mock.calls[index];
      expect(method).toBe(expectedTool.method);
      expect(description).toBe(expectedTool.description);
    });
  });
});

describe('buildContext function', () => {
  describe('success cases', () => {
    it('should return empty context when no config provided', () => {
      const result = buildContext({});
      expect(result).toEqual({});
    });

    it('should parse service URL and extract serviceId', () => {
      const result = buildContext({
        service:
          'https://developer.mastercard.com/open-banking-us/documentation/',
      });
      expect(result).toEqual({
        serviceId: 'open-banking-us',
      });
    });

    it('should parse API specification URL and extract serviceId and apiSpecificationPath', () => {
      const result = buildContext({
        apiSpecification:
          'https://static.developer.mastercard.com/content/test-service/swagger/api.yaml',
      });
      expect(result).toEqual({
        serviceId: 'test-service',
        apiSpecificationPath: '/test-service/swagger/api.yaml',
      });
    });

    it('should handle nested API specification paths', () => {
      const result = buildContext({
        apiSpecification:
          'https://static.developer.mastercard.com/content/payment-gateway/swagger/nested/spec.yaml',
      });
      expect(result).toEqual({
        serviceId: 'payment-gateway',
        apiSpecificationPath: '/payment-gateway/swagger/nested/spec.yaml',
      });
    });

    it('should handle service IDs with hyphens and numbers', () => {
      const result = buildContext({
        service:
          'https://developer.mastercard.com/open-banking-us-v2/documentation/',
      });
      expect(result).toEqual({
        serviceId: 'open-banking-us-v2',
      });
    });
  });

  describe('error cases', () => {
    it('should throw error for invalid service URL format', () => {
      expect(() => {
        buildContext({
          service: 'https://invalid-domain.com/service/documentation/',
        });
      }).toThrow('Invalid service URL provided');
    });

    it('should throw error for service URL without documentation path', () => {
      expect(() => {
        buildContext({ service: 'https://developer.mastercard.com/service/' });
      }).toThrow('Invalid service URL provided');
    });

    it('should throw error for invalid API specification URL format', () => {
      expect(() => {
        buildContext({
          apiSpecification:
            'https://invalid-domain.com/content/service/swagger/api.yaml',
        });
      }).toThrow('Invalid API specification path provided');
    });

    it('should throw error for API specification without proper path structure', () => {
      expect(() => {
        buildContext({
          apiSpecification:
            'https://static.developer.mastercard.com/invalid/path.yaml',
        });
      }).toThrow('Invalid API specification path provided');
    });

    it('should throw error for API specification without .yaml extension', () => {
      expect(() => {
        buildContext({
          apiSpecification:
            'https://static.developer.mastercard.com/content/service/swagger/api.json',
        });
      }).toThrow('Invalid API specification path provided');
    });

    it('should throw error for invalid service ID format (contains invalid characters)', () => {
      expect(() => {
        buildContext({
          service:
            'https://developer.mastercard.com/service_with_underscore/documentation/',
        });
      }).toThrow('Invalid service URL provided');
    });
  });
});
