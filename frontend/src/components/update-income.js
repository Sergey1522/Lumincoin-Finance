import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class UpdateIncome {
    constructor() {
        this.updateIncomeElement = document.getElementById("update-income");
        this.buttonUpdateSaveElement = document.getElementById("save");
        this.buttonUpdateNotSaveElement = document.getElementById("not-save");
        this.userInfoElement = document.getElementById("user-info");
        this.updateIncomeElement.value = Auth.getUpdateIncomeTitle();

        this.getInfoUser = Auth.getUserInfo();
        this.getUpdateIncomeId = Auth.getUpdateIncomeId();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getInfoIncome = Auth.getIncome();
        this.showUser();
        this.initBalance();
        this.saveUpdateIncome();
        this.notSaveUpdateIncome();
        console.log(Auth.getUpdateIncomeTitle())
    }
    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
    }
    saveUpdateIncome() {
        if (this.getInfoRefreshToken) {
            this.buttonUpdateNotSaveElement.addEventListener("click",  () => {
                location.href = '/income';
            });
        }
    }
    notSaveUpdateIncome() {
        if (this.getInfoRefreshToken) {
            this.buttonUpdateSaveElement.addEventListener("click",  () => {
                this.newUpdateIncome().then();
            });
        }
    }

    async newUpdateIncome() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/income/' + this.getUpdateIncomeId, 'PUT', {
                    title: this.updateIncomeElement.value,
                });
                console.log(result);
                if (result || result.title || result.id) {
                    Auth.setIncome(result);

                }
                location.href = '/income';


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