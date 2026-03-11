import { Inject, Injectable } from '@nestjs/common';
import { CepProvider } from './providers/cep-provider.interface';
import { CEP_PROVIDERS } from './providers/providers.token';

@Injectable()
export class ProviderSelector {
  constructor(
    @Inject(CEP_PROVIDERS) private readonly providers: CepProvider[],
  ) {}

  getOrdered(): CepProvider[] {
    const shuffled = [...this.providers];
    shuffled.sort(() => Math.random() - 0.5);
    return shuffled;
  }
}
