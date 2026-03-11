export class AllProvidersFailedError extends Error {
  constructor(cep: string) {
    super(`Todos os providers falharam para o CEP ${cep}`);
    this.name = 'AllProvidersFailedError';
  }
}
