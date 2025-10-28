import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class UpdateExpenses {
    constructor() {
        this.updateExpensesElement = document.getElementById("update-expenses");
        this.buttonSaveUpdateElement = document.getElementById("save");
        this.buttonNotSaveUpdateElement = document.getElementById("not-save");
        this.userInfoElement = document.getElementById("user-info");
        this.updateExpensesElement.value = Auth.getUpdateExpensesTitle();

        this.getInfoUser = Auth.getUserInfo();
        this.getUpdateExpensesId = Auth.getUpdateIncomeId();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        this.initBalance();
        this.saveUpdateExpenses();
        this.notSaveUpdateExpenses();

        console.log(Auth.getUpdateExpensesTitle())


    }
    notSaveUpdateExpenses() {
        if (this.getInfoRefreshToken) {
            this.buttonNotSaveUpdateElement.addEventListener("click",  () => {
                location.href = '/expenses';
            });
        }
    }
    saveUpdateExpenses() {
        if (this.getInfoRefreshToken) {
            this.buttonSaveUpdateElement.addEventListener("click",  () => {
                this.newUpdateExpenses();
            });
        }
    }
    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
    }
    async newUpdateExpenses() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense/' + this.getUpdateExpensesId, 'PUT', {
                    title: this.updateExpensesElement.value,
                });
                console.log(result);
                if (result || result.title || result.id) {
                    Auth.setExpenses(result);

                }
                location.href = '/expenses';


            }catch (e) {
                console.log(e);
            }

        }

    }
   async initBalance() {
        if (this.getInfoRefreshToken ) {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                document.getElementById('balance').innerHTML = result.balance + '' + '$';
            }
        }
    }

}