"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CepExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const cep_not_found_error_1 = require("../errors/cep-not-found.error");
const all_providers_failed_error_1 = require("../errors/all-providers-failed.error");
let CepExceptionFilter = CepExceptionFilter_1 = class CepExceptionFilter {
    logger = new common_1.Logger(CepExceptionFilter_1.name);
    catch(error, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (error instanceof cep_not_found_error_1.CepNotFoundError) {
            return response.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: 404,
                error: 'Not Found',
                message: error.message,
            });
        }
        if (error instanceof all_providers_failed_error_1.AllProvidersFailedError) {
            this.logger.error({ message: error.message });
            return response.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).json({
                statusCode: 503,
                error: 'Service Unavailable',
                message: 'Todos os serviços de CEP estão indisponíveis no momento',
            });
        }
    }
};
exports.CepExceptionFilter = CepExceptionFilter;
exports.CepExceptionFilter = CepExceptionFilter = CepExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(cep_not_found_error_1.CepNotFoundError, all_providers_failed_error_1.AllProvidersFailedError)
], CepExceptionFilter);
//# sourceMappingURL=cep-exception.filter.js.map