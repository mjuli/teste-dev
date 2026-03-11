import { Module } from '@nestjs/common';
import { CepModule } from './cep/cep.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [CepModule, LoggerModule],
})
export class AppModule {}
