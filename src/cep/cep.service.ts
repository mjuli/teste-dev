import { Injectable, Logger } from '@nestjs/common';
import { ViaCepProvider } from './providers/viacep.provider';
import { BrasilApiProvider } from './providers/brasilapi.provider';
import { CepProvider } from './providers/cep-provider.interface';
import { CepResponseDto } from './dto/cep-response.dto';
import { CepNotFoundError } from './errors/cep-not-found.error';
import { AllProvidersFailedError } from './errors/all-providers-failed.error';

@Injectable()
export class CepService {
  private readonly logger = new Logger(CepService.name);

  constructor(
    private readonly viaCep: ViaCepProvider,
    private readonly brasilApi: BrasilApiProvider,
  ) {}

  async findByCep(cep: string): Promise<CepResponseDto> {
    const [first, second]: CepProvider[] =
      Math.random() < 0.5
        ? [this.viaCep, this.brasilApi]
        : [this.brasilApi, this.viaCep];

    this.logger.log({
      message: 'Tentando provider',
      provider: first.name,
      cep,
    });

    try {
      return await first.fetchCep(cep);
    } catch (error) {
      if (error instanceof CepNotFoundError) throw error;

      this.logger.warn({
        message: 'Provider falhou, tentando fallback',
        provider: first.name,
        fallback: second.name,
        cep,
      });
    }

    try {
      return await second.fetchCep(cep);
    } catch (error) {
      if (error instanceof CepNotFoundError) throw error;

      this.logger.error({
        message: 'Fallback também falhou',
        provider: second.name,
        cep,
      });
      throw new AllProvidersFailedError(cep);
    }
  }
}
