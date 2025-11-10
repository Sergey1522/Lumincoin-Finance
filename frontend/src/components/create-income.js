import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import isTableElement from "@popperjs/core/lib/dom-utils/isTableElement";


export class CreateIncome {
    constructor() {
        this.addNewIncomeElement = document.getElementById("create-income");
        this.buttonCreateElement = document.getElementById("create");
        this.buttonCancelElement = document.getElementById("cancel");
        this.userInfoElement = document.getElementById("user-info");
        this.liveToastElement = document.getElementById('liveToast');

        this.getInfoUser = Auth.getUserInfo();
        this.getInfoIncome = Auth.getIncome();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        this.createIncome(this.getInfoIncome);
        this.cancelCreateIncome();
        this.initBalance();


    }

    createIncome(date) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.liveToastElement);
        const toastBody = document.getElementById('toast-body');
        this.buttonCreateElement.addEventListener("click", (e) => {
            this.newCreateIncome();
            if (date) {
                for (let i = 0; i < date.length; i++) {
                    if (this.addNewIncomeElement.value === date[i].title) {
                        toastBootstrap.show();
                        toastBody.textContent = 'Такая категория уже есть';
                    }
                    if (this.addNewIncomeElement.value === '') {
                        toastBootstrap.show();
                        toastBody.textContent = 'Дайте название категории';
                    }
                }

            }
        })


    }

    cancelCreateIncome() {
        this.buttonCancelElement.addEventListener("click", () => {
            console.log(2)
            location.href = '/income'
        })
    }


    async initBalance() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/balance');
            console.log(result);
            if (result) {
                document.getElementById('balance').innerHTML = result.balance + '' + '$';
            }
        }
    }

    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
    }

    async newCreateIncome() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                    title: this.addNewIncomeElement.value,
                });
                console.log(result);
                if (result || result.title || result.id) {
                    for (let i = 0; i < result.length; i++) {
                        Auth.setIncome(result[i]);
                    }


                }
                location.href = '/income';


            } catch (e) {
                console.log(e);
            }

        }


    }


}