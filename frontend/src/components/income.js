import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class Income {
    constructor() {

        this.getInfoUser = Auth.getUserInfo();
        this.userInfoElement = document.getElementById("user-info");
        this.getInfoUserTokens = Auth.getTokens();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.showUser();
        if (this.getInfoUserTokens) {
            this.initIncome();
            this.initBalance();
        }

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

    async initIncome() {
        if (this.getInfoUserTokens) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/income');
                if (result.length === 0 || !result) {
                    // this.initIncome().then();
                    return;
                } else if (result || result.id || result.title) {
                    Auth.setIncome(result);
                    const createIncome = document.getElementById('income-action');

                    for (let i = 0; i < result.length; i++) {
                        const createNewIncome = document.createElement('div');
                        createNewIncome.classList.add('income-action');
                        createNewIncome.setAttribute('id', result[i].id);
                        createNewIncome.innerHTML = '<div class="income-action-title">' + result[i].title + '</div>' +
                            '<div class="income-action-btn d-flex gap-4">' +
                            '<button role="link" class="btn btn-primary" id="update">Редактировать</button>' +
                            '<button role="link" class="btn btn-danger" id="delete">Удалить</button>' +
                            '</div>'
                        console.log(result[i]);
                        createIncome.appendChild(createNewIncome);
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
                            console.log(result[i].title)
                            this.showModalIncome(result[i].id);
                        }
                    })
                }
                for (let i = 0; i < btnUpdate.length; i++) {
                    btnUpdate[i].addEventListener('click', (e) => {
                        if (e.target.id === 'update') {
                            Auth.setUpdateIncomeId(result[i].id);
                            Auth.setUpdateIncomeTitle(result[i].title);

                            location.href = '/update-income';

                        }
                    })
                }


            } catch (e) {
                console.log(e);
            }

        }

    }


    showModalIncome(id) {
        console.log(id)
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
        const that = this
        modal.addEventListener('click', function (e) {
            if (e.target.id.includes('yes')) {
                that.deleteIncome(id).then();
                Auth.removeIncome();
                location.href = '/income';

            } else if (e.target.id.includes('no')) {

                console.log('no');
                return modal.style.display = 'none';
            }
            console.log(e.target.title);
        })

    }


    async deleteIncome(id) {
        if (this.getInfoRefreshToken) {
            await CustomHttp.request(config.host + '/categories/income/' + id, 'DELETE');
        }

    }


}