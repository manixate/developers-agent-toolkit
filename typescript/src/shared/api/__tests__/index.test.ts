import { MastercardAPIClient } from '@/shared/api';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const mcd = (path: string) => {
  return new URL(path, 'https://developer.mastercard.com').toString();
};

const server = setupServer();

describe('MastercardAPIClient', () => {
  let client: MastercardAPIClient;

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    client = new MastercardAPIClient();
  });

  describe('listServices', () => {
    it('should make request to /llms.txt with absolute_urls=false', async () => {
      server.use(
        http.get(mcd('/llms.txt'), ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('absolute_urls')).toBe('false');
          return HttpResponse.text('services list');
        })
      );

      const result = await client.listServices();
      expect(result).toBe('services list');
    });

    it('should handle network errors', async () => {
      server.use(
        http.get(mcd('/llms.txt'), () => {
          return HttpResponse.error();
        })
      );

      await expect(client.listServices()).rejects.toThrow();
    });

    it('should handle non-ok responses', async () => {
      server.use(
        http.get(mcd('/llms.txt'), () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(client.listServices()).rejects.toThrow(
        'Request failed with status 404'
      );
    });
  });

  describe('getDocumentation', () => {
    it('should make request to service documentation endpoint', async () => {
      server.use(
        http.get(
          mcd('/open-banking-us/documentation/llms.txt'),
          ({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get('absolute_urls')).toBe('false');
            return HttpResponse.text('documentation content');
          }
        )
      );

      const result = await client.getDocumentation('open-banking-us');
      expect(result).toBe('documentation content');
    });
  });

  describe('getDocumentationSection', () => {
    it('should make request to documentation section endpoint', async () => {
      server.use(
        http.get(
          mcd('/open-banking-us/documentation/llms-full.txt'),
          ({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get('absolute_urls')).toBe('false');
            expect(url.searchParams.get('section_id')).toBe('getting-started');
            return HttpResponse.text('section content');
          }
        )
      );

      const result = await client.getDocumentationSection(
        'open-banking-us',
        'getting-started'
      );
      expect(result).toBe('section content');
    });
  });

  describe('getDocumentationPage', () => {
    it('should make request to specific documentation page', async () => {
      server.use(
        http.get(mcd('/open-banking-us/documentation/api-basics'), () => {
          return HttpResponse.text('page content');
        })
      );

      const result = await client.getDocumentationPage(
        '/open-banking-us/documentation/api-basics'
      );
      expect(result).toBe('page content');
    });

    it('should validate path starts with /', async () => {
      await expect(client.getDocumentationPage('invalid-path')).rejects.toThrow(
        'Path must start with /'
      );
    });

    it('should validate path is non-empty', async () => {
      await expect(client.getDocumentationPage('')).rejects.toThrow(
        'Path must be a non-empty string'
      );
    });
  });

  describe('getApiOperations', () => {
    it('should make request to API specification endpoint with summary=true', async () => {
      server.use(
        http.get(
          mcd('/open-banking-us/swagger/openbanking-us.yaml'),
          ({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get('summary')).toBe('true');
            return HttpResponse.text('operations list');
          }
        )
      );

      const result = await client.getApiOperations(
        '/open-banking-us/swagger/openbanking-us.yaml'
      );
      expect(result).toBe('operations list');
    });

    it('should validate API specification path', async () => {
      await expect(client.getApiOperations('invalid-path')).rejects.toThrow(
        'Path must start with /'
      );
    });
  });

  describe('getApiOperationDetails', () => {
    it('should make request with method and path parameters', async () => {
      server.use(
        http.get(
          mcd('/open-banking-us/swagger/openbanking-us.yaml'),
          ({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get('method')).toBe('GET');
            expect(url.searchParams.get('path')).toBe('/accounts');
            return HttpResponse.text('operation details');
          }
        )
      );

      const result = await client.getApiOperationDetails(
        '/open-banking-us/swagger/openbanking-us.yaml',
        'GET',
        '/accounts'
      );

      expect(result).toBe('operation details');
    });

    it('should validate API specification path', async () => {
      await expect(
        client.getApiOperationDetails('invalid-path', 'GET', '/accounts')
      ).rejects.toThrow('Path must start with /');
    });
  });

  describe('request method security', () => {
    it('should reject URLs with different hostname', async () => {
      const maliciousClient = new MastercardAPIClient();

      // This should be caught by the hostname validation in the client
      await expect(
        maliciousClient.getDocumentationPage('//unknown.com/path')
      ).rejects.toThrow('Invalid endpoint: URL hostname mismatch');
    });

    it('should handle network errors gracefully', async () => {
      server.use(
        http.get(mcd('/llms.txt'), () => {
          return HttpResponse.error();
        })
      );

      await expect(client.listServices()).rejects.toThrow();
    });

    it('should handle invalid URL construction', async () => {
      // Test with an invalid URL that would cause URL constructor to fail
      await expect(
        client.getDocumentationPage('http://[::1]:invalid')
      ).rejects.toThrow();
    });
  });
});
