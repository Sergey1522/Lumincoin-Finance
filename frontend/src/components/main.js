import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {Logout} from "./logout";


export class Main {
    constructor() {
        this.btnCategoryElement = document.getElementById('button-category');
        this.listCategoryElement = document.getElementById('category');
        this.arrowCategoryElement = document.getElementById('arrow');
        this.logoutElement = document.getElementById('logout');
        this.getInfoAccessToken = localStorage.getItem(Auth.accessTokenKey);
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getInfoUser = Auth.getUserInfo();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoIncome = Auth.getIncome();
        console.log(this.getInfoIncome);
        if (this.getInfoUserTokens) {
            this.initBalance();
            this.showUser();
            // this.initChartJs(this.resultObjCategory);
            this.getOperations();
        }

        console.log(this.getInfoUser)
        console.log(this.getInfoUserTokens)

    }
    async getOperations() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=2001-01-01&dateTo=2025-11-13');
            console.log(result);
            if (result) {
                const incomeTransactions = result.filter(item => item.type === "income");
                const expenseTransactions = result.filter(item => item.type === "expense");

                this.initChartJs(incomeTransactions,expenseTransactions);

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

    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            document.getElementById('user-info').innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
        this.btnCategoryElement.addEventListener('click', (e) => {

            if (e.target.getAttribute('aria-expanded') === 'true') {
                console.log(1)
                this.btnCategoryElement.classList.add('active');
                this.arrowCategoryElement.style.transform = 'rotate(90deg)';
            }

        });
    }

    initChartJs(income,expenses) {

        const incomeLabelsCategory = income.map((item) => {
            return item.category;
        });
        console.log(incomeLabelsCategory);
        const incomeData = income.map((item) => {
            return item.amount;
        })
        const expenseLabelsCategory = expenses.map((item) => {
            return item.category;
        });
        const expenseData = expenses.map((item) => {
            return item.amount;
        })
        const ctx = document.getElementById("myChart");
        const ctx_2 = document.getElementById("myChart_2");

     const myChart =    new Chart(ctx, {
            type: "pie",
            data: {
                labels: incomeLabelsCategory,
                datasets: [
                    {
                        label: "Доходы",
                        data: incomeData,
                        backgroundColor: [
                            "#DC3545",
                            "#fd7e14",
                            "#ffc107",
                            "#20c997",
                            "#0d6efd",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
        });
        console.log(myChart);


        new Chart(ctx_2, {
            type: "pie",
            data: {
                labels: expenseLabelsCategory,
                datasets: [
                    {
                        label: 'Расход',
                        data: expenseData,
                        backgroundColor: [
                            "#DC3545",
                            "#fd7e14",
                            "#ffc107",
                            "#20c997",
                            "#0d6efd",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
        });

    }

}