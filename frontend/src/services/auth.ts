import {config} from "../../config/config";
import { CategoriesExpensesType } from "../types/categories-expenses.type";
import { CategoriesIncomeType } from "../types/categories-income.type";
import { UserInfoType } from "../types/user-info.type";
// import { UserInfoType } from "../types/user-info.type";
import { UserLoginType } from "../types/user-login.type";


export class Auth {
    static accessTokenKey: string = 'accessToken';
    static refreshTokenKey: string  = 'refreshToken';
    static userInfoKey: string  = 'userInfo';
    static newIncomeKey: string  = 'newIncome';
    static newExpensesKey: string = 'newExpenses';
    static idIncomeKey: string = 'id';
    static titleIncomeKey: string = 'titleIncome';
    static titleExpensesKey: string = 'titleExpenses';
    static idExpensesKey: string = 'id';
    static typeTitle: string = 'typeTitle';
    static resultOperationsCategory: string = 'resultOperationsCategory';
    static idOperationsCategory: string = 'idOperationsCategory';


   public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {

                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})

            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '/signup';
        return false;

    }




   public static setTokens (accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
    }
   public static getTokens(): string | null {
       return  localStorage.getItem(this.accessTokenKey);
       return  localStorage.getItem(this.refreshTokenKey);

    }

   public static removeTokens (): void {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
    }
   public static setUserInfo(info: UserLoginType | UserInfoType): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

   public static getUserInfo(): UserLoginType | UserInfoType |null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo)
        }
        return null;
    }
    static removeUserInfo(): void {
         localStorage.removeItem(this.userInfoKey);
    }
    public static setIncome(income: CategoriesIncomeType[]): void {
        localStorage.setItem(this.newIncomeKey, JSON.stringify(income));
    }
    public static getIncome(): CategoriesIncomeType[] | null {
        const incomeInfo: string | null = localStorage.getItem(this.newIncomeKey);
        if (incomeInfo) {
            return JSON.parse(incomeInfo)
        }
        return null;
    }
    public static removeIncome(): void {
         localStorage.removeItem(this.newIncomeKey);
    }



    public static setUpdateIncomeId(id: string): void {
        localStorage.setItem(this.idIncomeKey, id);
    }
    public static setUpdateIncomeTitle(titleIncome: string): void {
        localStorage.setItem(this.titleIncomeKey, titleIncome);
    }
    public static getUpdateIncomeId(): string | null {
        return localStorage.getItem(this.idIncomeKey);
    }
    public static getUpdateIncomeTitle(): string | null {
        return localStorage.getItem(this.titleIncomeKey);
    }


    public static setExpenses(expenses: CategoriesExpensesType[]): void {
        localStorage.setItem(this.newExpensesKey, JSON.stringify(expenses));
    }
    public static getExpenses(): string | null {
        const expensesInfo: string | null = localStorage.getItem(this.newExpensesKey);
        if (expensesInfo) {
            return JSON.parse(expensesInfo)
        }
        return null;
    }
    public static removeExpenses(): void {
         localStorage.removeItem(this.newExpensesKey);
    }




    public static setUpdateExpensesId(id: string): void {
        localStorage.setItem(this.idExpensesKey, id);
    }
    public static getUpdateExpensesId(): string | null {
        return localStorage.getItem(this.idExpensesKey);
    }
    public static setUpdateExpensesTitle(titleExpenses: string): void {
        localStorage.setItem(this.titleExpensesKey, titleExpenses);
    }
    public static getUpdateExpensesTitle(): string | null {
        return localStorage.getItem(this.titleExpensesKey);
    }

    public static setTypeTitleIncomeExpenses(typeTitle: string): void {
        localStorage.setItem(this.typeTitle, typeTitle);
    }
    public static getTypeTitleIncomeExpenses(): string | null {
        return localStorage.getItem(this.typeTitle);
    }




    static setOperationsCategory(data) {
        localStorage.setItem(this.resultOperationsCategory, JSON.stringify(data));
    }
    static getOperationsCategory() {
        const resultOperationsCategory = localStorage.getItem(this.resultOperationsCategory);
        if (resultOperationsCategory) {
            return  JSON.parse(resultOperationsCategory);
        }
        return null;
    }
    static removeOperationsCategory() {
        return localStorage.removeItem(this.resultOperationsCategory);
    }


    static setUpdateOperationsId(id) {
        localStorage.setItem(this.idOperationsCategory, id);
    }
    static getUpdateOperationsId() {
        return localStorage.getItem(this.idOperationsCategory);
    }



}