"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllProvidersFailedError = void 0;
class AllProvidersFailedError extends Error {
    constructor(cep) {
        super(`Todos os providers falharam para o CEP ${cep}`);
        this.name = 'AllProvidersFailedError';
    }
}
exports.AllProvidersFailedError = AllProvidersFailedError;
//# sourceMappingURL=all-providers-failed.error.js.map