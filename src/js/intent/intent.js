/* eslint-disable no-new */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import hasher from 'hasher';
import $ from 'jquery';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnIntentListPageInit() {

  //const listPageLoadFlg = $('#hidEmpListPageLoadFlg').val();
  const listPageLoadFlg ="yes"
  $('.employeeListWrap').removeClass('d-none');
  $('.employeeDetailWrap').addClass('d-none');
  fnLoadIntentTable();
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



function fnLoadIntentTable() {
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
        "Title": "New Employee Onboard",
        "Type": "Employee Onboard",
        "TypeId": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Status": "Active",
        "CreateOn": "12/1/2023 7:30",
      },
      {
        "Uuid": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Title": "New Employee Welcome Notification",
        "Type": "Employee Onboard",
        "TypeId": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Status": "Active",
        "CreateOn": "12/4/2023 17:30",
      },
      {
        "Uuid": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Title": "Job Application",
        "Type": "Employee Onboard",
        "TypeId": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Status": "Active",
        "CreateOn": "1/5/2023 5:30",
      },
      {
        "Uuid": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Title": "Offer Letter Raise",
        "Type": "Employee Onboard",
        "TypeId": "c6030dde-f9aa-4bae-907e-a81cc55096be",
        "Status": "Active",
        "CreateOn": "12/1/2023 13:30",
      },
    ]
     
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
                  targets: [0,1,2],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    if (full.Status === 'Active') {
                      return '<span class="badge bg-success">Active</span>'
                    } else {
                      return '<span class="badge bg-danger">InActive</span>'
                    }
                  }
                },
                
                {
                  targets: [4],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-center"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUserTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'Title' },
                { width: '25%', data: 'Type' },
                { width: '20%', data: 'CreateOn' },
                 {width: '10%', data: null },
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

            const Datatableopts = $('#TblIntentTable').DataTable(dtopts);

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
  
  
 

$(document).on('click', '.fnCancelNewIntent', function() {
  hasher.setHash('intent/list');
});
$(document).on('click', '.btnNewIntent', function() {
  hasher.setHash('intent/new');
});

 
  
 function fnNewIntentPageInit(){

 }
 
 

export {
  fnIntentListPageInit,
  fnLoadIntentTable,
  fnNewIntentPageInit
  
};
