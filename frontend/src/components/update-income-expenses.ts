import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { CategoriesExpensesType } from "../types/categories-expenses.type";
import { OperationsExpensesType } from "../types/operations-expenses.type ";
import { OperationsIncomeType } from "../types/operations-income.type";
import { BalanceUserType } from "../types/balance-user.type";

export class UpdateIncomeExpense {
  private formSelectCategoryUpdate: HTMLInputElement;
  private inputUpdateTypeElement: HTMLInputElement;
  private amountUpdateCategoryElement: HTMLInputElement;
  private dateUpdateCategoryElement: HTMLInputElement;
  private commentsUpdateCategoryElement: HTMLInputElement;
  private btnSaveUpdateOperations: HTMLInputElement;
  private btnNotSaveUpdateOperations: HTMLInputElement;

  private myCreateIncome: CategoriesIncomeType[] | null;
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getInfoRefreshToken: string | null;
  private myCreateExpenses: CategoriesExpensesType[] | null;
  private optionCategory: string|  null;
  private getUpdateOperationsId: string | null;
  private idOperationCategory: number | undefined;
  private resultOperationCategory:  OperationsExpensesType[] | OperationsIncomeType[] | null;
  private titleCategory: string | null;

  constructor() {
    this.formSelectCategoryUpdate = document.getElementById(
      "form-select-category"
    ) as HTMLInputElement;
    this.inputUpdateTypeElement = document.getElementById(
      "type"
    ) as HTMLInputElement;
    this.amountUpdateCategoryElement = document.getElementById(
      "amount"
    ) as HTMLInputElement;
    this.dateUpdateCategoryElement = document.getElementById(
      "date"
    ) as HTMLInputElement;
    this.commentsUpdateCategoryElement = document.getElementById(
      "comments"
    ) as HTMLInputElement;
    this.btnSaveUpdateOperations = document.getElementById(
      "save"
    ) as HTMLInputElement;
    this.btnNotSaveUpdateOperations = document.getElementById(
      "not-save"
    ) as HTMLInputElement;
    this.titleCategory  = null;

    this.myCreateIncome = Auth.getIncome();
    this.getInfoUser = Auth.getUserInfo();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.myCreateExpenses = Auth.getExpenses();
    this.optionCategory = null;
    this.getUpdateOperationsId = Auth.getUpdateOperationsId();
    if (this.getUpdateOperationsId) {
this.idOperationCategory = parseInt(this.getUpdateOperationsId);
    }
    
    this.resultOperationCategory = Auth.getOperationsCategory();
    console.log(this.resultOperationCategory)

    this.initUpdateIncomeExpense(
      this.resultOperationCategory,
      this.idOperationCategory
    );
    this.showUser();
    this.initBalance();
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

 public initUpdateIncomeExpense(data:  OperationsExpensesType[] | OperationsIncomeType[] | null, id: number | undefined): void {
    const res: OperationsExpensesType | OperationsIncomeType | undefined  = (data as OperationsExpensesType[] | OperationsIncomeType[]).find((item) => item.id === id);
    this.inputUpdateTypeElement.value = (res as OperationsExpensesType | OperationsIncomeType).type;
    console.log(res?.category);
    this.titleCategory = String(id);
    this.amountUpdateCategoryElement.value = String((res as OperationsExpensesType | OperationsIncomeType).amount);
    this.dateUpdateCategoryElement.value = (res as OperationsExpensesType | OperationsIncomeType).date;
    this.commentsUpdateCategoryElement.value = (res as OperationsExpensesType | OperationsIncomeType).comment;
  
    if (this.inputUpdateTypeElement.value === "income") {
      this.chooseMyIncome(this.myCreateIncome);
      this.inputUpdateTypeElement.value = "доход";
    }
    if (this.inputUpdateTypeElement.value === "expense") {
      this.chooseMyExpenses(this.myCreateExpenses);
      this.inputUpdateTypeElement.value = "расход";
    }
    this.formSelectCategoryUpdate.addEventListener("change", (event: Event) => {
      this.optionCategory = (event.target as HTMLInputElement).value;
      console.log(this.optionCategory);
    });
     this.btnSaveUpdateOperations.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.saveUpdate(id);
  
    });
    this.btnNotSaveUpdateOperations.addEventListener("click", (e: Event) => {
      location.href = "/income-expenses";
    });
  }
 private chooseMyIncome(incomes: CategoriesIncomeType[] | null): void | null {
    if (incomes) {
      incomes.forEach((income) => {
        const options = document.createElement("option");
        options.setAttribute("value", income.id);
        options.textContent = income.title;
          if (income.title === this.titleCategory) {
            options.selected = true;
          }
        console.log(income.title);
        this.formSelectCategoryUpdate.appendChild(options);
      });
    } else {
      return incomes;
    }
  }
  chooseMyExpenses(expenses :CategoriesExpensesType[] | null): void | null {
    if (expenses) {
      expenses.forEach((expense) => {
        const options = document.createElement("option");
        options.setAttribute("value", expense.id);
        options.textContent = expense.title;
         if (expense.title === this.titleCategory) {
            options.selected = true;
          }
        this.formSelectCategoryUpdate.appendChild(options);
      });
    } else {
      return expenses;
    }
  }

 private async saveUpdate(id: number | undefined): Promise<void> {
  switch (this.inputUpdateTypeElement.value) {
      case 'доход': 
      this.inputUpdateTypeElement.value = 'income';
        break;
        case 'расход':
         this.inputUpdateTypeElement.value = 'expense' ;
         break;
    
      default:
        break;
    }
    if (this.optionCategory) {
const result = await CustomHttp.request(
      config.host + "/operations/" + id,
      "PUT",
      {
        type: this.inputUpdateTypeElement.value,
        amount: parseInt(this.amountUpdateCategoryElement.value),
        date: this.dateUpdateCategoryElement.value,
        comment: this.commentsUpdateCategoryElement.value,
        category_id: parseInt(this.optionCategory),
      }
    );
      if (result) {
      Auth.setOperationsCategory(result);
      location.href = "/income-expenses";
      console.log(result);
    }
    }
  }
}
