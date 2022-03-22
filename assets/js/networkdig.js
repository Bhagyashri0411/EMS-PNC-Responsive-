$(document).ready(function () {
    $("#bs-example-navbar-collapse-1").load("./../../templates/nav/nav.html", function () { });
    $("#left-sidebar").load("./../../templates/left-sidebar/left-sidebar.html");
    $("#networking-tab").load("./../../templates/networkdig/networkdig.html");
    // var token = sessionStorage.getItem('accessToken');
    //     var decoded = jwt_decode(token);
    //     console.log(decoded,'decode');


    // if (sessionStorage.getItem('user') != decoded.sub) {
    //     sessionStorage.clear();
    //     $(location).prop('href', 'login.html')
    //   } else {

    // $("#bs-example-navbar-collapse-1").load("templates/nav/nav.html", function() {
    //     document.getElementById("user").innerHTML = sessionStorage.getItem("user");
    // });
    // $("#left-sidebar").load("templates/left-sidebar/left-sidebar.html");
    // $("#networking-tab").load("templates/networkdig/networkdig.html");

    // }
    const v = sessionStorage.getItem("lastUpdateddate");
    const d = new Date(v);
    const dmonth = d.getMonth() + 1;
    document.getElementById("netTime").innerHTML = String(d.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + d.getFullYear() + " " + String(d.getHours()).padStart(2, '0') + ":" + String(d.getMinutes()).padStart(2, '0') + ":" + String(d.getSeconds()).padStart(2, '0');
});
function Truncated() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "",
    }).done(function (data) {
        console.log(data)
    })
}
