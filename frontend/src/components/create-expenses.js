import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import data from "bootstrap/js/src/dom/data";


export class CreateExpenses {
    constructor() {
        this.addNewExpensesElement = document.getElementById("create-expenses");
        this.buttonCreateExpensesElement = document.getElementById("create");
        this.buttonCancelExpensesElement = document.getElementById("cancel");
        this.userInfoElement = document.getElementById("user-info");
        this.liveToastElement = document.getElementById('liveToast');

        this.getInfoUser = Auth.getUserInfo();
        this.getInfoExpenses = Auth.getExpenses();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        this.initBalance();
        console.log(this.getInfoExpenses)
        if (this.getInfoUserTokens) {
            this.createExpenses(this.getInfoExpenses);
            this.cancelCreateExpenses();

        }

    }

    createExpenses(date) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.liveToastElement);
        const toastBody = document.getElementById('toast-body');
        this.buttonCreateExpensesElement.addEventListener("click", (e) => {
            this.newCreateExpenses();
            if (date) {
                for (let i = 0; i < date.length; i++) {
                    if (this.addNewExpensesElement.value === date[i].title) {
                        console.log(1)
                        toastBootstrap.show();
                        toastBody.textContent = 'Такая категория уже есть';
                    }
                    if (this.addNewExpensesElement.value === '') {
                        toastBootstrap.show();
                        toastBody.textContent = 'Дайте название категории';
                    } else {

                    }
                }
            }

        });
    }

    cancelCreateExpenses() {
        this.buttonCancelExpensesElement.addEventListener("click", () => {
            location.href = '/expenses'
        })
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
                    Auth.setExpenses(result);

                }
                location.href = '/expenses';


            } catch (e) {
                console.log(e);
            }
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