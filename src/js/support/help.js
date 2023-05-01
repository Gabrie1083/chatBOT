import hasher from 'hasher';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { ApiUrl, ReportUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert } from '../commonFunction';

function fnHelpPageInit() {
  $('#lblCompanyName').html(localStorage.getItem('CompanyName'));
  $('#lblCompanyGrade').html(localStorage.getItem('CompanyGrade'));
  $('#lblCompanyWebsite').html(localStorage.getItem('CompanyWebsite'));
  $('#lblSiteName').html(localStorage.getItem('SiteName'));
  $('#lblAppName').html(AppName);
  $('#lblAppVersion').html(AppVersion);

  $('#lblDeviceType').html((localStorage.getItem('DeviceType') == 1) ? 'Tablet' : 'Patrol Mobile');
  $('#lblLocationType').html((localStorage.getItem('AppType') == 1) ? 'Guardhouse' : 'Head Office');
  $('#lblVMSType').html((localStorage.getItem('barcodeflg') == 1) ? 'Without Socket Barcode Scanner' : 'With Socket Barcode Scanner');

  $('#faq-popup').on('popup:open', function () {

  });

  $('#faq-popup').on('popup:close', function () {

  });

  $('#faq_frame').on('load', function () {
    $('#faq_frame').removeClass('display-none');
    $('.loadingiframe').addClass('display-none');
  });
}
function fnChangeAppConfig() {
  Swal.fire({
    title: 'Enter password',
    input: 'password',
    inputLabel: 'Password',
    inputPlaceholder: 'Enter your password',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    inputAttributes: {
      maxlength: 10,
      autocapitalize: 'off',
      autocorrect: 'off'
    }
  }).then((result) => {
    console.log(result);
    if (result.isConfirmed) {
      if (result.value == '987654') {
        localStorage.setItem('AppType', null);
        localStorage.setItem('SiteId', null);
        localStorage.setItem('SiteName', null);
        hasher.setHash('appconfig');
      } else {
        fnAlertToast('Invalid Password', 'Error', 'error');
      }
    }
  });

  // app.dialog.password('Enter password', 'App Config', function (password) {
  //     if (password == '987654') {
  //         localStorage.setItem("AppType", null);
  //         localStorage.setItem("SiteId", null);
  //         localStorage.setItem("SiteName", null);
  //         mainView.router.navigate('/login/siteconfig/');
  //     } else {
  //         fnAlertToast('Invalid Password', 'Error');
  //     }
  // });
}

$(document).on('click', '#btnFaq', () => {
  new bootstrap.Modal(document.getElementById('ModalFaq')).show();
});

$(document).on('click', '#btnChangeAppConfig', () => {
  fnChangeAppConfig();
});

$(document).on('click', '#btnRefreshCompanyDetail', () => {
  fnRefreshCompanyDetail();
});

function fnClearCompanyData() {
  app.dialog.confirm('Please confirm to clear company data', 'Confirmation', function () {
    fnClearCompany();
    hasher.setHash('appconfig');
  });
}

export {
  fnHelpPageInit,
  fnChangeAppConfig,
  fnClearCompanyData
};

// var modalConfirm = function(callback){

//     $("#btn-confirm").on("click", function(){
//       $("#mi-modal").modal('show');
//     });

//     $("#modal-btn-si").on("click", function(){
//       callback(true);
//       $("#mi-modal").modal('hide');
//     });

//     $("#modal-btn-no").on("click", function(){
//       callback(false);
//       $("#mi-modal").modal('hide');
//     });
//   };

//   modalConfirm(function(confirm){
//     if(confirm){
//       //Acciones si el usuario confirma
//       $("#result").html("CONFIRMADO");
//     }else{
//       //Acciones si el usuario no confirma
//       $("#result").html("NO CONFIRMADO");
//     }
// });
