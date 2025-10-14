import {Auth} from "../services/auth";
import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http";
import {config} from "../../config/config";


export class Main {
    constructor() {
        this.getInfoAccessToken = localStorage.getItem(Auth.accessTokenKey);
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getInfoUser = Auth.getUserInfo();
        if (this.getInfoAccessToken) {
            this.initBalance().then();
            this.initMain();
            this.initChartJs();
        }
        console.log(this.getInfoUser)





    }
   async initBalance() {
        if (this.getInfoRefreshToken) {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                document.getElementById('balance').innerHTML = result.balance + '' + '$';
            }
        }
    }
    initMain() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            document.getElementById('user-info').innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }



    }
    initChartJs() {
        const ctx = document.getElementById("myChart");
        const ctx_2 = document.getElementById("myChart_2");

     const myChart =    new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
                datasets: [
                    {
                        label: "My First Dataset",
                        data: [35, 50, 25, 25, 15],
                        backgroundColor: [
                            "#DC3545",
                            "#fd7e14",
                            "#ffc107",
                            "#20c997",
                            "#0d6efd",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
        });
        console.log(myChart);


        new Chart(ctx_2, {
            type: "pie",
            data: {
                labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
                datasets: [
                    {
                        label: "My First Dataset",
                        data: [10, 15, 35, 35, 25],
                        backgroundColor: [
                            "#DC3545",
                            "#fd7e14",
                            "#ffc107",
                            "#20c997",
                            "#0d6efd",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
        });

    }

}