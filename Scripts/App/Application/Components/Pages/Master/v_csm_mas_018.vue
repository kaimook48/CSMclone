<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active:tabActive===0}"><a href="#" @click.prevent="onChangeTab(0)">Data List ({{datalist.length || 0}})</a></li>
                <li :class="{active:tabActive===1}"><a href="#" @click.prevent="onChangeTab(1)" v-if="permission()">Create / Edit</a></li>
              </ul>

              <div class="tab-content">
                <div class="tab-pane" :class="{active:tabActive===0}">
                  <div class="row">
                    <div class="col-lg-6 col-md-12">
                      <div class="form-group">
                        <label>Search</label><span class="pull-right">(ผลลัพธ์การค้นหาพบเจอ {{datalist.length || 0}} รายการ)</span>
                        <div class="input-group">
                          <input type="text" class="form-control" v-model.trim="search.text" @keypress.enter="doSearch" />
                          <span class="input-group-btn">
                            <button class="btn btn-default" @click="doSearch"><i class="fa fa-search"></i></button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-12">
                      <span class="pull-right">
                        <button class="btn btn-sm btn-default" @click="onExport"><i class="fas fa-file-export"></i> Export Excel</button>
                        <button class="btn btn-sm btn-tumblr" @click="addFile"><i class="fas fa-file-import"></i> Import Excel</button>
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                      <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th class="tf-1">#</th>
                              <th class="tf-2 text-center" v-if="permission()">Edit</th>
                              <th class="tf-3 text-center">Code</th>
                              <th class="tf-5">Description</th>
                              <th class="tf-3 text-center">Add User</th>
                              <th class="tf-3 text-center">Add Date</th>
                              <th class="tf-3 text-center">Edit User</th>
                              <th class="tf-3 text-center">Edit Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(x,idx) in datalist">
                              <td align="center">{{idx+1}}.</td>
                              <td align="center" v-if="permission()"><a href="#" @click.prevent="setEdit(x)"><i class="fa fa-edit"></i></a> </td>
                              <td align="center" class="text-bold">{{x.package_code}}</td>
                              <td>{{x.package_name}}</td>
                              <td align="center">{{x.adduser}}</td>
                              <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                              <td align="center">{{x.edituser}}</td>
                              <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 col-md-12">
                      <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" :class="{active:tabActive===1}">
                  <app-form ref="appForm">
                    <template slot="form-field">
                      <div class="row">
                        <div class="col-lg-2 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label class="text-danger">Package Code</label>
                            <input type="text" class="form-control" v-model="form['package_code']" maxlength="10" :disabled="editMode" />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label>Package Description</label>
                            <input type="text" class="form-control" v-model="form['package_name']" maxlength="200" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </app-form>

                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                      <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th class="tf-1">#</th>
                              <th class="tf-2 text-center" v-if="permission()">Delete</th>
                              <th class="tf-3 text-center">Form Code</th>
                              <th class="tf-5">Form Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(x,idx) in detailData">
                              <td align="center">{{idx+1}}.</td>
                              <td align="center" v-if="permission()"><a href="#" @click.prevent="delDetail(x)"><i class="fa fa-trash text-danger"></i></a> </td>
                              <td>{{x.formcode}}</td>
                              <td>{{x.formname}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <input type="file" ref="File" accept=".xls, .xlsx" v-show="false" />
      </template>
    </re-page>

    <!--Center Modal-->
    <vue-form-list ref="form_modal" id="form_modal" @send-data="sendComponent($event, 'form')" :isCheck="this.isCheck"></vue-form-list>
  </div>
</template>
<script>
  import XLSX from 'xlsx';

  let page = {};
  let appForm = {};
  let paging = {};
  let process = false;
  let cpn = {
    data() {
      return {
        ui: window.ui,
        auth,
        tabActive: 0,
        pageNumber: 1,
        editMode: false,
        search: {},
        form: {},
        datalist: [],
        displayData: [],
        detailData: [],
        isShowTab2: false,
        isCheck:[]
      };
    },
    methods: {
      onChangeTab(t) {
        this.tabActive = t;
      },
      async pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        this.$set(this, "displayData", $linq(this.datalist).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
        paging.createPagesArray();
      },
      doSearch() {
        paging.setCurrentPage(1);
        this.loadData();
      },
      resetData() {
        this.editMode = false;
        this.form = {};
        this.detailData = [];
        appForm.btnDelete.disabled = true;
      },
      async loadData() {
        let act = `csm/master/FormPackage_ReadList?search_text=${encodeURIComponent(this.search.text || '')}`;
        let rsp = await $xt.getServer(act);
        this.datalist = rsp.data.data_rows;
        this.total_datalist = rsp.data.total;

        let i = 0;
        $linq(this.datalist).foreach(x => {
          this.$set(x, "item", ++i);
        });
        this.pageChange(this.pageNumber);
        paging.setTotalItems(rsp.data.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async readData(code) {
        page.loadingBox.show();
        let act = `csm/master/FormPackage_Read?code=${encodeURIComponent(code || '')}`;
        let rsp = await $xt.getServer(act);
        this.$set(this, "form", rsp.data.header);
        this.$set(this, "detailData", rsp.data.detail);
        this.setisCheck()
        page.loadingBox.hide();
      },
      async saveData() {
        if (process) return;
        try {
          let f = {
            header: this.form,
            detail: this.detailData
          };
          let act = `CSM/MASTER/FormPackage_CreateAndUpdate`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.loadData();
          await this.readData(rsp.data);
          this.onChangeTab(0);

          $msg.alert(``, `Success`, `success`);
          this.resetData();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async setEdit(x) {
        await this.readData(x.package_code);
        this.editMode = true;
        this.onChangeTab(1);
        appForm.btnDelete.disabled = false;
      },
      async delDetail(x) {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูล : ${x.formcode} นี้ใช่หรือไม่`)) {
          return;
        }
        this.detailData = $linq(this.detailData).where(y => y.formcode != x.formcode).toArray();
        this.setisCheck()
      },
      async deleteData(code) {
        if (process) return;
        if (!this.editMode) return;
        if (!await $msg.confirm(`คุณต้องการลบข้อมูล Package Code : ${code || this.form.package_code} นี้ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            code: code || this.form.package_code
          };
          let act = `CSM/Master/FormPackage_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.resetData();
          await this.loadData();

          $msg.alert(``, `Success`, `success`);
          this.onChangeTab(0);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {

          process = false;
          page.loadingBox.hide();
        }
      },
      onRefresh(){
        this.form = {};
        this.detailData = [];
        this.editMode = false;
        appForm.btnDelete.disabled = false;
      },
      openFormModal() {
        this.$refs.form_modal.openModal();
      },
      async sendComponent(e, type) {
        this.$set(this,"detailData",e)
        this.setisCheck()
        // let ck = $linq(this.detailData).where(x => x.formcode == e.formcode).firstOrDefault();
        // if (ck != null) {
        //   $msg.alert("", "มี Form Code นี้แล้ว", "danger");
        //   return
        // }
        
        // let f = {
        //   formcode: e.formcode,
        //   formname: e.formname
        // };
        // this.detailData.push(f);
      },
      setisCheck(){
        this.isCheck = $linq(this.detailData).select(x=> x.formcode).toArray()
      },
      addFile() {
        $(this.$refs.File).click();
      },
      onExport() {
        let arr = [];

        if (this.datalist.length > 0) {
          $linq(this.datalist).foreach(x => {
            arr.push({
              'prioity_code': x.prioity_code,
              'prioity_des': x.prioity_des,
              'to_date': x.to_date,
              'active': x.active,
              'priority_status': x.priority_status,
            })
          });
        }
        else {
          arr.push({
            'prioity_code': "",
            'prioity_des': "",
            'to_date': "",
            'active': "",
            'priority_status': "",
          })
        }
        var dataWS = XLSX.utils.json_to_sheet(arr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(wb, 'Priority.xlsx');
      },
      async doUpload(f) {
        page.loadingBox.show();
        try {
          let act = `CSM/Master/PriorityImport`;
          let fd = new FormData();
          fd.append('file', f);

          let rsp = await $xt.postServerForm(act, fd);
          if (!rsp.success) {
            throw new Error(rsp.error);
          }
          else {
            $notify.success('นำเข้าข้อมูลเสร็จสิ้น');
            await this.loadData();
          }
        } catch (ex) {
          $msg.alert("", ex.toString(), "danger");
        }
        finally {
          page.loadingBox.hide();
        }
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
        page.pageTitle = `Setup : Form Sets`;
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnRetrieve.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnRefresh.show = true;
        appForm.btnNew.click = this.openFormModal;
        appForm.btnSave.click = this.saveData;
        appForm.btnDelete.click = this.deleteData;
        appForm.btnRefresh.click = this.onRefresh;

        paging = this.$refs.paging;
        paging.setCurrentPage(1);
        paging.setItemsPerPage(10);

        this.resetData();
        this.loadData();
        this.$nextTick(() => {
          $(this.$refs.File).on('click', (e) => {
            e.target.value = null;
          });
          $(this.$refs.File).on('change', (e) => {
            if (e.target.files && e.target.files[0]) {
              this.doUpload(e.target.files[0]);
            }
          });
        });

      })();
    }
  };

  export default cpn;
</script>
