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
                      <input type="text" class="form-control input-sm" v-model="retrieveSearch.search" @keyup.enter="onSearchRetrieve()" />
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
                          <th class="tf-3">Manage</th>
                          <th class="tf-2-5">No.</th>
                          <th>Passcode</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="form-group" v-for="(x, idx) in passcodeListData">
                          <td align="center">
                            <a class="text-black" href="#" @click.prevent="editData(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                            <a class="text-danger" href="#" @click.prevent="onDel(x)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                          </td>
                          <td align="center">{{idx+1}}.</td>
                          <td>{{x.cus_code}}</td>
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
                  <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(formData.cus_code)}">
                    <label class="text-danger">Passcode</label>
                    <input type="text" class="form-control input-sm" id="cus_code" v-model.trim="formData['cus_code']" ref="passcode" placeholder="Enter Passcode here...">
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label>Password</label>
                    <input type="text" class="form-control input-sm" id="user_pass" v-model.trim="formData['user_pass']" placeholder="Enter Password here...">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Line Token</label>
                    <input type="text" class="form-control input-sm" id="app_path_prod" v-model.trim="formData['line_token']" placeholder="Line Token">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Production Path</label>
                    <input type="text" class="form-control input-sm" id="app_path_prod" v-model.trim="formData['app_path_prod']" placeholder="Enter Production Path...">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Demo Path</label>
                    <input type="text" class="form-control input-sm" id="app_path_demo" v-model.trim="formData['app_path_demo']" placeholder="Enter Demo Path...">
                  </div>
                </div>
                <div class="col-sm-2 pull-right">
                  <div class="pull-right" style="margin-top:23px">
                    <button class="btn btn-sm btn-tumblr" @click.prevent="addcarabal()"><i class="fa fa-plus "></i> เพิ่มรายการ</button>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="table-responsive ">
                    <table class="table table-bordered table-striped table-hover">
                      <thead>
                        <tr>
                          <th class="tf-2-5">Manage</th>
                          <th class="tf-2-5">No.</th>
                          <th class="tf-4">Application Type</th>
                          <th>Production Path</th>
                          <th>Demo Path</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="form-group" v-for="(x, idx) in showAppList()">
                          <td align="center"><a class="text-danger" href="#" @click.prevent="removeAppList(idx)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a></td>
                          <td align="center">{{x.itemno}}.</td>
                          <td>
                            <select class="form-control input-sm" v-model.trim="x.app_type">
                              <option value="">-- Please Select --</option>
                              <option v-for="x in appTypeData" v-bind:value="x.id">{{x.name}}</option>
                            </select>
                          </td>
                          <td><input type="text" class="form-control input-sm" v-model="x.app_path_prod"></td>
                          <td><input type="text" class="form-control input-sm" v-model="x.app_path_demo"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>
  </div>
</template>

<script type="text/javascript">
  let page = {};
  let retrieve_paging = {};
  let paging = {};
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
        formData: {},
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
      addcarabal() {
        let itemno = this.appListData.length == 0 ? 1 : ($linq(this.appListData).select(x => x.itemno).max() || 0) + 1;
        this.appListData.push({
          itemno: itemno++,
          app_type: "",
          app_path_prod: "",
          app_path_demo: "",
        })
      },
      async removeAppList(x) {
        if (!await $msg.confirm('คุณกำลังจะลบ Path App นี้ โปรดยืนยัน')) {
          return;
        }
        this.appListData.splice(x, 1);
        let max = 1;
        let q = $linq(this.appListData).orderBy(x => x.itemno);
        $linq(q).foreach(x => {
          this.$set(x, 'itemno', max++);
        });
      },
      async onDel(x) {
        if (!await $msg.confirm(`ท่านต้องการจะลบ Passcode : ${x.cus_code} ใช่หรือไม่ ?`)) {
          return;
        }
        let url = `CSM/Tools/DeletePasscode?cus_code=${x.cus_code}`;
        let rsp = await $xt.getServer(url);
        if (!rsp.success) {
          $msg.alert(`เกิดข้อผิดพลาด`, rsp.error, `danger`);
          return;
        }
        $notify.success(this.ui.alert_delete_success);
        this.formData = {};
        //this.passcodeListData = $linq(this.passcodeListData).where(y => y.cus_code != x.cus_code).toArray();
        await this.loadRetrieve();
      },
      async save() {
        try {
          let form = [{
            itemno: 99999,
            cus_active: 'Y',
            cus_code: this.formData['cus_code'],
            user_id: this.formData['user_id'],
            user_pass: this.formData['user_pass'],
            app_path_prod: this.formData['app_path_prod'],
            app_path_demo: this.formData['app_path_demo'],
            line_token: this.formData['line_token'],
          }];

          $linq(this.appListData).foreach(x => {
            form.push(x)
          });

          let url = '';
          if (this.isEdit) {
            url = `CSM/Tools/CustomerDataViewUpdateForEnterprise`
          } else {
            url = `CSM/Tools/CustomerDataViewCreate`
          }

          page.loadingBox.show()
          let rsp = await $xt.postServerJson(url, { form })
          if (!rsp.success) {
            throw rsp.error
          }
          await this.loadRetrieve()
          $msg.alert(`ทำรายการเสร็จสิ้น`, `บันทึกข้อมูล Passcode เสร็จสิ้น`, `success`)
        } catch (ex) {
          $msg.alert(`เกิดข้อผิดพลาด`, ex.toString(), `danger`)
        } finally {
          page.loadingBox.hide()
        }
      },
      async editData(x) {
        this.tabActive = 1;
        this.isEdit = true;
        $linq(this.tabData).where(x => x.id == 'tab2').foreach(x => this.$set(x, 'show', true));
        this.tabSelected = 'tab2';

        let ac = `CSM/Tools/GeneratePasscodeRead?cus_code=${x.cus_code}`;
        let rsp = await $xt.getServer(ac);
        this.formData = rsp.data;
        this.appListData = rsp.app_list;
        this.appTypeData = rsp.app_type;
      },
      onSearchRetrieve() {
        this.pageChange(1, "Retrieve");
      },
      async loadRetrieve() {
        let act = `CSM/Tools/GeneratePasscodeReadList?skip=${retrieve_paging.skipItems()}&take=${retrieve_paging.getItemsPerPage()}`;
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
      pageChange(pn, keyword) {
        switch (keyword) {
          case "Retrieve":
            pn = pn || 1;
            retrieve_paging.setCurrentPage(pn);
            this.loadRetrieve();
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
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'IT : Create Passcode for Tester';
      document.title = page.pageTitle;

      retrieve_paging = this.$refs.retrieve_paging;
      retrieve_paging.setCurrentPage(1);
      retrieve_paging.setItemsPerPage(10);

      this.loadRetrieve();
    }
  };
  export default cpn;
</script>
