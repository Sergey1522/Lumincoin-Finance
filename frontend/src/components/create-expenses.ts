import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { BalanceUserType } from "../types/balance-user.type";
import { CategoriesExpensesType } from "../types/categories-expenses.type";
import * as bootstrap from 'bootstrap'

export class CreateExpenses {
  private addNewExpensesElement: HTMLInputElement;
  private buttonCreateExpensesElement: HTMLElement;
  private buttonCancelExpensesElement: HTMLElement;
  private liveToastElement: HTMLElement;
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getInfoExpenses: CategoriesIncomeType[] | null;
  private getInfoUserTokens: string | null;
  private getInfoRefreshToken: string | null;
  constructor() {
    this.addNewExpensesElement = document.getElementById(
      "create-expenses"
    ) as HTMLInputElement;
    this.buttonCreateExpensesElement = document.getElementById(
      "create"
    ) as HTMLElement;
    this.buttonCancelExpensesElement = document.getElementById(
      "cancel"
    ) as HTMLElement;
    this.liveToastElement = document.getElementById("liveToast") as HTMLElement;
    this.getInfoUser = Auth.getUserInfo();
    this.getInfoExpenses = Auth.getExpenses();
    this.getInfoUserTokens = Auth.getTokens();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.showUser();
    this.initBalance();
    console.log(this.getInfoExpenses);
    if (this.getInfoUserTokens) {
      this.createExpenses(this.getInfoExpenses);
      this.cancelCreateExpenses();
    }
  }

  createExpenses(date: CategoriesExpensesType[] | null) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(
      this.liveToastElement
    );
    const toastBody = document.getElementById("toast-body");
    this.buttonCreateExpensesElement.addEventListener("click", (e) => {
      this.newCreateExpenses();
      if (date) {
        for (let i = 0; i < date.length; i++) {
          if (this.addNewExpensesElement.value === date[i].title) {
            toastBootstrap.show();
            if (toastBody) {
              toastBody.textContent = "Такая категория уже есть";
            }
          }
          if (this.addNewExpensesElement.value === "") {
            toastBootstrap.show();
            if (toastBody) {
              toastBody.textContent = "Дайте название категории";
            }
          }
        }
      }
    });
  }

  private cancelCreateExpenses(): void {
    this.buttonCancelExpensesElement.addEventListener("click", () => {
      location.href = "/expenses";
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

 private async newCreateExpenses(): Promise<void> {
    if (this.getInfoUserTokens) {
      try {
        const result: CategoriesExpensesType[] =
          await CustomHttp.request(
            config.host + "/categories/expense",
            "POST",
            {
              title: this.addNewExpensesElement.value,
            }
          );
        console.log(result);
        if (result || (result as CategoriesExpensesType).title || (result as CategoriesExpensesType).id) {
          Auth.setExpenses(result);
        }
        location.href = "/expenses";
      } catch (e) {
        console.log(e);
      }
    }
  }
}
