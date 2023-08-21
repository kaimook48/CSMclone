<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <!-- Search Panel -->
            <div class="row">
              <div class="col-md-3">
                <div class="form-group">
                  <label>{{ui.search||'Search'}}</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model="retrieveSearch['search_text']" @keyup.enter="loadData()" />
                    <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="loadData()"><i class="fa fa-search"></i></button></span>
                  </div>
                </div>
              </div>
              <div class="col-md-9 col-sm-6 col-xs-6">
                <div class="pull-right">
                  <div class="margin-t-25">
                    <button class="btn btn-sm btn-facebook" @click="onExport"><i class="fas fa-file-excel"></i> นำข้อมูลออกเป็น Excel</button>
                    <button class="btn btn-sm btn-facebook" @click="addFile('import')"> <!--v-if="isSuperAdmin"--><i class="fas fa-file-excel"></i> นำเข้าข้อมูลจาก Excel</button>
                    <button class="btn btn-sm btn-tumblr" @click="addNew()"><i class="fas fa-plus-circle"></i> เพิ่มรายการ</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- List Data -->
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th class="tf-3 text-center">Manage</th>
                        <th class="tf-3-5">Config Code</th>
                        <th class="tf-2-5 text-center">Module</th>
                        <th class="tf-3 text-center">Revision</th>
                        <th class="tf-2 text-center">Default</th>
                        <th class="tf-2 text-center">Charge</th>
                        <th class="tf-3-5">CSM</th>
                        <th class="tf-5-5">Customer Name</th>
                        <th class="tf-5-5">Description1</th>
                        <th class="tf-5-5">Description2</th>
                        <th class="tf-5">Desc. Active</th>
                        <th class="tf-5">Desc. Inactive</th>
                        <th class="tf-3 text-center">Add User</th>
                        <th class="tf-3 text-center">Add Date</th>
                        <th class="tf-3 text-center">Edit User</th>
                        <th class="tf-3 text-center">Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in displayData">
                        <td align="center">
                          <a class="text-black" href="#" @click.prevent="setEdit(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                          <a class="text-light-blue" :href="createFilePath(x.filepath)" target="_blank" v-if="!xt.isEmpty(x.filename) && ['png','jpeg','jpg'].includes(getFileExt(x.filename))"><v-icon name="paperclip" class="v-icon-width"></v-icon></a>
                          <a class="text-blue" :href="downLoadFile(x)" target="_blank" v-if="!xt.isEmpty(x.filename)"><v-icon name="download" class="v-icon-width"></v-icon></a>
                        </td>
                        <td class="text-bold">{{x.code}}</td>
                        <td>{{x.module}}</td>
                        <td>{{x.revision}}</td>
                        <td align="center" :class="statusClass(x.v_default)">{{statusName(x.v_default)}}</td>
                        <td align="center" :class="statusClass(x.charge)">{{statusName(x.charge)}}</td>
                        <td><a v-bind:href="openCSM(x.job_no)" target="_blank">{{x.job_no}}</a></td>
                        <td>{{x.customer_name}}</td>
                        <td>{{x.remark}}</td>
                        <td>{{x.remark2}}</td>
                        <td>{{x.remark_return}}</td>
                        <td>{{x.remark_return2}}</td>
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
            <!-- Pagination -->
            <pagination class="pull-left margin-t-10" ref="paging" @page-change="pageChange($event.page)"></pagination>
          </div>
        </div>
        <input type="file" ref="File" accept=".xls, .xlsx" v-show="false" />
      </template>
    </re-page>

    <!-- Modal : Add ERP Config -->
    <modal ref="addModal">
      <template slot="header">
        <h4>{{editMode ? 'Edit ERP Config' : 'Add ERP Config'}}</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="">Code</label>
              <input type="text" class="form-control input-sm" v-model.trim="form['code']" maxlength="30" v-bind:disabled="editMode">
            </div>
          </div>
          <div class="col-md-6 margin-t-25">
            <div class="form-group">
              <span class="checkbox checkbox-inline">
                <label>
                  <input type="checkbox" v-model="form['v_default']" true-value="Y" false-value="N" />
                  <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;
                </label>
              </span>
              <label>Default</label>
              <span class="checkbox checkbox-inline">
                <label>
                  <input type="checkbox" v-model="form['charge']" true-value="Y" false-value="N" />
                  <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;
                </label>
              </span>
              <label>Charges</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="">Module</label>
              <select class="form-control input-sm" v-model.trim="form['module']">
                <option v-for="x in moduleCodeData" :value="x">{{x}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="">Value Data</label>
              <input type="text" class="form-control input-sm" v-model.trim="form['value_data']" maxlength="10">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="">Description1</label>
              <input type="text" class="form-control input-sm" v-model.trim="form['remark']" maxlength="300">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="">Description2</label>
              <input type="text" class="form-control input-sm" v-model.trim="form['remark2']" maxlength="2000">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <label>Desc. Active</label>
            <textarea class="form-control input-sm" rows="3" v-model.trim="form['remark_return']" maxlength="2000"></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <label>Desc. Inactive</label>
            <textarea class="form-control input-sm" rows="3" v-model.trim="form['remark_return2']" maxlength="2000"></textarea>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button type="button" class="btn btn-sm btn-success" v-on:click="onSave()">บันทึกข้อมูล</button>
        <button type="button" class="btn btn-sm btn-danger" v-on:click="onDel()" v-if="editMode">ลบข้อมูล</button>
      </template>
    </modal>

  </div>
</template>
<script>
  import XLSX from 'xlsx';

  let page = {};
  let paging = {};
  let cpn = {
    data() {
      return {
        auth,
        xt: $xt,
        retrieveSearch: {},
        form: {},
        ui: window.ui,
        datalist: [],
        displayData: [],
        total_datalist: 0,
        isSuperAdmin: false,
        editMode: false,
        pageNumber: 1,
        moduleData: [],
        moduleCodeData,
        baseUrl
      };
    },
    methods: {
      reset() {
        this.form = {};
        this.editMode = false;
      },
      addNew() {
        this.$refs.addModal.openModal()
        this.editMode = false;
        this.form = {};
      },
      setEdit(x) {
        this.$refs.addModal.openModal()
        this.editMode = true;
        this.$set(this, 'form', JSON.parse(JSON.stringify(x)));
      },
      pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        this.$set(this, "displayData", $linq(this.datalist).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
        paging.createPagesArray();
      },
      async loadData() {
        let act = `CSM/Tools/ERPconfig_ReadList?search_text=${encodeURIComponent(this.retrieveSearch.search_text || '')}`;
        let rsp = await $xt.getServer(act);
        this.datalist = rsp.data;
        this.total_datalist = rsp.total;

        let i = 0;
        $linq(this.datalist).foreach(x => {
          this.$set(x, "item", ++i);
        });

        this.pageChange(this.pageNumber);
        paging.setTotalItems(rsp.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async loadModuleData() {
        let act = `csm/master/Module_ReadList`;
        let rsp = await $xt.getServer(act);
        this.moduleData = rsp.data_rows
      },
      async onSave() {
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Tools/ERPconfig_Create`;
          if (this.editMode) {
            act = `CSM/Tools/ERPconfig_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          this.$refs.addModal.closeModal()
          await this.loadData();
          $msg.alert(``, `Success`, `success`);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onDel() {
        if (!await $msg.confirm(`ต้องการลบข้อมูล ${this.form.code} ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            code: this.form.code
          };
          let act = `CSM/Tools/ERPconfig_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.addModal).modal('hide');
          await this.reset();
          await this.loadData();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      statusName(value) {
        return value == 'Y' ? "Yes" : "No";
      },
      statusClass(status) {
        return status == 'Y' ? 'text-success' : 'text-danger';
      },
      openCSM(job_no){
        return this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${job_no}`
      },
      addFile(type) {
        console.log(type);
        switch (type) {
          case "import":
            $(this.$refs.File).click();
            break;
          case "addfile":
            $(this.$refs.myFile).click();
            break;
        }
      },
      async fileUpload(file) {
        let f = new FormData();
        f.append("file", file);
        try {
          let r = await $xt.postServerForm('Data/CSM_FileUploadToTemp', f);
          if (!r.success) {
            throw r.error;
          }
          /* หากสำเร็จจะทำการ Push Data ลงใน Form */
          this.$set(this.form, `filepath`, r.id || "");
          this.$set(this.form, `filename`, r.filename || "");
          console.log(JSON.stringify(this.form));
        }
        catch (ex) {
          $msg.alert('', ex.toString(), 'danger');
        }
      },
      createFilePath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
      downLoadFile(x) {
        return dataServer + `API/File/DownLoad?id=${x.filepath}&download=true&filename=${x.filename || ''}`;
      },
      getFileExt(f) {
        return f.split('.').pop().toLowerCase();
      },
      onExport() {
        let arr = [];
        if (this.datalist.length > 0) {
          $linq(this.datalist).foreach(x => {
            arr.push({
              'Code': x.code,
              'Active': x.active ?? "N",
              'Value_data': x.value_data,
              'Module': x.module,
              'Revision': x.revision,
              'Default': x.v_default ?? "N",
              'Charge': x.charge ?? "N",
              'Description1': x.remark,
              'Description2': x.remark2,
              'Desc. Active': x.remark_return,
              'Desc. Inactive': x.remark_return2,
            })
          });
        }
        else {
          arr.push({
            'Code': '',
            'Active': '',
            'Value_data': '',
            'module': '',
            'revision': '',
            'default': '',
            'charge': '',
            'Description1': '',
            'Description2': '',
            'Desc. Active': '',
            'Desc. Inactive': '',
          })
        }
        var dataWS = XLSX.utils.json_to_sheet(arr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(wb, 'csm_sm_config.xlsx');
      },
      async doUpload(f) {
        page.loadingBox.show();
        try {
          let act = `CSM/Tools/CSM_smconfig_Import`;
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
    },
    mounted() {
      page = this.$refs.page
      page.pageTitle = `Software ERP Config`
      document.title = page.pageTitle

      this.$refs.addModal.setSize('modal-md')

      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(10)

      this.isSuperAdmin = page.isSuperAdmin()

      this.loadData()

      this.$nextTick(() => {
        $(this.$refs.File).on('click', (e) => {
          e.target.value = null;
        });
        //Import File
        $(this.$refs.File).on('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.doUpload(e.target.files[0]);
          }
        });
        //Add File
        $(this.$refs.myFile).on('change', (e) => {
          this.fileUpload(e.target.files[0]);
        });

      });
    }
  };

  export default cpn;
</script>
