$(document).ready(function () {
    const role = sessionStorage.getItem("role");
    if (!role || role !== 'admin') {
        $(location).attr('href', "login.html");
    } else {
        lastupdatedTime();
        $("#bs-example-navbar-collapse-1").load("./templates/nav/nav.html", function () { });
        $("#tps").load("./templates/tps-overview/tps/tps.html", function () { });
        $("#left-sidebar").load("./templates/left-sidebar/left-sidebar.html");
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            var fileName = target.substring(1);
            $(target).load("./templates/tps-overview/" + fileName + "/" + fileName + ".html", function () { });

        });
    }
});

function lastupdatedTime() {
    $.ajax({
        url: 'http://192.168.1.123:8080/Air/lastUpdateTimestamp',
        method: "GET",
     headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
    }).done(function (data) {
        const d = new Date(data.lastupdatetimestamp);
        const dmonth = d.getMonth()+1;
        sessionStorage.setItem("lastUpdateddate",d);
        document.getElementById("cppTime").innerHTML =  String(d.getDate()).padStart(2,'0')+"-"+String(dmonth).padStart(2,'0')+"-"+d.getFullYear()+" "+String(d.getHours()).padStart(2,'0')+":"+String(d.getMinutes()).padStart(2,'0')+":"+String(d.getSeconds()).padStart(2,'0');
    });
}
function csvdownload() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.123:8080/home/Report",
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

function Truncated() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.123:8080/home/Truncate",
    }).done(function (data) {
        console.log(data)
    })
}
function before() {
    document.getElementById('col1')
        .style.display = "block";
        document.getElementById('col2')
        .style.display = "none";
}

function after() {
    document.getElementById('col2')
        .style.display = "block";
        document.getElementById('col1')
        .style.display = "none";
}