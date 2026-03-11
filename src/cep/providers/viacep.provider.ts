import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { CepProvider } from './cep-provider.interface';
import { CepResponseDto } from '../dto/cep-response.dto';
import { CepNotFoundError } from '../errors/cep-not-found.error';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable()
export class ViaCepProvider implements CepProvider {
  readonly name = 'viacep';
  private readonly logger = new Logger(ViaCepProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchCep(cep: string): Promise<CepResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`https://viacep.com.br/ws/${cep}/json/`)
          .pipe(timeout(5000)),
      );

      const data = response.data as ViaCepResponse;
      if (data.erro) {
        throw new CepNotFoundError(cep);
      }

      return {
        cep: data.cep,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        provider: this.name,
      };
    } catch (error) {
      if (error instanceof CepNotFoundError) {
        throw error;
      }

      this.logger.warn({
        message: 'ViaCEP falhou',
        cep,
        reason: (error as Error).message,
      });

      throw error;
    }
  }
}
