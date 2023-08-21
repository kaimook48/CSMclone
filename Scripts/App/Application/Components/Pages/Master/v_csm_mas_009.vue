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
                              <th class="tf-3 text-center">Priority Code</th>
                              <th class="tf-5">Priority Description</th>
                              <th class="tf-3 text-center">Overdue (Days)</th>
                              <th class="tf-3 text-center">Priority Status</th>
                              <th class="tf-2-5 text-center">Active</th>
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
                              <td align="center" class="text-bold">{{x.prioity_code}}</td>
                              <td>{{x.prioity_des}}</td>
                              <td align="center">{{x.to_date}} วัน</td>
                              <td align="center">{{x.priority_status == '1' ? 'ปกติ' : x.priority_status == '2' ? 'สำคัญ' : 'สำคัญมาก'}}</td>
                              <td align="center">
                                <span v-show="x.active=='Y'" style="color:#00c116;">Yes</span>
                                <span v-show="x.active=='N'|| x.active==Null" style="color:#ff0000;">No</span>
                              </td>
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
                <div class="tab-pane" :class="{active:tabActive===1}" v>
                  <app-form ref="appForm">
                    <template slot="form-field">
                      <div class="row">
                        <div class="col-lg-2 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label class="text-danger">Priority Code</label>
                            <input type="text" class="form-control" v-model="form['prioity_code']" maxlength="10" :disabled="editMode" />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label>Priority Description</label>
                            <input type="text" class="form-control" v-model="form['prioity_des']" maxlength="200" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-2 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label class="text-danger">Priority Status</label>
                            <select class="form-control" v-select v-model="form['priority_status']">
                              <option value="" selected="selected" disabled="disabled">-- Please Select --</option>
                              <option value="1">ปกติ</option>
                              <option value="2">สำคัญ</option>
                              <option value="3">สำคัญมาก</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2">
                          <div class="form-group">
                            <label>Overdue (Days)</label>
                            <number :decimals="0" class="form-control" v-model.number="form['to_date']"></number>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-md-2">
                          <div class="form-group">
                            <label>&nbsp;</label>
                            <div>
                              <input type='checkbox' class='ios8-switch' id='checkbox-1' v-model="form['active']" true-value="Y" false-value="N">
                              <label for='checkbox-1'>Active</label>
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
        this.form = {
          priority_status: "1",
          active: "Y"
        };
        appForm.btnDelete.disabled = true;
      },
      async loadData() {
        let act = `csm/master/Priority_ReadList?search_text=${encodeURIComponent(this.search.text || '')}`;
        console.log("auth" + JSON.stringify(auth));
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
      async readData(prioity_code) {
        let act = `csm/master/Priority_Read?prioity_code=${encodeURIComponent(prioity_code || '')}`;
        let rsp = await $xt.getServer(act);
        this.$set(this, "form", rsp.data);
      },
      async saveData() {
        if (process) return;
        try {
          let f = {
            header: this.form
          };
          let act = `CSM/MASTER/Priority_Create`;
          if (this.editMode) {
            act = `CSM/MASTER/Priority_Update`;
          }
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
        await this.readData(x.prioity_code);
        this.editMode = true;
        this.onChangeTab(1);
        appForm.btnDelete.disabled = false;
      },
      async deleteData() {
        if (process) return;
        if (!this.editMode) return;
        if (!await $msg.confirm(`คุณต้องการลบข้อมูล Priority Description : ${this.form['prioity_des']} นี้ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            header: this.form
          };
          let act = `CSM/Master/Priority_Delete`;
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
        page.pageTitle = `Setup : Priority`;
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnRetrieve.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnNew.click = this.resetData;
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
