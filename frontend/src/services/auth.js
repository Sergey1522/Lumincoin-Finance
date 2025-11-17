import {config} from "../../config/config";
import {CustomHttp} from "./custom-http";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';
    static newIncomeKey = 'newIncome';
    static newExpensesKey = 'newExpenses';
    static idIncomeKey = 'id';
    static titleIncomeKey = 'titleIncome';
    static titleExpensesKey = 'titleExpenses';
    static idExpensesKey = 'id';
    static typeTitle = 'typeTitle';
    static resultOperationsCategory = 'resultOperationsCategory';
    static idOperationsCategory = 'idOperationsCategory';
    static arrayOperationsCategory = [];

    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {

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
                    // window.location.href = '/';
                    return true;

                }
            }
        }
        this.removeTokens();
        location.href = '/signup';
        return false;

    }




    static setTokens (accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
    }
    static getTokens() {
       return  localStorage.getItem(this.accessTokenKey);
       return  localStorage.getItem(this.refreshTokenKey);

    }

    static removeTokens () {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
    }
    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo)
        }
        return null;
    }
    static removeUserInfo() {
        return localStorage.removeItem(this.userInfoKey);
    }
    static setIncome(income) {
        localStorage.setItem(this.newIncomeKey, JSON.stringify(income));
    }
    static getIncome() {
        const incomeInfo = localStorage.getItem(this.newIncomeKey);
        if (incomeInfo) {
            return JSON.parse(incomeInfo)
        }
        return null;
    }
    static removeIncome() {
        return localStorage.removeItem(this.newIncomeKey);
    }



    static setUpdateIncomeId(id) {
        localStorage.setItem(this.idIncomeKey, id);
    }
    static setUpdateIncomeTitle(titleIncome) {
        localStorage.setItem(this.titleIncomeKey, titleIncome);
    }
    static getUpdateIncomeId() {
        return localStorage.getItem(this.idIncomeKey);
    }
    static getUpdateIncomeTitle() {
        return localStorage.getItem(this.titleIncomeKey);
    }


    static setExpenses(expenses) {
        localStorage.setItem(this.newExpensesKey, JSON.stringify(expenses));
    }
    static getExpenses() {
        const expensesInfo = localStorage.getItem(this.newExpensesKey);
        if (expensesInfo) {
            return JSON.parse(expensesInfo)
        }
        return null;
    }
    static removeExpenses() {
        return localStorage.removeItem(this.newExpensesKey);
    }




    static setUpdateExpensesId(id) {
        localStorage.setItem(this.idExpensesKey, id);
    }
    static getUpdateExpensesId() {
        return localStorage.getItem(this.idExpensesKey);
    }
    static setUpdateExpensesTitle(titleExpenses) {
        localStorage.setItem(this.titleExpensesKey, titleExpenses);
    }
    static getUpdateExpensesTitle() {
        return localStorage.getItem(this.titleExpensesKey);
    }

    static setTypeTitleIncomeExpenses(typeTitle) {
        localStorage.setItem(this.typeTitle, typeTitle);
    }
    static getTypeTitleIncomeExpenses() {
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