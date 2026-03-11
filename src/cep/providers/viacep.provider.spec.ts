import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { ViaCepProvider } from './viacep.provider';
import { CepNotFoundError } from '../errors/cep-not-found.error';

const mockHttpService = { get: jest.fn() };

describe('ViaCepProvider', () => {
  let provider: ViaCepProvider;

  const mockResponse = {
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    bairro: 'Bela Vista',
    localidade: 'São Paulo',
    uf: 'SP',
  };

  const mockResponseError = {
    erro: true,
  };

  const mockResponseUnavailable = {
    error: 'connect ECONNREFUSED',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViaCepProvider,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    provider = module.get<ViaCepProvider>(ViaCepProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os dados do CEP corretamente', async () => {
    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await provider.fetchCep('01310100');

    expect(result).toEqual({
      cep: mockResponse.cep,
      street: mockResponse.logradouro,
      neighborhood: mockResponse.bairro,
      city: mockResponse.localidade,
      state: mockResponse.uf,
      provider: 'viacep',
    });
  });

  it('deve lançar CepNotFoundError quando a API retornar erro: true', async () => {
    mockHttpService.get.mockReturnValue(of({ data: mockResponseError }));

    await expect(provider.fetchCep('00000000')).rejects.toThrow(
      CepNotFoundError,
    );
  });

  it('deve lançar erro quando a API estiver indisponível', async () => {
    mockHttpService.get.mockReturnValue(
      throwError(() => new Error(mockResponseUnavailable.error)),
    );

    await expect(provider.fetchCep('01310100')).rejects.toThrow();
  });
});
