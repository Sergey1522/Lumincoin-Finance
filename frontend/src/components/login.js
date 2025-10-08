import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";
import {Auth} from "../services/auth";

export class Login {
    constructor() {

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMe = document.getElementById('remember-me');

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));

    }


    validateForm() {

        let isValid = true
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

    async login() {
        if (this.validateForm()) {
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                });
                if (result) {
                    if (result.error || !result.user) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.accessToken , result.refreshToken)
                    // location.href = '/'
                }
                console.log(result);


            }catch(err) {
                console.log('error')
            }



        } else {
            console.log('error')
        }
    }
}