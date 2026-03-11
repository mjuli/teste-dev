import { Module } from '@nestjs/common';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';
import { HttpModule } from '@nestjs/axios';
import { ViaCepProvider } from './providers/viacep.provider';
import { BrasilApiProvider } from './providers/brasilapi.provider';

@Module({
  imports: [HttpModule],
  controllers: [CepController],
  providers: [CepService, ViaCepProvider, BrasilApiProvider],
})
export class CepModule {}
