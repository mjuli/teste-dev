export class AllProvidersFailedError extends Error {
  constructor(
    cep: string,
    public readonly reason: 'timeout' | 'unavailable' = 'unavailable',
  ) {
    super(`Todos os providers falharam para o CEP ${cep}`);
    this.name = 'AllProvidersFailedError';
  }
}
