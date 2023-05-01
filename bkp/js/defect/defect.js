import hasher from 'hasher'
import $ from 'jquery'
// import * as bootstrap from 'bootstrap'
// import Swal from 'sweetalert2'
// import TomSelect from "tom-select";
import moment from 'moment';
import { ApiUrl } from '../../index'
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable } from '../commonFunction'

function fnDefectPageInit () {
  Index()

  fnLoadDefectTable()

  const start = moment().subtract(29, 'days')
  const end = moment()

  function cb (start, end) {
    $('#txtOrderFilterDateRange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
  }

  $('#txtOrderFilterDateRange').daterangepicker({
    alwaysShowCalendars: true,
    startDate: start,
    endDate: end,
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  }, cb)

  cb(start, end)

  // new TomSelect('#Selreporttype',{
  //   create: true,
  //   sortField: {
  //       field: "text",
  //       direction: "asc"
  //   }
  // });

  // new TomSelect('#selOrderFilterHotel',{
  //   create: true,
  //   sortField: {
  //       field: "text",
  //       direction: "asc"
  //   }
  // });

  $(document).on('click', '.fnRedirectNewDefect', function () {
    hasher.setHash('defect/new')
  })
  $(document).on('click', '.fnOpenTenantFilter', function () {
    $('.divTenantFilterPanel').slideToggle()
  })
}
function Index () {
  if (fnNetworkCheck()) {
    $.ajax({
      type: 'POST',
      url: ApiUrl + 'web/v1/defect/InitAllDefectIndex',
      success: function (response) {
        if (response.EmpStatus !== false) {
          if (response.Status === true) {
            const result = response.Data.Defectcat

            if (result.length > 0) {
              let SiteHtmlval = '<option value="0" selected>All Type</option>'
              for (let i = 0; i < result.length; i++) {
                SiteHtmlval += '<option value=' + result[i].id + '>' + result[i].category_name + '</option>'
              }
              $('#SelDefType').html(SiteHtmlval)
            }

            const data1 = response.Data.Employee

            if (data1 !== null) {
              let EmpStr = '<option value="0">ALL</option>'
              if (data1.length > 0) {
                for (let i = 0; i < data1.length; i++) {
                  EmpStr += '<option value="' + data1[i].id + '">' + data1[i].emp_name + '</option>'
                }
              }

              $('#selDefemp').html(EmpStr)
              $('#selDefemp').val('0').trigger('change')
            }

            const defectdate = response.Data.ListDefectData

            $('#hidincifirstdate').val(defectdate)
            // fndatapiceker(1)
          } else {
            fnAlertToast('Request failed, Please try again', 'Validation', 'error')
          }
        } else {
          fnAlertToast('Request failed, Please try again', 'Validation', 'error')
        }
      },
      error: function (xhr) {
        fnXhrErrorAlert(xhr)
      }
    })
  }
}

function fnLoadDefectTable () {
  const empid = $('#selDefemp').val()

  let status = 0

  if ($('#rdDefstatusOpen').is(':checked')) {
    status = 12
  } else if ($('#rdDefstatusClose').is(':checked')) {
    status = 14
  }
  const date = $('#txtdailypaydaterange').val()

  const startdate = date.split('-')[0]
  const enddate = date.split('-')[1]

  const type = $('#SelDefType').val()

  const category = $('#SelDefCat').val()
  const payload = {
    empid,
    status,
    startdate,
    enddate,
    type,
    category
  }

  if (fnNetworkCheck()) {
    fnShowLoader()
    $.ajax({
      type: 'POST',
      url: ApiUrl + 'web/v1/defect/ListDefectReportWEBClient',
      data: payload,
      success: function (response) {
        if (response !== '') {
          const data = response.result

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
            // "order": [[0, 'asc']],
            columnDefs: [
              // { "orderable": false, "targets": [5, 6] },
              // {
              //     "targets": [0], "render": function (data, type, full, meta) {
              //         if (full.imageIcon != null && full.imageIcon != 'null') {
              //             return '<span><img src="' + full.imageIcon + '" height="30" /></span>'
              //           } else {
              //             return '<span> <img src="../Content/images/placeholder.jpg" height="30" /> </span>'
              //         }
              //     }
              // },
              { targets: [0, 1], render: function (data, type, full, meta) { return '<span>' + data + '</span>' } },
              { targets: [2], render: function (data, type, full, meta) { return '<span>' + data + "<br><p class='subtext'>Created by : " + full.emp_name + '</p></span>' } },
              { targets: [3, 4], render: function (data, type, full, meta) { return '<span>' + data + '</span>' } },
              {
                targets: [5],
                render: function (data, type, full, meta) {
                  if (full.status_id === 1 || full.status_id === 12) {
                    return '<span class="badge bg-secondary orange lighten-2">Open</span>'
                  } else if (full.status_id === 14) {
                    return '<span class="badge bg-secondary green lighten-2">Closed</span>'
                  }
                }
              },

              { targets: [6], render: function (data, type, full, meta) { return '<a class="btn btn-sm btn-block teal lighten-2 white-text fnPreviewDefectreport" data-defect_id=' + full.defect_id + ' data-status_id=' + full.status_id + ' data-defect_code=\'' + full.defect_code + '\' data-type=\'' + full.type + '\'>View</a>' } },
              {
                targets: [7],
                render: function (data, type, full, meta) {
                  return '<div class="dropdown"><button data-defect_id=' + full.defect_id + ' data-sitename=\'' + full.sitename + '\' class="fnSetDefectId" type="button" class="ActionDropLink Sig btn btn-light btn-bordered dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                }
              }
            ],
            columns: [
              { width: '15%', data: 'defect_date' },
              { width: '10%', data: 'defect_code' },
              { width: '18%', data: 'type' },
              { width: '10%', data: 'category_name' },
              { width: '10%', data: null },
              { width: '10%', data: 'id', className: 'td-action' },
              { width: '5%', data: null }
            ],
            drawCallback: function () {
              $(document).on('click', '.btnOpenDefectDetail', function () {
                fnRedirectDefectDetail(this)
              })
            }
          }

          const dtTable = $('#tblDefectList').DataTable(dtopts)

          fnDTSearchEnable(dtTable, '#DtSearchBoxWrap1 .DTSearchBox', '#DtSearchBoxWrap1 .DTSearchClr', '#DtSearchBoxWrap1 .DTSearchBtn')

          // $('#DTSearchBoxMMs').keyup(function () {
          //   tlTable.search($(this).val()).draw();
          //   if ($(this).val() !== '') {
          //     $('#DTSearchBtnMMs').hide();
          //     $('#DTSearchClrMMs').show();
          //   } else {
          //     $('#DTSearchBtnMMs').show();
          //     $('#DTSearchClrMMs').hide();
          //   }
          // });

          // $('#DTSearchClrMMs').click(function () {
          //   tlTable.search('').draw();
          //   $('#DTSearchBoxMMs').val('');

          //   $('#DTSearchBtnMMs').show();
          //   $('#DTSearchClrMMs').hide();
          // });
          fnHideLoader()
        }
      },
      error: function (xhr) {
        fnXhrErrorAlert(xhr)
      }

    })
  }

  let dtActionDrop = '<ul class="dropdown-menu">'
  dtActionDrop += '<li><a class="dropdown-item fnDownloadActionDefect"><i class="fa-solid fa-cloud-arrow-down"></i> Download</a></li>'
  dtActionDrop += '<li><a class="dropdown-item fnPrintDefectReport" href="#"><i class="fa-solid fa-print"></i> Print</a></li>'
  dtActionDrop += '<li class="dropdown-divider"></li>'
  dtActionDrop += '<li><a class="dropdown-item fnEditDefect" href="#"><i class="fa-solid fa-pen-to-square"></i> Edit</a></li>'
  dtActionDrop += '<li><a class="dropdown-item fnallcanceldefect" href="#"><i class="fa fa-trash-o"></i>Delete</a></li>'
  dtActionDrop += '</ul>'
}

function fnDefectNewPageInit () {
  $('.fnCancelNewDefect').on('click', function () {
    hasher.setHash('defect/list')
  })

  $('#txtdefectspotDate').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true
    // maxDate: new Date(),
  })

  $('.fnaddattachment').on('click', function () {
    fnaddattachment()
  })
}

function fnaddattachment () {
  const rowcnt = $('#AttachmentWrap tr').length

  let attachitemrow = '<tr class="my-2">'
  // attachitemrow += '<td class="attach-field">';
  // attachitemrow += '<img id="imgincident' + rowcnt + '" class="d-block" src="img/placeholder.jpg"></td>';
  attachitemrow += '<td>'
  attachitemrow += '<input type="file" id="fileincidentattach' + rowcnt + '" name="fileincidentattach' + rowcnt + '" class="form-control" required><div class="invalid-feedback">Please select attachment</div></td>'
  attachitemrow += '<td>'
  attachitemrow += '<button class="btn btn-outline-danger" type="button" id="removeattach' + rowcnt + '" onclick="fnremoveattachment(' + rowcnt + ')"><i class="fa fa-trash"></i></button></td>'
  attachitemrow += '</tr>'

  $('#AttachmentWrap').append(attachitemrow)
  // $('#fileincidentattach' + rowcnt + '').on('change',function(){
  //     var curElement = $('#imgincident' + rowcnt);
  //     //console.log('jana ' + Math.round(this.files[0].size/1024));

  //     var reader = new FileReader();
  //     reader.onload = function (e) {
  //         // get loaded data and render thumbnail.
  //         curElement.attr('src', e.target.result);
  //     };
  //     // read the image file as a data URL.
  //     reader.readAsDataURL(this.files[0]);
  // });
}
window.fnremoveattachment = function (row) {
  $('#removeattach' + row).parent().parent().remove()
}

function fnRedirectDefectDetail (e) {
  // const id = $(e).data('id')
  // console.log(id)
  hasher.setHash('defect/detail')
}

function fnDefectDetailPageInit () {
  fnLoadDefectDetail()
  fnLoadDefectDetailTable()
  $('.fnCancelDefectDetail').on('click', function () {
    hasher.setHash('defect/list')
  })
}
function fnLoadDefectDetail () {

}
function fnLoadDefectDetailTable () {
  const data = [
    { ID: 1, DateTime: '03-Mar-2022', Site: 'ABC', Type: 'All Type', Category: 'Maintenance', status: 'Open' },
    { ID: 2, DateTime: '15-Jan-2022', Site: 'ABC', Type: 'All Type', Category: 'Security', status: 'Closed' }
  ]

  let dtActionDrop = '<ul class="dropdown-menu">'
  dtActionDrop += '<li><a class="dropdown-item" href="#"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>'
  dtActionDrop += '<li><a class="dropdown-item red-text" href="#"><i class="fa-solid fa-trash icon"></i>Delete</a></li>'
  dtActionDrop += '</ul>'

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
    // "order": [[0, 'asc']],
    columnDefs: [
      // { "orderable": false, "targets": [5, 6] },
      // {
      //     "targets": [0], "render": function (data, type, full, meta) {
      //         if (full.imageIcon != null && full.imageIcon != 'null') {
      //             return '<span><img src="' + full.imageIcon + '" height="30" /></span>'
      //           } else {
      //             return '<span> <img src="../Content/images/placeholder.jpg" height="30" /> </span>'
      //         }
      //     }
      // },
      { targets: [0], render: function (data, type, full, meta) { return '<span>' + full.DateTime + '</span>' } },
      { targets: [1], render: function (data, type, full, meta) { return '<span>' + full.ID + '</span>' } },
      { targets: [2], render: function (data, type, full, meta) { return '<span>' + full.Site + '</span>' } },
      { targets: [3], render: function (data, type, full, meta) { return '<span>' + full.Type + '</span>' } },
      { targets: [4], render: function (data, type, full, meta) { return '<span>' + full.Category + '</span>' } },
      // {
      //     "targets": [4], "render": function (data, type, full, meta)
      //     {
      //         if (full.level == '1') {
      //             return '<div class="d-grid"><span class="badge bg-danger lighten3">E-Level 1</span></div>'
      //         }
      //         else if (full.level == '2') {
      //           return '<div class="d-grid"><span class="badge bg-danger lighten1">E-Level 2</span></div>'
      //         }
      //         else {
      //           return '<div class="d-grid"><span class="badge bg-danger">E-Level 3</span></div>'
      //         }
      //     }
      // },
      {
        targets: [5],
        render: function (data, type, full, meta) {
          if (full.status === 'Open') {
            return '<div class="d-grid"><span class="badge bg-success">Active</span></div>'
          } else if (full.status === 'Closed') {
            return '<div class="d-grid"><span class="badge bg-warning">Expired</span></div>'
          } else {
            return ''
          }
        }
      },
      {
        targets: [6],
        render: function (data, type, full, meta) {
          return '<div class="d-grid"><a class="btn btn-info btnOpenDefectDetail" data-id="' + full.ID + '">Detail</a></div>'
        }
      },
      {
        targets: [7],
        render: function (data, type, full, meta) {
          return '<div class="dropdown text-end"><button onclick="fnSetdtactionItemId(' + full.ID + ')" type="button" class="btn btn-light btn-bordered dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
        }
      }
    ],
    columns: [
      { width: '15%', data: 'DateTime' },
      { width: '10%', data: 'Id' },
      { width: '12%', data: 'Site' },
      { width: '18%', data: 'Type' },
      { width: '10%', data: 'Category' },
      { width: '10%', data: 'status' },
      { width: '10%', data: null },
      { width: '5%', data: null }
    ],
    drawCallback: function () {
      $(document).on('click', '.btnOpenDefectDetail', function () {
        fnRedirectDefectDetail(this)
      })
    }
  }

  const dtTable = $('#tblDefectList').DataTable(dtopts)

  fnDTSearchEnable(dtTable, '#DtSearchBoxWrap1 .DTSearchBox', '#DtSearchBoxWrap1 .DTSearchClr', '#DtSearchBoxWrap1 .DTSearchBtn')

  // var dtsearchbox = '#DtSearchBoxWrap1 .DTSearchBox';
  // var dtsearchclr = '#DtSearchBoxWrap1 .DTSearchClr';
  // var dtsearchbtn = '#DtSearchBoxWrap1 .DTSearchBtn';
  // $(dtsearchbox).on('keyup',function () {
  //     dTable.search($(this).val()).draw();
  //     if ($(this).val() != "") {
  //         $(dtsearchbtn).hide();
  //         $(dtsearchclr).show();
  //     } else {
  //         $(dtsearchbtn).show();
  //         $(dtsearchclr).hide();
  //     }
  // });
  // $(dtsearchclr).on('click',function () {
  //     $(dtsearchbox).val("");
  //     dTable.search($(this).val()).draw();
  //     $(dtsearchbtn).show();
  //     $(dtsearchclr).hide();
  // });
}
export {
  fnDefectPageInit,
  fnDefectNewPageInit,
  fnDefectDetailPageInit
}
