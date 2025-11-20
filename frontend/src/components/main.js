import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";



export class Main {
    constructor() {
        this.btnCategoryElement = document.getElementById('button-category');
        this.arrowCategoryElement = document.getElementById('arrow');
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getInfoUser = Auth.getUserInfo();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoIncome = Auth.getIncome();
        this.dateFromAll = '1969-10-29';
        const date = new Date();
        this.dateToAll = date.toISOString().split('T')[0];
        this.fromDateElement = document.getElementById("from-date");
        this.beforeDateElement = document.getElementById("before-date");



        console.log(this.getInfoIncome);
        if (this.getInfoUserTokens) {
            this.initBalance();
            this.showUser();
            this.getOperations(this.dateFromAll,this.dateToAll );
        }
        document.getElementById('today').addEventListener('click', () => this.setFilter('today'));
        document.getElementById('week').addEventListener('click', () => this.setFilter('week'));
        document.getElementById('month').addEventListener('click', () => this.setFilter('month'));
        document.getElementById('year').addEventListener('click', () => this.setFilter('year'));
        document.getElementById('all').addEventListener('click', () => this.setFilter('all'));
        document.getElementById('interval').addEventListener('click', () => this.setFilter('interval'));


        console.log(this.getInfoUser)
        console.log(this.getInfoUserTokens)

    }


    setFilter(currentFilter) {
        this.updateActiveButton(currentFilter)
        this.getDateRange(currentFilter)


    }
    updateActiveButton(activeFilter) {
        document.querySelectorAll('.btn-actions').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${activeFilter}`).classList.add('active');
    }
    getDateRange(currentFilter) {
        const now = new Date();
        let startDate, endDate;

        switch (currentFilter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString().split('T')[0];
                this.getOperations(startDate,endDate)
                break;

            case 'week':
                const dayOfWeek = now.getDay();
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                endDate = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59);
                this.getOperations(startDate,endDate)
                break;

            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                this.getOperations(startDate,endDate)
                break;

            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                this.getOperations(startDate,endDate)
                break;

            case 'all':
                startDate = this.dateFromAll;
                endDate = this.dateToAll;
                this.getOperations(startDate,endDate)
                break;
            case 'interval':
                startDate = this.fromDateElement.value;
                endDate = this.beforeDateElement.value;
                if (startDate === '' && endDate === '') {
                    return;
                }else {
                    this.getOperations(startDate,endDate);
                }
                break;

            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                this.getOperations(startDate,endDate)
        }

    }








    async getOperations(from, to) {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom='+ from +' &dateTo='+ to);
            console.log(result);
            if (result) {
                const incomeTransactions = result.filter(item => item.type === "income");
                const expenseTransactions = result.filter(item => item.type === "expense");

                this.initChartIncome(incomeTransactions);
                this.initChartExpenses(expenseTransactions);

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
            e.preventDefault();

            if (e.target.getAttribute('aria-expanded') === 'true') {
                console.log(1)
                e.preventDefault();
                this.btnCategoryElement.classList.add('active');
                this.arrowCategoryElement.style.transform = 'rotate(90deg)';
            }

        });
    }

    initChartIncome(income) {

        const incomeLabelsCategory = income.map((item) => {
            return item.category;
        });
        console.log(incomeLabelsCategory);
        const incomeData = income.map((item) => {
            return item.amount;
        })
        const ctx = document.getElementById("myChart");

        const existingChart = Chart.getChart(ctx);

        if (existingChart) {
            existingChart.destroy();
        }


     const myChart =    new Chart(ctx, {
            type: "pie",
            data: {
                labels: incomeLabelsCategory,
                datasets: [
                    {
                        label: "Доходы",
                        data: incomeData,
                        backgroundColor: [
                            "#20c997",
                            "#fd7e14",
                            "#ffc107",
                            "#DC3545",
                            "#0d6efd",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
        });




    }

    initChartExpenses(expenses) {


        const expenseLabelsCategory = expenses.map((item) => {
            return item.category;
        });
        const expenseData = expenses.map((item) => {
            return item.amount;
        })

        const ctx_2 = document.getElementById("myChart_2");

        const existingChart_2 = Chart.getChart(ctx_2);
        if (existingChart_2) {
            existingChart_2.destroy();
        }
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