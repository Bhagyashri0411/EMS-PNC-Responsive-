$(document).ready(function() {
    getAreaWise();
});

function getAreaWise() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.120:8090/home/areawiseSEC",

    }).done(function(data) {
        var keysArray = Object.keys(data);
        for (let i = 0; i < keysArray.length; i++) {
            console.log(data[keysArray[i]]);
            $('#' + keysArray[i]).addClass(data[keysArray[i]]);
        }
    })

}