<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active:activeTab===1}"><a href="#" @click.prevent="ChangeTab(1)">Data List</a></li>
                <li :class="{active:activeTab===2}"><a href="#" @click.prevent="ChangeTab(2)">New / Edit</a></li>
              </ul>
              <div class="tab-content">
                <div class="tab-pane active">
                  <div v-show="activeTab===1">
                    <div class="row">
                      <div class="col-lg-6 col-md-6">
                        <div class="form-group">
                          <label>ค้นหา</label>
                          <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search" />
                            <span class="input-group-btn">
                              <button class="btn btn-default"><i class="fa fa-search"></i></button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th class="tf-2">No.</th>
                          <th class="tf-2-5 text-center">Manage</th>
                          <th class="tf-3 text-center">Form Code</th>
                          <th class="tf-5">Form Name</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="x,idx in datalist">
                          <td align="center" class="text-bold">{{idx+1}}.</td>
                          <td class="text-center nowrap text-nowrap" nowrap><a href="#" @click.prevent="doEdit(x)">Edit</a></td>
                          <td align="center" class="text-bold">{{x.code}}</td>
                          <td>{{x.description}}</td>
                          <td>{{x.remark}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-show="activeTab===2">
                    <app-form ref="appForm">
                      <template slot="form-field">
                        <div class="row">
                          <div class="col-lg-2 col-md-6">
                            <div class="form-group">
                              <label class="text-danger">Form Code</label>
                              <input type="text" class="form-control" v-model.trim="form['code']" :disabled="isEdit" />
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="form-group">
                              <label class="text-danger">Form Name</label>
                              <input type="text" class="form-control" v-model.trim="form['description']" />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-6">
                            <label>Remark</label>
                            <div class="form-group">
                              <textarea class="form-control" rows="4" v-model.trim="form['remark']" maxlength="2000"></textarea>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-12">
                            <table class="table table-striped table-hover table-bordered table-responsive">
                              <thead>
                                <tr>
                                  <th class="text-center" style="width:10px">Manage</th>
                                  <th class="text-nowrap nowrap text-center" nowrap style="width:10px">No.</th>
                                  <th class="text-nowrap nowrap" nowrap>Item Name</th>
                                  <th class="text-nowrap nowrap" nowrap style="width:10px">Max Score</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="x in detail">
                                  <td align="center"><a href="#" @click.prevent="doDelete(x.itemno)">Delete</a></td>
                                  <td class="text-nowrap nowrap">{{x.itemno}}</td>
                                  <td>{{x.itemname}}</td>
                                  <td><input type="text" class="form-control" v-model.number="x['maxscore']" /></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </template>
                      <template slot="extraBtn">
                        <button class="btn btn-sm btn-github" @click.prevent="openModalItem()">เพิ่มรายการ</button>
                      </template>
                    </app-form>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" ref="myModal" role="dialog" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 style="margin: 0px;">Form Items</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <div class="input-group">
                          <input type="text" class="form-control" placeholder="Search" />
                          <span class="input-group-btn">
                            <button class="btn btn-default"><i class="fa fa-search"></i></button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                          <thead>
                            <tr class="text-center">
                              <th style="width: 50px" class="no-wrap text-nowrap text-center" nowrap>Select</th>
                              <th style="width: 50px" class="no-wrap text-nowrap text-center" nowrap>Item Code</th>
                              <th style="width: 200px" class="no-wrap text-nowrap" nowrap>Item Name</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="x in itemsDataDisplay">
                              <td class="text-center" style="width:1px">
                                <input type="checkbox" v-model="x.selected">
                              </td>
                              <td align="center">{{x.line_number}}</td>
                              <td>{{x.itemname}}</td>
                              <td>{{x.remark}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-sm btn-info" @click="selectList()">Select</button>
                  <button class="btn btn-sm btn-default" data-dismiss="modal">Cancel</button>
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
  let process = false;
  let cpn = {
    data() {
      return {
        activeTab: 1,
        search: {},
        datalist: [],
        form: {},
        detail: [],
        itemsDataDisplay: [],
        isEdit: false,
      }
    },
    methods: {
      ChangeTab(t) {
        this.activeTab = t;
        if (t == 1) { this.doReset(); }
      },
      async loadData() {
        let act = `CSM/Master/QC_ReadList`;
        let rsp = await $xt.getServer(act);
        this.datalist = rsp;
      },
      doReset() {
        this.form = {};
        this.detail = [];
        this.isEdit = false;
        appForm.btnDelete.show = false;
      },
      async doSave() {
        try {
          let f = {
            header: this.form,
            detail: this.detail,
          };

          page.loadingBox.show();
          var act = `CSM/Master/QC_Create`;
          if (this.isEdit) { var act = `CSM/Master/QC_Update`; }
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.loadData();
          this.ChangeTab(1);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async doDelete(itemno) {
        this.detail = $linq(this.detail).where(x => x.itemno != itemno).toArray();
        let i = 1;
        $linq(this.detail).foreach(x => {
          x.itemno = i++;
        });
      },
      async onDel() {
        if (process) return;
        if (!this.isEdit) return;
        
        if (!await $msg.confirm(`คุณต้องการลบข้อมูล : ${this.form.description} นี้ ใช่หรือไม่`)) {
          return;
        }

        try {
          let act = `CSM/Master/QC_Delete?code=${this.form.code}`;

          page.loadingBox.show();
          let rsp = await $xt.getServer(act);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.doReset();
          await this.loadData();

          $msg.alert(``, `Success`, `success`);
          this.ChangeTab(1);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async doEdit(x) {
        this.ChangeTab(2);
        this.isEdit = true;
        appForm.btnDelete.show = true;

        let act = `CSM/Master/QC_Read?code=${x.code}`;
        let rsp = await $xt.getServer(act);
        this.form = x;
        this.detail = rsp;
      },
      openModalItem() {
        $(this.$refs.myModal).modal("show");
        this.loadItem();
      },
      async loadItem() {
        let act = `CSM/Master/QCItem_ReadList`;
        let rsp = await $xt.getServer(act);
        this.itemsDataDisplay = rsp;
      },
      selectList() {
        let arr = $linq(this.itemsDataDisplay).where(x => x.selected).toArray();
        arr.forEach((x, idx) => {
          let itemno = this.detail.length == 0 ? 1 : $linq(this.detail).max(x => x.itemno) + 1;
          this.detail.push({
            itemno: itemno,
            itemcode: x.line_number,
            itemname: x.itemname,
            maxscore: 0
          });
        });
        $(this.$refs.myModal).modal("hide");
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'Setup : จัดการชุดคำถาม';
      document.title = page.pageTitle;

      appForm = this.$refs.appForm;
      appForm.btnRetrieve.show = false;
      appForm.btnPrint.show = false;
      appForm.btnBack.show = false;
      appForm.btnDelete.show = false;
      appForm.btnDelete.click = this.onDel;
      appForm.btnNew.click = this.doReset;
      appForm.btnSave.click = this.doSave;
      //appForm.btnDelete.click = this.doDelete;

      this.loadData();

    }
  };

  export default cpn;
</script>
