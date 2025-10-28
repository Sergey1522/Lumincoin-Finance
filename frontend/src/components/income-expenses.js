import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";

export class IncomeExpenses {
    constructor() {
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getOperations();

    }
   async getOperations() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations')
            console.log(result);
        }

    }
}