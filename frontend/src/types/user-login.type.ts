import { RefreshTokensType } from "./refresh-tokens.type"
import { UserInfoType } from "./user-info.type"

export type UserLoginType = {
    user?: UserInfoType
    name: string,
    lastName: string,
    id: string,
    error?: boolean,
    message?: string,
    tokens: RefreshTokensType
 
    
}