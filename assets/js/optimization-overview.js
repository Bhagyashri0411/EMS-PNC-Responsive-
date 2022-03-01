$(document).ready(function() {
   // lastupdatedTime();
    $("#bs-example-navbar-collapse-1").load("./../../templates/nav/nav.html", function() {});
    $("#left-sidebar").load("./../../templates/left-sidebar/left-sidebar.html");
    $("#horizontal-optimization-overview").load("./../../templates/optimization-overview/horizontal-optimization-overview/horizontal-optimization-overview.html");

    $("#optimization-overview-unit").load("./../../templates/optimization-overview/optimization-overview-unit/optimization-overview-unit.html", function() {});
   
    //var abc = sessionStorage.getItem("lastUpdateddate")
});
// function lastupdatedTime(data){
//     $.ajax({
//         url: 'http://localhost:8090/EmsPNC/api/home/lastupdatedate',
//         method: "GET"
//     }).done(function (data) {
        
       
//                 document.getElementById("optTime").innerHTML = data.LastUpdatedValue; 
                
                
//                 });
    
        
//     }
    function Truncated(){  
        $.ajax({
            method: "GET",
            url: "http://localhost:8090/EmsPNC/api/cppTpsOverview/CsvTruncate",
        }).done(function(data) {
            console.log(data)  
        })
    }
    function csvdownload(){   
        $.ajax({
            method: "GET",
            url: "http://localhost:8090/EmsPNC/api/cppTpsOverview/CsvImport",
        }).done(function(data){
          console.log(data)
    
            const csvRows = [];
    
            const headers = Object.keys(data[0]);
            csvRows.push(headers.join(','));
            console.log(data, "name");
            
    //console.log(csvRows, "values");
    
            for (const row of data) {
                csvRows.join('\n');
                var abc ='\n'+ row.kpi_name+','+row.value+','+row.uom;
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