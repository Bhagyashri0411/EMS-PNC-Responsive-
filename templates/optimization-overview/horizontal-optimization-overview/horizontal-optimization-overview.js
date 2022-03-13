$(document).ready(function () {
    getPotentialAreaData();
    recommendations();
    steamPotential();

    $("#aera-drop-pncp").on('change', function () {
        getPotentialAreaData($(this).find(":selected").val());
    });
});

function getPotentialAreaData() {
    var myJSON = { duration: $('#aera-drop-pncp').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({

        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "post",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/OptimizationOverview/potentialgraph",

    }).done(function (data) {
        var chartData = { yvalue: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            chartData.yvalue.push({ y: element.actual });

        }
        loadAreagraph(chartData);
    })
}

function loadAreagraph(data) {
    var chart = new CanvasJS.Chart("chartContainerrArea", {
        backgroundColor: "#26293c",
        height: 100,
        animationEnabled: true,
        title: {
            text: ""
        },

        axisX: {
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            lineThickness: 0,
            tickLength: 0,
            labelFormatter: function () {
                return " ";
            }
        },
        dataPointMaxWidth: 15,
        axisY: {

            lineThickness: 0,
            gridThickness: 0,
            tickLength: 0,
            "minimum": 0,

            labelFormatter: function () {
                return " ";
            }
        },
        data: [{
            indexLabelFontColor: "darkSlateGray",
            name: "views",
            type: "area",
            color: "#116646",
            ValueFormatString: "#,##0.0mn",

            dataPoints: data.yvalue


        }]
    });
    chart.render();

}


function recommendations() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/PNC/recommendation",
    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.message + '</td>';
            table_data += '</tr>';
        });
        $('#recommendations').append(table_data);
    })
       
}

function steamPotential() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: 'http://localhost:8090/EmsPNC/OptimizationOverview/potentialopportunity',
    }).done(function (data) {
        document.getElementById("num").innerHTML = data[0].value
        document.getElementById("num-Actual").innerHTML = data[0].actual
        document.getElementById("num-Optimum").innerHTML = data[0].optimum

    });
}