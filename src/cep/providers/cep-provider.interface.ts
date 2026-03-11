import { CepResponseDto } from '../dto/cep-response.dto';

export interface CepProvider {
  name: string;
  fetchCep(cep: string): Promise<CepResponseDto>;
}
