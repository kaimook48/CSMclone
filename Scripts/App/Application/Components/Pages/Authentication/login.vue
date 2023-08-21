<template>
  <div class="wrapper">
    <div class="login-box">
      <div class="card">
        <div class="login-logo">
          <img :src="contentImage" width="220" height="90" />
        </div>
        <div class="form-group mb-4">
          <label><b>บริษัท</b></label>
          <select class="form-control" v-model="form['maincode']">
            <option value="" selected="selected" disabled="disabled">-- Please Select --</option>
            <option v-for="x in company" :value="x.maincode" v-text="x.mainname"></option>
          </select>
        </div>
        <div class="form-group mb-4">
          <label><b>ผู้ให้บริการ</b></label>
          <select class="form-control" v-model="form['extension']">
            <option value="" selected="selected">-- Please Select --</option>
            <option v-for="x in extension" :value="x.extension" v-text="x.agent_name"></option>
          </select>
        </div>
        <div class="form-group has-feedback">
          <label><b>ชื่อผู้ใช้งาน</b></label>
          <input type="text" name="username" class="form-control " placeholder="Username" v-model="form['userid']" @keyup.enter="submit">
          <span class="glyphicon glyphicon-user form-control-feedback "></span>
        </div>
        <div class="form-group has-feedback">
          <label><b>รหัสผ่าน</b></label>
          <input type="password" name="password" class="form-control " placeholder="Password" v-model="form['userpass']" @keyup.enter="submit">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
          <div class="col-6 text-center">
            <button type="button" class="btn btn-block" @click="submit"><i class="fa" :class="{'fa-spinner fa-spin': isLoading}"></i>เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  $("body").addClass("login-page");
  let doSubmit = false;
  export default {
    data() {
      return {
        form: {
          maincode: '',
          extension: '',
          oauth2: 'N'
        },
        company: [],
        extension: [],
        isLoading: false,
        contentImage: baseUrl + '/Content/Images/Logo/logo_mangocsm.png',
      };
    },
    methods: {
      loadCompany() {
        (async () => {
          let resp = await $xt.getServer(`api/public/LoginCompanies`);
          this.$set(this, 'company', resp.data);
          this.$set(this.form, 'maincode', $linq(resp.data).select(x => x.maincode).firstOrDefault() || '');
        })();
      },
      loadExtension() {
        (async () => {
          let resp = await $xt.getServer(`api/public/Extension_ForCallCenter`);
          this.$set(this, 'extension', resp.data);
        })();
      },
      submit() {
        if (doSubmit) return;

        (async () => {
          let f = this.form;
          if (!f.maincode || !f.userid || !f.userpass) {
            await $msg.alert('', 'Please fill in all required fields.', 'danger');
            return;
          }
          let action = `api/public/Login?is_api=N&app_name=CSM`;
          try {
            doSubmit = true;
            this.isLoading = true;
            let d = await $xt.postServerJson(action, f)
            if (d.error) {
              await $msg.alert('', d.error, 'danger');
            } else {
              localStorage.setItem("mango_auth", d.data)
              window.location = baseUrl + 'page/';
            }
          }
          catch (err) {
            await $msg.alert('', err.toString(), 'danger');
          }

          doSubmit = false;
          this.isLoading = false;
        })();
      }
    },
    created() {
      document.title = `CSM : Customer Service Management`;
      this.loadCompany();
      this.loadExtension();
    },
    mounted() {

    }
  };
</script>
<style scoped>
  body {
    background: -webkit-linear-gradient(top left, #808080 0%, #ebe89e 100%);
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .wrapper {
    background: #50a3a2;
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background-image: linear-gradient( 179.6deg, rgba(0,19,26,1) -4.9%, rgba(0,77,105,1) 108.4% );
    position: absolute;
    top: 0%;
    left: 0;
    width: 100%;
    height: 100%;
    margin-top: 0px;
    overflow: hidden;
  }

  .login-box {
    border-radius: 10px;
  }

  .boxinputlogin {
    border-radius: 0;
    color: #808080;
    box-shadow: none;
    border-bottom-color: #808080;
    border-top-color: #fff0;
    border-left-color: #fff0;
    border-right-color: #fff0;
    background-color: #fff0;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
  }

  .select-arrow {
    color: #808080;
    right: -5px;
    top: 35px;
    width: 30px;
    position: absolute;
    display: block;
    z-index: 10;
    margin: 0 0 0 0;
    pointer-events: none;
  }

  .btn {
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    /*border: 2px solid white;*/
    /*background-color: #0a7c30;*/
    border-radius: 20px;
    color: white;
    padding: 12px 12px;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    width: 90%;
  }

  .bgnc {
    border-radius: 10px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    /*background-color: red;*/
    color: white;
    text-align: center;
    font-size: 12px;
  }

  label {
    color: white;
  }
</style>
