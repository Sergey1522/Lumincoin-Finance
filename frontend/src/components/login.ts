import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {Auth} from "../services/auth";
import {UserLoginType} from "../types/user-login.type";

export class Login {
    private emailElement: HTMLInputElement;
    private passwordElement: HTMLInputElement;
    private rememberMeElement: HTMLInputElement;


    constructor() {

        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));

    }


   public validateForm(): boolean {

        let isValid: boolean = true
        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

   private async login(): Promise<void> {
        if (this.validateForm()) {
            try {
                const result: UserLoginType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked,
                });
                if (result) {
                    if (result.error || !result.user) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken , result.tokens.refreshToken)
                    Auth.setUserInfo(result.user);
                }
                const userTokens = localStorage.getItem(Auth.accessTokenKey);

                if (userTokens) {
                    location.href = '/';
                }else {
                    location.href = '/login';
                }

            }catch(err) {
                console.log('error')
            }


        } else {
            console.log('error')
        }
    }
}