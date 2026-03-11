import { Injectable, Logger } from '@nestjs/common';
import { CepResponseDto } from './dto/cep-response.dto';
import { CepNotFoundError } from './errors/cep-not-found.error';
import { AllProvidersFailedError } from './errors/all-providers-failed.error';
import { ProviderSelector } from './provider-selector';

@Injectable()
export class CepService {
  private readonly logger = new Logger(CepService.name);

  constructor(private readonly providerSelector: ProviderSelector) {}

  async findByCep(cep: string): Promise<CepResponseDto> {
    const providers = this.providerSelector.getOrdered();
    const errors: Error[] = [];

    for (const provider of providers) {
      try {
        this.logger.log({
          message: 'Tentando provider',
          provider: provider.name,
          cep,
        });

        return await provider.fetchCep(cep);
      } catch (error) {
        if (error instanceof CepNotFoundError) throw error;

        errors.push(error);

        this.logger.warn({
          message: 'Provider falhou, tentando próximo',
          provider: provider.name,
          cep,
        });
      }
    }

    this.logger.error({
      message: 'Todos os providers falharam',
      cep,
    });

    const allTimedOut = errors.every((e) => e.name === 'TimeoutError');
    throw new AllProvidersFailedError(
      cep,
      allTimedOut ? 'timeout' : 'unavailable',
    );
  }
}
