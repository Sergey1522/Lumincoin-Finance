import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { BalanceUserType } from "../types/balance-user.type";

export class UpdateIncome {
  private updateIncomeElement: HTMLInputElement;
  private buttonUpdateSaveElement: HTMLElement;
  private buttonUpdateNotSaveElement: HTMLElement;
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getUpdateIncomeId: string | null;
  private getInfoUserTokens: string | null;
  private getInfoRefreshToken: string | null;
  private getUpdateIncomeTitle: string | null;

  constructor() {
    this.updateIncomeElement = document.getElementById(
      "update-income"
    ) as HTMLInputElement;
    this.buttonUpdateSaveElement = document.getElementById(
      "save"
    ) as HTMLElement;
    this.buttonUpdateNotSaveElement = document.getElementById(
      "not-save"
    ) as HTMLElement;
    this.getUpdateIncomeTitle = Auth.getUpdateIncomeTitle();
    if (this.getUpdateIncomeTitle) {
      this.updateIncomeElement.value = this.getUpdateIncomeTitle;
    }

    this.getInfoUser = Auth.getUserInfo();
    this.getUpdateIncomeId = Auth.getUpdateIncomeId();
    this.getInfoUserTokens = Auth.getTokens();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.showUser();
    this.initBalance();
    this.saveUpdateIncome();
    this.notSaveUpdateIncome();
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
  notSaveUpdateIncome() {
    if (this.getInfoRefreshToken) {
      this.buttonUpdateNotSaveElement.addEventListener("click", () => {
        location.href = "/income";
      });
    }
  }
  saveUpdateIncome() {
    if (this.getInfoRefreshToken) {
      this.buttonUpdateSaveElement.addEventListener("click", () => {
        this.newUpdateIncome().then();
      });
    }
  }

 private async newUpdateIncome(): Promise<void> {
    if (this.getInfoUserTokens) {
      try {
        const result: CategoriesIncomeType[] = await CustomHttp.request(
          config.host + "/categories/income/" + this.getUpdateIncomeId,
          "PUT",
          {
            title: this.updateIncomeElement.value,
          }
        );
        console.log(result);
        if (result || (result as CategoriesIncomeType).title || (result as CategoriesIncomeType).id) {
          Auth.setIncome(result);
        }
        location.href = "/income";
      } catch (e) {
        console.log(e);
      }
    }
  }
}
