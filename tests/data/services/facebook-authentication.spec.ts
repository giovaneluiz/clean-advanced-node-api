import { FacebookAuthenticationService } from '@/data/services'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AuthenticationError } from '@/domain/erros'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    crypto = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo, crypto)
  })

  it('Should call LoadFacebookApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookApi returns undefined', async () => {
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call FacebookAuthenticationService with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs

    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
