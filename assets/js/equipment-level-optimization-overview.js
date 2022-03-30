$(document).ready(function() {
    var token = sessionStorage.getItem('accessToken');
        var decoded = jwt_decode(token);
        console.log(decoded,'decode');


    if (sessionStorage.getItem('user') != decoded.sub) {
        sessionStorage.clear();
        $(location).prop('href', 'login.html')
      } else {
   
        
    $("#bs-example-navbar-collapse-1").load("./../templates/nav/nav.html", function() {
        document.getElementById("user").innerHTML = sessionStorage.getItem("user");
    });
    $("#left-sidebar").load("./../templates/left-sidebar/left-sidebar.html");

    $("#steam-generators").load("./../../templates/equipment-level-optimization-overview/steam-generators/steam-generators.html");
    $('#eqipment-level-tab a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href")
        var fileName = target.substring(1);
        $(target).load("./../../templates/equipment-level-optimization-overview/" + fileName + "/" + fileName + ".html", function() {});

    });
}
const v = sessionStorage.getItem("lastUpdateddate");
const d =new Date(v);
const dmonth = d.getMonth()+1;
document.getElementById("equOptTime").innerHTML = String(d.getDate()).padStart(2,'0')+"-"+String(dmonth).padStart(2,'0')+"-"+d.getFullYear()+" "+String(d.getHours()).padStart(2,'0')+":"+String(d.getMinutes()).padStart(2,'0')+":"+String(d.getSeconds()).padStart(2,'0');
});
// function lastupdatedTime(data) {
//     // $.ajax({
//     //     url: 'http://192.168.1.106:8090/api/home/lastupdatedate',
//     //     method: "GET"
//     // }).done(function (data) {


//     //             document.getElementById("equOptTime").innerHTML = data.LastUpdatedValue; 


//     //             });
//     var today = new Date();

//     var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

//     var time = today.getHours() + ":" + today.getMinutes();

//     var dateTime = date + ' ' + time;
//     document.getElementById("equOptTime").innerHTML = dateTime;

// }
function Truncated() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.115:8090/Equipmentlevelopt/Truncate",
    }).done(function (data) {
        console.log(data)
    })
}
function csvdownload() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.115:8090/Equipmentlevelopt/Report",
    }).done(function (data) {
        console.log(data)

        const csvRows = [];

        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
        console.log(data, "name");

        //console.log(csvRows, "values");

        for (const row of data) {
            csvRows.join('\n');
            var abc = '\n' + row.kpi_name + ',' + row.value + ',' + row.uom;
            csvRows.push(abc);
        }

        console.log(csvRows, "name");
        const blob = new Blob(csvRows, { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'download.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}