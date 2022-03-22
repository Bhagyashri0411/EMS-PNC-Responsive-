$(document).ready(function () {
  $("#bs-example-navbar-collapse-1").load("/../templates/nav/nav.html", function () {
    // alert('navigation loaded');
  });
  $("#left-sidebar").load("/../templates/left-sidebar/left-sidebar.html");
  $("#user-authentication-page").load("/../templates/user-authentication-page/user-authentication-page.html");


  //     // totalThroughput();
  //     // lastupdatedTime();
  //     var token = sessionStorage.getItem('accessToken');
  //     var decoded = jwt_decode(token);
  //     console.log(decoded,'decode');


  // if (sessionStorage.getItem('user') != decoded.sub) {
  //     sessionStorage.clear();
  //     $(location).prop('href', 'login.html')
  //   } else if (sessionStorage.getItem('userRole') != "superadmin") {
  //     sessionStorage.clear();
  //     $(location).prop('href', 'login.html')
  //   } else{
  //     $("#bs-example-navbar-collapse-1").load("/../templates/nav/nav.html", function() {
  //         // alert('navigation loaded');
  //     });
  //     $("#left-sidebar").load("/../templates/left-sidebar/left-sidebar.html");
  //     $("#User-manual-tag-two").load("/../templates/User-manual-tag2/User-manual-tag-two.html");
  //   }  
});
function Truncated() {
  $.ajax({
    method: "GET",
    url: "http://192.168.1.117:8090/home/Truncate",
  }).done(function (data) {
    console.log(data)
  })
}
