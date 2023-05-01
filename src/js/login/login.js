/* eslint-disable no-new */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import $ from 'jquery';
import hasher from 'hasher';
import { ApiUrl, fnLoadMainMenu } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, NumericValidationWithoutDecimal, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnLoginInit(...arg) {
  // console.log(type);
  fnLoadMainMenu();
  const token = localStorage.getItem('token');
  // console.log(token);
  // if (token !== null && token !== 'null' && token !== '' && token !== undefined && token !== 'undefined') {
  //   hasher.setHash('dashboard');
  // }

  if (arg[0] === 'password') {
    $('#formemplogininit').removeClass('d-none');
    $('#formOtplogininit').addClass('d-none');
  } else {
    $('#formemplogininit').addClass('d-none');
    $('#formOtplogininit').removeClass('d-none');
  }
  $('#rdotploginmobile').on('change', function (e) {
    $('#LoginOtptiming').attr('style', 'visibility:hidden;');
    $('#divloginmobilecontactCode,#divloginmobilecontact').removeClass('d-none');
    $('#divLoginmailcontact').addClass('d-none');
    $('#btnReSendotp').attr('style', 'visibility:hidden;');
    $('#txtLoginEmail,#txtLoginContactNo').prop('disabled', false);
    $('#selLoginCountryCode').prop('disabled', false);
    $('#txtLoginOTP').prop('disabled', true);
  });
  $('#rdotploginemail').on('change', function (e) {
    $('#btnReSendotp').attr('style', 'visibility:hidden;');
    $('#LoginOtptiming').attr('style', 'visibility:hidden;');
    $('#divLoginmailcontact').removeClass('d-none');
    $('#divloginmobilecontactCode,#divloginmobilecontact').addClass('d-none');
    $('#txtLoginEmail,#txtLoginContactNo').prop('disabled', false);
    $('#selLoginCountryCode').prop('disabled', false);
    $('#txtLoginOTP').prop('disabled', true);
  });

  $('#btnClientOtpLoginSubmit').on('click', function(e) {
    return fnRequestOTPLoginSubmit(e);
  });
  $('.onchangeNumericValidation').on('keypress', function(e) {
    return NumericValidationWithoutDecimal(e);
  });

  $('#btnClientLoginSendOtp').on('click', function(e) {
    $('#txtLoginEmail,#txtLoginContactNo').prop('disabled', true);
    $('#selLoginCountryCode').prop('disabled', true);
    $('#txtLoginOTP').prop('disabled', false);
    $('#btnsigninlogin,#btnbacklogin').removeClass('d-none');
    $('#btnsendotp').addClass('d-none');
    return fnVerifyOTPLoginSubmit(e);
  });

  $('#btnbacklogin').on('click', function() {
    $('#txtLoginEmail,#txtLoginContactNo').prop('disabled', false);
    $('#selLoginCountryCode').prop('disabled', false);
    $('#txtLoginOTP').prop('disabled', true);
    $('#btnsigninlogin,#btnbacklogin').addClass('d-none');
    $('#btnsendotp').removeClass('d-none');
    $('#txtLoginOTP').val('');
  });

  // new TomSelect('#selLoginCountryCode',{
  //     create: true,
  //     sortField: {
  //         field: "text",
  //         direction: "asc"
  //     }
  // });
}

// var LoginOtpResendTimer;

function fnRequestOTPLoginSubmit(e) {
   hasher.setHash('dashboard');
  // clearInterval(LoginOtpResendTimer);
  const CountryId = parseInt($('#selLoginCountryCode').val());
  const MobileNumber = $('#txtLoginContactNo').val();
  const EmailId = $('#txtLoginEmail').val();

  const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  let otptype = 1;
  if ($('#rdotploginemail').is(':checked')) {
    otptype = 2;
    if (EmailId === '') {
      fnAlertToast('Please enter email ID', 'Validation', 'error');
      return false;
    }
    if (reg.test(EmailId) === false) {
      fnAlertToast('Please enter valid email ID', 'Validation', 'error');
      return (false);
    }
  } else {
    if (MobileNumber === '') {
      fnAlertToast('Please enter mobile number', 'Validation', 'error');
      return false;
    }
  }
  const payload = {
    CountryId,
    MobileNo: MobileNumber,
    UserType: 1,
    EmailId,
    OTPType: otptype
  };

  if (fnNetworkCheck()) {
    fnShowLoader('Requesting OTP');
    $.ajax({
      type: 'POST',
      url: ApiUrl + 'web/v1/login/requestotp',
      dataType: 'json',
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        // console.log(response);
        fnHideLoader();
        if (response.Status === true) {
          if (response.EmpStatus === true) {
            if (response.Data === 1) {
              $('#txtLoginEmail,#txtLoginContactNo').prop('disabled', true);
              $('#selLoginCountryCode').prop('disabled', true);
              $('#txtLoginOTP').prop('disabled', false);
              $('#btnsigninlogin,#btnbacklogin').removeClass('d-none');
              $('#btnsendotp').addClass('d-none');

              fnAlertToast('OTP Sent Successfully', 'Success', 'success');
              // hasher.setHash('home/dashboard');

              $('#LoginOtptiming').attr('style', 'visibility:visible;');

              // var timeleft = 60;
              // LoginOtpResendTimer = setInterval(function () {
              //     timeleft--;
              //     document.getElementById("lblResendOtpTimer").textContent = timeleft;
              //     if (timeleft <= 0) {
              //         clearInterval(LoginOtpResendTimer);
              //         //$("#btnReSendotp").attr('style', 'visibility:show;');
              //     }
              // }, 1000);
            } else if (response.Data === -2) {
              fnAlertToast('Invalid EMail/Mobile No', 'Login failed', 'error');
            }
          } else {
            fnAlertToast('Employee is not active', 'Login failed', 'error');
          }
        } else if (response.Data === -1) {
          fnAlertToast('Not an authorized user', 'Login failed', 'error');
        } else {
          fnAlertToast('Invalid EMail/Mobile No', 'Login failed', 'error');
        }
      },
      error: function (xhr) { fnXhrErrorAlert(xhr); }
    });
  }
  // }
  // $('#formUsernameLogin').addClass('was-validated');
}

function fnVerifyOTPLoginSubmit(e) {
  let otptype = 1;
  if ($('#rdotploginemail').is(':checked')) {
    otptype = 2;
    if ($('#txtLoginEmail').val() === '') {
      fnAlertToast('Please enter Email', '', 'error');
      return false;
    }
  } else {
    if ($('#txtLoginContactNo').val() === '') {
      fnAlertToast('Please enter Mobile No', '', 'error');
      return false;
    }
  }
  const CountryId = parseInt($('#selLoginCountryCode').val());
  const MobileNumber = $('#txtLoginContactNo').val();
  const EmailId = $('#txtLoginEmail').val();
  const OTP = $('#txtLoginOTP').val();
  const payload = {
    CountryId,
    MobileNo: MobileNumber,
    EmailId,
    OTPType: otptype,
    Otp: OTP
  };

  if (fnNetworkCheck()) {
    fnShowLoader('Verifying OTP');

    $.ajax({
      type: 'POST',
      url: ApiUrl + 'web/v1/login/validateotp',
      dataType: 'json',
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        // console.log(response);
        fnHideLoader();
        if (response.Status === true) {
          if (response.EmpStatus === true) {
            localStorage.setItem('token', response.Data.AccessToken);
            localStorage.setItem('companyDetail', JSON.stringify(response.Data.CompanyDetails));
            localStorage.setItem('employeeDetail', JSON.stringify(response.Data.EmployeeDetails));
            localStorage.setItem('menuList', JSON.stringify(response.Data.MenuList));
            localStorage.setItem('additionalId', response.Data.AdditionalId);
            localStorage.setItem('AdditionalSiteId', response.Data.AdditionalSiteId);
          
            fnLoadCompanyData();
            hasher.setHash('dashboard');
          } else {
            fnAlertToast('Employee is not active', 'Login failed', 'error');
          }
        } else {
          fnAlertToast(response.Message, 'Login failed', 'error');
        }
      },
      error: function (xhr) { fnXhrErrorAlert(xhr); }
    });
  }
  // }
  // $('#formUsernameLogin').addClass('was-validated');
}

function fnLoadUserData() {
  // console.log(localStorage.getItem('employeeDetail'));

  const employeeDetail = JSON.parse('[' + localStorage.getItem('employeeDetail') + ']');

  $('#homeempname').html(employeeDetail[0].EmployeeName);
  $('#homedesignation').html(employeeDetail[0].DesignationName);
}

function fnLoadCompanyData() {
//  const companyDetailtemp = localStorage.getItem('companyDetail')
  // if (companyDetailtemp !== '' && companyDetailtemp !== null && companyDetailtemp !== 'null') {
  //   const companyDetail = JSON.parse('[' + companyDetailtemp + ']');
  //   $('#imgCompanyLogo').attr('src', companyDetail[0].CompanyLogo);
  // }
  //  $('#imgCompanyLogo').attr('src',"../public/img/ocbc_logo.png");
}

function fnLogout(logoutReason) {
  if (logoutReason !== 'SessionExpired') {
    if (fnNetworkCheck()) {
      const headertoken = localStorage.getItem('token');
      $.ajax({
        url: ApiUrl + 'web/v1/login/userlogout',
        type: 'POST',
        headers: {
          Authorization: 'Bearer ' + headertoken
        },
        cache: false,
        // dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function (response) {
          if (response.EmpStatus === true) {
            if (response.Status === true) {
              const data = response.Data;

              if (data != null) {
                fnAlertToast('Logged out Successfully', 'Success', 'success');
              }
            } else {
              fnApiStatusFail(response.Message, '', 'error');
            }
          } else {
            fnEmpStatusFail('', '')
          }
        },
        error: function (xhr) {
          fnXhrErrorAlert(xhr);
        }
      });
    }
  }
  localStorage.setItem('token', '');
  localStorage.setItem('companyDetail', '');
  localStorage.setItem('employeeDetail', '');
  localStorage.setItem('menuList', '');
  hasher.setHash('login');
}
function fnUserProfile() {
  hasher.setHash('userProfile');
}

// function fnUsernameLoginSubmit(e) {
//     if (!document.getElementById('formUsernameLogin').checkValidity()) {
//       e.preventDefault();
//       e.stopPropagation();
//       fnAlertToast('Please check form inputs for error', 'Validation', 'error');
//     } else {
//       const username = $('#txtloginusername').val();
//       const password = $('#txtloginpassword').val();

//       // if (username === '') {
//       //   fnAlertToast('Please enter username', 'Validation', 'warning');
//       //   return false;
//       // }
//       // if (password === '') {
//       //   fnAlertToast('Please enter password', 'Validation', 'warning');
//       //   return false;
//       // }

//       const payload = {
//         Username: username,
//         Password: password
//       };
//       if (fnNetworkcheck()) {
//         showLoader('Validating login');
//         $.ajax({
//           type: 'POST',
//           url: ApiUrl + 'web/v1/login/ValidateWebLogin',
//           dataType: 'json',
//           data: JSON.stringify(payload),
//           contentType: 'application/json; charset=utf-8',
//           timeout: 60000,
//           crossDomain: true,
//           success: function (response) {
//             // console.log(response);
//             fnHideLoader();
//             if (response.Status === true) {
//               if (response.EmpStatus === true) {
//                 if(esponse.Data.LoginResult==1)
//                 {
//                     localStorage.setItem('token', response.Data.AccessToken);
//                     localStorage.setItem('companyDetail', JSON.stringify(response.Data.CompanyDetails));
//                     localStorage.setItem('employeeDetail', JSON.stringify(response.Data.EmployeeDetails));
//                     localStorage.setItem('menuList', JSON.stringify(response.Data.MenuList));
//                    //hasher.setHash('home/dashboard');
//                 }else{

//                 }
//              //   fnLoadPageDefault();
//               } else {
//                 fnAlertToast('Employee is not active', 'Login failed', 'error');
//               }
//             } else {
//               fnAlertToast('Invalid Username or Password', 'Login failed', 'error');
//             }
//           },
//           error: function (xhr) { fnXhrErrorAlert(xhr); }
//         });
//       }
//     }
//     $('#formUsernameLogin').addClass('was-validated');
//   }

//   function DownloadFile(url) {
//     //Set the File URL.
//     //var url = "Files/" + fileName;

//     $.ajax({
//         url: url,
//         cache: false,
//         xhr: function () {
//             var xhr = new XMLHttpRequest();
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 2) {
//                     if (xhr.status === 200) {
//                         xhr.responseType = "blob";
//                     } else {
//                         xhr.responseType = "text";
//                     }
//                 }
//             };
//             return xhr;
//         },
//         success: function (data) {
//             //Convert the Byte Data to BLOB object.
//             var blob = new Blob([data], { type: "application/octetstream" });

//             //Check the Browser type and download the File.
//             var isIE = false || !!document.documentMode;
//             if (isIE) {
//                 window.navigator.msSaveBlob(blob, fileName);
//             } else {
//                 var url = window.URL || window.webkitURL;
//                 link = url.createObjectURL(blob);
//                 var a = $("<a />");
//                 a.attr("download", fileName);
//                 a.attr("href", link);
//                 $("body").append(a);
//                 a[0].click();
//                 $("body").remove(a);
//             }
//         }
//     });
//   };

export {
  fnLoginInit,
  fnLogout,
  fnLoadUserData,
  fnUserProfile,
  fnLoadCompanyData
};
