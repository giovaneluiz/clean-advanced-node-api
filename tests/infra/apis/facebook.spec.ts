import { FacebookApi } from '@/infra/apis/facebook'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Facebook Api', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeEach(() => {
    httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' })
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  it('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})
