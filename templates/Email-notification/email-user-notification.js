$(document).ready(function () {
    getUserEmailNotification();
    getAllKpidetails();

    $("#notificationTable").on('click', '#editNotificaton', function () {
        // var emailType = $(this).data("emailtype");
        //console.log(emailType,'emailType');
        $("#pageNameUpdate").val($(this).data("pagename"));
        $("#updropdown_coins").text($(this).data("kpiname"));
        $("#minValueUpdate").val($(this).data("minvalue"));
        $("#maxValueUpdate").val($(this).data("maxvalue"));

    });

});
function getAllKpidetails() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/AllNotificationData",

    }).done(function (data) {
        console.log(data);

        //Find the input search box

        buildDropDown(data);
        UpdatebuildDropDown(data)

    });
}
//Add dropdown
let addsearch = document.getElementById("addsearchCoin")
let additems = document.getElementsByClassName("adddropdown-item")
function buildDropDown(values) {
    let contents = []
    for (let name of values) {
        contents.push('<input type="button" class="adddropdown-item" type="button" value="' + name + '"/>')
    }
    $('#menuItems').append(contents.join(""))
    $('#empty').hide()
}

//Capture the event when user types into the search box
window.addEventListener('input', function () {
    filter1(addsearch.value.trim().toLowerCase())
})

//For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it
function filter1(word) {
    let length = additems.length
    let collection = []
    let hidden = 0
    for (let i = 0; i < length; i++) {
        if (additems[i].value.toLowerCase().startsWith(word)) {
            $(additems[i]).show()
        }
        else {
            $(additems[i]).hide()
            hidden++
        }
    }

    //If all items are hidden, show the empty view
    if (hidden === length) {
        $('#empty').show()
    }
    else {
        $('#empty').hide()
    }
}

//If the user clicks on any item, set the title of the button as the text of the item
$('#menuItems').on('click', '.adddropdown-item', function () {
    $('#dropdown_coins').text($(this)[0].value)
    $("#dropdown_coins").dropdown('toggle');
})


//update dropdown
let upsearch = document.getElementById("upsearchCoin")
let upitems = document.getElementsByClassName("updropdown-item")
function UpdatebuildDropDown(values) {
    let contents = []
    for (let name of values) {
        contents.push('<input type="button" class="updropdown-item" type="button" value="' + name + '"/>')
    }
    $('#upmenuItems').append(contents.join(""))
    $('#upempty').hide()
}

//Capture the event when user types into the search box
window.addEventListener('input', function () {
    filter(upsearch.value.trim().toLowerCase())
})

//For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it
function filter(word) {
    let length = upitems.length
    let collection = []
    let hidden = 0
    for (let i = 0; i < length; i++) {
        if (upitems[i].value.toLowerCase().startsWith(word)) {
            $(upitems[i]).show()
        }
        else {
            $(upitems[i]).hide()
            hidden++
        }
    }

    //If all items are hidden, show the empty view
    if (hidden === length) {
        $('#upempty').show()
    }
    else {
        $('#upempty').hide()
    }
}

//If the user clicks on any item, set the title of the button as the text of the item
$('#upmenuItems').on('click', '.updropdown-item', function () {
    $('#updropdown_coins').text($(this)[0].value)
    $("#updropdown_coins").dropdown('toggle');
})

function emailmodel() {
    if (!document.getElementById("filldata").innerHTML == "") {
        document.getElementById("filldata").innerHTML = "";
    }
    document.getElementById("addRow").style.display = "block"
}
function emailclosemodel() {
    document.getElementById("addRow").style.display = "none"
}

//Update button

function emailmodelUpdate() {
    document.getElementById("updateRow").style.display = "block"
}
function upemailclosemodel() {
    document.getElementById("updateRow").style.display = "none"
}

function getUserEmailNotification() {
    $.ajax({

        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        type: "GET",
        url: "http://localhost:8090/EmsPNC/AllData",

    }).done(function (data) {
        emailtableRender(data)
    });
}
function emailtableRender(tabledata) {
    console.log(tabledata, "table data");
    var tbdb1 = tabledata;
    var student = '';
    student += '<tr>';
    for (const val of tabledata) {
        student += '<td>' + val['page_name'] + '</td>';
        student += '<td>' + val['kpi_name'] + '</td>';

        // student += '<td>' + val['uom'] + '</td>';
        student += '<td style="text-align: center;">' + val['min_value'] + '</td>';
        student += '<td style="text-align: center;">' + val['max_value'] + '</td>';
        student += '<td style="text-align: center;"><input class="btnRow" id="editNotificaton" onclick="emailmodelUpdate()" type="button" value="Edit" data-pageName="' +
            val['page_name'] + '" data-kpiname="' + val['kpi_name'] + '" data-minvalue="' + val['min_value'] + '" data-maxvalue="' + val['max_value'] + '" /></td>';
        student += '<td style="text-align: center;"><input type="checkbox" class="delRow" value="Edit" /></td>';
        student += '</tr>';
    }
    document.getElementById("bodyNotificationTable").innerHTML = student;
}

function addNewData() {
    var page_name = $("#pageName").val();
    var kpi_name = $("#dropdown_coins").text();
    var min_value = $("#minValue").val();
    var max_value = $("#maxValue").val();
    if (page_name == 0 || kpi_name == 0 || min_value == 0 || max_value == 0) {
        document.getElementById("filldata").innerHTML = "Please Enter the data";
    }
    else {
        var objectarryemail = { 'page_name': page_name, 'kpi_name': kpi_name, 'min_value': min_value, 'max_value': max_value }
        $.ajax({
            type: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
            },
            data: JSON.stringify(objectarryemail),
            url: "http://localhost:8090/EmsPNC/InsertData ",
            success: function (msg) {

                if (msg.status == 'Record Inserted Sucessfully') {
                    document.getElementById("addRow").style.display = "none";
                    getUserEmailNotification();
                    alert("Record Inserted Sucessfully");
                    document.getElementById("clearaddingdata").reset()
                } if (msg.status == 'Kpi Already Exists!') {
                    alert("Record already exist");
                }
                // alert("Data was saved successfully");
                //  toastr.success("Tag Save", "Success");
                //  objectarryemail = [];
                //  var msg1 = msg;
                //  console.log(msg1);
            }
        });


    }
}
//update 
function upaddNewData() {
    var page_name = $("#pageNameUpdate").val();
    var kpi_name = $("#updropdown_coins").text();
    var min_value = $("#minValueUpdate").val();
    var max_value = $("#maxValueUpdate").val();

    var objectarryemail = { 'page_name': page_name, 'kpi_name': kpi_name, 'min_value': min_value, 'max_value': max_value }
    $.ajax({
        type: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        data: JSON.stringify(objectarryemail),
        url: "http://localhost:8090/EmsPNC/UpdateData",
        success: function (msg) {
            var status = msg.status
            if (status == "Record Updated Sucessfully!") {
                document.getElementById("updateRow").style.display = "none";
                getUserEmailNotification();
                alert("Record Updated Sucessfully!");
            } if (status == "Record does not Exists!") {
                alert("Record does not Exists!");
            }
            else {

            }
            // alert("Data was saved successfully");
            //  toastr.success("Tag Save", "Success");
            //  objectarryemail = [];
            //  var msg1 = msg;
            //  console.log(msg1);
        }
    });
}

//select all delete
$('#caldeledataemail').click(function (event) {
    if (this.checked) {
        $(':checkbox').prop('checked', true);
    } else {
        $(':checkbox').prop('checked', false);
    }
});

//search
$("#searchemail").on("keyup", function () {
    var valuemail = $(this).val().toLowerCase();
    $("#bodyNotificationTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(valuemail) > -1)
    });
});

//delete function

$('#deleteNotification').click(function () {
    const tablemail = document.getElementById("bodyNotificationTable");
    const deletedRowemail = [];
    console.log('delete', tablemail);
    if ($('.delRow').prop('checked') == true) {

        for (const [index, row] of [...tablemail.rows].entries()) {
            if (row.querySelector('input:checked')) {
                let deleteDataemail = row.cells[1].innerHTML;
                // console.log('deleteDataemail',deleteDataemail);
                deletedRowemail.push(deleteDataemail);
                // $(':checkbox').prop('checked', false);
            }

        }
        console.log('deletedRowemail', deletedRowemail);
        $.ajax({
            type: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
            },
            data: JSON.stringify(deletedRowemail),
            url: "http://localhost:8090/EmsPNC/DeleteData",
            success: function (msg) {
                if (msg == "Deleted Sucessfully") {
                    //document.getElementById("updateRow").style.display = "none";
                    getUserEmailNotification();
                    alert("Data is delete successfully");
                    $(':checkbox').prop('checked', false);
                } else {

                }
            }
        });
    } else {
        alert('Please Select atleast one checkbox.')
    }



});