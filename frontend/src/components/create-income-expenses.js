import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class CreateIncomeExpense {
    constructor() {
        this.formSelectCategory = document.getElementById('form-select-category');
        this.userInfoElement = document.getElementById("user-info");
        this.inputTypeElement = document.getElementById('type');
        this.amountCategoryElement = document.getElementById('amount');
        this.dateCategoryElement = document.getElementById('date');
        this.commentsCategoryElement = document.getElementById('comments');
        this.btnCreateElement = document.getElementById('create');


        this.myCreateIncome = Auth.getIncome();
        this.getInfoUser = Auth.getUserInfo();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.myCreateExpenses = Auth.getExpenses();
        this.typeTitle = Auth.getTypeTitleIncomeExpenses()
        this.optionCategory = null;
        this.showUser();
        this.initBalance();



        if (this.typeTitle === 'create-income') {
            this.chooseMyIncome(this.myCreateIncome);
            this.inputTypeElement.value = 'income'
        }
        if (this.typeTitle === 'create-expense') {
            this.chooseMyExpenses( this.myCreateExpenses );
            this.inputTypeElement.value = 'expense'
        }
        this.formSelectCategory.addEventListener('change', (event) => {
            this.optionCategory = event.target.value;
        })

        this.btnCreateElement.addEventListener('click', (e) => {
            this.initCreate(this.myCreateIncome);
        })



    }
    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
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



    chooseMyIncome(incomes) {
        if (incomes) {
            incomes.forEach(income => {
                const options = document.createElement("option");
                options.setAttribute('value', income.id);
                options.textContent = income.title;
                console.log(income.title);
                this.formSelectCategory.appendChild(options);
            })
        }else {
            return incomes ;
        }


    }
    chooseMyExpenses(expenses) {
        if (expenses) {
            expenses.forEach(expense => {
                const options = document.createElement("option");
                options.setAttribute('value', expense.id);
                options.textContent = expense.title;
                this.formSelectCategory.appendChild(options);
            })
        }else {
            return expenses;
        }
    }

   async initCreate() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                type: this.inputTypeElement.value,
                amount: parseInt(this.amountCategoryElement.value),
                date: this.dateCategoryElement.value,
                comment: this.commentsCategoryElement.value,
                category_id: parseInt(this.optionCategory),
            });
         if (result) {
             location.href = '/income-expenses';
         }


        }
    }


}