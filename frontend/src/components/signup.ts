import {config} from "../../config/config";
import {CustomHttp} from "../services/custom-http";

export class Signup {
    private nameElement: HTMLInputElement;
    private lastNameElement: HTMLInputElement;
    private emailElement: HTMLInputElement;
    private passwordElement: HTMLInputElement;
    private passwordRepeatElement: HTMLInputElement;
    private commonErrorElement: HTMLElement;

    constructor() {
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.lastNameElement = document.getElementById('last-name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

    }


   public validateForm(): boolean {

        let isValid: boolean = true

        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }


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

        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;

    }

   private async signUp():Promise<void> {
        if (this.validateForm()) {
            try {
                const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                    name: this.nameElement.value,
                    lastName: this.lastNameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value,
                });
                if (result) {
                    if (result.error || !result.user) {
                        this.commonErrorElement.style.display = 'block';
                        throw new Error(result.message);
                    }
                    location.href = '/login';
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