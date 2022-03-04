$(document).ready(function () {
  //if( sessionStorage.getItem("roles") == "ROLE_USER" || sessionStorage.getItem("roles") == "ROLE_MODERATOR" || sessionStorage.getItem("roles") == "ROLE_ADMIN" ) {
  $("#nav").load("./templates/nav/nav.html", function () {
    // alert('navigation loaded');
  });
  $("#left-sidebar").load("./templates/left-sidebar/left-sidebar.html");
  $("#layoutSidenav_nav").load("./templates/side-nav/side-nav.html");
  $("#layoutSidenav_content").load("./templates/dashboard/dashboard.html");
});