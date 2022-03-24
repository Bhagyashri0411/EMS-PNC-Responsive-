
$(document).ready(function () {
    pncpsvg();
    //addData(data)
});

function pncpsvg() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EmsPNC/Network-Diagram/UpgradSteamNetworkSystem",
    }).done(function (data) {
        //addData(data);
        var keysArray = Object.keys(data);
        for (let i = 0; i < keysArray.length; i++) {
            console.log(data[keysArray[i]]);
            var user = data[keysArray[i]]
            for (const key in user) {
                console.log(key,'key',user[key].toFixed(2) ,'value');
                //console.log(`${key}: ${user[key]}`);
                $('#' + key).text(user[key].toFixed(2));
            }
           
        }
    });
   
   // addData(data);
}