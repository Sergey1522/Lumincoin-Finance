import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";

export class Logout {
    private getInfoRefreshToken: string | null;
    private accessTokenKey: string | null;
    constructor() {
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.accessTokenKey = localStorage.getItem(Auth.accessTokenKey);
        if (!this.getInfoRefreshToken || !this.accessTokenKey) {
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
         
             Auth.removeTokens();
             Auth.removeUserInfo();

             location.href = '/login';
         }

     }
}