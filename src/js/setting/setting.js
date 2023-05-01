import hasher from 'hasher';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import TomSelect from 'tom-select';
import moment from 'moment';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, NumericValidationWithoutDecimal, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnSettingPageInit(...arg) {
  $(document).on('click', '.fnOpenSettingLogFilter', function () {
    $('.divLogFilterPanel').slideToggle();
  });

  const start = moment().subtract(29, 'days');
  const end = moment();

  function cb(start, end) {
    $('#txtLogFilterDateRange').html(start.format('DD/MM/YYYY') + '-' + end.format('DD/MM/YYYY'));
  }

  $('#txtLogFilterDateRange').daterangepicker({
    alwaysShowCalendars: true,
    startDate: start,
    endDate: end,
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'This Year': [moment().startOf('year'), moment().endOf('year')],
      'Last Year': [moment().startOf('year'), moment().endOf('year')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  }, cb);

  cb(start, end);

  if (arg[0] === 'inventory') {
    SettingsIndex(2);
  } else if (arg[0] === 'log') {
    fnLoadLogDetailTable();
    $('.fnLoadLogDetailTable').on('click', function(e) {
      fnLoadLogDetailTable();
    });
    $('#OtpLogDetail-tab').on('click', function(e) {
      fnLoadOtpTable();
    });
  }
  $('.onchangeNumericValidation').on('keypress', function(e) {
    return NumericValidationWithoutDecimal(e);
  });

  const d = new Date();
  $('#txtuserdatabirth').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    maxDate: new Date(d.getFullYear() - 18, d.getMonth(), d.getDate()),
    startDate: new Date(d.getFullYear() - 18, d.getMonth(), d.getDate()),
    locale: {
      format: 'DD/MM/YYYY'
    }
  });

  $('#txtuserdatajoin').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minDate: new Date(d.getFullYear() - 15, d.getMonth(), d.getDate()),
    maxDate: new Date(d.getFullYear() + 2, d.getMonth(), d.getDate()),
    locale: {
      format: 'DD/MM/YYYY'
    }
  });

  fnLoadBroadcastTable();
  fnLoadReportConfigTable();
  // $('#txtMailCC,#txtContactNo').tagify();

  $('#txtkeyFilter').keyup(function () {
    fnJobempFilterKeyword(0);

    if ($('#txtkeyFilter').val() !== '') {
      $('#keyFilSrhBtn').css('display', 'none');
      $('#keyFilClr').css('display', 'block');
    } else {
      $('#keyFilSrhBtn').css('display', 'block');
      $('#keyFilClr').css('display', 'none');
    }

    $('#keyFilClr').click(function () {
      $('#txtkeyFilter').val('');
      // $("#keyFilSrhBtn").css('display', 'block');
      $('#keyFilSrhBtn').hide();
      $('#keyFilSrhBtn').val('');
      fnJobempFilterKeyword(0);
    });
  });

  $('.fnClearAssignedEmp').on('click', function() {
    fnClearAssignedEmp()
  });

  $('#btnNewEmployee').on('click', function() {
    hasher.setHash('employee/new/');
  });
}

function fnSettingNewEmployeePageInit(...id) {
  $('#hidUserEmpId').val(id[0]);
  $('.onchangeNumericValidation').on('keypress', function(e) {
    return NumericValidationWithoutDecimal(e);
  });
}

function SettingsIndex(flg) {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      url: ApiUrl + 'web/v1/setting/ListSettingsIndex',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        const datas = response

        if (datas.EmpStatus !== false) {
          if (datas.Status === true) {
            if (flg === 1) {
              const result = response.Data.result

              if (result.length > 0) {
                let SiteHtmlval = ''
                for (let i = 0; i < result.length; i++) {
                  SiteHtmlval += '<option value=' + result[i].Uuid + '>' + result[i].Location + '</option>'
                }
                $('#SelUnitLocation').html(SiteHtmlval);
              }
              new TomSelect('#SelUnitLocation', {
                plugins: ['dropdown_input']
              });
            }

            const AssetSetting = response.Data.AssetSetting

            $('.lbl_assetnumber').html(AssetSetting.AssetPrefix + 'xxxx' + AssetSetting.AssetSuffix);
            $('#assetprefix').val(AssetSetting.AssetPrefix);
            $('#assetmiddle').val(AssetSetting.AssetMiddle);
            $('#assetsuffix').val(AssetSetting.AssetSuffix);
            $('#assetseperator').val(AssetSetting.Seperator);

            const InventorySetting = response.Data.InventorySetting

            $('.lbl_inventorynumber').html(InventorySetting.InventoryPrefix + 'xxxx' + InventorySetting.InventorySuffix);
            $('#inventoryprefix').val(InventorySetting.InventoryPrefix);
            $('#inventorymiddle').val(InventorySetting.InventoryMiddle);
            $('#inventorysuffix').val(InventorySetting.InventorySuffix);
            $('#inventoryseperator').val(InventorySetting.Seperator);
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
    })
  }
}

function fnLoadBroadcastTable() {
  const data = [
    { id: 1, title: 'RAHMAN BIN TAIB', type: 'Civil Engineering', deleted: false },
    { id: 2, title: 'RICHARD', type: 'Plumbing and Sanitary', deleted: false }
  ]

  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item " href="#" ><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text" href="#" onclick="fnOpenSOPDeleteConfirm()"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  const dtopts = {
    bPaginate: true,
    bLengthChange: true,
    bDestroy: true,
    bFilter: true,
    bInfo: true,
    processing: true,
    pageLength: 100,
    lengthMenu: [[100, 200, 500, -1], [100, 200, 500, 'All']],
    aaSorting: [],
    data,
    dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
    columnDefs: [
      {
        targets: [0, 1],
        render: function (data, type, full, meta) {
          return '<span>' + data + '</span>'
        }
      },
      {
        targets: [2],
        render: function (data, type, full, meta) {
          if (data === false) {
            return '<span class="badge bg-success">Active</span>'
          } else {
            return '<span class="badge bg-danger">Deactive</span>'
          }
        }

      },
      {
        targets: [3],
        render: function (data, type, full, meta) {
          return '<div class="d-grid"><a class="btn btn-info btnOpenFacilityDetail" data-id="' + full.id + '">Detail</a></div>'
        }
      },
      {
        targets: [4],
        render: function (data, type, full, meta) {
          return '<div class="dropdown text-end"><button onclick="fnSetdtactionItemId(' + full.id + ')" type="button" class="btn btn-light btn-bordered dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
        }
      }
    ],
    columns: [
      { width: '40%', data: 'title' },
      { width: '30%', data: 'type' },
      { width: '10%', data: 'deleted' },
      { width: '10%', data: null },
      { width: '10%', data: null }
    ],
    drawCallback: function () {
      $(document).on('click', '.btnOpenFacilityDetail', function() {
        fnOpenDetail();
      });
    }
  };

  $('#TblUserManagement').DataTable(dtopts);
}

function fnOpenDetail() {
  const ModalDetail = new bootstrap.Modal(document.getElementById('DetailModal'));
  ModalDetail.show()
}

// Employee Changes

// let NewUserModal;

// $(document).on('click', '#btnNewUser', function() {
//   $('.lblNewUserTitle').html('New User');
//   $('#btnupdateUser').addClass('d-none');
//   $('#btnsaveUser').removeClass('d-none');
//   NewUserModal = new bootstrap.Modal(document.getElementById('NewUserModal'));
//   NewUserModal.show()
// });

// $(document).on('click', '#btnsaveUser', function(e) {
//   if (!document.getElementById('formNewEmployee').checkValidity()) {
//     e.preventDefault();
//     e.stopPropagation();
//   } else {
//     fnSaveNewUser()
//   }
//   $('#formNewEmployee').addClass('was-validated');
// });

$(document).on('click', '.fnSaveInventorySetting', function() {
  fnSaveInventorySetting();
});

function fnSaveInventorySetting() {
  const InventoryPrefix = $('#inventoryprefix').val();
  const InventoryMiddle = $('#inventorymiddle').val();
  const InventorySuffix = $('#inventorysuffix').val();
  const Seperator = $('#inventoryseperator').val();

  const data = {
    InventoryPrefix,
    InventoryMiddle,
    InventorySuffix,
    Seperator
  }
  fnShowLoader();
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveInventorySetting',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data === 1) {
              fnAlertToast('Inventory Settings Update Successfully', 'Success', 'success');
              SettingsIndex(2);
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'error');
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
}

function fnUserProfilePageInit() {
  fnShowLoader();
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      url: ApiUrl + 'web/v1/setting/LoadUserProfile',
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;

            $('#lblempname').html(data.EmpName);
            $('#lbldesignation').html(data.DesignationName);
            $('#lblmobileno').html(data.CountryCode + '+ ' + data.ContactNo);
            $('#lblmailid').html(data.MailId);

            const Country = response.Data.Country

            if (Country.length > 0) {
              let SiteHtmlval = ''
              for (let i = 0; i < Country.length; i++) {
                SiteHtmlval += '<option value=' + Country[i].Uuid + '>' + Country[i].ShortName + '</option>'
              }
              $('#selUserCountryCode').html(SiteHtmlval);
            }

            new TomSelect('#selUserCountryCode', {
              plugins: ['dropdown_input']
            });

            const selUserCountryCode = (document.getElementById('selUserCountryCode')).tomselect
            selUserCountryCode.setValue(data.CountryId);

            $('#lblemployeename').html(data.EmpName);
            $('#txtUserEmailId').val(data.MailId);
            $('#txtUserContactNo').val(data.ContactNo);

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
}

function fnLoadLogDetailTable() {
  const date = $('#txtLogFilterDateRange').val();

  const startdate = date.split('-')[0];
  const enddate = date.split('-')[1];

  const data = {
    startdate,
    enddate
  }

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/setting/ListLogDetail',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;

            const dtopts = {
              bPaginate: true,
              bLengthChange: true,
              bDestroy: true,
              bFilter: true,
              bInfo: true,
              processing: true,
              pageLength: 100,
              lengthMenu: [[100, 200, 500, -1], [100, 200, 500, 'All']],
              aaSorting: [],
              data,
              dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
              columnDefs: [
                {
                  targets: [0, 1, 2, 3, 4],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                }
              ],
              columns: [
                { width: '10%', data: 'CreatedDate' },
                { width: '15%', data: 'CategoryName' },
                { width: '25%', data: 'EmpName' },
                { width: '10%', data: 'DeviceDetail' },
                { width: '40%', data: 'Msg' }
              ],
              drawCallback: function () {

              }
            };

            const Datatableopts = $('#TblLogDetail').DataTable(dtopts);

            fnDTSearchEnable(Datatableopts, '#DtSLogSearchWrap .DTSearchBoxLog', '#DtSLogSearchWrap .DTSearchBtnLog', '#DtSLogSearchWrap .DTfrSearchClrLog');

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
}

function fnLoadReportConfigTable() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/ListReportConfig',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;

            const dtopts = {
              bPaginate: true,
              bLengthChange: true,
              bDestroy: true,
              bFilter: true,
              bInfo: true,
              processing: true,
              pageLength: 100,
              lengthMenu: [[100, 200, 500, -1], [100, 200, 500, 'All']],
              aaSorting: [],
              data,
              dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
              columnDefs: [
                {
                  targets: [0, 1],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [2],
                  render: function (data, type, full, meta) {
                    if (full.id !== 23 && full.id !== 14 && full.id !== 29 && full.id !== 30 && full.id !== 32 && full.id !== 33) {
                      return '<span class="text-center"><a class="fnReportConfigEmpDetailTable" data-id=' + full.Uuid + '>' + data + ' </a></span>'
                    } else {
                      return '<span class="text-center">0</span>';
                    }
                  }
                },
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    if (full.enable_flg === 1) {
                      return '<span class="text-center badge bg-success">Yes</span>';
                    } else {
                      return '<span class="text-center badge bg-danger">No</span>';
                    }
                  }
                }
                // {
                //   targets: [4],
                //   render: function (data, type, full, meta) {
                //     return '<span class="text-center"><a data-id=' + full.Uuid + ' data-scheduleid=' + full.schedule_id + ' class="btn btn-light btn-bordered btn-sm text-center fnOpenEditReportConfig">Edit</a> </span>';
                //   }
                // }
              ],
              columns: [
                { width: '10%', data: 'reportname' },
                { width: '15%', data: 'dayno' },
                { width: '25%', data: 'empcount' },
                { width: '10%', data: 'enable_flg' }
                // { width: '40%', data: '' }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnReportConfigEmpDetailTable', function() {
                  fnReportConfigEmpDetailTable(this)
                });

                $(document).on('click', '.fnOpenEditReportConfig', function() {
                  const id = $(this).data('id');
                  const scheduleid = $(this).data('scheduleid');
                  fnOpenEditReportConfig(id, scheduleid)
                });
              }
            };

            const Datatableopts = $('#TblReportConfig').DataTable(dtopts);

            fnDTSearchEnable(Datatableopts, '#DtSRemindSearchWrap .DTSearchBoxRemind', '#DtSRemindSearchWrap .DTSearchBtnRemind', '#DtSRemindSearchWrap .DTfrSearchClrRemind');

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
}

function fnReportConfigEmpDetailTable(e) {
  const id = $(e).data('id');

  const payload = {
    id
  }

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: payload,
      url: ApiUrl + 'web/v1/setting/ListReportConfigEmpDetail',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;

            $('#editusergrp').html(data[0].report_name);

            const dtopts = {
              bPaginate: true,
              bLengthChange: true,
              bDestroy: true,
              bFilter: true,
              bInfo: true,
              processing: true,
              pageLength: 100,
              lengthMenu: [[100, 200, 500, -1], [100, 200, 500, 'All']],
              aaSorting: [],
              data,
              dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
              columnDefs: [
                {
                  targets: [0],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'fullname' }
              ],
              drawCallback: function () {

              }
            };

            $('#divEmpReportCount').DataTable(dtopts);

            const EmpCountModal = new bootstrap.Modal(document.getElementById('EmpCountModal'));
            EmpCountModal.show()

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
}

let ReportConfigModal;
function fnOpenEditReportConfig(id, scheduleid) {
  $('#txtReportid').val(id);
  // $('#sheduletypelist').val(schedule_id).selectpicker('refresh');
  new TomSelect('#selLicenseAsset', {
    plugins: ['dropdown_input']
  });

  const sheduletypelist = (document.getElementById('sheduletypelist')).tomselect
  sheduletypelist.setValue(scheduleid);

  if (id === 7) {
    // Finance Daily Mail Report
    $('#DivEmployeeList').removeClass('d-none');
    $('#DivCCmailrpt,#DivContactNo').removeClass('d-none');
    $('#DayOptions').addClass('d-none');
    $('#Dayofmonth').addClass('d-none');
    $('#ulemplist').css('height', $(window).height() - 415);
  } else if (id === 9 || id === 10) {
    // Daily Operation Activity Report, Daily Operation Escalation Report
    $('#DivEmployeeList,#DivCCmailrpt').removeClass('d-none');
    $('#DayOptions').addClass('d-none');
    $('#Dayofmonth').addClass('d-none');
    $('#DivContactNo').addClass('d-none');
    $('#ulemplist').css('height', $(window).height() - 295);
  } else if (id === 13 || id === 19) {
    // Weekly Operation Report, Weekly FIN/NRIC and PLRD License Expiry Reminder
    $('#DayOptions').removeClass('d-none');
    $('#DivCCmailrpt,#DivContactNo').removeClass('d-none');
    $('#DivEmployeeList').removeClass('d-none');
    $('#Dayofmonth').addClass('d-none');
    $('#ulemplist').css('height', $(window).height() - 425);
  } else if (id === 25) {
    $('#DivEmployeeList').removeClass('d-none');
    $('#DivCCmailrpt,#DivContactNo').removeClass('d-none');
    $('#DayOptions').addClass('d-none');
    $('#Dayofmonth').addClass('d-none');
    $('#ulemplist').css('height', $(window).height() - 375);
  } else if (id === 15 || id === 18 || id === 26 || id === 27 || id === 28 || id === 22 || id === 31) {
    // Daily Contract Expire Report
    $('#DivEmployeeList').removeClass('d-none');
    $('#DivCCmailrpt').removeClass('d-none');
    $('#DayOptions,#DivContactNo').addClass('d-none');
    $('#Dayofmonth').addClass('d-none');
    $('#ulemplist').css('height', $(window).height() - 375);
  } else if (id === 17) {
    // Monthly Management Report
    $('#Dayofmonth').removeClass('d-none');
    $('#DivEmployeeList').removeClass('d-none');
    $('#DivCCmailrpt,#DivContactNo').removeClass('d-none');
    $('#DayOptions').addClass('d-none');
    $('#ulemplist').css('height', $(window).height() - 425);
  } else if (id === 23 || id === 14 || id === 29 || id === 30 || id === 32 || id === 33) {
    // Payment Reminder, Invoice Generation Based On Bill Cycle
    $('#DayOptions').addClass('d-none');
    $('#DivCCmailrpt,#DivContactNo').addClass('d-none');
    $('#DivEmployeeList').addClass('d-none');
    $('#Dayofmonth').addClass('d-none');
  } else {
    $('#DivCCmailrpt,#DivContactNo,#ulemplist,#DivEmployeeList').addClass('d-none');
  }
  fnClearAssignedEmp();
  $('#keyFilClr').click();
  fnOpenRptEmployeeModal();

  ReportConfigModal = new bootstrap.Modal(document.getElementById('ReportConfigModal'));
  ReportConfigModal.show()
}

function fnOpenRptEmployeeModal() {
  const id = $('#txtReportid').val();

  const payload = {
    id
  }

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: payload,
      url: ApiUrl + 'web/v1/setting/ListReportConfigEmpDetail',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;

            $('#editusergrpRptname').html(data[0].report_name);
            $('#lblScheduleType').html(data[0].trigger_type);

            $('#ReportDate').val(data[0].schedule_date);
            $('#ReportTime').val(data[0].schedule_time).selectpicker('refresh');
            if (data[0].report_id === 17) {
              $('#DateOptionsval').val(data[0].dayno).selectpicker('refresh');
            } else if (data[0].report_id === 13 || data[0].report_id === 19) {
              $('#DayOptionsval').val(data[0].dayno).selectpicker('refresh');
            }
            $("#ReportConfigModal input[type='checkbox']").removeAttr('checked').trigger('change');

            for (let i = 0; i < data.length; i++) {
              if ($('#rdemp' + data[i].empid).length > 0) {
                $('#rdemp' + data[i].empid).prop('checked', true).trigger('change');
              }
            }

            if (data[0].enable_flg === true) {
              $('#chkReportEnabel').prop('checked', true).trigger('change');
            } else {
              $('#chkReportEnabel').prop('checked', false).trigger('change');
            }

            // $('#txtMailCC').data('tagify').removeAllTags();
            // $('#txtContactNo').data('tagify').removeAllTags();

            // if (data[0].cc_mail != null) {
            //   $('#txtMailCC').data('tagify').addTags(data[0].cc_mail);
            // }
            // if (data[0].ContactNo != null) {
            //   $('#txtContactNo').data('tagify').addTags(data[0].ContactNo);
            // }

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
}

function fnClearAssignedEmp() {
  for (let i = 0; i < $("#ReportConfigModal input[type='checkbox']").length; i++) {
    if ($("#ulemplist input[type='checkbox']:eq(" + i + ')').is(':checked')) {
      const empid = $("#ulemplist input[type='checkbox']:eq(" + i + ')').val();
      $('#rdemp' + empid).prop('checked', false);
    }
  }
}

function fnJobempFilterKeyword(bkflg) {
  //  alert( bk_flg )
  let input, filter, ul, li, a, i;
  let flg = 0;
  if (bkflg === 0) {
    input = document.getElementById('txtkeyFilter');
    filter = input.value.toUpperCase();
    ul = document.getElementById('ulemplist');
    li = ul.getElementsByTagName('li');
    // const type = '';

    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName('label')[0];

      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
        flg = 1;
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  $('#keyFilSrhBtn').show();
  $('#keyFilClr').hide();

  if (flg === 0) {
    $('.empnorecords').removeClass('d-none');
  } else {
    $('.empnorecords').addClass('d-none');
  }
}

function fnLoadOtpTable() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/LoadOtp',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;

            const dtopts = {
              bPaginate: true,
              bLengthChange: true,
              bDestroy: true,
              bFilter: true,
              bInfo: true,
              processing: true,
              pageLength: 100,
              lengthMenu: [[100, 200, 500, -1], [100, 200, 500, 'All']],
              aaSorting: [],
              data,
              dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
              columnDefs: [
                { orderable: false, targets: [0] },
                {
                  targets: [1],
                  render: function (data, type, full, meta) {
                    if (full.mobile_no === '') {
                      return '<span>' + '-' + '</span>';
                    } else {
                      return '<span>' + data + '</span>';
                    }
                  }
                },
                {
                  targets: [2],
                  render: function (data, type, full, meta) {
                    if (full.mailid === '' || full.mailid === null || full.mailid === undefined) {
                      return '<span>' + '-' + '</span>';
                    } else {
                      return '<span>' + data + '</span>';
                    }
                  }
                },
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [4],
                  render: function (data, type, full, meta) {
                    if (full.status === 33) {
                      return '<span class="badge bg-secondary orange lighten-2">Sent</span>';
                    } else {
                      return '<span class="badge bg-secondary green lighten-2">Verified</span>';
                    }
                  }
                }
              ],
              columns: [
                { searchable: true, width: '45%', data: 'dateandtime' },
                { width: '25%', data: 'mobile_no' },
                { width: '20%', data: 'mailid' },
                { width: '15%', data: 'otp' },
                { width: '10%', data: 'status' }
              ],
              drawCallback: function () {

              }
            };

            const Datatableopts = $('#tblOTPlist').DataTable(dtopts);

            fnDTSearchEnable(Datatableopts, '#tblOTPlistSearch .DTSearchBoxLog', '#tblOTPlistSearch .DTSearchBtnLog', '#tblOTPlistSearch .DTfrSearchClrLog');

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
}

export {
  fnSettingPageInit,
  fnUserProfilePageInit,
  fnSettingNewEmployeePageInit
};
