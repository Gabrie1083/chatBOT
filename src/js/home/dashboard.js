// import hasher from 'hasher'
import $ from 'jquery'
// import * as bootstrap from 'bootstrap'
// import TomSelect from "tom-select";
// import Swal from 'sweetalert2'
import { ApiUrl } from '../../index';
import { fnLoadCompanyData } from '../login/login';
import { fnXhrErrorAlert, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';
import { fnLoadNotificationCount } from '../commonApi';
import Highcharts from 'highcharts'

function fnDashboardPageInit () {
  // var start = moment().subtract(29, 'days');
  // var end = moment();

  // function cb(start, end) {
  //     $('#txtOrderFilterDateRange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  // }

  // $('#txtOrderFilterDateRange').daterangepicker({
  //   alwaysShowCalendars:true,
  //     startDate: start,
  //     endDate: end,
  //     ranges: {
  //        'Today': [moment(), moment()],
  //        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //        'This Month': [moment().startOf('month'), moment().endOf('month')],
  //        'This Year': [moment().startOf('year'), moment().endOf('year')],
  //        'Last Year': [moment().startOf('year'), moment().endOf('year')],
  //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  //     }
  // }, cb);
  // cb(start, end);

  // let menu = localStorage.getItem('menuList');
//  fnLoadCompanyData();
//  fnLoadNotificationCount();
//  fnLoadDashboardCharts();
  // setTimeout(function() {
  //   fnLoadNotificationCount();
  // }, 60000)
}

function fnLoadDashboardCharts () {
  const headertoken = localStorage.getItem('token')

  const payload = {
    startdate: '',
    enddate: ''
  }
  $.ajax({
    type: 'GET',
    cache: false,
    data: payload,
    headers: {
      Authorization: 'Bearer ' + headertoken
    },
    url: ApiUrl + 'web/v1/dashboard/LoadHomeDashboard',
    contentType: 'application/json; charset=utf-8',
    timeout: 60000,
    crossDomain: true,
    success: function (response) {
      // console.log(response)
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const jsondata = response.Data

          if (jsondata.result === 1) {
            // const result_data = json_data.result
            $('#OpenWorkOrderCount').html(jsondata.Work_order_open_Count)
            $('#ScheduleMaintenanceMonhtly').html(jsondata.Schedule_order_Count)

            $('#PendingRequestOrder').html(jsondata.Request_order_Count[0])
            $('#CriticalRequestOrder').html(jsondata.Request_order_Count[1])
            $('#HighRequestOrder').html(jsondata.Request_order_Count[2])

            $('#TotalAssets').html(jsondata.total_asset_count)
            $('#TotalLicense').html(jsondata.total_license_count)
            $('#TotalTenant').html(jsondata.total_tenant_count)
            $('#TotalInventory').html(jsondata.total_inventory_count)

            const piedata = []
            const piechartdata = jsondata.work_order_group_pie_chart
            if (piechartdata.length > 0) {
              for (let index = 0; index < piechartdata.length; index++) {
                piedata.push({
                  name: piechartdata[index].GroupName, // your artist variable
                  y: piechartdata[index].WorkOrderCount // your title variable})
                })
              }
            }

            Highcharts.chart('piechartcontainer', {
              chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
              },
              title: {
                text: ''
              },
              // tooltip: {
              //   pointFormat: '{series.name}: {point.y}'
              // },
              tooltip: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              exporting: {
                enabled: false
              },
              legend: {
                labelFormatter: function () {
                  return this.name + ' <span style="color:' + this.color + '">(' + this.y + ')</span>';
                }
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                    enabled: true,
                    format: '{point.y}',
                    style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    distance: -30,
                    color: 'white'
                  },
                  showInLegend: true
                }
              },
              series: [

                {
                  name: 'Work Order By Group',
                  colorByPoint: true,
                  animation: false,
                  data: piedata
                }

              ]
            })

            const last10dayslinedata = [];
            const last10daysdata = jsondata.last_10days_request_order_line_chart

            // var stringify = JSON.parse(last_10days_data);
            // console.log(stringify+'str');
            // for (var i = 0; i < stringify.length; i++) {
            //   console.log(stringify[i]);
            //   }

            // let row_string = ''
            for (const key in last10daysdata) {
              // console.log(key);
              // console.log(last_10days_data[key]);

              if (key !== 'CategoryName') {
                // row_string+=eval(last_10days_data[key]);
                // rowstring += key[0] + ','
                last10dayslinedata.push(last10daysdata[key])
                // row_string+=key[1]+",";
                // row_string+=last_10days_data[key];
                // row_string+=key[2];
                // row_string+=key[3];
                // row_string+=key[4];
                // row_string+=key[5];
              }
            }
            // console.log(last_10days_line_data+"row_string");

            // const values = last10daysdata
            // for (let i = 0; i < values.length; i++) {
            //   // console.log(values[i]+'values');
            // }
            const ReqDate = [];
            const Incident = [];
            const Fault = [];
            const Feedback = [];
            const Complaint = [];
            if (last10daysdata.length > 0) {
              ReqDate[9] = last10daysdata[0].reqday;
              ReqDate[8] = last10daysdata[1].reqday;
              ReqDate[7] = last10daysdata[2].reqday;
              ReqDate[6] = last10daysdata[3].reqday;
              ReqDate[5] = last10daysdata[4].reqday;
              ReqDate[4] = last10daysdata[5].reqday;
              ReqDate[3] = last10daysdata[6].reqday;
              ReqDate[2] = last10daysdata[7].reqday;
              ReqDate[1] = last10daysdata[8].reqday;
              ReqDate[0] = last10daysdata[9].reqday;

              Incident[9] = last10daysdata[0].incidentcnt;
              Incident[8] = last10daysdata[1].incidentcnt;
              Incident[7] = last10daysdata[2].incidentcnt;
              Incident[6] = last10daysdata[3].incidentcnt;
              Incident[5] = last10daysdata[4].incidentcnt;
              Incident[4] = last10daysdata[5].incidentcnt;
              Incident[3] = last10daysdata[6].incidentcnt;
              Incident[2] = last10daysdata[7].incidentcnt;
              Incident[1] = last10daysdata[8].incidentcnt;
              Incident[0] = last10daysdata[9].incidentcnt;

              Fault[9] = last10daysdata[0].faultcnt;
              Fault[8] = last10daysdata[1].faultcnt;
              Fault[7] = last10daysdata[2].faultcnt;
              Fault[6] = last10daysdata[3].faultcnt;
              Fault[5] = last10daysdata[4].faultcnt;
              Fault[4] = last10daysdata[5].faultcnt;
              Fault[3] = last10daysdata[6].faultcnt;
              Fault[2] = last10daysdata[7].faultcnt;
              Fault[1] = last10daysdata[8].faultcnt;
              Fault[0] = last10daysdata[9].faultcnt;

              Feedback[9] = last10daysdata[0].feedbackcnt;
              Feedback[8] = last10daysdata[1].feedbackcnt;
              Feedback[7] = last10daysdata[2].feedbackcnt;
              Feedback[6] = last10daysdata[3].feedbackcnt;
              Feedback[5] = last10daysdata[4].feedbackcnt;
              Feedback[4] = last10daysdata[5].feedbackcnt;
              Feedback[3] = last10daysdata[6].feedbackcnt;
              Feedback[2] = last10daysdata[7].feedbackcnt;
              Feedback[1] = last10daysdata[8].feedbackcnt;
              Feedback[0] = last10daysdata[9].feedbackcnt;

              Complaint[9] = last10daysdata[0].complaintcnt;
              Complaint[8] = last10daysdata[1].complaintcnt;
              Complaint[7] = last10daysdata[2].complaintcnt;
              Complaint[6] = last10daysdata[3].complaintcnt;
              Complaint[5] = last10daysdata[4].complaintcnt;
              Complaint[4] = last10daysdata[5].complaintcnt;
              Complaint[3] = last10daysdata[6].complaintcnt;
              Complaint[2] = last10daysdata[7].complaintcnt;
              Complaint[1] = last10daysdata[8].complaintcnt;
              Complaint[0] = last10daysdata[9].complaintcnt;
            }

            Highcharts.chart('linechartcontainer', {
              chart:
              {
                type: 'line',
                height: 200
              },

              title: {
                text: ''
              },

              subtitle: {
                text: ''
              },

              xAxis:
              {
                categories: ReqDate,
                crosshair: true
              },

              yAxis:
              {
                min: 0,
                tickInterval: 10,
                title:
                  {
                    text: 'Request Order'
                  }
              },
              tooltip:
              {
                formatter: function () {
                  return this.series.name + '<br/><b> ' + this.point.y + '</b>';
                }
              },
              plotOptions:
              {
                line:
                  {
                    pointPadding: 0,
                    borderWidth: 0,
                    dataLabels:
                      {
                        enabled: true,
                        format: '{point.y}'
                      },
                    enableMouseTracking: false
                  }
              },

              series: [{
                name: 'Incident',
                data: Incident
              }, {
                name: 'Fault',
                data: Fault
              }, {
                name: 'Feedback',
                data: Feedback
              }, {
                name: 'Complaint',
                data: Complaint
              }],

              responsive: {
                rules: [{
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                    }
                  }
                }]
              }

            })
          }
        } else {
          fnApiStatusFail(response.Message, '', 'error')
        }
      } else {
        fnEmpStatusFail('', '')
      }
    },
    error: function (xhr) {
      // console.log(xhr);
      fnXhrErrorAlert(xhr)
    }
  })

  // Highcharts.chart('linechartcontainer', {

  //     title: {
  //       text: ''
  //     },

  //     subtitle: {
  //       text: ''
  //     },

  //     yAxis: {
  //       title: {
  //         text: 'Number of Request'
  //       }
  //     },

  //     xAxis: {
  //       title: {
  //         text: 'Date'
  //       },
  //       accessibility: {
  //         rangeDescription: 'Range: 25 Jan 2022 to 4 Feb 2022'
  //       }
  //     },

  //     // legend: {
  //     //   layout: 'vertical',
  //     //   align: 'right',
  //     //   verticalAlign: 'middle'
  //     // },

  //     plotOptions: {
  //       series: {
  //         label: {
  //           connectorAllowed: false
  //         },
  //         pointStart: 10
  //       }
  //     },

  //     series: [{
  //       name: 'Machanical',
  //       data: [10,20,15, 25, 30, 12, 16, 20,22,17]
  //     }, {
  //       name: 'Electrical',
  //       data: [22,60,45, 85, 90, 85, 85, 30,66,100]
  //     }, {
  //       name: 'Maintenance',
  //       data: [21,10,12, 14, 10, 9, 20, 16,18,16]
  //     },  ],

  //     responsive: {
  //       rules: [{
  //         condition: {
  //           maxWidth: 500
  //         },
  //         chartOptions: {
  //           legend: {
  //             layout: 'horizontal',
  //             align: 'center',
  //             verticalAlign: 'bottom'
  //           }
  //         }
  //       }]
  //     }

  //   });

  // Highcharts.chart('columnchartcontainer1', {
  //   chart: {
  //     type: 'column'
  //   },
  //   title: {
  //     text: ''
  //   },
  //   subtitle: {
  //     text: ''
  //   },
  //   xAxis: {
  //     title: {
  //       text: 'Hotels'
  //     },
  //     labels:{
  //       enabled:false//default is true
  //   },
  //     crosshair: true
  //   },
  //   yAxis: {
  //     //min: 0,
  //     title: {
  //       text: 'No of Request'
  //     }
  //   },
  //   tooltip: {
  //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //       '<td style="padding:0"><b>{point.y}</b></td></tr>',
  //     footerFormat: '</table>',
  //     shared: true,
  //     useHTML: true
  //   },
  //   plotOptions: {
  //     column: {
  //       pointPadding: 0.2,
  //       borderWidth: 0,
  //       dataLabels: {
  //         enabled: true
  //       },
  //     },

  //   },

  //   series: [{
  //     name: 'Beach Villas',
  //     data: [200]

  //   }, {
  //     name: 'Crockfords Tower',
  //     data: [185]

  //   }, {
  //     name: 'Equarius Hotel',
  //     data: [140]

  //   }, {
  //     name: 'Festive Hotel',
  //     data: [120]

  //   }, {
  //     name: 'Hard Rock',
  //     data: [110]

  //   }, {
  //     name: 'Hotel Michael',
  //     data: [90]

  //   }, {
  //     name: 'Ocean Suites',
  //     data: [50]

  //   }]
  // });

  // Highcharts.chart('columnchartcontainer', {
  //   chart: {
  //     type: 'column'
  //   },
  //   title: {
  //     text: ''
  //   },
  //   subtitle: {
  //     text: ''
  //   },
  //   xAxis: {
  //     labels:{
  //       enabled:false//default is true
  //   },
  //     title: {
  //       text: 'Request Type'
  //     },
  //     // categories: [
  //     //   'Jan',
  //     //   'Feb',
  //     //   'Mar',
  //     //   'Apr',
  //     //   'May',
  //     //   'Jun',
  //     //   'Jul',
  //     //   'Aug',
  //     //   'Sep',
  //     //   'Oct',
  //     //   'Nov',
  //     //   'Dec'
  //     // ],
  //     crosshair: true
  //   },
  //   yAxis: {
  //     min: 0,
  //     title: {
  //       text: 'No of Request'
  //     }
  //   },
  //   tooltip: {
  //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //       '<td style="padding:0"><b>{point.y}</b></td></tr>',
  //     footerFormat: '</table>',
  //     shared: true,
  //     useHTML: true
  //   },
  //   plotOptions: {
  //     column: {
  //       pointPadding: 0.2,
  //       borderWidth: 0
  //     }
  //   },
  //   series: [{
  //     name: 'Dining',
  //     data: [200]

  //   }, {
  //     name: 'Room Service',
  //     data: [185]

  //   }, {
  //     name: 'Coffee',
  //     data: [140]

  //   }, {
  //     name: 'Tea',
  //     data: [120]

  //   }, {
  //     name: 'Swimming Pool',
  //     data: [110]

  //   }, {
  //     name: 'Extra Bed',
  //     data: [90]

  //   }, {
  //     name: 'Bottled Water',
  //     data: [50]

  //   }, {
  //     name: 'Kids Club',
  //     data: [30]

  //   }]
  // });

  // Build the chart
}

export {
  fnDashboardPageInit
}
