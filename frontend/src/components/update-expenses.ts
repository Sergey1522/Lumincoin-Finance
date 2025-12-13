import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { BalanceUserType } from "../types/balance-user.type";
import { CategoriesExpensesType } from "../types/categories-expenses.type";

export class UpdateExpenses {
  private updateExpensesElement: HTMLInputElement;
  private buttonSaveUpdateElement: HTMLElement;
  private buttonNotSaveUpdateElement: HTMLElement;
  private getUpdateExpenses: string | null;
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getUpdateExpensesId: string | null;
  private getInfoUserTokens: string | null;
  private getInfoRefreshToken: string | null;
  constructor() {
    this.updateExpensesElement = document.getElementById("update-expenses") as HTMLInputElement;
    this.buttonSaveUpdateElement = document.getElementById("save") as HTMLElement;
    this.buttonNotSaveUpdateElement = document.getElementById("not-save") as HTMLElement;
    this.getUpdateExpenses = Auth.getUpdateExpensesTitle();
    if (this.getUpdateExpenses) {
      this.updateExpensesElement.value = this.getUpdateExpenses;
    }

    this.getInfoUser = Auth.getUserInfo();
    this.getUpdateExpensesId = Auth.getUpdateIncomeId();
    this.getInfoUserTokens = Auth.getTokens();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.showUser();
    this.initBalance();
    this.saveUpdateExpenses();
    this.notSaveUpdateExpenses();

    console.log(Auth.getUpdateExpensesTitle());
  }
 private notSaveUpdateExpenses(): void {
    if (this.getInfoRefreshToken) {
      this.buttonNotSaveUpdateElement.addEventListener("click", () => {
        location.href = "/expenses";
      });
    }
  }
 private saveUpdateExpenses(): void {
    if (this.getInfoRefreshToken) {
      this.buttonSaveUpdateElement.addEventListener("click", () => {
        this.newUpdateExpenses();
      });
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
 private async newUpdateExpenses(): Promise<void> {
    if (this.getInfoUserTokens) {
      try {
        const result: CategoriesExpensesType[] = await CustomHttp.request(
          config.host + "/categories/expense/" + this.getUpdateExpensesId,
          "PUT",
          {
            title: this.updateExpensesElement.value,
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
