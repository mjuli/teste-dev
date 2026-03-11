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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepController = void 0;
const common_1 = require("@nestjs/common");
const cep_exception_filter_1 = require("./filters/cep-exception.filter");
const cep_service_1 = require("./cep.service");
const cep_param_dto_1 = require("./dto/cep-param.dto");
let CepController = class CepController {
    cepService;
    constructor(cepService) {
        this.cepService = cepService;
    }
    async findByCep(params) {
        return this.cepService.findByCep(params.cep);
    }
};
exports.CepController = CepController;
__decorate([
    (0, common_1.Get)(':cep'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cep_param_dto_1.CepParamDto]),
    __metadata("design:returntype", Promise)
], CepController.prototype, "findByCep", null);
exports.CepController = CepController = __decorate([
    (0, common_1.Controller)('cep'),
    (0, common_1.UseFilters)(cep_exception_filter_1.CepExceptionFilter),
    __metadata("design:paramtypes", [cep_service_1.CepService])
], CepController);
//# sourceMappingURL=cep.controller.js.map