/* eslint-disable no-new */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import hasher from 'hasher';
import $ from 'jquery';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnUserListPageInit() {

  //const listPageLoadFlg = $('#hidEmpListPageLoadFlg').val();
  const listPageLoadFlg ="yes"
  $('.employeeListWrap').removeClass('d-none');
  $('.employeeDetailWrap').addClass('d-none');
  fnLoadUserTable();
  if (listPageLoadFlg !== 'yes') {
    $('#hidEmpListPageLoadFlg').val('yes');
 8

    $('.btnNewEmployee').on('click', function() {
      hasher.setHash('employee/new');
    });
    $('.fnOpenEmployeeFilter').on('click', function() {
      $('.divEmployeeFilterPanel').slideToggle();
    });
    $('.btnFilterEmployee').on('click', function() {
      fnLoadEmpUserTable();
    });
    $('.fnCancelEmployeeDetail').on('click', function() {
      hasher.setHash('employee/list');
    });
  }
}



function fnLoadUserTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditEmpUser"><i class="fa-solid fa-pen-to-square icon"></i>Change Password</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteEmpUser"><i class="fa-solid fa-trash icon"></i>Change to Inactive</a></li>';
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
        "EmpName": "Jay Lim",
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
        "FirstName": "Jay",
        "LastName": "Lim"
      },
      {
        "Uuid": "5c09dc78-b7a5-42b1-ad8d-804d72802a59",
        "EmpName": "Test User",
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
        "FirstName": "Min Htaik",
        "LastName": ""
      },
      {
        "Uuid": "6000a8fd-f0c9-4ec5-950d-f2192e14a1e6",
        "EmpName": "Mr Ng Ang Seng",
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
        "Status": "InActive",
        "FirstName": "Mr Ng Ang",
        "LastName": "Seng"
      },
      {
        "Uuid": "3ca60a99-d410-44be-ac20-a958afd014f3",
        "EmpName": "Mr Rudy ",
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
        "FirstName": "Mr Rudy",
        "LastName": ""
      }]
  }};
  
  console.log(response);
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            $('.lblemployeecount').html(data.length-1)

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
                // {
                //   targets: [0],
                //   sortable:false,
                //   render: function (data, type, full, meta) {
                //     return '<span ><div class="form-check form-check-inline"><input class="form-check-input lg chk" id="chkinvsum' + full.Uuid + '" checked  value="' + full.Uuid + '" type="checkbox"><label for="chkinvsum' + full.Uuid + '"></label></div></span>'
                //   }
                // },
                {
                  targets: [0,1],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [2],
                  render: function (data, type, full, meta) {
                    if (full.Status === 'Active') {
                      return '<span class="badge bg-success">Active</span>'
                    } else {
                      return '<span class="badge bg-danger">InActive</span>'
                    }
                  }
                },
                
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUserTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'EmpName' },
                { width: '30%', data: 'MailId' },
                 {width: '20%', data: null },
                { width: '10%', data: null }
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
  
  
 

$(document).on('click', '.fnDeleteEmpUser', function() {
  fnDeleteEmpUser()
});

 
  
 
 
 

export {
  fnUserListPageInit,
  fnLoadUserTable,
  
};
