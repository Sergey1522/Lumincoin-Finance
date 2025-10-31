import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";

export class IncomeExpenses {
    constructor() {
        this.userInfoElement = document.getElementById("user-info");
        this.fromDateElement = document.getElementById("from-date");
        this.beforeDateElement = document.getElementById("before-date");
        this.btnIntervalElement = document.getElementById("interval");
        this.actionsBtnElement = document.querySelectorAll('.actions-button a');
        this.dateFrom = null;
        this.dateTo = null;
        this.actionsBtnElement.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                Auth.setTypeTitleIncomeExpenses(e.target.id)

            })
        })



        this.getInfoUser = Auth.getUserInfo();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getOperations();
        this.initBalance();
        this.showUser();
        this.getIntervalDate();


    }
    getIntervalDate() {
        this.btnIntervalElement.addEventListener('click', (e) => {
            this.dateFrom = this.fromDateElement.value;
            this.dateTo = this.beforeDateElement.value;
            console.log(this.dateFrom);
            console.log(this.dateTo);
        })
    }
   async getOperations() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations')
            console.log(result);
        }

    }

    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
    }


    async initBalance() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                document.getElementById('balance').innerHTML = result.balance + '' + '$';
            }
        }
    }
}