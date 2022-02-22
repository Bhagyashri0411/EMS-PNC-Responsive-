$(document).ready(function () {
    $('#sidebar-control').click(function () {
        $('#left-sidebar').toggleClass("active");
        if ($('#control-icon').hasClass('fa-caret-right')) {
            $('#control-icon').removeClass('fa-caret-right');
            $('#control-icon').addClass('fa-caret-left');
        } else {
            $('#control-icon').removeClass('fa-caret-left');
            $('#control-icon').addClass('fa-caret-right');
        }

    });
    user1();
});
function user1() {
    document.getElementById("user").innerHTML = sessionStorage.getItem("roles");
    if (sessionStorage.getItem("roles") == "ROLE_USER") {
        $('#energyOverviewRole').remove();
        $('#tpsUnitRole').remove();
        $('#fccuUnitRole').remove();
        $('#ohcuUnitRole').remove();
        $('#hguUnitRole').remove();
        $('#avu1UnitRole').remove();
        $('#ccruUnitRole').remove();
    }
    if (sessionStorage.getItem("roles") == "ROLE_MODERATOR") {
        $('#dhdsUnitRole').remove();
        $('#osruUnitRole').remove();
        $('#avu2UnitRole').remove();
        $('#dhdtUnitRole').remove();
        $('#hcuUnitRole').remove();
        $('#hgu7677UnitRole').remove();
        $('#dcuUnitRole').remove();
        $('#msqUnitRole').remove();
        $('#pxUnitRole').remove();

    }
    if (sessionStorage.getItem("roles") == "ROLE_ADMIN") {
       
       
       
       
       
      
       
       
      
    }
}