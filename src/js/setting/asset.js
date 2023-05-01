import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnSettingAssetPageInit() {
  fnAssetTypeTable();
  fnAssetBrandTable()
  $('.btnNewAssetType').on('click', function() {
    fnNewAssetTypeModal();
  });
  $('.SaveAssetType').on('click', function(e) {
    if (!document.getElementById('formSettingAsset').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveAssetType();
    }
    $('#formSettingAsset').addClass('was-validated');
  });
  $('.fnUpdateAssetType').on('click', function(e) {
    if (!document.getElementById('formSettingAsset').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnUpdateAssetType();
    }
    $('#formSettingAsset').addClass('was-validated');
  });
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
  $('.fnSaveAssetSetting').on('click', function(e) {
    fnSaveAssetSetting();
  });
  AssetSettingsIndex();
}

function AssetSettingsIndex() {
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

let ModalNewAssetTypeItem
function fnNewAssetTypeModal() {
  $('.SaveAssetType').removeClass('d-none');
  $('.fnUpdateAssetType').addClass('d-none')
  $('#txtassettype').val('');
  $('#txtassettypedesc').val('');
  ModalNewAssetTypeItem = new bootstrap.Modal(document.getElementById('ModalNewAssetTypeItem'));
  ModalNewAssetTypeItem.show()
}

function fnSaveAssetType() {
  const AssetType = $('#txtassettype').val();
  const AssetDesc = $('#txtassettypedesc').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    AssetType,
    AssetDesc
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveAssetType',
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
              fnAlertToast('Asset Type Added Successfully', 'Success', 'success');
              fnAssetTypeTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewAssetTypeItem.hide()
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

function fnAssetTypeTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditAssetTypeModal"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteAssetType"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
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
      url: ApiUrl + 'web/v1/setting/LoadAssetType',
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
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetAssetTypeTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'TypeName' },
                { width: '40%', data: 'TypeDesc' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetAssetTypeTableId', function() {
                  fnSetAssetTypeTableId(this)
                });
                $(document).on('click', '.fnDeleteAssetType', function() {
                  fnDeleteAssetType()
                });
                $(document).on('click', '.fnEditAssetTypeModal', function() {
                  fnEditAssetTypeModal()
                });
              }
            };

            const Datatableopts = $('#TblAssetType').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtSAssetTypesearchwrap .DTSearchBoxAssetType', '#DtSAssetTypesearchwrap .DTSearchBtnAssetType', '#DtSAssetTypesearchwrap .DTfrSearchClrAssetType');
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

function fnSetAssetTypeTableId(e) {
  const id = $(e).data('id');

  $('#hidAssetTypeId').val(id);
}

let ModalNewAssetTypeItemEdit
function fnEditAssetTypeModal() {
  $('.SaveAssetType').addClass('d-none');
  $('.fnUpdateAssetType').removeClass('d-none')
  $('#txtassettype').val('');
  $('#txtassettypedesc').val('');
  fnEditAssetType();
  ModalNewAssetTypeItemEdit = new bootstrap.Modal(document.getElementById('ModalNewAssetTypeItem'));
  ModalNewAssetTypeItemEdit.show()
}

function fnEditAssetType() {
  const Id = $('#hidAssetTypeId').val();
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
      url: ApiUrl + 'web/v1/setting/LoadAssetType',
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data[0] !== null) {
              $('#txtassettype').val(data[0].TypeName);
              $('#txtassettypedesc').val(data[0].TypeDesc);
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

function fnUpdateAssetType() {
  const Id = $('#hidAssetTypeId').val();
  const AssetType = $('#txtassettype').val();
  const AssetDesc = $('#txtassettypedesc').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    Id,
    AssetType,
    AssetDesc
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/UpdateAssetType',
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
              fnAlertToast('Asset Type Updated Successfully', 'Success', 'success');
              fnAssetTypeTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalNewAssetTypeItemEdit.hide()
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

function fnDeleteAssetType() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete Asset Type',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#hidAssetTypeId').val();

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
          url: ApiUrl + 'web/v1/setting/DeleteAssetType',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnAssetTypeTable();
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

function fnSaveAssetSetting() {
  const AssetPrefix = $('#assetprefix').val();
  const AssetMiddle = $('#assetmiddle').val();
  const AssetSuffix = $('#assetsuffix').val();
  const Seperator = $('#assetseperator').val();

  const data = {
    AssetPrefix,
    AssetMiddle,
    AssetSuffix,
    Seperator
  }
  fnShowLoader();
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveAssetSetting',
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
              fnAlertToast('Asset Settings Update Successfully', 'Success', 'success');
              AssetSettingsIndex();
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

export {
  fnSettingAssetPageInit
}
