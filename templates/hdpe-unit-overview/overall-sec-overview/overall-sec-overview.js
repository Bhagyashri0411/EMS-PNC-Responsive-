$(document).ready(function () {
    $("input[name=hdpeoveralldate]").on('change', function () {
        document.getElementById("hdpefromFccu").max = $('#hdpeoveralldate').val();
        hdpeoverview();
    });
    $("input[name=hdpefromFccu]").on('change', function () {
        document.getElementById("hdpeoveralldate").min = $('#hdpefromFccu').val();
        hdpeoverview();
    });
    // // setting from date, to date - 24hrs.
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#hdpefromFccu').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#hdpeoveralldate').val(tod.toJSON().slice(0, 19));
    document.getElementById("hdpeoveralldate").min = $('#hdpefromFccu').val();
    document.getElementById("hdpefromFccu").max = $('#hdpeoveralldate').val();

    hdpeoverview();
    console.log("data");
})
function hdpeoverview() {
    var myJSON = { 'fromdate': $('#hdpefromFccu').val(), "day": $('#hdpeoveralldate').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/EmsPNC/auth/HDPE/overallsecOverviewgraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        hdpegetoverview(data, Difference_In_Days);
    })
}

function hdpegetoverview(data, Difference_In_Days) {
    var chartData = { feedrate: [], reference: [], actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const HDPEOverDate = new Date(element.date);
        chartData.feedrate.push({ y: element.feedrate, x: HDPEOverDate });
        chartData.reference.push({ y: element.reference, x: HDPEOverDate });
        chartData.actual.push({ y: element.actual, x: HDPEOverDate });
    }
    console.log("Fccuchartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    hdpeshowoverview(chartData, Difference_In_Days, interval);
}

function hdpeshowoverview(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("hdpeOverallsecgraph", {

        height: 268,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            gridColor: "gray",
            tickLength: 0,
            gridThickness: 0,
            labelFontColor: "#d9d9d9",
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            labelFontSize: 10,
            gridDashType: "dot",
            lineThickness: 0,
        },
        dataPointWidth: 25,
        axisY: {
            title: "TOE/MT of Product",
            gridColor: "gray",
            gridDashType: "dot",
            gridThickness: 1,
            labelFontColor: "#d9d9d9",
        },
        axisY2: {
            title: "Plant Load(%)",
            gridThickness: 0,
            labelFontColor: "#d9d9d9"
        },
        data: [{
            type: "column",
            color: "#0796CC",
            name: "Plant Load",
            axisYType: "secondary",
            dataPoints: data.feedrate
        },
        {
            type: "line",
            color: "#FFC100",
            name: "Reference",
            markerSize: 0,
            lineThickness: 2,
            dataPoints: data.reference
        },
        {
            type: "line",
            color: "#ED7E31",
            name: "Actual",
            markerSize: 0,
            lineThickness: 2,
            dataPoints: data.actual
        }

        ]
    });

    chart.render();
}