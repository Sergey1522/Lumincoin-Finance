import {Signup} from "./components/signup.js";
import {Login} from "./components/login";

export class Router {
    constructor() {

        this.contentElement = document.getElementById("content");
        this.stylesElement = document.getElementById("styles");
        this.titleElement = document.getElementById("head-title");
        this.initEvent();

        this.routes = [

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
        ];
    }
    initEvent() {
      window.addEventListener('DOMContentLoaded', this.activateRouter.bind(this));
      window.addEventListener('popstate', this.activateRouter.bind(this));
    }
   async activateRouter() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find((item) => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.title) {
                this.titleElement.innerHTML = newRoute.title;
            }
            if (newRoute.styles && newRoute.styles.length > 0) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = './styles/' + newRoute.styles;
                    document.head.insertBefore(link, this.stylesElement);

            }
            if (newRoute.template) {
                this.contentElement.innerHTML = await fetch(newRoute.template).then((response) => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }


        }else {
            console.log('No route');
        }


    }


}
