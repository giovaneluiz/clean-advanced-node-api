import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/erros'

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => FacebookAuthentication.Result
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
