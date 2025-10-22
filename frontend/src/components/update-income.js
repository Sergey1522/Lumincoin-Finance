import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class UpdateIncome {
    constructor() {
        this.updateIncomeElement = document.getElementById("update-income");
        this.buttonUpdateElement = document.getElementById("save");
        this.userInfoElement = document.getElementById("user-info");

        this.getInfoUser = Auth.getUserInfo();
        this.getUpdateIncomeId = Auth.getUpdateIncomeId();
        this.getInfoIncome = Auth.getIncome();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        if (this.getInfoUserTokens) {
            this.buttonUpdateElement.addEventListener("click",  () => {
                this.newUpdateIncome().then();
            });

        }
        console.log(this.getUpdateIncomeId)
        console.log(this.getInfoUserTokens)
    }
    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
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
    // addNewIncome(income) {
    //     this.buttonAddNewElement.addEventListener("click", async () => {
    //         const result = await CustomHttp.request(config.host + '/categories/income');
    //     })
    // }
   async initBalance() {
        if (this.getInfoRefreshToken ) {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                document.getElementById('balance').innerHTML = result.balance + '' + '$';
            }
        }
    }

}