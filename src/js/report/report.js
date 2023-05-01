// import hasher from 'hasher';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
// import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import CKEDITOR from '@ckeditor/ckeditor5-build-classic';
import { ApiUrl, ReportUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnReportPageInit() {
  // var start = moment().subtract(29, 'days');
  // var end = moment();

  // function cb(start, end) {
  //     $('#txtOrderFilterDateRange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  // }

  // $('#txtOrderFilterDateRange').daterangepicker({
  //   alwaysShowCalendars:true,
  //     startDate: start,
  //     endDate: end,
  //     ranges: {
  //        'Today': [moment(), moment()],
  //        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //        'This Month': [moment().startOf('month'), moment().endOf('month')],
  //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  //     }
  // }, cb);

  // cb(start, end);

  const currentdate = new Date();
  const curdate = currentdate.getDate();
  const currentmonth = currentdate.getMonth();
  const currentyear = currentdate.getFullYear();

  const frmdate = curdate + '/' + currentmonth + '/' + currentyear
  let optionstr = '';

  for (let ind = 0; ind < 24; ind++) {
    const newDate = new Date(parseInt(frmdate.split('/')[2]), parseInt(frmdate.split('/')[1]) - 1, 1);
    const selDate = new Date(newDate.setMonth(newDate.getMonth() - ind));

    optionstr += "<option value='" + (selDate.getMonth() + 1) + '-' + selDate.getFullYear() + "'>" + fnGetMonthName(selDate.getMonth()) + ' ' + selDate.getFullYear() + '</option>';
  }
  $('#Selreportmonth').html(optionstr);

  // if (currentmonth <= 11) {
  //   $('#Selreportmonth').val((currentmonth + 1) + '-' + currentyear);
  // } else {
  //   $('#Selreportmonth').val(12 + '-' + (currentyear));
  // }
  new TomSelect('#Selreportmonth', {
    plugins: ['dropdown_input']
  });

  $('#Selreporttype').on('change', function() {
    const reporttype = $('#Selreporttype').val();

    if (reporttype === '1') {
      $('#managementreport,.fnEditTemplateContent,.exportManagementbtn').removeClass('d-none');
      $('#kpireport,#exportbtn').addClass('d-none');
    } else if (reporttype === '2') {
      $('#managementreport,.fnEditTemplateContent,.exportManagementbtn').addClass('d-none');
      $('#kpireport,#exportbtn').removeClass('d-none');
    }
  });

  $('.fnreportsubmit').on('click', function() {
    const reporttype = $('#Selreporttype').val();

    if (reporttype === '1') {
      $('#managementreport,.fnEditTemplateContent,.exportManagementbtn').removeClass('d-none');
      $('#kpireport,#exportbtn').addClass('d-none');
      fnOpenManagementForm();
    } else if (reporttype === '2') {
      $('#managementreport,.fnEditTemplateContent,.exportManagementbtn').addClass('d-none');
      $('#kpireport,#exportbtn').removeClass('d-none');
      fnOpenKPIForm();
    }
  });

  $('.fnPrintKPIForm').on('click', function() {
    fnPrintKPIForm();
  });
  $('.fnPrintManagementForm').on('click', function() {
    fnPrintManagementForm();
  });
  $('.fnEditTemplateContent').on('click', function() {
    fnGetManagementTemplate();
  });

  $('.fnreportcancel').on('click', function() {
    $('#managementreport').addClass('d-none');
    $('#kpireport').addClass('d-none');
  });
}

const GlobalarrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function fnGetMonthName(monthno, len) {
  if (len === 0 || len === undefined || len == null) {
    if (monthno <= 11) { return GlobalarrMonths[monthno]; } else { return ''; }
  } else {
    if (monthno <= 11) { return GlobalarrMonths[monthno].substring(0, len); } else { return ''; }
  }
}

function fnOpenKPIForm() {
  fnShowLoader();
  const spclientid = localStorage.getItem('additionalId');
  const URL = ReportUrl + 'v1/WorkOrder/KPIReportForm?mode=0&spclientid=' + spclientid;

  $('#kpireport').prop('src', URL);

  $('#kpireport').on('load', function () {
    $('#kpireport').css('height', $(window).height() - 50);
    fnHideLoader();
  });
}

function fnPrintKPIForm() {
  const spclientid = localStorage.getItem('additionalId');
  window.open(ReportUrl + 'v1/WorkOrder/KPIReportForm?mode=1&spclientid=' + spclientid);
}

let ReportTemplateEditModal
function fnGetManagementTemplate() {
  const headertoken = localStorage.getItem('token');

  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/LoadManagementReportTemplate',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const result = response.Data;

            $("div:contains('LETTER FOOTER')").removeClass('page-footer');

            $('#divHidTemplateContent').html(result.TemplateContent);
            const replacedcontent = $('#divHidTemplateContent').html();

            const winheightedit = $(window).height();

            const editor = CKEDITOR.instances.divCkReportEditor;
            if (editor) { editor.destroy(true); }
            const config = {
              height: winheightedit - 295,
              toolbarStartupExpanded: true,
              width: '100%',
              forcePasteAsPlainText: true,
              tabSpaces: 5
            };

            const ckeditorview = CKEDITOR.replace('divCkReportEditor', config);
            ckeditorview.setData(replacedcontent);

            ReportTemplateEditModal = new bootstrap.Modal(document.getElementById('ReportTemplateEditModal'));
            ReportTemplateEditModal.show()

            fnHideLoader();
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
      },
      error: fnXhrErrorAlert
    })
  }
}

function fnOpenManagementForm() {
  fnShowLoader();
  const spclientid = localStorage.getItem('additionalId');
  const AdditionalSiteId = localStorage.getItem('AdditionalSiteId');
  let arrperiod = [];
  arrperiod = $('#Selreportmonth').val();
  const month = arrperiod.split('-')[0];
  const year = arrperiod.split('-')[1];

  const URL = ReportUrl + 'v1/Report/ManagementReportForm?mode=0&month=' + month + '&year=' + year + '&siteid=' + AdditionalSiteId + '&spclientid=' + spclientid;

  $('#managementreport').prop('src', URL);

  $('#managementreport').on('load', function () {
    $('#managementreport').css('height', $(window).height() - 50);
    fnHideLoader();
  });
}

function fnPrintManagementForm() {
  const spclientid = localStorage.getItem('additionalId');
  const AdditionalSiteId = localStorage.getItem('AdditionalSiteId');
  let arrperiod = [];
  arrperiod = $('#Selreportmonth').val();
  const month = arrperiod.split('-')[0];
  const year = arrperiod.split('-')[1];

  window.open(ReportUrl + 'v1/Report/ManagementReportForm?mode=1&month=' + month + '&year=' + year + '&siteid=' + AdditionalSiteId + '&spclientid=' + spclientid);
}

export {
  fnReportPageInit
};
