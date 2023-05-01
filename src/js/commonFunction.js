/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { fnLogout } from './login/login';

function fnShowLoader(msg) {
  $('#loadingToast .ToastIcon').html('<div class="fa-2x"><i class="fa-solid fa-cog fa-spin"></i></div>');
  $('#loadingToast .ToastMsg').html(msg);
  const myAlert = document.getElementById('loadingToast');
  const bsAlert = new bootstrap.Toast(myAlert);
  bsAlert.show();
}
function fnHideLoader() {
  const myAlert = document.getElementById('loadingToast');
  const bsAlert = new bootstrap.Toast(myAlert);
  bsAlert.hide();
}

function fnAjaxErrorToast(title, msg, icon) {
  $('#XHRErrorToast .ToastHeader').html(title);
  $('#XHRErrorToast .ToastIcon').html(icon);
  $('#XHRErrorToast .ToastMsg').html(msg);
  const myAlert = document.getElementById('XHRErrorToast');
  const bsAlert = new bootstrap.Toast(myAlert);
  bsAlert.show();
}

// function fnAjaxInternalErrorAlert () {
//   $('#XHRErrorToast .ToastHeader').html('Internal Server Error');
//   $('#XHRErrorToast .ToastIcon').html('<img src="img/technician.png" height="70" class="pt-10">');
//   $('#XHRErrorToast .ToastMsg').html('Oops, something went wrong. Please try again later or contact us if the problem persists');
//   const myAlert = document.getElementById('XHRErrorToast');
//   const bsAlert = new bootstrap.Toast(myAlert);
//   bsAlert.show();
// }

// function fnAjaxNotfoundAlert () {
//   $('#XHRErrorToast .ToastHeader').html('404 Not Found');
//   $('#XHRErrorToast .ToastIcon').html('<img src="img/technician.png" height="70" class="pt-10">');
//   $('#XHRErrorToast .ToastMsg').html('The resource you are looking for cannot be found or has been moved.');
//   const myAlert = document.getElementById('XHRErrorToast');
//   const bsAlert = new bootstrap.Toast(myAlert);
//   bsAlert.show();
// }

function fnAlertToast(msg, title, type) {
  $('#alertToast .ToastHeader').html(title);
  if (type === 'error') {
    $('#alertToast').removeClass('bg-warning bg-success bg-info bg-danger').addClass('bg-danger');
    $('#alertToast .ToastIcon').html('<i class="fa-duotone fa-triangle-exclamation fa-2x"></i>');
  } else if (type === 'warning') {
    $('#alertToast').removeClass('bg-warning bg-success bg-info bg-danger').addClass('bg-warning');
    $('#alertToast .ToastIcon').html('<i class="fa-duotone fa-circle-exclamation fa-2x"></i>');
  } else if (type === 'success') {
    $('#alertToast').removeClass('bg-warning bg-success bg-info bg-danger').addClass('bg-success');
    $('#alertToast .ToastIcon').html('<i class="fa-duotone fa-circle-check fa-2x"></i>');
  } else {
    $('#alertToast').removeClass('bg-warning bg-success bg-info bg-danger').addClass('bg-info');
    $('#alertToast .ToastIcon').html('<i class="fa-duotone fa-circle-info fa-2x"></i>');
  }
  $('#alertToast .ToastMsg').html(msg);
  const myAlert = document.getElementById('alertToast');
  const bsAlert = new bootstrap.Toast(myAlert);
  bsAlert.show();
}

function fnXhrErrorAlert(xhr) {
  fnHideLoader();
  console.log(xhr)
  const errCode = parseInt(xhr.status);
  if (errCode === 400) {
    fnAjaxErrorToast('Bad Request', 'Bad Request, Please try again', '<img src="img/servererror.png" height="70" class="pt-10">');
  } else if (errCode === 401) {
    fnAjaxErrorToast('Unauthorized', 'Unauthorized, redirecting to login', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
    setTimeout(function() {
      console.log('not atrd');
      fnLogout('Unauthorized')
    }, 500)
  } else if (errCode === 403) {
    fnAjaxErrorToast('Forbidden', 'Forbidden, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 404) {
    fnAjaxErrorToast('Not found', 'Requested resource not found', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 408) {
    fnAjaxErrorToast('Request Timeout', 'Request Timeout', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 413) {
    fnAjaxErrorToast('Payload Too Large', 'Payload Too Large, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 415) {
    fnAjaxErrorToast('Unsupported Media Type', 'Unsupported Media Type, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 500) {
    fnAjaxErrorToast('Internal Server Error', 'Internal Server Error, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 502) {
    fnAjaxErrorToast('Bad Gateway', 'Bad Gateway, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 503) {
    fnAjaxErrorToast('Service Unavailable', 'Service Unavailable, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 504) {
    fnAjaxErrorToast('Gateway Timeout', 'Gateway Timeout, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else if (errCode === 524) {
    fnAjaxErrorToast('Timeout Occurred', 'Timeout Occurred, Please try again', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  } else {
    fnAjaxErrorToast('Unidentified error', 'Unidentified error', '<i class="fa-duotone fa-cloud-exclamation fa-3x"></i>');
  }
}

function fnNetworkCheck() {
  if (navigator.onLine) {
    // console.log('online');
    return true;
  }
  // console.log('offline');
  return true;
}

function fnDTSearchEnable(dtTable, BoxPH, BtnPH, ClrPH) {
  const dtserachboxps = $(BoxPH);
  const dtserachbtnps = $(BtnPH);
  const dtserachclrps = $(ClrPH);

  dtserachboxps.on('keyup', function () {
    dtTable.search($(this).val()).draw();
    dtserachbtnps.hide();
    dtserachclrps.show();
  });
  dtserachboxps.on('keyup', function () {
    if ($(this).val() !== '') {
      dtserachbtnps.hide();
      dtserachclrps.show();
    } else {
      dtserachbtnps.show();
      dtserachclrps.hide();
    }
  });
  dtserachclrps.on('click', function () {
    dtserachboxps.val('');
    dtTable.search($(this).val()).draw();
    dtserachbtnps.show();
    dtserachclrps.hide();
  });
}

function fnFormatDate(date, type) {
  let strTime;
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  let H = date.getHours();
  let m = date.getMinutes();
  const s = date.getSeconds();
  dd = dd < 10 ? `0${dd}` : dd;
  mm = mm < 10 ? `0${mm}` : mm;
  let h = H % 12;
  const ampm = h >= 12 ? 'pm' : 'am';
  // h = h ? h : 12; // the hour '0' should be '12'
  H = H < 10 ? `0${H}` : H;
  h = h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  if (type === 'date') {
    strTime = `${dd}/${mm}/${yyyy}`;
  } else if (type === 'time') {
    strTime = `${h}:${m} ${ampm}`;
  } else if (type === 'time24') {
    strTime = `${H}:${m}`;
  } else if (type === 'datetime') {
    strTime = `${dd}/${mm}/${yyyy} ${h}:${m}:${s}`;
  } else if (type === 'datetime24') {
    strTime = `${dd}/${mm}/${yyyy} ${H}:${m}:${s}`;
  } else if (type === 'datetimeampm') {
    strTime = `${dd}/${mm}/${yyyy} ${h}:${m} ${ampm}`;
  }
  return strTime;
}

function fnFormatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const GlobalarrDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const GlobalarrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function fnGetDayName(dayno) {
  if (dayno <= 6) { return GlobalarrDays[dayno]; } else { return ''; }
}
function fnGetMonthName(monthno, len) {
  if (len === 0 || len === undefined || len === null) {
    if (monthno <= 11) { return GlobalarrMonths[monthno]; } else { return ''; }
  } else {
    if (monthno <= 11) { return GlobalarrMonths[monthno].substring(0, len); } else { return ''; }
  }
}

function fnAddDateWithDays(selecteddate, nodays) {
  let monthdate = [];
  monthdate = selecteddate.split('/');

  const future = new Date(monthdate[2], monthdate[1] - 1, monthdate[0]);
  future.setDate(future.getDate() + nodays);
  let month = future.getMonth() + 1;
  let day = future.getDate();
  const year = future.getFullYear();
  if (day.toString().length === 1) {
    day = '0' + day;
  }
  if (month.toString().length === 1) {
    month = '0' + month;
  }

  const addeddate = day + '/' + month + '/' + year;
  return addeddate;
}

function fnOpenSupportTicket() {
  $('#SupportTicketIframe').attr('src', '../Ticket/Tickets?navm=354&navs=356&mode=1')
  fnShowLoader()
  $('#SupportTicketIframe').on('load', function () {
    fnHideLoader()
    $('#SupportTicketModal').modal('show')
    const iframeBody = $(frames.SupportTicketIframe.window.document).contents().find('body')
    $(iframeBody[0]).find('#navdesktop').hide()
    $(iframeBody[0]).find('.main-nav').hide()
    $(iframeBody[0]).find('.navbar').hide()
    // $(iframeBody[0]).find(".side-nav-main").hide();
    // $(iframeBody[0]).find(".side-nav-main-2").hide();
    $(iframeBody[0]).find('#PageSubMenu').hide()
    $(iframeBody[0]).find('#page-wrapper').width('100%').css('left', '0px').css('height', '100%')
    $(iframeBody[0]).find('#PageSubMenu').hide()
  })
}

function fnValidateErrorPlacement(error, element) {
  // alert(1);
  error.addClass('form-text');

  if (element.prop('type') === 'checkbox') {
    error.insertAfter(element.parent('label'));
  } else if ($(element).parent().attr('class') === 'input-group') {
    error.insertAfter($(element).parent());
  } else if (element.prop('type') === 'radio') {
    error.insertAfter($(element).parent().parent());
  } else if ($(element).hasClass('selectpicker')) {
    if ($(element).parent().parent().hasClass('input-group')) {
      error.insertAfter($(element).parent().parent());
    } else {
      error.insertAfter($(element).parent());
    }
  } else if (element.hasClass('select2-s')) {
    error.insertAfter($(element).parent());
  } else {
    error.insertAfter(element);
  }
}
function fnValidateHighlight(element, errorClass, validClass) {
  if ($(element).prop('type') === 'checkbox') {
    $(element).parent().parents('.form-group').addClass('has-error').removeClass('has-success');
  } else if ($(element).prop('type') === 'radio') {
    $(element).parent().parents('.form-group').addClass('has-error').removeClass('has-success');
  } else if ($(element).hasClass('selectpicker')) {
    if ($(element).parent().parent().hasClass('input-group')) {
      $(element).parents().parents().parent('.form-group').addClass('has-error').removeClass('has-success');
    } else {
      $(element).parents().parents('.form-group').addClass('has-error').removeClass('has-success');
    }
  } else {
    $(element).parent().parents('.form-group').addClass('has-error').removeClass('has-success');
  }

  // if ($(element).parent().attr("class") === "input-group") {
  //    $(element).parent().parents(".form-group").addClass("has-error").removeClass("has-success");
  // }
  // else if ($(element).prop("type") === "radio") {
  //    $(element).parent().parents(".form-group").addClass("has-error").removeClass("has-success");
  // }
  // else {
  //    $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
  // }
}
function fnValidateUnhighlight(element, errorClass, validClass) {
  // console.log('fnValidateUnhighlight');

  if ($(element).prop('type') === 'checkbox') {
    $(element).parent().parents('.form-group').addClass('has-success').removeClass('has-error');
  } else if ($(element).parent().attr('class') === 'input-group') {
    $(element).parent().parents('.form-group').addClass('has-success').removeClass('has-error');
  } else if ($(element).prop('type') === 'radio') {
    $(element).parent().parents('.form-group').addClass('has-success').removeClass('has-error');
  } else if ($(element).hasClass('selectpicker')) {
    if ($(element).parent().parent().hasClass('input-group')) {
      $(element).parents('.input-group').parent().addClass('has-success').removeClass('has-error');
    } else {
      $(element).parents().parents().addClass('has-success').removeClass('has-error');
    }
  } else {
    $(element).parent().parents().addClass('has-success').removeClass('has-error');
  }

  // if ($(element).parent().attr("class") === "input-group") {
  //    $(element).parent().parents(".form-group").addClass("has-success").removeClass("has-error");
  // }
  // else if ($(element).prop("type") === "radio") {
  //    $(element).parent().parents(".form-group").addClass("has-success").removeClass("has-error");
  // }
  // else {
  //    $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
  // }
}
// function fnErrorAlert(errorcode) {
//   if (errorcode === '400') {
//     fnAlertToast('Bad Request, Please try again', 'Validation', 'error');
//   } else if (errorcode === '401') {
//     fnAlertToast('Unauthorized, Please try again', 'Validation', 'error');
//     setTimeout(function(){
//       fnLogout()
//     },500)
//   } else if (errorcode === '403') {
//     fnAlertToast('Forbidden, Please try again', 'Validation', 'error');
//     const localurl = $('#hidUrl').val();

//     const origin = window.location.origin;
//     let tempurl
//     if (origin.indexOf('localhost') === -1) {
//       tempurl = window.location.origin;
//     } else {
//       if (localurl !== '') {
//         tempurl = localurl;
//       } else {
//         tempurl = window.location.origin + '/shield';
//       }
//     }
//     window.location.href = tempurl + '/Login/index';
//   } else if (errorcode === '404') {
//     fnAlertToast('Not Found, Please try again', 'Validation', 'error');
//   } else if (errorcode === '408') {
//     fnAlertToast('Request Timeout, Please try again', 'Validation', 'error');
//   } else if (errorcode === '413') {
//     fnAlertToast('Payload Too Large, Please try again', 'Validation', 'error');
//   } else if (errorcode === '415') {
//     fnAlertToast('Unsupported Media Type, Please try again', 'Validation', 'error');
//   } else if (errorcode === '500') {
//     fnAlertToast('Internal Server Error, Please try again', 'Validation', 'error');
//   } else if (errorcode === '502') {
//     fnAlertToast('Bad Gateway, Please try again', 'Validation', 'error');
//   } else if (errorcode === '503') {
//     fnAlertToast('Service Unavailable, Please try again', 'Validation', 'error');
//   } else if (errorcode === '504') {
//     fnAlertToast('Gateway Timeout, Please try again', 'Validation', 'error');
//   } else if (errorcode === '524') {
//     fnAlertToast('Timeout Occurred, Please try again', 'Validation', 'error');
//   } else {
//     fnAlertToast('Request failed, Please try again', 'Validation', 'error');
//   }
// }

function fnFormatJsonDate(jsonDate) {
  if (jsonDate !== '' && jsonDate !== null) {
    /// var value = new Date(parseInt(jsonDate.replace(/(^.*\()|([+-].*$)/g, '')));
    const value = new Date(parseInt(jsonDate.substr(6)));
    const dat = value.getDate() + '/' + (value.getMonth() + 1) + '/' + value.getFullYear();
    return dat;
  } else {
    return '';
  }
}

function fnGetAgeQv(date) {
  const dob = date;

  const birthDate = new Date(dob.split('/')[2], parseInt(dob.split('/')[1]) + 1, dob.split('/')[0]);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function fnCurrentDate() {
  const d = new Date();
  let day = d.getDate();
  let month = d.getMonth() + 1;
  const year = d.getFullYear();
  if (day.length === 1) {
    day += '0' + day;
  }

  if (month.length === 1) {
    month += '0' + month;
  }

  return day + '/' + month + '/' + year;
}
function fnGetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}

function fnToggleEmpQuickView(id) {
  $('#txthidempid').val(id)
  // let id = $('#txthidempid').val()
  // let empid = $("#txthidempid").val();
  // let id = $('#txthidQVempid').val()
  // window.open.href = "../Employees/EmpDetail?id=" + id + '&flag=1&navm=3&navs=85&rnd=' + Math.random();
  window.open('../Employees/EmpDetail?id=' + id + '&flag=1&navm=3&navs=85&rnd=' + Math.random(), '')
}

function NumericValidationzeroValidatition(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  //       alert(charCode);
  if ((charCode < 49 || charCode > 57) && charCode !== 46 && charCode !== 13 && charCode !== 9 && charCode !== 8 && charCode !== 37 && charCode !== 39 && charCode !== 46) {
    fnAlertToast('Enter Numeric Only', 'Validation', 'error');
    // window.status = "Enter Number's Only";
    evt.keyCode = 0;
    return false;
  } else if (evt.which === 2 || evt.which === 3) {
    return false;
  } else {
    return true; // enable key press
  }
}
function NumericValidationWithoutDecimal(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;

  if ((charCode < 48 || charCode > 57) && charCode !== 13 && charCode !== 9 && charCode !== 8 && charCode !== 37 && charCode !== 39 && charCode !== 45) {
    // window.status = "Enter Number's Only";
    fnAlertToast('Enter Numeric Only', 'Validation', 'error');
    evt.keyCode = 0;
    return false;
  } else if (evt.which === 2 || evt.which === 3) {
    // bs_alert.warning("Enter Number's Only");
    return false;
  } else {
    return true; // enable key press
  }
}
function NumericValidationWithoutDecimalComma(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  //  alert(charCode);

  if ((charCode < 48 || charCode > 57) && charCode !== 13 && charCode !== 9 && charCode !== 8 && charCode !== 44 && charCode !== 37 && charCode !== 39) {
    // window.status = "Enter Number's Only";
    fnAlertToast('Enter Numeric Only', 'Validation', 'error');
    evt.keyCode = 0;
    return false;
  } else if (evt.which === 2 || evt.which === 3) {
    // bs_alert.warning("Enter Number's Only");
    return false;
  } else {
    return true; // enable key press
  }
}

function NumericValidation(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  //  alert(charCode);

  if ((charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 13 && charCode !== 9 && charCode !== 8 && charCode !== 37 && charCode !== 39 && charCode !== 46 && charCode !== 45) {
    // window.status = "Enter Number's Only";
    fnAlertToast('Enter Numeric Only', 'Validation', 'error');
    evt.keyCode = 0;
    return false;
  } else if (evt.which === 2 || evt.which === 3) {
    // bs_alert.warning("Enter Number's Only");
    return false;
  } else {
    return true; // enable key press
  }
}
function NumericValidationAllowComma(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  //  alert(charCode);

  if ((charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 13 && charCode !== 9 && charCode !== 8 && charCode !== 46 && charCode !== 44) {
    // window.status = "Enter Number's Only";
    fnAlertToast('Enter Numeric Only', 'Validation', 'error');
    evt.keyCode = 0;
    return false;
  } else if (evt.which === 2 || evt.which === 3) {
    // bs_alert.warning("Enter Number's Only");
    return false;
  } else {
    return true; // enable key press
  }
}

function NumericValidationAllowMinus(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  //       alert(charCode);
  if ((charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 13 && charCode !== 9 && charCode !== 8 && charCode !== 37 && charCode !== 39 && charCode !== 46 && charCode !== 45) {
    fnAlertToast('Enter Numeric Only', 'Validation', 'error');
    // window.status = "Enter Number's Only";
    evt.keyCode = 0;
    return false;
  } else if (evt.which === 2 || evt.which === 3) {
    return false;
  } else {
    return true; // enable key press
  }
}

function fnHelpBrowserOpen (id, weburl) {
  fnShowLoader()
  let url = ''
  if ($('#anchelpman' + id) !== null && $('#anchelpman' + id) !== undefined && $('#anchelpman' + id) !== 'undefined') {
    if ($('#anchelpman' + id).length > 0) { url = $('#anchelpman' + id).data('url') } else { url = weburl }
  } else { url = weburl }

  $('#lblHelpModalTitle').html('Help Manual')
  $('#iframehelpcontent').html('<iframe class="iframe overflow-auto ps-4" id="iframehelpwindow"></iframe>')

  $('#iframehelpwindow').prop('src', url)
  $('#helpportalModal').modal('show')

  $('#iframehelpwindow').on('load', function () {
    fnHideLoader()
  })
}

function fnOpenAboutModal () {
  $('#about_modal').modal('show')
  // fnabout();
}

function fnShowReleaseNoteModal () {
  $('#lblHelpModalTitle').html('Release Notes')

  $('#iframehelpcontent').html('<iframe class="iframe overflow-auto ps-4" id="iframehelpwindow"></iframe>')
  const url = $('#ancreleaseurl').data('target-url')
  $('#iframehelpwindow').prop('src', url)
  $('#helpportalModal').modal('show')

  $('#iframehelpwindow').on('load', function () {
    fnHideLoader()
  })
}
function fnEmpStatusFail(type, msg) {
  fnAlertToast('Session timed out, redirecting to login', 'Session Timed Out', 'error');
  setTimeout(function() {
    console.log('no time');
    fnLogout('SessionExpired')
  }, 500)
}

function fnApiStatusFail(msg, title, type) {
  if (msg === '') {
    msg = 'Request Failed, please try again'
  }
  if (title === '') {
    title = 'Request Failed'
  }
  if (type === '') {
    type = 'info'
  }

  fnAlertToast(msg, title, type);
}

export {
  fnShowLoader,
  fnHideLoader,
  fnXhrErrorAlert,
  fnAlertToast,
  fnNetworkCheck,
  fnDTSearchEnable,
  fnFormatDate,
  fnFormatNumber,
  fnGetDayName,
  fnGetMonthName,
  fnAddDateWithDays,
  fnValidateErrorPlacement,
  fnValidateHighlight,
  fnValidateUnhighlight,
  fnFormatJsonDate,
  fnGetAgeQv,
  fnCurrentDate,
  fnGetSortOrder,
  fnToggleEmpQuickView,
  fnOpenSupportTicket,
  NumericValidationzeroValidatition,
  NumericValidationWithoutDecimal,
  NumericValidationWithoutDecimalComma,
  NumericValidation,
  NumericValidationAllowComma,
  NumericValidationAllowMinus,
  fnHelpBrowserOpen,
  fnOpenAboutModal,
  fnShowReleaseNoteModal,
  fnEmpStatusFail,
  fnApiStatusFail
};
