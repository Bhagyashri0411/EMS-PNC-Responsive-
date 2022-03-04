$(document).ready(function() {
    tgtuloadGaugeChart();
    srusteamconsumptionbreakup();
    getcard();
});



function tgtuloadGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/api/npruunitOverview/specificeneryconsumption",
    }).done(function(gaugevalue) {
        tgtuGaugeChartvalue(gaugevalue);
        console.log(gaugevalue)
    });
}


function tgtuGaugeChartvalue(gaugevalue) {
    ZC.LICENSE = ["b55b025e438fa8a98e32482b5f768ff5"];
    var myConfig12 = {
        "type": "gauge",
        "height": "19%",
        "width": "60%",
        "x": "20%",
        "backgroundColor": "#26293c",
        "scale": {
            "size-factor": "250%", //Modify your gauge chart size.
            offsetY: '10px'
        },
        plotarea: {
            padding: '10 0 0 0'
        },
        "scale-r": {
            "aperture": 180,
            "values": "0:100:0",
            item: {
                'font-color': "#d9d9d9",
                'offset-r': -10,
                'font-size': 10,
            },
            "center": {
                "size": 4,
                "background-color": "transparent",
                "border-color": "none"
            },
            "ring": {
                "size": 24,
                "rules": [{
                        "rule": "%v >= 0 && %v <= 10",
                        "background-color": "#02b04f"
                    },

                    {
                        "rule": "%v >= 11 && %v <= 30",
                        "background-color": "#ffc000"
                    },

                    {
                        "rule": "%v >= 31 && %v <=100",
                        "background-color": "#ff0000"
                    }
                ]
            },
            "guide": {
                "alpha": 0.8
            }
        },
        "plot": {
            "csize": "3%",
            "size": "100%",
            "background-color": "black"
        },
        "series": [{
            "background-color": "black",
            "values": gaugevalue.TagValue,
        }]
    };

    setTimeout(() => {
        zingchart.render({
            id: 'tgtu-zingChart',
            data: myConfig12
        });
    }, 100);
}

function srusteamconsumptionbreakup() {
    $.ajax({
      url: "http://localhost:8090/api/srutgtuOverview/SteamConsumptionBreakup",
      method: "GET"
  
    }).done(function (data) {
    
      var table_data = '';
      $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.type + '</td>';
        table_data += '<td class="percent">' + value.percent + '</td>';
        table_data += '<td class="tgtu">' + value.ton + '</td>';
        table_data += '</tr>';
      });
      $('#tgtutable').append(table_data);
  
    });
  }

  function getcard() {
    $.ajax({
         url:"http://localhost:8090/api/srutgtuOverview/getCardDetails",
        method: "GET"
    }).done(function(data) {
        console.log(data)
       
        document.getElementById("result1").innerHTML = data[0].diff;
        document.getElementById("ref1").innerHTML = data[0].tagBenchmarkValue;
        document.getElementById("count1").innerHTML = data[0].tagValue;
       
        //  document.getElementById("result2").innerHTML = data[1].diff;
        //  document.getElementById("ref2").innerHTML = data[1].tagBenchmarkValue;
         document.getElementById("count2").innerHTML = data[1].tagValue;
       
         document.getElementById("result3").innerHTML = data[2].diff;
         document.getElementById("ref3").innerHTML = data[2].tagBenchmarkValue;
         document.getElementById("count3").innerHTML = data[2].tagValue;
        
          document.getElementById("count4").innerHTML = data[3].tagValue;



    });

}