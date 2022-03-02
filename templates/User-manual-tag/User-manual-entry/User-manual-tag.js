$(document).ready(function () {
  $("#datatablesSimple1").on('click', '#deleteRow', function () {
      //console.log((this).closest('tr'));
      $(this).closest('tr').remove();
  });
  getCalculatedTag();
  // $("#datatablesCalculatedTag").on('click','.editValues',function(){
  //     console.log((this).closest('tr'));
  //     $(this).closest('tr').find('td:eq(1)').each(function() {
  //           var html = $(this).html();
  //           var input = $('<input class="editableColumnsStyle" type="text" />');
  //           input.val(html);
  //           $(this).html(input);
  //     });
  //  });

  $('#updateRowBtn').click(function() {
     
    const inputDescrip =  $('#tagNamep').val();
    const inputsr = $('#tagValuep').val();
    const inputTagName = $('#timeStampp').val();
  //   const inputUOM = $('#uomp').val();
  //   const inputUOM = $('#discriptionp').val();
    const updateRow = {"manual_tag_name":inputDescrip ,"reference_value":inputsr ,"timestamp":inputTagName }
    $('#updateRow').hide();
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
     type: "post",
      headers: {
     'Content-Type': 'application/json'
     },
     url: "http://192.168.1.123:8080/updatedata",
     data:JSON.stringify(updateRow),
     success: function (msg) {
          var msg1 = msg;
          console.log(msg1);
          getCalculatedTag();
   
       }
   });
  });
  $("#datatablesCalculatedTag").on('click','.editValues',function(){

      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+'T'+time;
      console.log('arre');
      var tagName =  $(this).closest('tr').find('td:eq(0)').text();
      var tagValue =  $(this).closest('tr').find('td:eq(1)').text();
   //   var timeStamp =  $(this).closest('tr').find('td:eq(2)').text();
      var uom =  $(this).closest('tr').find('td:eq(3)').text();
      var discription =  $(this).closest('tr').find('td:eq(4)').text();
      document.getElementById("tagNamep").value=tagName;
      document.getElementById("tagValuep").value=tagValue;
   //  document.getElementById("timeStampp").value=timeStamp;
      document.getElementById("uomp").value=uom;
      document.getElementById("discriptionp").value=discription;
      $('#updateRow').show();
   });
   $("#searchSysConfing").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#bodytablesCalculatedTag tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
});


var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  $('#updateRow').hide();
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
      cell5.innerHTML = '<input class="btn btn-primary" id="deleteRow" type="button" value="Delete" />';
  }
}

$("#Save_button_table").click(function () {
  var keys=[], arrayObj=[];
  $("#datatablesCalculatedTag thead tr th").each(function(){
      keys.push($(this).html());
  });

    $("#bodytablesCalculatedTag tr").each(function(){
      var obj={}, i=0;
      $(this).children("td").each(function(){
        obj[keys[i]]=$(this).html();
        i++;
      })
      arrayObj.push(obj);
    });
    console.log(arrayObj,'ajaj');
})

// $("#Save_button_table").click(function () {
//     arrayObj=[] ;  
//     $("#bodytablesCalculatedTag tr ").each(function(){
//         {
//             ManualEntry:$(this).closest('tr').find('td:eq(0)').text()
//             Timestamp:$(this).closest('tr').find('td:eq(2)').text()
//             UOM:$(this).closest('tr').find('td:eq(3)').text()
//             TagValues:$(this).closest('tr').find('td:eq(1)').value()
//         }
//     });
// })


$("#saveTable").click(function () {
      var tabledata = document.getElementById("datatablebody");
      var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var dateTime = date+'T'+time;
          // console.log(dateTime);
          // $(this).closest('tr').find('td:eq(2)').html(dateTime);
      var rowsdata = [];
      // for (i = 0; i <= tabledata.rows.length - 1; i++) {
      //     const numberRow = $(tabledata).find('tr')[i];
      //     console.log('numberRow', $(numberRow).find('#inputColumnName').val());
      //     const dataObj = {
      //         manual_tag_name: $(numberRow).find('#inputColumnName').val(),
      //         reference_value: $(numberRow).find("#tagValueManual").val(),
      //         timestamp: dateTime,
      //         uom: $(numberRow).find("#UOMmanual").val(),
      //         description: $(numberRow).find("#descriptmanual").val(),
      //     }
      //     rowsdata.push(dataObj);
      // }
      const numberRow = $(tabledata).find('tr');
          console.log('numberRow', $(numberRow).find('#inputColumnName').val());
          const dataObj = {
              manual_tag_name: $(numberRow).find('#inputColumnName').val(),
              reference_value:  parseInt($(numberRow).find("#tagValueManual").val()),
              //  timestamp: dateTime,
              uom: $(numberRow).find("#UOMmanual").val(),
              description: $(numberRow).find("#descriptmanual").val(),
          }
      
      const tableName = dataObj;
      console.log(tableName,'tableName');
      var rowdata1 = JSON.stringify(tableName)
      console.log('array', rowdata1);
      $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
          type: "post",
          headers: {
              'Content-Type': 'application/json'
          },
          url: "http://192.168.1.123:8080/insertdata",
          data: rowdata1,
          success: function (msg) {
              var msg1 = msg;
              if (msg1 == 'sucess') {
                  document.getElementById("eTable").innerText = 'Manualtag inserted successfully';
                  getCalculatedTag();
                  document.getElementById("inputColumnName").value="";
                  document.getElementById("tagValueManual").value="";
                  document.getElementById("descriptmanual").value="";
                  document.getElementById("UOMmanual").value="";
                  
              } else {
                  document.getElementById("eTable").innerText = 'Manualtag already exist'; 
              }
          }
      });
});



function getCalculatedTag() {
  $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
      method: "GET",
      url: "http://192.168.1.123:8080/Constantlist",
      //url:"./../../../templates/User-manual-tag/User-manual-entry/userManual.json",
  }).done(function (data) {
      
      var tabledata = data;
      console.log(tabledata);
      var tbdb1 = tabledata;
      var student = '';
      student += '<tr>';
      for (const val of tabledata) {
          student += '<td>' + val['manual_tag_name'] + '</td>';
          student += '<td>' + val['reference_value'] + '</td>';
          // student += '<td>' + val['uom'] + '</td>';
         student += '<td>' + val['timestamp'] + '</td>';
          student += '<td>' + val['uom'] + '</td>';
          student += '<td>' + val['description'] + '</td>';
          student += '<td><input class="editValues btn btn-primary"  type="button" value="Edit"</input></td>';
          //   student += '<td><input type="checkbox" class="delRow" name="delBox" value="Edit Row" /></td>';
          student += '</tr>';
      }
      document.getElementById("bodytablesCalculatedTag").innerHTML = student;
      console.log('hello');
  });

}


// download csv

function exportFunction(){   
  $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
      method: "GET",
       url: "http://192.168.1.123:8080/Constantlist",
     // url:"./../../../templates/User-manual-tag/User-manual-entry/userManual.json",
  }).done(function(data){
    console.log(data)

      const csvRows = [];

      const headers ="description,reference_value,manual_tag_name,uom,timestamp" ;
      csvRows.push(headers);
      console.log(data, "name");
      
//console.log(csvRows, "values");

      for (const row of data) {
          csvRows.join('\n');
          var abc ='\n'+ row.description+','+row.reference_value+','+row.manual_tag_name+','+row.uom+','+row.timestamp;
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

// uploadFunction

// function uploadFunction() {
//     var file = document.getElementById('chooseFile').value;
//     const myArr = file.replace(/^.*\\/, "");
//     console.log(myArr,'file');
//     $.ajax({
        // headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        // },
//         type: "post",
//          headers: {
//         'Content-Type':false
//         },
//         url: "http://192.168.1.123:8080/upload-csv-file",
//         data:myArr,
//         success: function (msg) {
//              var msg1 = msg;
//              console.log(msg1);
    
//           }
//       });

// }
//  function uploadFunction() {
//      var form = new FormData($("#chooseFile"));
//      console.log(form);
//      $.ajax({
        // headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        // },
//         url: 'http://192.168.1.123:8080/upload-csv-file',
//         data: form,
//         cache: false,
//         contentType: false,
//         processData: false,
//         type: 'POST',
//         success: function(data){
//             alert(data);
//         }
//     });
//     // if(data.fake) {
//     //     // Make sure no text encoding stuff is done by xhr
//     //     opts.xhr = function() { var xhr = jQuery.ajaxSettings.xhr(); xhr.send = xhr.sendAsBinary; return xhr; }
//     //     opts.contentType = "multipart/form-data; boundary="+data.boundary;
//     //     opts.data = data.toString();
//     // }
//     // jQuery.ajax(opts);
//  }

var form = document.getElementById('form_ip');
var fileSelect = document.getElementById('chooseFile');
var uploadButton = document.getElementById('upload-button');

form.onsubmit = function(event) {
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
xhr.open('POST', 'http://192.168.1.123:8080/upload-csv-file', true);
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