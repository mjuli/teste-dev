import { Module } from '@nestjs/common';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';
import { HttpModule } from '@nestjs/axios';
import { ViaCepProvider } from './providers/viacep.provider';
import { BrasilApiProvider } from './providers/brasilapi.provider';
import { CepProvider } from './providers/cep-provider.interface';
import { ProviderSelector } from './provider-selector';
import { CEP_PROVIDERS } from './providers/providers.token';

@Module({
  imports: [HttpModule],
  controllers: [CepController],
  providers: [
    CepService,
    ViaCepProvider,
    BrasilApiProvider,
    ProviderSelector,
    {
      provide: CEP_PROVIDERS,
      useFactory: (...providers: CepProvider[]) => providers,
      inject: [ViaCepProvider, BrasilApiProvider],
    },
  ],
})
export class CepModule {}
