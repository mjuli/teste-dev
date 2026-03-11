import { IsString, Matches } from 'class-validator';

export class CepParamDto {
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'CEP deve conter exatamente 8 dígitos numéricos',
  })
  cep: string;
}
