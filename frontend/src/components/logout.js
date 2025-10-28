import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";

export class Logout {
    constructor() {
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        if (!Auth.getTokens(Auth.refreshTokenKey) || !Auth.getTokens(Auth.accessTokenKey)) {
          location.href = '/login'
        }
        this.isLogout().then();

    }

    async isLogout() {
         const result = await CustomHttp.request(config.host + '/logout','POST', {
             refreshToken: this.getInfoRefreshToken,
         });
        console.log(result)
         if (result.error === false) {
             location.href = '/login';
         }

     }
}