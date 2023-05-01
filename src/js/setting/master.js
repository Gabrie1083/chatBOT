import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnMasterSettingPageInit() {
  fnAssetBrandTable()
  $('.btnNewAssetBrand').on('click', function() {
    fnNewAssetBrandModal();
  });
  $('.SaveAssetBrand').on('click', function(e) {
    if (!document.getElementById('formSettingAssetBrand').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveAssetBrand();
    }
    $('#formSettingAssetBrand').addClass('was-validated');
  });
  $('.fnUpdateAssetBrand').on('click', function(e) {
    if (!document.getElementById('formSettingAssetBrand').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnUpdateAssetBrand();
    }
    $('#formSettingAssetBrand').addClass('was-validated');
  });
}

let ModalNewAssetBrandItem
function fnNewAssetBrandModal() {
  $('.SaveAssetBrand').removeClass('d-none');
  $('.fnUpdateAssetBrand').addClass('d-none')
  $('#txtassetbrand').val('');
  ModalNewAssetBrandItem = new bootstrap.Modal(document.getElementById('ModalNewAssetBrandItem'));
  ModalNewAssetBrandItem.show()
}

function fnSaveAssetBrand() {
  const Brand = $('#txtassetbrand').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    Brand
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveAssetBrand',
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
              fnAlertToast('Asset Brand Added Successfully', 'Success', 'success');
              fnAssetBrandTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewAssetBrandItem.hide()
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

function fnAssetBrandTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditAssetBrandModal"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteAssetBrand"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
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
      url: ApiUrl + 'web/v1/setting/LoadAssetBrand',
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
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetAssetBrandTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'BrandName' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetAssetBrandTableId', function() {
                  fnSetAssetBrandTableId(this)
                });
                $(document).on('click', '.fnDeleteAssetBrand', function() {
                  fnDeleteAssetBrand()
                });
                $(document).on('click', '.fnEditAssetBrandModal', function() {
                  fnEditAssetBrandModal()
                });
              }
            };

            const Datatableopts = $('#TblAssetBrand').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtSAssetBrandsearchwrap .DTSearchBoxAssetBrand', '#DtSAssetBrandsearchwrap .DTSearchBtnAssetBrand', '#DtSAssetBrandsearchwrap .DTfrSearchClrAssetBrand');
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

function fnSetAssetBrandTableId(e) {
  const id = $(e).data('id');

  $('#hidBrandTypeId').val(id);
}

let ModalNewAssetBrandItemEdit
function fnEditAssetBrandModal() {
  $('.SaveAssetBrand').addClass('d-none');
  $('.fnUpdateAssetBrand').removeClass('d-none')
  $('#txtassetbrand').val('');
  fnEditAssetBrand();
  ModalNewAssetBrandItemEdit = new bootstrap.Modal(document.getElementById('ModalNewAssetBrandItem'));
  ModalNewAssetBrandItemEdit.show()
}

function fnEditAssetBrand() {
  const Id = $('#hidBrandTypeId').val();
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
      url: ApiUrl + 'web/v1/setting/LoadAssetBrand',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data[0] !== null) {
              $('#txtassetbrand').val(data[0].BrandName);
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

function fnUpdateAssetBrand() {
  const Brand = $('#txtassetbrand').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    Brand
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/UpdateAssetBrand',
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
              fnAlertToast('Asset Brand Added Successfully', 'Success', 'success');
              fnAssetBrandTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewAssetBrandItemEdit.hide()
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

function fnDeleteAssetBrand() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete Asset Brand',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidBrandTypeId').val();

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
          url: ApiUrl + 'web/v1/setting/DeleteAssetBrand',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnAssetBrandTable();
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
  fnMasterSettingPageInit
}
