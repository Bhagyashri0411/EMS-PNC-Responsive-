/*!
 * Start Bootstrap - SB Admin v7.0.2 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        if (localStorage.getItem("sb|sidebar-toggle") === "true") {
            document.body.classList.toggle("sb-sidenav-toggled");
        }
        // sidebarToggle.addEventListener('click', event => {
        //     event.preventDefault();
        //     console.log(event.preventDefault());
        //     document.body.classList.toggle('sb-sidenav-toggled');
        //     localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        // });
    }
    sidebarToggle.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(event.preventDefault());
        document.body.classList.toggle("sb-sidenav-toggled");
        localStorage.setItem(
            "sb|sidebar-toggle",
            document.body.classList.contains("sb-sidenav-toggled")
        );
    });
});
$("#Ndashboard").on("click", function() {
    $(".homeDiv").show();
    $(".energyOverviewDiv").hide();
});
$("#Noverview").on("click", function() {
    $(".energyOverviewDiv").show();
    $(".homeDiv").hide();
});

function fueldiv() {
    $(".fuelDiv").show();
    $(".electricityDiv").hide();
    $(".steamDiv").hide();
}

function electricitydiv() {
    $(".fuelDiv").hide();
    $(".electricityDiv").show();
    $(".steamDiv").hide();
}

function steamdiv() {
    $(".fuelDiv").hide();
    $(".electricityDiv").hide();
    $(".steamDiv").show();
}

window.onload = function() {
    fuelchart1();
    fuelchart();
    fueldonutchart();
    electricitychart();
    Steamchart();
    Steampiechart();
};

function fuelchart1() {
    let dataPoints = [];
    let chart = new CanvasJS.Chart("mdlinechart", {
        animationEnabled: true,
        theme: "light2",
        height: 400,
        width: 550,
        title: {
            text: "",
        },
        axisX: {
            gridColor: "lightblue",
            gridThickness: 2,
            gridDashType: "dot",
        },
        axisY: {
            stripLines: [{
                value: 530,
                lineDashType: "dash",
                color: "black",
            }, ],
            //  interlacedColor: "#F8F1E4",
            gridThickness: 0,
        },
        data: [{
            type: "spline",
            indexLabelFontSize: 16,
            dataPoints: dataPoints,
        }, ],
    });

    function addDatas(data) {
        for (var i = 0; i < data.length; i++) {
            var dtdt = data[i];
            var ygg = dtdt["y"];

            dataPoints.push({ y: ygg });
        }
        chart.render();
    }

    $.getJSON("./../../assets/json/zzzz.json", addDatas);
}

// // fuelline chart
function fuelchart() {
    let dataPoints = [];
    let chart = new CanvasJS.Chart("sdlinechart", {
        animationEnabled: true,
        theme: "light2",
        height: 400,
        width: 800,
        title: {
            text: "",
        },
        axisX: {
            gridColor: "lightblue",
            gridThickness: 2,
            gridDashType: "dot",
        },
        axisY: {
            stripLines: [{
                value: 530,
                lineDashType: "dash",
                color: "black",
            }, ],
            //  interlacedColor: "#F8F1E4",
            gridThickness: 0,
        },
        data: [{
            type: "spline",
            indexLabelFontSize: 16,
            dataPoints: dataPoints,
        }, ],
    });

    function addDatam(data) {
        for (var i = 0; i < data.length; i++) {
            var dtdt = data[i];
            var ygg = dtdt["y"];

            dataPoints.push({ y: ygg });
        }
        chart.render();
    }

    $.getJSON("./../../assets/json/zzzz.json", addDatam);
}


// Donut suvrna
function fueldonutchart() {
    let dataPoints = [];
    let chart = new CanvasJS.Chart("sdoughnutChart", {
        height: 165,
        width: 200,
        title: {
            text: 700,
            verticalAlign: "center",
            dockInsidePlotArea: true,
        },
        axisY: {
            title: "Units",
            titleFontSize: 24,
            includeZero: true,
        },
        data: [{
            type: "doughnut",
            showInLegend: true,
            toolTipContent: "<b>{x}:</b> {y} (#percent%)",
            yValueFormatString: "#,###",
            // indexLabel: "{x}",
            dataPoints: dataPoints,
        }, ],
    });

    function addData(data) {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].plant);
            console.log(data[i].size);
            dataPoints.push({
                x: data[i].plant,
                y: data[i].size,
            });
        }
        chart.render();
    }

    $.getJSON("./../../assets/json/Donut.json", addData);
}

// Electricity-charts
function electricitychart() {
    let dataPoints = {
        M1: [],
    };
    let chart = new CanvasJS.Chart("linechart-ele", {
        height: 400,
        width: 750,
        title: {
            text: " ",
        },
        axisY: {
            title: "Data",
            titleFontSize: 24,
            includeZero: true,
            maximum: 100, // set maximum value

            stripLines: [{
                value: 80,
                lineDashType: "dash",
                color: "black",
            }, ],
            //  interlacedColor: "#F8F1E4",
            gridThickness: 0,
        },
        axisX: {
            title: "value",
            titleFontSize: 24,
            includeZero: true,
            maximum: 100, // set maximum value
            gridColor: "lightblue",
            gridThickness: 2,
            gridDashType: "dot",
        },
        data: [{
            type: "line",
            legendText: "M1",
            //  axisYType: "secondary",
            // markerSize: 0,
            yValueFormatString: "#,###",
            indexLabel: " {y}",
            showInLegend: "true",
            dataPoints: dataPoints.M1,
        }, ],
    });

    function addDatab(data) {
        for (var i = 0; i < data.length; i++) {
            var dtdt = data[i];
            var ygg = dtdt["m1"];
            var ygg1 = dtdt["m2"];
            var date2 = dtdt["fromdate"];

            dataPoints.M1.push({ y: ygg });
        }
        chart.render();
    }

    $.getJSON("./../../assets/json/line1.json", addDatab);
}

// Steam chart div
function Steamchart() {
    let chart = new CanvasJS.Chart("mlinechart ", {
        animationEnabled: true,
        theme: "light2",
        height: 400,
        width: 750,
        title: {
            text: "",
        },
        axisX: {
            gridColor: "lightblue",
            gridThickness: 2,
            gridDashType: "dot",
        },
        axisY: {
            stripLines: [{
                value: 530,
                lineDashType: "dash",
                color: "black",
            }, ],
            //  interlacedColor: "#F8F1E4",
            gridThickness: 0,
        },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: [
                { y: 450 },
                { y: 414 },
                { y: 520 },
                { y: 460 },
                { y: 450 },
                { y: 500 },
                { y: 480 },
                { y: 480 },
                { y: 410 },
                { y: 500 },
                { y: 480 },
                { y: 510 },
            ],
        }, ],
    });
    chart.render();
}
//  steam piechart
function Steampiechart() {
    let chart = new CanvasJS.Chart("chartpie", {
        height: 150,
        width: 160,
        title: {
            text: "",
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: '##0.00"%"',
            indexLabel: "{label} {y}",
            dataPoints: [
                { y: 79.45, label: "VHP" },
                { y: 7.31, label: "HP" },
                { y: 7.06, label: "MP" },
                { y: 4.91, label: "LP" },
            ],
        }, ],
    });
    chart.render();
}