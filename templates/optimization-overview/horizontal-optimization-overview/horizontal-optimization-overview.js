$(document).ready(function () {
    getPotentialAreaData();
    recommendations() ;
   
});

function getPotentialAreaData() {
    $.ajax({
        method: "GET",

        url: "http://192.168.1.113:8090/api/npruunitOverview/SECOverview",

    }).done(function (data) {

        formatPotentialOpportunityAreaData(data);
    })
        .fail(function () {
            console.log('fail2');
            var failData = [{
                "xvalue": 10,
                "yvalue": 2000
            },
            {
                "xvalue": 30,
                "yvalue": 4000
            },
            {
                "xvalue": 5000,
                "yvalue": 90
            },
            {
                "xvalue": 10,
                "yvalue": 2000
            },

            ]
            formatPotentialOpportunityAreaData(failData);

        })
}

function formatPotentialOpportunityAreaData(data) {
    var chartData = { xvalue: [], yvalue: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.xvalue.push({ y: element.xvalue });
        chartData.yvalue.push({ y: element.yvalue });

    }
    loadAreagraph(chartData);

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
            // "minimum":0,



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

            dataPoints: data.xvalue


        }],

        data: [{
            indexLabelFontColor: "darkSlateGray",
            name: "views",
            type: "area",
            color: "#116646",
            yValueFormatString: "#,##0.0mn",

            dataPoints: data.yvalue


        }]
    });
    chart.render();

}


function recommendations() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://192.168.1.123:8080/recommendation",
    }).done(function (data) {
        getrecommendations(data)
    })
         .fail(function () {
            var Faildata = [
                {
                    "keyvalue": "Reduce load on Boiler # 2"
                },
                {
                    "keyvalue": "Reduce PRDS XX Flow, Increase STG XX steam flow"
                },
                {
                    "keyvalue": "Increase load on Boiler BR001"
                },
                {
                    "keyvalue": "Increase load on Boiler BR001"
                },
                {
                    "keyvalue": "Increase load on Boiler BR001"
                }
            ]
            getrecommendations(Faildata);
            
        })
}
function getrecommendations(data) {
    console.log(data,"hiii");
    var table_data = '';
    var max1 = 700;
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.keyvalue + '</td>';
       // table_data += '<td>' + value.ReducePRDSXXFlow,IncreaseSTGXXsteamflow + '</td>';
        // table_data += '<td>' + value.IncreaseloadonBoiler + '</td>';
        // table_data += '<td>' + value.IncreaseloadonBoiler + '</td>';
        // table_data += '<td>' + value.IncreaseoadonBoiler + '</td>';
        table_data += '</tr>';
    });
    $('#recommendations').append(table_data);

}