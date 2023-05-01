// import '@popper/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-pro/css/all.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import 'tom-select/dist/css/tom-select.bootstrap5.min.css';
import 'daterangepicker/daterangepicker.css';
import 'sweetalert2/dist/sweetalert2.css';
import '@ztree/ztree_v3/css/metroStyle/metroStyle.css';
import 'dropzone/dist/dropzone.css';
import './css/custom-fw.css';
import './css/app.css';
import './css/media-tablet-land.css';
import './css/media-tablet.css';
import './css/media-phone.css';
import $ from 'jquery';
import hasher from 'hasher';
import SimpleBar from 'simplebar';
import * as bootstrap from 'bootstrap';
import 'daterangepicker';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import '@ztree/ztree_v3/js/jquery.ztree.core';
import '@ztree/ztree_v3/js/jquery.ztree.excheck';
import { fnRoutes } from './js/router';
import { fnLoadNotificationCount, fnLoadNotificationData } from './js/commonApi';
import { fnLogout, fnLoadUserData, fnUserProfile, fnLoadCompanyData } from './js/login/login';

const AppName = 'Chatbot';
const AppVersion = '1.4.3';
const ApiUrl = 'https://cmmsapi.spluz.app/';
const ReportUrl = 'https://cmmsreport.spluz.app/';
// const ApiUrl = 'http://localhost/cmmsapi/';
// const ReportUrl = 'http://localhost/cmmsreport/';
// const token = localStorage.getItem('token');
// localStorage.setItem('ApiUrl', ApiUrl);
// localStorage.setItem('ReportUrl', ReportUrl);

fnRoutes();

$(function() {
  // console.log(token);
  // const hash = window.location.hash.slice(1);
  // if (token === null || token === 'null' || token === '' || token === undefined || token === 'undefined') {
  //   if (hash === 'login/password' || hash === '/login/password') {
  //     hasher.setHash('login/password');
  //   } else {
  //     hasher.setHash('login');
  //   }
  // } else {
     fnLoadMainMenu();
     fnLoadCompanyData();
  //}

  const NotifyOffcanvas = document.getElementById('NotifyOffcanvas')
  // NotifyOffcanvas.addEventListener('show.bs.offcanvas', event => {
  //   fnLoadNotificationData();
  // });
  $('.btnLogout').on('click', function() {
    return fnLogout('Logout');
  });
  $('.btnLoginUserData').on('click', function() {
    return fnLoadUserData();
  });
  $('.btnProfile').on('click', function() {
    return fnUserProfile();
  });
  $('.fnOpenSupportTicket').on('click', function() {
    hasher.setHash('help/ticket/list');
  });
  //fnLoadNotificationCount();
  setInterval(function() {
    //fnLoadNotificationCount();
  }, 60000)
  new SimpleBar($('.pageScrollWrap')[0]);
  new SimpleBar($('.sidebarScrollWrap')[0]);
});

function fnLoadMainMenu() {
  $('.mainMenu').html('');
  //const menulist = JSON.parse(localStorage.getItem('menuList'));
  const menulist =[
    {
    "id": "3714c1f8-b892-4b48-9fb0-9295ec8179ed",
    "menu_title": "Home",
    "menu_header": "",
    "isparent": true,
    "parentid": "de36238e-2af8-493f-97d3-dff0e35ddfd5",
    "pageurl": "#",
    "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
    "iconname": null,
    "alttext": null,
    "sortid": 1,
    "menu_level": 1,
    "deleted": false,
    "empname": null
    },
    {
      "id": "3714c1f8-b892-4b48-9fb0-11111",
      "menu_title": "User Maintenance",
      "menu_header": "",
      "isparent": true,
      "parentid": "de36238e-2af8-493f-97d3-dff0e35ddfd5",
      "pageurl": "#",
      "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
      "iconname": null,
      "alttext": null,
      "sortid": 1,
      "menu_level": 1,
      "deleted": false,
      "empname": null
      },
     
        {
          "id": "3714c1f8-b892-4b48-9fb0-11111-2",
          "menu_title": "Manager Users",
          "menu_header": "",
          "isparent": true,
          "parentid": "3714c1f8-b892-4b48-9fb0-11111",
          "pageurl": "user/list",
          "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
          "iconname": null,
          "alttext": null,
          "sortid": 1,
          "menu_level": 2,
          "deleted": false,
          "empname": null
          },
          {
            "id": "3714c1f8-b892-4b48-9fb0-22222",
            "menu_title": "Chatbot Configuration",
            "menu_header": "",
            "isparent": true,
            "parentid": "de36238e-2af8-493f-97d3-dff0e35ddfd5",
            "pageurl": "#",
            "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
            "iconname": null,
            "alttext": null,
            "sortid": 1,
            "menu_level": 1,
            "deleted": false,
            "empname": null
            },
            {
              "id": "3714c1f8-b892-4b48-9fb0-22222-1",
              "menu_title": "Create Intents",
              "menu_header": "",
              "isparent": true,
              "parentid": "3714c1f8-b892-4b48-9fb0-22222",
              "pageurl": "intent/new",
              "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
              "iconname": null,
              "alttext": null,
              "sortid": 2,
              "menu_level": 2,
              "deleted": false,
              "empname": null
              },
              {
                "id": "3714c1f8-b892-4b48-9fb0-22222-2",
                "menu_title": "Intents List",
                "menu_header": "",
                "isparent": true,
                "parentid": "3714c1f8-b892-4b48-9fb0-22222",
                "pageurl": "intent/list",
                "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
                "iconname": null,
                "alttext": null,
                "sortid": 1,
                "menu_level": 2,
                "deleted": false,
                "empname": null
                },
      
    {
    "id": "28398e09-190e-404c-aa04-37d82352fa67",
    "menu_title": "Dashboard",
    "menu_header": "",
    "isparent": true,
    "parentid": "3714c1f8-b892-4b48-9fb0-9295ec8179ed",
    "pageurl": "dashboard",
    "iconclass": "<i class=\"fa-duotone fa-chart-tree-map\"></i>",
    "iconname": null,
    "alttext": null,
    "sortid": 1,
    "menu_level": 2,
    "deleted": false,
    "empname": null
    },
    {
      "id": "4033f1e0-e9da-4ede-9fd6-a80c62b814bf",
      "menu_title": "Employees",
      "menu_header": "",
      "isparent": true,
      "parentid": "4033f1e0-e9da-4ede-9fd6-a80c62b814bf",
      "pageurl": "#",
      "iconclass": "<i class=\"fa-duotone fa-objects-column\"></i>",
      "iconname": null,
      "alttext": null,
      "sortid": 1,
      "menu_level": 1,
      "deleted": false,
      "empname": null
      },
      {
        "id": "085dc74f-80fd-4c82-a346-3b4af083144c",
        "menu_title": "All Employees",
        "menu_header": "",
        "isparent": true,
        "parentid": "4033f1e0-e9da-4ede-9fd6-a80c62b814bf",
        "pageurl": "employee/list",
        "iconclass": "<i class=\"fa-duotone fa-square-list\"></i>",
        "iconname": null,
        "alttext": null,
        "sortid": 2,
        "menu_level": 2,
        "deleted": false,
        "empname": null
        },
    
    {
      "id": "de54a085-74e4-462e-a551-97bcfa5941fa",
      "menu_title": "New Employee",
      "menu_header": "",
      "isparent": true,
      "parentid": "4033f1e0-e9da-4ede-9fd6-a80c62b814bf",
      "pageurl": "employee/new",
      "iconclass": "<i class=\"fa-duotone fa-objects-column\"></i>",
      "iconname": null,
      "alttext": null,
      "sortid": 1,
      "menu_level": 2,
      "deleted": false,
      "empname": null
      },
    ];
  // console.log(menulist);
  if (menulist !== null) {
    // console.log(menulist);
    const firstlevelmenu = menulist.filter(e => e.menu_level === 1);
    const secondlevelmenu = menulist.filter(e => e.menu_level === 2);
    // const thirdlevelmenu = menulist.filter(e => e.menu_level === 3);
    // console.log(firstlevelmenu);
    // console.log(secondlevelmenu);
    // console.log(thirdlevelmenu);

    for (let i = 0; i < firstlevelmenu.length; i++) {
      const menuhtml = `<div class="accordion-item">
        <div class="accordion-header" id="DmainMenuHead${firstlevelmenu[i].id}">
          <button class="accordion-button collapsed" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#DmainMenuFLItem${firstlevelmenu[i].id}" data-pageurl="#">
          ${firstlevelmenu[i].iconclass} <span class="text">${firstlevelmenu[i].menu_title}</span>
          </button>
        </div>
        <div class="accordion-collapse collapse" id="DmainMenuFLItem${firstlevelmenu[i].id}" data-bs-parent="#DesktopMainMenu">
          <div class="accordion-body">
          </div>
        </div>
    </div>`;
      $('#DesktopMainMenu').append(menuhtml);
    }

    for (let i = 0; i < secondlevelmenu.length; i++) {
      const outermenuhtml = `<div class="accordion-inner-body" id="DmainMenuSLItem${secondlevelmenu[i].parentid}"><ul class="nav"></ul></div>`;
      //
      if ($(`#DmainMenuFLItem${secondlevelmenu[i].parentid} .accordion-body`).children().length === 0) {
        $(`#DmainMenuFLItem${secondlevelmenu[i].parentid} .accordion-body`).append(outermenuhtml);
      }
    }

    for (let i = 0; i < secondlevelmenu.length; i++) {
      const menuhtml = `
          <li class="nav-item" id="mainMenuTLItem${secondlevelmenu[i].id}" role="presentation">
            <a class="nav-link" data-url="${secondlevelmenu[i].pageurl}" href="#${secondlevelmenu[i].pageurl}">${secondlevelmenu[i].iconclass} ${secondlevelmenu[i].menu_title}</a>
          </li>`;
      $(`#DmainMenuSLItem${secondlevelmenu[i].parentid} .nav`).append(menuhtml);
    }

    for (let i = 0; i < firstlevelmenu.length; i++) {
      const menuhtml = `<div class="accordion-item">
        <div class="accordion-header" id="MmainMenuHead${firstlevelmenu[i].id}">
          <button class="accordion-button collapsed" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#MmainMenuFLItem${firstlevelmenu[i].id}" data-pageurl="#">
          ${firstlevelmenu[i].iconclass} <span class="text">${firstlevelmenu[i].menu_title}</span>
          </button>
        </div>
        <div class="accordion-collapse collapse" id="MmainMenuFLItem${firstlevelmenu[i].id}" data-bs-parent="#MobileMainMenu">
          <div class="accordion-body">
          </div>
        </div>
    </div>`;
      $('#MobileMainMenu').append(menuhtml);
    }

    for (let i = 0; i < secondlevelmenu.length; i++) {
      const outermenuhtml = `<div class="accordion-inner-body" id="MmainMenuSLItem${secondlevelmenu[i].parentid}"><ul class="nav"></ul></div>`;
      //
      if ($(`#MmainMenuFLItem${secondlevelmenu[i].parentid} .accordion-body`).children().length === 0) {
        $(`#MmainMenuFLItem${secondlevelmenu[i].parentid} .accordion-body`).append(outermenuhtml);
      }
    }

    for (let i = 0; i < secondlevelmenu.length; i++) {
      const menuhtml = `
          <li class="nav-item" id="MmainMenuTLItem${secondlevelmenu[i].id}" role="presentation">
            <a class="nav-link mobilemenuitem" data-url="${secondlevelmenu[i].pageurl}" >${secondlevelmenu[i].iconclass} ${secondlevelmenu[i].menu_title}</a>
          </li>`;
      $(`#MmainMenuSLItem${secondlevelmenu[i].parentid} .nav`).append(menuhtml);
    }

    $('.mobilemenuitem').on('click', function(el) {
      const url = $(this).data('url');
      hasher.setHash('#' + url);

      const menuoffcanvas = bootstrap.Offcanvas.getOrCreateInstance('#MobileMenuOffcanvas');
      menuoffcanvas.hide();
    })
  }
}

export {
  AppName,
  AppVersion,
  ApiUrl,
  ReportUrl,
  fnLoadMainMenu
}
