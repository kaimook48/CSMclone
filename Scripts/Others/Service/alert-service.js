const $alert = function (title, message, alert_type, callback) {
  const title_text = `<span class="text-${alert_type}"><i class="fa fa-${alert_type == 'danger' ? 'times-circle' : alert_type == 'success' ? 'check-circle' : alert_type == 'info' ? 'info-circle' : alert_type == 'warning' ? 'exclamation-circle' : 'info-circle'}"></i> ${title}</span>`
  $.alert({
    title: title_text,
    content: `<span style="line-height:1.8">${message}</span>`,
    btnClass: 'btn-info',
    theme: 'material',
    animation: 'opacity',
    closeAnimation: 'opacity',
    animateFromElement: false,
    buttons: {
      ok: {
        text: 'OK',
        btnClass: 'bg-navy',
      }
    },
    onClose: function () {
      if (callback) {
        callback();
      }
    },
  });
};
const $confirm = function (text, ok_function, no_fuction) {
  $.confirm({
    title: '<i class="fa fa-question-circle"></i> ยืนยันการทำรายการ',
    content: `<span style="line-height:1.8">${text}</span>`,
    theme: 'material',
    animation: 'opacity',
    closeAnimation: 'opacity',
    animateFromElement: false,
    buttons: {
      yes: {
        text: 'Yes',
        btnClass: 'bg-navy',
        action: function () {
          if (ok_function) {
            ok_function();
          }
        },
      },
      no: {
        text: 'No',
        btnClass: 'btn-danger',
        action: function () {
          if (no_fuction) {
            no_fuction();
          }
        }
      }
    }
  });
};
const $prompt = function (text, callback, cancelaction) {
  $.confirm({
    title: 'Prompt!',
    content: '<p>' + text + '</p>' +
      '<form action="" class="formName">' +
      '<div class="form-group">' +
      '<textarea type="text" placeholder="" class="name form-control" rows="3"></textarea>' +
      '</div>' +
      '</form>',
    theme: 'material',
    animation: 'opacity',
    closeAnimation: 'opacity',
    animateFromElement: false,
    buttons: {
      formSubmit: {
        text: 'OK',
        btnClass: 'bg-navy',
        action: function () {
          var name = this.$content.find('.name').val();
          callback(name);
        }
      },
      cancel: function () {
        if (cancelaction) {
          cancelaction();
        }
      },
    },
    onContentReady: function () {
      var jc = this;
      this.$content.find('form').on('submit', function (e) {
        e.preventDefault();
        jc.$$formSubmit.trigger('click');
      });
    }
  });
}

const $msg = {
  alert(title, message, alert_type) {
    return new Promise((resolve, reject) => {
      $alert(title, message, alert_type, () => {
        resolve(true);
      })
    });
  },
  confirm(text) {
    return new Promise((resolve, reject) => {
      $confirm(text, () => {
        resolve(true)
      }, () => {
        resolve(false)
      });
    });
  },
  prompt(text) {
    return new Promise((rs, rj) => {
      $prompt(text, (data) => {
        rs(data)
      }, () => {
        rs(null)
      });
    })
  }
};
