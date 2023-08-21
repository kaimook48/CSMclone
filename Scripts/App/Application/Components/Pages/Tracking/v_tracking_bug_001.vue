<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <template v-if="isView">
              <div class="row">
                <div class="col-md-3 col-sm-6 col-xs-6">
                  <div class="form-group">
                    <label>ค้นหา</label>
                    <div class="input-group">
                      <input type="text" class="form-control input-sm" v-model="search.text" v-on:keyup.enter="searchData()" />
                      <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="searchData()"><i class="fas fa-search"></i></button></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 pull-right margin-t-20">
                  <button class="btn btn-sm bg-navy pull-right" @click="addNew()"><i class="fas fa-plus"></i> เพิ่ม</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="table-responsive">
                    <table class="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th class="tf-2 text-center">No.</th>
                          <th class="tf-2 text-center">Edit</th>
                          <th class="tf-2-5">Module</th>
                          <th class="tf-3-5">Transaction</th>
                          <th class="tf-5">Subject</th>
                          <th class="tf-3">Tester</th>
                          <th class="tf-3">ERP</th>
                          <th class="tf-3">WEB</th>
                          <th class="tf-3-5 text-center">Dev Status</th>
                          <th class="tf-3-5 text-center">Tester Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(x,idx) in display">
                          <td align="center">{{idx+1}}</td>
                          <td align="center"><a href="#" @click.prevent="edit(x)"><i class="fa fa-edit"></i></a> </td>
                          <td align="center">{{x.module_}}</td>
                          <td>{{x.transaction_}}</td>
                          <td>{{x.subject_}}</td>
                          <td>{{x.staff01}}</td>
                          <td>{{x.staff03}}</td>
                          <td>{{x.staff02}}</td>
                          <td align="center" :class="statusClass('text-', x.status_dev)"><i :class="statusIcon(x.status_dev)"></i></td>
                          <td align="center" :class="statusClass('text-', x.status_tester)"><i :class="statusIcon(x.status_tester)"></i></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
                </div>
              </div>
            </template>
            <template v-if="!isView">
              <div class="row">
                <div class="col-md-2">
                  <label>TB No.</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.tracking_bug_no" readonly>
                  </div>
                </div>
                <div class="col-md-1">
                  <div class="form-group">
                    <label class="text-danger">Module</label>
                    <span class="input-group">
                      <input type="text" class="form-control input-sm text-bold" v-model="formData.module_" readonly />
                      <span class="input-group-btn">
                        <button class="btn btn-sm btn-default" @click="openMenuModal()"><i class="fa fa-search"></i></button>
                      </span>
                    </span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="">Transaction</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.transaction_" readonly>
                  </div>
                </div>
                <div class="col-md-2 pull-right">
                  <button class="btn btn-sm btn-success pull-right" style="margin-left:5px;" @click="beforeSave()"><i class="fas fa-save"></i> บันทึก</button>
                  <button class="btn btn-sm btn-warning pull-right" @click="back()"><i class="fas fa-arrow-circle-left"></i> กลับ</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-1">
                  <div class="form-group">
                    <label class="text-danger">Dev Empno</label>
                    <span class="input-group">
                      <input type="text" class="form-control input-sm text-bold" v-model="formData.staff_02" readonly />
                      <span class="input-group-btn">
                        <button class="btn btn-sm btn-default" @click="openEmpModal('dev')"><i class="fa fa-search"></i></button>
                      </span>
                    </span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="">Dev Name</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.dev_name" readonly>
                  </div>
                </div>
                <div class="col-md-1">
                  <label for="">Dev Status</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.status_dev">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-1">
                  <div class="form-group">
                    <label class="text-danger">Tester Empno</label>
                    <span class="input-group">
                      <input type="text" class="form-control input-sm text-bold" v-model="formData.staff_01" readonly />
                      <span class="input-group-btn">
                        <button class="btn btn-sm btn-default" @click="openEmpModal('tester')"><i class="fa fa-search"></i></button>
                      </span>
                    </span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="">Tester Name</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.tester_name" readonly>
                  </div>
                </div>
                <div class="col-md-1">
                  <label for="">Tester Status</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="formData.status_tester">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-7">
                  <div class="form-group">
                    <label for="">Subject</label>
                    <div>
                      <input type="text" class="form-control input-sm" v-model.trim="formData.subject_" maxlength="500">
                    </div>
                  </div>
                </div>
                <div class="col-md-1 margin-t-20">
                  <button class="btn btn-sm bg-blue" style="width:100%;" @click="addFile()"><i class="fas fa-upload"></i> Attach File</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-8">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-1 text-center">No.</th>
                        <th class="tf-5">File</th>
                        <!--<th class="tf-2-5">Module</th>-->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in attachfileData">
                        <td align="center" valign="top">{{idx+1}}</td>
                        <td>
                          <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.docfilename)) && x.docfilename != null">
                            <a :href="createFilePath(x.pathto)" target="_blank"><img :src="createFilePath(x.pathto)" class="img-responsive" /></a>
                          </p>
                        </td>
                        <!--<td>{{x.transaction_}}</td>-->
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Input Attach File -->
        <input type="file" ref="myFile" name="myFile" accept="image/*" style="display:none;">
      </template>
    </re-page>

    <!-- Modal : Menu -->
    <modal ref="menuModal">
      <template slot="header">
        <h4>Menu</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-md-4">
            <div class="table-responsive table-fixed">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th class="tf-2-5">Module</th>
                    <th class="tf-5">Description</th>
                    <th class="tf-3">Menu Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x,idx in menuObject" class="no-copy pointer" v-bind:class="{'table-selected': x.checked}" @click="holdRow(x, idx, 'menu_object')">
                    <td align="center" class="text-bold" v-text="x.module"></td>
                    <td v-text="x.menu_desc"></td>
                    <td v-text="x.menu_name"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-md-8">
            <div class="table-responsive table-fixed">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th class="tf-3 text-middle">Menu ID</th>
                    <t
                    <th class="tf-4-5 text-middle">Description (TH)</th>
                    <th class="tf-4-5 text-middle">Description (ENG)</th>
                    <th class="tf-3-5 text-middle">Winname</th>
                    <th class="tf-3-5 text-middle">Webview</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="no-copy pointer" v-for="(x,idx) in menuItem" v-bind:class="{'table-header-color': x.menulevel == 0, 'text-bold': x.menutype == 'H' && x.menu_name != 'M_MASTER','table-selected': x.checked}" @click="holdRow(x, idx, 'menu_item')" @dblclick="selectMenu()">
                    <td align="center" class="text-bold">{{x.menu_id}}</td>
                    <td class="tf-4-5 nowrap-text" v-bind:class="{'text-bold': x.menulevel == 0}">{{x.lang2}}</td>
                    <td class="tf-4-5 nowrap-text" v-bind:class="{'text-bold': x.menulevel == 0}">{{x.lang1}}</td>
                    <td class="nowrap-text" v-bind:class="{'text-bold': x.menulevel == 0}">{{x.winname}}</td>
                    <td class="nowrap-text" v-bind:class="{'text-bold': x.menulevel == 0}">{{x.webview}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn-sm bg-olive" @click="selectMenu()">
          <i class="fas fa-save"></i>
          <span v-text="ui.select || 'Select'"></span>
        </button>
      </template>
    </modal>

    <!-- Modal : Center -->
    <vue-employee-list ref="ct_emp" @send-data="sendComponent($event)"></vue-employee-list>

  </div>
</template>

<script>
  let page = {};
  let paging = {};

  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        xt: $xt,
        isLoading: false,
        isView: true,
        isEdit: false,
        company: window.baseCompany,
        menuObject: [],
        menuObjectSelect: {},
        menuItem: [],
        menuItemSelect: {},
        dataAdmin: {},
        display: [],
        attachfileData: [],
        formData: {},
        search: {
          text: ''
        },
        pageNumber: 1,
        focus: ''
      };
    },
    methods: {
      pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        paging.createPagesArray();
      },
      searchData() {
        this.pageNumber = 1;
        this.loadData();
      },
      async loadData() {
        this.isLoading = true;

        let act = `CSM/TBug/TBug_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}&search_text=${this.search.text || ''}`;
        let rsp = await $xt.getServer(act);
        this.display = rsp.data.data_rows.data;

        this.pageChange(this.pageNumber);
        paging.setTotalItems(rsp.data.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();

        this.isLoading = false;
      },
      async readData(x) {
        this.isLoading = true;

        let act = `CSM/TBug/TBug_Read?docno=${x.tracking_bug_no}&itemno=${x.itemno_}`;
        let rsp = await $xt.getServer(act);
        this.formData = rsp.data.data;
        this.attachfileData = rsp.data.attachfile;

        this.isLoading = false;
      },
      beforeSave() {
        if ($xt.isEmpty(this.formData.module_)) {
          $msg.alert(`Warning`, `กรุณาเลือก Module`, `warning`);
          return;
        }
        else if ($xt.isEmpty(this.formData.subject_)) {
          $msg.alert(`Warning`, `กรุณากรอก Subject`, `warning`);
          return;
        }
        else {
          this.saveData();
        }
      },
      async saveData() {
        try {
          let f = {
            header: this.formData,
            attachfile: this.attachfileData,
          };
          this.isLoading = true;
          let act = `CSM/TBug/TBug_CreateAndUpdate`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          console.log(rsp.data);
          $xt.isEmpty(this.formData.tracking_bug_no) ? this.$set(this.formData, "tracking_bug_no", rsp?.data) : this.formData.tracking_bug_no;
          this.formData.tracking_bug_no = rsp?.data;

          $msg.alert(``, `Success`, `success`);
          this.isLoading = false;
        } catch (ex) {
          this.isLoading = false;
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          this.isLoading = false;
        }
      },
      holdRow(obj, idx, keyword) {
        console.log('test');
        switch (keyword) {
          case "menu_object":
            $xt.isSeleted(this.menuObject, idx);
            this.menuObjectSelect = obj;
            this.menuItemSelect = {};
            this.loadMenuItem(obj.module, obj.menu_name);
            break;
          case "menu_item":
            $xt.isSeleted(this.menuItem, idx);
            this.menuItemSelect = obj;
            //this.loadMenuItem(obj.module, obj.menu_name);
            break;
        }

        //console.log(JSON.stringify(this.menuObjectSelect));
        //console.log(JSON.stringify(this.menuItemSelect));
      },
      async loadMenuObject() {
        let act = `Anywhere/Management/MenuObject`;
        let resp = await $xt.getServer(act);
        resp.data.forEach(x => {
          x.checked = false;
        });
        this.menuItem = [];
        this.menuObject = resp.data;
      },
      async loadMenuItem(module, menu_name) {
        let act = `CSM/TBug/MenuDisplay?module=${module || ""}&menu_name=${menu_name || ""}`;
        page.loadingBox.show();
        let resp = await $xt.getServer(act);
        resp.data.forEach(x => {
          x.checked = false;
        });
        this.menuItem = resp.data;
        page.loadingBox.hide();
      },
      selectMenu() {
        this.$set(this.formData, "module_", this.menuObjectSelect.module);
        this.$set(this.formData, "transaction_", this.menuItemSelect.menu_text);
        this.$refs.menuModal.closeModal();
      },
      openMenuModal() {
        this.$refs.menuModal.openModal();
        this.loadMenuObject();
      },
      openEmpModal(pong) {
        this.focus = pong;
        this.$refs.ct_emp.openModal();
      },
      async sendComponent(e) {
        switch (this.focus) {
          case "dev":
            this.$set(this.formData, 'staff_02', e.empno);
            this.$set(this.formData, 'dev_name', e.empfullname);
            break;
          case "tester":
            this.$set(this.formData, 'staff_01', e.empno);
            this.$set(this.formData, 'tester_name', e.empfullname);
            break;
        }
      },
      addNew() {
        this.isView = false;
        this.isEdit = false;
        this.formData = {};
        this.attachfileData = [];
      },
      back() {
        this.isView = true;
        this.isEdit = false;
        this.searchData();
      },
      edit(x) {
        this.isView = false;
        //this.isEdit = true;
        this.readData(x);
      },
      statusClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : status == 'W' ? prefix + 'info' : status == 'N' ? prefix + 'danger' : status == 'H' ? prefix + 'warning' : '';
      },
      statusIcon(status) {
        let icon = status == 'Y' ? 'fa fa-check' : status == 'N' ? 'fa fa-times' : '';
        let size = ' fa-lg';
        return icon + size;
      },
      statusName(code) {
        return code == "Y" ? "Yes" : "No";
      },
      addFile(type) {
        this.formtype = type != null ? type : "";
        $(this.$refs.myFile).click();
      },
      async fileUpload(file) {
        let f = new FormData();
        f.append("file", file);
        try {
          let r = await $xt.postServerForm('Data/CSM_FileUploadToTemp', f);
          if (!r.success) {
            throw r.error;
          }

          this.attachfileData.push({ pathto: r.id, docfilename: r.filename });
          /* หากสำเร็จจะทำการ Push Data ลงใน Form */
          //this.$set(this.form, `filepath`, r.id || "");
          //this.$set(this.form, `filename`, r.filename || "");
        }
        catch (ex) {
          $msg.alert('', ex.toString(), 'danger');
        }
      },
      createFilePath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
      getFileExt(f) {
        if (!$xt.isEmpty(f)) {
          return f.split('.').pop().toLowerCase();
        }
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = `Tracking Bug : ตามติดแนบชิดชีวิตบัค V 0.8`;
      document.title = page.pageTitle;

      this.$refs.menuModal.setSize("modal-xl-2")

      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);

      this.loadData();

      this.$nextTick(() => {
        $(this.$refs.myFile).on('change', (e) => {
          this.fileUpload(e.target.files[0]);
        });
        //let windowHeight = $(window).height()
        //this.height = windowHeight - 360

        //$(this.$refs.File).on("click", e => {
        //  e.target.value = null
        //});
        //$(this.$refs.File).on("change", e => {
        //  if (e.target.files && e.target.files[0]) {
        //    this.doUpload(e.target.files[0])
        //  }
        //});
        //$(this.$refs.FileImage).on("click", e => {
        //  e.target.value = null
        //});
        //$(this.$refs.FileImage).on("change", e => {
        //  if (e.target.files && e.target.files[0]) {
        //    this.uploadImage(e.target.files[0])
        //  }
        //})
        $(window).resize(() => {
          $(".table-fixed").css({ "max-height": ($(window).height() - 310) + "px" })
        });
        $(window).trigger('resize')
      });
    }
  };

  export default cpn;
</script>
