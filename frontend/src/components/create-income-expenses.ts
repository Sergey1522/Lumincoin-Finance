import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { CategoriesExpensesType } from "../types/categories-expenses.type";
import { BalanceUserType } from "../types/balance-user.type";

export class CreateIncomeExpense {
  private formSelectCategory: HTMLInputElement;
  private inputTypeElement: HTMLInputElement;
  private amountCategoryElement: HTMLInputElement;
  private dateCategoryElement: HTMLInputElement;
  private commentsCategoryElement: HTMLInputElement;
  private btnCreateElement: HTMLElement;
  private btnCancelElement: HTMLElement;
  private myCreateIncome: CategoriesIncomeType[] | null;
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getInfoRefreshToken: string | null;
  private myCreateExpenses: CategoriesExpensesType[] | null;
  private typeTitle: string | null;
  private optionCategory: string | null;

  constructor() {
    this.formSelectCategory = document.getElementById(
      "form-select-category"
    ) as HTMLInputElement;
    this.inputTypeElement = document.getElementById("type") as HTMLInputElement;
    this.amountCategoryElement = document.getElementById(
      "amount"
    ) as HTMLInputElement;
    this.dateCategoryElement = document.getElementById(
      "date"
    ) as HTMLInputElement;
    this.commentsCategoryElement = document.getElementById(
      "comments"
    ) as HTMLInputElement;
    this.btnCreateElement = document.getElementById("create") as HTMLElement;
    this.btnCancelElement = document.getElementById("cancel") as HTMLElement;
    this.myCreateIncome = Auth.getIncome();
    this.getInfoUser = Auth.getUserInfo();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.myCreateExpenses = Auth.getExpenses();
    this.typeTitle = Auth.getTypeTitleIncomeExpenses();
    this.optionCategory = null;
    this.showUser();
    this.initBalance();

    if (this.typeTitle === "create-income") {
      this.chooseMyIncome(this.myCreateIncome);
      this.inputTypeElement.value = "доход";
    }
    if (this.typeTitle === "create-expense") {
      this.chooseMyExpenses(this.myCreateExpenses);
      this.inputTypeElement.value = "расход";
    }
    this.formSelectCategory.addEventListener("change", (event) => {
      if (event.target) {
        this.optionCategory = (event.target as HTMLInputElement).value;
      }
    });

    this.btnCreateElement.addEventListener("click", (e) => {
      this.initCreate();
    });
    this.btnCancelElement.addEventListener("click", (e) => {
      location.href = "/income-expenses";
    });
  }
  private showUser(): void {
    if (this.getInfoUser) {
      if (this.getInfoUser.name || this.getInfoUser.lastName) {
        const userInfo = document.getElementById("user-info");
        if (userInfo) {
          userInfo.innerHTML =
            this.getInfoUser.name + " " + this.getInfoUser.lastName;
        }
      }
    }
  }

  private async initBalance(): Promise<void> {
    if (this.getInfoRefreshToken) {
      const result: BalanceUserType = await CustomHttp.request(
        config.host + "/balance"
      );
      if (result) {
        const balance = document.getElementById("balance");
        if (balance) {
          balance.innerHTML = result.balance + "" + "$";
        }
      }
    }
  }

  private chooseMyIncome(
    incomes: CategoriesIncomeType[] | null
  ): CategoriesIncomeType[] | null | undefined {
    if (incomes) {
      incomes.forEach((income) => {
        const options: HTMLOptionElement = document.createElement("option");
        options.setAttribute("value", income.id);
        options.textContent = income.title;
        console.log(income.title);
        this.formSelectCategory.appendChild(options);
      });
    } else {
      return incomes;
    }
  }
  chooseMyExpenses(
    expenses: CategoriesExpensesType[] | null
  ): CategoriesExpensesType[] | null | undefined {
    if (expenses) {
      expenses.forEach((expense) => {
        const options: HTMLOptionElement = document.createElement("option");
        options.setAttribute("value", expense.id);
        options.textContent = expense.title;
        this.formSelectCategory.appendChild(options);
      });
    } else {
      return null;
    }
  }

  private async initCreate(): Promise<void> {
    switch (this.inputTypeElement.value) {
      case 'доход': 
      this.inputTypeElement.value = 'income';
        break;
        case 'расход':
         this.inputTypeElement.value = 'expense' ;
         break;
    
      default:
        break;
    }
    if (this.optionCategory) {
      if (this.getInfoRefreshToken) {
        const result = await CustomHttp.request(
          config.host + "/operations",
          "POST",
          {
            type: this.inputTypeElement.value,
            amount: parseInt(this.amountCategoryElement.value),
            date: this.dateCategoryElement.value,
            comment: this.commentsCategoryElement.value,
            category_id: parseInt(this.optionCategory),
          }
        );
        if (result) {
          location.href = "/income-expenses";
        }
      }
    }
  }
}
