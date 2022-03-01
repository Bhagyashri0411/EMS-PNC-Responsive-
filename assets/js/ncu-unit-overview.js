$(document).ready(function() {
    totalThroughput();
    lastupdatedTime();
    $("#bs-example-navbar-collapse-1").load("./../../templates/nav/nav.html", function() {
        // alert('navigation loaded');
    });
    $("#left-sidebar").load("./../../templates/left-sidebar/left-sidebar.html");
    $("#ncu-horizontal-tiles").load("./../../templates/ncu-unit-overview/ncu-horizontal-tiles/ncu-horizontal-tiles.html");
    // $("#layoutSidenav_content").load("./../../templates/dashboard/dashboard.html");

    $("#overall-sec-overview").load("./../../templates/ncu-unit-overview/overall-sec-overview/overall-sec-overview.html", function() {});
    $('#ncu-unit-overview-tab a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href") // activated tab
        var fileName = target.substring(1);
        $(target).load("./../../templates/ncu-unit-overview/" + fileName + "/" + fileName + ".html", function() {});
    });
  
   
});

function lastupdatedTime(data){
  
                var today = new Date();

                var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' +today.getFullYear() 
            
                var time = today.getHours() + ":" + today.getMinutes();
            
                var dateTime = date + ' ' + time;
                document.getElementById("ncuTimeStamp").innerHTML = dateTime;
        
    }
function totalThroughput(data){
        $.ajax({
            url: 'http://localhost:8090/EmsPNC/ncu/feedratePlantload',
            method: "GET"
        }).done(function (data) {
            
           
                    document.getElementById("totalThroughput").innerHTML = data.feedrate; 
                    document.getElementById("Power").innerHTML = data.plantload;
                    
                    });
        
            
        }
function Truncated(){  
            $.ajax({
                method: "GET",
                url: "http://localhost:8090/EmsPNC/home/Truncate",
            }).done(function(data) {
                console.log(data)  
            })

         
        }
function csvdownload(){   
            $.ajax({
                method: "GET",
                url: "http://localhost:8090/EmsPNC/home/Report",
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