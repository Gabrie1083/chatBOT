/* eslint-disable no-new */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import hasher from 'hasher';
import { ApiUrl } from '../index';
import { fnShowLoader, fnHideLoader, fnNetworkCheck, fnXhrErrorAlert, fnApiStatusFail, fnEmpStatusFail } from './commonFunction';

function fnLoadNotificationCount() {
  return false;
  const headertoken = localStorage.getItem('token');

  if (hasher.getHash() !== 'login' && hasher.getHash() !== 'login/password') {
    if (fnNetworkCheck()) {
      $.ajax({
        type: 'GET',
        headers: {
          Authorization: 'Bearer ' + headertoken
        },
        url: ApiUrl + 'web/v1/login/ListNotificationCount',
        cache: false,
        dataType: 'json',
        success: function (response) {
          if (response.EmpStatus === true) {
            if (response.Status === true) {
              const data = response.Data.result;
              if (data != null) {
                $('.lblNotificationCount').html('<span class="position-absolute badge top-0 rounded-pill bg-warning">' + data + '</span>')
              } else {
                $('.lblNotificationCount').addClass('d-none');
              }
            } else {
              fnApiStatusFail(response.Message, '', 'error');
            }
          } else {
            fnEmpStatusFail('', '')
          }
          // fnHideLoader();
        },
        error: function (xhr) {
          fnXhrErrorAlert(xhr);
        }
      });
    }
  }
}

function fnLoadNotificationData() {
  return false;
  const headertoken = localStorage.getItem('token');
  if (fnNetworkCheck()) {
    fnShowLoader();

    $.ajax({
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/login/ListNotifications',
      cache: false,
      dataType: 'json',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            let length = 0;

            if (data != null) {
              length = data.length;
            }
            if (length > 0) {
              $('.lblNotificationCount').html('<span class="position-absolute badge top-0 rounded-pill bg-warning">' + length + '</span>')
              // $('.lblNotificationCount').html('<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">' + length + '<span class="visually-hidden">unread messages</span></span>')
            } else {
              $('.lblNotificationCount').addClass('d-none');
            }
            if (length > 7) {
              length = 7;
            }
            let htmlvalue = '';

            if (length > 0) {
              for (let i = 0; i < length; i++) {
                htmlvalue += '<button type="button" class="list-group-item list-group-item-action fnReadNotifyMsg" data-id=' + data[i].Uuid + '  data-bs-dismiss="offcanvas">' +
                                        '<div class="d-flex w-100 justify-content-between"><h5 class="mb-1">Work Order Request </h5><small>' + data[i].NotificationDate + '</small></div>' +
                                        '<p class="mb-1"><b>ID:</b> ' + data[i].NotificationCode + ', <b>Type:</b> ' + data[i].NotificationType + '</p> <small>' + data[i].NotificationName + '</small></button>';
              }
              // htmlvalue += '<li class="list-group-item text-center"><a href="#"><strong>Read all notifications</strong><i class="fa fa-angle-right"></i></a></li>';
            } else {
              htmlvalue += '<div class="p-4 text-center"> No new notifications! </div>';
              htmlvalue += '<div class="list-group-item text-center"><strong>Read all notifications</strong><i class="fa fa-angle-right"></i></div>';
            }

            $('#notificationlist').html(htmlvalue);
            $('.fnReadNotifyMsg').on('click', function() {
              const NotifyOffcanvas = new bootstrap.Offcanvas(document.getElementById('NotifyOffcanvas'));
              NotifyOffcanvas.hide();
              const id = $(this).data('id');
              hasher.setHash('workOrder/request/detail/' + id);
            });
            fnHideLoader();
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
        fnHideLoader();
      },
      error: function (xhr) {
        fnXhrErrorAlert(xhr);
      }
    });
  }
}

export {
  fnLoadNotificationCount,
  fnLoadNotificationData
}
