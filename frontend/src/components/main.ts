import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import { OperationsIncomeType} from "../types/operations-income.type";
import { BalanceUserType } from "../types/balance-user.type";
import { UserInfoType } from "../types/user-info.type";
import { OperationsExpensesType } from "../types/operations-expenses.type ";
import { UserLoginType } from "../types/user-login.type";
import { CategoriesIncomeType } from "../types/categories-income.type";



export class Main {
 
    private getInfoRefreshToken: string | null;
    private getInfoUser: UserInfoType | UserLoginType | null;
    private getInfoUserTokens: string | null;
    private getInfoIncome: CategoriesIncomeType[]| null;
    private dateFromAll: string ;
    private dateToAll: string;
    private fromDateElement: HTMLInputElement;
    private beforeDateElement: HTMLInputElement;
    constructor() {
    
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getInfoUser = Auth.getUserInfo();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoIncome = Auth.getIncome();
        this.dateFromAll = '1969-10-29';
        const date = new Date();
        this.dateToAll = date.toISOString().split('T')[0];
        this.fromDateElement = document.getElementById("from-date") as HTMLInputElement;
        this.beforeDateElement = document.getElementById("before-date") as HTMLInputElement;



        console.log(this.getInfoIncome);
        if (this.getInfoUserTokens) {
            this.initBalance();
            this.showUser();
            this.getOperations(this.dateFromAll,this.dateToAll );
        }
        document.getElementById('today')?.addEventListener('click', () => this.setFilter('today'));
        document.getElementById('week')?.addEventListener('click', () => this.setFilter('week'));
        document.getElementById('month')?.addEventListener('click', () => this.setFilter('month'));
        document.getElementById('year')?.addEventListener('click', () => this.setFilter('year'));
        document.getElementById('all')?.addEventListener('click', () => this.setFilter('all'));
        document.getElementById('interval')?.addEventListener('click', () => this.setFilter('interval'));
    }


   private setFilter(currentFilter: string): void {
        this.updateActiveButton(currentFilter)
        this.getDateRange(currentFilter)

    }
   private updateActiveButton(activeFilter: string): void {
        document.querySelectorAll('.btn-actions').forEach(btn => {
            btn.classList.remove('active');
        });
        const button = document.getElementById(`${activeFilter}`);
        if (button) {
            button.classList.add('active');
        }
        
    }
   private getDateRange(currentFilter: string): void {
        const now: Date = new Date();
        let startDate: string, endDate: string ;

        switch (currentFilter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString().split('T')[0];
                this.getOperations(startDate,endDate)
                break;

            case 'week':
                const dayOfWeek = now.getDay();
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                startDate = new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59).toISOString().split('T')[0];
                this.getOperations(startDate,endDate)
                break;

            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString().split('T')[0];
                this.getOperations(startDate,endDate)
                break;

            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString().split('T')[0];
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
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString().split('T')[0];
                this.getOperations(startDate,endDate)
        }

    }








   private async getOperations(from: string, to: string): Promise<void> {
        if (this.getInfoRefreshToken) {
            const result: OperationsIncomeType[] | OperationsExpensesType[] = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom='+ from +' &dateTo='+ to);
            console.log(result);
            if (result) {
                const incomeTransactions:OperationsIncomeType[] = result.filter(item => item.type === "income");
                const expenseTransactions: OperationsExpensesType[] = result.filter(item => item.type === "expense");

                this.initChartIncome(incomeTransactions);
                this.initChartExpenses(expenseTransactions);

            }
        }


    }
  private  async initBalance(): Promise<void> {
        if (this.getInfoRefreshToken) {
            const result: BalanceUserType = await CustomHttp.request(config.host + '/balance');
            if (result) {
                const balance = document.getElementById('balance');
                if (balance) {
                   balance.innerHTML = result.balance + '' + '$';
                }
                
            }
        }
    }

   private showUser(): void {
    if (this.getInfoUser) {
if (this.getInfoUser.name || this.getInfoUser.lastName) {
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
    }
            
        }
    }
        
        // this.btnCategoryElement.addEventListener('click', (e) => {
        //     e.preventDefault();

        //     if (e.target.getAttribute('aria-expanded') === 'true') {
        //         console.log(1)
        //         e.preventDefault();
        //         this.btnCategoryElement.classList.add('active');
        //         this.arrowCategoryElement.style.transform = 'rotate(90deg)';
        //     }

        // });
    }

   private initChartIncome(income: OperationsIncomeType[]): void {

        const incomeLabelsCategory = income.map((item) => {
            return item.category;
        });
        console.log(incomeLabelsCategory);
        const incomeData = income.map((item) => {
            return item.amount;
        })
        const ctx: HTMLCanvasElement | string  = document.getElementById("myChart") as HTMLCanvasElement;

        const existingChart: Chart | undefined = Chart.getChart(ctx);

        if (existingChart) {
            existingChart.destroy();
        }


     const myChart: any =    new Chart(ctx, {
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

   private initChartExpenses(expenses: OperationsExpensesType[]): void {


        const expenseLabelsCategory = expenses.map((item) => {
            return item.category;
        });
        const expenseData = expenses.map((item) => {
            return item.amount;
        })

        const ctx_2 = document.getElementById("myChart_2") as HTMLCanvasElement;

        const existingChart_2: Chart | undefined  = Chart.getChart(ctx_2) ;
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