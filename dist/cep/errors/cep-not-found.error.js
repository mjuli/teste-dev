"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CepNotFoundError = void 0;
class CepNotFoundError extends Error {
    constructor(cep) {
        super(`CEP ${cep} não encontrado`);
        this.name = 'CepNotFoundError';
    }
}
exports.CepNotFoundError = CepNotFoundError;
//# sourceMappingURL=cep-not-found.error.js.map