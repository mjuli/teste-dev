import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { CepExceptionFilter } from './filters/cep-exception.filter';
import { CepService } from './cep.service';
import { CepResponseDto } from './dto/cep-response.dto';
import { CepParamDto } from './dto/cep-param.dto';

@Controller('cep')
@UseFilters(CepExceptionFilter)
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  async findByCep(@Param() params: CepParamDto): Promise<CepResponseDto> {
    return this.cepService.findByCep(params.cep);
  }
}
