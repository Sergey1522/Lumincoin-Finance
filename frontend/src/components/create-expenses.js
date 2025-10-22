import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class CreateExpenses {
    constructor() {
        this.addNewExpensesElement = document.getElementById("create-expenses");
        this.buttonCreateExpensesElement = document.getElementById("create");
        this.userInfoElement = document.getElementById("user-info");

        this.getInfoUser = Auth.getUserInfo();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        this.initBalance();
        if (this.getInfoUserTokens) {
            this.buttonCreateExpensesElement.addEventListener("click",  () => {
                this.newCreateExpenses();
            });




        }
        console.log()
        console.log(this.getInfoUserTokens)
    }
    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
    }
    async newCreateExpenses() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense', 'POST', {
                    title: this.addNewExpensesElement.value,
                });
                console.log(result);
                if (result || result.title || result.id) {
                    Auth.setIncome(result);

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