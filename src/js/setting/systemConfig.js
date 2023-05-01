import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnSystemConfigPageInit() {
  fnDesignationTable();
  const UserGroupTabEL = document.getElementById('UserGroup-tab');
  UserGroupTabEL.addEventListener('show.bs.tab', () => {
    fnUserGroupTable();
  });
  const UserLevelTabEL = document.getElementById('UserLevel-tab');
  UserLevelTabEL.addEventListener('show.bs.tab', () => {
    fnUserLevelTable();
  });
  $('.btnNewDesignation').on('click', function() {
    fnNewDesignatoionModal();
  });
  $('.fnSaveDesignation').on('click', function(e) {
    if (!document.getElementById('formSettingDesignation').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveDesignation();
    }
    $('#formSettingDesignation').addClass('was-validated');
  });
  $('.fnUpdateDesignation').on('click', function(e) {
    if (!document.getElementById('formSettingDesignation').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnUpdateDesignation();
    }
    $('#formSettingDesignation').addClass('was-validated');
  });
  $('.btnNewUserGroup').on('click', function() {
    fnNewUserGroupModal();
  });
  $('.fnSaveUserGroup').on('click', function(e) {
    if (!document.getElementById('formSettingUserGroup').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveUserGroup();
    }
    $('#formSettingUserGroup').addClass('was-validated');
  });
  $('.fnUpdateUserGroup').on('click', function(e) {
    if (!document.getElementById('formSettingUserGroup').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnUpdateUserGroup();
    }
    $('#formSettingUserGroup').addClass('was-validated');
  });
  SystemConfigIndex();

  $('.btnNewUserLevel').on('click', function() {
    fnNewUserRoleModal();
  });
  $('.fnSaveUserRoleLevel').on('click', function(e) {
    if (!document.getElementById('formSettingUserLevel').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveUserRole();
    }
    $('#formSettingUserLevel').addClass('was-validated');
  });
}

function SystemConfigIndex() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      url: ApiUrl + 'web/v1/setting/ListSystemConfigIndex',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        const datas = response

        if (datas.EmpStatus !== false) {
          if (datas.Status === true) {
            const result = response.Data.UserGroup

            if (result.length > 0) {
              let SiteHtmlval = '<option value="">Select</option>'
              for (let i = 0; i < result.length; i++) {
                SiteHtmlval += '<option value=' + result[i].Uuid + '>' + result[i].GroupName + '</option>'
              }
              $('#selDesignUserGroup').html(SiteHtmlval);
            }

            const UserLevel = response.Data.UserLevel

            if (UserLevel.length > 0) {
              let SiteHtmlval = '<option value="">Select</option>'
              for (let i = 0; i < UserLevel.length; i++) {
                SiteHtmlval += '<option value=' + UserLevel[i].Uuid + '>' + UserLevel[i].RoleName + '</option>'
              }
              $('#selDesignUserRole').html(SiteHtmlval);
            }
            new TomSelect('#selDesignUserGroup,#selDesignUserRole', {
              plugins: ['dropdown_input']
            });
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

let ModalNewDesignationItem
function fnNewDesignatoionModal() {
  $('.fnSaveDesignation').removeClass('d-none');
  $('.fnUpdateDesignation').addClass('d-none');
  $('#txtdesignationname').val('');
  $('#txtdesignshortname').val('');
  $('#selDesignUserGroup').val('');
  $('#selDesignUserRole').val('');
  ModalNewDesignationItem = new bootstrap.Modal(document.getElementById('ModalNewDesignationItem'));
  ModalNewDesignationItem.show()
}

function fnSaveDesignation() {
  const DesignationName = $('#txtdesignationname').val();
  const ShortName = $('#txtdesignshortname').val();
  const GroupId = $('#selDesignUserGroup').val();
  const RoleId = $('#selDesignUserRole').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    DesignationName,
    ShortName,
    GroupId,
    RoleId
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveDesignation',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data === 1) {
              fnAlertToast('Designation Added Successfully', 'Success', 'success');
              fnDesignationTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewDesignationItem.hide()
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

function fnDesignationTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditDesignationModal"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteDesignation"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/ListSettingDesignation',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

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
                  targets: [0, 1, 2, 3],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [4],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetDesignationTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'DesignationName' },
                { width: '20%', data: 'ShortName' },
                { width: '30%', data: 'GroupName' },
                { width: '30%', data: 'RoleName' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetDesignationTableId', function() {
                  fnSetDesignationTableId(this)
                });
                $(document).on('click', '.fnDeleteDesignation', function() {
                  fnDeleteDesignation()
                });
                $(document).on('click', '.fnEditDesignationModal', function() {
                  fnEditDesignationModal()
                });
              }
            };

            const Datatableopts = $('#TblDesignation').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtSDesignationsearchwrap .DTSearchBoxDesignation', '#DtSDesignationsearchwrap .DTSearchBtnDesignation', '#DtSDesignationsearchwrap .DTfrSearchClrDesignation');
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

function fnSetDesignationTableId(e) {
  const id = $(e).data('id');

  $('#hidDesignationId').val(id);
}

let ModalNewDesignationItemEdit
function fnEditDesignationModal() {
  $('.fnSaveDesignation').addClass('d-none');
  $('.fnUpdateDesignation').removeClass('d-none');
  $('#txtdesignationname').val('');
  $('#txtdesignshortname').val('');
  $('#selDesignUserGroup').val('');
  $('#selDesignUserRole').val('');
  fnEditDesignation();
  ModalNewDesignationItemEdit = new bootstrap.Modal(document.getElementById('ModalNewDesignationItem'));
  ModalNewDesignationItemEdit.show()
}

function fnEditDesignation() {
  const Id = $('#hidDesignationId').val();

  const payload = {
    Id
  };

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
      url: ApiUrl + 'web/v1/setting/ListSettingDesignation',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data[0] !== null) {
              $('#txtdesignationname').val(data[0].DesignationName);
              $('#txtdesignshortname').val(data[0].ShortName);
              const selDesignUserGroup = (document.getElementById('selDesignUserGroup')).tomselect
              selDesignUserGroup.setValue(data[0].GroupId);
              if (data[0].RoleId != null) {
                const selDesignUserRole = (document.getElementById('selDesignUserRole')).tomselect
                selDesignUserRole.setValue(data[0].RoleId);
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
}

function fnUpdateDesignation() {
  const Id = $('#hidDesignationId').val();
  const DesignationName = $('#txtdesignationname').val();
  const ShortName = $('#txtdesignshortname').val();
  const GroupId = $('#selDesignUserGroup').val();
  const RoleId = $('#selDesignUserRole').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    Id,
    DesignationName,
    ShortName,
    GroupId,
    RoleId
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/UpdateDesignation',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data === 1) {
              fnAlertToast('Designation Updated Successfully', 'Success', 'success');
              fnDesignationTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewDesignationItemEdit.hide()
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

function fnDeleteDesignation() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete Designation',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidDesignationId').val();

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
          url: ApiUrl + 'web/v1/setting/DeleteDesignation',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnDesignationTable();
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

let ModalNewUserGroupItem
function fnNewUserGroupModal() {
  $('.fnSaveUserGroup').removeClass('d-none');
  $('.fnUpdateUserGroup').addClass('d-none')
  $('#txtgroupname').val('');
  $('#txgroupmail').val('');
  $('#txtgrpcontactno').val('');
  $('#txtgroupdesc').val('');
  ModalNewUserGroupItem = new bootstrap.Modal(document.getElementById('ModalNewUserGroupItem'));
  ModalNewUserGroupItem.show()
}

function fnSaveUserGroup() {
  const GroupName = $('#txtgroupname').val();
  const Email = $('#txgroupmail').val();
  const ContactNo = $('#txtgrpcontactno').val();
  const Description = $('#txtgroupdesc').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    GroupName,
    Email,
    ContactNo,
    Description
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveUserGroup',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data === 1) {
              fnAlertToast('User Group Added Successfully', 'Success', 'success');
              fnUserGroupTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewUserGroupItem.hide()
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

function fnUserGroupTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditUserGroupModal"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteUserGroup"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/ListSystemConfigIndex',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.UserGroup;

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
                  targets: [0, 1, 2],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUserGrpTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'GroupName' },
                { width: '20%', data: 'EmailId' },
                { width: '30%', data: 'ContactNo' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetUserGrpTableId', function() {
                  fnSetUserGrpTableId(this)
                });
                $(document).on('click', '.fnDeleteUserGroup', function() {
                  fnDeleteUserGroup()
                });
                $(document).on('click', '.fnEditUserGroupModal', function() {
                  fnEditUserGroupModal()
                });
              }
            };

            const Datatableopts = $('#TblUserGroup').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtSUserGroupsearchwrap .DTSearchBoxUserGroup', '#DtSUserGroupsearchwrap .DTSearchBtnUserGroup', '#DtSUserGroupsearchwrap .DTfrSearchClrUserGroup');
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

function fnSetUserGrpTableId(e) {
  const id = $(e).data('id');

  $('#hidUserGroupId').val(id);
}

let ModalNewUserGroupItemEdit
function fnEditUserGroupModal() {
  $('.fnSaveUserGroup').addClass('d-none');
  $('.fnUpdateUserGroup').removeClass('d-none')
  $('#txtgroupname').val('');
  $('#txgroupmail').val('');
  $('#txtgrpcontactno').val('');
  $('#txtgroupdesc').val('');
  fnEditUserGroup();
  ModalNewUserGroupItemEdit = new bootstrap.Modal(document.getElementById('ModalNewUserGroupItem'));
  ModalNewUserGroupItemEdit.show()
}

function fnEditUserGroup() {
  const Id = $('#hidUserGroupId').val();

  const payload = {
    Id
  };

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
      url: ApiUrl + 'web/v1/setting/ListSystemConfigIndex',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.UserGroup;
            if (data[0] !== null) {
              $('#txtgroupname').val(data[0].GroupName);
              $('#txgroupmail').val(data[0].EmailId);
              $('#txtgrpcontactno').val(data[0].ContactNo);
              $('#txtgroupdesc').val(data[0].Description);
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

function fnUpdateUserGroup() {
  const Id = $('#hidUserGroupId').val();
  const GroupName = $('#txtgroupname').val();
  const Email = $('#txgroupmail').val();
  const ContactNo = $('#txtgrpcontactno').val();
  const Description = $('#txtgroupdesc').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    Id,
    GroupName,
    Email,
    ContactNo,
    Description
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/UpdateUserGroup',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data === 1) {
              fnAlertToast('User Group Updated Successfully', 'Success', 'success');
              fnUserGroupTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewUserGroupItemEdit.hide()
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

function fnDeleteUserGroup() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete User Group',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidUserGroupId').val();

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
          url: ApiUrl + 'web/v1/setting/DeleteUserGroup',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnUserGroupTable();
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

let NewUserRoleLevelModal
function fnNewUserRoleModal() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();

    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/UserRolesLevelStatic',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const result = response.Data;
            $('#txtRoleName').val('');
            if (result != null) {
              $('#txtRoleLevel').val((parseInt(result) + 1));
            } else {
              $('#txtRoleLevel').val(1);
            }
          }
        }
        NewUserRoleLevelModal = new bootstrap.Modal(document.getElementById('NewUserRoleLevelModal'));
        NewUserRoleLevelModal.show()
        fnHideLoader();
      },
      error: function (xhr) {
        fnXhrErrorAlert(xhr);
      }
    });
  }
}

function fnSaveUserRole() {
  const RoleName = $('#txtRoleName').val();
  const RoleLevel = $('#txtRoleLevel').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    RoleName,
    RoleLevel
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveUserRole',
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data: JSON.stringify(payload),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      timeout: 60000,
      crossDomain: true,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data === 1) {
              fnAlertToast('User Role Added Successfully', 'Success', 'success');
            } else if (data === -1) {
              fnAlertToast('Rolename already exists please try another', 'Validation', 'validation');
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            NewUserRoleLevelModal.hide();
            fnUserLevelTable();
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

function fnUserLevelTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  // dtActionDrop += '<li><a class="dropdown-item fnEditAssetTypeModal"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteUserLevel"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/LoadUserLevel',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;

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
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUserLevelTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'RoleName' },
                { width: '40%', data: 'RoleLevel' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetUserLevelTableId', function() {
                  fnSetUserLevelTableId(this)
                });
                $(document).on('click', '.fnDeleteUserLevel', function() {
                  fnDeleteUserLevel()
                });
              }
            };

            const Datatableopts = $('#TblUserLevel').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtSUserLevelsearchwrap .DTSearchBoxUserLevel', '#DtSUserLevelsearchwrap .DTSearchBtnUserLevel', '#DtSUserLevelsearchwrap .DTfrSearchClrUserLevel');
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

function fnSetUserLevelTableId(e) {
  const id = $(e).data('id');

  $('#hidUserLevelId').val(id);
}

function fnDeleteUserLevel() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete User Role',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidUserLevelId').val();

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
          url: ApiUrl + 'web/v1/setting/DeleteUserRole',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnUserLevelTable();
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

export {
  fnSystemConfigPageInit
}
