import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { BalanceUserType } from "../types/balance-user.type";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { UserLoginType } from "../types/user-login.type";

export class Income {
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getInfoUserTokens: string | null;
  private getInfoRefreshToken: string | null;
  constructor() {
    this.getInfoUser = Auth.getUserInfo();
    this.getInfoUserTokens = Auth.getTokens();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.showUser();
    if (this.getInfoUserTokens) {
      this.initIncome();
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

  private async initIncome(): Promise<void> {
    if (this.getInfoUserTokens) {
      try {
        const result: CategoriesIncomeType[] = await CustomHttp.request(
          config.host + "/categories/income"
        );
        if (result.length === 0 || !result) {
          return;
        } else if (
          result ||
          (result as CategoriesIncomeType).id ||
          (result as CategoriesIncomeType).title
        ) {
          Auth.setIncome(result);
          const createIncome: HTMLElement | null =
            document.getElementById("income-action");

          for (let i = 0; i < result.length; i++) {
            const createNewIncome = document.createElement("div");
            createNewIncome.classList.add("income-action");
            createNewIncome.setAttribute("id", result[i].id);
            createNewIncome.innerHTML =
              '<div class="income-action-title">' +
              result[i].title +
              "</div>" +
              '<div class="income-action-btn d-flex gap-4">' +
              '<button role="link" class="btn btn-primary" id="update">Редактировать</button>' +
              '<button role="link" class="btn btn-danger" id="delete">Удалить</button>' +
              "</div>";
            console.log(result[i]);
            console.log(Auth.getIncome());
            if (createIncome) {
              createIncome.appendChild(createNewIncome) as HTMLElement | null;
            }
          }
        }

        const btnDelete: NodeListOf<Element> =
          document.querySelectorAll("#delete");
        const btnUpdate: NodeListOf<Element> =
          document.querySelectorAll("#update");
        console.log(btnDelete);
        for (let i = 0; i < btnDelete.length; i++) {
          btnDelete[i].addEventListener("click", (e: Event) => {
            if (e.target) {
              if ((e.target as HTMLElement).id === "delete") {
                this.showModalIncome(result[i].id);
              }
            }
          });
        }
        for (let i = 0; i < btnUpdate.length; i++) {
          btnUpdate[i].addEventListener("click", (e) => {
            if (e.target) {
              if ((e.target as HTMLElement).id === "update") {
                Auth.setUpdateIncomeId(result[i].id);
                Auth.setUpdateIncomeTitle(result[i].title);

                location.href = "/update-income";
              }
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

 private showModalIncome(id: string): void {
    const modal: HTMLElement | null = document.getElementById("modal");
    if (modal) {
      modal.style.display = "block";
      const that = this;
      modal.addEventListener("click", function (e) {
        if (e.target) {
          if ((e.target as HTMLElement).id.includes("yes")) {
            that.deleteIncome(id).then();
            Auth.removeIncome();
            Auth.removeOperationsCategory();
            location.href = "/income";
          } else if ((e.target as HTMLElement).id.includes("no")) {
            return (modal.style.display = "none");
          }
        }
      });
    }
  }

 public async deleteIncome(id: string) {
    if (this.getInfoRefreshToken) {
      await CustomHttp.request(
        config.host + "/categories/income/" + id,
        "DELETE"
      );
    }
  }
}
