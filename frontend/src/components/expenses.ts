import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class Expenses {
    constructor() {

        this.getInfoUser = Auth.getUserInfo();
        this.userInfoElement = document.getElementById("user-info");
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        if (this.getInfoUserTokens) {
            this.initExpenses();
            this.initBalance();
        }

        console.log(this.userInfoElement)
        console.log(this.getInfoUserTokens)
    }
    showUser() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            this.userInfoElement.innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }
    }


    async initBalance() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                document.getElementById('balance').innerHTML = result.balance + '' + '$';
            }
        }
    }

    async initExpenses() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense');
                if (result.length === 0 || !result) {
                    return;
                } else if (result || result.id || result.title) {
                    Auth.setExpenses(result);
                    const createExpenses = document.getElementById('expenses-action');

                    for (let i = 0; i < result.length; i++) {
                        const createNewExpenses = document.createElement('div');
                        createNewExpenses.classList.add('expenses-action');
                        createNewExpenses.setAttribute('id', result[i].id);
                        createNewExpenses.innerHTML = '<div class="expenses-action-title">' + result[i].title + '</div>' +
                            '<div class="expenses-action-btn d-flex gap-4">' +
                            '<button role="link" class="btn btn-primary" id="update">Редактировать</button>' +
                            '<button role="link" class="btn btn-danger" id="delete">Удалить</button>' +
                            '</div>'
                        console.log(result[i]);
                        createExpenses.appendChild(createNewExpenses);
                    }
                }

                const btnDelete = document.querySelectorAll("#delete");
                const btnUpdate = document.querySelectorAll("#update");
                console.log(btnDelete);
                for (let i = 0; i < btnDelete.length; i++) {
                    btnDelete[i].addEventListener('click', (e) => {
                        if (e.target.id === 'delete') {
                            console.log(e.target)
                            console.log(result[i].id)
                            this.showModalExpenses(result[i].id);
                        }
                    })
                }
                for (let i = 0; i < btnUpdate.length; i++) {
                    btnUpdate[i].addEventListener('click', (e) => {
                        if (e.target.id === 'update') {
                            Auth.setUpdateExpensesId(result[i].id);
                            Auth.setUpdateExpensesTitle(result[i].title);
                            console.log(result[i].id)
                            location.href = '/update-expenses';

                        }
                    })
                }


            } catch (e) {
                console.log(e);
            }

        }

    }


    showModalExpenses(id) {

        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        const that = this
        modal.addEventListener('click', function (e) {
            if (e.target.id.includes('yes')) {
                that.deleteIncome(id).then();
                Auth.removeExpenses();
                location.href = '/expenses';

            } else if (e.target.id.includes('no')) {

                console.log('no');
                return modal.style.display = 'none';
            }
            console.log(e.target.title);
        })

    }


    async deleteIncome(id) {
        if (this.getInfoRefreshToken) {
            await CustomHttp.request(config.host + '/categories/expense/' + id, 'DELETE');
        }

    }


}