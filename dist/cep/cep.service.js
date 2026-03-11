"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CepService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepService = void 0;
const common_1 = require("@nestjs/common");
const viacep_provider_1 = require("./providers/viacep.provider");
const brasilapi_provider_1 = require("./providers/brasilapi.provider");
const cep_not_found_error_1 = require("./errors/cep-not-found.error");
const all_providers_failed_error_1 = require("./errors/all-providers-failed.error");
let CepService = CepService_1 = class CepService {
    viaCep;
    brasilApi;
    logger = new common_1.Logger(CepService_1.name);
    constructor(viaCep, brasilApi) {
        this.viaCep = viaCep;
        this.brasilApi = brasilApi;
    }
    async findByCep(cep) {
        const [first, second] = Math.random() < 0.5
            ? [this.viaCep, this.brasilApi]
            : [this.brasilApi, this.viaCep];
        this.logger.log({
            message: 'Tentando provider',
            provider: first.name,
            cep,
        });
        try {
            return await first.fetchCep(cep);
        }
        catch (error) {
            if (error instanceof cep_not_found_error_1.CepNotFoundError)
                throw error;
            this.logger.warn({
                message: 'Provider falhou, tentando fallback',
                provider: first.name,
                fallback: second.name,
                cep,
            });
        }
        try {
            return await second.fetchCep(cep);
        }
        catch (error) {
            if (error instanceof cep_not_found_error_1.CepNotFoundError)
                throw error;
            this.logger.error({
                message: 'Fallback também falhou',
                provider: second.name,
                cep,
            });
            throw new all_providers_failed_error_1.AllProvidersFailedError(cep);
        }
    }
};
exports.CepService = CepService;
exports.CepService = CepService = CepService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [viacep_provider_1.ViaCepProvider,
        brasilapi_provider_1.BrasilApiProvider])
], CepService);
//# sourceMappingURL=cep.service.js.map