// import hasher from 'hasher';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
// import Swal from 'sweetalert2';
// import TomSelect from "tom-select";
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnUserProfilePageInit() {
  ProfileIndex();

  // var header_token = localStorage.getItem('token');
  // var id = localStorage.getItem('additional_value');
  // console.log(id+' detaail')

  // var data={
  //   id: JSON.parse(id)
  // }
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      cache: false,
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      // data: data,
      url: ApiUrl + 'web/v1/dashboard/LoadEmpDetails',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const jsondata = response.Data;
            const data = jsondata.result;
            $('#lblmailid').html(data.emailid);
            $('#lblContactNo').html(data.mobileno);

            $('#h5EmployeeName').html(data.fullname);
            $('#lblemployeename').html(data.fullname);
            $('#UserName').html(data.fullname);

            $('#txtEmailId').val(data.emailid);
            $('#txtContactNo').val(data.mobileno);

            fnHideLoader();
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
      },
      error: fnXhrErrorAlert
    });
  }

  // setTimeout(function () {
  // }, 500);
}

function ProfileIndex() {
  const employeeDetail = localStorage.getItem('employeeDetail');
  const EmployeeDetailJson = JSON.parse(employeeDetail);
  $('#h5EmployeeName').html(EmployeeDetailJson.EmployeeName);
  $('#lblemployeename').html(EmployeeDetailJson.EmployeeName);
}

window.fnOpenEditBasicDetail = function() {
  // console.log('open');
  const ModalDetail = new bootstrap.Modal(document.getElementById('editbasicdetailmodal'));
  ModalDetail.show()
}

window.fnUpdateBasicDetail = function() {
  const headertoken = localStorage.getItem('token');

  const emailid = $('#txtEmailId').val();
  const contactno = $('#txtContactNo').val();
  // console.log(contactno + 'con')
  // var data = {
  //   emailid : emailid,
  //   contactno : contactno
  // }

  fnShowLoader();
  $.ajax({
    type: 'POST',
    cache: false,
    // data: data,
    // dataType: 'json',
    // contentType: 'application/json; charset=utf-8',
    timeout: 60000,
    crossDomain: true,
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    url: ApiUrl + 'web/v1/dashboard/UpdateBasicProfile?emailid=' + emailid + '&contactno=' + contactno,
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          if (data === 1) {
            fnAlertToast('Updated successfully', 'Success', 'success');
          }
          fnHideLoader();
        } else {
          fnApiStatusFail(response.Message, '', 'error');
        }
      } else {
        fnEmpStatusFail('', '')
      }
    },
    error: fnXhrErrorAlert
  });
}

$(document).on('click', '.fnUserRequestOTPSubmit', function() {
  fnUserRequestOTPSubmit();
});

function fnUserRequestOTPSubmit() {
  const headertoken = localStorage.getItem('token');
  const flg = $('#hidUserContactFlg').val();
  const CountryId = parseInt($('#selUserCountryCode').val());
  const MobileNumber = $('#txtUserContactNo').val();
  const EmailId = $('#txtUserEmailId').val();

  const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  let otptype = 1;
  if (flg === 2) {
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
    MobileNumber,
    UserType: 1,
    EmailId,
    OTPType: otptype
  };

  if (fnNetworkCheck()) {
    fnShowLoader('Requesting OTP');
    $.ajax({
      type: 'GET',
      url: ApiUrl + 'web/v1/setting/UserProfileSendOTP',
      data: payload,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        // console.log(response);
        fnHideLoader();
        if (response.Status === true) {
          if (response.EmpStatus === true) {
            if (response.Data.result === 1) {
              $('.fnVerifyUserOTPSubmit').removeClass('d-none');
              $('.fnUserRequestOTPSubmit').addClass('d-none');

              fnAlertToast('OTP Sent Successfully', 'Success', 'success');

              $('#txtUserProfileOtp').prop('disabled', false);
            } else if (response.Data.result === -2) {
              fnAlertToast('Invalid EMail/Mobile No', 'Validation', 'error');
            } else if (response.Data.result === -3) {
              fnAlertToast('Already Have EMail/Mobile No', 'Validation', 'error');
            }
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
      },
      error: function (xhr) { fnXhrErrorAlert(xhr); }
    });
  }
}

$(document).on('click', '.fnVerifyUserOTPSubmit', function() {
  fnVerifyUserOTPSubmit();
});

function fnVerifyUserOTPSubmit() {
  const headertoken = localStorage.getItem('token');
  const flg = $('#hidUserContactFlg').val();
  let otptype = 1;
  if (flg === 2) {
    otptype = 2;
    if ($('#txtUserEmailId').val() === '') {
      fnAlertToast('Please enter Email', '', 'error');
      return false;
    }
  } else {
    if ($('#txtUserContactNo').val() === '') {
      fnAlertToast('Please enter Mobile No', '', 'error');
      return false;
    }
  }
  const CountryId = parseInt($('#selUserCountryCode').val());
  const MobileNumber = $('#txtUserContactNo').val();
  const EmailId = $('#txtUserEmailId').val();
  const OTP = $('#txtUserProfileOtp').val();

  const payload = {
    CountryId,
    MobileNumber,
    EmailId,
    OTPType: otptype,
    OTP
  };

  if (fnNetworkCheck()) {
    fnShowLoader('Verifying OTP');

    $.ajax({
      type: 'GET',
      url: ApiUrl + 'web/v1/setting/ValidateUserProfileOTP',
      data: payload,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        if (response.Status === true) {
          if (response.EmpStatus === true) {
            fnUpdateBasicDetail();
          } else {
            fnAlertToast('Employee is not active', 'Validation', 'error');
          }
          fnHideLoader();
        } else {
          fnAlertToast(response.Message, 'Validation', 'error');
        }
      },
      error: function (xhr) { fnXhrErrorAlert(xhr); }
    });
  }
}

// $(document).on('click','.fnUpdateBasicDetail',function(){
//   fnUpdateBasicDetail();
// });

let editbasicdetailmodal;
$(document).on('click', '.btnedituserprofileContact', function() {
  $('#divUserContact,.fnUserRequestOTPSubmit').removeClass('d-none');
  $('#divUserMailId,.fnVerifyUserOTPSubmit').addClass('d-none');
  $('#txtUserProfileOtp').prop('disabled', true);
  $('#hidUserContactFlg').val(1);
  editbasicdetailmodal = new bootstrap.Modal(document.getElementById('editbasicdetailmodal'));
  editbasicdetailmodal.show()
});

$(document).on('click', '.btnedituserprofileMail', function() {
  $('#divUserContact,.fnVerifyUserOTPSubmit').addClass('d-none');
  $('#divUserMailId,.fnUserRequestOTPSubmit').removeClass('d-none');
  $('#txtUserProfileOtp').prop('disabled', true);
  $('#hidUserContactFlg').val(2);
  editbasicdetailmodal = new bootstrap.Modal(document.getElementById('editbasicdetailmodal'));
  editbasicdetailmodal.show()
});

function fnUpdateBasicDetail() {
  const headertoken = localStorage.getItem('token');

  const emailid = $('#txtUserEmailId').val();
  const country = $('#selUserCountryCode').val();
  const contactno = $('#txtUserContactNo').val();

  fnShowLoader();
  $.ajax({
    type: 'POST',
    cache: false,
    timeout: 60000,
    crossDomain: true,
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    url: ApiUrl + 'web/v1/setting/UpdateBasicProfile?emailid=' + emailid + '&country=' + country + '&contactno=' + contactno,
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          if (data === 1) {
            fnAlertToast('Updated successfully', 'Success', 'success');
            editbasicdetailmodal.hide();
            fnUserProfilePageInit();
          }
          fnHideLoader();
        } else {
          fnApiStatusFail(response.Message, '', 'error');
        }
      } else {
        fnEmpStatusFail('', '')
      }
    },
    error: fnXhrErrorAlert
  });
}

export {
  fnUserProfilePageInit
};
