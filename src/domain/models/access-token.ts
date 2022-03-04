export class AccessToken {
  constructor (private readonly value: string) {}

  static get expirationInMs (): number {
    // convertendo 30 minutos para 1800000 ms
    return 30 * 60 * 1000
  }
}
