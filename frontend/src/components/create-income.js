import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class CreateIncome {
    constructor() {
        this.addNewIncomeElement = document.getElementById("create-income");
        this.buttonCreateElement = document.getElementById("create");

        this.getInfoUser = Auth.getUserInfo();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        if (this.getInfoUserTokens) {
            this.buttonCreateElement.addEventListener("click",  () => {
                this.newCreateIncome();
            });
            // this.initBalance().then();




        }
        console.log()
        console.log(this.getInfoUserTokens)
    }
    async newCreateIncome() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                    title: this.addNewIncomeElement.value,
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