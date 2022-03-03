$(document).ready(function () {
  //if( sessionStorage.getItem("roles") == "ROLE_USER" || sessionStorage.getItem("roles") == "ROLE_MODERATOR" || sessionStorage.getItem("roles") == "ROLE_ADMIN" ) {
  $("#nav").load("./templates/nav/nav.html", function () {
    // alert('navigation loaded');
  });
  $("#left-sidebar").load("./templates/left-sidebar/left-sidebar.html");
  $("#layoutSidenav_nav").load("./templates/side-nav/side-nav.html");
  $("#layoutSidenav_content").load("./templates/dashboard/dashboard.html");
  lastupdatedTime();
});
function lastupdatedTime() {
  $.ajax({
    url: 'http://192.168.1.109:8090/Air/lastUpdateTimestamp',
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
    },
  }).done(function (data) {
    // var timestamp=new Date().getTime();
    const d = new Date(data.lastupdatetimestamp)
    console.log(data.lastupdatetimestamp ,'data.lastupdatetimestamp'); 
    sessionStorage.setItem("lastUpdateddate" ,d);
    const b = new Date(sessionStorage.getItem("lastUpdateddate"));
    console.log(b, 'b');
    const dmonth = b.getMonth() + 1;
    const setdate = String(b.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + b.getFullYear() + " " + String(b.getHours()).padStart(2, '0') + ":" + String(b.getMinutes()).padStart(2, '0') + ":" + String(b.getSeconds()).padStart(2, '0');
    // document.getElementById("cppTime").innerHTML = setdate;
    //  document.getElementById("cppTime").innerHTML = d.getDate() + "-" + dmonth + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  });
}