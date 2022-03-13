$(document).ready(function() {
    getAreaWise();
    rengeAreawise();
});

function getAreaWise() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/home/areawiseSEC",

    }).done(function(data) {
        var keysArray = Object.keys(data);
        for (let i = 0; i < keysArray.length; i++) {
            console.log(data[keysArray[i]]);
            $('#' + keysArray[i]).addClass(data[keysArray[i]]);
        }
    })

}

function rengeAreawise(){
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/home/areadevref",
      

    }).done(function(data) {
        document.getElementById("var1").innerHTML = data[2].minvalue;
        document.getElementById("var2").innerHTML = data[2].maxvalue;
        document.getElementById("var3").innerHTML = data[1].minvalue;
        document.getElementById("var4").innerHTML = data[1].maxvalue;
        document.getElementById("var5").innerHTML = data[0].minvalue;
        document.getElementById("var6").innerHTML = data[0].maxvalue;
        
    })
}