<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active:tab1Active===0}"><a href="#" @click.prevent="changeTab1(0)">Data List ({{total_datalist || 0}})</a></li>
                <li :class="{active:tab1Active===1}"><a href="#" @click.prevent="changeTab1(1)" v-if="permission()">Create / Edit</a></li>
              </ul>
              <div class="tab-content">
                <div class="tab-pane" :class="{active:tab1Active===0}">
                  <div class="row">
                    <!--Search-->
                    <div class="col-lg-6 col-md-12">
                      <div class="form-group">
                        <label v-text="ui.search || 'ค้นหา'"></label>
                        <div class="input-group">
                          <input type="text" class="form-control input-sm" v-model.trim="search.text" @keypress.enter="load" />
                          <span class="input-group-btn">
                            <button class="btn btn-sm btn-default" @click="load"><i class="fa fa-search"></i></button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <!--Export Import-->
                    <div class="col-lg-6 col-md-12">
                      <span class="pull-right">
                        <button class="btn btn-sm btn-default" @click="onExport"><i class="fas fa-file-export"></i> Export Excel</button>
                        <button class="btn btn-sm btn-tumblr" @click="addFile"><i class="fas fa-file-import"></i> Import Excel</button>
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 col-md-12">
                      <!--Data table tab1-->
                      <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width:1px">#</th>
                              <th style="width:1px" v-if="permission()">Edit</th>
                              <th>Warranty Code</th>
                              <th>Warranty Name</th>
                              <th>Work Type</th>
                              <th>Warranty Date</th>
                              <th style="width:50px">Lifetime</th>
                              <th class="text-center" style="width:50px">Active</th>
                              <th>Add User</th>
                              <th class="text-center">Add Date</th>
                              <th>Edit User</th>
                              <th class="text-center">Edit Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(x,idx) in displayData">
                              <td align="center">{{x.idx}}.</td>
                              <td align="center" v-if="permission()"><a href="#" @click.prevent="edit(x)"><i class="fa fa-edit"></i></a> </td>
                              <td>{{x.war_code}}</td>
                              <td>{{x.war_des}}</td>
                              <td>{{x.type_name}}</td>
                              <td>{{x.lifetime == 'Y' ? "ประกันตลอดอายุการใช้งาน" : x.tot_warranty}}</td>
                              <td class="font-bold" align="center">
                                <span v-show="x.lifetime=='Y'" style="color:#00c116;">Yes</span>
                                <span v-show="x.lifetime=='N'|| x.lifetime==Null" style="color:#ff0000;">No</span>
                              </td>
                              <td class="font-bold" align="center">
                                <span v-show="x.active=='Y'" style="color:#00c116;">Yes</span>
                                <span v-show="x.active=='N'|| x.active==Null" style="color:#ff0000;">No</span>
                              </td>
                              <td class="text-nowrap nowrap" nowrap>{{x.add_user}}</td>
                              <td class="text-nowrap nowrap" nowrap align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                              <td class="text-nowrap nowrap" nowrap>{{x.edit_user}}</td>
                              <td class="text-nowrap nowrap" nowrap align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 col-md-12">
                      <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page, 'datalist')"></pagination>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" :class="{active:tab1Active===1}">
                  <app-form ref="appForm">
                    <template slot="form-field">
                      <!-- Row 1 -->
                      <div class="row">
                        <div class="col-lg-2 col-md-4">
                          <div class="form-group">
                            <label class="text-danger">Warranty Code</label>
                            <input type="text" class="form-control input-sm" maxlength="15" v-model="formData['war_code']" :readonly="isEdit" />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                          <div class="form-group">
                            <label class="text-danger">Warranty Name</label>
                            <input type="text" class="form-control input-sm" maxlength="200" v-model="formData['war_des']" />
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-2">
                          <div class="form-group">
                            <label>&nbsp;</label>
                            <div>
                              <input type='checkbox' class='ios8-switch' id='checkbox-1' v-model="formData['active']" true-value="Y" false-value="N">
                              <label for='checkbox-1'>Active</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Row 2 -->
                      <div class="row">
                        <div class="col-lg-2 col-md-2">
                          <div class="form-group">
                            <label>Days</label>
                            <number class="form-control input-sm" decimals="0" v-model.number="formData['tot_date']" :readonly="formData['lifetime'] == 'Y'" v-on:change="testday()"></number>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-2">
                          <div class="form-group">
                            <label>Month</label>
                            <number class="form-control input-sm" decimals="0" v-model.number="formData['tot_month']" :readonly="formData['lifetime'] == 'Y'"></number>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-2">
                          <div class="form-group">
                            <label>Year</label>
                            <number class="form-control input-sm" decimals="0" v-model.number="formData['tot_year']" :readonly="formData['lifetime'] == 'Y'"></number>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-2">
                          <div class="form-group">
                            <label>&nbsp;</label>
                            <div>
                              <input type='checkbox' class='ios8-switch' id='checkbox-2' @change="setLifeTime()" v-model="formData['lifetime']" true-value="Y" false-value="N">
                              <label for='checkbox-2'>Lifetime</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Row 3 -->
                      <div class="row">
                        <div class="col-lg-2 col-md-4">
                          <div class="form-group">
                            <label class="text-danger">Work Type</label>
                            <span class="input-group">
                              <input type="text" class="form-control input-sm" v-model="formData['type_code']" readonly />
                              <span class="input-group-btn">
                                <button class="btn btn-sm btn-default" @click="$refs.ct_worktype.openModal()" :disabled="isEdit"><i class="fa fa-search"></i></button>
                                <button class="btn btn-sm btn-danger" @click="clearData(formData, ['type_code', 'type_name'])" :disabled="isEdit"><i class="fa fa-close"></i></button>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                          <div class="form-group">
                            <label class="text-danger">&nbsp;</label>
                            <input type="text" class="form-control input-sm" v-model="formData['type_name']" readonly />
                          </div>
                        </div>
                      </div>
                      <!-- Row 4 -->
                      <div class="row">
                        <div class="col-lg-2 col-md-4">
                          <div class="form-group">
                            <label class="text-danger">Material Code</label>
                            <span class="input-group">
                              <input type="text" class="form-control input-sm" v-model="formData.itemcode" readonly />
                              <span class="input-group-btn">
                                <button class="btn btn-sm btn-default" @click="$refs.ct_itemcode.openModal()"><i class="fa fa-search"></i></button>
                                <button class="btn btn-sm btn-danger" @click="clearData(formData, ['itemcode', 'itemname'])" :disabled="isEdit"><i class="fa fa-close"></i></button>
                              </span>
                            </span>
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                          <div class="form-group">
                            <label class="text-danger">&nbsp;</label>
                            <input type="text" class="form-control input-sm" :value="formData.itemname" readonly />
                          </div>
                        </div>
                      </div>
                    </template>
                  </app-form>
                  <div class="row" v-if="formData.lifetime == 'Y'">
                    <div class="col-lg-6 col-md-12">
                      <div class="callout callout-warning">
                        <h4><i class="icon fa fa-warning"></i> Remark</h4>
                        <p>
                          หากติ๊ก Lifetime คุณไม่จำเป็นต้องกำหนดวันหมดประกัน ในช่อง Days / Month / Year <br />
                          ** Lifetime คือ การประกันตลอดการใช้งาน
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Import File-->
        <input type="file" ref="File" accept=".xls, .xlsx" v-show="false" />
      </template>
    </re-page>
    <vue-worktype-list ref="ct_worktype" @send-data="sendComponent($event, 'work_type')"></vue-worktype-list>
    <vue-itemcode-list ref="ct_itemcode" @send-data="sendComponent($event, 'itemcode')"></vue-itemcode-list>
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
        auth,
        ui: window.ui,
        search: {},
        tab1Active: 0,
        datalist: [],
        displayData: [],
        total_datalist: 0,
        formData: {},
        dataAdmin: {},
        isEdit: false,
      };
    },
    methods: {
      changeTab1(t) {
        this.tab1Active = t;
      },
      //pageChange(pn, type) {
      //  (async () => {
      //    switch (type) {
      //      case "datalist":
      //        paging.setCurrentPage(pn);
      //        await this.load();
      //        break;
      //    }
      //  })();
      //},
      pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        let p = pn > 1 ? ((pn - 1) * 10) + 1 : pn;
        this.$set(this, "displayData", $linq(this.datalist).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
        $linq(this.displayData).foreach(x => {
          this.$set(x, "idx", p++);
        })
        paging.createPagesArray();
      },
      reset() {
        (async () => {
          this.isEdit = false;
          this.$set(this, "formData", {
            war_code: "",
            war_des: "",
            type_code: "",
            type_name: "",
            itemcode: "",
            tot_date: 0,
            tot_month: 0,
            tot_year: 0,
            lifetime: "N",
            active: "Y"
          });
          appForm.btnDelete.disabled = true;
          await this.load();
        })();
      },
      setEdit() {
        this.editMode = true;
        appForm.btnDelete.disabled = false;

      },
      load() {
        (async () => {
          let act = `csm/master/WarrantyItem_ReadList?skip=0&take=9999&search_text=${encodeURIComponent(this.search.text || '')}`;
          let rsp = await $xt.getServer(act);
          this.datalist = rsp.data.data_rows;
          this.total_datalist = rsp.data.total;

          paging.setTotalItems(rsp.data.total);
          if (!paging.getItemsPerPage()) {
            paging.setCurrentPage(1);
          }
          paging.createPagesArray();
          this.pageChange(1);
        })();
      },
      read(war_code) {
        (async () => {
          let act = `csm/master/WarrantyItem_Read?war_code=${encodeURIComponent(war_code || '')}`;
          let rsp = await $xt.getServer(act);
          this.$set(this, "formData", rsp.data);
          this.setEdit();
        })();
      },
      edit(x) {
        (async () => {
          this.isEdit = true;
          this.changeTab1(1);
          await this.read(x.war_code);
          $('html,body').scrollTop(0);
        })();
      },
      save() {
        (async () => {
          if (process) return;

          try {
            let f = {
              header: this.formData
            };

            let act = `CSM/MASTER/WarrantyItem_Create`;
            if (this.isEdit) {
              act = `CSM/MASTER/WarrantyItem_Update`;
            }

            page.loadingBox.show();
            let rsp = await $xt.postServerJson(act, f);
            if (!rsp.success) {
              throw rsp.error;
            }

            //await this.read(rsp.data);
            await this.load();

            $msg.alert(``, `Success`, `success`);
            this.changeTab1(0);
            this.reset();
          } catch (ex) {
            $msg.alert(``, ex.toString(), `danger`);
          } finally {
            process = false;
            page.loadingBox.hide();
          }
        })();
      },
      delete() {
        (async () => {
          if (process) return;
          if (!this.isEdit) return;

          if (!await $msg.confirm(`คุณต้องการลบข้อมูล Warranty : ${this.formData['war_des']} นี้ ใช่หรือไม่`)) {
            return;
          }

          try {

            let f = {
              header: this.formData
            };

            let act = `CSM/Master/WarrantyItem_Delete`;

            page.loadingBox.show();
            let rsp = await $xt.postServerJson(act, f);
            if (!rsp.success) {
              throw rsp.error;
            }

            await this.reset();
            await this.load();

            $msg.alert(``, `Success`, `success`);
            this.reset();
            this.changeTab1(0);
          } catch (ex) {
            $msg.alert(``, ex.toString(), `danger`);
          } finally {
            process = false;
            page.loadingBox.hide();
          }
        })();
      },
      sendComponent(e, type) {
        switch (type) {
          case "work_type":
            this.formData.type_code = e.type_code;
            this.formData.type_name = e.type_name;
            break;
          case "itemcode":
            this.formData.itemcode = e.type_code;
            this.formData.itemname = e.type_name;
            if ($xt.isEmpty(this.formData["war_code"]) || $xt.isEmpty(this.formData["war_des"])) {
              this.formData["war_code"] = e.type_code;
              this.formData["war_des"] = e.type_name;
            }
            break;
        }
      },
      clearData(data, field) {
        $linq(field).foreach(x => this.$set(data, x, null));
      },
      setLifeTime() {
        this.formData.tot_year = 0;
        this.formData.tot_month = 0;
        this.formData.tot_date = 0;
      },
      is_mango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        return isMango == "Y" ? true : false;
      },
      permission() {
        let data = (!this.is_mango() || auth.is_admin);
        return data;
      },
      addFile() {
        $(this.$refs.File).click();
      },
      onExport() {
        let arr = [];
        if (this.datalist.length > 0) {
          $linq(this.datalist).foreach(x => {
            arr.push({
              'war_code': x.war_code,
              'war_des': x.war_des,
              'type_code': x.type_code,
              'itemcode': x.itemcode,
              'active': x.active,
              'tot_date': x.tot_date,
              'tot_month': x.tot_month,
              'tot_year': x.tot_year,
              'lifetime': x.lifetime,
            })
          });
        }
        else {
          arr.push({
            'war_code': "",
            'war_des': "",
            'type_code': "",
            'itemcode': "",
            'active': "",
            'tot_date': "",
            'tot_month': "",
            'tot_year': "",
            'lifetime': "",
          })
        }
        var dataWS = XLSX.utils.json_to_sheet(arr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(wb, 'Warranty_Item.xlsx');
      },
      async doUpload(f) {
        page.loadingBox.show();
        try {
          let act = `CSM/Master/WarrantyItemImport_Master`;
          let fd = new FormData();
          fd.append('file', f);

          let rsp = await $xt.postServerForm(act, fd);
          if (!rsp.success) {
            throw new Error(rsp.error);
          }
          else {
            $notify.success('นำเข้าข้อมูลเสร็จสิ้น');
            await this.load();
          }
        } catch (ex) {
          $msg.alert("", ex.toString(), "danger");
        }
        finally {
          page.loadingBox.hide();
        }
      },
    },
    computed: {
      configData() { return store.state.configData },
    },
    mounted() {
      (async () => {
        page = this.$refs.page;
        page.pageTitle = 'Master : รายการสินค้าประกัน';
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnRetrieve.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnNew.click = this.reset;
        appForm.btnSave.click = this.save;
        appForm.btnDelete.click = this.delete;

        paging = this.$refs.paging;
        paging.setCurrentPage(1);
        paging.setItemsPerPage(10);

        this.reset();

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
