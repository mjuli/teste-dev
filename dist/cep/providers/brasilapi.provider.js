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
var BrasilApiProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrasilApiProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cep_not_found_error_1 = require("../errors/cep-not-found.error");
let BrasilApiProvider = BrasilApiProvider_1 = class BrasilApiProvider {
    httpService;
    name = 'brasilapi';
    logger = new common_1.Logger(BrasilApiProvider_1.name);
    constructor(httpService) {
        this.httpService = httpService;
    }
    async fetchCep(cep) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(`https://brasilapi.com.br/api/cep/v1/${cep}`)
                .pipe((0, rxjs_1.timeout)(5000)));
            const data = response.data;
            return {
                cep: data.cep,
                street: data.street,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                provider: this.name,
            };
        }
        catch (error) {
            if (error instanceof cep_not_found_error_1.CepNotFoundError)
                throw error;
            const axiosError = error;
            if (axiosError?.response?.status === 404) {
                throw new cep_not_found_error_1.CepNotFoundError(cep);
            }
            this.logger.warn({
                message: 'BrasilAPI falhou',
                cep,
                reason: error.message,
            });
            throw error;
        }
    }
};
exports.BrasilApiProvider = BrasilApiProvider;
exports.BrasilApiProvider = BrasilApiProvider = BrasilApiProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], BrasilApiProvider);
//# sourceMappingURL=brasilapi.provider.js.map