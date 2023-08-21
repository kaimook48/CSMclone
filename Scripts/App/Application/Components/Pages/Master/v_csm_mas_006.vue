<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active: x.id===tab1Active}" v-for="x in tabField">
                  <a v-bind:class="{'disabled-menu': !x.show}" href="#" @click.prevent="changeTab1(x.id)">
                    <span v-text="x.text"></span>
                  </a>
                </li>

                <!--<li :class="{active:tab1Active===0}"><a href="#" @click.prevent="changeTab1(0)">Data List ({{total_datalist || 0}})</a></li>
                <li :class="{active:tab1Active===1}">
                  <a href="#" @click.prevent="changeTab1(1)" v-if="permission()">Create / Edit</a>
                </li>-->
              </ul>
              <div class="tab-content">
                <div class="tab-pane" :class="{active:tab1Active===0}">
                  <div class="row">
                    <div class="col-lg-6 col-md-12">
                      <div class="form-group">
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
                    <div class="col-lg-12">
                      <div class="table-responsive">
                        <table class="table table-hover table-bordered">
                          <thead>
                            <tr>
                              <th class="tf-2 text-center">#</th>
                              <th class="tf-2 text-center" v-if="permission()">Edit</th>
                              <th class="tf-3-5">Service Code</th>
                              <th class="tf-5">Service Name</th>
                              <th class="tf-3 text-center">Approve</th>
                              <th class="tf-3 text-center">Maintenance</th>
                              <th class="tf-3 text-center">Quality Control</th>
                              <th class="tf-3 text-center">ค่าใช้จ่ายเพิ่มเติม</th>
                              <th class="tf-3 text-center">ถาม-ตอบ</th>
                              <th class="tf-3 text-center">แจ้งเตือน</th>
                              <th class="tf-3 text-center">Line</th>
                              <th class="tf-3 text-center">Email</th>
                              <th class="tf-3 text-center">วันที่แจ้งเตือน</th>
                              <th class="tf-3-5 text-center">Add User</th>
                              <th class="tf-3-5 text-center">Add Date</th>
                              <th class="tf-3-5 text-center">Edit User</th>
                              <th class="tf-3-5 text-center">Edit Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="x in displayData">
                              <td align="center">{{x.item}}</td>
                              <td align="center" v-if="permission()"><a href="#" @click.prevent="edit(x)"><i class="fa fa-edit"></i></a> </td>
                              <td class="text-nowrap nowrap" nowrap>{{x.serv_code}}</td>
                              <td>{{x.serv_name}}</td>
                              <td align="center" :class="{'text-success': x.approve_st == 'Y', 'text-danger': x.approve_st == 'N' || x.approve_st == null}">
                                <span v-text="x.approve_st == 'Y' ? 'Yes': x.approve_st == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.ma_st == 'Y', 'text-danger': x.ma_st == 'N' || x.ma_st == null}">
                                <span v-text="x.ma_st == 'Y' ? 'Yes': x.ma_st == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.qc_st == 'Y', 'text-danger': x.qc_st == 'N' || x.qc_st == null}">
                                <span v-text="x.qc_st == 'Y' ? 'Yes': x.qc_st == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.claim_st == 'Y', 'text-danger': x.claim_st == 'N' || x.claim_st == null}">
                                <span v-text="x.claim_st == 'Y' ? 'Yes': x.claim_st == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.auto_task == 'Y', 'text-danger': x.auto_task == 'N' || x.auto_task == null}">
                                <span v-text="x.auto_task == 'Y' ? 'Yes': x.auto_task == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.noti_active == 'Y', 'text-danger': x.noti_active == 'N' || x.noti_active == null}">
                                <span v-text="x.noti_active == 'Y' ? 'Yes': x.noti_active == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.noti_line == 'Y', 'text-danger': x.noti_line == 'N' || x.noti_line == null}">
                                <span v-text="x.noti_line == 'Y' ? 'Yes': x.noti_line == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center" :class="{'text-success': x.noti_email == 'Y', 'text-danger': x.noti_email == 'N' || x.noti_email == null}">
                                <span v-text="x.noti_email == 'Y' ? 'Yes': x.noti_email == 'N' ? 'No':'No'"></span>
                              </td>
                              <td align="center">{{x.noti_date}}</td>
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
                <div class="tab-pane" :class="{active:tab1Active===1}">
                  <app-form ref="appForm">
                    <template slot="form-field">
                      <!-- Service Code , Service Name -->
                      <div class="row">
                        <div class="col-md-2">
                          <div class="form-group">
                            <label class="text-danger">Service Code</label>
                            <input type="text" class="form-control" v-model.trim="form.serv_code" :readonly="editMode" :disabled="editMode" maxlength="20" />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-4">
                          <div class="form-group">
                            <label class="text-danger">Service Name</label>
                            <input type="text" class="form-control" v-model.trim="form.serv_name" maxlength="200" />
                          </div>
                        </div>
                      </div>
                      <!-- Alert -->
                      <div class="row">
                        <div class="col-md-2">
                          <div class="form-group">
                            <label>Alert Date</label>
                            <number class="form-control input-sm" v-model="form.noti_date"></number>
                          </div>
                        </div>
                        <div class="col-md-2" style="margin-top:25px;">
                          <span class="checkbox checkbox-inline">
                            <label>
                              <input type="checkbox" true-value="Y" false-value="N" v-model="form.noti_active">
                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                              Alert Active
                            </label>
                          </span>
                          <span class="checkbox checkbox-inline">
                            <label>
                              <input type="checkbox" true-value="Y" false-value="N" v-model="form.noti_line">
                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                              Line
                            </label>
                          </span>
                          <span class="checkbox checkbox-inline">
                            <label>
                              <input type="checkbox" true-value="Y" false-value="N" v-model="form.noti_email">
                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                              Email
                            </label>
                          </span>
                        </div>
                      </div>
                      <!-- Config Service -->
                      <div class="row">
                        <div class="col-lg-12 col-md-6 col-sm-3 col-xs-3">
                          <div class="form-group">
                            <label>Config Service</label>
                            <div class="input-group">
                              <input type='checkbox' class='ios8-switch' id='checkbox-1' v-model="form.approve_st"
                                     true-value="Y" false-value="N" @change="setServiceType()">
                              <label for='checkbox-1'>Approve &nbsp;</label>
                              <input type='checkbox' class='ios8-switch' id='checkbox-2' v-model="form.ma_st"
                                     true-value="Y" false-value="N" @change="setServiceType()">
                              <label for='checkbox-2'>Maintenance&nbsp;</label>
                              <input type='checkbox' class='ios8-switch' id='checkbox-3' v-model="form.qc_st"
                                     true-value="Y" false-value="N" @change="setServiceType()">
                              <label for='checkbox-3'>Quality Control&nbsp;</label>
                              <input type='checkbox' class='ios8-switch' id='checkbox-5' v-model="form.claim_st"
                                     true-value="Y" false-value="N" @change="setServiceType()">
                              <label for='checkbox-5'>ค่าใช้จ่ายเพิ่มเติม&nbsp;</label>
                              <input type='checkbox' class='ios8-switch' id='checkbox-4' v-model="form.auto_task"
                                     true-value="Y" false-value="N" @change="setServiceType('Auto')">
                              <label for='checkbox-4'>Question and Answer (ถาม-ตอบ)&nbsp;</label>
                            </div>
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
        <input type="file" ref="File" accept=".xls, .xlsx" v-show="false" />
      </template>
    </re-page>
  </div>
</template>
<script>
  import XLSX from 'xlsx';

  let page = {};
  let appForm = {};
  let appForm2 = {};
  let paging = {};
  let process = false;
  let cpn = {
    data() {
      return {
        auth,
        tab1Active: 0,
        search: {
        },
        tabField: [
          { id: 0, text: 'Data List', show: true },
          { id: 1, text: 'Create / Edit', show: true },
        ],
        datalist: [],
        displayData: [],
        total_datalist: 0,
        pageNumber: 1,
        editMode: false,
        form: {},
        ui: window.ui,
      };
    },
    methods: {
      changeTab1(t, data) {
        this.tab1Active = t;
      },
      doSearch() {
          paging.setCurrentPage(1);
          this.loadData();
      },
      pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        this.$set(this, "displayData", $linq(this.datalist).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
        paging.createPagesArray();
      },
      reset() {
        (async () => {
          this.editMode = false;
          this.form = {
              serv_code: "",
              serv_name: "",
              approve_st: "N",
              ma_st: "N",
              qc_st: "N",
              claim_st: "N",
              alert_count: 0,
              alert_active: "N",
            };
          appForm.btnDelete.disabled = true;
        })();
      },
      edit(x) {
        this.changeTab1(1);
        this.readData(x.serv_code);

        $('html,body').scrollTop(0);
        appForm.btnDelete.disabled = false;
      },
      setEdit() {
        this.editMode = true;
        appForm.btnDelete.disabled = false;
      },
      async loadData() {
        let act = `csm/master/CustomerServiceType_ReadList?search_text=${this.search.text || ''}`;
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
      async readData(serv_code) {
        let act = `csm/master/CustomerServiceType_Read?serv_code=${encodeURIComponent(serv_code || '')}`;
        let rsp = await $xt.getServer(act);
        this.form = rsp.data;
        this.setEdit();

        this.form.alert_count = this.form.alert_count ?? 0;
        this.$set(this.form, 'approve_st_tmp', this.form.approve_st ?? "N");
        this.$set(this.form, 'ma_st_tmp', this.form.ma_st ?? "N");
        this.$set(this.form, 'qc_st_tmp', this.form.qc_st ?? "N");
        this.$set(this.form, 'claim_st_tmp', this.form.claim_st ?? "N");
      },
      setSave() {
        this.save();
      },
      async save() {
        if (process) return;

        try {
          let f = {
            header: this.form
          };

          let act = `csm/master/CustomerServiceType_Create`;
          if (this.editMode) {
            act = `csm/master/CustomerServiceType_Update`;
          }

          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.readData(rsp.data);
          await this.loadData();

          $msg.alert(``, `Success`, `success`);
          this.changeTab1(0);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }

      },
      setDel() {
        this.deleteData();
      },
      async deleteData() {
        if (process) return;
        if (!this.editMode) return;

        if (!await $msg.confirm(`คุณต้องการลบข้อมูล Service Type : ${this.form.serv_name} นี้ ใช่หรือไม่`)) {
          return;
        }

        try {
          let f = {
            header: this.form
          };

          let act = `csm/master/CustomerServiceType_Delete`;

          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.reset();
          await this.loadData();

          $msg.alert(``, `Success`, `success`);
          this.changeTab1(0);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      setServiceType(type) {
        switch (type) {
          case "Auto":
            if (this.form.auto_task == "Y") {
              this.$set(this.form, 'approve_st', "N");
              this.$set(this.form, 'ma_st', "N");
              this.$set(this.form, 'qc_st', "N");
              this.$set(this.form, 'claim_st', "N");
            }
            else {
              this.$set(this.form, 'approve_st', this.form.approve_st_tmp);
              this.$set(this.form, 'ma_st', this.form.ma_st_tmp);
              this.$set(this.form, 'qc_st', this.form.qc_st_tmp);
              this.$set(this.form, 'claim_st', this.form.claim_st_tmp);

              this.$set(this.form, 'auto_task', "N");
            }
            break;
          default:
            this.$set(this.form, 'auto_task', "N");
            break;
        }
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
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault() || "N";
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
        $xt.sleep(500)

        page = this.$refs.page;
        page.pageTitle = ' Setup : Service Type';
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnRetrieve.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnNew.click = this.reset;
        appForm.btnSave.click = this.setSave;
        appForm.btnDelete.click = this.setDel;

        paging = this.$refs.paging;
        paging.setCurrentPage(1);
        paging.setItemsPerPage(10);

        this.reset();
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
<style scoped>

  .text-success {
    color: #00c116 !important;
  }

  .text-danger {
    color: #ff0000 !important;
  }
</style>
