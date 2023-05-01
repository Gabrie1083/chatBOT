import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import { ApiUrl, ReportUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

function fnLocationSettingPageInit() {
  LocationSettingsIndex(1);
  fnLoadLocationTable();
  fnLoadUnitTable();

  $('#btnNewLocation').on('click', function() {
    fnNewLocationModal();
  });
  $('.savelocation').on('click', function(e) {
    if (!document.getElementById('formLicenseSetting').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveLocation();
    }
    $('#formLicenseSetting').addClass('was-validated');
  });

  $('#btnNewUnit').on('click', function() {
    fnNewUnitModal();
  });

  $('.btnSaveUnit').on('click', function(e) {
    if (!document.getElementById('formUnitSetting').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveUnit();
    }
    $('#formUnitSetting').addClass('was-validated');
  });
}

function LocationSettingsIndex() {
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

let ModalNewLocationItem
function fnNewLocationModal() {
  $('.lbllocationmodaltitle').html('New Location');
  $('.savelocation').removeClass('d-none');
  $('.Updatelocation').addClass('d-none');
  $('#txtlocation').val('');
  $('#txtdesc').val('');
  ModalNewLocationItem = new bootstrap.Modal(document.getElementById('ModalNewLocationItem'));
  ModalNewLocationItem.show()
}

function fnLoadLocationTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnLocationQRCodeView"><i class="fa-solid fa-print icon"></i>Print</a></li>';
  dtActionDrop += '<li><a class="dropdown-item fnEditLocation"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteLocation"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();

    $.ajax({
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/ListLocations',
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
                  targets: [0, 1, 2, 3],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },
                {
                  targets: [4],
                  render: function (data, type, full, meta) {
                    return '<div class="d-grid"><a class="btn btn-info fnLocationQRCodeDetailView" data-id=\'' + full.Uuid + '\' data-siteid=\'' + full.SiteUuid + '\' data-clientid=\'' + full.ClientUuid + '\' data-sitename="' + full.SiteName + '" data-location=\'' + full.Location + '\'>Preview</a></div>'
                  }
                },
                {
                  targets: [5],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' data-siteid=\'' + full.SiteUuid + '\' data-clientid=\'' + full.ClientUuid + '\' data-sitename=\'' + full.SiteName + '\' data-location=\'' + full.Location + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '10%', data: 'LocationCode' },
                { width: '25%', data: 'Location' },
                { width: '30%', data: 'LocationDesc' },
                { width: '25%', data: 'SiteName' },
                { width: '10%', data: null },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetTableId', function() {
                  fnSetTableId(this)
                });

                $(document).on('click', '.fnLocationQRCodeDetailView', function() {
                  fnLocationQRCodeDetailView(this)
                });
              }
            };

            const Datatableopts = $('#TblLocation').DataTable(dtopts);

            fnDTSearchEnable(Datatableopts, '#DtSLocationsearchwrap .DTSearchBoxLocation', '#DtSLocationsearchwrap .DTSearchBtnLocation', '#DtSLocationsearchwrap .DTfrSearchClrLocation');

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
function fnSetTableId(e) {
  const id = $(e).data('id');
  const siteid = $(e).data('siteid');
  const clientid = $(e).data('clientid');

  const sitename = $(e).data('sitename');
  const location = $(e).data('location');

  $('#hidsitename').val(sitename);
  $('#hidlocationname').val(location);

  $('#hidLocationId').val(id);
  $('#hidLocSiteId').val(siteid);
  $('#hidLocClientId').val(clientid);
}

$(document).on('click', '.fnLocationQRCodeView', function() {
  fnLocationQRCodeView();
});

$(document).on('click', '.fnEditLocation', function() {
  fnEditLocation();
  $('.lbllocationmodaltitle').html('Edit Location');
  $('.savelocation').addClass('d-none');
  $('.Updatelocation').removeClass('d-none');
  ModalNewLocationItem = new bootstrap.Modal(document.getElementById('ModalNewLocationItem'));
  ModalNewLocationItem.show()
});

function fnSaveLocation() {
  const Location = $('#txtlocation').val();
  const LocationDesc = $('#txtdesc').val();

  const data = {
    Location,
    LocationDesc
  }
  fnShowLoader();
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveLocation',
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
              fnAlertToast('New Location Added Successfully', 'Success', 'success');
              fnLoadLocationTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            // let ModalDetail = new bootstrap.Modal(document.getElementById('ModalNewLocationItem'));
            ModalNewLocationItem.hide()
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

function fnEditLocation() {
  const Id = $('#hidLocationId').val();

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
      url: ApiUrl + 'web/v1/setting/ListLocations',
      data,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            if (data[0] !== null) {
              $('#txtlocation').val(data[0].Location);
              $('#txtdesc').val(data[0].LocationDesc);
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

$(document).on('click', '.Updatelocation', function() {
  fnUpdatelocation()
});

function fnUpdatelocation() {
  const id = $('#hidLocationId').val();
  const Location = $('#txtlocation').val();
  const LocationDesc = $('#txtdesc').val();
  const data = {
    id,
    Location,
    LocationDesc
  };

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      // "headers": { "Authorization": "Bearer "+headertoken },
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/UpdateLocation',
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
              fnAlertToast('Updated successfully', 'Success', 'success');
              fnLoadLocationTable();
            } else if (data === -1) {
              fnAlertToast('Already have this location', 'Validation', 'error');
              fnHideLoader();
              return false;
            } else {
              fnAlertToast('Request failed, Please try again', 'Validation', 'error')
            }
            ModalNewLocationItem.hide()
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

$(document).on('click', '.fnDeleteLocation', function() {
  fnDeleteLocation()
});

function fnDeleteLocation() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete Location',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const id = $('#hidLocationId').val();

      const data = {
        id
      };

      if (fnNetworkCheck()) {
        const headertoken = localStorage.getItem('token');
        fnShowLoader();
        $.ajax({
          // "headers": { "Authorization": "Bearer "+headertoken },
          type: 'GET',
          headers: {
            Authorization: 'Bearer ' + headertoken
          },
          url: ApiUrl + 'web/v1/setting/DeleteLocation',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnLoadLocationTable();
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

function fnLoadUnitTable() {
  const data = {
    Id: ''
  }
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditUnit"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteUnit"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
  dtActionDrop += '</ul>';

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    // let deleted = "false";
    $.ajax({
      type: 'POST',
      cache: false,
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      data,
      url: ApiUrl + 'web/v1/setting/ListLocationsUnits',
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
                  targets: [0, 1, 2, 3],
                  render: function (data, type, full, meta) {
                    return '<span>' + data + '</span>'
                  }
                },

                {
                  targets: [4],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetUnitTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '10%', data: 'UnitCode' },
                { width: '30%', data: 'UnitName' },
                { width: '35%', data: 'UnitDescription' },
                { width: '15%', data: 'Location' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetUnitTableId', function() {
                  fnSetUnitTableId(this)
                });
              }
            };

            const Datatableopts = $('#TblUnit').DataTable(dtopts);

            fnDTSearchEnable(Datatableopts, '#DtSUnitSearchWrap .DTSearchBoxUnit', '#DtSUnitSearchWrap .DTSearchBtnUnit', '#DtSUnitSearchWrap .DTfrSearchClrUnit');

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

function fnSetUnitTableId(e) {
  const id = $(e).data('id');
  $('#hidUnitId').val(id);
}

let ModalNewUnitItem
function fnNewUnitModal() {
  $('.lbleditunittitle').html('New Unit');
  $('.btnSaveUnit').removeClass('d-none');
  $('.btnUnitUpdate').addClass('d-none');
  $('#txtunit').val('');
  $('#txtunitdesc').val('');
  ModalNewUnitItem = new bootstrap.Modal(document.getElementById('ModalNewUnitItem'));
  ModalNewUnitItem.show()
}

function fnSaveUnit() {
  const UnitName = $('#txtunit').val();
  const UnitDescription = $('#txtunitdesc').val();
  const LocationId = $('#SelUnitLocation').val();

  const data = {
    UnitName,
    UnitDescription,
    LocationId
  }
  fnShowLoader();
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      url: ApiUrl + 'web/v1/setting/SaveUnits',
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
              fnAlertToast('New Unit Added Successfully', 'Success', 'success');
              fnLoadUnitTable();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'error');
            }
            ModalNewUnitItem.hide()
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

$(document).on('click', '.fnEditUnit', function() {
  fnEditUnit();
  $('.lbleditunittitle').html('Edit Unit');
  $('.btnSaveUnit').addClass('d-none');
  $('.btnUnitUpdate').removeClass('d-none');
  ModalNewUnitItem = new bootstrap.Modal(document.getElementById('ModalNewUnitItem'));
  ModalNewUnitItem.show()
});

function fnEditUnit() {
  const Id = $('#hidUnitId').val();

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
      url: ApiUrl + 'web/v1/setting/ListLocationsUnits',
      data,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data.result;
            if (data[0] !== null) {
              const SelUnitLocation = (document.getElementById('SelUnitLocation')).tomselect
              SelUnitLocation.setValue(data[0].LocationId);
              $('#txtunit').val(data[0].UnitName);
              $('#txtunitdesc').val(data[0].UnitDescription);
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

$(document).on('click', '.btnUnitUpdate', function() {
  fnUpdateUnit()
});

function fnUpdateUnit() {
  const id = $('#hidUnitId').val();
  const UnitName = $('#txtunit').val();
  const UnitDescription = $('#txtunitdesc').val();
  const LocationId = $('#SelUnitLocation').val();
  const data = {
    id,
    UnitName,
    UnitDescription,
    LocationId
  };

  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    fnShowLoader();
    $.ajax({
      // "headers": { "Authorization": "Bearer "+headertoken },
      type: 'POST',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      url: ApiUrl + 'web/v1/setting/UpdateUnits',
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
              fnAlertToast('Updated successfully', 'Success', 'success');
              fnLoadUnitTable();
            } else if (data === -1) {
              fnAlertToast('Already have this unit', 'Validation', 'error');
              fnHideLoader();
              return false;
            } else {
              fnAlertToast('Request failed, Please try again', 'Validation', 'error')
            }
            ModalNewUnitItem.hide()
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

$(document).on('click', '.fnDeleteUnit', function() {
  fnDeleteUnit()
});

function fnDeleteUnit() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete Unit',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const id = $('#hidUnitId').val();

      const data = {
        id
      };

      if (fnNetworkCheck()) {
        const headertoken = localStorage.getItem('token');
        fnShowLoader();
        $.ajax({
          // "headers": { "Authorization": "Bearer "+headertoken },
          type: 'GET',
          headers: {
            Authorization: 'Bearer ' + headertoken
          },
          url: ApiUrl + 'web/v1/setting/DeleteUnits',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnLoadUnitTable();
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

function fnLocationQRCodeView() {
  const id = $('#hidLocationId').val();
  const SiteId = $('#hidLocSiteId').val();
  const ClientId = $('#hidLocClientId').val();

  const sitename = $('#hidsitename').val();
  const location = $('#hidlocationname').val();

  // window.open('form/locationQRCode.html?Id=' + id + '&SiteId=' + SiteId + '&ClientId=' + ClientId + '&SiteName=' + sitename + '&Location=' + location + '&PrintMode=1');
  window.open(ReportUrl + 'v1/WorkOrder/LocationQRCode?Id=' + id + '&SiteId=' + SiteId + '&SpClientId=' + ClientId + '&SiteName=' + sitename + '&Location=' + location + '&mode=1');
  // let ModalDetail = new bootstrap.Modal(document.getElementById('ModalLocationQRCode'));
  // ModalDetail.show()
}

function fnLocationQRCodeDetailView(e) {
  const Id = $(e).data('id');
  const SiteId = $(e).data('siteid');
  const ClientId = $(e).data('clientid');

  const sitename = $(e).data('sitename');
  const location = $(e).data('location');

  $('#hidsitename').val(sitename);
  $('#hidlocationname').val(location);

  $('#hidLocationId').val(Id);
  $('#hidLocSiteId').val(SiteId);
  $('#hidLocClientId').val(ClientId);

  const url = ReportUrl + 'v1/WorkOrder/LocationQRCode?Id=' + Id + '&SiteId=' + SiteId + '&SpClientId=' + ClientId + '&SiteName=' + sitename + '&Location=' + location + '&mode=0';

  const ModalDetail = new bootstrap.Modal(document.getElementById('QRPreviewModal'));
  $('#hidDocPreviewFilename').val(url);
  $('#DocPreviewIframe').prop('src', url);

  $('#DocPreviewIframe').on('load', function () {
    // $("#QRPreviewModal #DocPreviewIframe").css('height', $(window).height() - 50);

    ModalDetail.show();
    fnHideLoader();
  });
}
export {
  fnLocationSettingPageInit
}
