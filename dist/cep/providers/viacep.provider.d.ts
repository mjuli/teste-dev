import { HttpService } from '@nestjs/axios';
import { CepProvider } from './cep-provider.interface';
import { CepResponseDto } from '../dto/cep-response.dto';
export declare class ViaCepProvider implements CepProvider {
    private readonly httpService;
    readonly name = "viacep";
    private readonly logger;
    constructor(httpService: HttpService);
    fetchCep(cep: string): Promise<CepResponseDto>;
}
