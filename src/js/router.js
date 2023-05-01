import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import crossroads from 'crossroads';
// import signals from 'signals';
import hasher from 'hasher';
import 'simplebar/dist/simplebar.css';
import { AppName } from '../index';
import { fnXhrErrorAlert } from './commonFunction';
import { fnDashboardPageInit } from './home/dashboard';
// import { fnFacilityPageInit, fnFacilityDetailPageInit } from './facility/facility';

import { fnSettingPageInit, fnUserProfilePageInit } from './setting/setting';
import { fnSettingUserPermissionInit, fnUserPermissionNewPageInit, fnUserPermissionDetailPageInit } from './setting/userPermission';
import { fnSettingAssetPageInit } from './setting/asset';
import { fnLocationSettingPageInit } from './setting/location';
import { fnSystemConfigPageInit } from './setting/systemConfig';
import { fnMasterSettingPageInit } from './setting/master';
import { fnCompanyInfoPageInit } from './setting/companyInfo';
import { fnReportPageInit } from './report/report';
import { fnEmployeeListPageInit, fnEmployeeNewPageInit, fnEmployeeDetailPageInit, fnOpenEmployeeDetail } from './employee/employee';
import { fnLoginInit } from './login/login';
import { fnHelpPageInit } from './support/help';
import { fnUserListPageInit } from './user/users';
import { fnIntentListPageInit,fnNewIntentPageInit } from './intent/intent';
// import {fnUserProfilePageInit} from "./setting/userProfile";

function fnRoutes() {
  crossroads.addRoute('/', function() {
    hasher.setHash('login');
  });
  crossroads.addRoute('login', function() {
    fnLoadLayout('Login', 'login', 'login');
    fnLoadPage('./views/login/login.html', fnLoginInit);
  });
  crossroads.addRoute('login/password', function() {
    fnLoadLayout('Login', 'login', 'login');
    fnLoadPage('./views/login/login.html', fnLoginInit, ['password']);
  });
  crossroads.addRoute('dashboard', function () {
    fnLoadLayout('Dashboard', 'dashboard');
    fnLoadPage('./views/home/dashboard.html', fnDashboardPageInit);
  }); 
  
  crossroads.addRoute('intent/new', function () {
    fnLoadLayout('New Intent', 'Intent');
    fnLoadPage('./views/intent/intentNew.html', fnNewIntentPageInit);
  });
  
  crossroads.addRoute('intent/list', function () {
    fnLoadLayout('Intent List', 'Intent');
    fnLoadPage('./views/intent/intentList.html', fnIntentListPageInit);
  });
  
    crossroads.addRoute('employee/new', function () {
    fnLoadLayout('New employee', 'employee');
    fnLoadPage('./views/employee/employeeNew.html', fnNewIntentPageInit);
  });
  crossroads.addRoute('employee/edit/{id}', function (id) {
    fnLoadLayout('Edit employee', 'employee');
    fnLoadPage('./views/employee/employeeNew.html', fnEmployeeNewPageInit, [id]);
  });
  crossroads.addRoute('employee/list', function () {
    fnLoadLayout('Employee', 'employee');
    const listLoadFlg = $('#hidEmpListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/employee/employeeList.html', fnEmployeeListPageInit);
    } else {
      fnEmployeeListPageInit()
    }
  });

  
    crossroads.addRoute('user/list', function () {
      fnLoadLayout('User Maintenance', 'users');
      fnLoadPage('./views/user/userList.html', fnUserListPageInit);
    
  });

  crossroads.addRoute('employee/detail/{id}', function (id) {
    fnLoadLayout('Employee Detail', 'employee');
    const listLoadFlg = $('#hidEmpListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenEmployeeDetail(id);
    } else {
      fnLoadPage('./views/employee/employeeList.html', fnEmployeeDetailPageInit, [id]);
    }
  });
  crossroads.addRoute('asset/new', function () {
    fnLoadLayout('New Asset', 'asset');
    fnLoadPage('./views/asset/assetNew.html', fnAssetNewPageInit);
  });
  crossroads.addRoute('asset/edit/{id}', function (id) {
    fnLoadLayout('Edit Asset', 'asset');
    fnLoadPage('./views/asset/assetNew.html', fnAssetNewPageInit, [id]);
  });
  crossroads.addRoute('asset/list', function () {
    fnLoadLayout('Asset', 'asset');
    const listLoadFlg = $('#hidASListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/asset/assetList.html', fnAssetListPageInit);
    } else {
      fnAssetListPageInit()
    }
  });
  crossroads.addRoute('asset/detail/{id}', function (id) {
    fnLoadLayout('Asset Detail', 'asset');
    const listLoadFlg = $('#hidASListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenAssetDetailPage(id);
    } else {
      fnLoadPage('./views/asset/assetList.html', fnAssetDetailPageInit, [id]);
    }
  });
  crossroads.addRoute('workOrder/new', function () {
    fnLoadLayout('New Work Order', 'workorder');
    fnLoadPage('./views/workOrder/workOrderNew.html', fnWorkOrderNewPageInit);
  });
  crossroads.addRoute('workOrder/edit/{id}', function (id) {
    fnLoadLayout('Edit Work Order', 'workorder');
    fnLoadPage('./views/workOrder/workOrderNew.html', fnWorkOrderEditPageInit, [id]);
  });
  crossroads.addRoute('workOrder/list', function () {
    fnLoadLayout('Work Order', 'workorder');
    const listLoadFlg = $('#hidWOListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/workOrder/workOrderList.html', fnWorkOrderPageInit);
    } else {
      fnWorkOrderPageInit()
    }
  });
  crossroads.addRoute('workOrder/detail/{id}', function (id) {
    fnLoadLayout('Work Order Detail', 'workorder');
    const listLoadFlg = $('#hidWOListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenWorkOrderDetail(id);
    } else {
      fnLoadPage('./views/workOrder/workOrderList.html', fnWorkOrderDetailPageInit, [id]);
    }
  });
  crossroads.addRoute('workOrder/request', function () {
    fnLoadLayout('Request Order', 'workorderreq');
    const listLoadFlg = $('#hidListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/workOrder/requestOrder.html', fnReqOrderPageInit);
    } else {
      fnReqOrderPageInit()
    }
  });
  crossroads.addRoute('workOrder/request/detail/{id}', function (id) {
    fnLoadLayout('Request Order', 'workorderreq');
    const listLoadFlg = $('#hidListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenRequestDetail(id);
    } else {
      fnLoadPage('./views/workOrder/requestOrder.html', RequestOrderDetailInit, [id]);
    }
  });
  crossroads.addRoute('workOrder/schedule', function () {
    fnLoadLayout('Scheduled Order', 'schedule');
    const listLoadFlg = $('#hidSchListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/workOrder/scheduleOrderList.html', fnScheduleOrderPageInit);
    } else {
      fnScheduleOrderPageInit()
    }
  });
  crossroads.addRoute('workOrder/schedule/new', function () {
    fnLoadLayout('New Scheduled', 'schedule');
    fnLoadPage('./views/workOrder/scheduleOrderNew.html', fnNewScheduleOrderPageInit);
  });
  crossroads.addRoute('workOrder/schedule/edit/{id}', function (id) {
    fnLoadLayout('Edit Scheduled', 'schedule');
    fnLoadPage('./views/workOrder/scheduleOrderNew.html', fnNewScheduleOrderPageInit, [id]);
  });
  crossroads.addRoute('workOrder/schedule/detail/{id}', function (id) {
    fnLoadLayout('Scheduled Detail', 'schedule');
    const listLoadFlg = $('#hidSchListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenSchedulerDetailPage(id);
    } else {
      fnLoadPage('./views/workOrder/scheduleOrderList.html', fnDetailScheduleOrderPageInit, [id]);
    }
  });
  crossroads.addRoute('inventory/list', function () {
    fnLoadLayout('Inventory', 'inventory');
    fnLoadPage('./views/inventory/inventory.html', fnInventoryPageInit);
  });
  crossroads.addRoute('inventory/new', function () {
    fnLoadLayout('New Inventory', 'inventory');
    fnLoadPage('./views/inventory/newInventoryAssign.html', fnNewInventoryPageInit);
  });
  crossroads.addRoute('inventory/stock', function () {
    fnLoadLayout('Inventory Stock', 'inventory');
    fnLoadPage('./views/inventory/inventoryStock.html', fnInventoryStockPageInit);
  });
  crossroads.addRoute('license/new', function () {
    fnLoadLayout('New License', 'license');
    fnLoadPage('./views/license/licenseNew.html', fnNewLicensePageInit);
  });
  crossroads.addRoute('license/edit/{id}', function (id) {
    fnLoadLayout('Edit License', 'license');
    fnLoadPage('./views/license/licenseNew.html', fnNewLicensePageInit, [id]);
  });
  crossroads.addRoute('license/list', function () {
    fnLoadLayout('License', 'license');
    const listLoadFlg = $('#hidLCListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/license/licenseList.html', fnLicensePageInit);
    } else {
      fnLicensePageInit()
    }
  });
  crossroads.addRoute('license/detail/{id}', function (id) {
    fnLoadLayout('License Detail', 'license');
    const listLoadFlg = $('#hidLCListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenLicenseDetailPage(id);
    } else {
      fnLoadPage('./views/license/licenseList.html', fnLicenseDetailPageInit, [id]);
    }
  });
  crossroads.addRoute('fileManager', function () {
    fnLoadLayout('File Manager', 'filemanager');
    fnLoadPage('./views/fileManager/fileManager.html', fnFileManagerPageInit);
  });
  crossroads.addRoute('report', function () {
    fnLoadLayout('Reports', 'report');
    fnLoadPage('./views/report/report.html', fnReportPageInit);
  });
  crossroads.addRoute('setting/companyInfo', function () {
    fnLoadLayout('Settings-Company Info', 'setting');
    fnLoadPage('./views/setting/companyInfo.html', fnCompanyInfoPageInit);
  });
  crossroads.addRoute('setting/systemConfig', function () {
    fnLoadLayout('Settings-System Config', 'setting');
    fnLoadPage('./views/setting/systemConfig.html', fnSystemConfigPageInit);
  });
  crossroads.addRoute('setting/location', function () {
    fnLoadLayout('Settings-Location', 'setting');
    fnLoadPage('./views/setting/location.html', fnLocationSettingPageInit);
  });
  crossroads.addRoute('setting/asset', function () {
    fnLoadLayout('Settings-Asset', 'setting');
    fnLoadPage('./views/setting/asset.html', fnSettingAssetPageInit);
  });
  crossroads.addRoute('setting/inventory', function () {
    fnLoadLayout('Settings-Inventory', 'setting');
    fnLoadPage('./views/setting/inventory.html', fnSettingPageInit, ['inventory']);
  });
  crossroads.addRoute('setting/reportConfig', function () {
    fnLoadLayout('Settings-Report Config', 'setting');
    fnLoadPage('./views/setting/reportConfig.html', fnSettingPageInit);
  });
  crossroads.addRoute('setting/log', function () {
    fnLoadLayout('Settings-Log', 'setting');
    fnLoadPage('./views/setting/log.html', fnSettingPageInit, ['log']);
  });
  crossroads.addRoute('setting/master', function () {
    fnLoadLayout('Settings-Master', 'setting');
    fnLoadPage('./views/setting/master.html', fnMasterSettingPageInit);
  });
  crossroads.addRoute('setting/userpermission', function () {
    fnLoadLayout('User Permission', 'userpermission');
    fnLoadPage('./views/setting/userPermission.html', fnSettingUserPermissionInit, ['list']);
  });
  crossroads.addRoute('setting/userpermission/new', function () {
    fnLoadLayout('New User Permission', 'userpermission');
    fnLoadPage('./views/setting/userPermission.html', fnUserPermissionNewPageInit, ['new']);
  });
  crossroads.addRoute('setting/userpermission/detail/{id}', function (id) {
    fnLoadLayout('User Permission Detail', 'userpermission');
    fnLoadPage('./views/setting/userPermission.html', fnUserPermissionDetailPageInit, ['detail', id]);
  });
  crossroads.addRoute('help/ticket/new', function () {
    fnLoadLayout('New Ticket', 'ticket');
    fnLoadPage('./views/support/ticketNew.html', TicketNewPageInit, ['new']);
  });
  crossroads.addRoute('help/ticket/edit/{id}', function (id) {
    fnLoadLayout('Edit Ticket', 'ticket');
    fnLoadPage('./views/support/ticketNew.html', TicketNewPageInit, ['edit', id]);
  });
  crossroads.addRoute('help/ticket/list', function () {
    fnLoadLayout('Support Ticket', 'ticket');
    const listLoadFlg = $('#hidTicListPageLoadFlg').val();
    if (listLoadFlg !== 'yes') {
      fnLoadPage('./views/home/ticketList.html', TicketListPageInit);
    } else {
      TicketListPageInit()
    }
  });
  crossroads.addRoute('help/ticket/detail/{id}', function (id) {
    fnLoadLayout('Ticket Detail', 'ticket');
    const listLoadFlg = $('#hidTicListPageLoadFlg').val();
    if (listLoadFlg === 'yes') {
      fnOpenTicketPageDetail(id);
    } else {
      fnLoadPage('./views/support/ticketList.html', TicketDetailPageInit, [id]);
    }
  });
  // crossroads.addRoute('setting/userProfile', function () {
  //   fnLoadLayout('userProfile', 'userProfile');
  //   fnLoadPage('./views/setting/userProfile.html', fnUserProfilePageInit);
  // });
  // crossroads.addRoute('setting/user/new', function () {
  //   fnLoadLayout('New Employee', 'setting');
  //   fnLoadPage('./views/setting/newEmployee.html', fnSettingNewEmployeePageInit);
  // });
  // crossroads.addRoute('setting/user/edit/{id}', function (id) {
  //   fnLoadLayout('Edit Employee', 'setting');
  //   fnLoadPage('./views/setting/newEmployee.html', fnSettingNewEmployeePageInit, [id]);
  // });
  crossroads.addRoute('help', function(id) {
    fnLoadLayout('Help');
    fnLoadPage('./views/support/help.html', fnHelpPageInit);
  });

  crossroads.addRoute('userProfile', function () {
    fnLoadLayout('Profile');
    fnLoadPage('./views/setting/userProfile.html', fnUserProfilePageInit);
  });

  hasher.initialized.add(parseHash);
  hasher.changed.add(parseHash);
  hasher.init();
}

// setup hasher
function parseHash(newHash, oldHash) {
  crossroads.parse(newHash);
}

function fnLoadPage(pageurl, callback, params) {
  $.get(pageurl, function(pagehtml) {
    const $response = $('<div />').html(pagehtml);
    const $bodyContent = $response.find('#BodyContent').html();
    const $modalContent = $response.find('#ModalContent').html();
    $('#BodyRender').html($bodyContent);
    $('#ModalRender').html($modalContent);
    setTimeout(function() {
      menuActive();
    }, 300);
  }).done(function() {
    callback.apply(this, params);
  }).fail(function(e) {
    fnXhrErrorAlert(e.status);
  });
}

function fnLoadLayout(pagetitle, activemenu, layouttype) {
  document.title = pagetitle + ' - ' + AppName;
  // $.get('./views/layout/modal.html', function(pagehtml) {
  //   $('#CommanModalRender').html(pagehtml);
  // });
  // $.get('./views/layout/header.html', function(pagehtml) {
  //   $('#HeaderWrap').html(pagehtml);
  // });
  // $.get('./views/layout/sidebar.html', function(pagehtml) {
  //   $('#SidebarWrap').html(pagehtml);
  // }).done(function() {
  // });
  // const modallength = $('.modal.show').length;
  // modallength.forEach(function(element) {
  //   console.log(element)
  // });

  for (let i = 0; $('.modal.show').length > i; i++) {
    const modalel = $('.modal.show:eq(' + i + ')').prop('id');
    const allmodals = bootstrap.Modal.getOrCreateInstance('#' + modalel);
    allmodals.hide();
  }

  // console.log(layouttype);
  if (layouttype === 'login') {
    $('body').addClass('nolayout');
  } else {
    $('body').removeClass('nolayout');
    $('.headerWrap, .sidebarWrap').removeClass('d-none');
    // const employeeDetail = localStorage.getItem('employeeDetail');
    // // console.log(employeeDetail);
    // if (employeeDetail !== '' && employeeDetail !== null && employeeDetail !== 'null') {
    //   const EmployeeDetailJson = JSON.parse(employeeDetail);
    //   $('.userNameText').html(EmployeeDetailJson.EmployeeName);
    // }

    $('.pageTitle').html(pagetitle);
      $('.main-nav .list-group-item').removeClass('active');
      $('.main-nav .list-group-item.menu-' + activemenu).addClass('active');
  }
}

function menuActive() {
  const hash = hasher.getHash()
  // console.log(hasher.getHash())
  // console.log($('.mainMenu .nav-link').length)
  $('.mainMenu .nav-link').removeClass('active');
  $('.mainMenu .accordion-item').removeClass('active');
  $('.mainMenu .accordion-collapse.collapse').removeClass('show');
  $('.mainMenu .accordion-button').addClass('collapsed');
  for (let i = 0; i <= $('.mainMenu .nav-link').length; i++) {
    const menuhash = $('.mainMenu .nav-link:eq(' + i + ')').data('url');
    if (menuhash === hash) {
      // console.log(menuhash);
      // console.log(hash);
      $('.mainMenu .nav-link:eq(' + i + ')').addClass('active');
      $('.mainMenu .nav-link:eq(' + i + ')').parent().closest('.accordion-item').addClass('active');
      $('.mainMenu .nav-link:eq(' + i + ')').parent().closest('.accordion-collapse.collapse').addClass('show');
      $('.mainMenu .nav-link:eq(' + i + ')').parent().closest('.accordion-collapse.collapse').siblings('.accordion-header').children('.accordion-button').removeClass('collapsed');
    }
  }

  for (let i = 0; i < $('.mainMenu .nav-link').length; i++) {
    if ($('.mainMenu .nav-link:eq(' + i + ')').hasClass('active')) {
      document.querySelector('.simplebar-content-wrapper').scrollTo(0, (66 * i) + 66);
    }
  }
}

// function fnRefreshPage() {
//    var url = window.location.toString();
//    var cur_url = url.substring(url.indexOf('#') + 2, url.length);
//    hasher.setHash("Redirect");
//    hasher.setHash(cur_url);
// }

export {
  fnRoutes
}
