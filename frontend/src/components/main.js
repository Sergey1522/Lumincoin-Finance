import {Auth} from "../services/auth";
import {Chart} from "chart.js";

export class Main {
    constructor() {
        this.getInfoAccessToken = localStorage.getItem(Auth.accessTokenKey);
        this.getInfoRefreshToken = localStorage.getItem(Auth.refreshTokenKey);
        this.getInfoUser = Auth.getUserInfo();
        if (this.getInfoAccessToken) {
            this.initMain();
            // this.initChartJs();
        }
        console.log(this.getInfoUser)





    }
    initMain() {
        if (this.getInfoUser.name || this.getInfoUser.lastName) {
            document.getElementById('user-info').innerHTML = this.getInfoUser.name + ' ' + this.getInfoUser.lastName;
        }else {

        }

    }
    initChartJs() {
        const ctx = document.getElementById("myChart");

        new Chart(ctx, {
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
    }

}