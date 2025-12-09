import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { BalanceUserType } from "../types/balance-user.type";




export class CreateIncome {
    private addNewIncomeElement: HTMLInputElement;
    private buttonCreateElement: HTMLElement;
    private buttonCancelElement: HTMLElement;
    private liveToastElement: HTMLElement;
    private getInfoUser: UserInfoType | UserLoginType | null;
    private getInfoIncome: CategoriesIncomeType[] | null;
    private getInfoUserTokens: string | null;
    private getInfoRefreshToken: string | null;

    constructor() {
        this.addNewIncomeElement = document.getElementById("create-income") as HTMLInputElement;
        this.buttonCreateElement = document.getElementById("create") as HTMLElement;
        this.buttonCancelElement = document.getElementById("cancel") as HTMLElement;
        this.liveToastElement = document.getElementById('liveToast') as HTMLElement;
        this.getInfoUser = Auth.getUserInfo();
        this.getInfoIncome = Auth.getIncome();
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        this.createIncome(this.getInfoIncome);
        this.cancelCreateIncome();
        this.initBalance();


    }

   private createIncome(date: CategoriesIncomeType[] | null): void {
        
        const toastBootstrap =  bootstrap.Toast.getOrCreateInstance(this.liveToastElement);
        const toastBody = document.getElementById('toast-body');
        this.buttonCreateElement.addEventListener("click", (e) => {
            this.newCreateIncome();
            if (date) {
                for (let i = 0; i < date.length; i++) {
                    if (this.addNewIncomeElement.value === date[i].title) {
                        toastBootstrap.show();
                        if (toastBody) {
                            toastBody.textContent = 'Такая категория уже есть';
                        }
                        
                    }
                    if (this.addNewIncomeElement.value === '') {
                        toastBootstrap.show();
                        if (toastBody) {
                             toastBody.textContent = 'Дайте название категории';
                        }
                       
                    }
                }

            }
        })


    }

   private cancelCreateIncome(): void {
        this.buttonCancelElement.addEventListener("click", () => {
            location.href = '/income'
        })
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

   private async newCreateIncome(): Promise<void> {
        if (this.getInfoUserTokens) {
            try {
                const result: CategoriesIncomeType[] = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                    title: this.addNewIncomeElement.value,
                });
                if (result || (result as CategoriesIncomeType).title || (result as CategoriesIncomeType).id) {
                
                        Auth.setIncome(result);
                }
                location.href = '/income';


            } catch (e) {
                console.log(e);
            }

        }


    }


}