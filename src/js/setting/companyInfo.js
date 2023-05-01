import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import TomSelect from 'tom-select';
import Cropper from 'cropperjs';
import { ApiUrl } from '../../index';
import { fnShowLoader, fnHideLoader, fnAlertToast, fnNetworkCheck, fnXhrErrorAlert, fnDTSearchEnable, fnApiStatusFail, fnEmpStatusFail } from '../commonFunction';

let cropper;
let uploadedImageType, uploadedImageName
let cropoption, actions, download
let uploadedImageURL, originalImageURL
let cropperhorlogomodal, croppericonmodal
function fnCompanyInfoPageInit() {
  SettingsCompanyIndex();

  $('#btncompanyinfosave').on('click', function(e) {
    if (!document.getElementById('formCompanyInfo').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnUpdateCompanyBasicInfo();
    }
    $('#formCompanyInfo').addClass('was-validated');
  });
  $('#txtpincode').on('blur', function(e) {
    fnCmpnyAddressOnchange();
  });
  $('.btnAddressLoadOne').on('click', function(e) {
    fnCmpnyAddressOnchange(1);
  });
  $('.btnEditCompanyBasicInfo').on('click', function() {
    fnEditCompanyBasicInfo();
  });
  $('.btnEditCompanyLogo').on('click', function() {
    fnEditCompanyLogo();
  });
  const SignatureTabEL = document.getElementById('TabSignature');

  SignatureTabEL.addEventListener('show.bs.tab', () => {
    SettingsSignatureIndex();
    fnLoadSignatureTable();
  });

  $('.fnAddNewSignature').on('click', function(e) {
    fnNewSignatureModal();
  });
  $('#btnsignaturesave').on('click', function(e) {
    if (!document.getElementById('formSignature').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnSaveSignature();
    }
    $('#formSignature').addClass('was-validated');
  });
  $('#btnsignatureUpdate').on('click', function(e) {
    if (!document.getElementById('formSignature').checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      fnUpdateSignature();
    }
    $('#formSignature').addClass('was-validated');
  });
  $('#SwitchEnableSeal').on('change', function(e) {
    fnSealEnableOnchange();
  });
  $('#btnlogosave').on('click', function(e) {
    fnsettingcompanychange();
  });

  $('.fnCropValidCancel1').on('click', function(e) {
    fnCropValidCancel(1);
  });
  $('.fnCropValidCancel2').on('click', function(e) {
    fnCropValidCancel(2);
  });

  $('#croppermodal').on('shown.bs.modal', function () {
    const image = document.querySelector('#imageempcrop');
    // var minCroppedWidth = 128;
    // var minCroppedHeight = 128;
    // var maxCroppedWidth = 1024;
    // var maxCroppedHeight = 1024;

    cropoption = {
      dragMode: 'move',
      aspectRatio: NaN,
      viewMode: 1,
      // minCropBoxWidth: minCroppedWidth,
      // minCropBoxHeight: minCroppedHeight,
      // maxCropBoxWidth: maxCroppedWidth,
      // maxCropBoxHeight: maxCroppedHeight,
      cropBoxResizable: true,
      center: true,
      strict: true,
      crop: function (event) {
        // const width = event.detail.width;
        // const height = event.detail.height;
      }
    };
    cropper = new Cropper(image, cropoption);
    actions = document.getElementById('EmpPhotoEdit');

    $('#EmpPhotoEdit .modal-body').css('height', parseInt($(window).height()) - 180);
    $('#EmpPhotoEdit .modal-body').css('overflow-y', 'auto');

    // Methods
    actions.querySelector('.docs-buttons').onclick = function (event) {
      const e = event || window.event;
      let target = e.target || e.srcElement;
      // let cropped;
      let result;
      let input;
      // let data;

      if (!cropper) {
        return;
      }

      while (target !== this) {
        if (target.getAttribute('data-method')) {
          break;
        }

        target = target.parentNode;
      }

      if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
        return;
      }

      const data = {
        method: target.getAttribute('data-method'),
        target: target.getAttribute('data-target'),
        option: target.getAttribute('data-option') || undefined,
        secondOption: target.getAttribute('data-second-option') || undefined
      };

      const cropped = cropper.cropped;

      if (data.method) {
        if (typeof data.target !== 'undefined') {
          input = document.querySelector(data.target);

          if (!target.hasAttribute('data-option') && data.target && input) {
            try {
              data.option = JSON.parse(input.value);
            } catch (e) {
              console.log(e.message);
            }
          }
        }

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.clear();
            }

            break;

          case 'getCroppedCanvas':
            try {
              data.option = JSON.parse(data.option);
            } catch (e) {
              console.log(e.message);
            }

            if (uploadedImageType === 'image/jpeg') {
              if (!data.option) {
                data.option = {};
              }

              data.option.fillColor = '#fff';
            }

            break;
        }

        result = cropper[data.method](data.option, data.secondOption);

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.crop();
            }

            break;

          case 'scaleX':
          case 'scaleY':
            target.setAttribute('data-option', -data.option);
            break;

          case 'getCroppedCanvas':
            if (result) {
              // Bootstrap's Modal
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

              if (!download.disabled) {
                download.download = uploadedImageName;
                download.href = result.toDataURL(uploadedImageType);
              }
            }

            break;

          case 'destroy':
            cropper = null;

            if (uploadedImageURL) {
              URL.revokeObjectURL(uploadedImageURL);
              uploadedImageURL = '';
              image.src = originalImageURL;
            }

            break;
        }

        if (typeof result === 'object' && result !== cropper && input) {
          try {
            input.value = JSON.stringify(result);
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    };
  }).on('hidden.bs.modal', function () {
    cropper.destroy();
  });

  $('#croppericonmodal').on('shown.bs.modal', function () {
    const image = document.querySelector('#imageiconcrop');
    const minCroppedWidth = 128;
    const minCroppedHeight = 128;
    const maxCroppedWidth = 1024;
    const maxCroppedHeight = 1024;

    cropoption = {
      dragMode: 'move',
      aspectRatio: NaN,
      viewMode: 1,
      minCropBoxWidth: minCroppedWidth,
      minCropBoxHeight: minCroppedHeight,
      maxCropBoxWidth: maxCroppedWidth,
      maxCropBoxHeight: maxCroppedHeight,
      cropBoxResizable: true,
      center: true,
      strict: true,
      crop: function (event) {
        // const width = event.detail.width;
        // const height = event.detail.height;
      }
    };
    cropper = new Cropper(image, cropoption);
    actions = document.getElementById('EmpPhotoEdit');

    $('#IconPhotoEdit .modal-body').css('height', parseInt($(window).height()) - 180)
    $('#IconPhotoEdit .modal-body').css('overflow-y', 'auto')

    // Methods
    actions.querySelector('.img-buttons').onclick = function (event) {
      const e = event || window.event;
      let target = e.target || e.srcElement;
      // let cropped;
      let result;
      let input;
      // let data;

      if (!cropper) {
        return;
      }

      while (target !== this) {
        if (target.getAttribute('data-method')) {
          break;
        }

        target = target.parentNode;
      }

      if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
        return;
      }

      const data = {
        method: target.getAttribute('data-method'),
        target: target.getAttribute('data-target'),
        option: target.getAttribute('data-option') || undefined,
        secondOption: target.getAttribute('data-second-option') || undefined
      };

      const cropped = cropper.cropped;

      if (data.method) {
        if (typeof data.target !== 'undefined') {
          input = document.querySelector(data.target);

          if (!target.hasAttribute('data-option') && data.target && input) {
            try {
              data.option = JSON.parse(input.value);
            } catch (e) {
              console.log(e.message);
            }
          }
        }

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.clear();
            }

            break;

          case 'getCroppedCanvas':
            try {
              data.option = JSON.parse(data.option);
            } catch (e) {
              console.log(e.message);
            }

            if (uploadedImageType === 'image/jpeg') {
              if (!data.option) {
                data.option = {};
              }

              data.option.fillColor = '#fff';
            }

            break;
        }

        result = cropper[data.method](data.option, data.secondOption);

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.crop();
            }

            break;

          case 'scaleX':
          case 'scaleY':
            target.setAttribute('data-option', -data.option);
            break;

          case 'getCroppedCanvas':
            if (result) {
              // Bootstrap's Modal
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

              if (!download.disabled) {
                download.download = uploadedImageName;
                download.href = result.toDataURL(uploadedImageType);
              }
            }

            break;

          case 'destroy':
            cropper = null;

            if (uploadedImageURL) {
              URL.revokeObjectURL(uploadedImageURL);
              uploadedImageURL = '';
              image.src = originalImageURL;
            }

            break;
        }

        if (typeof result === 'object' && result !== cropper && input) {
          try {
            input.value = JSON.stringify(result);
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    };
  }).on('hidden.bs.modal', function () {
    cropper.destroy();
  });

  $('#cropperhorlogomodal').on('shown.bs.modal', function () {
    const image = document.querySelector('#imagehorlogocrop');
    const minCroppedWidth = 128;
    const minCroppedHeight = 128;
    const maxCroppedWidth = 300;
    const maxCroppedHeight = 300;

    cropoption = {
      dragMode: 'move',
      aspectRatio: 1 / 1,
      viewMode: 1,
      minCropBoxWidth: minCroppedWidth,
      minCropBoxHeight: minCroppedHeight,
      maxCropBoxWidth: maxCroppedWidth,
      maxCropBoxHeight: maxCroppedHeight,
      cropBoxResizable: true,
      center: true,
      strict: true,
      crop: function (event) {
        // const width = event.detail.width;
        // const height = event.detail.height;
      }
    };
    cropper = new Cropper(image, cropoption);
    actions = document.getElementById('LogoHorPhotoEdit');

    $('#LogoHorPhotoEdit .modal-body').css('height', parseInt($(window).height()) - 180)
    $('#LogoHorPhotoEdit .modal-body').css('overflow-y', 'auto')

    // Methods
    actions.querySelector('.horlogo-buttons').onclick = function (event) {
      const e = event || window.event;
      let target = e.target || e.srcElement;
      // let cropped;
      let result;
      let input;
      // let data;

      if (!cropper) {
        return;
      }

      while (target !== this) {
        if (target.getAttribute('data-method')) {
          break;
        }

        target = target.parentNode;
      }

      if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
        return;
      }

      const data = {
        method: target.getAttribute('data-method'),
        target: target.getAttribute('data-target'),
        option: target.getAttribute('data-option') || undefined,
        secondOption: target.getAttribute('data-second-option') || undefined
      };

      const cropped = cropper.cropped;

      if (data.method) {
        if (typeof data.target !== 'undefined') {
          input = document.querySelector(data.target);

          if (!target.hasAttribute('data-option') && data.target && input) {
            try {
              data.option = JSON.parse(input.value);
            } catch (e) {
              console.log(e.message);
            }
          }
        }

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.clear();
            }

            break;

          case 'getCroppedCanvas':
            try {
              data.option = JSON.parse(data.option);
            } catch (e) {
              console.log(e.message);
            }

            if (uploadedImageType === 'image/jpeg') {
              if (!data.option) {
                data.option = {};
              }

              data.option.fillColor = '#fff';
            }

            break;
        }

        result = cropper[data.method](data.option, data.secondOption);

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.crop();
            }

            break;

          case 'scaleX':
          case 'scaleY':
            target.setAttribute('data-option', -data.option);
            break;

          case 'getCroppedCanvas':
            if (result) {
              // Bootstrap's Modal
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

              if (!download.disabled) {
                download.download = uploadedImageName;
                download.href = result.toDataURL(uploadedImageType);
              }
            }

            break;

          case 'destroy':
            cropper = null;

            if (uploadedImageURL) {
              URL.revokeObjectURL(uploadedImageURL);
              uploadedImageURL = '';
              image.src = originalImageURL;
            }

            break;
        }

        if (typeof result === 'object' && result !== cropper && input) {
          try {
            input.value = JSON.stringify(result);
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    };
  }).on('hidden.bs.modal', function () {
    cropper.destroy();
  });

  $('#cropperreclogomodal').on('shown.bs.modal', function () {
    const image = document.querySelector('#imagereclogocrop');
    const minCroppedWidth = 128;
    const minCroppedHeight = 128;
    const maxCroppedWidth = 400;
    const maxCroppedHeight = 180;

    cropoption = {
      dragMode: 'move',
      aspectRatio: 16 / 9,
      viewMode: 1,
      minCropBoxWidth: minCroppedWidth,
      minCropBoxHeight: minCroppedHeight,
      maxCropBoxWidth: maxCroppedWidth,
      maxCropBoxHeight: maxCroppedHeight,
      cropBoxResizable: true,
      center: true,
      strict: true,
      crop: function (event) {
        // const width = event.detail.width;
        // const height = event.detail.height;
      }
    };
    cropper = new Cropper(image, cropoption);
    actions = document.getElementById('LogoRecPhotoEdit');

    $('#LogoRecPhotoEdit .modal-body').css('height', parseInt($(window).height()) - 180)
    $('#LogoRecPhotoEdit .modal-body').css('overflow-y', 'auto')

    // Methods
    actions.querySelector('.reclogo-buttons').onclick = function (event) {
      const e = event || window.event;
      let target = e.target || e.srcElement;
      // let cropped;
      let result;
      let input;
      // let data;

      if (!cropper) {
        return;
      }

      while (target !== this) {
        if (target.getAttribute('data-method')) {
          break;
        }

        target = target.parentNode;
      }

      if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
        return;
      }

      const data = {
        method: target.getAttribute('data-method'),
        target: target.getAttribute('data-target'),
        option: target.getAttribute('data-option') || undefined,
        secondOption: target.getAttribute('data-second-option') || undefined
      };

      const cropped = cropper.cropped;

      if (data.method) {
        if (typeof data.target !== 'undefined') {
          input = document.querySelector(data.target);

          if (!target.hasAttribute('data-option') && data.target && input) {
            try {
              data.option = JSON.parse(input.value);
            } catch (e) {
              console.log(e.message);
            }
          }
        }

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.clear();
            }

            break;

          case 'getCroppedCanvas':
            try {
              data.option = JSON.parse(data.option);
            } catch (e) {
              console.log(e.message);
            }

            if (uploadedImageType === 'image/jpeg') {
              if (!data.option) {
                data.option = {};
              }

              data.option.fillColor = '#fff';
            }

            break;
        }

        result = cropper[data.method](data.option, data.secondOption);

        switch (data.method) {
          case 'rotate':
            if (cropped && cropoption.viewMode > 0) {
              cropper.crop();
            }

            break;

          case 'scaleX':
          case 'scaleY':
            target.setAttribute('data-option', -data.option);
            break;

          case 'getCroppedCanvas':
            if (result) {
              // Bootstrap's Modal
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

              if (!download.disabled) {
                download.download = uploadedImageName;
                download.href = result.toDataURL(uploadedImageType);
              }
            }

            break;

          case 'destroy':
            cropper = null;

            if (uploadedImageURL) {
              URL.revokeObjectURL(uploadedImageURL);
              uploadedImageURL = '';
              image.src = originalImageURL;
            }

            break;
        }

        if (typeof result === 'object' && result !== cropper && input) {
          try {
            input.value = JSON.stringify(result);
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    };
  }).on('hidden.bs.modal', function () {
    cropper.destroy();
  });

  // $('#empsignature').on('change', function(e) {
  //   fnChangePicture(1);
  // });
  // $('#empsheel').on('change', function(e) {
  //   fnChangePicture(2);
  // });
  // $('#txtlogo').on('change', function(e) {
  //   fnChangePicture(5);
  // });
  // $('#companysheal').on('change', function(e) {
  //   fnChangePicture(6);
  // });
  // $('#companyicon').on('change', function(e) {
  //   fnChangePicture(7);
  // });
  // $('.fnCheckValidFace').on('change', function(e) {
  //   fnCheckValidFace();
  // });
}

function SettingsCompanyIndex() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      url: ApiUrl + 'web/v1/setting/LoadCompanyInfoIndex',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        const datas = response
        if (datas.EmpStatus !== false) {
          if (datas.Status === true) {
            const c = response.Data.Company;

            $('.lbl_CompanyName').html(c.CompanyName);
            if (c.ContactNo != null && c.ContactNo !== '') {
              $('.lbl_ContactNo').html(c.ContactNo);
            } else {
              $('.lbl_ContactNo').html('--');
            }
            if (c.EmailId != null && c.EmailId !== '') {
              $('.lbl_Emailid').html(c.EmailId);
            } else {
              $('.lbl_Emailid').html('--');
            }
            if (c.Website != null && c.Website !== '') {
              $('.lbl_Website').html(c.Website);
            } else {
              $('.lbl_Website').html('--');
            }
            if (c.ShortName != null && c.ShortName !== '') {
              $('.lbl_Shortname').html(c.ShortName);
            } else {
              $('.lbl_Shortname').html('--');
            }
            $('#txtCompanyid').val(c.Uuid);
            $('#txtCompanyName').val(c.CompanyName);
            if (c.BlockAreaStreet != null && c.BlockAreaStreet !== '') {
              $('.lbl_Address_block_area').html(c.BlockAreaStreet);
            } else {
              $('.lbl_Address_block_area').html('--');
            }
            $('#txtblockareastreet').val(c.BlockAreaStreet);
            if (c.FloorUnit != null && c.FloorUnit !== '') {
              $('.lbl_Address_floorunit').html(c.FloorUnit);
            } else {
              $('.lbl_Address_floorunit').html('--');
            }
            $('#txtfloorunit').val(c.FloorUnit);
            if (c.PostalCode != null && c.PostalCode !== '') {
              $('.lbl_Address_postalcode').html(c.PostalCode);
            } else {
              $('.lbl_Address_postalcode').html('--');
            }
            $('#txtpincode').val(c.PostalCode);
            $('#txtPhone').val(c.ContactNo);
            $('#txtEmail').val(c.EmailId);
            $('#txtshortname').val(c.ShortName);
            $('#txtwebsite').val(c.Website);

            $('#txthidcompanysheel').val(c.Company_Seal);
            $('#txthidcompanyicon').val(c.Company_Icon);
            $('#txthidcompanylogo').val(c.Company_Logo);
            $('#img_logo').attr('src', c.CompanyLogo);
            $('#imglogologin').attr('src', c.CompanyLogo);
            $('#img_logo').attr('alt', c.CompanyName);
            $('#img_icon').attr('src', c.CompanyIcon);
            $('#img_icon').attr('alt', c.CompanyIcon);
            $('#imgcompanyicon').attr('src', c.CompanyIcon);
            $('#img_companyseal').attr('src', c.CompanySeal);
            $('#imgcompanysheal').attr('src', c.CompanySeal);

            const checklogodisplay = c.LogoDisplayFlg;
            if (checklogodisplay === 0) {
              $('.lbl_Logodisplayflg').html('Rectangle');
            } else if (checklogodisplay === 1) {
              $('.lbl_Logodisplayflg').html('Square (or) Round');
            } else {
              $('.lbl_Logodisplayflg').html('None');
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
    })
  }
}

function SettingsSignatureIndex() {
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    $.ajax({
      type: 'GET',
      url: ApiUrl + 'web/v1/setting/LoadCompanyInfoIndex',
      headers: {
        Authorization: 'Bearer ' + headertoken
      },
      success: function (response) {
        const datas = response
        if (datas.EmpStatus !== false) {
          if (datas.Status === true) {
            const selEmployee = (document.getElementById('selEmployee')).tomselect
            if (selEmployee != null) {
              selEmployee.destroy();
            }
            const result = response.Data.Employee

            if (result.length > 0) {
              let SiteHtmlval = '<option value="">Select</option>'
              for (let i = 0; i < result.length; i++) {
                SiteHtmlval += '<option value=' + result[i].Uuid + '>' + result[i].EmpName + '</option>'
              }
              $('#selEmployee').html(SiteHtmlval);
            }
            new TomSelect('#selEmployee', {
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

function fnChangePicture(Picflg) {
  $('#hidPicFlg').val(Picflg);
  if (Picflg === 1) {
    const file = $('#empsignature').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      //   $('#imgJobApplicatinPhoto').prop('src', e.target.result);
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  } else if (Picflg === 2) {
    const file = $('#empsheel').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  } else if (Picflg === 3) {
    const file = $('#empsignatureE').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  } else if (Picflg === 4) {
    const file = $('#empsheelE').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  } else if (Picflg === 6) {
    const file = $('#companysheal').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  } else if (Picflg === 7) {
    const file = $('#companyicon').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  } else if (Picflg === 5) {
    const file = $('#txtlogo').prop('files')[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      fnOpenCropModal(Picflg);
    }
    reader.readAsDataURL(file);
  }
}
function fnOpenCropModal(Picflg) {
  if (Picflg === 1) {
    const files = document.getElementById('empsignature').files;
    let file;

    if (files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        uploadedImageType = file.type;
        uploadedImageName = file.name;

        document.getElementById('imageempcrop').src = URL.createObjectURL(file);

        if (cropper != null) {
          cropper.destroy();
        }
        const preModalheight = $(window).height() - 195;
        $('#croppermodal .modal-body,.img-container').css('height', preModalheight);
        // $('#croppermodal').modal('show');
        const croppermodal = new bootstrap.Modal(document.getElementById('croppermodal'));
        croppermodal.show()
      } else {
        fnAlertToast('Please choose an image file.', 'Error', 'error');
      }
    }
  } else if (Picflg === 2) {
    const files = document.getElementById('empsheel').files;
    let file;

    if (files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        uploadedImageType = file.type;
        uploadedImageName = file.name;

        document.getElementById('imageempcrop').src = URL.createObjectURL(file);

        if (cropper != null) {
          cropper.destroy();
        }
        const preModalheight = $(window).height() - 195;
        $('#croppermodal .modal-body,.img-container').css('height', preModalheight);
        // $('#croppermodal').modal('show');
        const croppermodal = new bootstrap.Modal(document.getElementById('croppermodal'));
        croppermodal.show()
      } else {
        fnAlertToast('Please choose an image file.', 'Error', 'error');
      }
    }
  } else if (Picflg === 3) {
    const files = document.getElementById('empsignatureE').files;
    let file;

    if (files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        uploadedImageType = file.type;
        uploadedImageName = file.name;

        document.getElementById('imageempcrop').src = URL.createObjectURL(file);

        if (cropper != null) {
          cropper.destroy();
        }
        const preModalheight = $(window).height() - 195;
        $('#croppermodal .modal-body,.img-container').css('height', preModalheight);
        // $('#croppermodal').modal('show');
        const croppermodal = new bootstrap.Modal(document.getElementById('croppermodal'));
        croppermodal.show()
      } else {
        fnAlertToast('Please choose an image file.', 'Error', 'error');
      }
    }
  } else if (Picflg === 4) {
    const files = document.getElementById('empsheelE').files;
    let file;

    if (files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        uploadedImageType = file.type;
        uploadedImageName = file.name;

        document.getElementById('imageempcrop').src = URL.createObjectURL(file);

        if (cropper != null) {
          cropper.destroy();
        }
        const preModalheight = $(window).height() - 195;
        $('#croppermodal .modal-body,.img-container').css('height', preModalheight);
        // $('#croppermodal').modal('show');
        const croppermodal = new bootstrap.Modal(document.getElementById('croppermodal'));
        croppermodal.show()
      } else {
        fnAlertToast('Please choose an image file.', 'Error', 'error');
      }
    }
  } else if (Picflg === 6) {
    const files = document.getElementById('companysheal').files;
    let file;

    if (files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        uploadedImageType = file.type;
        uploadedImageName = file.name;

        document.getElementById('imageiconcrop').src = URL.createObjectURL(file);

        if (cropper != null) {
          cropper.destroy();
        }
        const preModalheight = $(window).height() - 195;
        $('#croppericonmodal .modal-body,.img-container').css('height', preModalheight);
        // $('#croppericonmodal').modal('show');
        croppericonmodal = new bootstrap.Modal(document.getElementById('croppericonmodal'));
        croppericonmodal.show()
      } else {
        fnAlertToast('Please choose an image file.', 'Error', 'error');
      }
    }
  } else if (Picflg === 7) {
    const files = document.getElementById('companyicon').files;
    let file;

    if (files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        uploadedImageType = file.type;
        uploadedImageName = file.name;

        document.getElementById('imageiconcrop').src = URL.createObjectURL(file);

        if (cropper != null) {
          cropper.destroy();
        }
        const preModalheight = $(window).height() - 195;
        $('#croppericonmodal .modal-body,.img-container').css('height', preModalheight);
        // $('#croppericonmodal').modal('show');
        croppericonmodal = new bootstrap.Modal(document.getElementById('croppericonmodal'));
        croppericonmodal.show()
      } else {
        fnAlertToast('Please choose an image file.', 'Error', 'error');
      }
    }
  } else if (Picflg === 5) {
    const files = document.getElementById('txtlogo').files;
    let file;

    if (files && files.length) {
      file = files[0];

      let type = 0;

      if ($('#no').is(':checked')) {
        type = 1;
      } else {
        type = 2;
      }
      if (type === 1) {
        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          document.getElementById('imagereclogocrop').src = URL.createObjectURL(file);

          if (cropper != null) {
            cropper.destroy();
          }
          const preModalheight = $(window).height() - 195;
          $('#cropperreclogomodal .modal-body,.img-container').css('height', preModalheight);
          // $('#cropperreclogomodal').modal('show');
          const cropperreclogomodal = new bootstrap.Modal(document.getElementById('cropperreclogomodal'));
          cropperreclogomodal.show()
        } else {
          fnAlertToast('Please choose an image file.', 'Error', 'error');
        }
      } else if (type === 2) {
        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          document.getElementById('imagehorlogocrop').src = URL.createObjectURL(file);

          if (cropper != null) {
            cropper.destroy();
          }
          const preModalheight = $(window).height() - 195;
          $('#cropperhorlogomodal .modal-body,.img-container').css('height', preModalheight);
          // $('#cropperhorlogomodal').modal('show');
          cropperhorlogomodal = new bootstrap.Modal(document.getElementById('cropperhorlogomodal'));
          cropperhorlogomodal.show()
        } else {
          fnAlertToast('Please choose an image file.', 'Error', 'error');
        }
      }
    }
  }
}

function fnCropValidCancel(flg) {
  if (flg === 1) {
    $('#txtlogo').val('');
    cropperhorlogomodal.hide()
  }
  if (flg === 2) {
    $('#companysheal').val('');
    $('#companyicon').val('');
    croppericonmodal.hide();
  }
}

function fnCheckValidFace() {
  const flg = $('#hidPicFlg').val();

  if (flg === 1) {
    // const image = $('#imgJobApplicatinPhoto').prop('src');
    // const empid = $('#txthidempid').val();
    const cropcanvas = cropper.getCroppedCanvas();
    const croppng = cropcanvas.toDataURL('image/png');

    const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
    const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

    const formData = new FormData();
    formData.append('photo[]', empphotoblob);
    fnShowLoader();

    $('#empsig').prop('src', croppng);
    // $("#empsignature").val('').clone(true);
    $('#croppermodal').modal('hide');
    fnHideLoader();
  } else if (flg === 2) {
    // const image = $('#imgJobApplicatinPhoto').prop('src');
    // const empid = $('#txthidempid').val();
    const cropcanvas = cropper.getCroppedCanvas();
    const croppng = cropcanvas.toDataURL('image/png');

    const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
    const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

    const formData = new FormData();
    formData.append('photo[]', empphotoblob);
    fnShowLoader();

    $('#empshe').prop('src', croppng);
    // $("#empsheel").val('').clone(true);
    $('#croppermodal').modal('hide');
    fnHideLoader();
  } else if (flg === 3) {
    // const image = $('#imgJobApplicatinPhoto').prop('src');
    // const empid = $('#txthidempid').val();
    const cropcanvas = cropper.getCroppedCanvas();
    const croppng = cropcanvas.toDataURL('image/png');

    const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
    const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

    const formData = new FormData();
    formData.append('photo[]', empphotoblob);
    fnShowLoader();

    $('#empsigE').prop('src', croppng);
    // $("#empsheel").val('').clone(true);
    $('#croppermodal').modal('hide');
    fnHideLoader();
  } else if (flg === 4) {
    // const image = $('#imgJobApplicatinPhoto').prop('src');
    // const empid = $('#txthidempid').val();
    const cropcanvas = cropper.getCroppedCanvas();
    const croppng = cropcanvas.toDataURL('image/png');

    const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
    const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

    const formData = new FormData();
    formData.append('photo[]', empphotoblob);
    fnShowLoader();

    $('#empsheE').prop('src', croppng);
    // $("#empsheel").val('').clone(true);
    $('#croppermodal').modal('hide');
    fnHideLoader();
  } else if (flg === 6) {
    // const image = $('#imgJobApplicatinPhoto').prop('src');
    // const empid = $('#txthidempid').val();
    const cropcanvas = cropper.getCroppedCanvas();
    const croppng = cropcanvas.toDataURL('image/png');

    const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
    const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

    const formData = new FormData();
    formData.append('photo[]', empphotoblob);
    fnShowLoader();

    $('#imgcompanysheal').prop('src', croppng);
    // $("#empsheel").val('').clone(true);
    // $('#croppericonmodal').modal('hide');
    croppericonmodal.hide();
    fnHideLoader();
  } else if (flg === 7) {
    // const image = $('#imgJobApplicatinPhoto').prop('src');
    // const empid = $('#txthidempid').val();
    const cropcanvas = cropper.getCroppedCanvas();
    const croppng = cropcanvas.toDataURL('image/png');

    const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
    const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

    const formData = new FormData();
    formData.append('photo[]', empphotoblob);
    fnShowLoader();

    $('#imgcompanyicon').prop('src', croppng);
    // $("#empsheel").val('').clone(true);
    // $('#croppericonmodal').modal('hide');
    croppericonmodal.hide();
    fnHideLoader();
  } else if (flg === 5) {
    let type = 0;

    // if ($("#phfixedpaytrue").is(":checked"))

    if ($('#no').is(':checked')) {
      type = 1;
    } else {
      type = 2;
    }
    if (type === 1) {
    //   const image = $('#imgJobApplicatinPhoto').prop('src');
    //   const empid = $('#txthidempid').val();
      const cropcanvas = cropper.getCroppedCanvas();
      const croppng = cropcanvas.toDataURL('image/png');

      const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
      const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

      const formData = new FormData();
      formData.append('photo[]', empphotoblob);
      fnShowLoader();

      $('#imglogologin').prop('src', croppng);
      $('#cropperreclogomodal').modal('hide');
      fnHideLoader();
    } else if (type === 2) {
    //   const image = $('#imgJobApplicatinPhoto').prop('src');
    //   const empid = $('#txthidempid').val();
      const cropcanvas = cropper.getCroppedCanvas();
      const croppng = cropcanvas.toDataURL('image/png');

      const base64ImageContent = croppng.replace(/^data:image\/png;base64,/, '');
      const empphotoblob = base64ToBlob(base64ImageContent, 'image/jpg');

      const formData = new FormData();
      formData.append('photo[]', empphotoblob);
      fnShowLoader();

      $('#imglogologin').prop('src', croppng);
      // $('#cropperhorlogomodal').modal('hide');
      cropperhorlogomodal.hide();
      fnHideLoader();
    }
  }
}

function base64ToBlob(base64, mime) {
  mime = mime || '';
  const sliceSize = 1024;
  const byteChars = window.atob(base64);
  const byteArrays = [];

  for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
    const slice = byteChars.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
}

let ModalCompanyInfo
function fnEditCompanyBasicInfo() {
  ModalCompanyInfo = new bootstrap.Modal(document.getElementById('ModalCompanyInfo'));
  ModalCompanyInfo.show()
}

let ModalLogoSeal
function fnEditCompanyLogo() {
  ModalLogoSeal = new bootstrap.Modal(document.getElementById('ModalLogoSeal'));
  ModalLogoSeal.show()
}

function fnUpdateCompanyBasicInfo() {
  const Id = $('#txtCompanyid').val();
  const CompanyName = $('#txtCompanyName').val();
  const ShortName = $('#txtshortname').val();
  const ContactNo = $('#txtPhone').val();
  const Website = $('#txtwebsite').val();
  const EmailId = $('#txtEmail').val();
  const PostalCode = $('#txtpincode').val();
  const BlockAreaStreet = $('#txtblockareastreet').val();
  const FloorUnit = $('#txtfloorunit').val();
  const headertoken = localStorage.getItem('token');

  const payload = {
    Id,
    CompanyName,
    ShortName,
    ContactNo,
    Website,
    EmailId,
    PostalCode,
    BlockAreaStreet,
    FloorUnit
  }
  if (fnNetworkCheck()) {
    fnShowLoader();
    $.ajax({
      url: ApiUrl + 'web/v1/setting/UpdateCompanyBasicInfo',
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
              fnAlertToast('Company Info Updated Successfully', 'Success', 'success');
              SettingsCompanyIndex();
            } else {
              fnAlertToast('Please verify input is valid', 'Validation', 'success');
            }
            ModalCompanyInfo.hide();
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

function fnCmpnyAddressOnchange(type) {
  fngetaddressdetails(type);
}

function fngetaddressdetails(type) {
  const postcode = $('#txtpincode').val();
  // const valid = 0;

  if (postcode === '' || postcode.length !== 6) {
    fnAlertToast('Please enter valid pincode', 'Warning', 'warning');
    return false;
  }

  const data = {
    searchVal: postcode,
    returnGeom: 'Y',
    getAddrDetails: 'Y',
    pageNum: 1
  };

  fnShowLoader();
  $.ajax({
    type: 'GET',
    url: 'https://developers.onemap.sg/commonapi/search',
    data,
    success: function (response) {
      if (response.EmpStatus === true) {
        if (response.Status === true) {
          const data = response.Data;
          // console.log(data);
          if (data.found > 0) {
            $('#txtblockareastreet').val(data.results[0].BUILDING + ' ' + data.results[0].BLK_NO + ' ' + data.results[0].ROAD_NAME);
            $('#txtfloorunit').val(data.results[0].BUILDING + ' ' + data.results[0].BLK_NO + ' ' + data.results[0].ROAD_NAME);

            fnHideLoader();
          } else {
            fnAlertToast('Please enter valid pincode', 'Warning', 'warning');

            fnHideLoader();
            return false;
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

function fnLoadSignatureTable() {
  let dtActionDrop = '<ul class="dropdown-menu">';
  dtActionDrop += '<li><a class="dropdown-item fnEditSignatureModal"><i class="fa-solid fa-pen-to-square icon"></i>Edit</a></li>';
  dtActionDrop += '<li><a class="dropdown-item red-text fnDeleteEmpSignature"><i class="fa-solid fa-trash icon"></i>Delete</a></li>';
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
      url: ApiUrl + 'web/v1/setting/ListEmpSignature',
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
                    let fn = '';
                    if (full.sig !== '' && full.sig !== null) {
                      fn = full.sig.toLowerCase();
                    }
                    if (fn.indexOf('.png') !== -1 || fn.indexOf('.jpg') !== -1 || fn.indexOf('.jpeg') !== -1) {
                      return '<a onclick="fnOpenLightbox(\'' + full.sig + '\')"><img src="' + full.sig + '" style="height:60px" /></a>';
                    } else if (fn.indexOf('.pdf') !== -1) {
                      return '<img src="img/pdf_icon_64px.png"/>';
                    } else if (fn.indexOf('.doc') !== -1 || fn.indexOf('.docx') !== -1) {
                      return '<img src="img/doc_icon_64px.png"/>';
                    } else if (fn.indexOf('.xls') !== -1 || fn.indexOf('.xlsx') !== -1) {
                      return '<img src="img/xls_icon_64px.png"/>';
                    } else {
                      return '<img src="img/other_icon_64px.png"/>';
                    }
                  }
                },
                {
                  targets: [2],
                  render: function (data, type, full, meta) {
                    return '<div class="dropdown text-end"><button data-id=\'' + full.Uuid + '\' type="button" class="btn btn-light btn-bordered dropdown-toggle fnSetSignTableId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></button>' + dtActionDrop + '</div>'
                  }
                }
              ],
              columns: [
                { width: '40%', data: 'fullname' },
                { width: '40%', data: 'sig' },
                { width: '10%', data: null }
              ],
              drawCallback: function () {
                $(document).on('click', '.fnSetSignTableId', function() {
                  fnSetSignTableId(this)
                });
                $(document).on('click', '.fnDeleteEmpSignature', function() {
                  fnDeleteEmpSignature()
                });
                $(document).on('click', '.fnEditSignatureModal', function() {
                  fnEditSignatureModal()
                });
              }
            };

            const Datatableopts = $('#singtable').DataTable(dtopts);
            fnDTSearchEnable(Datatableopts, '#DtSignSearchBoxWrap .DTSearchBoxSign', '#DtSignSearchBoxWrap .DTSearchBtnSign', '#DtSignSearchBoxWrap .DTSearchClrSign');
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

function fnSetSignTableId(e) {
  const id = $(e).data('id');

  $('#txtSignatureid').val(id);
}

let ModalSignatureEdit
function fnEditSignatureModal() {
  $('#btnsignaturesave').addClass('d-none');
  $('#btnsignatureUpdate').removeClass('d-none');
  fnEditSignature();
  ModalSignatureEdit = new bootstrap.Modal(document.getElementById('ModalSignature'));
  ModalSignatureEdit.show()
}

function fnEditSignature() {
  const Id = $('#txtSignatureid').val();

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
      url: ApiUrl + 'web/v1/setting/ListEmpSignature',
      data: payload,
      success: function (response) {
        if (response.EmpStatus === true) {
          if (response.Status === true) {
            const data = response.Data;
            if (data != null) {
              const selEmployee = (document.getElementById('selEmployee')).tomselect
              selEmployee.setValue(data[0].Empid);
              $('#empsig').prop('src', data[0].sig);
              if (data[0].sheel_ebl_flg === true) {
                $('#SwitchEnableSeal').prop('checked', true);
                $('#divEnableEmpSeal').removeClass('d-none');
                $('#empshe').prop('src', data[0].sheel);
              } else {
                $('#SwitchEnableSeal').prop('checked', false);
                $('#divEnableEmpSeal').addClass('d-none');
                // $('#empshe').prop('src', data[0].sheel);
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

function fnSealEnableOnchange() {
  if ($('#SwitchEnableSeal').is(':checked')) {
    $('#divEnableEmpSeal').removeClass('d-none');
  } else {
    $('#divEnableEmpSeal').addClass('d-none');
  }
}

let ModalSignature
function fnNewSignatureModal() {
  $('#btnsignaturesave').removeClass('d-none');
  $('#btnsignatureUpdate').addClass('d-none');
  $('#selEmployee').val('');
  ModalSignature = new bootstrap.Modal(document.getElementById('ModalSignature'));
  ModalSignature.show()
}

function fnSaveSignature() {
  const EmpId = $('#selEmployee').val();
  let SealEnable
  if ($('#SwitchEnableSeal').is(':checked')) {
    SealEnable = true;
  } else {
    SealEnable = false;
  }
  let Signature = '';
  let Seal = '';
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    if ($('#empsignature').val() !== '' || $('#empsheel').val() !== '') {
      const formData = new FormData();
      const filetype = [];
      if ($('#empsignature').val() !== '') {
        formData.append('files', $('#empsignature')[0].files[0]);
        filetype.push(1);

        const fileSize = $('#empsignature')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Signature File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }
      if ($('#empsheel').val() !== '') {
        filetype.push(1);
        formData.append('files', $('#empsheel')[0].files[0]);

        const fileSize = $('#empsheel')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Seal File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }

      formData.append('File_Type', filetype.toString());
      $.ajax({
        url: ApiUrl + 'web/v1/setting/UploadFiles',
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

              if (data[0] !== null && data[0] !== '') {
                Signature = data[0];
              }
              if (data[1] !== null && data[1] !== '') {
                Seal = data[1];
              }

              const payload = {
                EmpId,
                SealEnable,
                Signature,
                Seal
              };
              fnShowLoader();
              $.ajax({
                type: 'POST',
                cache: false,
                headers: {
                  Authorization: 'Bearer ' + headertoken
                },
                data: JSON.stringify(payload),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                timeout: 60000,
                crossDomain: true,
                url: ApiUrl + 'web/v1/setting/SaveEmployeeSignature',
                success: function (response) {
                  if (response.EmpStatus === true) {
                    if (response.Status === true) {
                      const data = response.Data;

                      if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                        fnAlertToast('Signature Added Successfully', 'Success', 'success');
                        fnHideLoader();
                        fnLoadSignatureTable();
                      } else {
                        fnAlertToast('Please verify input is valid', 'Error', 'error');
                        fnHideLoader();
                      }
                      ModalSignature.hide();
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
}

function fnUpdateSignature() {
  const Id = $('#txtSignatureid').val();
  const EmpId = $('#selEmployee').val();
  let SealEnable
  if ($('#SwitchEnableSeal').is(':checked')) {
    SealEnable = true;
  } else {
    SealEnable = false;
  }
  let Signature = '';
  let Seal = '';
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    if ($('#empsignature').val() !== '' || $('#empsheel').val() !== '') {
      const formData = new FormData();
      const filetype = [];
      if ($('#empsignature').val() !== '') {
        formData.append('files', $('#empsignature')[0].files[0]);
        filetype.push(1);

        const fileSize = $('#empsignature')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Signature File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }
      if ($('#empsheel').val() !== '') {
        filetype.push(1);
        formData.append('files', $('#empsheel')[0].files[0]);

        const fileSize = $('#empsheel')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Seal File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }

      formData.append('File_Type', filetype.toString());
      $.ajax({
        url: ApiUrl + 'web/v1/setting/UploadFiles',
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

              if (data[0] !== null && data[0] !== '') {
                Signature = data[0];
              }
              if (data[1] !== null && data[1] !== '') {
                Seal = data[1];
              }

              const payload = {
                Id,
                EmpId,
                SealEnable,
                Signature,
                Seal
              };
              fnShowLoader();
              $.ajax({
                type: 'POST',
                cache: false,
                headers: {
                  Authorization: 'Bearer ' + headertoken
                },
                data: JSON.stringify(payload),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                timeout: 60000,
                crossDomain: true,
                url: ApiUrl + 'web/v1/setting/UpdateEmployeeSignature',
                success: function (response) {
                  if (response.EmpStatus === true) {
                    if (response.Status === true) {
                      const data = response.Data;

                      if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                        fnAlertToast('Signature Updated Successfully', 'Success', 'success');
                        fnHideLoader();
                        fnLoadSignatureTable();
                      } else {
                        fnAlertToast('Please verify input is valid', 'Error', 'error');
                        fnHideLoader();
                      }
                      ModalSignatureEdit.hide();
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
}

function fnDeleteEmpSignature() {
  Swal.fire({
    title: 'Confirmation',
    text: 'Please Confirm To Delete Signature',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      const Id = $('#txtSignatureid').val();

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
          url: ApiUrl + 'web/v1/setting/DeleteEmpSignature',
          data,
          success: function (response) {
            if (response.EmpStatus === true) {
              if (response.Status === true) {
                const data = response.Data;
                if (data === 1) {
                  fnAlertToast('Deleted successfully', 'Success', 'success');
                  fnLoadSignatureTable();
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

function fnsettingcompanychange() {
  const Id = $('#txtCompanyid').val();
  const CompanyName = $('#txtCompanyName').val();
  const ShortName = $('#txtshortname').val();
  const ContactNo = $('#txtPhone').val();
  const Website = $('#txtwebsite').val();
  const EmailId = $('#txtEmail').val();
  const PostalCode = $('#txtpincode').val();
  const BlockAreaStreet = $('#txtblockareastreet').val();
  const FloorUnit = $('#txtfloorunit').val();
  let LogoDisplayFlg
  if ($('#LogoRectangle').is(':checked')) {
    LogoDisplayFlg = true;
  } else if ($('#LogoSquare').is(':checked')) {
    LogoDisplayFlg = false;
  }
  let CompanyLogo = '';
  let CompanySeal = '';
  let CompanyIcon = '';
  if (fnNetworkCheck()) {
    const headertoken = localStorage.getItem('token');
    if ($('#txtlogo').val() !== '' || $('#companysheal').val() !== '' || $('#companyicon').val() !== '') {
      const formData = new FormData();
      const filetype = [];
      if ($('#txtlogo').val() !== '') {
        formData.append('files', $('#txtlogo')[0].files[0]);
        filetype.push(1);

        const fileSize = $('#txtlogo')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Company Logo File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }
      if ($('#companysheal').val() !== '') {
        filetype.push(1);
        formData.append('files', $('#companysheal')[0].files[0]);

        const fileSize = $('#companysheal')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Company Seal File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }
      if ($('#companyicon').val() !== '') {
        filetype.push(1);
        formData.append('files', $('#companyicon')[0].files[0]);

        const fileSize = $('#companyicon')[0].files[0].size / 1024;

        if (fileSize > 200) {
          fnAlertToast('Company Icon File size: ' + fileSize.toFixed(0) + ' KB. Please Select Under 200 KB', 'Validation', 'validation');
          return false;
        }
      } else {
        filetype.push(0);
      }

      formData.append('File_Type', filetype.toString());
      $.ajax({
        url: ApiUrl + 'web/v1/setting/UploadCompanyFiles',
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

              if (data[0] !== null && data[0] !== '') {
                CompanyLogo = data[0];
              }
              if (data[1] !== null && data[1] !== '') {
                CompanySeal = data[1];
              }
              if (data[2] !== null && data[2] !== '') {
                CompanyIcon = data[2];
              }

              const payload = {
                Id,
                CompanyName,
                ShortName,
                ContactNo,
                Website,
                EmailId,
                PostalCode,
                BlockAreaStreet,
                FloorUnit,
                LogoDisplayFlg,
                CompanyLogo,
                CompanySeal,
                CompanyIcon
              };
              fnShowLoader();
              $.ajax({
                type: 'POST',
                cache: false,
                headers: {
                  Authorization: 'Bearer ' + headertoken
                },
                data: JSON.stringify(payload),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                timeout: 60000,
                crossDomain: true,
                url: ApiUrl + 'web/v1/setting/UpdateCompanyBasicInfo',
                success: function (response) {
                  if (response.EmpStatus === true) {
                    if (response.Status === true) {
                      const data = response.Data;

                      if (data !== '0' || data !== 0 || data !== null || data !== 'null') {
                        fnAlertToast('Company Logo and Seal Updated Successfully', 'Success', 'success');
                        SettingsCompanyIndex();
                      } else {
                        fnAlertToast('Please verify input is valid', 'Error', 'error');
                      }
                      ModalLogoSeal.hide();
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
}

export {
  fnCompanyInfoPageInit
}
