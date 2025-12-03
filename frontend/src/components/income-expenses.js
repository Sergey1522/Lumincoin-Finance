import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";



export class IncomeExpenses {
    constructor() {
        this.modalElement = document.getElementById('modal');
        this.userInfoElement = document.getElementById("user-info");
        this.fromDateElement = document.getElementById("from-date");
        this.beforeDateElement = document.getElementById("before-date");
        this.actionsBtnElement = document.querySelectorAll('.actions-button a');
        this.dateFrom = null;
        this.dateTo = null;
        console.log(this.dateFrom)
        console.log(this.dateTo)
        this.dateFromAll = '1969-10-29';
        const date = new Date();
        this.dateToAll = date.toISOString().split('T')[0];



        this.actionsBtnElement.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                Auth.setTypeTitleIncomeExpenses(e.target.id)

            })
        })



        this.getInfoUser = Auth.getUserInfo();
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.initBalance();
        this.showUser();
        this.getOperations(this.dateFromAll, this.dateToAll);


        document.getElementById('today').addEventListener('click', () => this.setFilter('today'));
        document.getElementById('week').addEventListener('click', () => this.setFilter('week'));
        document.getElementById('month').addEventListener('click', () => this.setFilter('month'));
        document.getElementById('year').addEventListener('click', () => this.setFilter('year'));
        document.getElementById('all').addEventListener('click', () => this.setFilter('all'));
        document.getElementById('interval').addEventListener('click', () => this.setFilter('interval'));

    }




    setFilter(currentFilter) {
        this.updateActiveButton(currentFilter)
        this.getDateRange(currentFilter)


    }
    updateActiveButton(activeFilter) {
        document.querySelectorAll('.btn-actions').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${activeFilter}`).classList.add('active');
    }
    getDateRange(currentFilter) {
        const now = new Date();
        let startDate, endDate;

        switch (currentFilter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString().split('T')[0];
                this.getOperations(startDate,endDate)
                break;

            case 'week':
                const dayOfWeek = now.getDay();
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                endDate = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59);
                this.getOperations(startDate,endDate)
                break;

            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                this.getOperations(startDate,endDate)
                break;

            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                this.getOperations(startDate,endDate)
                break;

            case 'all':
                startDate = this.dateFromAll;
                endDate = this.dateToAll;
                this.getOperations(startDate,endDate)
                break;
            case 'interval':
                startDate = this.fromDateElement.value;
                endDate = this.beforeDateElement.value;
                if (startDate === '' && endDate === '') {
                    return;
                }else {
                    this.getOperations(startDate,endDate);
                }
                break;

            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                this.getOperations(startDate,endDate)
        }

    }
   async getOperations(from, to) {

        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + from + '&dateTo=' + to);
            console.log(result);
            if (result) {
                Auth.setOperationsCategory(result);
                console.log(Auth.getOperationsCategory())
            }
            this.showRecords(result);

        }
    }
    showRecords(data) {
        console.log(data)
        const recordsElement = document.getElementById("records");
        recordsElement.innerHTML = '';
        if (!data || data.length === 0) {
            recordsElement.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Нет данных для отображения
                </td>
            </tr>
        `;
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const date = data[i].date;
            const result = date.split('-').reverse().join('.');
            let rusTransType = null;
            if (data[i].type === 'income') {
                rusTransType = 'доход';
            }
            if (data[i].type === 'expense') {
                rusTransType = 'расход';
            }
            const trElement = document.createElement("tr");
            trElement.setAttribute('scope', 'col');
            trElement.classList.add('text-center');
            trElement.insertCell().innerHTML = i + 1;
            trElement.insertCell().innerText = rusTransType;
            trElement.insertCell().innerText = data[i].category;
            trElement.insertCell().innerText = data[i].amount +  '$';
            trElement.insertCell().innerText = result;
            trElement.insertCell().innerText = data[i].comment;
            trElement.insertCell().innerHTML =
                '<a href="javascript:void(0)"  class="link me-2" id="delete">' + '<i class="bi bi-trash" id="'+ data[i].id + '"></i>' +
                '</a>' + '<a href="javascript:void(0)" class="link" id="update">' + '<i class="bi bi-pencil" id="'+ data[i].id + '"></i>' + '</a>';
            recordsElement.appendChild(trElement);

        }
        const td = document.querySelectorAll('td');
        td.forEach(el => {
            if (el.innerText === 'доход') {
                el.classList.add('text-success');
            }
            if (el.innerText === 'расход') {
                el.classList.add('text-danger');
            }

        })

        const iconDelete = document.querySelectorAll('a#delete');
        const iconUpdate = document.querySelectorAll('a#update');
        const that = this;
        iconDelete.forEach(e => {
            e.addEventListener('click', (e) => {
                // e.preventDefault();
                let id = e.target.id;
                this.modalElement.style.display = 'block';
                this.modalElement.addEventListener('click', (e) => {
                    if (e.target.id.includes('yes')) {
                        that.deleteOperation(id);
                        Auth.removeOperationsCategory();
                        location.href = '/income-expenses';

                    } else if (e.target.id.includes('no')) {

                        console.log('no');
                        return  this.modalElement.style.display = 'none';
                    }
                })

            })

        })
        iconUpdate.forEach(e => {

            e.addEventListener('click', (e) => {
                let id = e.target.id;
                Auth.setUpdateOperationsId(id);

                location.href = '/update-income-expenses';

            })
        })




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
   async deleteOperation(id) {
       await CustomHttp.request(config.host + '/operations/' + parseInt(id), 'DELETE');
    }
}