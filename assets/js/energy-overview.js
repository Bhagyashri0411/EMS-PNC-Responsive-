$(document).ready(function() {
    
    $("#bs-example-navbar-collapse-1").load("./../../templates/nav/nav.html", function() {});
    $("#nav").load("./../../templates/nav/nav.html", function() {});
    $("#fuel").load("./../../templates/energy-overview/fuel/fuel.html", function() {});
    $("#left-sidebar").load("./../../templates/left-sidebar/left-sidebar.html");
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href") // activated tab
        var fileName = target.substring(1);
        $(target).load("./../../templates/energy-overview/" + fileName + "/" + fileName + ".html", function() {});
    });
    lastupdatedTime();
});

function lastupdatedTime(){
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        url: 'http://localhost:8090/home/lastUpdateTimestamp',
        method: "GET"
    }).done(function (data) {
        console.log(data,"gjhdik");
        const d = new Date(data.lastupdatetimestamp);
        sessionStorage.setItem("lastUpdateddate", d);
        const dmonth = d.getMonth()+1;
                document.getElementById("energyTime").innerHTML = d.getDate()+"-"+dmonth+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(); 
                
                
    });

    function Truncated(){  
        $.ajax({
            method: "GET",
            url: "http://localhost:8090/home/Truncate",
        }).done(function(data) {
            console.log(data)  
        })
    }
    function csvdownload(){   
        $.ajax({
            method: "GET",
            url: "http://localhost:8090/home/Report",
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
}