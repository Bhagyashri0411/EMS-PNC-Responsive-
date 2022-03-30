function loginClick() {
    
    var userId = document.getElementById("user-name").value;
    var userPass = document.getElementById("pwd").value;
    var loginCridential = { "username": userId, "password": userPass }
    $.ajax({
    headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
    },
        type: "POST",
         
        url: "http://localhost:8090/EmsPNC/api/auth/signin",
        timeout: 15000,
        data:JSON.stringify(loginCridential),
        success: function(res) {
            if (res && res.status === 401) {
                document.getElementById("errormsg").innerHTML = res.message;
            } else {
                console.log(res,'res');
        sessionStorage.setItem("user", res.username);
        console.log(res.username,'fgfgfgf');
        sessionStorage.setItem("accessmenu", JSON.stringify(res.accessmenu));
        sessionStorage.setItem("accessToken",res.accessToken); 
        sessionStorage.setItem("tokenType", res.tokenType);
        sessionStorage.setItem("userRole", "superadmin");
        $(location).attr('href', "home.html");
             
            }
        },
        error: function() {
            document.getElementById("errormsg").innerHTML = "Please Check, You have entered an invalid User ID or Password";
            $('#user-name').val('');
            $('#pwd').val('');
        }

    });
      
}


var input = document.getElementById("pwd");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("emsLogin").click();
    }
});
