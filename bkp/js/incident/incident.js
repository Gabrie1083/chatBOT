import hasher from 'hasher';
import $ from 'jquery';
import * as bootstrap from "bootstrap";
//import TomSelect from "tom-select";
import Swal from 'sweetalert2';
import {ApiUrl, ReportUrl} from "../../index";
import {fnShowLoader,fnHideLoader,fnAlertToast,fnNetworkCheck,fnXhrErrorAlert, fnDTSearchEnable} from "../commonFunction";

function fnIncidentPageInit() {
  var start = moment().subtract(29, 'days');
  var end = moment();

  function cb(start, end) {
      $('#txtOrderFilterDateRange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  }

  $('#txtOrderFilterDateRange').daterangepicker({
    alwaysShowCalendars:true,
      startDate: start,
      endDate: end,
      ranges: {
         'Today': [moment(), moment()],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment()],
         'Last 30 Days': [moment().subtract(29, 'days'), moment()],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      locale: {
        format: 'DD/MM/YYYY' // --------Here
    },

  }, cb);

  cb(start, end);

  // new TomSelect('#SelInciType',{
  //   create: true,
  //   sortField: {
  //       field: "text",
  //       direction: "asc"
  //   }
  // });

  // new TomSelect('#SelInciStatus',{
  //   create: true,
  //   sortField: {
  //       field: "text",
  //       direction: "asc"
  //   }
  // });
  // new TomSelect('#SelInciSeverity',{
  //   create: true,
  //   sortField: {
  //       field: "text",
  //       direction: "asc"
  //   }
  // });
  

  $('#txtfilterdate').daterangepicker({
    //singleDatePicker: true,
    showDropdowns: true,
     maxDate: new Date(),
     locale: {
      format: 'DD/MM/YYYY' // --------Here
  },
});

$(document).on('click','.fnOpenIncidentFilter',function(){
  $('.divIncidentFilterPanel').slideToggle();
});

$(document).on('click','.fnRedirectNewIncident',function(){
  hasher.setHash('incident/new');
});

  fnIncidentRptList();

}





function fnIncidentRptList()
{
 
  let data =  [
    {
      "id": 3996,
      "siteid": null,
      "incident_id": "IR1537",
      "incident_date": "08/02/2023 1:03PM",
      "report_date": "08/02/2023 3:53PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3874,
      "siteid": null,
      "incident_id": "IR1462",
      "incident_date": "04/01/2023 1:39PM",
      "report_date": "04/01/2023 3:35PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3853,
      "siteid": null,
      "incident_id": "IR1453",
      "incident_date": "25/12/2022 10:10PM",
      "report_date": "26/12/2022 7:04AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "MOHAMAD JAMIL BIN JUMARI ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 5246,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3814,
      "siteid": null,
      "incident_id": "IR1435",
      "incident_date": "10/12/2022 2:30PM",
      "report_date": "10/12/2022 8:23PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 3,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "High",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3791,
      "siteid": null,
      "incident_id": "IR1421",
      "incident_date": "29/11/2022 10:20PM",
      "report_date": "02/12/2022 3:28AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "MOHAMAD JAMIL BIN JUMARI ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 5246,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3730,
      "siteid": null,
      "incident_id": "IR1397",
      "incident_date": "11/11/2022 9:05AM",
      "report_date": "11/11/2022 10:55AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3662,
      "siteid": null,
      "incident_id": "IR1369",
      "incident_date": "22/10/2022 10:10PM",
      "report_date": "26/10/2022 2:35PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KONG KWOK LEONG ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 8481,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3664,
      "siteid": null,
      "incident_id": "IR1371",
      "incident_date": "22/10/2022 3:00PM",
      "report_date": "26/10/2022 2:41PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KONG KWOK LEONG ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 8481,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3608,
      "siteid": null,
      "incident_id": "IR1339",
      "incident_date": "06/10/2022 2:29PM",
      "report_date": "06/10/2022 5:11PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 3,
      "status": "Closed",
      "status_id": 14,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "High",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3597,
      "siteid": null,
      "incident_id": "IR1331",
      "incident_date": "02/10/2022 7:05PM",
      "report_date": "04/10/2022 11:07AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KONG KWOK LEONG ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 8481,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3581,
      "siteid": null,
      "incident_id": "IR1321",
      "incident_date": "01/10/2022 1:49PM",
      "report_date": "01/10/2022 4:41PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3511,
      "siteid": null,
      "incident_id": "IR1284",
      "incident_date": "15/09/2022 1:20PM",
      "report_date": "15/09/2022 7:27PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 3,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "High",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3454,
      "siteid": null,
      "incident_id": "IR1246",
      "incident_date": "03/09/2022 4:55AM",
      "report_date": "03/09/2022 6:55AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "MOHAMAD JAMIL BIN JUMARI ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 5246,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3408,
      "siteid": null,
      "incident_id": "IR1229",
      "incident_date": "26/08/2022 6:26PM",
      "report_date": "26/08/2022 7:33PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 3,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "High",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3272,
      "siteid": null,
      "incident_id": "IR1181",
      "incident_date": "09/08/2022 10:15PM",
      "report_date": "10/08/2022 12:37AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "MOHAMAD JAMIL BIN JUMARI ",
      "type_desc": "Water Pipe Leak",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 5246,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/water_leakage.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3259,
      "siteid": null,
      "incident_id": "IR1173",
      "incident_date": "06/08/2022 9:01AM",
      "report_date": "06/08/2022 10:07AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3248,
      "siteid": null,
      "incident_id": "IR1164",
      "incident_date": "02/08/2022 9:45AM",
      "report_date": "02/08/2022 10:49AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3245,
      "siteid": null,
      "incident_id": "IR1161",
      "incident_date": "01/08/2022 7:15AM",
      "report_date": "01/08/2022 9:33PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "MOHAMAD JAMIL BIN JUMARI ",
      "type_desc": "Water Pipe Leak",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 5246,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/water_leakage.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3109,
      "siteid": null,
      "incident_id": "IR1097",
      "incident_date": "30/06/2022 3:40PM",
      "report_date": "30/06/2022 5:32PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 1,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3094,
      "siteid": null,
      "incident_id": "IR1092",
      "incident_date": "28/06/2022 11:19AM",
      "report_date": "28/06/2022 3:47PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3082,
      "siteid": null,
      "incident_id": "IR1083",
      "incident_date": "24/06/2022 6:22PM",
      "report_date": "25/06/2022 1:23PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3081,
      "siteid": null,
      "incident_id": "IR1082",
      "incident_date": "24/06/2022 5:10PM",
      "report_date": "24/06/2022 7:45PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Others",
      "severity": 2,
      "status": "Closed",
      "status_id": 14,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3069,
      "siteid": null,
      "incident_id": "IR1079",
      "incident_date": "21/06/2022 2:44PM",
      "report_date": "21/06/2022 4:58PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3046,
      "siteid": null,
      "incident_id": "IR1063",
      "incident_date": "17/06/2022 10:34AM",
      "report_date": "17/06/2022 2:23PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Alarm Activation",
      "severity": 2,
      "status": "Closed",
      "status_id": 14,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/alarm.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 3030,
      "siteid": null,
      "incident_id": "IR1052",
      "incident_date": "13/06/2022 2:32PM",
      "report_date": "13/06/2022 5:06PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2956,
      "siteid": null,
      "incident_id": "IR1004",
      "incident_date": "31/05/2022 6:09PM",
      "report_date": "31/05/2022 6:09PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2955,
      "siteid": null,
      "incident_id": "IR1003",
      "incident_date": "30/05/2022 7:25PM",
      "report_date": "31/05/2022 10:02PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2891,
      "siteid": null,
      "incident_id": "IR0964",
      "incident_date": "14/05/2022 11:50AM",
      "report_date": "14/05/2022 11:50AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "MANIARASI D/O MUNIRAJAN ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 4883,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2884,
      "siteid": null,
      "incident_id": "IR0958",
      "incident_date": "10/05/2022 8:57PM",
      "report_date": "10/05/2022 11:18PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "HARISHANAND A JAGADEESSAN ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 8672,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2866,
      "siteid": null,
      "incident_id": "IR0947",
      "incident_date": "30/04/2022 5:45AM",
      "report_date": "05/05/2022 6:47AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "HARISHANAND A JAGADEESSAN ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 8672,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2848,
      "siteid": null,
      "incident_id": "IR0937",
      "incident_date": "27/04/2022 10:43AM",
      "report_date": "28/04/2022 2:40PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KIRAN BAHADUR VIJEYAN ",
      "type_desc": "Damage to Property",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 7781,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/damage.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2847,
      "siteid": null,
      "incident_id": "IR0936",
      "incident_date": "26/04/2022 11:16PM",
      "report_date": "27/04/2022 9:00PM",
      "sitename": "Singapore Food Agency",
      "reportperson": "HARISHANAND A JAGADEESSAN ",
      "type_desc": "Others",
      "severity": 2,
      "status": "Open",
      "status_id": 12,
      "empid": 8672,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Medium",
      "inc_status": null,
      "inc_severity": null
    },
    {
      "id": 2685,
      "siteid": null,
      "incident_id": "IR0854",
      "incident_date": "27/02/2022 7:45PM",
      "report_date": "28/02/2022 9:00AM",
      "sitename": "Singapore Food Agency",
      "reportperson": "KONG KWOK LEONG ",
      "type_desc": "Others",
      "severity": 1,
      "status": "Closed",
      "status_id": 14,
      "empid": 8481,
      "icon_img": "https://secureplus.blob.core.windows.net/02spil/Icon/others.png",
      "severity_name": "Low",
      "inc_status": null,
      "inc_severity": null
    }
  ];


  var dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item" href="#"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text" href="#"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  var dtopts = {
    "bPaginate": true,
    "bLengthChange": true,
    "bDestroy": true,
    "bFilter": true,
    "bInfo": true,
    "processing": true,
    "pageLength": 100,
    "lengthMenu": [[100, 200, 500, -1], [100, 200, 500, "All"]],
    "aaSorting": [],
    data: data,
    dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
    //"order": [[0, 'asc']],
    "columnDefs": [
        { "orderable": false, "targets": [6,7] },
        { "targets": [0], "render": function (data, type, full, meta) { return '<span>' + data + '</span>' } },
        { "targets": [1], "render": function (data, type, full, meta) { return '<a class="btn btn-link"  >' + data + '</a>' } },

        { "targets": [2], "render": function (data, type, full, meta) { return '<span>' + data + '</span>' } },
        { "targets": [3], "render": function (data, type, full, meta) { return "<span>" + data + "<br><p class='subtext'>" + full.reportperson + "</p></span>" } },
        {
            "targets": [4], "render": function (data, type, full, meta) {

                if (full.severity == 1)
                    return '<span class="orange-text">Low</span> '
                else if (full.severity == 2)
                    return '<span class="orange-text text-darken-3">Medium</span> '
                else if (full.severity == 3)
                    return '<span class="red-text">High</span> '
                else if (full.severity == 4)
                    return '<span class="red-text  text-darken-2">Critical</span> '
            }
        },
        {
            "targets": [5], "render": function (data, type, full, meta) {
                if (full.status_id == 1 || full.status_id == 12) {
                    return '<span class="badge bg-warning">Open</span>';
                }
                else if (full.status_id == 14) {
                    return '<span class="badge bg-success">Closed</span>';
                }
            }
        },
        { "targets": [6], "render": function (data, type, full, meta) { return '<span class="d-grid"><a class="btn btn-info">Detail</a></span>' } },
        {
            "targets": [7], "render": function (data, type, full, meta) {
                return '<div class="dropdown"><button  type="button" class="ActionDropLink Sig btn btn-light btn-bordered dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
            }
        },
    ],
    "columns": [
        { "width": "10%", data: "report_date" },
        { "width": "10%", data: "incident_id" },
        { "width": "20%", data: "type_desc" },
        { "width": "30%", data: "sitename" },
        { "width": "10%", data: "severity" },
        { "width": "10%", "data": "status_id"},
        { "width": "10%", data: null },
        { "width": "10%", data: null },
    ],
            "drawCallback": function () {
            
            }
        };

      var dtTable = $('#InciRptList').DataTable(dtopts);

      fnDTSearchEnable(dtTable, '#InciSearch .DTSearchBox', '#InciSearch .DTSearchClr', '#InciSearch .DTSearchBtn')
}


function fnIncidentRptNewInit()
{
  new TomSelect('#SelInciType',{
    create: true,
    sortField: {
        field: "text",
        direction: "asc"
    }
  });

   
  new TomSelect('#SelInciSeverity',{
    create: true,
    sortField: {
        field: "text",
        direction: "asc"
    }
  });
  

  $('#txtInciDate,#txtReportDate').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      maxDate: new Date(),
      locale: {
        format: 'DD/MM/YYYY' // --------Here
    },
 });


$('.fnaddattachment').on('click', function(){
  fnaddattachment();
});

}

function fnIncidentRptDetailInit()
{
  
}


function fnaddattachment() {

  var rowcnt = $('#AttachmentWrap tr').length;

  var attachitemrow = '<tr class="my-2">';
  
  attachitemrow += '<td>';
  attachitemrow += '<input type="file" id="fileincidentattach' + rowcnt + '" name="fileincidentattach' + rowcnt + '" class="form-control" required><div class="invalid-feedback">Please select attachment</div></td>';
  attachitemrow += '<td>';
  attachitemrow += '<button class="btn btn-outline-danger" type="button" id="removeattach' + rowcnt + '" onclick="fnremoveattachment(' + rowcnt + ')"><i class="fa fa-trash"></i></button></td>';
  attachitemrow += '</tr>';

  $('#AttachmentWrap').append(attachitemrow);
   
}

window.fnremoveattachment = function(row) {
    $('#removeattach' + row).parent().parent().remove();
}


export {
  fnIncidentPageInit,
  fnIncidentRptNewInit,
  fnIncidentRptDetailInit
};