import { CepService } from './cep.service';
import { CepResponseDto } from './dto/cep-response.dto';
import { CepParamDto } from './dto/cep-param.dto';
export declare class CepController {
    private readonly cepService;
    constructor(cepService: CepService);
    findByCep(params: CepParamDto): Promise<CepResponseDto>;
}
