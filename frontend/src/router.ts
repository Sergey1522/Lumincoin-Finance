import {Signup} from "./components/signup";
import {Login} from "./components/login";
import {Main} from "./components/main";
import {Auth} from "./services/auth";
import {Income} from "./components/income";
import {CreateIncome} from "./components/create-income";
import {UpdateIncome} from "./components/update-income";
import {Expenses} from "./components/expenses";
import {CreateExpenses} from "./components/create-expenses";
import {UpdateExpenses} from "./components/update-expenses";
import {IncomeExpenses} from "./components/income-expenses";
import {Logout} from "./components/logout";
import {CreateIncomeExpense} from "./components/create-income-expenses";
import {UpdateIncomeExpense} from "./components/update-income-expenses";
import {RouteType} from "./types/route.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: Node | null;
    readonly titleElement: HTMLElement | null;
    private routes: RouteType[];
    constructor() {

        this.contentElement = document.getElementById("content");
        this.stylesElement = document.getElementById("styles");
        this.titleElement = document.getElementById("head-title");
        this.initEvent();

        this.routes = [
            {
                route: "/",
                title: "Главная",
                template: "/templates/main.html",
                styles: "main.css",
                load: () => {
                    new Main();

                },
            },
            {
                route: "/income",
                title: "Доходы",
                template: "/templates/income.html",
                styles: "income.css",
                load: () => {
                    new Income();

                },
            },
            {
                route: "/create-income",
                title: "Создание категории доходов",
                template: "/templates/create-income.html",
                styles: "create-income.css",
                load: () => {
                    new CreateIncome();

                },
            },
            {
                route: "/update-income",
                title: "Редактирование категории доходов",
                template: "/templates/update-income.html",
                styles: "update-income.css",
                load: () => {
                    new UpdateIncome();
                },
            },
            {
                route: "/expenses",
                title: "Расходы",
                template: "/templates/expenses.html",
                styles: "expenses.css",
                load: () => {
                    new Expenses();

                },
            },
            {
                route: "/create-expenses",
                title: "Создание категории расходов",
                template: "/templates/create-expenses.html",
                styles: "create-expenses.css",
                load: () => {
                    new CreateExpenses();
                },
            },
            {
                route: "/update-expenses",
                title: "Редактирование категории расходов",
                template: "/templates/update-expenses.html",
                styles: "update-expenses.css",
                load: () => {
                    new UpdateExpenses();

                },
            },
            {
                route: "/income-expenses",
                title: "Доходы и расходы",
                template: "/templates/income-expenses.html",
                styles: "income-expenses.css",
                load: () => {
                    new IncomeExpenses();

                },
            },
            {
                route: "/create-income-expenses",
                title: "Создание дохода/расхода",
                template: "/templates/create-income-expenses.html",
                styles: "create-income-expenses.css",
                load: () => {
                  new CreateIncomeExpense();

                },
            },
            {
                route: "/update-income-expenses",
                title: "Редактирование дохода/расхода",
                template: "/templates/update-income-expenses.html",
                styles: "update-income-expenses.css",
                load: () => {
                    new UpdateIncomeExpense();

                },
            },

            {
                route: "/signup",
                title: "Регистрация",
                template: "/templates/sign-up.html",
                styles: "sign-up.css",
                load: () => {
                    new Signup();
                },
            },
            {
                route: "/login",
                title: "Авторизоваться",
                template: "/templates/login.html",
                styles: "login.css",
                load: () => {
                    new Login();
                },
            },
            // {
            //     route: '/logout',
            //     load: () => {
            //         new Logout();
            //
            //     }
            // },

        ];
    }
   private initEvent(): void {
      window.addEventListener('DOMContentLoaded', this.activateRouter.bind(this));
      window.addEventListener('popstate', this.activateRouter.bind(this));
    }
  private async activateRouter(): Promise<any> {
        const urlRoute:string  = window.location.pathname;

      let newRoute: RouteType | undefined;
      newRoute = this.routes.find(item => item.route === urlRoute);
        if (!newRoute || newRoute.route ===  '/') {
            await Auth.processUnauthorizedResponse();
        }
        if (newRoute) {
            if (newRoute.title) {
                if (this.titleElement) {
                    this.titleElement.innerHTML = newRoute.title;
                }
            }
            if (newRoute.styles && newRoute.styles.length > 0) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = './styles/' + newRoute.styles;
                    document.head.insertBefore(link, this.stylesElement);

            }
            if (this.contentElement) {
                if (newRoute.template) {
                    this.contentElement.innerHTML = await fetch(newRoute.template).then((response) => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }


        }else {
            console.log('No route');
        }


    }


}
