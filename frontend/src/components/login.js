export class Login {
    constructor() {

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));

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

    async signUp() {
        if (this.validateForm()) {
            const result = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,


                })
            }) .then((response) => response.json())
            console.log(result);
        } else {
            console.log('error')
        }


    }
}