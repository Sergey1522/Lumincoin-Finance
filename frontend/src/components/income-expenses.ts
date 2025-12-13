import { Auth } from "../services/auth";
import { CustomHttp } from "../services/custom-http";
import { config } from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { OperationsExpensesType } from "../types/operations-expenses.type ";
import { OperationsIncomeType } from "../types/operations-income.type";
import { BalanceUserType } from "../types/balance-user.type";

export class IncomeExpenses {
  private modalElement: HTMLElement;
  private fromDateElement: HTMLInputElement;
  private beforeDateElement: HTMLInputElement;
  private actionsBtnElement: NodeListOf<Element>;
  private dateFrom: string | null;
  private dateTo: string | null;
  private dateFromAll: string;
  private dateToAll: string;
  private getInfoUser: UserInfoType | UserLoginType | null;
  private getInfoRefreshToken: string | null;
  constructor() {
    this.modalElement = document.getElementById("modal") as HTMLElement;
    this.fromDateElement = document.getElementById(
      "from-date"
    ) as HTMLInputElement;
    this.beforeDateElement = document.getElementById(
      "before-date"
    ) as HTMLInputElement;
    this.actionsBtnElement = document.querySelectorAll(".actions-button a");
    this.dateFrom = null;
    this.dateTo = null;
    this.dateFromAll = "1969-10-29";
    const date = new Date();
    this.dateToAll = date.toISOString().split("T")[0];

    this.actionsBtnElement.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target) {
          Auth.setTypeTitleIncomeExpenses((e.target as HTMLElement).id);
        }
      });
    });

    this.getInfoUser = Auth.getUserInfo();
    this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
    this.initBalance();
    this.showUser();
    this.getOperations(this.dateFromAll, this.dateToAll);

      (document.getElementById("today") as HTMLElement)
        .addEventListener("click", () => this.setFilter("today"));
 

    (document.getElementById("week") as HTMLElement)
      .addEventListener("click", () => this.setFilter("week"));
   (document.getElementById("month") as HTMLElement)
      .addEventListener("click", () => this.setFilter("month"));
   (document.getElementById("year") as HTMLElement)
      .addEventListener("click", () => this.setFilter("year"));
    (document.getElementById("all") as HTMLElement)
      .addEventListener("click", () => this.setFilter("all"));
  (document.getElementById("interval") as HTMLElement)
      .addEventListener("click", () => this.setFilter("interval"));
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

 private setFilter(currentFilter: string): void {
    this.updateActiveButton(currentFilter);
    this.getDateRange(currentFilter);
  }
 private updateActiveButton(activeFilter: string): void {
    document.querySelectorAll(".btn-actions").forEach((btn) => {
      btn.classList.remove("active");
    });
    (document.getElementById(`${activeFilter}`) as HTMLElement).classList.add("active");
  }
 private getDateRange(currentFilter: string): void {
    const now = new Date();
    let startDate: string, endDate: string;

    switch (currentFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          .toISOString()
          .split("T")[0];
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        )
          .toISOString()
          .split("T")[0];
        this.getOperations(startDate, endDate);
        break;

      case "week":
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate = new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0];
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          diff + 6,
          23,
          59,
          59
        ).toISOString().split('T')[0];
        this.getOperations(startDate, endDate);
        break;

      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        ).toISOString().split('T')[0];
        this.getOperations(startDate, endDate);
        break;

      case "year":
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString().split('T')[0];
        this.getOperations(startDate, endDate);
        break;

      case "all":
        startDate = this.dateFromAll;
        endDate = this.dateToAll;
        this.getOperations(startDate, endDate);
        break;
      case "interval":
        startDate = this.fromDateElement.value;
        endDate = this.beforeDateElement.value;
        if (startDate === "" && endDate === "") {
          return;
        } else {
          this.getOperations(startDate, endDate);
        }
        break;

      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        ).toISOString().split('T')[0];
        this.getOperations(startDate, endDate);
    }
  }
 private async getOperations(from: string, to: string): Promise<void> {
    if (this.getInfoRefreshToken) {
      const result: OperationsExpensesType[] | OperationsIncomeType[] = await CustomHttp.request(
        config.host +
          "/operations?period=interval&dateFrom=" +
          from +
          "&dateTo=" +
          to
      );
      if (result) {
        Auth.setOperationsCategory(result);
      }
      this.showRecords(result);
    }
  }

 private showRecords(data: OperationsExpensesType[] | OperationsIncomeType[]): void {
    console.log(data);
    const recordsElement: HTMLElement | null = document.getElementById("records");

    (recordsElement as HTMLElement).innerHTML = "";
    if (!data || data.length === 0) {
      (recordsElement as HTMLElement).innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Нет данных для отображения
                </td>
            </tr>
        `;
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const date = data[i].date;
      const result = date.split("-").reverse().join(".");
      let rusTransType: string | null = null;
      if (data[i].type === "income") {
        rusTransType = "доход";
      }
      if (data[i].type === "expense") {
        rusTransType = "расход";
      }
      const trElement  = document.createElement("tr");
      trElement.setAttribute("scope", "col");
      trElement.classList.add("text-center");
      trElement.insertCell().textContent = String(i + 1);
      if (rusTransType) {
        trElement.insertCell().innerText = rusTransType;
      }
      trElement.insertCell().innerText = String(data[i].category);
      trElement.insertCell().innerText = data[i].amount + "$";
      trElement.insertCell().innerText = result;
      trElement.insertCell().innerText = data[i].comment;
      trElement.insertCell().innerHTML =
        '<a href="javascript:void(0)"  class="link me-2" id="delete">' +
        '<i class="bi bi-trash" id="' +
        data[i].id +
        '"></i>' +
        "</a>" +
        '<a href="javascript:void(0)" class="link" id="update">' +
        '<i class="bi bi-pencil" id="' +
        data[i].id +
        '"></i>' +
        "</a>";
        
      (recordsElement as HTMLElement).appendChild(trElement);
    }
    const td = document.querySelectorAll("td");
    td.forEach((el) => {
      if (el.innerText === "доход") {
        el.classList.add("text-success");
      }
      if (el.innerText === "расход") {
        el.classList.add("text-danger");
      }
    });

    const iconDelete = document.querySelectorAll("a#delete");
    const iconUpdate = document.querySelectorAll("a#update");
    const that = this;
    iconDelete.forEach((e) => {
      e.addEventListener("click", (e: Event) => {
        let id = (e.target as HTMLElement).id;
        this.modalElement.style.display = "block";
        this.modalElement.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).id.includes("yes")) {
            that.deleteOperation(id);
            Auth.removeOperationsCategory();
            location.href = "/income-expenses";
          } else if ((e.target as HTMLElement).id.includes("no")) {
            console.log("no");
            return (this.modalElement.style.display = "none");
          }
        });
      });
    });
    iconUpdate.forEach((e) => {
      e.addEventListener("click", (e: Event) => {
        if (e.target) {
          let id: string = (e.target as HTMLElement).id;
          if (id) {
            Auth.setUpdateOperationsId(id);
          }
        }

        location.href = "/update-income-expenses";
      });
    });
  }

  async deleteOperation(id: string) {
    await CustomHttp.request(
      config.host + "/operations/" + parseInt(id),
      "DELETE"
    );
  }
}
