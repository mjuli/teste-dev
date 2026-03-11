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
var ViaCepProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaCepProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cep_not_found_error_1 = require("../errors/cep-not-found.error");
let ViaCepProvider = ViaCepProvider_1 = class ViaCepProvider {
    httpService;
    name = 'viacep';
    logger = new common_1.Logger(ViaCepProvider_1.name);
    constructor(httpService) {
        this.httpService = httpService;
    }
    async fetchCep(cep) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(`https://viacep.com.br/ws/${cep}/json/`)
                .pipe((0, rxjs_1.timeout)(5000)));
            const data = response.data;
            if (data.erro) {
                throw new cep_not_found_error_1.CepNotFoundError(cep);
            }
            return {
                cep: data.cep,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
                provider: this.name,
            };
        }
        catch (error) {
            if (error instanceof cep_not_found_error_1.CepNotFoundError) {
                throw error;
            }
            this.logger.warn({
                message: 'ViaCEP falhou',
                cep,
                reason: error.message,
            });
            throw error;
        }
    }
};
exports.ViaCepProvider = ViaCepProvider;
exports.ViaCepProvider = ViaCepProvider = ViaCepProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ViaCepProvider);
//# sourceMappingURL=viacep.provider.js.map