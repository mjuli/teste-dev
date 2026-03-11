import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from './cep.service';
import { ProviderSelector } from './provider-selector';
import { CepNotFoundError } from './errors/cep-not-found.error';
import { AllProvidersFailedError } from './errors/all-providers-failed.error';
import { CepProvider } from './providers/cep-provider.interface';

type FetchCepFn = OmitThisParameter<CepProvider['fetchCep']>;
type MockCepProvider = {
  name: string;
  fetchCep: jest.MockedFunction<FetchCepFn>;
};

const makeMockProvider = (name: string): MockCepProvider => ({
  name,
  fetchCep: jest.fn<ReturnType<FetchCepFn>, Parameters<FetchCepFn>>(),
});

describe('CepService', () => {
  let service: CepService;
  let providerA: MockCepProvider;
  let providerB: MockCepProvider;

  const mockResponse = {
    cep: '01310-100',
    street: 'Avenida Paulista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    provider: 'providerA',
  };

  beforeEach(async () => {
    providerA = makeMockProvider('providerA');
    providerB = makeMockProvider('providerB');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CepService,
        {
          provide: ProviderSelector,
          useValue: {
            getOrdered: jest.fn().mockReturnValue([providerA, providerB]),
          },
        },
      ],
    }).compile();

    service = module.get<CepService>(CepService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve retornar o resultado do primeiro provider quando bem-sucedido', async () => {
    providerA.fetchCep.mockResolvedValue(mockResponse);

    const result = await service.findByCep('01310100');

    expect(result).toEqual(mockResponse);
    expect(providerA.fetchCep).toHaveBeenCalledWith('01310100');
    expect(providerB.fetchCep).not.toHaveBeenCalled();
  });

  it('deve tentar o segundo provider quando o primeiro falhar', async () => {
    providerA.fetchCep.mockRejectedValue(new Error('timeout'));
    providerB.fetchCep.mockResolvedValue({
      ...mockResponse,
      provider: 'providerB',
    });

    const result = await service.findByCep('01310100');

    expect(providerA.fetchCep).toHaveBeenCalled();
    expect(providerB.fetchCep).toHaveBeenCalled();
    expect(result.provider).toBe('providerB');
  });

  it('deve lançar CepNotFoundError sem tentar o fallback', async () => {
    providerA.fetchCep.mockRejectedValue(new CepNotFoundError('00000000'));

    await expect(service.findByCep('00000000')).rejects.toThrow(
      CepNotFoundError,
    );
    expect(providerB.fetchCep).not.toHaveBeenCalled();
  });

  it('deve lançar AllProvidersFailedError quando todos os providers falharem', async () => {
    providerA.fetchCep.mockRejectedValue(new Error('timeout'));
    providerB.fetchCep.mockRejectedValue(new Error('unavailable'));

    await expect(service.findByCep('01310100')).rejects.toThrow(
      AllProvidersFailedError,
    );
  });
});
