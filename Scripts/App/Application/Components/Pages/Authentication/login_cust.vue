<template>
  <div class="wrapper">
    <ul class="bg-bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <div class="row">
        <div class="col-lg-4 visible-lg" style="background-color:white;width: 30%;height: 500%;top: 75px;left: 33.5%;padding: 5% 2%;border-radius: 50%;">
          <center>
            <img src="http://www.thaitechno.net//uploadedimages/Logo_45569_404322426_fullsize.png" style="width:80%;" />
            <br /><br /><br />
            <div class="input-group ">
              <span class="input-group-addon boxinputlogin">
                <span class="glyphicon glyphicon-user" aria-hidden="true">
                </span>
              </span>
              <input type="text" class="form-control  boxinputlogin input-lg" placeholder="Username" v-model="form['userid']" v-on:keyup.enter="submit">
            </div>
            <br />
            <div class="input-group">
              <span class="input-group-addon boxinputlogin">
                <span class="glyphicon glyphicon-lock" aria-hidden="true">
                </span>
              </span>
              <input type="password" class="form-control boxinputlogin input-lg" placeholder="Password" v-model="form['userpass']" v-on:keyup.enter="submit">
            </div>
            <div>
              <button type="submit" style="margin-top:18%;border-style: solid;border-color: #c8c8c8;" class="button-login btn-block btn-flat " v-on:click="submit"><i class="fa" :class="{'fa-spinner fa-spin': isLoading}"></i> Login</button>
            </div>
          </center>
        </div>
        <div class="col-lg-4 visible-xs visible-sm visible-md" style="background-color:white;width: 64%;height: 500%;top: 170px;left: -19px;padding: 5% 5%;border-radius: 2%;margin: auto;">
          <center>
            <img src="http://www.thaitechno.net//uploadedimages/Logo_45569_404322426_fullsize.png" style="width:47%;" />
            <br /><br /><br />
            <div class="input-group ">
              <span class="input-group-addon boxinputlogin">
                <span class="glyphicon glyphicon-user" aria-hidden="true">
                </span>
              </span>
              <input type="text" class="form-control  boxinputlogin input-lg" placeholder="Username" v-model="form['userid']" v-on:keyup.enter="submit">
            </div>
            <br />
            <div class="input-group">
              <span class="input-group-addon boxinputlogin">
                <span class="glyphicon glyphicon-lock" aria-hidden="true">
                </span>
              </span>
              <input type="password" class="form-control boxinputlogin input-lg" placeholder="Password" v-model="form['userpass']" v-on:keyup.enter="submit">
            </div>
            <div>
              <button type="submit" style="margin-top:18%;border-style: solid;border-color: #c8c8c8;" class="button-login btn-block btn-flat " v-on:click="submit"><i class="fa" :class="{'fa-spinner fa-spin': isLoading}"></i> Login</button>
            </div>
          </center>
        </div>
      </div>
    </ul>
  </div>
</template>
<script>
  $("body").addClass("login-page");
  let doSubmit = false;
  export default {
    data() {
      return {
        form: {
          maincode: ''
        },
        isLoading: false
      };
    },
    methods: {
      submit() {
        if (doSubmit) return;

        (async () => {
          let f = this.form;
          if (!f.userid || !f.userpass) {
            await $msg.alert('', 'Please fill in all required fields.', 'danger');
            return;
          }
          let action = `CSM/AuthCustomer/Login`;
          try {
            doSubmit = true;
            this.isLoading = true;
            let d = await $xt.postServerJson(action, f)
            if (d.error) {
              await $msg.alert('', d.error, 'danger');
            } else {
              localStorage.setItem("customer_auth", d.data)
              window.location = baseUrl + 'page/external/v_csm_external';
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
    },
    mounted() {

      let logincust = localStorage.getItem("X-Login-Customer");
      if (logincust != null || logincust != undefined) {
        let p = JSON.parse(logincust);
        this.$set(this.form, 'userid', p.passcode);
        this.$set(this.form, 'userpass', p.userpass);
        localStorage.removeItem('X-Login-Customer');
        this.submit();
      }
    }
  };
</script>
<style scoped>
  .back {
    background: #e2e2e2;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .div-center {
    width: 400px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 1em 2em;
    border-bottom: 2px solid #ccc;
    display: table;
  }

  div.content {
    display: table-cell;
    vertical-align: middle;
  }

  .login-box-body {
    background-color: white;
    border-radius: 10px;
    display: block;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }



  /*.button-login {
        background-color: #002735;
        border: none;
        width: 100%;
        color: white;
        padding: 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 8px;
    }*/

  .button-login {
    display: block;
    width: 47%;
    height: 55px;
    outline: 0;
    background: -webkit-linear-gradient(top left, #0085b2 0%, #009e73 50%, #00bd26 100%);
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    border-radius: 75px;
  }

    .button-login:hover {
      background: -webkit-linear-gradient(top left, #008080 0%, #008080 50%, #009900 100%);
      box-shadow: -2px 2px 0px rgba(0, 0, 0, 0.1);
    }

  .wrapper {
    background: #50a3a2;
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    /*background-image: linear-gradient( 179.6deg, rgba(0,19,26,1) -4.9%, rgba(0,77,105,1) 108.4% );*/
    background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
    background-blend-mode: multiply;
    position: absolute;
    top: 0%;
    left: 0;
    width: 100%;
    height: 100%;
    margin-top: 0px;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

    .bg-bubbles li {
      position: absolute;
      list-style: none;
      display: block;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.15);
      bottom: -160px;
      -webkit-animation: square 25s infinite;
      animation: square 25s infinite;
      -webkit-transition-timing-function: linear;
      transition-timing-function: linear;
    }

      .bg-bubbles li:nth-child(1) {
        left: 10%;
      }

      .bg-bubbles li:nth-child(2) {
        left: 20%;
        width: 80px;
        height: 80px;
        -webkit-animation-delay: 2s;
        animation-delay: 2s;
        -webkit-animation-duration: 17s;
        animation-duration: 17s;
      }

      .bg-bubbles li:nth-child(3) {
        left: 25%;
        -webkit-animation-delay: 4s;
        animation-delay: 4s;
      }

      .bg-bubbles li:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        -webkit-animation-duration: 22s;
        animation-duration: 22s;
        background-color: rgba(255, 255, 255, 0.25);
      }

      .bg-bubbles li:nth-child(5) {
        left: 70%;
      }

      .bg-bubbles li:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        -webkit-animation-delay: 3s;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
      }

      .bg-bubbles li:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        -webkit-animation-delay: 7s;
        animation-delay: 7s;
      }

      .bg-bubbles li:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        -webkit-animation-delay: 15s;
        animation-delay: 15s;
        -webkit-animation-duration: 40s;
        animation-duration: 40s;
      }

      .bg-bubbles li:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        -webkit-animation-delay: 2s;
        animation-delay: 2s;
        -webkit-animation-duration: 40s;
        animation-duration: 40s;
        background-color: rgba(255, 255, 255, 0.3);
      }

      .bg-bubbles li:nth-child(10) {
        left: 90%;
        width: 160px;
        height: 160px;
        -webkit-animation-delay: 11s;
        animation-delay: 11s;
      }

  .boxinputlogin {
    border-radius: 0;
    box-shadow: none;
    border-bottom-color: hsla(120, 7.8%, 77.5%, 0.4);
    border-top-color: #fff0;
    border-left-color: #fff0;
    border-right-color: #fff0;
    background-color: #fff0;
  }

  @-webkit-keyframes square {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
      transform: translateY(-700px) rotate(600deg);
    }
  }

  @keyframes square {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    100% {
      -webkit-transform: translateY(-700px) rotate(600deg);
      transform: translateY(-700px) rotate(600deg);
    }
  }
  /*//////////////////////////////// form ///////////////////////////*/
  .glyphicon {
    color: #3d483d;
  }
</style>
