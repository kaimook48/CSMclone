<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active:tab1Active===0}"><a href="#" @click.prevent="changeTab1(0)">Data List ({{datalist.length}})</a></li>
                <li :class="{active:tab1Active===1}"><a href="#" @click.prevent="changeTab1(1)" v-if="permission()">Create / Edit</a></li>
              </ul>
              <div class="tab-content">
                <div class="tab-pane" :class="{active:tab1Active===0}">
                  <div class="row">
                    <div class="col-lg-6 col-md-12">
                      <div class="form-group">
                        <div class="input-group">
                          <input type="text" class="form-control input-sm" v-model.trim="search.text" @keypress.enter="doSearch" />
                          <span class="input-group-btn">
                            <button class="btn btn-sm btn-default" @click="doSearch"><i class="fa fa-search"></i></button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <!--<table-stick width="100%" height="450px">-->
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <!--<th></th>-->
                            <th style="width:1px">#</th>
                            <th style="width:1px" v-if="permission()">Edit</th>
                            <th style="width:50px" class="text-nowrap nowrap" nowrap>Group Code</th>
                            <th class="text-nowrap nowrap" nowrap>Group Name</th>
                            <th class="text-nowrap nowrap" nowrap>Add User</th>
                            <th class="text-nowrap nowrap text-center" nowrap>Add Date</th>
                            <th class="text-nowrap nowrap" nowrap>Edit User</th>
                            <th class="text-nowrap nowrap text-center" nowrap>Edit Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x,idx in datalist">
                            <td class="text-right">{{idx+1}}.</td>
                            <td class="text-center" v-if="permission()"><a href="#" @click.prevent="edit(x)"><i class="fa fa-edit"></i></a> </td>
                            <td class="text-nowrap nowrap" nowrap>{{x.type_code}}</td>
                            <td>{{x.type_name}}</td>
                            <td class="text-nowrap nowrap" nowrap>{{x.add_user}}</td>
                            <td class="text-nowrap nowrap" nowrap align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                            <td class="text-nowrap nowrap" nowrap>{{x.edit_user}}</td>
                            <td class="text-nowrap nowrap" nowrap align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                          </tr>
                        </tbody>
                      </table>
                      <!--</table-stick>-->
                    </div>
                  </div>
                </div>
                <div class="tab-pane" :class="{active:tab1Active===1}">
                  <app-form ref="appForm">
                    <template slot="form-field">
                      <div class="row">
                        <div class="col-lg-2 col-md-6">
                          <div class="form-group">
                            <label class="text-danger">Group Code</label>
                            <input type="text" class="form-control input-sm" v-model.trim="form.type_code" :readonly="editMode" maxlength="20" />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                          <div class="form-group">
                            <label class="text-danger">Group Name</label>
                            <input type="text" class="form-control input-sm" v-model.trim="form.type_name" maxlength="200" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </app-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>
  </div>
</template>
<script>
  let page = {};
  let appForm = {};
  let paging = {};
  let process = false;
  let cpn = {
    data() {
      return {
        auth,
        tab1Active: 0,
        search: {
        },
        datalist: [],
        editMode: false,
        form: {},
        dataAdmin: {},
        ui: window.ui
      };
    },
    methods: {
      changeTab1(t) {
        this.tab1Active = t;
      },
      doSearch() {
        this.loadData();
      },
      reset() {
        this.form = {};
        this.editMode = false;
        appForm.btnDelete.disabled = true;
      },
      setEdit() {
        this.editMode = true;
        appForm.btnDelete.disabled = false;
      },
      async loadData() {
        let act = `csm/master/WarrantyGroup_ReadList?search_text=${encodeURIComponent(this.search.text || '')}&skip=0&take=10000`;
        let rsp = await $xt.getServer(act);
        this.datalist = rsp.data.data_rows;
      },
      async readData(type_code) {
        let act = `csm/master/WarrantyGroup_Read?type_code=${encodeURIComponent(type_code || '')}`;
        let rsp = await $xt.getServer(act);
        this.form = rsp.data;
        this.setEdit();
      },
      async save() {
        if (process) return;

        try {
          let f = {
            header: this.form
          };

          let act = `csm/master/WarrantyGroup_Create`;
          if (this.editMode) {
            act = `csm/master/WarrantyGroup_Update`;
          }

          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.readData(rsp.data);
          await this.loadData();
          this.changeTab1(0);
          this.reset();

          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async deleteData() {
        if (process) return;
        if (!this.editMode) return;

        if (!await $msg.confirm(`คุณต้องการลบ ${this.form.type_name} ใช่หรือไม่`)) {
          return;
        }

        try {

          let f = {
            header: this.form
          };

          let act = `csm/master/WarrantyGroup_Delete`;

          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.reset();
          await this.loadData();
          this.changeTab1(0);
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      edit(x) {
        this.reset();
        this.changeTab1(1);
        $('html,body').scrollTop(0);
        this.readData(x.type_code);
      },
      is_mango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        return isMango == "Y" ? true : false;
      },
      permission() {
        let data = (!this.is_mango() || auth.is_admin);
        return data;
      },
    },
    computed: {
      configData() { return store.state.configData },
    },
    mounted() {
      (async () => {
        page = this.$refs.page;
        page.pageTitle = `Master : กลุ่มงานประกัน`;
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnRetrieve.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnNew.click = this.reset;
        appForm.btnSave.click = this.save;
        appForm.btnDelete.click = this.deleteData;

        this.reset();
        this.loadData();
      })();
    }
  };

  export default cpn;
</script>
