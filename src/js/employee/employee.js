/* eslint-disable no-new */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import hasher from 'hasher';
import $ from 'jquery';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnEmployeeListPageInit() {

  //const listPageLoadFlg = $('#hidEmpListPageLoadFlg').val();
  const listPageLoadFlg ="yes"
  $('.employeeListWrap').removeClass('d-none');
  $('.employeeDetailWrap').addClass('d-none');
  fnLoadEmpUserTable();
  if (listPageLoadFlg !== 'yes') {
    $('#hidEmpListPageLoadFlg').val('yes');
  //  EmployeesListIndex();
    // if (arg[0] === 'list') {
    //   $('.employeeListWrap').removeClass('d-none');
    //   $('.employeeDetailWrap').addClass('d-none');
    // } else {
    //   $('.employeeListWrap').addClass('d-none');
    //   $('.employeeDetailWrap').removeClass('d-none');
    // }



    $('.fnOpenEmployeeFilter').on('click', function() {
      $('.divEmployeeFilterPanel').slideToggle();
    });

    $('.btnFilterEmployee').on('click', function() {
      fnLoadEmpUserTable();
    });
    
  }
}

function EmployeesListIndex() {
  if (fnNetworkCheck()) {
    fnShowLoader();
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
            const Designation = response.Data.Designation

            if (Designation.length > 0) {
              let SiteHtmlval = '<option value="0">ALL</option>';
              for (let i = 0; i < Designation.length; i++) {
                SiteHtmlval += '<option value=' + Designation[i].Uuid + '>' + Designation[i].DesignationName + '</option>'
              }
              $('#selDesignationFilter').html(SiteHtmlval);
            }
            new TomSelect('#selDesignationFilter', {
              plugins: ['dropdown_input']
            });
            fnHideLoader()
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

$(document).on('click','.btnNewEmployee', function() {
  hasher.setHash('employee/new');
});


$(document).on('click','.fnCancelNewEmployee', function() {
  hasher.setHash('employee/list');
});

function fnLoadEmpUserTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditEmpUser"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteEmpUser"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  // const Designation = $('#selDesignationFilter').val();
  // let Status = 0;
  // if ($('#rdEmpStatusActive').is(':checked')) {
  //   Status = 1;
  // } else if ($('#rdEmpStatusInActive').is(':checked')) {
  //   Status = 2;
  // }

  // if (fnNetworkCheck()) {
  //   const payload = {
  //     Designation,
  //     Status
  //   };
  //   const headertoken = localStorage.getItem('token');
  //   fnShowLoader();

  //   $.ajax({
  //     type: 'GET',
  //     headers: {
  //       Authorization: 'Bearer ' + headertoken
  //     },
  //     url: ApiUrl + 'web/v1/employee/ListEmployees',
  //     data: payload,
  //     cache: false,
  //     success: function (response) {
        console.log(1);
    var response=
    {
  "Message": "Success",
  "Status": true,
  "EmpStatus": true,
  "Data": {
    "result": [
      {
        "Uuid": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "EmpName": "Tester 1 ",
        "MailId": "test@gmail.com",
        "ContactNo": "123456",
        "AdminUserFlg": true,
        "DOB": "01/03/2023",
        "DOJ": "01/03/2023",  
        "DesignationId": "e220e103-2505-4f15-9ca4-a7e5752a60e0",
        "DesignationName": "Civil Engineering",
        "DesignationShortName": "CE",
        "CountryId": "d602b40e-fb8a-4f60-9e75-0994fd203e95",
        "CountryName": "Singapore",
        "CountryShortName": "SG",
        "Status": "Active",
        "FirstName": "Tester 1",
        "LastName": ""
      },
      {
        "Uuid": "9e3b3380-a29f-4437-baa8-e52c603fce6e",
        "EmpName": "Tester 2",
        "MailId": "test1@gmail.com",
        "ContactNo": "123232",
        "AdminUserFlg": true,
        "DOB": "09/03/2005",
        "DOJ": "09/03/2023",
        "DesignationId": "cfe47a19-f526-45cc-b5cd-bcdb0a046869",
        "DesignationName": "Asst Engineer",
        "DesignationShortName": "AE",
        "CountryId": "d602b40e-fb8a-4f60-9e75-0994fd203e95",
        "CountryName": "Singapore",
        "CountryShortName": "SG",
        "Status": "Active",
        "FirstName": "Tester 2",
        "LastName": "Tester 2"
      },
      {
        "Uuid": "5c09dc78-b7a5-42b1-ad8d-804d72802a59",
        "EmpName": "Tester 3",
        "MailId":"test3@gmail.com",
        "ContactNo": "1243434",
        "AdminUserFlg": true,
        "DOB": "01/01/1980",
        "DOJ": "01/03/2023",
        "DesignationId": "e220e103-2505-4f15-9ca4-a7e5752a60e0",
        "DesignationName": "Civil Engineering",
        "DesignationShortName": "CE",
        "CountryId": "d602b40e-fb8a-4f60-9e75-0994fd203e95",
        "CountryName": "Singapore",
        "CountryShortName": "SG",
        "Status": "Active",
        "FirstName": "Tester 3",
        "LastName": ""
      },
      {
        "Uuid": "6000a8fd-f0c9-4ec5-950d-f2192e14a1e6",
        "EmpName": "Tester 4",
        "MailId": "test4@gmail.com",
        "ContactNo": "",
        "AdminUserFlg": true,
        "DOB": "01/01/1980",
        "DOJ": "01/03/2023",
        "DesignationId": "e220e103-2505-4f15-9ca4-a7e5752a60e0",
        "DesignationName": "Civil Engineering",
        "DesignationShortName": "CE",
        "CountryId": "d602b40e-fb8a-4f60-9e75-0994fd203e95",
        "CountryName": "Singapore",
        "CountryShortName": "SG",
        "Status": "Active",
        "FirstName": "InActive",
        "LastName": "Tester 4"
      },
      {
        "Uuid": "3ca60a99-d410-44be-ac20-a958afd014f3",
        "EmpName": "Tester 5 ",
        "MailId": "test4@gmail.com",
        "ContactNo": "",
        "AdminUserFlg": true,
        "DOB": "01/01/1980",
        "DOJ": "01/03/2023",
        "DesignationId": "e220e103-2505-4f15-9ca4-a7e5752a60e0",
        "DesignationName": "Civil Engineering",
        "DesignationShortName": "CE",
        "CountryId": "d602b40e-fb8a-4f60-9e75-0994fd203e95",
        "CountryName": "Singapore",
        "CountryShortName": "SG",
        "Status": "Active",
        "FirstName": "Tester 5",
        "LastName": ""
      }]
  }};
  
  console.log(response);
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            $('.lblemployeecount').html(data.length)

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
                  sortable:false,
                  render: function (data, type, full, meta) {
                    return '<span ><div class="form-check form-check-inline"><input class="form-check-input lg chk" id="chkinvsum' + full.Uuid + '" checked  value="' + full.Uuid + '" type="checkbox"><label for="chkinvsum' + full.Uuid + '"></label></div></span>'
                  }
                },
                {
                  targets: [1, 2, 3, 4,5],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [6],
                  render: function (data, type, full, meta) {
                    if (full.Status === 'Active') {
                      return '<span class="badge bg-success">Active</span>'
                    } else {
                      return '<span class="badge bg-danger">InActive</span>'
                    }
                  }
                },
                {
                  targets: [7],
                  render: function (data, type, full, meta) {
                    return '<div class="d-grid"><a class="btn btn-info btnOpenEmployeeDetail" data-id=\'' + full.Uuid + '\'>Detail</a></div>'
                  }
                },
                {
                  targets: [8],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUserTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '5%', data: 'Uuid'  ,     className: "td-chk", sTitle: '<div class="form-check form-check-inline"><input class="form-check-input lg" id="SelectAllInvSum" checked type="checkbox"><label for="SelectAllInvSum"></label></div> '
       },
                { width: '30%', data: 'EmpName' },
                { width: '20%', data: 'DesignationName' },
                { width: '10%', data: 'ContactNo' },
                { width: '10%', data: 'MailId' },
                { width: '10%', data: 'DOJ' },
                { width: '10%', data: null },
                { width: '10%', data: null },
                { width: '5%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetUserTableId', function() {
                  fnSetUserTableId(this)
                });
                $(document).on('click', '.fnEditEmpUser', function() {
                  const id = $('#hidUserEmpId').val();
                  hasher.setHash('employee/edit/' + id);
                });
                $(document).on('click', '.btnOpenEmployeeDetail', function() {
                  const id = $(this).data('id');
                  hasher.setHash('employee/detail/' + id);
                });
              }
            };

            const Datatableopts = $('#TblUserManagement').DataTable(dtopts);

            fnDTSearchEnable(Datatableopts, '#DtEmployeeSearchwrap .DTSearchBox', '#DtEmployeeSearchwrap .DTSearchBtn', '#DtEmployeeSearchwrap .DTfrSearchClr');

            fnHideLoader();
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
  //     },
  //     error: fnXhrErrorAlert
  //   });
  // }
}
function fnSetUserTableId(e) {
  const id = $(e).data('id');

  $('#hidUserEmpId').val(id);
}

function fnSaveNewUser() {
  const FirstName = $('#txtfirstname').val();
  if (FirstName === null || FirstName === '' || FirstName === undefined) {
    fnAlertToast('Please give employee name', 'Validation', 'error')
    return false;
  }
  const LastName = $('#txtlastname').val();
  const MailId = $('#txtusermail').val();
  if (MailId === null || MailId === '' || MailId === undefined) {
    fnAlertToast('Please give email', 'Validation', 'error')
    return false;
  }
  const CountryId = $('#selusecontactcode').val();
  const ContactNo = $('#txtusercontact').val();
  if (ContactNo === null || ContactNo === '' || ContactNo === undefined) {
    fnAlertToast('Please give contact number', 'Validation', 'error')
    return false;
  }
  const DesignationId = $('#seluserdesignation').val();

  const Dob = $('#txtuserdatabirth').val();
  const Doj = $('#txtuserdatajoin').val();

  let AdminUserFlg = false;
  if ($('#flexSwitchUserAdmin').is(':checked')) {
    AdminUserFlg = true;
  }

  const headertoken = localStorage.getItem('token');

  const data = {
    FirstName,
    LastName,
    MailId,
    CountryId,
    ContactNo,
    DesignationId,
    Dob,
    Doj,
    AdminUserFlg
  };
  fnShowLoader();
  $.ajax({
    type: 'POST',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    url: ApiUrl + 'web/v1/employee/SaveEmployee',
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
            fnAlertToast('Saved successfully', 'Validation', 'success');
            fnLoadEmpUserTable();
          } else {
            fnAlertToast('Request failed, Please try again', 'Validation', 'error')
          }
          hasher.setHash('employee/list');
          fnHideLoader();
        } else {
          fnApiStatusFail(response.Message, '', 'error');
        }
      } else {
        fnEmpStatusFail('', '')
      }
      fnHideLoader();
    },
    error: fnXhrErrorAlert
  });
  fnClearData();
}

function fnClearData() {
  $('#txtfirstname').val('');
  $('#txtlastname').val('');
  $('#txtusermail').val('');
  $('#txtusercontact').val('');
  $('#flexSwitchUserAdmin').prop('checked', true);
}

// $(document).on('click', '.fnEditEmpUser', function() {
//   fnEditEmpUser()
// });

// let EditNewUserModal;
// function fnEditEmpUser() {
//   fnEditUser();
//   $('.lblNewUserTitle').html('Edit User');
//   $('#btnupdateUser').removeClass('d-none');
//   $('#btnsaveUser').addClass('d-none');
//   EditNewUserModal = new bootstrap.Modal(document.getElementById('NewUserModal'));
//   EditNewUserModal.show()
// }

function fnEditUser() {
  const Id = $('#hidUserEmpId').val();

  const data = {
    Id
  }

  if (fnNetworkCheck()) {
    fnShowLoader();
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      cache: false,
      dataType: 'json',
      url: ApiUrl + 'web/v1/employee/ListEmployees',
      data,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            if (data[0] !== null) {
              $('#txtfirstname').val(data[0].FirstName);
              $('#txtlastname').val(data[0].LastName);
              $('#txtusermail').val(data[0].MailId);

              const selusecontactcode = (document.getElementById('selusecontactcode')).tomselect
              selusecontactcode.setValue(data[0].CountryId);

              $('#txtusercontact').val(data[0].ContactNo);

              const seluserdesignation = (document.getElementById('seluserdesignation')).tomselect
              seluserdesignation.setValue(data[0].DesignationId);

              $('#txtuserdatabirth').val(data[0].DOB);
              $('#txtuserdatajoin').val(data[0].DOJ);

              if (data[0].AdminUserFlg) {
                $('#flexSwitchUserAdmin').prop('checked', true);
              } else {
                $('#flexSwitchUserAdmin').prop('checked', false);
              }
            }
            fnHideLoader();
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
        fnHideLoader();
      },
      error: fnXhrErrorAlert
    });
  }
}

// $(document).on('click', '#btnupdateUser', function() {
//   fnUpdateNewUser()
// });

function fnUpdateNewUser() {
  const Id = $('#hidUserEmpId').val();
  const FirstName = $('#txtfirstname').val();
  if (FirstName === null || FirstName === '' || FirstName === undefined) {
    fnAlertToast('Please give employee name', 'Validation', 'error')
    return false;
  }
  const LastName = $('#txtlastname').val();
  const MailId = $('#txtusermail').val();
  if (MailId === null || MailId === '' || MailId === undefined) {
    fnAlertToast('Please give email', 'Validation', 'error')
    return false;
  }
  const CountryId = $('#selusecontactcode').val();
  const ContactNo = $('#txtusercontact').val();
  if (ContactNo === null || ContactNo === '' || ContactNo === undefined) {
    fnAlertToast('Please give contact number', 'Validation', 'error')
    return false;
  }
  const DesignationId = $('#seluserdesignation').val();

  const Dob = $('#txtuserdatabirth').val();
  const Doj = $('#txtuserdatajoin').val();

  let AdminUserFlg = false;
  if ($('#flexSwitchUserAdmin').is(':checked')) {
    AdminUserFlg = true;
  }

  const headertoken = localStorage.getItem('token');

  const data = {
    Id,
    FirstName,
    LastName,
    MailId,
    CountryId,
    ContactNo,
    DesignationId,
    Dob,
    Doj,
    AdminUserFlg
  };
  fnShowLoader();
  $.ajax({
    type: 'POST',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    url: ApiUrl + 'web/v1/employee/UpdateEmployee',
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
            fnAlertToast('Update successfully', 'Validation', 'success');
            fnLoadEmpUserTable();
          } else {
            fnAlertToast('Request failed, Please try again', 'Validation', 'error')
          }
          hasher.setHash('employee/list');
          fnHideLoader();
        } else {
          fnApiStatusFail(response.Message, '', 'error');
        }
      } else {
        fnEmpStatusFail('', '')
      }
      fnHideLoader();
    },
    error: fnXhrErrorAlert
  });
  fnClearData();
}

$(document).on('click', '.fnDeleteEmpUser', function() {
  fnDeleteEmpUser()
});



function fnDeleteEmpUser() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete User',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidUserEmpId').val();

      const data = {
        Id
      };

      if (fnNetworkCheck()) {
        const headertoken = localStorage.getItem('token');
        fnShowLoader();
        $.ajax({
          type: 'GET',
          headers: {
            Authorization: 'Bearer ' + headertoken
          },
          cache: false,
          dataType: 'json',
          url: ApiUrl + 'web/v1/employee/DeleteEmployee',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  hasher.setHash('employee/list');
                } else {
                  fnAlertToast('Request failed, Please try again', 'Validation', 'error')
                }
                fnHideLoader();
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
  });
}

function fnEmployeeNewPageInit(...arg) {
  $('#hidUserEmpId').val(arg[0]);
   

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

  if (arg[0] != null && arg[0] !== '') {
   // EmployeesIndex(1);
    $('#btnupdateUser').removeClass('d-none');
    $('#btnsaveUser').addClass('d-none');

    $('#btnupdateUser').on('click', function(e) {
      if (!document.getElementById('formNewEmployee').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnUpdateNewUser()
      }
      $('#formNewEmployee').addClass('was-validated');
    });
  } else {
    //EmployeesIndex();
    $('#btnupdateUser').addClass('d-none');
    $('#btnsaveUser').removeClass('d-none');

    $('#btnsaveUser').on('click', function(e) {
      if (!document.getElementById('formNewEmployee').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveNewUser()
      }
      $('#formNewEmployee').addClass('was-validated');
    });

    $(document).on('change', '#flexSwitchEnableLogin', function() {
      if($("#flexSwitchEnableLogin").is(":checked")){
        $(".divpassword").removeClass('d-none');
      } else {
          $(".divpassword").addClass('d-none');
      }
    });
    
  }
}

function EmployeesIndex(flg) {
  if (fnNetworkCheck()) {
    fnShowLoader();
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
            const Designation = response.Data.Designation

            if (Designation.length > 0) {
              let SiteHtmlval = ''
              for (let i = 0; i < Designation.length; i++) {
                SiteHtmlval += '<option value=' + Designation[i].Uuid + '>' + Designation[i].DesignationName + '</option>'
              }
              $('#seluserdesignation,#selDesignationFilter').html(SiteHtmlval);
            }

            const Country = response.Data.Country

            if (Country.length > 0) {
              let SiteHtmlval = ''
              for (let i = 0; i < Country.length; i++) {
                SiteHtmlval += '<option value=' + Country[i].Uuid + '>' + Country[i].ShortName + '</option>'
              }
              $('#selusecontactcode').html(SiteHtmlval);
            }

            new TomSelect('#seluserdesignation,#selDesignationFilter', {
              plugins: ['dropdown_input']
            });
            new TomSelect('#selusecontactcode', {
              plugins: ['dropdown_input']
            });
            if (flg === 1) {
              fnEditUser();
            }
            fnHideLoader()
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

function fnOpenEmployeeDetail(arg) {
  $('#hidUserEmpId').val(arg);
  fnLoadEmployeeDetail();
  $('.employeeListWrap').addClass('d-none');
  $('.employeeDetailWrap').removeClass('d-none');
}

function fnEmployeeDetailPageInit(...arg) {
  fnEmployeeListPageInit();
  fnEmployeeDetailPageInit(arg[0]);
}

function fnLoadEmployeeDetail() {
  // const Id = $('#hidUserEmpId').val();

  // const data = {
  //   Id
  // }

  if (fnNetworkCheck()) {
    fnShowLoader();
    const headertoken = localStorage.getItem('token');
    // $.ajax({
    //   type: 'GET',
    //   headers: {
    //     Authorization: 'Bearer ' + headertoken
    //   },
    //   cache: false,
    //   dataType: 'json',
    //   url: ApiUrl + 'web/v1/employee/ListEmployees',
    //   data,
    //   success: function (response) {
     


        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            if (data[0] !== null) {
              if (data[0].LastName !== null && data[0].LastName !== '') {
                $('#lblEmployeeName').html(data[0].FirstName + '' + data[0].LastName);
              } else {
                $('#lblEmployeeName').html(data[0].FirstName);
              }
              $('#lblEmployeeDesign').html(data[0].MailId);
              $('#lblEmployeeMail').html(data[0].MailId);
              $('#lblEmployeeContact').html(data[0].ContactNo);

              $('#lblEmployeeDOB').html(data[0].DOB);
              $('#lblEmployeeDOJ').html(data[0].DOJ);

              if (data[0].AdminUserFlg) {
                $('#lblEmployeeAdminFlg').html('Yes');
              } else {
                $('#lblEmployeeAdminFlg').html('No');
              }

              if (data[0].Status === 'Active') {
                $('#lblEmployeeStatus').html('<span class="badge bg-success">Active</span>');
              } else {
                $('#lblEmployeeStatus').html('<span class="badge bg-danger">InActive</span>');
              }
            }
            fnHideLoader();
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } 
        // else {
        //   fnEmpStatusFail('', '')
        // }
        fnHideLoader();
  //     },
  //     error: fnXhrErrorAlert
  //   });
   }
}

export {
  fnEmployeeListPageInit,
  fnEmployeeNewPageInit,
  fnEmployeeDetailPageInit,
  fnOpenEmployeeDetail
};
