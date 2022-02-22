function loginClick() {
    
    // var userId = document.getElementById("user-name").value;
    // var userPass = document.getElementById("pwd").value;
   // var role ="admin";
    // var loginCridential = { "username": userId, "password": userPass }
                // sessionStorage.setItem("token", res.accessToken);
                // sessionStorage.setItem("id", userId);
                // sessionStorage.setItem("role", role);
                // $(location).attr('href', "tps-overview.html");
    // $.ajax({
    //     type: "POST",
    //     headers: { 'Content-Type': 'application/json' },
    //     url: "",
    //     timeout: 15000,
    //     data:JSON.stringify(loginCridential),
    //     success: function(res) {
    //         if (res && res.status === 401) {
    //             document.getElementById("errormsg").innerHTML = res.message;
    //         } else {
    //             console.log(res,'sign');
    //             sessionStorage.setItem("token", res.accessToken);
    //             sessionStorage.setItem("username", res.username);
    //             sessionStorage.setItem("roles", res.roles[0]);
    //          $(location).attr('href', "tps-overview.html");
    //         }
    //     },
    //     error: function() {
    //         document.getElementById("errormsg").innerHTML = 'Something went wrong, Please try again';
    //         $('#user-name').val('');
    //         $('#pwd').val('');
    //     }

    // });
    var userId = document.getElementById("user-name").value;
    var userPass = document.getElementById("pwd").value;
    // send data to server, if user authenticate then check the role

    if (userId === "admin" && userPass === "admin") {
        sessionStorage.setItem("role", 'admin');
        $(location).attr('href', "home.html");
    }
    else {
        document.getElementById("errormsg").innerHTML = 'Something went wrong, Please try again';
          $('#user-name').val('');
          $('#pwd').val('');
    }
}