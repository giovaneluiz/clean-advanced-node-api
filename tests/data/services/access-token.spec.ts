import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  it('Should create with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value' })
  })

  it('Should expire in 1800000ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
