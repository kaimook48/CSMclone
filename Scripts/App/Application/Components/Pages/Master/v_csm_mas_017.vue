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
                              <th class="tf-2 text-center">Edit</th>
                              <th class="tf-3 text-center">รหัส</th>
                              <th class="tf-5">หมวดงาน</th>
                              <th class="tf-3 text-center">Add User</th>
                              <th class="tf-3 text-center">Add Date</th>
                              <th class="tf-3 text-center">Edit User</th>
                              <th class="tf-3 text-center">Edit Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(x,idx) in displayData">
                              <td align="center">{{x.item}}.</td>
                              <td align="center"><a href="#" @click.prevent="setEdit(x)"><i class="fa fa-edit"></i></a> </td>
                              <td align="center" class="text-bold">{{x.serv_code}}</td>
                              <td>{{x.remark}}</td>
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
                            <label class="text-danger">รหัส</label>
                            <input type="text" class="form-control" v-model="form['serv_code']" maxlength="10" :disabled="editMode" />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label class="text-danger">หมวดงาน</label>
                            <input type="text" class="form-control" v-model="form['remark']" maxlength="200" />
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
                              <th class="tf-2 text-center">Delete</th>
                              <th class="tf-3 text-center">รหัส</th>
                              <th class="tf-5">ประเภทงาน</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(x,idx) in detailData">
                              <td align="center">{{idx+1}}.</td>
                              <td align="center"><a href="#" @click.prevent="delDetail(x)"><i class="fa fa-trash text-danger"></i></a> </td>
                              <td>{{x.serv_code_d}}</td>
                              <td>{{x.remark}}</td>
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

        <div class="modal fade" ref="addDetail" role="dialog" data-keyboard="false" data-backdrop="static">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 style="margin: 0px;">{{editSub ? 'Edit' : 'Add'}} Data</h4>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-2">
                    <div class="form-group">
                      <label class="text-danger">รหัส</label>
                      <input type="text" class="form-control" v-model.trim="subForm.serv_code_d" :readonly="editSub" :disabled="editSub" maxlength="20" />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4">
                    <div class="form-group">
                      <label class="text-danger">ประเภทงาน</label>
                      <input type="text" class="form-control" v-model.trim="subForm.remark" maxlength="200" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-sm btn-info" @click="addNew()">{{editSub ? 'Edit' : 'Add'}}</button>
                <button class="btn btn-sm btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>

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
        xt: $xt,
        auth,
        tabActive: 0,
        pageNumber: 1,
        editMode: false,
        editSub: false,
        search: {},
        form: {},
        subForm: {},
        datalist: [],
        displayData: [],
        detailData: [],
        isShowTab2: false,
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
        let act = `csm/master/CSM_SubService_ReadList?skip=0&take=9999&serv_code=&text=${this.search.text || ''}&type=H`;
        let rsp = await $xt.getServer(act);

        this.datalist = rsp.data.data;
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
      async readData(serv_code) {
        page.loadingBox.show();
        let act = `csm/master/CSM_SubService_Read?serv_code=${serv_code || ''}&text=&type=D`;
        let rsp = await $xt.getServer(act);
        this.$set(this, "form", rsp.data.header);
        this.$set(this, "detailData", rsp.data.detail);
        page.loadingBox.hide();
      },
      async saveData() {
        if (process) return;
        try {
          let f = {
            header: this.form,
            detail: this.detailData
          };
          let act = `CSM/MASTER/CSM_SubService_CreateAndUpdate`;
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
        await this.readData(x.serv_code);
        this.editMode = true;
        this.onChangeTab(1);
        appForm.btnDelete.disabled = false;
      },
      async delDetail(x) {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูล : ${x.serv_code_d} นี้ใช่หรือไม่`)) {
          return;
        }
        this.detailData = $linq(this.detailData).where(y => y.serv_code_d != x.serv_code_d).toArray();
      },
      async deleteData(code) {
        if (process) return;
        if (!this.editMode) return;
        code = code || this.form.serv_code

        if (!await $msg.confirm(`คุณต้องการลบข้อมูล Code : ${code} นี้ใช่หรือไม่`)) {
          return;
        }
        
        try {
          let f = {code : code};
          let act = `CSM/Master/CSM_SubService_Delete?code=${code}`;
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
      openModal() {
        if (this.form.serv_code == null) {
          $msg.alert("", "กรุณากรอก Subject Code", "danger");
          return 
        }
        if (this.form.remark == null) {
          $msg.alert("", "กรุณากรอก Subject Code", "danger");
          return
        }
        this.editSub = false;
        $(this.$refs.addDetail).modal("show");

        let i = $linq(this.detailData).select(x => x.itemno).lastOrDefault() || 0;
        i++
        this.subForm = {
          serv_code: this.form.serv_code,
          serv_code_d: this.form.serv_code + $xt.replaceZeroStart(i, 3),
          remark: "",
          itemno: i
        };
      },
      async addNew() {
        this.detailData.push(this.subForm)
        this.subForm = {}
        $(this.$refs.addDetail).modal("hide");
      },
      addFile() {
        $(this.$refs.File).click();
      },
      onExport() {
        let arr = [];
        if (this.datalist.length > 0) {
          $linq(this.datalist).foreach(x => {
            arr.push({
              'serv_code': x.serv_code,
              'serv_name': x.serv_name,
              'approve_st': x.approve_st,
              'ma_st': x.ma_st,
              'qc_st': x.qc_st,
              'claim_st': x.claim_st,
              'auto_task': x.auto_task,
            })
          });
        }
        else {
          arr.push({
            'serv_code': "",
            'serv_name': "",
            'approve_st': "",
            'ma_st': "",
            'qc_st': "",
            'claim_st': "",
            'auto_task': "",
          })
        }
        var dataWS = XLSX.utils.json_to_sheet(arr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(wb, 'Service_Type.xlsx');
      },
      async doUpload(f) {
        page.loadingBox.show();
        try {
          let act = `CSM/Master/CustomerServiceImport`;
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
        page.pageTitle = ' Setup : Service Type';
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnRetrieve.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnNew.click = this.openModal;
        appForm.btnSave.click = this.saveData;
        appForm.btnDelete.click = this.deleteData;

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
