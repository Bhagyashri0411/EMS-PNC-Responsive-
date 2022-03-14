$(document).ready(function () {
    getCalculatedTag();

    $("#datatablesCalculatedTag").on('click', '.editValues', function () {
        var Alias = $(this).closest('tr').find('td:eq(0)').text();
        var Formula = $(this).closest('tr').find('td:eq(1)').text();
        var Description = $(this).closest('tr').find('td:eq(2)').text();
        var das_write_back = $(this).closest('tr').find('td:eq(3)').text();
        var result_tag = $(this).closest('tr').find('td:eq(4)').text();
        var Result = $(this).closest('tr').find('td:eq(5)').text();
        // var min = $(this).closest('tr').find('td:eq(6)').text();
        // var max = $(this).closest('tr').find('td:eq(7)').text();
        // var email_notification = $(this).closest('tr').find('td:eq(8)').text();
        var decimal_point = parseInt($(this).closest('tr').find('td:eq(6)').text());
        document.getElementById("alias").value = Alias;
        document.getElementById("formulaTag").value = Formula;
        document.getElementById("descriptionTag").value = Description;
        document.getElementById("result_tag").value = Result;
        document.getElementById("storeResulttag").value = das_write_back;
        document.getElementById("resultTag1").value = result_tag;
        // document.getElementById("min_tag").value = min;
        // document.getElementById("max_tag").value = max;
        // document.getElementById("email_tag").value = email_notification;
        document.getElementById("decimal_tag").value = decimal_point;
        $('#updateRow').show();
    });
    $("#searchSysConfing").on("click", function () {
        var value = $("#SearchInput").val().toLowerCase();
        $("#bodytablesCalculatedTag tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('#updateRowBtn').click(function () {

        var alias1 = document.getElementById('alias').value;
        var Formula1 = document.getElementById('formulaTag').value;
        var Description1 = document.getElementById('descriptionTag').value;
        var storeResulttag1 = document.getElementById('storeResulttag').value;
        var resultTag1 = document.getElementById('resultTag1').value;
        var DecimalPointTag1 = document.getElementById('decimal_tag').value;
        var addRowValue1 = { 'alias': alias1, 'formula': Formula1, 'description': Description1, 'das_write_back': storeResulttag1, 'result_tag': resultTag1, 'decimal_point': DecimalPointTag1 };
        $.ajax({
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
            },
            type: "post",

            url: "http://localhost:8090/EmsPNC/update",
            data: JSON.stringify(addRowValue1),
            success: function (status) {
                //  var msg1 = msg;
                //  console.log(msg1);

                if (status == 'Updated sucessfully') {
                    getCalculatedTag();
                    $('#updateRow').hide();

                    alert('Updated sucessfully');
                }

                else {


                    $('#updateRow').hide();
                    console.log(status, 'gggfff');
                    alert(status);

                }



            }

        });




    });
});


var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    $('#updateRow').hide();

}

var span = document.getElementsByClassName("close1")[0];
span.onclick = function () {
    $('#addRowData').hide();

}

var span = document.getElementsByClassName("close2")[0];
span.onclick = function () {
    $('#protocol-main').hide();

}

function addRow() {

    const table = document.getElementById("datatablesSimple1");
    const table1 = document.getElementById("datatablebody");
    const lastrow = table1.rows[table1.rows.length - 1];
    console.log(lastrow);
    const lstrow = $(lastrow).find('td')[0];
    const lstrow1 = $(lastrow).find('td')[1];
    console.log(lstrow);
    const columnName = $(lstrow).find('#inputColumnName').val();
    const dataTypedrpdown = $(lstrow1).find('#tagValueManual').val();
    console.log(columnName);
    console.log(dataTypedrpdown);

    if (columnName.indexOf(' ') >= 0 || columnName.indexOf('-') >= 0 || columnName == "" || dataTypedrpdown == "") {
        document.getElementById("ERRORtblconfig").innerHTML = 'Column name and Data type should not contain blank space and hyphen sign';
    } else {
        $('#ERRORtblconfig').hide();
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        //  var cell6 = row.insertCell(5);
        cell1.innerHTML = '<input class="form-control" id="inputColumnName" type="text" placeholder="Enter Tag Name"/>';
        cell2.innerHTML = '<input class="form-control" id="tagValueManual" type="text" placeholder="Enter Values"/>';
        // cell3.innerHTML = '<input class="form-control" id="Timestampmanual" type="text" placeholder="Enter Timestamp"/>';
        cell3.innerHTML = '<input class="form-control" id="UOMmanual" type="text" placeholder="Enter UOM"/>';
        cell4.innerHTML = '<input class="form-control" id="descriptmanual" type="text" placeholder="Enter Description"/>';
        // cell5.innerHTML = '<input class="btn btn-primary" id="deleteRow" type="button" value="Delete" />';
    }
}

function getCalculatedTag() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/alldata",

    }).done(function (data) {
        var tabledata = data;
        console.log(tabledata);
        var tbdb1 = tabledata;
        var student = '';
        student += '<tr>';
        for (const val of tabledata) {
            student += '<td>' + val['alias'] + '</td>';
            student += '<td style="table-layout: fixed; width: 100px; overflow-wrap: anywhere;">' + val['formula'] + '</td>';
            student += '<td style=" width: 100px; overflow-wrap: anywhere;"> ' + val['description'] + '</td>';
            student += '<td class="w4">' + val['das_write_back'] + '</td>';
            student += '<td style="width: 100px; overflow-wrap: anywhere;">' + val['result_tag'] + '</td>';
            student += '<td class="w4">' + val['result'] + '</td>';
            student += '<td class="w4">' + val['decimal_point'] + '</td>';
            student += '<td><input class="editValues btn btn-primary" type="button" value="Edit"</input></td>';
            student += '</tr>';
        }
        document.getElementById("bodytablesCalculatedTag").innerHTML = student;
        console.log('hello');
    });

}


// download csv

function exportFunction() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/alldata",
    }).done(function (data) {
        console.log(data)

        const csvRows = [];

        const headers = "alias,formula,description,das_write_back,result_tag,result,decimal_point";
        csvRows.push(headers);
        console.log(data, "name");

        //console.log(csvRows, "values");

        for (const row of data) {
            csvRows.join('\n');
            var abc = '\n"' + row.alias + '","' + row.formula + '","' + row.description + '",' + row.das_write_back + ',"' + row.result_tag + '",' + row.result + ',' + row.decimal_point;
            csvRows.push(abc);
        }

        console.log(csvRows, "name");
        const blob = new Blob(csvRows, { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'Formula-Management.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}
function sampledownload() {
    var data = [];
    var csv = 'alias,formula,description,das_write_back,result_tag,result,decimal_point\n';
    data.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });

    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Sample_CSV.csv';
    hiddenElement.click();

}
//Add popup
function addNewEntry() {
    $('#addRowData').show();

}

function protocolRule() {
    $('#protocol-main').show();
}

function ServiceCall() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/auth/formula/GetFormulaData",
        method: "GET"
    }).done(function (data) {
        console.log(data)
        var tabledata = data;
        console.log(tabledata);
        var tbdb1 = tabledata;
        var student = '';
        student += '<tr>';
        for (const val of tabledata) {
            student += '<td>' + val['alias'] + '</td>';
            student += '<td>' + val['formula'] + '</td>';
            student += '<td>' + val['description'] + '</td>';
            student += '<td>' + val['result_tag'] + '</td>';
            student += '<td>' + val['das_write_back'] + '</td>';
            student += '<td>' + val['decimal_point'] + '</td>';
            student += '<td><input class="editValues btn btn-primary" onclick="addRow()"  type="button" value="Edit"</input></td>';
            student += '</tr>';
        }
        document.getElementById("bodytablesCalculatedTag").innerHTML = student;
        console.log('hello');
    });
}
//Delete
$("#datatablesCalculatedTag").on('click', '.deleteValues', function () {
    var Alias = $(this).closest('tr').find('td:eq(0)').text();
    console.log(Alias);
    var aliasValue = { "alias": Alias }
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        type: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        url: "http://localhost:8090/EmsPNC/delete",
        data: JSON.stringify(aliasValue),
        success: function (msg) {
            var msg1 = msg;
            console.log(msg1);

            if (msg == 'Deleted sucessfully') {
                getCalculatedTag();
            }


        }
    });
});

//new entry add Row
function addNewData() {
    var alias = document.getElementById('aliasAdd').value;
    var Formula = document.getElementById('formulaTagAdd').value;
    var Description = document.getElementById('descriptionTagAdd').value;
    var resultTag = document.getElementById('resultTagAdd').value;
    var storeResulttag = document.getElementById('storeResulttagAdd').value;
    var decimalpointtag = document.getElementById('decimal_tagAdd').value;


    var addRowValue = { 'alias': alias, 'formula': Formula, 'description': Description, 'result_tag': resultTag, 'decimal_point': decimalpointtag };
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        type: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        url: "http://localhost:8090/EmsPNC/insert",
        data: JSON.stringify(addRowValue),
        success: function (status) {
            //  var msg1 = msg;
            console.log(status, 'sttatus');
            if (status == 'Alias already present, please try with new alias or edit existing one.') {

                alert('Alias already present, please try with new alias or edit existing one.');
            }
            if (status == 'Formula inserted successfully.') {


                getCalculatedTag();

                alert('Formula inserted successfully.');
                $('#addRowData').hide();
            }
            else {

                $('#addRowData').hide();
                console.log(status, 'tttttt');
                alert(status);
            }
            if (status === 500) {
                getCalculatedTag();

                $('#addRowData').hide();
                alert('uuukj');

            }
        }

    });

}

//upload csv
var form = document.getElementById('form_ipformula');
var fileSelect = document.getElementById('chooseFileformula');
var uploadButton = document.getElementById('upload-buttonformula');

form.onsubmit = function (event) {
    console.log("in form action");
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
    xhr.open('POST', 'http://localhost:8090/EmsPNC/upload-csv-fileformula', true);
    xhr.onload = function (status) {
        if (status == 'Success') {
            uploadButton.innerHTML = 'Upload';
            getCalculatedTag();
            alert('Success');
        }

        else {
            alert(xhr.responseText);
        }

        if (status = !200) {

            console.log(status, 'ffgfhgvvhg');
            //  getCalculatedTag();
            alert('Please Contact Customer Support!');

        }
    };
    xhr.send(formData);
}
