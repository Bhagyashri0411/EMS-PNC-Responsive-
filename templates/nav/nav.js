$(document).ready(function () {
    // user();

    // setInterval(function(){ reload_page(); },30000);

    $('#logout-button').click(function () {
        sessionStorage.removeItem('role');
        $(location).attr('href', "login.html");
    })

});
    // function user() {
    //     document.getElementById("user").innerHTML = sessionStorage.getItem("role");
    //     if( sessionStorage.getItem("role") == "user" ) {
    //         // $('#fccu-unit-overview').remove();
    //        alert("right");
    //      } else {
    //         alert("wrong");
    //      }
    // }
//     function reload_page()
// {
//    window.location.reload(true);
// }