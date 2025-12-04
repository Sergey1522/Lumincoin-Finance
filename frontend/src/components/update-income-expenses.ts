import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";

export class UpdateIncomeExpense {
    constructor() {
        this.formSelectCategoryUpdate = document.getElementById('form-select-category');
        this.userInfoElement = document.getElementById("user-info");
        this.inputUpdateTypeElement = document.getElementById('type');
        this.amountUpdateCategoryElement = document.getElementById('amount');
        this.dateUpdateCategoryElement = document.getElementById('date');
        this.commentsUpdateCategoryElement = document.getElementById('comments');
        this.btnSaveUpdateOperations = document.getElementById('save');
        this.btnNotSaveUpdateOperations = document.getElementById('not-save');
        console.log(this.commentsUpdateCategoryElement.value)

        this.myCreateIncome = Auth.getIncome();
        this.getInfoUser = Auth.getUserInfo();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.myCreateExpenses = Auth.getExpenses();
        this.optionCategory = null;
        this.idOperationCategory = parseInt(Auth.getUpdateOperationsId()) ;
        this.resultOperationCategory = Auth.getOperationsCategory();
        console.log(this.resultOperationCategory);
        this.initUpdateIncomeExpense(this.resultOperationCategory, this.idOperationCategory);
        this.showUser();
        this.initBalance();



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
    initUpdateIncomeExpense(data, id) {

        const res = data.find(item => item.id === id);
        this.inputUpdateTypeElement.value = res.type;
        this.amountUpdateCategoryElement.value = res.amount;
        this.dateUpdateCategoryElement.value = res.date;
        this.commentsUpdateCategoryElement.value = res.comment;

        this.btnSaveUpdateOperations.addEventListener('click', (e) => {
            e.preventDefault();
          this.saveUpdate(id)
            console.log(this.amountUpdateCategoryElement.value)
        });
        this.btnNotSaveUpdateOperations.addEventListener('click', (e) => {
            location.href = '/income-expenses';
        })



        if (this.inputUpdateTypeElement.value === 'income') {
            this.chooseMyIncome(this.myCreateIncome);
            this.inputUpdateTypeElement.value = 'income'
        }
        if (this.inputUpdateTypeElement.value === 'expense') {
            this.chooseMyExpenses( this.myCreateExpenses );
            this.inputUpdateTypeElement.value = 'expense'
        }
        this.formSelectCategoryUpdate.addEventListener('change', (event) => {
            this.optionCategory = event.target.value;
        });

    }
    chooseMyIncome(incomes) {
        if (incomes) {
            incomes.forEach(income => {
                const options = document.createElement("option");
                options.setAttribute('value', income.id);
                options.textContent = income.title;
                console.log(income.title);
                this.formSelectCategoryUpdate.appendChild(options);
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
                this.formSelectCategoryUpdate.appendChild(options);
            })
        }else {
            return expenses;
        }
    }

   async saveUpdate(id) {
        const result = await CustomHttp.request(config.host + '/operations/' + id, 'PUT', {
            type: this.inputUpdateTypeElement.value,
            amount: parseInt(this.amountUpdateCategoryElement.value),
            date: this.dateUpdateCategoryElement.value,
            comment: this.commentsUpdateCategoryElement.value,
            category_id: parseInt(this.optionCategory),
        });
        if (result) {
            Auth.setOperationsCategory(result)
            location.href = '/income-expenses';
            console.log(result);
        }

    }
}