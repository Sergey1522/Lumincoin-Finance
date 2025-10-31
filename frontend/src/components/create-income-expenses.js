import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";

export class CreateIncomeExpense {
    constructor() {
        this.datalistOptions = document.getElementById('datalistOptions');

        this.inputTypeElement = document.getElementById('type');
        this.inputIdCategoryElement = document.getElementById('category');
        this.amountCategoryElement = document.getElementById('amount');
        this.dateCategoryElement = document.getElementById('date');
        this.commentsCategoryElement = document.getElementById('comments');

        this.btnCreateElement = document.getElementById('create');
        this.idChooseCategoryElement = null;


        this.myCreateIncome = Auth.getIncome();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.myCreateExpenses = Auth.getExpenses();
        this.typeTitle = Auth.getTypeTitleIncomeExpenses()



        if (this.typeTitle === 'create-income') {
            this.chooseMyIncome(this.myCreateIncome);
            this.inputTypeElement.value = 'Доход'
        }
        if (this.typeTitle === 'create-expense') {
            this.chooseMyExpenses( this.myCreateExpenses );
            this.inputTypeElement.value = 'Расход'
        }
        this.btnCreateElement.addEventListener('click', (e) => {
            // e.preventDefault();

            this.getIdTitle(this.myCreateIncome);
            this.initCreate();
            console.log(this.inputTypeElement.value);



        })



    }



    chooseMyIncome(incomes) {
        if (incomes.length > 0) {
            incomes.forEach(income => {
                const options = document.createElement("option");
                options.setAttribute('value', income.title);
                console.log(income.title);
                this.datalistOptions.appendChild(options);
            })
        }else {
            return null;
        }


    }
    chooseMyExpenses(expenses) {
        if (expenses.length > 0) {
            expenses.forEach(expense => {
                const options = document.createElement("option");
                options.setAttribute('value', expense.title);
                console.log(expense.title);
                this.datalistOptions.appendChild(options);
            })
        }else {
            return null;
        }
    }

    getIdTitle(data) {
        const item = data.find(obj => obj.title === this.inputIdCategoryElement.value);
        const id = item ? item.id : null;
        this.inputIdCategoryElement.value = id;
        console.log(this.inputIdCategoryElement.value)
    }
   async initCreate() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                type: this.inputTypeElement.value,
                amount: this.amountCategoryElement.value,
                date: this.dateCategoryElement.value,
                comment: this.commentsCategoryElement.value,
                category_id: this.inputIdCategoryElement.value,
            });
            console.log(result)
            console.log(this.inputIdCategoryElement.value)
        }
    }


}