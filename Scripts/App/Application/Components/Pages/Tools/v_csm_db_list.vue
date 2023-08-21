<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="nav-tabs-custom">
          <ul class="nav nav-tabs">
            <li :class="{active: x.id===tabActive}" v-for="x in tabField" v-if="x.show">
              <a href="#" @click.prevent="onTabChange(x.id)"><i class="fas" v-bind:class="xt.isEmpty(x.icon) ? 'fa-circle' : x.icon"></i> <span v-text="x.text"></span></a>
            </li>
            <li class="pull-right">
              <div v-if="tabActive == 1">
                <button class="btn btn-sm btn-primary" v-on:click="checkNewItems()"><i class="fa fa-plus"></i> ทำรายการใหม่</button>
                <button class="btn btn-sm bg-olive" @click.prevent="save()"><i class="fa fa-save"></i> บันทึกข้อมูล</button>
              </div>
            </li>
          </ul>
          <div class="tab-content">
            <!-- Tab 1 : Passcode -->
            <div class="tab-pane" v-bind:class="{active: tabActive===0}">
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label v-text="ui.search || 'ค้นหา'"></label>
                    <div class="input-group">
                      <input type="text" class="form-control input-sm" v-model="retrieveSearch.text" @keyup.enter="onSearchRetrieve()" />
                      <span class="input-group-btn">
                        <button class="btn btn-sm bg-navy" @click.prevent="onSearchRetrieve()"><i class="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Table : Passcode -->
              <div class="row">
                <div class="col-sm-12">
                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th class="tf-3">Action</th>
                          <th class="tf-2">Item No.</th>
                          <th class="tf-3-5">Customer Code</th>
                          <th class="tf-3-5">Application Type</th>
                          <th class="tf-3-5">Production Type</th>
                          <th class="tf-3-5">Time Schedule</th>
                          <th class="tf-6">Endpoint URL</th>
                          <th class="tf-5">Remark</th>
                          <th class="tf-3">Active</th>
                          <th class="tf-3-5">Add User</th>
                          <th class="tf-3-5">Add Date</th>
                          <th class="tf-3-5">Edit User</th>
                          <th class="tf-3-5">Edit Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="form-group" v-for="(x, idx) in passcodeListData">
                          <td align="center">
                            <a class="text-black" href="#" @click.prevent="editData(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                            <a class="text-danger" href="#" @click.prevent="onDel(x)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                          </td>
                          <td align="center">{{x.itemno}}</td>
                          <td>{{x.customer_code}}</td>
                          <td align="center">{{x.app_type}}</td>
                          <td align="center">{{x.prod_type}}</td>
                          <td align="center">{{x.action_time |date('DD/MM/YYYY HH:mm')}}</td>
                          <td>{{x.endpoint_url}}</td>
                          <td>{{x.remark}}</td>
                          <td align="center" :class="{'text-success': x.active == 'Y', 'text-danger': x.active == 'N' || x.active == null}">
                            <span v-text="x.active == 'Y' ? 'Yes': x.active == 'N' ? 'No':'No'"></span>
                          </td>
                          <td>{{x.adduser}}</td>
                          <td>{{x.adddate |date('DD/MM/YYYY HH:mm')}}</td>
                          <td>{{x.edituser}}</td>
                          <td>{{x.editdate |date('DD/MM/YYYY HH:mm')}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <pagination class="pull-left" ref="retrieve_paging" @page-change="pageChange($event.page, 'Retrieve')"></pagination>
                </div>
              </div>
            </div>
            <!-- Tab 2 : Create Passcode -->
            <div class="tab-pane" v-bind:class="{active: tabActive===1}">
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(formData.customer_code)}">
                    <label class="text-danger">Customer Code</label>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.customer_code" :disabled="isEdit">
                  </div>

                  <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(formData.customer_code)}">
                    <label class="text-danger" v-text="ui.customer || 'Customer'"></label>
                    <span class="input-group">
                      <input type="text" class="form-control input-sm text-bold" v-model="formData.customer_code" readonly />
                      <span class="input-group-btn">
                        <button class="btn btn-sm bg-navy" @click="openCustomerModal()"><i class="fa fa-search"></i></button>
                      </span>
                    </span>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group">
                    <label>Application Type</label>
                    <select class="form-control input-sm" v-model="formData.app_type" :disabled="isEdit">
                      <option value="PM">Project Status Overview</option>
                      <option value="AUTO_BILL">Auto Create Document Bill Subc. (Progress)</option>
                      <option value="AUTO_RETENTION"> Auto Create Document Bill Subc. (Retention)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label>Production Type</label>
                    <select class="form-control input-sm" v-model="formData.prod_type" :disabled="isEdit">
                      <option value="DEMO">Demo</option>
                      <option value="TRAIN">Tranning</option>
                      <option value="PROD">Production</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Time Schedule</label>
                    <!--<timepicker input-class="form-control input-sm" v-model.trim="formData.action_time"></timepicker>-->
                    <timepicker v-model.trim="formData.action_time" format="HH:mm"></timepicker>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label>Active</label>
                    <select class="form-control input-sm" v-model="formData.active">
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Endpoint URL</label>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.endpoint_url">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label>Remark</label>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.remark">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>

    <vue-cm-customer-list ref="customer" @send-data="sendComponent($event, 'customer')"></vue-cm-customer-list>
  </div>
</template>

<script type="text/javascript">
  let page = {};
  let retrieve_paging = {};
  let paging = {};
  let process = false;
  let cpn = {
    data() {
      return {
        auth,
        baseUrl,
        baseRoute,
        queryString,
        ui: window.ui,
        xt: $xt,
        passcodeListData: [],
        retrieveSearch: {},
        formData: {
          prod_type: 'DEMO',
          active: 'N',
          app_type: 'PM'
        },
        appListData: [],
        appTypeData: [],
        isEdit: false,
        tabField: [
          { id: 0, text: 'รายการข้อมูล', show: true, icon: "" },
          { id: 1, text: 'เพิ่ม/แก้ไขข้อมูล', show: true, icon: "" },
        ],
        tabActive: 0,
      };
    },
    methods: {
      showAppList() {
        return $linq(this.appListData).toArray();
      },
      pageChange(pn, keyword) {
        switch (keyword) {
          case "Retrieve":
            pn = pn || 1;
            retrieve_paging.setCurrentPage(pn);
            this.loadData();
            break;
        }
      },
      newItems() {
        this.isEdit = false;
        this.formData = {};
        this.appListData = [];
      },
      checkNewItems() {
        if (this.isEdit) {
          $confirm('คุณต้องสร้างรายการใหม่ใช่หรือไม่', () => {
            this.newItems();
          });
        } else {
          this.newItems();
        }
      },
      onTabChange(t) {
        this.tabActive = t;
      },
      reset() {
        (async () => {
          this.isEdit = false;
          this.$set(this, "formData", {
            customer_code: "",
            action_time: "",
            endpoint_url: "",
            remark: "",
            active: "N",
            prod_type: "DEMO",
            app_type: "PM"
          });
        })();
      },
      onSearchRetrieve() {
        this.pageChange(1, "Retrieve");
      },
      async editData(x) {
        this.tabActive = 1;
        this.isEdit = true;
        $linq(this.tabData).where(x => x.id == 'tab2').foreach(x => this.$set(x, 'show', true));
        this.tabSelected = 'tab2';

        let ac = `CSM/Tools/DBList_Read?itemno=${x.itemno}&customer_code=${x.customer_code}`;
        let rsp = await $xt.getServer(ac);
        this.formData = rsp;
      },
      async loadData() {
        let act = `CSM/Tools/DBList_ReadList?skip=${retrieve_paging.skipItems()}&take=${retrieve_paging.getItemsPerPage()}`;
        for (var key in this.retrieveSearch) {
          act += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;

        }
        let rsp = await $xt.getServer(act);
        this.appTypeData = rsp.app_type;
        $linq(rsp.data).foreach(x => {
          x.checked = false;

        });
        this.passcodeListData = rsp.data;
        console.log(this.passcodeListData);
        retrieve_paging.setTotalItems(rsp.total);
        if (!retrieve_paging.getItemsPerPage()) {
          retrieve_paging.setCurrentPage(1);
        }
        retrieve_paging.createPagesArray();
      },
      async onDel(x) {
        try {
          let f = {
            header: x
          };

          if (!await $msg.confirm(`ท่านต้องการจะลบ Customer Code : ${x.customer_code} ใช่หรือไม่ ?`)) {
            return;
          }

          let url = `CSM/Tools/DBList_Delete`;
          let rsp = await $xt.postServerJson(url, f);
          if (!rsp.success) {
            $msg.alert(`เกิดข้อผิดพลาด`, rsp.error, `danger`);
            return;
          }
          $notify.success(this.ui.alert_delete_success);
          this.formData = {
            prod_type: 'DEMO',
            active: 'N'
          };


          await this.loadData();

        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async save() {
        if (process) return;

        try {
          let f = {
            header: this.formData
          };

          let act = `CSM/Tools/DBList_Create`;

          if (this.isEdit) {
            act = `CSM/Tools/DBList_Update`;
          }

          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          //await this.readData(rsp.data);
          await this.loadData();

          $notify.success(this.ui.alert_save_success);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
        this.reset();
      },
      openCustomerModal() {
        this.$refs.customer.openModal();
      },
      async sendComponent(e, type) {
        switch (type) {
          case "cm_customer":
            this.$set(this.formData, "customer_code", e.customer_code);
            break;
        }
      },
      //Methods
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = '';
      document.title = page.pageTitle;

      retrieve_paging = this.$refs.retrieve_paging;
      retrieve_paging.setCurrentPage(1);
      retrieve_paging.setItemsPerPage(10);

      this.loadData();
    }
  };
  export default cpn;
</script>
<style scoped>

  .text-success {
    color: #00c116 !important;
  }

  .text-danger {
    color: #ff0000 !important;
  }
</style>
