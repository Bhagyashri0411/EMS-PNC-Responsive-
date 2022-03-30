$(document).ready(function () {
  var token = sessionStorage.getItem('accessToken');
  var decoded = jwt_decode(token);
  console.log(decoded,'decode');


if (sessionStorage.getItem('user') != decoded.sub) {
sessionStorage.clear();
$(location).prop('href', 'login.html')
} else {
$("#nav").load("./templates/nav/nav.html", function() {
  document.getElementById("user").innerHTML = sessionStorage.getItem("user");
});
$("#left-sidebar").load("./templates/left-sidebar/left-sidebar.html");
$("#layoutSidenav_nav").load("./templates/side-nav/side-nav.html");
$("#layoutSidenav_content").load("./templates/dashboard/dashboard.html"); 

}

})