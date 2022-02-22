$(document).ready(function() {
    // totalThroughput();
    // lastupdatedTime();
    $("#bs-example-navbar-collapse-1").load("/../templates/nav/nav.html", function() {
        // alert('navigation loaded');
    });
    $("#left-sidebar").load("/../templates/left-sidebar/left-sidebar.html");
    $("#Calculation-tab").load("/../templates/Formula-management/formula-management/formula-management-tab.html");
    

   // $("#npru-overall-sec-overview").load("/../EMSPro-PNC/templates/npru-unit-overview/npru-overall-sec-overview/npru-overall-sec-overview.html", function() {});
    $('#npru-overview-tab a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href") // activated tab
        var fileName = target.substring(1);
        $(target).load("/../templates/npru-unit-overview/" + fileName + "/" + fileName + ".html", function() {});

    });
});
function Truncated(){  
    $.ajax({
        method: "GET",
        url: "http://192.168.1.120:8090/api/cppTpsOverview/CsvTruncate",
    }).done(function(data) {
        console.log(data)  
    })
}
