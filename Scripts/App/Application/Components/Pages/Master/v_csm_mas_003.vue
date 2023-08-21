<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <!-- Project Contract -->
            <div class="row">
              <div class="col-lg-2 col-md-4">
                <div class="form-group">
                  <label class="text-danger">โครงการหลัก</label>
                  <span class="input-group">
                    <input type="text" class="form-control input-sm" v-model="area.pre_event" readonly />
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="$refs.ct_project.openModal()"><i class="fa fa-search"></i></button>
                      <button class="btn btn-sm btn-danger" @click="clearData(area, ['pre_event', 'pre_des'])"><i class="fa fa-close"></i></button>
                    </span>
                  </span>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <label class="pull-right">&nbsp;</label>
                  <input type="text" class="form-control input-sm" v-model="area.pre_des" readonly />
                </div>
              </div>
            </div>
            <!-- Main Data -->
            <div class="row">
              <div class="col-lg-12 col-md-12">
                <div class="nav-tabs-custom">
                  <ul class="nav nav-tabs">
                    <li class="isDisabled" :class="{active:tabActive===0}"><a href="#" @click.prevent="changeTab(0)">พื้นที่โครงการ</a></li>
                    <li class="isDisabled" :class="{active:tabActive===1}"><a href="#" @click.prevent="changeTab(1)">รายการประกัน</a></li>
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane" :class="{active:tabActive===0}">
                      <app-form ref="areaForm">
                        <template slot="form-field">
                          <div class="row">
                            <div class="col-lg-2 col-md-4">
                              <div class="form-group">
                                <label class="text-danger">รหัสพื้นที่</label>
                                <input type="text" class="form-control input-sm" maxlength="200" v-model="area.loccode" :disabled="!area.pre_event || editMode" />
                              </div>
                            </div>
                            <div class="col-lg-4 col-md-4">
                              <div class="form-group">
                                <label>ชื่อพื้นที่</label>
                                <input type="text" class="form-control input-sm" maxlength="200" v-model="area.locname" :disabled="!area.pre_event" />
                              </div>
                            </div>
                            <div class="col-lg-2 col-md-4">
                              <div class="form-group">
                                <label>นำไปใช้งาน</label><br />
                                <input type='checkbox' class='ios8-switch' id='checkbox-1' v-model="area.active" true-value="Y" false-value="N" :disabled="!area.pre_event">
                                <label for='checkbox-1'>&nbsp;</label>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template slot="extraBtn">
                          <button class="btn btn-sm btn-default" @click="openProjectModal()" :disabled="!area.pre_event"><i class="fas fa-copy"></i> คัดลอกพิ้นที่ไปยังโครงการอื่น</button>
                        </template>
                      </app-form>
                      <div class="row">
                        <div class="col-lg-6 col-md-12">
                          <div class="form-group">
                            <label v-text="ui.serach || 'ค้นหา'"></label>
                            <div class="input-group">
                              <input type="text" class="form-control input-sm" v-model.trim="searchArea.text" @keypress.enter="loadArea" />
                              <span class="input-group-btn">
                                <button class="btn btn-sm btn-default" @click="loadArea"><i class="fa fa-search"></i></button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12 col-md-12">
                          <table class="table table-bordered table-striped table-hover">
                            <thead>
                              <tr>
                                <th class="tf-2 text-center">ลำดับ</th>
                                <th class="tf-2 text-center" v-if="permission()">แก้ไข</th>
                                <th class="tf-2 text-center">ประกัน</th>
                                <th class="tf-3">รหัสพื้นที่</th>
                                <th class="tf-6">ชื่อพื้นที่</th>
                                <th class="tf-2 text-center">ใช้งาน</th>
                                <th class="tf-3 text-center" nowrap>เพิ่มโดย</th>
                                <th class="tf-3 text-center" nowrap>วันที่เพิ่ม</th>
                                <th class="tf-3 text-center" nowrap>แก้ไขโดย</th>
                                <th class="tf-3 text-center" nowrap>วันที่แก้ไข</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(x,idx) in display_area">
                                <td align="center" class="text-bold">{{x.itemno}}.</td>
                                <td align="center" v-if="permission()"><a href="#" @click.prevent="editArea(x)"><i class="fa fa-edit"></i></a> </td>
                                <td align="center"><a href="#" @click.prevent="setItem(x)"><i class="fa fa-copy"></i></a> </td>
                                <td>{{x.loccode}}</td>
                                <td>{{x.locname}}</td>
                                <td align="center" :class="{'text-success' : x.active == 'Y','text-danger': x.active != 'Y'}">
                                  {{x.active == 'Y' ? "Yes" : "No"}}
                                </td>
                                <td align="center" nowrap>{{x.adduser}}</td>
                                <td class="text-nowrap nowrap" nowrap align="center">{{x.adddatetime|date('DD/MM/YYYY HH:mm')}}</td>
                                <td align="center" nowrap>{{x.edituser}}</td>
                                <td class="text-nowrap nowrap" nowrap align="center">{{x.editdatetime|date('DD/MM/YYYY HH:mm')}}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div class="tab-pane" :class="{active:tabActive===1}">
                      <app-form ref="itemForm">
                        <template slot="form-field">
                        </template>
                      </app-form>
                      <div class="row">
                        <div class="col-lg-2 col-md-4">
                          <div class="form-group">
                            <label>รหัสพื้นที่</label>
                            <input type="text" class="form-control input-sm" :value="show_area.loccode" readonly />
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-6">
                          <div class="form-group">
                            <label>ชื่อพื้นที่</label>
                            <input type="text" class="form-control input-sm" :value="show_area.locname" readonly />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12 col-md-12">
                          <div class="table-responsive">
                            <table class="table table-bordered table-striped table-hover">
                              <thead>
                                <tr>
                                  <th style="width:1px">#</th>
                                  <th style="width:1px;" v-if="permission()">Delete</th>
                                  <th style="width:150px;">Warranty Code</th>
                                  <th>Warranty Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="x,idx in display_item">
                                  <td>{{x.itemno}}.</td>
                                  <td align="center" v-if="permission()"><a href="#" @click.prevent="removeItem(x)"><i class="fa fa-trash"></i></a> </td>
                                  <td>{{x.war_code}}</td>
                                  <td>{{x.war_des}}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-show="data_area.length > 0">
                    <div class="col-md-12">
                      <div class="col-md-12">
                        <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>
    <!-- Item Warranty -->
    <modal ref="ItemWarranty">
      <template slot="header">
        <h4>Item Warranty</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label>Search :</label>
              <div class="input-group">
                <input type="text" class="form-control input-sm" v-model.trim="itemSearch.search" @keyup.enter="loadItem" />
                <span class="input-group-btn"><button class="btn btn-sm btn-default" @click="loadItem"><i class="fa fa-search"></i></button></span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th style="width:1px">
                      <input type="checkbox" @click="selectAllWarr()" v-model="all_select" />
                    </th>
                    <th style="width:1px">#</th>
                    <th>Warranty Code</th>
                    <th>Warranty Name</th>
                    <th>Work Type</th>
                    <th>Warranty Date</th>
                    <th align="center" style="width:50px">Lifetime</th>
                    <th align="center" style="width:50px">Active</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x in displayData" v-bind:key="x.item" :class="{'table-light-green': x.cc_select == 'Y'}" @click="x.cc_select == 'N' ? x.cc_select = 'Y' : x.cc_select = 'N'" style="cursor:pointer">
                    <td align="center"><input type="checkbox" true-value="Y" false-value="N" v-model="x.cc_select" /></td>
                    <td align="center">{{x.item}}.</td>
                    <td>{{x.war_code}}</td>
                    <td>{{x.war_des}}</td>
                    <td>{{x.type_name}}</td>
                    <td>{{x.lifetime == 'Y' ? "ประกันตลอดอายุการใช้งาน" : x.tot_warranty}}</td>
                    <td class="font-bold" align="center">
                      <span :class="{'text-green': x.lifetime == 'Y','text-red': x.lifetime=='N' || xt.isEmpty(x.lifetime)}">
                        {{x.lifetime == 'Y' ? 'Yes' : 'No'}}
                      </span>
                    </td>
                    <td class="font-bold" align="center">
                      <span :class="{'text-green': x.active == 'Y','text-red': x.active || xt.isEmpty(x.active)}">
                        {{x.active == 'Y' ? 'Yes' : 'No'}}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <pagination class="pull-left" ref="itemPaging" @page-change="onPageSelected($event.page, 'war_list')"></pagination>
        <button type="button" class="btn btn-sm btn-default" @click="pushItem"><i class="fa fa-plus"></i> Selected</button>
      </template>
    </modal>
    <!-- Item Materials -->
    <modal ref="ItemMaterials">
      <template slot="header">
        <h4>Item Materials</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-lg-3 col-md-4 col-sm-2">
            <div class="form-group">
              <label>Search :</label>
              <div class="input-group">
                <input type="text" class="form-control input-sm" v-model.trim="itemSearch.search" @keyup.enter="loadItemMat" />
                <span class="input-group-btn"><a class="btn btn-default" @click="loadItemMat"><i class="fa fa-search"></i></a></span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th style="width:5px"></th>
                    <th style="width:1px">#</th>
                    <th>Material Code</th>
                    <th>Material Group</th>
                    <th>Material Name</th>
                    <th>Spec/Size</th>
                    <th>Brand</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x in displayData" :class="{'table-light-green': x.cc_select == 'Y'}" @click="x.cc_select == 'N' ? x.cc_select = 'Y' : x.cc_select = 'N'" style="cursor:pointer">
                    <td align="center"><input type="checkbox" true-value="Y" false-value="N" v-model="x.cc_select" /></td>
                    <td align="center">{{x.item}}.</td>
                    <td>{{x.type_code}}</td>
                    <td>{{x.c_des}}</td>
                    <td>{{x.c_des1}}</td>
                    <td>{{x.c_des2}}</td>
                    <td>{{x.c_des3}}</td>
                    <td>{{x.unitname}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <pagination class="pull-left" ref="itemMatPaging" @page-change="onPageSelected($event.page, 'mat_list')"></pagination>
        <button type="button" class="btn btn-sm btn-default" @click="pushItemMat"><i class="fa fa-plus"></i> Selected</button>
      </template>
    </modal>
    <!-- Modal : Copy Area to Project -->
    <div class="modal fade" ref="projectCopyModal">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4><i class="fas fa-building"></i> Project Contract</h4>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <div class="row">
              <div class="col-md-2 col-sm-2 col-xs-2">
                <div style="margin-bottom:10px">
                  <button class="btn btn-sm bg-navy" @click="selectProjectAll()"><i class="fas fa-check-circle"></i> Select All</button>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr align="center">
                        <th style="width:10px">Select</th>
                        <th style="width: 100px" class="no-wrap text-nowrap" nowrap>Ref.Code</th>
                        <th style="width: 100px" class="no-wrap text-nowrap" nowrap>Project No</th>
                        <th>Project Name</th>
                        <th>Customer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in displayProject">
                        <td>
                          <span class="checkbox">
                            <label>
                              <input type="checkbox" v-model="x.isSelected">
                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                              &nbsp;
                            </label>
                          </span>
                        </td>
                        <td>{{x.refcode}}</td>
                        <td>{{x.pre_event}}</td>
                        <td>
                          {{x.pre_des}}
                          <span class="text-danger pull-right" style="font-weight: bold;" v-if="x.clo == 'Y'">(Closed)</span>
                        </td>
                        <td>{{x.customer_name}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div class="modal-footer">
            <pagination class="pull-left" ref="projectPaging" @page-change="onPageSelected($event.page, 'ProjectContractCopy')"></pagination>
            <button class="btn btn-sm bg-olive" @click.prevent="copyClick()"><i class="fas fa-save"></i> <span v-text="ui.save || 'Save'"></span></button>
          </div>
        </div>
      </div>
    </div>
    <!-- Center Modal -->
    <vue-project-list ref="ct_project" @send-data="sendComponent($event, 'project')"></vue-project-list>
  </div>
</template>
<script>
  let process = false;
  let page = {};
  let areaForm = {};
  let itemForm = {};
  let itemPaging = {};
  let itemMatPaging = {};
  let projectPaging = {};
  let paging = {};
  let cpn = {
    data() {
      return {
        ui: window.ui,
        company: window.baseCompany,
        xt: $xt,
        tabActive: 0,
        searchArea: {},
        itemSearch: { search: "" },
        area: {},
        data_area: [],
        data_item: [],
        displayData: [],
        display_area: [],
        display_item: [],
        show_area: {},
        itemlist: [],
        itemPage: 1,
        auth,
        editMode: false,
        editItem: false,
        projectContract: [],
        displayProject: [],
        projectPage: 1,
        all_select: false,
        pageNumber: 1,
        totalData: 0,
      };
    },
    methods: {
      pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        if (this.tabActive == 0) {
          this.$set(this, "display_area", $linq(this.data_area).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
        }
        else {
          this.$set(this, "display_item", $linq(this.data_item).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
          //ใช้สำหรับลบข้อมูลในหน้านั้นจนหมด
          this.display_item.length == 0 && pn != 1 ? this.pageChange(this.pageNumber - 1) : true;
        }
        paging.createPagesArray();
      },
      changeTab(t) {
        this.tabActive = t;
      },
      backTab() {
        paging.setTotalItems(this.totalData);
        this.show_area = {};
        this.data_item = [];
        this.display_item = [];
        this.changeTab(0);
        this.pageChange(1);
      },
      resetData() {
        this.show_area = {};
        this.data_area = [];
        this.data_item = [];
        this.display_area = [];
        this.display_item = [];
        this.resetArea();
      },
      resetArea() {
        this.$set(this.area, "loccode", "");
        this.$set(this.area, "locname", "");
        this.$set(this.area, "active", "Y");
        this.editMode = false;

        areaForm.btnDelete.disabled = true;
      },
      setEditArea() {
        this.editMode = true;
        areaForm.btnDelete.disabled = false;
      },
      async editArea(x) {
        $('html,body').scrollTop(0);
        await this.readArea(x.loccode);
      },
      async saveArea() {
        if (process) return;
        try {
          let f = {
            header: this.area
          };

          let act = `CSM/MASTER/ProjArea_Create`;
          if (this.editMode) {
            act = `CSM/MASTER/ProjArea_Update`;
          }

          process = true;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.loadArea();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
        }
      },
      async deleteArea() {
        if (process) return;
        if (!this.editMode) return;

        if (!await $msg.confirm(`คุณต้องการลบข้อมูล Area : ${this.area.loccode} นี้ ใช่หรือไม่`)) {
          return;
        }

        try {
          let f = {
            header: this.area
          };

          let act = `csm/master/ProjArea_Delete`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.resetArea();
          await this.loadArea();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
        }
      },
      setItem(x) {
        this.$set(this.show_area, "loccode", x.loccode);
        this.$set(this.show_area, "locname", x.locname);
        this.loadItemArea();
        this.changeTab(1);
      },
      addItem() {
        if (this.isMaterial()) {
          this.loadItemMat();
          this.$refs.ItemMaterials.openModal();
        }
        else {
          this.loadItem();
          this.$refs.ItemWarranty.openModal();
        }
      },
      //LoadData
      async loadArea() {
        let act = `CSM/MASTER/ProjArea_ReadList?search_text=${this.searchArea.text || ''}&pre_event2=${this.area.pre_event2}`;
        let rsp = await $xt.getServer(act);
        this.data_area = rsp.data.data_rows;
        this.totalData = rsp.data.total;

        let i = 1;
        $linq(this.data_area).foreach(x => {
          x.itemno = i++;
        });

        this.pageChange(this.pageNumber);
        paging.setTotalItems(this.totalData);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async readArea(loccode) {
        this.resetArea();
        let act = `csm/master/ProjArea_Read?loccode=${encodeURIComponent(loccode || '')}&pre_event2=${this.area.pre_event2}`;
        let rsp = await $xt.getServer(act);
        this.$set(this.area, "loccode", rsp.data.loccode);
        this.$set(this.area, "locname", rsp.data.locname);
        this.$set(this.area, "active", rsp.data.active);
        this.setEditArea();
      },
      async loadItemArea() {
        let act = `CSM/Master/ItemArea_ReadList?pre_event=${this.area.pre_event || ''}&pre_event2=${this.area.pre_event2 || ''}&loccode=${this.show_area.loccode || ''}`;
        let rsp = await $xt.getServer(act);
        this.data_item = rsp.data.data_rows;

        this.pageChange(this.pageNumber);//ใช้ pageChange set ข้อมูล display_item skip & take ของช้อมูล data_item

        paging.setTotalItems(rsp.data.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async loadItem(pn) {
        itemPaging.setCurrentPage(pn || 1);
        let act = `csm/master/WarrantyItem_ReadList?search_text=${this.itemSearch.search}`;
        let rsp = await $xt.getServer(act);

        this.all_select = false;
        $linq(rsp.data.data_rows).foreach(x => {
          x.cc_select = "N"
        });

        this.itemlist = $linq(rsp.data.data_rows).where(x => x.active == "Y").toArray() || [];
        let i = 0;
        $linq(this.itemlist).foreach(x => {
          this.$set(x, "item", ++i);
        });
        itemPaging.setTotalItems(this.itemlist.length || 1);
        this.onPageSelected(this.itemPage, 'war_list');
      },
      async loadItemMat(pn) {
        itemMatPaging.setCurrentPage(pn || 1);
        let act = `csm/Center/Material_ReadList`;
        let rsp = await $xt.getServer(act);

        $linq(rsp.data.data_rows).foreach(x => {
          x.cc_select = "N"
        });

        this.itemlist = $linq(rsp.data.data_rows).toArray() || [];
        let i = 0;
        $linq(this.itemlist).foreach(x => {
          this.$set(x, "item", ++i);
        });
        itemMatPaging.setTotalItems(this.itemlist.length || 1);
        this.onPageSelected(this.itemPage, 'war_list');
      },
      async pushItem() {
        let itemSelect = $linq(this.itemlist).where(x => x.cc_select == "Y").toArray() || [];
        let itemno = ((this.data_item.length == 0) ? 0 : ($linq(this.data_item).max(x => x.itemno) || 0)) + 1;
        $linq(itemSelect).foreach(x => {
          this.data_item.push({
            itemno: itemno++,
            war_code: x.war_code,
            war_des: x.war_des
          });
        });

        let t = $linq(this.data_item).count();
        paging.setTotalItems(t);
        this.pageChange(this.pageNumber);

        this.$refs.ItemWarranty.closeModal();
      },
      async pushItemMat() {
        let itemSelect = $linq(this.itemlist).where(x => x.cc_select == "Y").toArray() || [];
        let itemno = ((this.data_item.length == 0) ? 0 : ($linq(this.data_item).max(x => x.itemno) || 0)) + 1;
        $linq(itemSelect).foreach(x => {
          this.data_item.push({
            itemno: itemno++,
            war_code: x.type_code,
            war_des: x.c_des1
          });
        });

        let t = $linq(this.data_item).count();
        paging.setTotalItems(t);
        this.pageChange(this.pageNumber);

        this.$refs.ItemMaterials.closeModal();
      },
      removeItem(x) {
        this.data_item = $linq(this.data_item).where(w => !(w.itemno == x.itemno)).toArray() || [];
        let runno = 1;
        $linq(this.data_item).foreach(f => {
          f.itemno = runno++;
        });

        let t = $linq(this.data_item).count();
        paging.setTotalItems(t);
        this.pageChange(this.pageNumber);
      },
      async saveItem() {
        if (process) return;
        try {
          let header = {
            pre_event: this.area.pre_event,
            pre_event2: this.area.pre_event2,
            loccode: this.show_area.loccode
          };

          $linq(this.data_item).foreach(x => {
            x.pre_event = this.area.pre_event;
            x.pre_event2 = this.area.pre_event2;
            x.loccode = this.show_area.loccode;
          });

          let act = `CSM/Master/ItemArea_Create`;
          process = true;
          let rsp = await $xt.postServerJson(act, { header, detail: this.data_item });
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.loadItemArea();
          $notify.success(this.ui.alert_save_success);
        } catch (ex) {
          $msg.alert(`ผิดพลาด`, ex.toString(), `danger`);
        } finally {
          process = false;
        }
      },
      onPageSelected(pn, type) {
        switch (type) {
          case "war_list":
            pn = pn || 1;
            this.itemPage = pn;
            itemPaging.setCurrentPage(pn);

            this.displayData = $linq(this.itemlist).skip(itemPaging.skipItems()).take(itemPaging.getItemsPerPage()).toArray();
            this.displayData.push()
            itemPaging.createPagesArray();
            break;
          case "ProjectContractCopy":
            pn = pn || 1;
            this.projectPage = pn;
            projectPaging.setCurrentPage(pn);

            this.displayProject = $linq(this.projectContract).skip(projectPaging.skipItems()).take(projectPaging.getItemsPerPage()).toArray();
            this.displayProject.push()
            projectPaging.createPagesArray();
            break;
        }
      },
      sendComponent(e, type) {
        switch (type) {
          case "project":
            this.$set(this.area, "pre_event", e.pre_event);
            this.$set(this.area, "pre_event2", e.pre_event2);
            this.$set(this.area, "pre_des", e.pre_des);
            this.loadArea();
            break;
        }
      },
      clearData(data, field) {
        if (field[0] == "pre_event") this.resetData();
        $linq(field).foreach(x => this.$set(data, x, null));
      },
      openProjectModal() {
        $(this.$refs.projectCopyModal).modal("show");
        this.loadProjectContractCopy();
      },
      async loadProjectContractCopy() {
        let act = `CSM/Master/ProjectContract_Copy`;
        let rsp = await $xt.getServer(act);
        this.projectContract = $linq(rsp.data.data_rows).where(x => x.pre_event != this.area.pre_event).toArray() || [];

        projectPaging.setTotalItems(rsp.data.total || 1);
        this.onPageSelected(this.projectPage, 'ProjectContractCopy');
      },
      async copyClick() {
        var arr = $linq(this.projectContract).where(x => x.isSelected).toArray() || [];
        try {
          let f = {
            arr: arr,
            pre_event: this.area.pre_event
          };
          page.loadingBox.show();
          let act = `CSM/Master/ProjArea_CopyArea`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $msg.alert(``, `Success`, `success`);
          $(this.$refs.projectCopyModal).modal("hide");
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      selectProjectAll() {
        $linq(this.projectContract).foreach(x => {
          x.isSelected = true;
        });
      },
      isMaterial() {
        return this.company == "GIS";
      },
      selectAllWarr() {
        $linq(this.displayData).foreach(x => {
          x.cc_select = !this.all_select ? "Y" : "N";
        });
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
        page.pageTitle = 'Master : เพิ่มพื้นที่ในโครงการ';
        document.title = page.pageTitle;

        areaForm = this.$refs.areaForm;
        areaForm.btnRetrieve.show = false;
        areaForm.btnPrint.show = false;
        areaForm.btnBack.show = false;
        areaForm.btnNew.show = this.permission();
        areaForm.btnSave.show = this.permission();
        areaForm.btnDelete.show = this.permission();
        areaForm.btnNew.click = this.resetArea;
        areaForm.btnSave.click = this.saveArea;
        areaForm.btnDelete.click = this.deleteArea;

        itemForm = this.$refs.itemForm;
        itemForm.btnRetrieve.show = false;
        itemForm.btnPrint.show = false;
        itemForm.btnDelete.show = false;
        itemForm.btnNew.show = this.permission();
        itemForm.btnSave.show = this.permission();
        itemForm.btnNew.click = this.addItem;
        itemForm.btnSave.click = this.saveItem;
        itemForm.btnBack.click = this.backTab;

        itemPaging = this.$refs.itemPaging;
        itemPaging.setCurrentPage(1);
        itemPaging.setItemsPerPage(10);

        itemMatPaging = this.$refs.itemMatPaging;
        itemMatPaging.setCurrentPage(1);
        itemMatPaging.setItemsPerPage(10);

        projectPaging = this.$refs.projectPaging;
        projectPaging.setCurrentPage(1);
        projectPaging.setItemsPerPage(10);

        paging = this.$refs.paging;
        paging.setCurrentPage(1);
        paging.setItemsPerPage(10);

        this.resetArea();
        this.$refs.ItemWarranty.setSize('modal-lg');
        this.$refs.ItemMaterials.setSize('modal-xl');
      })();
    }
  };
  export default cpn;
</script>
<style scoped>
  .isDisabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .text-red {
    color: #ff0000 !important;
  }

  .text-green {
    color: #00c116 !important;
  }

  .checkbox, .radio {
    margin-top: unset;
    margin-bottom: unset;
  }

    .checkbox label, .radio label {
      padding-left: 10px;
    }
</style>
