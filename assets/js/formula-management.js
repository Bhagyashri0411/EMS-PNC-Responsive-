$(document).ready(function() {
    var token = sessionStorage.getItem('accessToken');
        var decoded = jwt_decode(token);
        console.log(decoded,'decode');


    if (sessionStorage.getItem('user') != decoded.sub) {
        sessionStorage.clear();
        $(location).prop('href', 'login.html')
      } else if (sessionStorage.getItem('userRole') == "user") {
        sessionStorage.clear();
        $(location).prop('href', 'login.html')
      } else{
    
    $("#bs-example-navbar-collapse-1").load("templates/nav/nav.html", function() {
        document.getElementById("user").innerHTML = sessionStorage.getItem("user");
    });
    $("#left-sidebar").load("templates/left-sidebar/left-sidebar.html");
    $("#Calculation-tab").load("templates/Formula-management/formula-management/formula-management-tab.html");
   
}
});
function Truncated(){  
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/api/cppTpsOverview/CsvTruncate",
    }).done(function(data) {
        console.log(data)  
    })
}
