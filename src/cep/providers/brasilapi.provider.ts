import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';
import { CepProvider } from './cep-provider.interface';
import { CepResponseDto } from '../dto/cep-response.dto';
import { CepNotFoundError } from '../errors/cep-not-found.error';

interface BrasilApiResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

@Injectable()
export class BrasilApiProvider implements CepProvider {
  readonly name = 'brasilapi';
  private readonly logger = new Logger(BrasilApiProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchCep(cep: string): Promise<CepResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`https://brasilapi.com.br/api/cep/v1/${cep}`)
          .pipe(timeout(5000)),
      );
      const data = response.data as BrasilApiResponse;

      return {
        cep: data.cep,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        provider: this.name,
      };
    } catch (error) {
      if (error instanceof CepNotFoundError) throw error;

      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) {
        throw new CepNotFoundError(cep);
      }

      this.logger.warn({
        message: 'BrasilAPI falhou',
        cep,
        reason: (error as Error).message,
      });

      throw error;
    }
  }
}
