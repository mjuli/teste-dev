import { ViaCepProvider } from './providers/viacep.provider';
import { BrasilApiProvider } from './providers/brasilapi.provider';
import { CepResponseDto } from './dto/cep-response.dto';
export declare class CepService {
    private readonly viaCep;
    private readonly brasilApi;
    private readonly logger;
    constructor(viaCep: ViaCepProvider, brasilApi: BrasilApiProvider);
    findByCep(cep: string): Promise<CepResponseDto>;
}
