$(document).ready(function () {
    totalThroughput();
    $("#bs-example-navbar-collapse-1").load("./../../templates/nav/nav.html", function () {
    });
    $("#left-sidebar").load("./../../templates/left-sidebar/left-sidebar.html");
    $("#hdpe-horizontal-tiles").load("./../../templates/hdpe-unit-overview/hdpe-horizontal-tiles/hdpe-horizontal-tiles.html");
    $("#overall-sec-overview").load("./../../templates/hdpe-unit-overview/overall-sec-overview/overall-sec-overview.html", function () { });
    $('#hdpe-unit-overview-tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href")
        var fileName = target.substring(1);
        $(target).load("./../../templates/hdpe-unit-overview/" + fileName + "/" + fileName + ".html", function () { });
    });
    const b = new Date(sessionStorage.getItem("lastUpdateddate"));
    console.log(b, 'b');
    const dmonth = b.getMonth() + 1;
    const setdate = String(b.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + b.getFullYear() + " " + String(b.getHours()).padStart(2, '0') + ":" + String(b.getMinutes()).padStart(2, '0') + ":" + String(b.getSeconds()).padStart(2, '0');
    document.getElementById("hdpeTimeStamp").innerHTML = setdate;
});
function totalThroughput(data) {
    $.ajax({
        url: 'http://localhost:8090/auth/HDPE/feedratePlantload',
        method: "GET"
    }).done(function (data) {
        document.getElementById("totalThroughput").innerHTML = data.feedrate;
        document.getElementById("Power").innerHTML = data.plantload;
    });
}
function Truncated() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.114:8090/home/Truncate",
    }).done(function (data) {
        console.log(data)
    })
}
function csvdownload() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.114:8090/home/Report",
    }).done(function (data) {
        console.log(data)

        const csvRows = [];

        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));
        console.log(data, "name");
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