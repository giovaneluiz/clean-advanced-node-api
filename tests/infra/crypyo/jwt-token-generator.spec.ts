import { JwtTokenGenerator } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })
    expect(token).toBe('any_token')
  })

  it('Should rethrow if get trhows', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
    const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1000 })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
