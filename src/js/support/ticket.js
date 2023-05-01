import hasher from 'hasher';
import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnApiStatusFail, fnEmpStatusFail, fnDTSearchEnable } from '../commonFunction';

function TicketListPageInit() {
  const listPageLoadFlg = $('#hidTicListPageLoadFlg').val();
  $('#divTicketListView').removeClass('d-none');
  $('#divTicketDetailView').addClass('d-none');
  if (listPageLoadFlg !== 'yes') {
    $('#hidTicListPageLoadFlg').val('yes');
    $('.btnNewTicket').on('click', function() {
      hasher.setHash('help/ticket/new');
    });
    $('.fnOpenTicketFilter').on('click', function() {
      $('.divTicketFilterPanel').slideToggle();
    });
    fnTicketListPageIndex();
    fnLoadTicketTable();
    $('.btnFilterTicket').on('click', function () {
      fnLoadTicketTable();
    });
    $('.fnCancelTicketDetail').on('click', function() {
      hasher.setHash('help/ticket/list');
    });
    $('#btnTicketcomment').on('click', function() {
      fnSaveCommentDetail()
    });
  }
}

function TicketNewPageInit(...arg) {
  if (arg[0] === 'new') {
    $('#btnSaveHelpTicket').removeClass('d-none');
    $('#btnUpdateHelpTicket').addClass('d-none');
    $('.fnCancelTicketNew').on('click', function() {
      hasher.setHash('help/ticket/list');
    });
    $('.fnaddticketattachment').on('click', function () {
      fnaddticketattachment();
    });
    $('.fnNewTicketSubject').on('click', function() {
      fnNewTicketSubjectModal();
    });
    $('#seltaskgroup').on('change', function () {
      const id = (this.value);
      fnchangeusergroup(id);
    });
    $('.onchangefntasktypegroup').on('change', function () {
      fntasktypegroup()
    });
    fntasktypegroup();
    $('#btnSaveHelpTicket').on('click', function(e) {
      if (!document.getElementById('formHelpTicket').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveNewTicket();
      }
      $('#formHelpTicket').addClass('was-validated');
    });
    fnTicketNewPageIndex();
    $('#btnSaveTicketSubject').on('click', function(e) {
      if (!document.getElementById('formTicketSubject').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveTicketSubject();
      }
      $('#formTicketSubject').addClass('was-validated');
    });
    $('#issuedate').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      // maxDate: new Date(),
      locale: {
        format: 'DD/MM/YYYY'
      }
    });
  } else if (arg[0] === 'edit') {
    $('#hidTicketId').val(arg[1]);
    $('#btnUpdateHelpTicket').removeClass('d-none');
    $('#btnSaveHelpTicket').addClass('d-none');
    $('.fnCancelTicketNew').on('click', function() {
      hasher.setHash('help/ticket/list');
    });
    $('.fnaddticketattachment').on('click', function () {
      fnaddticketattachment();
    });
    $('.fnNewTicketSubject').on('click', function() {
      fnNewTicketSubjectModal();
    });
    $('#seltaskgroup').on('change', function () {
      const id = (this.value);
      fnchangeusergroup(id);
    });
    $('.onchangefntasktypegroup').on('change', function () {
      fntasktypegroup()
    });
    fntasktypegroup();
    $('#btnUpdateHelpTicket').on('click', function(e) {
      if (!document.getElementById('formHelpTicket').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnUpdateTicket();
      }
      $('#formHelpTicket').addClass('was-validated');
    });
    fnTicketNewPageIndex();
    $('#btnSaveTicketSubject').on('click', function(e) {
      if (!document.getElementById('formTicketSubject').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveTicketSubject();
      }
      $('#formTicketSubject').addClass('was-validated');
    });
    $('#issuedate').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      // maxDate: new Date(),
      locale: {
        format: 'DD/MM/YYYY'
      }
    });
    fnEditHelpTicket();
  }
}

function TicketDetailPageInit(...arg) {
  TicketListPageInit();
  fnOpenTicketPageDetail(arg[0]);
}

function fnOpenTicketPageDetail(arg) {
  $('#divTicketDetailView').removeClass('d-none');
  $('#divTicketListView').addClass('d-none');
  $('#hidRequestOrderId').val(arg);
  fnHelpTicketDetailPageInit(arg)
}

function fnaddticketattachment() {
  const rowcnt = $('#TicketAttachmentWrap tr').length;

  let attachitemrow = '<tr class="my-2">';
  attachitemrow += '<td>';
  attachitemrow += '<input type="file" id="fileHelpTicketattach' + rowcnt + '" name="fileHelpTicketattach' + rowcnt + '" class="form-control" required><div class="invalid-feedback">Please select attachment</div></td>';
  attachitemrow += '<td>';
  attachitemrow += '<button class="btn btn-outline-danger" type="button" id="removeattach' + rowcnt + '" onclick="fnremoveattachment(' + rowcnt + ')"><i class="fa fa-trash"></i></button></td>';
  attachitemrow += '</tr>';

  $('#TicketAttachmentWrap').append(attachitemrow);
}
window.fnremoveattachment = function (row) {
  $('#removeattach' + row).parent().parent().remove();
}

let NewTicketSubjectModal
function fnNewTicketSubjectModal() {
  $('#txtTicketSubject').val('');
  NewTicketSubjectModal = new bootstrap.Modal(document.getElementById('NewTicketSubjectModal'));
  NewTicketSubjectModal.show()
}

function fnTicketListPageIndex() {
  if (fnNetworkCheck()) {
    fnShowLoader();
    const headertoken = localStorage.getItem('token');

    $.ajax({
      type: 'GET',
      cache: false,
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      //   data: data,
      url: ApiUrl + 'web/v1/ticket/NewTicketIndex',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

            // priority types
            const prioritytypes = data.priority_types;
            if (prioritytypes.length > 0) {
              let Htmlpriority = '<option value="0">All</option>';
              for (let index = 0; index < prioritytypes.length; index++) {
                Htmlpriority += '<option value="' + prioritytypes[index].id + '" >' + prioritytypes[index].name + '</option>';
              }
              $('#selPriorityTypeFilter').html(Htmlpriority);
            }

            new TomSelect('#selPriorityTypeFilter', {
              plugins: ['dropdown_input']
            });
            new TomSelect('#selTicketStatusFilter', {
              plugins: ['dropdown_input']
            });

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

function fnTicketNewPageIndex() {
  if (fnNetworkCheck()) {
    fnShowLoader();
    const headertoken = localStorage.getItem('token');

    $.ajax({
      type: 'GET',
      cache: false,
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      //   data: data,
      url: ApiUrl + 'web/v1/ticket/NewTicketIndex',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const selPriorityType = (document.getElementById('selPriorityType')).tomselect
            if (selPriorityType != null) {
              selPriorityType.destroy();
            }
            const selIssuetype = (document.getElementById('selIssuetype')).tomselect
            if (selIssuetype != null) {
              selIssuetype.destroy();
            }
            const seltaskgroup = (document.getElementById('seltaskgroup')).tomselect
            if (seltaskgroup != null) {
              seltaskgroup.destroy();
            }
            const IndidualEmp = (document.getElementById('IndidualEmp')).tomselect
            if (IndidualEmp != null) {
              IndidualEmp.destroy();
            }

            const data = response.Data;

            // priority types
            const prioritytypes = data.priority_types;
            if (prioritytypes.length > 0) {
              let Htmlpriority = '';
              for (let index = 0; index < prioritytypes.length; index++) {
                Htmlpriority += '<option value="' + prioritytypes[index].id + '" >' + prioritytypes[index].name + '</option>';
              }
              $('#selPriorityType').html(Htmlpriority);
            }

            const ticketsubject = data.ticket_subject;
            if (ticketsubject.length > 0) {
              let Htmlpriority = '';
              for (let index = 0; index < ticketsubject.length; index++) {
                Htmlpriority += '<option value="' + ticketsubject[index].Uuid + '" >' + ticketsubject[index].SubjectName + '</option>';
              }
              $('#selIssuetype').html(Htmlpriority);
            }

            // user groups
            const usergroups = data.user_groups;
            if (usergroups.length > 0) {
              let usergroupscontent = '';
              usergroupscontent += '<option value="" selected>Select</option>';
              for (let index = 0; index < usergroups.length; index++) {
                if (index === 0) {
                  usergroupscontent += '<option value="' + usergroups[index].id + '" >' + usergroups[index].name + '</option>';
                } else {
                  usergroupscontent += '<option value="' + usergroups[index].id + '" >' + usergroups[index].name + '</option>';
                }
              }
              $('#seltaskgroup').html(usergroupscontent);
            }

            // employees
            const employees = data.employees;
            if (employees.length > 0) {
              let employeescontent = '';
              let individualemployeescontent = '';

              individualemployeescontent += '<option value="">Select</option>';
              for (let index = 0; index < employees.length; index++) {
                const fullname = employees[index].firstname + employees[index].lastname;
                if (index === 0) {
                  employeescontent += '<option value="' + employees[index].id + '" selected>' + fullname + '</option>';
                } else {
                  employeescontent += '<option value="' + employees[index].id + '" >' + fullname + '</option>';
                }
              }
              individualemployeescontent += employeescontent;
              $('#IndidualEmp').html(individualemployeescontent);
            }

            new TomSelect('#selPriorityType', {
              plugins: ['dropdown_input']
            });
            new TomSelect('#selIssuetype', {
              plugins: ['dropdown_input']
            });
            new TomSelect('#seltaskgroup', {
              plugins: ['dropdown_input']
            });
            new TomSelect('#IndidualEmp', {
              plugins: ['dropdown_input']
            });

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

function fntasktypegroup() {
  if ($('#rdtaskgroup').is(':checked')) {
    $('#divtaskemployee').addClass('d-none');
    $('#divtaskgroup, #divUserGroupEmp').removeClass('d-none');
    $('#divIndidualEmp').addClass('d-none');
    $('#IndidualEmp').attr('required', null);
    $('#seltaskgroup, #UserGroupEmp').attr('required', true);
    $('#IndidualEmp').val('');
  } else {
    $('#divtaskgroup, #divUserGroupEmp').addClass('d-none');
    $('#divtaskemployee').removeClass('d-none');
    $('#divIndidualEmp').removeClass('d-none');
    $('#seltaskgroup, #UserGroupEmp').attr('required', null);
    $('#IndidualEmp').attr('required', true);
    $('#seltaskgroup').val('');
    $('#UserGroupEmp').val('');
  }
}

function fnchangeusergroup(id) {
  const usergroupId = id;
  const headertoken = localStorage.getItem('token');

  if (usergroupId !== null && usergroupId !== 0) {
    if (fnNetworkCheck()) {
      fnShowLoader();
      $.ajax({
        type: 'GET',
        cache: false,
        // data: data,
        headers: {
          Authorization: 'Bearer ' + headertoken
        },
        url: ApiUrl + 'web/v1/workorder/loadusergroupemployees?usergroup_id=' + usergroupId,
        dataType: 'json',
        // data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        timeout: 60000,
        crossDomain: true,
        success: function (response) {
          if (response.EmpStatus === true) {
            if (response.Status === true) {
              const result = response.Data;
              fnHideLoader();
              let htmlvalues = '';
              htmlvalues += '<option value="0"></option>';
              for (let i = 0; i < result.length; i++) {
                htmlvalues += '<option value="' + result[i].id + '">' + result[i].FirstName + '</option>';
              }
              const tempselect = document.getElementById('UserGroupEmp').tomselect;
              if (tempselect !== undefined) {
                tempselect.destroy();
              }

              $('#UserGroupEmp').html(htmlvalues);
              const select = document.getElementById('UserGroupEmp');
              new TomSelect(select);
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
}

function fnSaveTicketSubject() {
  const SubjectName = $('#txtTicketSubject').val();

  const data = {
    SubjectName
  }
  fnShowLoader();
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      url: ApiUrl + 'web/v1/ticket/SaveTicketSubject',
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
              fnAlertToast('New Ticket Subject Added Successfully', 'Success', 'success');
              fnTicketNewPageIndex();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'error');
            }
            NewTicketSubjectModal.hide()
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

function fnSaveNewTicket() {
  let AssignType = null;
  if ($('#rdtaskgroup').is(':checked')) {
    AssignType = 1;
  } else {
    AssignType = 2;
  }
  const TicketSubject = $('#selIssuetype').val();
  const PriorityType = $('#selPriorityType').val();
  const CompletionDate = $('#issuedate').val();
  const Description = $('#TicketDescription').val();
  const attachlength = $('#TicketAttachmentWrap tr').length;
  const oldImgList = [];
  oldImgList[0] = null;
  const arrAssigneeMap = [];
  if (AssignType === 1 || AssignType === '1') {
    const ArrUserGroupEmp = $('#UserGroupEmp').val();
    for (let index = 0; index < ArrUserGroupEmp.length; index++) {
      arrAssigneeMap[index] = [];

      const userGroupId = $('#seltaskgroup').val();
      const EmployeeId = ArrUserGroupEmp[index];
      const AssignTypeId = AssignType;

      arrAssigneeMap[index][0] = userGroupId;
      arrAssigneeMap[index][1] = EmployeeId;
      arrAssigneeMap[index][2] = AssignTypeId;
    }
  } else {
    const ArrIndidualEmp = $('#IndidualEmp').val();
    for (let index = 0; index < ArrIndidualEmp.length; index++) {
      arrAssigneeMap[index] = [];

      const userGroupId = 0;
      const EmployeeId = ArrIndidualEmp[index];
      const AssignTypeId = AssignType;

      arrAssigneeMap[index][0] = userGroupId;
      arrAssigneeMap[index][1] = EmployeeId;
      arrAssigneeMap[index][2] = AssignTypeId;
    }
  }
  const headertoken = localStorage.getItem('token');

  if (attachlength === 0) {
    const arrAttach = [];
    arrAttach[0] = null;

    const data = {
      TicketSubject,
      CompletionDate,
      Description,
      PriorityType,
      arrImages: arrAttach,
      arroldImages: oldImgList,
      arrAssigneeMap
    };
    fnShowLoader();
    $.ajax({
      type: 'POST',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/ticket/SaveNewTicket',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

            if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
              fnAlertToast('New Ticket Added Successfully', 'Success', 'success');
              fnHideLoader();
            } else {
              fnAlertToast('Please verify input is valid', 'Error', 'error');
              fnHideLoader();
            }
            hasher.setHash('help/ticket/list');
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
      },
      error: fnXhrErrorAlert
    });
  } else {
    fnShowLoader();
    const formData = new FormData();
    $('#TicketAttachmentWrap tr').each(function () {
      const fileid = $(this).find('td:first-child input[type="file"]').attr('id');
      formData.append('file', $('#' + fileid)[0].files[0]);
    })

    $.ajax({
      url: ApiUrl + 'web/v1/ticket/UploadFiles',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: formData,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.Result;

            const imgList = [];
            for (let i = 0; i < data.length; i++) {
              imgList[i] = data[i];
            }

            const payload = {
              TicketSubject,
              CompletionDate,
              Description,
              PriorityType,
              arrImages: imgList,
              arroldImages: oldImgList,
              arrAssigneeMap
            };

            $.ajax({
              type: 'POST',
              cache: false,
              headers: {
                Authorization: 'Bearer ' + headertoken
              },
              data: payload,
              url: ApiUrl + 'web/v1/ticket/SaveNewTicket',
              success: function (response) {
                if (response.EmpStatus === true) {
                  if (response.Status === true) {
                    const data = response.Data;

                    if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                      fnAlertToast('New Ticket Added Successfully', 'Success', 'success');
                      fnHideLoader();
                    } else {
                      fnAlertToast('Please verify input is valid', 'Error', 'error');
                      fnHideLoader();
                    }
                    hasher.setHash('help/ticket/list');
                  } else {
                    fnApiStatusFail(response.Message, '', 'error');
                  }
                } else {
                  fnEmpStatusFail('', '')
                }
              },
              error: fnXhrErrorAlert
            });
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

function fnLoadTicketTable() {
  const headertoken = localStorage.getItem('token');

  const statusid = $('#selTicketStatusFilter').val();
  const priorityid = $('#selPriorityTypeFilter').val();

  const data = {
    Id: 0,
    priorityid,
    statusid
  };
  fnShowLoader();
  $.ajax({
    type: 'GET',
    cache: false,
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    data,
    url: ApiUrl + 'web/v1/ticket/ListHelpTicket',
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          const listdata = data.result;

          if (listdata !== 'null' || listdata !== null) {
            let dtActionDrop = '<ul class="dropdown-menu">';
            dtActionDrop += '<li><a class="dropdown-item lnkEditHelpTicket"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
            dtActionDrop += '<li><a class="dropdown-item red-text lnkDeleteHelpTicket"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
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
              data: listdata,
              dom: "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7'p>>",
              columnDefs: [
                {
                  targets: [0, 1, 2],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    if (full.PriorityName === 'low') {
                      return '<div class="d-grid"><span class="badge red lighten-3">Low</span></div>'
                    } else if (full.PriorityName === 'medium' || full.PriorityName === 'mid') {
                      return '<div class="d-grid"><span class="badge red lighten-2">Medium</span></div>'
                    } else if (full.PriorityName === 'high') {
                      return '<div class="d-grid"><span class="badge red lighten-1">High</span></div>'
                    } else {
                      return '<div class="d-grid"><span class="badge red">Critical</span></div>'
                    }
                  }
                },
                {
                  targets: [4],
                  render: function (data, type, full, meta) {
                    if (data === 'Open') {
                      return '<span class="badge bg-warning">Open</span>'
                    } else if (data === 'In Progress') {
                      return '<span class="badge bg-primary">In Progress</span>'
                    } else if (data === 'Closed') {
                      return '<span class="badge bg-danger fade-red">Closed</span>'
                    } else if (data === 'Resolved') {
                      return '<span class="badge bg-success fade-green">Resolved</span>'
                    } else if (data === 'On Hold') {
                      return '<span class="badge bg-secondary fade-green">On Hold</span>'
                    }
                  }

                },
                {
                  targets: [5],
                  render: function (data, type, full, meta) {
                    return '<div class="d-grid"><a class="btn btn-info btnOpenHelpTicketDetail" data-id="' + full.Uuid + '">Detail</a></div>'
                  }
                },
                {
                  targets: [6],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetHelpTicketId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '15%', data: 'CreateDate' },
                { width: '10%', data: 'TicketCode' },
                { width: '20%', data: 'SubjectName' },
                { width: '10%', data: 'PriorityName' },
                { width: '10%', data: 'status' },
                { width: '10%', data: null },
                { width: '5%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.btnOpenHelpTicketDetail', function () {
                  const id = $(this).data('id');
                  hasher.setHash('help/ticket/detail/' + id);
                });
                $(document).on('click', '.fnSetHelpTicketId', function () {
                  const id = $(this).data('id');
                  $('#hidTicketId').val(id);
                });
                $(document).on('click', '.lnkDeleteHelpTicket', function () {
                  fnDeleteHelpTicket();
                });
                $(document).on('click', '.lnkEditHelpTicket', function () {
                  const id = $('#hidTicketId').val();
                  hasher.setHash('help/ticket/edit/' + id);
                });
              }
            };

            const dtTable = $('#TblTicket').DataTable(dtopts);
            fnDTSearchEnable(dtTable, '#DtSTicketsearchwrap .DTSearchBoxTicket', '#DtSTicketsearchwrap .DTSearchBtnTicket', '#DtSTicketsearchwrap .DTfrSearchClrTicket')

            fnHideLoader();
          } else {
            fnAlertToast('Please verify input is valid', 'Error', 'error');
            fnHideLoader();
          }
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

function fnEditHelpTicket() {
  const id = $('#hidTicketId').val();

  const headertoken = localStorage.getItem('token');
  const data = {
    Id: id,
    priorityid: '0',
    statusid: 0
  }
  fnShowLoader();
  $.ajax({
    type: 'GET',
    data,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    timeout: 60000,
    crossDomain: true,
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    url: ApiUrl + 'web/v1/ticket/ListHelpTicket',
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          const editData = data.result[0];
          const attachment = data.result1;
          const AssigneeMapping = data.assignee_mapping;
          const AssigneeEmployees = [];
          const AssigneeGroup = [];
          let AssigneeType = 1;
          if (AssigneeMapping != null) {
            if (AssigneeMapping.length > 0) {
              for (let index = 0; index < AssigneeMapping.length; index++) {
                AssigneeEmployees[index] = [];
                AssigneeEmployees[index] = AssigneeMapping[index].EmployeeId;
                if (AssigneeMapping[index].AssignedTypeId === 1) {
                  AssigneeType = 1;
                  AssigneeGroup[index] = [];
                  AssigneeGroup[index] = AssigneeMapping[index].UserGroupId;
                } else {
                  AssigneeType = 2;
                }
              }
            }
          }

          if (editData !== null) {
            $('#TicketDescription').val(editData.Description);
            $('#issuedate').val(editData.CompletionDate);

            const selIssuetype = (document.getElementById('selIssuetype')).tomselect;
            selIssuetype.setValue(editData.SubjectId);

            const selPriorityType = (document.getElementById('selPriorityType')).tomselect;
            selPriorityType.setValue(editData.PriorityTypeId);

            if (AssigneeType === 1) {
              $('#rdtaskgroup').prop('checked', true);
              const seltaskgroup = (document.getElementById('seltaskgroup')).tomselect;
              if (seltaskgroup !== undefined) {
                seltaskgroup.setValue(AssigneeGroup[0]);
              }
              fnchangeusergroup(AssigneeGroup[0]);

              setTimeout(function () {
                const cid = $('#seltaskgroup').val();
                let selGroupEmployees = null;
                if (cid !== '') {
                  selGroupEmployees = (document.getElementById('UserGroupEmp')).tomselect;
                  if (selGroupEmployees !== undefined) {
                    selGroupEmployees.setValue(AssigneeEmployees);
                  } else {
                    setTimeout(function () {
                      const cid = $('#seltaskgroup').val();
                      let selGroupEmployees = null;
                      if (cid !== '') {
                        selGroupEmployees = (document.getElementById('UserGroupEmp')).tomselect;
                        if (selGroupEmployees !== undefined) {
                          selGroupEmployees.setValue(AssigneeEmployees);
                        }
                      }
                    }, 500);
                  }
                }
              }, 500);
            } else {
              $('#rdtaskemployee').prop('checked', true);
              const IndidualEmp = (document.getElementById('IndidualEmp')).tomselect;
              IndidualEmp.setValue(AssigneeEmployees);
            }
            fntasktypegroup();

            if (attachment !== null) {
              if (attachment.length > 0) {
                $('#EditTicketAttachmentWrap').removeClass('d-none');
                let attachhtml = '';
                for (let ind = 0; ind < attachment.length; ind++) {
                  const fn = attachment[ind].attachment_path.toLowerCase();

                  attachhtml += '<tr>';

                  if (fn.indexOf('.png') !== -1 || fn.indexOf('.jpg') !== -1 || fn.indexOf('.jpeg') !== -1) {
                    attachhtml += '<td style="padding-top:5px;"><span><img src="' + attachment[ind].attachment_path + '" width="75" height="75" /></span><input type="hidden" class="oldattachitems" value="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '"></td>'
                  } else if (fn.indexOf('.pdf') !== -1) {
                    attachhtml += '<td style="padding-top:10px;"><span><a href="javascript:void(0)" onclick="fnDocPreviewOpen(\'' + attachment[ind].attachment_path + '\')" ><img src="../img/pdf_icon_64px.png" style="height:50px" /></a></span><input type="hidden" class="oldattachitems" value="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '"></td>'
                  } else if (fn.indexOf('.doc') !== -1 || fn.indexOf('.docx') !== -1) {
                    attachhtml += '<td style="padding-top:10px;"><span><img src="../img/doc_icon_64px.png" style="height:35px" title="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '" /></span><input type="hidden" class="oldattachitems" value="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '"></td>';
                  } else if (fn.indexOf('.xls') !== -1 || fn.indexOf('.xlsx') !== -1) {
                    attachhtml += '<td style="padding-top:10px;"><span><img src="../img/xls_icon_64px.png" style="height:35px" title="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '" /></span><input type="hidden" class="oldattachitems" value="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '"></td>';
                  } else {
                    attachhtml += '<td style="padding-top:10px;"><span><img src="../img/other_icon_64px.png" style="height:35px" title="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '" /></span><input type="hidden" class="oldattachitems" value="' + attachment[ind].attachment_path.split('/Ticket/')[1] + '"></td>';
                  }
                  attachhtml += '<td><button class="btn btn-light btn-bordered" id="btndeleteattach' + attachment[ind].id + '" onclick="fnDeleteOldAttach(\'' + attachment[ind].id + '\')" type="button"><i class="fa fa-trash red-text"></i></button></td>';
                  attachhtml += '</tr>';
                }

                $('#EditTicketAttachmentWrap').html(attachhtml);
              }
            }
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

function fnUpdateTicket() {
  let AssignType = null;
  if ($('#rdtaskgroup').is(':checked')) {
    AssignType = 1;
  } else {
    AssignType = 2;
  }
  const TicketSubject = $('#selIssuetype').val();
  const PriorityType = $('#selPriorityType').val();
  const CompletionDate = $('#issuedate').val();
  const Description = $('#TicketDescription').val();
  const attachlength = $('#TicketAttachmentWrap tr').length;
  const Id = $('#hidTicketId').val();
  const oldattachlength = $('#EditTicketAttachmentWrap tr').length;
  const oldImgList = [];
  for (let index = 0; index < oldattachlength; index++) {
    oldImgList[index] = $('#EditTicketAttachmentWrap tr:eq(' + index + ')').find('td:first-child input[type="hidden"]').val();
  }
  if (oldattachlength === 0) {
    oldImgList[0] = null;
  }
  const arrAssigneeMap = [];
  if (AssignType === 1 || AssignType === '1') {
    const ArrUserGroupEmp = $('#UserGroupEmp').val();
    for (let index = 0; index < ArrUserGroupEmp.length; index++) {
      arrAssigneeMap[index] = [];

      const userGroupId = $('#seltaskgroup').val();
      const EmployeeId = ArrUserGroupEmp[index];
      const AssignTypeId = AssignType;

      arrAssigneeMap[index][0] = userGroupId;
      arrAssigneeMap[index][1] = EmployeeId;
      arrAssigneeMap[index][2] = AssignTypeId;
    }
  } else {
    const ArrIndidualEmp = $('#IndidualEmp').val();
    for (let index = 0; index < ArrIndidualEmp.length; index++) {
      arrAssigneeMap[index] = [];

      const userGroupId = 0;
      const EmployeeId = ArrIndidualEmp[index];
      const AssignTypeId = AssignType;

      arrAssigneeMap[index][0] = userGroupId;
      arrAssigneeMap[index][1] = EmployeeId;
      arrAssigneeMap[index][2] = AssignTypeId;
    }
  }
  const headertoken = localStorage.getItem('token');

  if (attachlength === 0) {
    const arrAttach = [];
    arrAttach[0] = null;

    const data = {
      TicketSubject,
      CompletionDate,
      Description,
      PriorityType,
      arrImages: arrAttach,
      arroldImages: oldImgList,
      arrAssigneeMap,
      Id
    };
    fnShowLoader();
    $.ajax({
      type: 'POST',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/ticket/UpdateHelpTicket',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

            if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
              fnAlertToast('Ticket Updated Successfully', 'Success', 'success');
              fnHideLoader();
            } else {
              fnAlertToast('Please verify input is valid', 'Error', 'error');
              fnHideLoader();
            }
            hasher.setHash('help/ticket/list');
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
      },
      error: fnXhrErrorAlert
    });
  } else {
    fnShowLoader();
    const formData = new FormData();
    $('#TicketAttachmentWrap tr').each(function () {
      const fileid = $(this).find('td:first-child input[type="file"]').attr('id');
      formData.append('file', $('#' + fileid)[0].files[0]);
    })

    $.ajax({
      url: ApiUrl + 'web/v1/ticket/UploadFiles',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: formData,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.Result;

            const imgList = [];
            for (let i = 0; i < data.length; i++) {
              imgList[i] = data[i];
            }

            const payload = {
              TicketSubject,
              CompletionDate,
              Description,
              PriorityType,
              arrImages: imgList,
              arroldImages: oldImgList,
              arrAssigneeMap,
              Id
            };

            $.ajax({
              type: 'POST',
              cache: false,
              headers: {
                Authorization: 'Bearer ' + headertoken
              },
              data: payload,
              url: ApiUrl + 'web/v1/ticket/UpdateHelpTicket',
              success: function (response) {
                if (response.EmpStatus === true) {
                  if (response.Status === true) {
                    const data = response.Data;

                    if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                      fnAlertToast('Ticket Updated Successfully', 'Success', 'success');
                      fnHideLoader();
                    } else {
                      fnAlertToast('Please verify input is valid', 'Error', 'error');
                      fnHideLoader();
                    }
                    hasher.setHash('help/ticket/list');
                  } else {
                    fnApiStatusFail(response.Message, '', 'error');
                  }
                } else {
                  fnEmpStatusFail('', '')
                }
              },
              error: fnXhrErrorAlert
            });
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

function fnDeleteHelpTicket() {
  const headertoken = localStorage.getItem('token');
  const id = $('#hidTicketId').val();
  Swal.fire({
    title: 'Confirmation',
    text: 'Please confirm to delete ticket',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      fnShowLoader();
      $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        timeout: 60000,
        crossDomain: true,
        headers: {
          Authorization: 'Bearer ' + headertoken
        },
        // data: data,
        url: ApiUrl + 'web/v1/Ticket/DeleteHelpTicket?id=' + id,
        success: function (response) {
          if (response.EmpStatus === true) {
            if (response.Status === true) {
              const data = response.Data;

              if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                fnAlertToast('Work Order Deleted Successfully', 'Success', 'success');

                fnHideLoader();
                fnLoadTicketTable();
              } else {
                fnAlertToast('Please verify input is valid', 'Error', 'error');
                fnHideLoader();
              }
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
  });
}

function fnHelpTicketDetailPageInit(id) {
  fnLoadHelpTicketDetailTable(id);
  $('.fnaddattachmentTicket').on('click', function () {
    fnaddattachmentTicket();
  });
}

function fnaddattachmentTicket() {
  const rowcnt = $('#TicketDetailAttachmentWrap tr').length;

  let attachitemrow = '<tr class="my-2">';
  attachitemrow += '<td>';
  attachitemrow += '<input type="file" id="filecommentattach' + rowcnt + '" name="filecommentattach' + rowcnt + '" class="form-control" required><div class="invalid-feedback">Please select attachment</div></td>';
  attachitemrow += '<td>';
  attachitemrow += '<button class="btn btn-outline-danger" type="button" id="removeattach' + rowcnt + '" onclick="fnremoveattachmentTicket(' + rowcnt + ')"><i class="fa fa-trash"></i></button></td>';
  attachitemrow += '</tr>';

  $('#TicketDetailAttachmentWrap').append(attachitemrow);
}
window.fnremoveattachmentTicket = function (row) {
  $('#removeattach' + row).parent().parent().remove();
}

function fnLoadHelpTicketDetailTable(id) {
  const headertoken = localStorage.getItem('token');

  const Id = id;
  const data = {
    Id
  };
  fnShowLoader();
  $.ajax({
    type: 'GET',
    cache: false,
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    data,
    url: ApiUrl + 'web/v1/ticket/ListHelpTicket',
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          const maindetail = data.result[0];
          const FileResult = data.result1;
          const AssigneeMapping = data.assignee_mapping;

          if (maindetail !== null) {
            $('#lblTicketCode').html(maindetail.TicketCode);
            $('#lblTicketCreatedDate').html(maindetail.CreateDate);
            $('#lblTicketSubject').html(maindetail.SubjectName);
            $('#lblCompletionDate').html(maindetail.CompletionDate);
            let htmlpriority = '';
            if (maindetail.PriorityName === 'critical') {
              htmlpriority += '<span class="badge bg-danger">Critical</span>';
            } else if (maindetail.PriorityName === 'high') {
              htmlpriority += '<span class="badge bg-warning">High</span>';
            } else if (maindetail.PriorityName === 'low') {
              htmlpriority += '<span class="badge bg-info">Low</span>';
            } else {
              htmlpriority += '<span class="badge bg-primary">' + maindetail.PriorityName + '</span>';
            }
            $('#lblTicketPriority').html(htmlpriority);

            let htmlstr2 = '';
            if (maindetail.status === 'Open') {
              htmlstr2 += '<span class="badge bg-warning">' + maindetail.status + '</span>';
            } else if (maindetail.status === 'In Progress') {
              htmlstr2 += '<span class="badge bg-primary">' + maindetail.status + '</span>';
            } else if (maindetail.status === 'On Hold') {
              htmlstr2 += '<span class="badge bg-secondary">' + maindetail.status + '</span>';
            } else if (maindetail.status === 'Closed') {
              htmlstr2 += '<span class="badge bg-success">' + maindetail.status + '</span>';
            } else {
              htmlstr2 += '<span class="badge bg-info">' + maindetail.status + '</span>';
            }
            $('#lblTicketStatus').html(htmlstr2);

            $('#lblTicketCreatedBy').html('-');
            if (maindetail.CreatedUser !== '' && maindetail.CreatedUser !== ' ' && maindetail.CreatedUser !== null) {
              $('#lblTicketCreatedBy').html(maindetail.CreatedUser);
            }

            if (FileResult.length > 0) {
              let htmlstr = '';
              for (let row = 0; row < FileResult.length; row++) {
                if (FileResult[row].attachment_path !== '' && FileResult[row].attachment_path !== null) {
                  const doc = FileResult[row].attachment_path;

                  if (FileResult[row].attachment_path.toString().toLowerCase().indexOf('.jpg') !== -1 || FileResult[row].attachment_path.toString().toLowerCase().indexOf('.jpeg') !== -1 || FileResult[row].attachment_path.toString().toLowerCase().indexOf('.png') !== -1 || FileResult[row].attachment_path.toString().toLowerCase().indexOf('.gif') !== -1) {
                    htmlstr += '<tr>';

                    let fn = '';
                    if (FileResult[row].attachment_path !== '' && FileResult[row].attachment_path !== null) {
                      fn = FileResult[row].attachment_path.toLowerCase();
                    }

                    htmlstr += '<td>';
                    if (fn.indexOf('.png') !== -1 || fn.indexOf('.jpg') !== -1 || fn.indexOf('.jpeg') !== -1) {
                      htmlstr += '<a href="#" onclick="fnOpenLightbox(\'' + FileResult[row].attachment_path + '\')"><img src="' + FileResult[row].attachment_path + '" style="height:60px" /></a>';
                    } else if (fn.indexOf('.pdf') !== -1) {
                      htmlstr += '<img src="img/pdf_icon_64px.png"/>';
                    } else if (fn.indexOf('.doc') !== -1 || fn.indexOf('.docx') !== -1) {
                      htmlstr += '<img src="img/doc_icon_64px.png"/>';
                    } else if (fn.indexOf('.xls') !== -1 || fn.indexOf('.xlsx') !== -1) {
                      htmlstr += '<img src="img/xls_icon_64px.png"/>';
                    } else {
                      htmlstr += '<img src="img/other_icon_64px.png"/>';
                    }
                    htmlstr += '</td>';

                    htmlstr += '<td>';

                    if (fn.indexOf('.png') !== -1 || fn.indexOf('.jpg') !== -1 || fn.indexOf('.jpeg') !== -1) {
                      htmlstr += '<div class="d-grid"><button type="button" class="btn btn-info lnkOpenLightBox" data-url="' + doc + '"><i class="fa-solid fa-file-magnifying-glass"></i>Preview</button></div>'
                    } else if (fn.indexOf('.pdf') !== -1) {
                      htmlstr += '<div class="d-grid"><button type="button" class="btn btn-info lnkPreviewDocument" data-url="' + doc + '">Preview</button></div>'
                    } else if (fn.indexOf('.jfif') !== -1) {
                      htmlstr += '<span><a href="javascript:void(0)" onclick="fnOpenLightbox(\'' + doc + '\')" ><i class="fa-solid fa-file-magnifying-glass"></i>Preview<img src="' + FileResult[row].file_name + '" class="d-none" /></a></span>'
                    } else {
                      htmlstr += '<span>Does not support view';
                    }
                    htmlstr += '</td>'
                    htmlstr += '<td><div class="d-grid"><a class="btn btn-info" href="javascript:void(0)" role="button" download="' + doc + '">Download</a></div></td>';
                    htmlstr += '<td><div class="d-grid"><button type="button" class="btn btn-outline-danger">Delete</button></div></td>';
                  } else {
                    htmlstr += '<tr>';
                    htmlstr += '<td><img src="./img/documents.png"></td>';

                    htmlstr += '<td>';
                    let fn = '';
                    if (FileResult[row].attachment_path !== '' && FileResult[row].attachment_path !== null) {
                      fn = FileResult[row].attachment_path.toLowerCase();
                    }
                    if (fn.indexOf('.png') !== -1 || fn.indexOf('.jpg') !== -1 || fn.indexOf('.jpeg') !== -1) {
                      htmlstr += '<div class="d-grid"><button type="button" class="btn btn-info lnkOpenLightBox" data-url="' + doc + '"><i class="fa-solid fa-file-magnifying-glass"></i>Preview</button></div>'
                    } else if (fn.indexOf('.pdf') !== -1) {
                      htmlstr += '<div class="d-grid"><button type="button" class="btn btn-info lnkPreviewDocument" data-url="' + doc + '">Preview</button></div>'
                    } else if (fn.indexOf('.jfif') !== -1) {
                      htmlstr += '<span><a onclick="fnOpenLightbox(\'' + doc + '\')" ><i class="fa-solid fa-file-magnifying-glass"></i>Preview<img src="' + FileResult[row].attachment_path + '" class="d-none" /></a></span>'
                    } else {
                      htmlstr += '<span>Does not support view';
                    }
                    htmlstr += '</td>'
                    htmlstr += '<td><div class="d-grid"><a class="btn btn-info" role="button" download="' + doc + '">Download</a></div></td>';
                    htmlstr += '<td><div class="d-grid"><button type="button" class="btn btn-outline-danger">Delete</button></div></td>';
                  }
                  htmlstr += '</tr>';
                }
              }
              $('#tblTicketDocument tbody').html(htmlstr);
            }

            if (AssigneeMapping.length > 0) {
              let assigneeHtmlstr = '';
              for (let row = 0; row < AssigneeMapping.length; row++) {
                if (AssigneeMapping[row].AssignedTypeId === 1) {
                  if (row === 0) {
                    assigneeHtmlstr += '<span>Group: ' + AssigneeMapping[row].GroupName + ' - ' + AssigneeMapping[row].FirstName + AssigneeMapping[row].LastName + '</span>';
                  } else {
                    assigneeHtmlstr += '<span>, ' + AssigneeMapping[row].FirstName + AssigneeMapping[row].LastName + '</span>';
                  }
                } else {
                  if (row === 0) {
                    assigneeHtmlstr += '<span>' + AssigneeMapping[row].FirstName + AssigneeMapping[row].LastName + '</span>';
                  } else {
                    assigneeHtmlstr += '<span>, ' + AssigneeMapping[row].FirstName + AssigneeMapping[row].LastName + '</span>';
                  }
                }
              }
              $('#lblTicketAssignTo').html(assigneeHtmlstr);
            }

            fnHideLoader();
          } else {
            fnAlertToast('Please verify input is valid', 'Error', 'error');
            fnHideLoader();
          }
        } else {
          fnApiStatusFail(response.Message, '', 'error');
        }
      } else {
        fnEmpStatusFail('', '')
      }
    },
    error: fnXhrErrorAlert
  });

  fnLoadTicketCommentDetails(Id);
  fnListTicketshowactivelog(Id);
  fnLoadTicketCommentStatus(Id);
}

function fnLoadTicketCommentDetails(Id) {
  const headertoken = localStorage.getItem('token');

  const data = {
    id: Id
  };
  fnShowLoader();

  $.ajax({
    type: 'GET',
    cache: false,
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    data,
    url: ApiUrl + 'web/v1/ticket/LoadTicketCommentDetails',
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const jsonresult = response.Data;
          // console.log(data);\
          const data = jsonresult.result1;
          const Userid = jsonresult.Userid;
          // const data2 = jsonresult.result2;
          if (data !== null) {
            const statusupdate = data;

            let htmlstr = '<div class="chatbody">';
            htmlstr += '<div class="card-body msg_container_base">';
            htmlstr += '<div class="card">';

            for (let i = 0; i < statusupdate.length; i++) {
              if (statusupdate[i].status_item_category === 101) {
                htmlstr += '<div class="row msg_container base_sent right clearfix ">';
                htmlstr += '<div class="col-md-12"><span class="chat-img float-right">';
                htmlstr += '<span class="rounded-circle label-warning">' + statusupdate[i].person_name.charAt(0).toString().toUpperCase() + '</span> ';
                htmlstr += '</span >';
                htmlstr += '<div class="messages msg_receive float-right">';
                htmlstr += '<div class="small text-muted"><span>' + statusupdate[i].modified_date + '</span>';
                if (i === statusupdate.length - 1) {
                  $('#hidTicketLastStatusId').val(statusupdate[i].WorkStatusId);
                  if (Userid === statusupdate[i].ModifiedBy) {
                    htmlstr += '<span style="float: right;padding-left: 5px;"><a class="fnDeleteTicketStatusUpdate" data-id="' + statusupdate[i].WorkStatusId + '"><i class="fa-solid fa-trash"></i></a></span>';
                  }
                }
                htmlstr += '<span style="float: right;"><a class="fnEditTicketStatusUpdate" data-id="' + statusupdate[i].WorkStatusId + '" "><i class="fa-solid fa-pen-to-square"></i></a></span>';
                htmlstr += '</div>';
                let StatusHtmlStr = '';
                if (statusupdate[i].status === 12) {
                  StatusHtmlStr += '<span class="badge bg-warning">Open</span>';
                } else if (statusupdate[i].status === 13) {
                  StatusHtmlStr += '<span class="badge bg-info">Resolved</span>';
                } else if (statusupdate[i].status === 14) {
                  StatusHtmlStr += '<span class="badge bg-success">Closed</span>';
                } else if (statusupdate[i].status === 37) {
                  StatusHtmlStr += '<span class="badge bg-primary">In Progress</span>';
                } else if (statusupdate[i].status === 41) {
                  StatusHtmlStr += '<span class="badge bg-secondary">On Hold</span>';
                }
                htmlstr += '  <div class="fw-bold">' + statusupdate[i].person_name + ' ' + StatusHtmlStr + '</div>';
                htmlstr += '<div class="float-right"><p>' + statusupdate[i].remarks + '</div>';
                htmlstr += '<div><span class="comment-span-img">';
                if (statusupdate[i].file_name !== '') {
                  if (statusupdate[i].file_name.toString().toLowerCase().indexOf('.jpg') !== -1 || statusupdate[i].file_name.toString().toLowerCase().indexOf('.jpeg') !== -1 || statusupdate[i].file_name.toString().toLowerCase().indexOf('.png') !== -1 || statusupdate[i].file_name.toString().toLowerCase().indexOf('.gif') !== -1) { htmlstr += "<a href='#' onclick='fnOpenLightbox('" + statusupdate[i].file_name + "')'><img src='" + statusupdate[i].file_name + "' class='rounded-circle' width='40' height='40'></a>"; } else { htmlstr += "<a download='" + statusupdate[i].file_name + "'  href='" + statusupdate[i].file_name + "' ><i class='fa fa-download'></i>Download</a>"; }
                }

                htmlstr += '</span></div>';
                htmlstr += ' </div></div></div>';
              } else {
                htmlstr += '<div class="row msg_container base_sent right clearfix ">';
                htmlstr += '<div class="col-md-12"><span class="chat-img float-right">';
                htmlstr += '<span class="rounded-circle label-warning">' + statusupdate[i].person_name.charAt(0).toString().toUpperCase() + '</span> ';
                htmlstr += '   </span >';
                htmlstr += '<div class="messages msg_receive float-right">';
                htmlstr += '<div class="small text-muted"><span>' + statusupdate[i].modified_date + '</span>';
                if (i === statusupdate.length - 1) {
                  $('#hidTicketLastStatusId').val(statusupdate[i].WorkStatusId);
                  if (Userid === statusupdate[i].ModifiedBy) {
                    htmlstr += '<span style="float: right;padding-left: 5px;"><a class="fnDeleteTicketStatusUpdate" data-id="' + statusupdate[i].WorkStatusId + '"><i class="fa-solid fa-trash"></i></a></span>';
                  }
                }
                htmlstr += '<span style="float: right;"><a class="fnEditTicketStatusUpdate" data-id="' + statusupdate[i].WorkStatusId + '" "><i class="fa-solid fa-pen-to-square"></i></a></span>';
                htmlstr += '</div>';
                let StatusHtmlStr = '';
                if (statusupdate[i].status === 12) {
                  StatusHtmlStr += '<span class="badge bg-warning">Open</span>';
                } else if (statusupdate[i].status === 13) {
                  StatusHtmlStr += '<span class="badge bg-info">Resolved</span>';
                } else if (statusupdate[i].status === 14) {
                  StatusHtmlStr += '<span class="badge bg-success">Closed</span>';
                } else if (statusupdate[i].status === 37) {
                  StatusHtmlStr += '<span class="badge bg-primary">In Progress</span>';
                } else if (statusupdate[i].status === 41) {
                  StatusHtmlStr += '<span class="badge bg-secondary">On Hold</span>';
                }
                htmlstr += '  <div class="fw-bold">' + statusupdate[i].person_name + ' ' + StatusHtmlStr + '</div>';
                htmlstr += '<div class="float-right"><p>' + statusupdate[i].remarks + '</div>';
                htmlstr += '<div><span class="comment-span-img">';
                if (statusupdate[i].file_name !== '') {
                  if (statusupdate[i].file_name.toString().toLowerCase().indexOf('.jpg') !== -1 || statusupdate[i].file_name.toString().toLowerCase().indexOf('.jpeg') !== -1 || statusupdate[i].file_name.toString().toLowerCase().indexOf('.png') !== -1 || statusupdate[i].file_name.toString().toLowerCase().indexOf('.gif') !== -1) { htmlstr += "<a href='#' onclick='fnOpenLightbox('" + statusupdate[i].file_name + "')'><img src='" + statusupdate[i].file_name + "' class='rounded-circle' width='40' height='40'></a>"; } else { htmlstr += "<a download='" + statusupdate[i].file_name + "'  href='" + statusupdate[i].file_name + "' ><i class='fa fa-download'></i>Download</a>"; }
                }

                htmlstr += '</span></div>';
                htmlstr += ' </div></div></div>';
              }
            }

            htmlstr += '</div>';
            htmlstr += '</div>';
            htmlstr += '</div>';

            $('#divtblcomment').html(htmlstr);

            if (statusupdate === '') {
              $('#commentdefault').removeClass('d-none');
            } else {
              $('#commentdefault').addClass('d-none');
            }
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

let EditTicketStatusUpdateModal = '';
$(document).on('click', '.fnEditTicketStatusUpdate', function() {
  const id = $(this).data('id');
  $('#hidTicketLastStatusId').val(id);
  fnEditTicketStatusUpdate();
  EditTicketStatusUpdateModal = new bootstrap.Modal(document.getElementById('EditTicketStatusUpdateModal'));
  EditTicketStatusUpdateModal.show()
});

$(document).on('click', '.fnUpdateTicketStatusUpdate', function() {
  fnUpdateTicketStatusUpdate();
});

function fnEditTicketStatusUpdate() {
  const id = $('#hidTicketLastStatusId').val();

  const data = {
    id
  }

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();

    $.ajax({
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/workorder/EditWorkOrderStatusUpdate',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

            $('#CommentMsgEdit').val(data.Remark);
            if (data.StatusId === 12) {
              $('#stsopenEdit').prop('checked', true);
            } else if (data.StatusId === 13) {
              $('#stsresolveEdit').prop('checked', true);
            } else if (data.StatusId === 14) {
              $('#stsclosedEdit').prop('checked', true);
            } else if (data.StatusId === 37) {
              $('#stsinprogressEdit').prop('checked', true);
            } else if (data.StatusId === 41) {
              $('#stsonholdEdit').prop('checked', true);
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

function fnUpdateTicketStatusUpdate() {
  const id = $('#hidTicketLastStatusId').val();
  const Remark = $('#CommentMsgEdit').val();
  let Status = 12;
  if ($('#stsopenEdit').is(':checked')) {
    Status = 12;
  } else if ($('#stsresolveEdit').is(':checked')) {
    Status = 13;
  } else if ($('#stsclosedEdit').is(':checked')) {
    Status = 14;
  } else if ($('#stsinprogressEdit').is(':checked')) {
    Status = 37;
  } else if ($('#stsonholdEdit').is(':checked')) {
    Status = 41;
  }

  const data = {
    id,
    Status,
    Remark
  }

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();

    $.ajax({
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/workorder/UpdateWorkOrderStatusUpdate',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

            if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
              fnAlertToast('Status Update Comment Updated Successfully', 'Success', 'success');
            } else {
              fnAlertToast('Please verify input is valid', 'Error', 'error');
            }
            EditTicketStatusUpdateModal.hide();
            const id = $('#hidTicketId').val();
            fnLoadTicketCommentDetails(id);
            fnListTicketshowactivelog(id);
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

$(document).on('click', '.fnDeleteTicketStatusUpdate', function() {
  const id = $(this).data('id');
  $('#hidTicketLastStatusId').val(id);
  fnDeleteTicketStatusUpdate();
});

function fnDeleteTicketStatusUpdate() {
  const id = $('#hidTicketLastStatusId').val();

  const data = {
    id
  }

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();

    $.ajax({
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/workorder/DeleteWorkOrderStatusUpdate',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
              fnAlertToast('Status Update Comment Deleted Successfully', 'Success', 'success');
            } else {
              fnAlertToast('Please verify input is valid', 'Error', 'error');
            }
            const id = $('#hidTicketId').val();
            fnLoadTicketCommentDetails(id);
            fnListTicketshowactivelog(id);
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

function fnListTicketshowactivelog(Id) {
  // var id = $("#txtticketid").val();
  const headertoken = localStorage.getItem('token');

  const data = {
    id: Id
  };
  fnShowLoader();

  $.ajax({
    type: 'GET',
    cache: false,
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    data,
    url: ApiUrl + 'web/v1/ticket/ListTicketActiveLog',
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          // console.log(data);
          if (data !== null) {
            const logdetails = data;

            let htmlvalues = '<ul class="timelineact">';
            for (let i = 0; i < logdetails.length; i++) {
              if (logdetails[i].log_category === 1) {
                htmlvalues += '<li >';
                if (logdetails[i].person_name !== null) {
                  htmlvalues += '<span class="rounded-circleact label-warning">' + logdetails[i].person_name.charAt(0).toString().toUpperCase() + '</span> ';
                }

                htmlvalues += ' <div>';
                if (logdetails[i].person_name === null) {
                  logdetails[i].person_name = '';
                }
                if (logdetails[i].StsDeleted === 1) {
                  htmlvalues += ' <strong >' + logdetails[i].person_name + '</strong><span class="badge bg-danger">Deleted</span> ' + logdetails[i].msg;
                } else {
                  htmlvalues += ' <strong >' + logdetails[i].person_name + '</strong> ' + logdetails[i].msg;
                }
                htmlvalues += '<p> on ';
                htmlvalues += '' + logdetails[i].created_date + '';
                htmlvalues += '</p>';
                htmlvalues += '</div>';
                htmlvalues += '  </li>';
              } else {
                htmlvalues += '<li >';
                htmlvalues += '<span class="rounded-circleact label-success">' + logdetails[i].person_name.charAt(0).toString().toUpperCase() + '</span> ';
                htmlvalues += ' <div>';
                if (logdetails[i].StsDeleted === 1) {
                  htmlvalues += ' <strong >' + logdetails[i].person_name + '</strong><span class="badge bg-danger">Deleted</span> ' + logdetails[i].msg;
                } else {
                  htmlvalues += ' <strong >' + logdetails[i].person_name + '</strong> ' + logdetails[i].msg;
                }
                htmlvalues += '<p> on ';
                htmlvalues += '' + logdetails[i].created_date + '';
                htmlvalues += '</p>';
                htmlvalues += '</div>';
                htmlvalues += '  </li>';
              }
            }
            $('#divactivelogList').html(htmlvalues);
            fnHideLoader();
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

function fnLoadTicketCommentStatus(Id) {
  const headertoken = localStorage.getItem('token');

  const data = {
    id: Id
  };
  fnShowLoader();

  $.ajax({
    type: 'GET',
    cache: false,
    dataType: 'json',
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    data,
    url: ApiUrl + 'web/v1/ticket/LoadTicketCommentStatus',
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          if (data !== null) {
            if (data.status === 12) {
              $('#stsopen').prop('checked', true);
            } else if (data.status === 13) {
              $('#stsresolve').prop('checked', true);
            } else if (data.status === 14) {
              $('#stsclosed').prop('checked', true);
            } else if (data.status === 37) {
              $('#stsinprogress').prop('checked', true);
            } else if (data.status === 41) {
              $('#stsonhold').prop('checked', true);
            }
            fnHideLoader();
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

$(document).on('click', '.lnkOpenLightBox', function () {
  fnRedirectOpenLightBox(this)
});

function fnRedirectOpenLightBox(e) {
  const url = $(e).data('url');
  fnOpenLightbox(url);
}
function fnOpenLightbox(imgitems) {
  const imgarr = [imgitems];

  const ModalDetail = new bootstrap.Modal(document.getElementById('DocPreviewModal'));
  $('#hidDocPreviewFilename').val(imgarr);
  $('#DocPreviewIframe').prop('src', imgarr);

  $('#DocPreviewIframe').on('load', function () {
    $('#DocPreviewModal #DocPreviewIframe').css('height', $(window).height() - 50);

    ModalDetail.show();
    fnHideLoader();
  });
}

function fnSaveCommentDetail() {
  let Status = null;
  if ($('#stsopen').is(':checked')) {
    Status = 12;
  } else if ($('#stsinprogress').is(':checked')) {
    Status = 37;
  } else if ($('#stsonhold').is(':checked')) {
    Status = 41;
  } else if ($('#stsclosed').is(':checked')) {
    Status = 14;
  } else if ($('#stsresolve').is(':checked')) {
    Status = 13;
  }
  const Comments = $('#CommentMsg').val();
  const id = $('#hidTicketId').val();
  const LastStatusId = $('#hidTicketLastStatusId').val();

  if (Comments === null) {
    fnAlertToast('Please enter the \'comment\'', 'Warning', 'warning');
    return false;
  }

  const attachlength = $('#TicketDetailAttachmentWrap tr').length;

  const headertoken = localStorage.getItem('token');

  if (attachlength === 0) {
    const arrAttach = [];
    arrAttach[0] = null;

    const data = {
      id,
      Comments: escape(Comments),
      Status,
      LastStatusId,
      arrImages: arrAttach

    };
    fnShowLoader();
    $.ajax({
      type: 'POST',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/ticket/SaveTicketCommentDetail',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data[0];

            if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
              fnAlertToast('Ticket Comment Updated Successfully', 'Success', 'success');
              fnClearTicketCommentDetail();
              fnLoadTicketCommentDetails(id);
              fnListTicketshowactivelog(id);
              fnLoadTicketCommentStatus(id);

              fnHideLoader();
            } else {
              fnAlertToast('Please verify input is valid', 'Error', 'error');
              fnHideLoader();
            }
          } else {
            fnApiStatusFail(response.Message, '', 'error');
          }
        } else {
          fnEmpStatusFail('', '')
        }
      },
      error: fnXhrErrorAlert
    });
  } else {
    fnShowLoader();
    const formData = new FormData();

    $('#TicketDetailAttachmentWrap tr').each(function () {
      const fileid = $(this).find('td:first-child input[type="file"]').attr('id');
      formData.append('file', $('#' + fileid)[0].files[0]);
    })

    $.ajax({
      url: ApiUrl + 'web/v1/ticket/UploadFiles',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: formData,
      cache: false,
      // dataType: 'json',
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.Result;

            const imgList = [];
            for (let i = 0; i < data.length; i++) {
              imgList[i] = data[i];
            }

            const payload = {
              id,
              Comments: escape(Comments),
              Status,
              arrImages: imgList
            };

            $.ajax({
              type: 'POST',
              cache: false,
              headers: {
                Authorization: 'Bearer ' + headertoken
              },
              data: payload,
              url: ApiUrl + 'web/v1/ticket/SaveTicketCommentDetail',
              success: function (response) {
                if (response.EmpStatus === true) {
                  if (response.Status === true) {
                    const data = response.Data;

                    if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                      fnAlertToast('Ticket Comment Updated', 'Success', 'success');
                      fnClearTicketCommentDetail();
                      fnLoadTicketCommentDetails(id);
                      fnListTicketshowactivelog(id);
                      fnLoadTicketCommentStatus(id);
                      fnHideLoader();
                    } else {
                      fnAlertToast('Please verify input is valid', 'Error', 'error');
                      fnHideLoader();
                    }
                  } else {
                    fnApiStatusFail(response.Message, '', 'error');
                  }
                } else {
                  fnEmpStatusFail('', '')
                }
              },
              error: fnXhrErrorAlert
            });
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

function fnClearTicketCommentDetail() {
  $('#CommentMsg').val('');
  $('#TicketDetailAttachmentWrap').html('');
}

export {
  TicketListPageInit,
  TicketNewPageInit,
  TicketDetailPageInit,
  fnOpenTicketPageDetail
}
