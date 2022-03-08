$(document).ready(function () {
    // user();

    // setInterval(function(){ reload_page(); },30000);

    $('#logout-button').click(function () {
        sessionStorage.removeItem('role');
        $(location).attr('href', "login.html");
    })
    lastupdatedTime();
});
function lastupdatedTime() {
    $.ajax({
      url: 'http://localhost:8090/EmsPNC/Air/lastUpdateTimestamp',
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
      },
    }).done(function (data) {
      // var timestamp=new Date().getTime();
      const d = new Date(data.lastupdatetimestamp)
      console.log(data.lastupdatetimestamp, 'data.lastupdatetimestamp');
      sessionStorage.setItem("lastUpdateddate", d);
      const b = new Date(sessionStorage.getItem("lastUpdateddate"));
      console.log(b, 'b');
      const dmonth = b.getMonth() + 1;
      const setdate = String(b.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + b.getFullYear() + " " + String(b.getHours()).padStart(2, '0') + ":" + String(b.getMinutes()).padStart(2, '0') + ":" + String(b.getSeconds()).padStart(2, '0');
    });
  }