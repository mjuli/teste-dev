import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { BrasilApiProvider } from './brasilapi.provider';
import { CepNotFoundError } from '../errors/cep-not-found.error';

const mockHttpService = { get: jest.fn() };

describe('BrasilApiProvider', () => {
  let provider: BrasilApiProvider;

  const mockResponse = {
    cep: '01310100',
    street: 'Avenida Paulista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  };

  const mockResponseError = {
    status: 404,
  };

  const mockResponseUnavailable = {
    error: 'connect ECONNREFUSED',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrasilApiProvider,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    provider = module.get<BrasilApiProvider>(BrasilApiProvider);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve retornar os dados do CEP corretamente', async () => {
    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await provider.fetchCep('01310100');

    expect(result).toEqual({
      cep: mockResponse.cep,
      street: mockResponse.street,
      neighborhood: mockResponse.neighborhood,
      city: mockResponse.city,
      state: mockResponse.state,
      provider: 'brasilapi',
    });
  });

  it('deve lançar CepNotFoundError quando a API retornar 404', async () => {
    const axiosError = new AxiosError();
    axiosError.response = { status: mockResponseError.status } as AxiosResponse;

    mockHttpService.get.mockReturnValue(throwError(() => axiosError));

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
