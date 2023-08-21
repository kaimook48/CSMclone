<template>
  <div class="wrapper">
    <header class="main-header">
      <a href="#" v-on:click.prevent="" class="logo hidden-xs">
        <!-- mini logo for sidebar mini 50x50 pixels -->
        <span class="logo-mini font-extra"><img :src="`${baseUrl}Content/Images/PNG/LogoSmall.png`" width="50" height="50" style="padding-right:10px;" /></span>
        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg log font-extra">Mango CSM</span>
      </a>
      <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" style="padding-top:16px">
          <span class="sr-only">Toggle navigation</span>
          <span class="hidden-md hidden-sm hidden-xs font-extra" style="margin-left: 10px">{{pageTitle}}</span>
        </a>

        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <li class="hidden-sm hidden-xs" v-if="!xt.isEmpty(auth.extension)" style="margin-top:7px;margin-right:7px;">
              <select class="form-control" v-model="viewStatus" @change="setState()" style="width:150px">
                <option value="" selected="selected" disabled="disabled">-- Select --</option>
                <option v-for="x,idx in stateData" :value="x.state_code" v-show="x.state_code != '11' && x.state_code != '12'">{{x.state_name}}</option>
              </select>
            </li>
            <li class="hidden-sm hidden-xs" v-if="!xt.isEmpty(auth.extension)">
              <a href="#" @click.prevent="">
                <i class="fa fa-phone" style="font-size: 15px;margin-right: 10px"></i> Extension : {{auth.extension || ''}}
              </a>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fas fa-question-circle"></i> ปัญหาและการให้บริการ <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a :href="baseUrl+'page/article'" target="_blank" style="font-size:13px;"><i class="fas fa-table"></i> คำถามที่พบบ่อย (FAQ)</a></li>
                <li><a :href="baseUrl+'page/faq/v_faq_create'" target="_blank" style="font-size:13px;"><i class="fas fa-edit"></i> สร้างหัวข้อคำถามที่พบบ่อย (FAQ)</a></li>
                <li><a :href="baseUrl+'page/faq/v_faq_item_type'" target="_blank" style="font-size:13px;"><i class="fas fa-box-open"></i> สร้างกลุ่มหัวข้อคำถามที่พบบ่อย (FAQ)</a></li>
              </ul>
            </li>
            <li class="dropdown hidden-sm hidden-xs" v-if="is_mango()">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fas fa-wrench"></i> เครื่องมือ <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li v-if="isSuperAdmin() && is_mango()"><a :href="baseUrl+'page/tools/v_csm_tools'" target="_blank" style="font-size:13px;"><i class="fas fa-check-circle"></i> แก้ไขสถานะใบงาน (ผู้พัฒนาเท่านั้น)</a></li>
                <li><a :href="baseUrl+'page/tools/v_csm_doc_running'" target="_blank" style="font-size:13px;"><i class="fas fa-check-circle"></i> Document Running / Form</a></li>
                <li><a :href="baseUrl+'page/tools/v_csm_erp_config'" target="_blank" style="font-size:13px;"><i class="fas fa-check-circle"></i> Software ERP Config</a></li>
                <li><a :href="baseUrl+'page/tracking/v_tracking_bug_001'" target="_blank" style="font-size:13px;"><i class="fas fa-check-circle"></i> Tracking Bug</a></li>
              </ul>
            </li>
            <li class="dropdown hidden-sm hidden-xs" v-if="isDeveloper() && is_mango()">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fas fa-user-shield"></i> สำหรับไอที <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a :href="baseUrl+'page/tools/v_csm_employee'" target="_blank" style="font-size:13px;"><i class="fas fa-user-shield"></i> รายการพนักงานทั้งหมด</a></li>
                <li><a :href="baseUrl+'page/tools/v_csm_passcode'" target="_blank" style="font-size:13px;"><i class="fas fa-key"></i> สร้าง Passcode สำหรับ Test</a></li>
                <li><a :href="baseUrl+'page/tools/v_csm_db_list'" target="_blank" style="font-size:13px;"><i class="fas fa-key"></i> DB List</a></li>
              </ul>
            </li>
            <li class="dropdown hidden-sm hidden-xs" v-if="isAdmin()">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fas fa-user-secret"></i> สำหรับแอดมิน <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a :href="baseUrl+'page/manual/v_csm_manual_list_admin'" target="_blank" style="font-size:13px;"><i class="fas fa-check-circle"></i> ตรวจสอบรายการอัพเดทโปรแกรม</a></li>
              </ul>
            </li>
            <li class="hidden-sm hidden-xs" v-if="is_mango()"><a :href="baseUrl+'page/manual/v_csm_manual_list_v2'" target="_blank"><i class="fas fa-list"></i> รายการอัพเดทโปรแกรม</a></li>
            <!-- Approve -->
            <li class="hidden-sm hidden-xs" v-if="false">
              <a :href="baseUrl+ 'page/approve/v_csm_approve'" target="_blank">
                <i class="fas fa-file-text"></i>
                <span>อนุมัติเอกสาร</span>
              </a>
            </li>
            <!-- Notifications -->
            <li class="dropdown notifications-menu hidden-sm hidden-xs">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                <i class="fas fa-comment"></i>
                <span class="label label-warning" v-if="NotiNewMsg.length > 0">{{NotiNewMsg.length || 0}}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="header">เอกสารที่มีข้อความใหม่ {{NotiNewMsg.length || 0}} รายการ</li>
                <li>
                  <ul class="menu">
                    <li v-for="x,idx in NotiNewMsg">
                      <a :href="baseUrl+'page/transaction/v_csm_trn_001/?job_no=' + x.job_no +'&ref_itemno='+ x.itemno" target="_blank">
                        <span style="font-size:13px">
                          เลขที่เอกสาร <span class="text-bold text-danger" v-text="x.job_no"></span>  <br />
                          Subject : {{x.subject}}<br />
                          Task No. : {{x.itemno}}
                        </span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li class="dropdown notifications-menu hidden-sm hidden-xs">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                <i class="fas fa-bell"></i>
                <span class="label label-danger" v-if="viewNotiDueDate.length > 0">{{viewNotiDueDate.length || 0}}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="header">เอกสารใกล้วันครบกำหนดทั้งหมด {{viewNotiDueDate.length || 0}} รายการ</li>
                <li>
                  <ul class="menu">
                    <li v-for="x,idx in viewNotiDueDate">
                      <a :href="baseUrl+'page/transaction/v_csm_trn_001/?job_no=' + x.job_no" target="_blank">
                        <span style="font-size:13px">
                          เลขที่เอกสาร <span class="text-bold text-danger" v-text="x.job_no"></span>
                          <br /> <span v-show="!xt.isEmpty(x.pre_des)">Project : {{x.pre_des}}</span>
                          <span v-show="!xt.isEmpty(x.dpt_name)">Dpt. : {{x.dpt_name}}</span>
                        </span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" data-toggle="control-sidebar">
                <img :src="`${baseUrl}Content/Images/Icon SVG/man.svg`" width="20" style="margin-bottom:3px" /> <span class="hidden-md hidden-sm hidden-xs">{{(auth.userid || '').toUpperCase()}}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <aside class="main-sidebar">
      <section class="sidebar">
        <div class="user-panel">
          <div class="pull-left image">
            <img :src="`${baseUrl}Content/Images/Icon PNG/man.png`" width="160" class="img-circle" />
          </div>
          <div class="pull-left info">
            <p>{{auth.empname}}</p>
            <a href="#" @click.prevent><i class="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>
        <side-menu ref="sideMenu" :is-mango="is_mango()"></side-menu>
      </section>
    </aside>
    <div class="content-wrapper" style="padding-top:50px !important;">
      <!--Main content-->
      <section class="content">
        <div class="content-body" ref="content_body">
          <slot name="body"></slot>
        </div>
      </section>
    </div>
    <footer class="main-footer font-extra">
      <strong>&copy; {{year===2019 ? '2019':`2019-${year}`}} Mango Consultant Co., Ltd.</strong> | {{auth.mainname}}
    </footer>
    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
      <!-- Create the tabs -->
      <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
        <li class="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-user"></i></a></li>
        <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-bell"></i></a></li>
        <li><a href="#control-sidebar-settings-tab-2" data-toggle="tab"><i class="fa fa-gears"></i></a></li>
      </ul>
      <!-- Tab panes -->
      <div class="tab-content">
        <!-- Home tab content -->
        <div class="tab-pane active" id="control-sidebar-home-tab">
          <h3 class="control-sidebar-heading">Information</h3>
          <ul class="control-sidebar-menu">
            <li>
              <a>
                <i class="menu-icon ion ion-person bg-blue"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">{{auth.empname}}</h4>
                  <p>Last Login : {{new Date() | date('DD/MM/YYYY HH:mm')}}</p>
                </div>
              </a>
            </li>
          </ul>
          <hr />
          <ul class="control-sidebar-menu">
            <li v-if="is_mango()">
              <a :href="baseUrl+'page/customerdata/'" target="_blank">
                <i class="menu-icon fas fa-users bg-teal"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">ข้อมูลลูกค้า</h4>
                </div>
              </a>
            </li>
            <li v-if="is_mango() && isDeveloper()">
              <a :href="baseUrl+'page/master/'" target="_blank">
                <i class="menu-icon fas fa-folder bg-navy"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">ข้อมูลมาสเตอร์</h4>
                </div>
              </a>
            </li>
            <li>
              <a href="#" v-on:click.prevent="logoutClick()">
                <i class="menu-icon fa fa-key bg-red"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">{{ui.log_out}}</h4>
                </div>
              </a>
            </li>
          </ul>
        </div>
        <!-- /.tab-pane -->
        <!-- Settings tab content -->
        <div class="tab-pane" id="control-sidebar-settings-tab">
          <h4 class="control-sidebar-heading">{{ui.notification}}</h4>
        </div>
        <!-- /.tab-pane -->
        <!-- Settings tab content -->
        <div class="tab-pane" id="control-sidebar-settings-tab-2">
          <h4 class="control-sidebar-heading">{{ui.user_setting}}</h4>
          <ul class="control-sidebar-menu">
            <li>
              <a href="javascript:void(0)">
                <i class="menu-icon fa fa-key bg-yellow"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">{{ui.change_password}}</h4>
                </div>
              </a>
            </li>
            <li>
              <a href="#" v-on:click.prevent="changeLanguage()">
                <i class="menu-icon fa fa-globe bg-aqua"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">{{ui.select_language}}</h4>
                </div>
              </a>
            </li>
            <li v-if="auth.userid.toUpperCase() == 'MANGO' || auth.is_admin">
              <a :href="dataServer" target="_blank">
                <i class="menu-icon fas fa-database bg-black"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">โปรแกรมฐานข้อมูล</h4>
                </div>
              </a>
            </li>
          </ul>
          <hr />
          <h4 class="control-sidebar-heading">App Build No.</h4>
          <p>{{viewVersion}} </p>
          <h4 class="control-sidebar-heading">Api Build No.</h4>
          <p>{{appinfo.build_version}}</p>
          <h4 class="control-sidebar-heading">Users Online</h4>
          <p>{{onlineUser.current}} of {{onlineUser.max}}</p>
        </div>
        <!-- /.tab-pane -->
      </div>
    </aside>
    <!-- /.control-sidebar -->
    <!-- Add the sidebar's background. This div must be placed immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
    <loading-box ref="myLB"></loading-box>
    <logout ref="logout"></logout>
    <change-lang ref="changeLang"></change-lang>
    <!-- Modal : Pop-up Call Center -->
    <modal ref="phoneModal">
      <template slot="header">
        <h3 class="text-center"><i class="fa fa-bell shake text-danger"></i> Incoming Call</h3>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="text-center">
              <h2><i class="ion ion-android-phone-portrait"></i> Tel. : <span v-text="viewPhone"></span></h2>
              <h3 v-if="xt.isEmpty(viewData.customer_name)">ไม่พบรายชื่อลูกค้าจากเบอร์โทรดังกล่าว</h3>
              <template v-if="!xt.isEmpty(viewData.customer_name)">
                <h3 v-text="viewData.customer_name"></h3>
                <h5>Project / โครงการ : [{{viewData.pre_event}}] {{viewData.pre_des}}</h5>
                <h5 v-text="viewData.address"></h5>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="pull-left">
          <button class="btn btn-sm bg-olive" v-if="xt.isEmpty(viewData.customer) && !is_mango()" @click="newCusByRing()"><i class="fas fa-user-plus"></i> New Customer</button>
        </div>
        <button class="btn btn-sm bg-navy" @click="popupDocument()"><i class="fas fa-edit"></i> Create Document</button>
      </template>
    </modal>
    <!-- Modal Customer -->
    <modal ref="addCustomerModal">
      <template slot="header">
        <h4><i class="fa fa-edit"></i> New Customer</h4>
      </template>
      <template slot="body">
        <!-- Callout -->
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="callout callout-info">
              <h4>คำแนะนำ</h4>
              <p>หากบันทึกข้อมูลส่วนนี้แล้วกรุณาไปกรอกข้อมูลเพิ่มเติมที่ <a href="#" @click.prevent="openMasCustomer()">Master Customer</a> ด้วย</p>
            </div>
          </div>
        </div>
        <!-- First Name , Last Name , Nickname -->
        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4">
            <div class="form-group">
              <label class="text-danger">ชื่อ (Firstname)</label>
              <input type="text" class="form-control" v-model="customerData['first_name']" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4">
            <div class="form-group">
              <label class="text-danger">นามสกุล (Lastname)</label>
              <input type="text" class="form-control" v-model="customerData['last_name']" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-4">
            <div class="form-group">
              <label>ชื่อเล่น (Nickname)</label>
              <input type="text" class="form-control" v-model="customerData['nickname']" />
            </div>
          </div>
        </div>
        <!-- Tel , Email -->
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-6">
            <div class="form-group">
              <label><i class="ion ion-ios-telephone"></i> Tel.</label><span class="pull-right">(ex. 02xxxxxxx หรือ 09xxxxxxxx)</span>
              <input type="text" class="form-control" v-model="customerData['tel']" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6">
            <div class="form-group">
              <label><i class="ion ion-email"></i> E-mail</label><span class="pull-right">(ex. mangoconsultant@gmail.com)</span>
              <input type="text" class="form-control" v-model="customerData['mail']" />
            </div>
          </div>
        </div>
        <!-- Create CSM by Customer -->
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <b>รหัสลูกค้านี้ สามารถนำไปเปิดใบ CSM ได้ทันที โดยคลิกที่รหัสลูกค้า ดังกล่าว </b><a href="#" @click.prevent="openReqbyCustomer()">{{customerRef.customer_code}}</a>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn-sm btn-success" @click="createCustomer()"><i class="fa fa-save"></i> Save</button>
      </template>
    </modal>
    <div class="phone" v-show="auth.extension">
      <a href="#" @click.prevent="$refs.phoneModal.openModal()">
        <div class="quick-alo-ph-circle"></div>
        <div class="quick-alo-ph-circle-fill"></div>
        <div class="quick-alo-ph-img-circle"></div>
      </a>
    </div>
  </div>
  <!-- ./wrapper -->
  <!-- Modal : Language Selected -->
</template>

<script>
  import loadingBox from '../Center/loading-box.vue'
  import logout from '../Center/logout.vue'
  import changeLang from '../Center/change-language.vue'
  import sideMenu from './menu.vue'

  let xR = {}
  let docheck = null
  let cpn = {
    components: {
      loadingBox,
      logout,
      changeLang,
      sideMenu,
    },
    data() {
      return {
        year: moment().year(),
        pageTitle: '',
        auth: window.auth,
        ui: window.ui,
        appinfo: window.appinfo,
        dataServer: window.dataServer,
        uiLangList: [],
        uiLangActive: 'TH',
        loadingBox: {},
        onlineUser: {
          current: 0,
          max: 0
        },
        viewVersion: window.viewVersion,
        viewStatus: "",
        viewNotiDueDate: [],
        NotiNewMsg: [],
        viewData: {},
        viewPhone: "",
        stateData: [],
        xt: $xt,
        baseUrl,
        customerData: {},
        customerRef: {},
        empsign: {},
        getConfig: [],
      }
    },
    methods: {
      /* Main Method */
      logoutClick() {
        this.$refs.logout.openModal()
      },
      changeLanguage() {
        this.$refs.changeLang.openModal()
      },
      initSignalR() {
        let cfn = {
          sessionResult: (resp) => {
            this.$set(this, 'onlineUser', { current: resp.count, max: resp.max })
          },
          popUp: (resp, phone) => {
            this.viewData = JSON.parse(resp) || {}
            this.viewPhone = phone
            this.$refs.phoneModal.openModal()
          },
          notifyCSM: (msg, status) => {
            switch (status) {
              case 'W': $notify.warning(msg)
                break
              case 'R': $notify.error(msg)
                break
              case 'S': $notify.success(msg)
                break
              default: $notify.info(msg)
                break
            }
          },
          reloadCallHistory: () => {
            try {
              this.$parent.loadHistoryService()
            }
            catch (ex) { }
          },
          reloadCallCenter: () => {
            try {
              this.$parent.loadCustomerService()
            }
            catch (ex) { }
          },
          reloadTransaction: () => {
            try {
              this.$parent.loadTotal()
              this.$parent.loadData()
            }
            catch (ex) { }
          },
        }
        xR = window.signalR(cfn, () => {
          if (xR.hubProxy && xR.hubProxy.isConnectionOwner()) {
            if (docheck) clearInterval(docheck)

            xR.reHub.server.userOnlineCheck(localStorage.getItem('mango_auth') || '')
            console.log('Session Checkpoint @ ' + moment().format())
            docheck = setInterval(() => {
              xR.reHub.server.userOnlineCheck(localStorage.getItem('mango_auth') || '')
              console.log('Session Checkpoint @ ' + moment().format())
            }, 60000)
          }
        })
      },
      updateOnlineUser() {
        (async () => {
          let url = baseUrl + 'api/public/UserOnlineCount'
        })()
      },
      redirectLogin() {
        window.location = baseUrl
      },
      /* Other Method */
      async loadNotiDueDate() {
        let act = `CSM/Data/NotificationDocument`
        let rsp = await $xt.getServer(act)
        this.viewNotiDueDate = rsp.data
      },
      async loadNotiNewMsg() {
        let act = `CSM/Data/NotificationNewMessages`
        let rsp = await $xt.getServer(act)
        this.NotiNewMsg = rsp.data
      },
      async loadState() {
        let act = `csm/config/State_ReadList`
        let rsp = await $xt.getServer(act)
        this.$set(this, "stateData", $linq(rsp.data.data_rows).where(x => !['11', '12'].includes(x.state_code)).toArray())
      },
      async setState() {
        let act = `CSM/Data/ChangeState?state_code=${this.viewStatus}`
        let rsp = await $xt.getServer(act)
        if (rsp.success) {
          localStorage.setItem("viewStatus", rsp.data)
        }
        else {
          $msg.alert(`Error`, rsp.error, `danger`)
        }
      },
      popupDocument() {
        if (JSON.stringify(this.viewData) == '{}') {
          this.viewData.phone = this.viewPhone
        }
        localStorage.setItem("Customer-Popup-CSM", JSON.stringify(this.viewData))
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/`, "_blank")
      },
      async loadEmpSign() {
        let act = `CSM/Center/GetEmpSign`
        let rsp = await $xt.getServer(act)
        this.empsign = rsp.data
      },
      /* Add Customer Method */
      openCustomer() {
        this.$refs.addCustomerModal.openModal()
        this.customerData = {}
        this.customerRef = {}
      },
      async createCustomer() {
        try {
          if ($xt.isEmpty(this.customerData["first_name"]) || $xt.isEmpty(this.customerData["last_name"])) {
            $notify.warning("กรุณากรอกชื่อหรือนามสกุลให้ครบถ้วนก่อนทำการบันทึกข้อมูล")
            return -1
          }
          let f = {
            header: this.customerData
          }
          let act = `csm/data/CreateCustomer`
          let rsp = await $xt.postServerJson(act, f)
          if (!rsp.success) {
            throw rsp.error
          }
          this.customerRef = rsp.data
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {

        }
      },
      openReqbyCustomer() {
        localStorage.setItem("X-Customer-CSM", JSON.stringify(this.customerRef))
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/`, "_blank")
      },
      openMasCustomer() {
        localStorage.setItem("X-Master-Customer", JSON.stringify(this.customerRef))
        window.open(this.baseUrl + `page/Customer/v_csm_cus_001/`, "_blank")
      },
      newCusByRing() {
        this.$refs.phoneModal.closeModal()
        this.$refs.addCustomerModal.openModal()
        this.$set(this.customerData, "tel", this.viewPhone)
      },
      /* Config Programs Method */
      is_mango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault()
        return isMango == "Y" ? true : false
      },
      isDeveloper() {
        let department = auth.empcode.substring(0, 2)
        return department == 'IT'
      },
      isAdmin() {
        return [983, 211, 154, 172, 202, 253, 324, 310, 223].includes(this.auth.empno)
      },
      isSuperAdmin() {
        return [983, 211, 253, 324, 310, 223, 207, 121, 259].includes(this.auth.empno)
      },
      isApprove() {
        let isApprove = $linq(this.empsign).where(x => x.empcode == auth.empcode).select(x => x.empcode).firstOrDefault()
        return isApprove == auth.empcode ? true : false
      },
    },
    computed: {
      configData() { return store.state.configData },
    },
    async beforeMount() {
      await this.$store.dispatch('findConnection')
      await this.$store.dispatch('findRequest')
      await this.$store.dispatch('findPriority')
      await this.$store.dispatch('findService')
      await this.$store.dispatch('findConfig')
    },
    async mounted() {
      this.initSignalR()
      this.loadingBox = this.$refs.myLB

      this.$refs.phoneModal.setSize("modal-lg")
      this.$refs.addCustomerModal.setSize("modal-lg")

      if ($xt.isEmpty(localStorage.getItem("viewStatus")))
        this.viewStatus = ""
      else
        this.viewStatus = localStorage.getItem("viewStatus")

      this.loadNotiDueDate()

      this.loadNotiNewMsg()

      if (!$xt.isEmpty(this.auth.extension)) {
        this.loadState()
      }

      this.$nextTick(async () => {
        $(window).trigger('resize')
      })

    }
  }
  export default cpn
</script>

<style scoped>
  .content-body {
  }

  .quick-alo-phone .quick-alo-show {
    visibility: visible;
  }

  .quick-alo-phone {
    position: fixed;
    visibility: hidden;
    background-color: transparent;
    height: 200px;
    width: 82px;
    height: 64px;
    right: 150px;
    top: 60%;
    cursor: pointer;
    z-index: 200000 !important;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transition: visibility .5s;
  }

    .quick-alo-phone .quick-alo-green .quick-alo-ph-circle {
      border-color: #00A1FF;
      opacity: 0.5;
    }

  .quick-alo-ph-circle {
    position: fixed;
    width: 160px;
    height: 160px;
    bottom: -30px;
    right: -20px;
    border: 2px solid #00A1FF;
    background-color: transparent;
    border-radius: 100%;
    opacity: .1;
    animation: quick-alo-circle-anim 1.2s infinite ease-in-out;
    transition: all .5s;
    transform-origin: 50% 50%;
  }

  .quick-alo-phone .quick-alo-green .quick-alo-ph-circle-fill {
    background-color: rgb(246, 202, 98);
    opacity: .75 !important;
  }

  .quick-alo-ph-circle-fill {
    position: fixed;
    width: 100px;
    height: 100px;
    bottom: 1px;
    right: 10px;
    background-color: rgba(0, 161, 255, 0.5);
    border-radius: 100%;
    border: 2px solid transparent;
    opacity: .1;
    animation: quick-alo-circle-fill-anim 2.3s infinite ease-in-out;
    transition: all .5s;
    transform-origin: 50% 50%;
  }

  .quick-alo-phone.quick-alo-green .quick-alo-ph-img-circle {
    background-color: #00A1FF;
  }

  .quick-alo-ph-img-circle {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 20px;
    right: 30px;
    background: #00A1FF url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABrklEQVRYR82XjTEEQRCFX0dABlwEiAARkAEyIAJEoERACETARUAIJwIyeOqptfbm5qeP3lpTdVVXVzPd3/R0v+4zTLxsYv/4XwAkrwDsV6JyZmaLyKj1ESB5AOCpYfzazAQZttYFuDWz8zDvwE8OkNwF8NIwvjCz2SgAMkqSDuOzyDxYqgKSrwB2GhBKxHsHqGtLCiDDJ42Tj2Z27LLu2JQCnAK4a5x7M7Nth23XlhRgE8B74+SemempQtaKEpKsPUPo++sGOYCSIIU7zwJ05ficSLLkV6H/CIn7wEi2GRVkOVwFixEoREE/hz9DsR2TVKkp2zeSsI9bBUNnJNV4bhIA5cFhVCk2B5JCWVYhSEopjwAob6qa4QGQOKkqcj1iJSdIpmoqWEHIhr7Ph1BNgC4haxAPAC7UITPOc1UrCOXR12TlAnBAyKhAdHvPUg4pIn6AAYQc1ebG8QC+LXfD66XHU2HP7yKQlKhGODWu1gCTY/g7wCAaendNyltrRCQOIAERjCc/ejV1V4H3dp2ES4jU1vVJpXxpogoHSEE7oOEIp9G+/3c1OkArcpMDfAIqL6EhVS6JOAAAAABJRU5ErkJggg==") no-repeat center center;
    border-radius: 100%;
    border: 2px solid transparent;
    opacity: .99;
    animation: quick-alo-circle-img-anim 1s infinite ease-in-out;
    transform-origin: 50% 50%;
  }

  .quick-alo-phone .quick-alo-green .quick-alo-hover .quick-alo-ph-img-circle,
  .quick-alo-phone.quick-alo-green:hover .quick-alo-ph-img-circle {
    background-color: #ff0101;
  }

  @-moz-keyframes quick-alo-circle-anim {
    0% {
      -moz-transform: rotate(0) scale(.5) skew(1deg);
      opacity: .1;
      -moz-opacity: .1;
      -webkit-opacity: .1;
      -o-opacity: .1
    }

    30% {
      -moz-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .5;
      -moz-opacity: .5;
      -webkit-opacity: .5;
      -o-opacity: .5
    }

    100% {
      -moz-transform: rotate(0) scale(1) skew(1deg);
      opacity: .6;
      -moz-opacity: .6;
      -webkit-opacity: .6;
      -o-opacity: .1
    }
  }

  @-webkit-keyframes quick-alo-circle-anim {
    0% {
      -webkit-transform: rotate(0) scale(.5) skew(1deg);
      -webkit-opacity: .1
    }

    30% {
      -webkit-transform: rotate(0) scale(.7) skew(1deg);
      -webkit-opacity: .5
    }

    100% {
      -webkit-transform: rotate(0) scale(1) skew(1deg);
      -webkit-opacity: .1
    }
  }

  @-o-keyframes quick-alo-circle-anim {
    0% {
      -o-transform: rotate(0) kscale(.5) skew(1deg);
      -o-opacity: .1
    }

    30% {
      -o-transform: rotate(0) scale(.7) skew(1deg);
      -o-opacity: .5
    }

    100% {
      -o-transform: rotate(0) scale(1) skew(1deg);
      -o-opacity: .1
    }
  }

  @-moz-keyframes quick-alo-circle-fill-anim {
    0% {
      -moz-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .2
    }

    50% {
      -moz-transform: rotate(0) -moz-scale(1) skew(1deg);
      opacity: .2
    }

    100% {
      -moz-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .2
    }
  }

  @-webkit-keyframes quick-alo-circle-fill-anim {
    0% {
      -webkit-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .2
    }

    50% {
      -webkit-transform: rotate(0) scale(1) skew(1deg);
      opacity: .2
    }

    100% {
      -webkit-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .2
    }
  }

  @-o-keyframes quick-alo-circle-fill-anim {
    0% {
      -o-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .2
    }

    50% {
      -o-transform: rotate(0) scale(1) skew(1deg);
      opacity: .2
    }

    100% {
      -o-transform: rotate(0) scale(.7) skew(1deg);
      opacity: .2
    }
  }

  @-moz-keyframes quick-alo-circle-img-anim {
    0% {
      transform: rotate(0) scale(1) skew(1deg)
    }

    10% {
      -moz-transform: rotate(-25deg) scale(1) skew(1deg)
    }

    20% {
      -moz-transform: rotate(25deg) scale(1) skew(1deg)
    }

    30% {
      -moz-transform: rotate(-25deg) scale(1) skew(1deg)
    }

    40% {
      -moz-transform: rotate(25deg) scale(1) skew(1deg)
    }

    50% {
      -moz-transform: rotate(0) scale(1) skew(1deg)
    }

    100% {
      -moz-transform: rotate(0) scale(1) skew(1deg)
    }
  }

  @-webkit-keyframes quick-alo-circle-img-anim {
    0% {
      -webkit-transform: rotate(0) scale(1) skew(1deg)
    }

    10% {
      -webkit-transform: rotate(-25deg) scale(1) skew(1deg)
    }

    20% {
      -webkit-transform: rotate(25deg) scale(1) skew(1deg)
    }

    30% {
      -webkit-transform: rotate(-25deg) scale(1) skew(1deg)
    }

    40% {
      -webkit-transform: rotate(25deg) scale(1) skew(1deg)
    }

    50% {
      -webkit-transform: rotate(0) scale(1) skew(1deg)
    }

    100% {
      -webkit-transform: rotate(0) scale(1) skew(1deg)
    }
  }

  @-o-keyframes quick-alo-circle-img-anim {
    0% {
      -o-transform: rotate(0) scale(1) skew(1deg)
    }

    10% {
      -o-transform: rotate(-25deg) scale(1) skew(1deg)
    }

    20% {
      -o-transform: rotate(25deg) scale(1) skew(1deg)
    }

    30% {
      -o-transform: rotate(-25deg) scale(1) skew(1deg)
    }

    40% {
      -o-transform: rotate(25deg) scale(1) skew(1deg)
    }

    50% {
      -o-transform: rotate(0) scale(1) skew(1deg)
    }

    100% {
      -o-transform: rotate(0) scale(1) skew(1deg)
    }
  }

  @-moz-keyframes fadeInRight {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      -ms-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0)
    }

    100% {
      opacity: 1;
      -webkit-transform: none;
      -ms-transform: none;
      transform: none
    }
  }

  @-webkit-keyframes fadeInRight {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      -ms-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0)
    }

    100% {
      opacity: 1;
      -webkit-transform: none;
      -ms-transform: none;
      transform: none
    }
  }

  @-o-keyframes fadeInRight {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      -ms-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0)
    }

    100% {
      opacity: 1;
      -webkit-transform: none;
      -ms-transform: none;
      transform: none
    }
  }

  .shake {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>
