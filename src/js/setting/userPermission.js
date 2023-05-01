import hasher from 'hasher';
import $ from 'jquery';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnSettingUserPermissionInit(...arg) {
  if (arg[0] === 'list') {
    $('.userPermissionListWrap').removeClass('d-none');
    $('.userPermissionNewWrap').addClass('d-none');
    $('.btnNewUserPermission').on('click', function() {
      hasher.setHash('setting/userpermission/new');
    });
    fnUserPermissionTable();
  } else if (arg[0] === 'new') {
    $('#hidUserPermissionId').val(arg[1]);
    $('.fnCancelUserPermission').on('click', function() {
      hasher.setHash('setting/userpermission');
    });
    SettingUserPermissionIndex();
    $('.userPermissionListWrap').addClass('d-none');
    $('.userPermissionNewWrap').removeClass('d-none');
    $('#btnsaveUserPermission').on('click', function(e) {
      if (!document.getElementById('formUserPermission').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveNewUserPermission()
      }
      $('#formUserPermission').addClass('was-validated');
    });
  } else {
    $('.userPermissionListWrap,.userPermissionNewWrap').addClass('d-none');
    $('.userPermissionDetailWrap').removeClass('d-none');
  }
}

function SettingUserPermissionIndex() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
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
            const Employee = response.Data.Employee

            if (Employee.length > 0) {
              let SiteHtmlval = '<option value="">Select</option>'
              for (let i = 0; i < Employee.length; i++) {
                SiteHtmlval += '<option value=' + Employee[i].Uuid + '>' + Employee[i].EmpName + '</option>'
              }
              $('#selUserPermissionEmp').html(SiteHtmlval);
            }
            new TomSelect('#selUserPermissionEmp', {
              plugins: ['dropdown_input']
            });

            const MenuList = response.Data.MenuList
            const setting = {
              check: {
                enable: true
              },
              data: {
                simpleData: {
                  enable: true
                }
              }
            };

            const JsonData = []
            if (MenuList.length > 0) {
              for (let index = 0; index < MenuList.length; index++) {
                if (MenuList[index].deleted === 1) {
                  JsonData.push({
                    id: 'C' + MenuList[index].id,
                    pId: 'C' + MenuList[index].parentid,
                    name: MenuList[index].menu_title,
                    open: true,
                    checked: true,
                    Uuid: MenuList[index].id
                  })
                } else {
                  JsonData.push({
                    id: 'C' + MenuList[index].id,
                    pId: 'C' + MenuList[index].parentid,
                    name: MenuList[index].menu_title,
                    open: true,
                    Uuid: MenuList[index].id
                  })
                }
              }
            }

            const zNodes = JsonData;
            setting.check.chkboxType = { Y: 'ps', N: 'ps' };
            function disabledNode(e) {
              const zTree = $.fn.zTree.getZTreeObj('UserWebMenu');
              const disabled = e.data.disabled;
              const nodes = zTree.getSelectedNodes();
              if (nodes.length === 0) {
                alert('Please select one node at first...');
              }

              for (let i = 0, l = nodes.length; i < l; i++) {
                zTree.setChkDisabled(nodes[i], disabled);
              }
            }

            $.fn.zTree.init($('#UserWebMenu'), setting, zNodes);
            $('#disabledTrue').bind('click', { disabled: true }, disabledNode);
            $('#disabledFalse').bind('click', { disabled: false }, disabledNode);

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
    })
  }
}

function fnUserPermissionNewPageInit(...arg) {
  if (arg[0] === 'list') {
    $('.userPermissionListWrap').removeClass('d-none');
    $('.userPermissionNewWrap').addClass('d-none');
    fnUserPermissionTable();
  } else if (arg[0] === 'new') {
    $('#hidUserPermissionId').val(arg[1]);
    $('.fnCancelUserPermission').on('click', function() {
      hasher.setHash('setting/userpermission');
    });
    SettingUserPermissionIndex();
    $('.userPermissionListWrap').addClass('d-none');
    $('.userPermissionNewWrap').removeClass('d-none');
    $('#btnsaveUserPermission').on('click', function(e) {
      if (!document.getElementById('formUserPermission').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveNewUserPermission()
      }
      $('#formUserPermission').addClass('was-validated');
    });
  } else {
    $('.userPermissionListWrap,.userPermissionNewWrap').addClass('d-none');
    $('.userPermissionDetailWrap').removeClass('d-none');
  }
}

function fnUserPermissionTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteUserPermission"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
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
      url: ApiUrl + 'web/v1/setting/ListUserMenuMappingList',
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
                  targets: [0],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [1],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [2],
                  render: function (data, type, full, meta) {
                    return '<div class="d-grid"><a class="btn btn-info btnOpenUserPermissionDetail" data-id=\'' + full.Empid + '\'>Detail</a></div>'
                  }
                },
                {
                  targets: [3],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Empid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUserPermissionTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'EmpName' },
                { width: '40%', data: 'DesignationName' },
                { width: '10%', data: null },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetUserPermissionTableId', function() {
                  fnSetUserPermissionTableId(this)
                });
                $(document).on('click', '.btnOpenUserPermissionDetail', function() {
                  const id = $(this).data('id');
                  hasher.setHash('setting/userpermission/detail/' + id);
                });
                $(document).on('click', '.fnDeleteUserPermission', function() {
                  fnDeleteUserPermission()
                });
              }
            };

            const Datatableopts = $('#TblUserPermission').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtUserSearchwrap .DTSearchBoxUser', '#DtUserSearchwrap .DTSearchBtnUser', '#DtUserSearchwrap .DTfrSearchClrUser');
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

function fnSetUserPermissionTableId(e) {
  const id = $(e).data('id');

  $('#hidUserPermissionId').val(id);
}

function fnSaveNewUserPermission(flg) {
  let Empid;
  let arrSelectedPage = [];
  if (flg === 1) {
    Empid = $('#hidUserPermissionId').val();
    const treeObj = $.fn.zTree.getZTreeObj('EditUserWebMenu');
    const nodes = treeObj.getCheckedNodes();
    arrSelectedPage = [];

    for (let i = 0; i < nodes.length; i++) {
      arrSelectedPage[i] = nodes[i].Uuid;
    }
  } else {
    Empid = $('#selUserPermissionEmp').val();
    const treeObj = $.fn.zTree.getZTreeObj('UserWebMenu');
    const nodes = treeObj.getCheckedNodes();
    arrSelectedPage = [];

    for (let i = 0; i < nodes.length; i++) {
      arrSelectedPage[i] = nodes[i].Uuid;
    }
  }

  const payload = {
    Empid,
    arrSelectedPage
  };
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/SaveUserPermission',
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
              fnAlertToast('Saved successfully', 'Validation', 'success');
              hasher.setHash('setting/userpermission');
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
        fnHideLoader();
      },
      error: fnXhrErrorAlert
    });
  }
}

function fnUserPermissionDetailPageInit(...arg) {
  if (arg[0] === 'list') {
    $('.userPermissionListWrap').removeClass('d-none');
    $('.userPermissionNewWrap').addClass('d-none');
    fnUserPermissionTable();
  } else if (arg[0] === 'new') {
    $('#hidUserPermissionId').val(arg[1]);
    $('.fnCancelUserPermission').on('click', function() {
      hasher.setHash('setting/userpermission');
    });
    SettingUserPermissionIndex();
    $('.userPermissionListWrap').addClass('d-none');
    $('.userPermissionNewWrap').removeClass('d-none');
    $('#btnsaveUserPermission').on('click', function(e) {
      if (!document.getElementById('formUserPermission').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveNewUserPermission()
      }
      $('#formUserPermission').addClass('was-validated');
    });
  } else {
    $('#hidUserPermissionId').val(arg[1]);
    $('.fnCancelUserPermissionD').on('click', function() {
      hasher.setHash('setting/userpermission');
    });
    LoadUserPermissionDetail()
    $('.userPermissionListWrap,.userPermissionNewWrap').addClass('d-none');
    $('.userPermissionDetailWrap').removeClass('d-none');
    $('#btnUpdateUserPermission').on('click', function(e) {
      if (!document.getElementById('formUserPermissionD').checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        fnSaveNewUserPermission(1)
      }
      $('#formUserPermissionD').addClass('was-validated');
    });
  }
}

function LoadUserPermissionDetail() {
  const Empid = $('#hidUserPermissionId').val();
  const payload = {
    Empid
  };
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      cache: false,
      data: payload,
      url: ApiUrl + 'web/v1/setting/ListUserMenuMappingDetail',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        const datas = response

        if (datas.EmpStatus !== false) {
          if (datas.Status === true) {
            const MenuList = response.Data
            $('.lblempname').html(MenuList[0].empname);
            const setting = {
              check: {
                enable: true
              },
              data: {
                simpleData: {
                  enable: true
                }
              }
            };

            const JsonData = []
            if (MenuList.length > 0) {
              for (let index = 0; index < MenuList.length; index++) {
                if (MenuList[index].deleted === true) {
                  JsonData.push({
                    id: 'C' + MenuList[index].id,
                    pId: 'C' + MenuList[index].parentid,
                    name: MenuList[index].menu_title,
                    open: true,
                    checked: true,
                    Uuid: MenuList[index].id
                  })
                } else {
                  JsonData.push({
                    id: 'C' + MenuList[index].id,
                    pId: 'C' + MenuList[index].parentid,
                    name: MenuList[index].menu_title,
                    open: true,
                    Uuid: MenuList[index].id
                  })
                }
              }
            }

            const zNodes = JsonData;
            setting.check.chkboxType = { Y: 'ps', N: 'ps' };
            function disabledNode(e) {
              const zTree = $.fn.zTree.getZTreeObj('EditUserWebMenu');
              const disabled = e.data.disabled;
              const nodes = zTree.getSelectedNodes();
              if (nodes.length === 0) {
                alert('Please select one node at first...');
              }

              for (let i = 0, l = nodes.length; i < l; i++) {
                zTree.setChkDisabled(nodes[i], disabled);
              }
            }

            $.fn.zTree.init($('#EditUserWebMenu'), setting, zNodes);
            $('#disabledTrue').bind('click', { disabled: true }, disabledNode);
            $('#disabledFalse').bind('click', { disabled: false }, disabledNode);
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

function fnDeleteUserPermission() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete User Permission',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidUserPermissionId').val();

      const payload = {
        Empid: Id
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
          url: ApiUrl + 'web/v1/setting/DeleteUserPermission',
          data: payload,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnUserPermissionTable();
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
  fnSettingUserPermissionInit,
  fnUserPermissionNewPageInit,
  fnUserPermissionDetailPageInit
};
