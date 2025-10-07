// import {Chart, PieController} from "/chart.js";

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

const ctx_2 = document.getElementById("myChart_2");

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
