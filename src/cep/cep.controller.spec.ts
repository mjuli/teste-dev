import { Test, TestingModule } from '@nestjs/testing';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';
import { CepNotFoundError } from './errors/cep-not-found.error';
import { AllProvidersFailedError } from './errors/all-providers-failed.error';

const mockCepService = { findByCep: jest.fn() };

const mockResponse = {
  cep: '01310-100',
  street: 'Avenida Paulista',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  provider: 'viacep',
};

describe('CepController', () => {
  let controller: CepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CepController],
      providers: [{ provide: CepService, useValue: mockCepService }],
    }).compile();

    controller = module.get<CepController>(CepController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve retornar os dados do CEP quando o service responder com sucesso', async () => {
    mockCepService.findByCep.mockResolvedValue(mockResponse);

    const result = await controller.findByCep({ cep: '01310100' });

    expect(result).toEqual(mockResponse);
    expect(mockCepService.findByCep).toHaveBeenCalledWith('01310100');
  });

  it('deve propagar CepNotFoundError para o filter tratar', async () => {
    mockCepService.findByCep.mockRejectedValue(
      new CepNotFoundError('00000000'),
    );

    await expect(controller.findByCep({ cep: '00000000' })).rejects.toThrow(
      CepNotFoundError,
    );
  });

  it('deve propagar AllProvidersFailedError para o filter tratar', async () => {
    mockCepService.findByCep.mockRejectedValue(
      new AllProvidersFailedError('01310100'),
    );

    await expect(controller.findByCep({ cep: '01310100' })).rejects.toThrow(
      AllProvidersFailedError,
    );
  });
});
