$(document).ready(function () {
    // const role = sessionStorage.getItem("role");
    // if (!role || role !== 'admin') {
    //     $(location).attr('href', "login.html");
    // } else {
        var token = sessionStorage.getItem('accessToken');
        var decoded = jwt_decode(token);
        console.log(decoded,'decode');


    if (sessionStorage.getItem('user') != decoded.sub) {
        sessionStorage.clear();
        $(location).prop('href', 'login.html')
      } else {

        $("#bs-example-navbar-collapse-1").load("./templates/nav/nav.html", function () {
            document.getElementById("user").innerHTML = sessionStorage.getItem("user"); 
         });
        $("#tps").load("./templates/tps-overview/tps/tps.html", function () { });
        $("#left-sidebar").load("./templates/left-sidebar/left-sidebar.html");
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            var fileName = target.substring(1);
            $(target).load("./templates/tps-overview/" + fileName + "/" + fileName + ".html", function () { });

        });
        const b = new Date(sessionStorage.getItem("lastUpdateddate"));
        console.log(b, 'b');
        const dmonth = b.getMonth() + 1;
        const setdate = String(b.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + b.getFullYear() + " " + String(b.getHours()).padStart(2, '0') + ":" + String(b.getMinutes()).padStart(2, '0') + ":" + String(b.getSeconds()).padStart(2, '0');
        document.getElementById("cppTime").innerHTML = setdate;
     }
});


function csvdownload() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/home/Report",
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
        url: "http://localhost:8090/EmsPNC/home/Truncate",
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