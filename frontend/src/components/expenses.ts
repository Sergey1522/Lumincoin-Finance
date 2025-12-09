import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { BalanceUserType } from "../types/balance-user.type";
import { CategoriesExpensesType } from "../types/categories-expenses.type";

export class Expenses {
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getInfoUserTokens: string | null;
  private getInfoRefreshToken: string | null;
  constructor() {
    this.getInfoUser = Auth.getUserInfo();
    this.getInfoUserTokens = Auth.getTokens();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.showUser();
    if (this.getInfoUserTokens) {
      this.initExpenses();
      this.initBalance();
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

  private async initExpenses(): Promise<void> {
    if (this.getInfoUserTokens) {
      try {
        const result: CategoriesExpensesType[] = await CustomHttp.request(
          config.host + "/categories/expense"
        );
        if (result.length === 0 || !result) {
          return;
        } else if (
          result ||
          (result as CategoriesExpensesType).id ||
          (result as CategoriesExpensesType).title
        ) {
          Auth.setExpenses(result);
          const createExpenses = document.getElementById("expenses-action");

          for (let i = 0; i < result.length; i++) {
            const createNewExpenses = document.createElement("div");
            createNewExpenses.classList.add("expenses-action");
            createNewExpenses.setAttribute("id", result[i].id);
            createNewExpenses.innerHTML =
              '<div class="expenses-action-title">' +
              result[i].title +
              "</div>" +
              '<div class="expenses-action-btn d-flex gap-4">' +
              '<button role="link" class="btn btn-primary" id="update">Редактировать</button>' +
              '<button role="link" class="btn btn-danger" id="delete">Удалить</button>' +
              "</div>";
            if (createExpenses) {
              createExpenses.appendChild(createNewExpenses);
            }
          }
        }

        const btnDelete = document.querySelectorAll("#delete");
        const btnUpdate = document.querySelectorAll("#update");
        console.log(btnDelete);
        for (let i = 0; i < btnDelete.length; i++) {
          btnDelete[i].addEventListener("click", (e) => {
            if (e.target) {
              if ((e.target as HTMLElement).id === "delete") {
                console.log(e.target);
                console.log(result[i].id);
                this.showModalExpenses(result[i].id);
              }
            }
          });
        }
        for (let i = 0; i < btnUpdate.length; i++) {
          btnUpdate[i].addEventListener("click", (e) => {
            if (e.target) {
              if ((e.target as HTMLElement).id === "update") {
                Auth.setUpdateExpensesId(result[i].id);
                Auth.setUpdateExpensesTitle(result[i].title);
                console.log(result[i].id);
                location.href = "/update-expenses";
              }
              if ((e.target as HTMLElement).id === "update") {
                Auth.setUpdateExpensesId(result[i].id);
                Auth.setUpdateExpensesTitle(result[i].title);
                console.log(result[i].id);
                location.href = "/update-expenses";
              }
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  private showModalExpenses(id: string): void {
    const modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "block";
      const that = this;
      modal.addEventListener("click", function (e) {
        if (e.target) {
          if ((e.target as HTMLElement).id.includes("yes")) {
            that.deleteIncome(id).then();
            Auth.removeExpenses();
            location.href = "/expenses";
          } else if ((e.target as HTMLElement).id.includes("no")) {
            console.log("no");
            return (modal.style.display = "none");
          }
        }

      });
    }
  }

 private async deleteIncome(id: string): Promise<void> {
    if (this.getInfoRefreshToken) {
      await CustomHttp.request(
        config.host + "/categories/expense/" + id,
        "DELETE"
      );
    }
  }
}
