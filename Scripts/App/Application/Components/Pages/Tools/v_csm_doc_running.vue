<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <!-- Search Panel -->
            <div class="row">
              <div class="col-lg-3 col-md-3">
                <div class="form-group">
                  <label>{{ui.search||'Search'}}</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model="retrieveSearch['search_text']" @keyup.enter="loadData()" />
                    <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="loadData()"><i class="fa fa-search"></i></button></span>
                  </div>
                </div>
              </div>
              <div class="col-md-9 col-sm-6 col-xs-6" v-if="isSuperAdmin">
                <div class="pull-right">
                  <div class="margin-t-25">
                    <button class="btn btn-sm btn-tumblr" @click="addNew()"><i class="fas fa-plus-circle"></i> เพิ่มรายการ</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- List Data -->
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th class="tf-2-5 text-center">Manage</th>
                        <th class="tf-3 text-center">Form Code</th>
                        <th>Form Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in datalist">
                        <td class="text-center">
                          <a class="text-black" href="#" @click.prevent="editData(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                          <a class="text-danger" href="#" @click.prevent="onDel(x)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                        </td>
                        <td align="center" class="text-bold">{{x.formcode}}</td>
                        <td>{{x.formname}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <!-- Pagination -->
            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>

    <!-- Modal : Add Document Running -->
    <modal ref="addModal">
      <template slot="header">
        <h4>{{editMode ? 'Edit Document Running' : 'Add Document Running'}}</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="">Form Code :</label>
              <input type="text" class="form-control input-sm" v-model.trim="form['formcode']" maxlength="10" v-bind:disabled="editMode">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="">Form Name :</label>
              <input type="text" class="form-control input-sm" v-model.trim="form['formname']">
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button type="button" class="btn btn-sm bg-olive" v-on:click="onSave()">บันทึกช้อมูล</button>
        <button type="button" class="btn btn-sm btn-default" data-dismiss="modal">ปิดหน้าต่าง</button>
      </template>
    </modal>

  </div>
</template>
<script>
  let page = {};
  let paging = {};
  let cpn = {
    data() {
      return {
        auth,
        tab1Active: 0,
        xt: $xt,
        retrieveSearch: {},
        form: {},
        ui: window.ui,
        datalist: [],
        total_datalist: 0,
        isSuperAdmin: false,
        editMode: false,
      };
    },
    methods: {
      changeTab1(t) {
        this.tab1Active = t;
      },
      async pageChange(pn) {
        paging.setCurrentPage(pn);
        await this.loadData();
      },
      reset() {
        this.form = {};
        this.editMode = false;
      },
      addNew() {
        //$(this.$refs.addModal).modal('show');
        this.$refs.addModal.openModal()
        this.editMode = false;
        this.form = {};
      },
      editData(x) {
        //$(this.$refs.addModal).modal('show');
        this.$refs.addModal.openModal()
        this.editMode = true;
        this.$set(this, 'form', JSON.parse(JSON.stringify(x)));
      },
      async loadData() {
        let act = `CSM/Tools/Docrunning_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}&search_text=${encodeURIComponent(this.retrieveSearch.search_text || '')}`;
        let rsp = await $xt.getServer(act);
        this.datalist = rsp.data;
        this.total_datalist = rsp.total;

        paging.setTotalItems(rsp.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async onSave() {
        try {
          let f = {
            data: this.form
          };
          var act = `CSM/Tools/Docrunning_Create`;
          if (this.editMode) {
            act = `CSM/Tools/Docrunning_Update`
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.addModal).modal('hide');
          await this.loadData();
          $msg.alert(``, `Success`, `success`);
          await this.reset();
          await this.loadData();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onDel(x) {
        if (!await $msg.confirm(`ต้องการลบข้อมูลใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            data: x
          };
          let act = `CSM/Tools/Docrunning_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.reset();
          await this.loadData();
          $(this.$refs.addModal).modal('hide');
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
    },
    mounted() {
      page = this.$refs.page
      page.pageTitle = `Document Running / Form`
      document.title = page.pageTitle
      this.isSuperAdmin = page.isSuperAdmin()

      this.$refs.addModal.setSize('modal-md')

      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(10)

      this.loadData()
    }
  };
  export default cpn;
</script>
