$(document).ready(function() {
    $('#Boiler').load("/../templates/tps-overview/equipment-efficiency/Boiler/Boiler.html", function() {});
    $('#equipment-efficiency-title').html('Boiler Efficiency Overview');
    $('#equipment-tab a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href")
        var fileName = target.substring(1);
        $(target).load("/../templates/tps-overview/equipment-efficiency/" + fileName + "/" + fileName + ".html", function() {});
        // $('#equipment-title-2').html('');
        if (fileName == 'Boiler') {
            $('#equipment-efficiency-title').html('Boiler Efficiency Overview');
        }
        if (fileName == 'ST') {
            $('#equipment-efficiency-title').html('Steam Turbine Efficiency Overview');
        }
        if (fileName == 'GT') {
            $('#equipment-efficiency-title').html('Gas Turbine Efficiency Overview');
            
        }
        if (fileName == 'HRSG') {
            $('#equipment-efficiency-title').html('HRSG Efficiency Overview');
            
        }
    });
});