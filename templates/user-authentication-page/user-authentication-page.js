$(document).ready(function () {
    console.log("hii");
    getCalculatedTag();
    $("#datatablesCalculatedTag1").on('click', '.editValues', function () {
        // var today = new Date();
        // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // var dateTime = date + 'T' + time;
        var userName = $(this).closest('tr').find('td:eq(0)').text();
        var userRole = $(this).closest('tr').find('td:eq(1)').text();
        var empName = $(this).closest('tr').find('td:eq(2)').text();
        var empEmailID = $(this).closest('tr').find('td:eq(3)').text();
        var empEmailNotification = $(this).closest('tr').find('td:eq(4)').text();
        var empMobileNo = $(this).closest('tr').find('td:eq(5)').text();
        var userType = $(this).closest('tr').find('td:eq(9)').text();
        document.getElementById("tagNamep").value = userName;
        $("#tagValuep option[value='"+ userRole +"']").attr("selected", "selected");
        $("#empEmailnotificaton option[value='"+ empEmailNotification +"']").attr("selected", "selected");
        $("#userType option[value='"+ userType +"']").attr("selected", "selected");
        // document.getElementById("tagValuep").value = tagValue;
        document.getElementById("empName").value = empName;
        document.getElementById("empEmailId").value = empEmailID;
        document.getElementById("empMobileNo").value = empMobileNo;
        $('#updateRow').show();
    });
    

    $("#userType").on("change", function () {
        // console.log("from", event.target.value);
        if ($('#userType').val() == 'Local') {
            $('#localPassword').show();  
        }else{
            $('#localPassword').hide();
        }
        
      });
      $("#addUserType").on("change", function () {
        // console.log("from", event.target.value);
        if ($('#addUserType').val() == 'Local') {
            $('#addlocalPassword').show();  
        }else{
            $('#addlocalPassword').hide();
        }
        
      });

});

// add model
function usermodel() {
    document.getElementById("AdduserRow").style.display = "block";
    if (document.getElementById("eTableerroe").innerText == 'Please Enter Values.....') {
        document.getElementById("eTableerroe").innerText = '';
    }
}
function adduserclose() {
    document.getElementById("AdduserRow").style.display = "none"
}

//Update model
function openupdate() {
    document.getElementById("updateRow").style.display = "block"
}
function closeuserupdate() {
    document.getElementById("updateRow").style.display = "none"
}

// search data from table
$("#searchSysConfing").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#bodytablesCalculatedTag tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

// Add data from add model
function saveTable() {
    var addUser = $('#inputColumnName').val();
    var addUserRole = $("#addUserRole").val();
    var addEmployeeName = $("#addUserName").val();
    var addEmailId = $("#addEmailId").val();
    var addEmailNotification = $("#addEmailNotification").val();
    var addMobile = $("#addMobile").val();
    var addUserType = $("#addUserType").val();
    var addPassword = $("#addempPassword").val();
    var tabledata = document.getElementById("datatablebody");
    
    if (addUserType == 'Local') {
        $('#addempPassword').show();
        
    }
    // var today = new Date();
    // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // const numberRow = $(tabledata).find('tr');
    // console.log('numberRow', $(numberRow).find('#inputColumnName').val());
    if (addUser == "" || addUserRole == "" || addEmployeeName == "" || addEmailId == "" || addEmailNotification == "" || addMobile == "" || addUserType == "") {
        document.getElementById("eTableerroe").innerText = 'Please Enter Values.....';
    }
    else {
        var dataObj ={
            "username":addUser,
            "role": addUserRole,
                "role_id": 10,
                "employee_name": addEmployeeName,
                "email_id": addEmailId,
                "email_notification": addEmailNotification,
                "password": addPassword,
                "mobile_no":addMobile,
                "login_time": "2022-03-15T15:00:00",
                "logout_time": "2022-03-15T15:00:00",
                "status": "Active",
                
                "user_type": addUserType
                }
        console.log(dataObj, "messa");
        var rowdata1 = JSON.stringify(dataObj)
        console.log('array', rowdata1);
        $.ajax({
            type: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
            },
            url: "https://192.168.1.120:8090/insertuserdetails",
            data: rowdata1,
            success: function (msg) {




                var msg1 = msg.status;
                if (msg1 == 'Record Inserted Sucessfully') {
                    // document.getElementById("eTable").innerText = 'Manualtag inserted successfully';
                    alert("New record inserted successfully")
                    getCalculatedTag();
                    document.getElementById("inputColumnName").value = "";
                    document.getElementById("addUserRole").value = "";
                    document.getElementById("addUserName").value = "";
                    document.getElementById("addEmailId").value = "";
                    document.getElementById("addEmailNotification").value = "";
                    document.getElementById("addMobile").value = "";
                    document.getElementById("addMobile").value = "";
                    $('#AdduserRow').hide()

                }
                if (msg == 'Username Already Exists!') {
                    alert("This User is Already Exists")
                }
                else {
                    document.getElementById("eTableerroe").innerText = 'Please Enter Values.....';
                }
            }
        });
    }
}

// Get mapping of table
function getCalculatedTag() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "https://192.168.1.120:8090/getalldata",
    }).done(function (data) {
        fetchgetCalculatedTag(data)

    })
        .fail(function () {
            var dummyjson = [{
                "username": "priyanka@iocl",
        "role": "systemadmin",
        "role_id": 1,
        "employee_name": "Priyanka Wagh",
        "email_id": "priyankawagh31@gmail.com",
        "email_notification": true,
        "password": "priyanka123",
        "mobile_no": 8999.0,
        "login_time": "2022-03-15T15:00:00",
        "logout_time": "2022-03-15T15:00:00",
        "status": "Active",
        "token": 123,
        "user_type": "L-Dap"               
            }]
            fetchgetCalculatedTag(dummyjson)
        });
}
function fetchgetCalculatedTag(data) {
    var tabledata = data;
    var student = '';
    student += '<tr>';
    for (const val of tabledata) {
        student += '<td>' + val['username'] + '</td>';
        student += '<td>' + val['role'] + '</td>';
        student += '<td>' + val['employee_name'] + '</td>';
        student += '<td>' + val['email_id'] + '</td>';
        student += '<td>' + val['email_notification'] + '</td>';
        student += '<td>' + val['mobile_no'] + '</td>';
        student += '<td>' + val['login_time'] + '</td>';
        student += '<td>' + val['logout_time'] + '</td>';
        student += '<td>' + val['status'] + '</td>'; 
        student += '<td>' + val['user_type'] + '</td>'; 
        student += '<td><input class="editValues btn btn-primary"  type="button" value="Edit"</input></td>';
        student += '<td><input type="checkbox" class="delusermanual" name="delBox" value="Edit Row" /></td>';
        student += '</tr>';
    }
    document.getElementById("bodytablesCalculatedTag").innerHTML = student;
}

// Update Data from update model
$('#updateRowBtn').click(function () {
    var tagNamep = $('#tagNamep').val();
    var tagValuep = $('#tagValuep').val();
    var empName = $('#empName').val();
    var empEmailId = $('#empEmailId').val();
    var empEmailnotificaton = $('#empEmailnotificaton').val();
    var empMobileNo = $('#empMobileNo').val();
    var userType = $('#userType').val();
    
    if (userType == 'Local') {
        $('#localPassword').show();
        var password = $('#empPassword').val();
        var updateRow = { "username": tagNamep, "role": tagValuep, "employee_name": empName, 'email_id': empEmailId,
     'email_notification': empEmailnotificaton ,'mobile_no': empMobileNo,'user_type': userType ,'password':password}
    }else{
        var updateRow = { "username": tagNamep, "role": tagValuep, "employee_name": empName, 'email_id': empEmailId,
     'email_notification': empEmailnotificaton ,'mobile_no': empMobileNo,'user_type': userType ,'password':' '}
    }
    
    $('#updateRow').hide();
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        url: "https://192.168.1.120:8090/updateuserdetails",
        data: JSON.stringify(updateRow),
        success: function (msg) {
            var status = msg.status;
            if (status == "Record Updated Sucessfully!") {
                getCalculatedTag();
                alert("Record Updated Sucessfully!");
            }
            if (status == "Record does not Exists!") {
                alert("Record does not Exists!");
            } else {
            }
        }
    });
});

//select all delete
// $('#deleteuserdata').click(function (event) {
//     if (this.checked) {
//         $(':checkbox').prop('checked', true);
//     } else {
//         $(':checkbox').prop('checked', false);
//     }
// });

// delete data 
function userdeletedata() {
    console.log("hii hii u");
    const usertable = document.getElementById("bodytablesCalculatedTag");
    const deletedRowemail = [];
    if ($('input:checkbox:checked').val() == 'Edit Row') {

        for (const [index, row] of [...usertable.rows].entries()) {
            if (row.querySelector('input:checked')) {
                let deleteDataemail = row.cells[0].innerHTML;

                // var formatdelete = { "manual_tag_name ": deleteDataemail }
                deletedRowemail.push(deleteDataemail)
            }
        }
        console.log(deletedRowemail, "jhjdhfejhfjkh");
        $.ajax({
            type: "post",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
            },
            data: JSON.stringify(deletedRowemail),
            url: "https://192.168.1.120:8090/deleteuserdetails",
            success: function (msg) {
                if (msg.status == "Record deleted Sucessfully") {
                    getCalculatedTag();
                    alert("Data is delete successfully");
                    //$(':checkbox').prop('checked', false);
                } else {

                }
            }
        });

    }
    else {
        alert('Please Select atleast one checkbox.')
    }
}
// sample csv download
function sampledownloaduser() {
    var data = [];
    var datausercsv = 'manual_entry,tag_values,time_stamp,uom,description,edit\n';
    data.forEach(function (row) {
        datausercsv += row.join(',');
        datausercsv += "\n";
    });

    var usercsv = document.createElement('a');
    usercsv.href = 'data:text/csv;charset=utf-8,' + encodeURI(datausercsv);
    usercsv.target = '_blank';
    usercsv.download = 'Sample_CSV.csv';
    usercsv.click();
}

// download csv
function exportFunction() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://192.168.1.117:8090/auth/ManualEntry/getData",
    }).done(function (data) {

        console.log(data)
        const csvRows = [];
        const headers = "description,reference_value,manual_tag_name,uom,Timestamp";
        csvRows.push(headers);
        console.log(data, "name");
        for (const row of data) {
            csvRows.join('\n');
            var abc = '\n' + row.description + ',' + row.reference_value + ',' + row.manual_tag_name + ',' + row.uom + ',' + row.timestamp;
            csvRows.push(abc);
        }
        console.log(csvRows, "name");
        const blob = new Blob(csvRows, { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'User-manual.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// upload csv code
var form = document.getElementById('form_ip');
var fileSelect = document.getElementById('chooseFile');
var uploadButton = document.getElementById('upload-button');
form.onsubmit = function (event) {
    event.preventDefault();
    // Update button text.
    uploadButton.innerHTML = 'Uploading...';
    var files = fileSelect.files;
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('file', file, file.name);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://192.168.1.117:8090/auth/ManualEntry/upload-csv-fileManualTag', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            uploadButton.innerHTML = 'Upload';
            getCalculatedTag();
            alert('upload');
        } else {
            alert('An error occurred!');
        }
    };
    xhr.send(formData);
}