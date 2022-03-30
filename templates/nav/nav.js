
$(document).ready(function () {
  $('#logout-button').click(function () {
      sessionStorage.clear();
      $(location).attr('href', "login.html");
  })
  setInterval(lastupdatedTime,10000);
  lastupdatedTime();
});
function lastupdatedTime(data) {
  $.ajax({
      url: 'http://localhost:8090/EmsPNC/home/lastUpdateTimestamp',
      method: "GET",
   headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
      },
  }).done(function (data) {
      // var timestamp=new Date().getTime(); 
      const d = new Date(data.lastupdatetimestamp);
      const dmonth = d.getMonth()+1;
      sessionStorage.setItem("lastUpdateddate",d);
  });


}