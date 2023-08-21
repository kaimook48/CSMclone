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
                    <input type="text" class="form-control input-sm text-bold" v-model="headerData['pre_event']" readonly />
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="$refs.ct_project.openModal()"><i class="fa fa-search"></i></button>
                    </span>
                  </span>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label style="text-overflow: ellipsis; white-space:nowrap;" class="pull-right">(กรุณาเลือกโครงการหลักก่อน ดูรายละเอียดของ Area นั้น)</label>
                  <input type="text" class="form-control input-sm" v-model="headerData.pre_des" readonly />
                </div>
              </div>
            </div>
            <!-- Project Unit/Phase -->
            <div class="row">
              <div class="col-lg-2 col-md-4">
                <div class="form-group">
                  <label class="text-danger">โครงการย่อย (Unit / Phase)</label>
                  <span class="input-group">
                    <input type="text" class="form-control input-sm text-bold" v-model="headerData['pre_event_unit']" readonly />
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="$refs.ct_project_unit.openModal()" :disabled="!headerData['pre_event2']"><i class="fa fa-search"></i></button>
                    </span>
                  </span>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label style="text-overflow: ellipsis; white-space:nowrap;" class="pull-right">(หากต้องการ Set โครงการหลักอย่างเดียว ไม่จำเป็นต้องเลือกช่องนี้)</label>
                  <input type="text" class="form-control input-sm" v-model="headerData['pre_des_unit']" readonly />
                </div>
              </div>
            </div>
            <!-- Show Area -->
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="box box-solid">
                  <div class="box-body">
                    <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-6">
                        <div><span class="text-danger">* หมายเหตุ : </span> หากกดเริ่มประกันแล้ว ไม่กดปุ่ม Save ด้านล่าง ข้อมูลทั้งหมดจะไม่มีผลใดๆทั้งสิ้น</div>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6">
                        <span class="pull-right">ผลลัพธ์ของข้อมูลทั้งหมด คือ {{dataList.length || 0}} รายการ</span>
                      </div>
                    </div>
                    <template v-for="(x,idx) in dataList">
                      <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12">
                          <div class="pull-left">
                            <h5><i class="fas fa-folder-open"></i> รหัสพื้นที่โครงการ : {{x.loccode}} | พื้นที่โครงการ : {{x.locname}}</h5>
                          </div>
                          <div class="pull-right">
                            <button class="btn btn-sm btn-tumblr" @click="addFile" v-if="(idx == 0 || false) && false">
                              <i class="fas fa-file-import"></i> นำเข้าข้อมูลรายการประกัน
                            </button>
                            <button class="btn btn-sm btn-danger" @click="deleteData()" v-if="(idx == 0 || false) && false">
                              <i class="fas fa-file-import"></i> ยกเลิกรายการประกันทั้งหมด
                            </button>
                            <button class="btn btn-sm bg-navy" @click="startWarrantyAllItem()" v-if="idx == 0">
                              <i class="ion ion-play"></i> เริ่มต้นประกันทั้งหมด (ทุก Area)
                            </button>
                            <button class="btn btn-sm btn-default" @click="startWarrantybyArea(x.item_warranty)" v-if="x.item_warranty.length > 0">
                              <i class="ion ion-play"></i> เริ่มต้นรายการประกันทั้งหมดใน Area
                            </button>
                            <button class="btn btn-sm btn-default" @click="startWarrantyInArea(x)" v-show="x.item_warranty.length <= 0"><i class="ion ion-play"></i> เริ่มต้นประกันของ Area นี้</button>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="table-responsive">
                            <table class="table table-bordered table-hover table-striped">
                              <thead>
                                <tr>
                                  <th class="tf-2 text-center">#</th>
                                  <th class="tf-2">Start</th>
                                  <th class="tf-2">Delete</th>
                                  <th class="tf-2">Code</th>
                                  <th class="tf-5">Warranty Name</th>
                                  <th class="tf-4" v-if="isREcustomer()">Model Name</th>
                                  <th class="tf-3-5">Warranty Date</th>
                                  <th class="tf-4" v-if="isREcustomer()">Serial Number</th>
                                  <th class="tf-4">Remark</th>
                                  <th class="tf-3-5">Start Date</th>
                                  <th class="tf-3-5">End Date</th>
                                  <th class="tf-4" v-if="useVendor()">Vendor</th>
                                  <th class="tf-3-5" v-if="useVendor()">Vendor Start Date</th>
                                  <th class="tf-3-5" v-if="useVendor()">Vendor End Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(z,idx2) in x.item_warranty">
                                  <td align="center">{{idx2+1}}.</td>
                                  <td align="center"><a href="#" @click.prevent="startWarrantybyItem(z)"><i class="ion ion-play"></i></a></td>
                                  <td class="text-center"><a href="#" class="text-danger" @click.prevent="delWarranty(z)"><i class="fa fa-trash"></i></a></td>
                                  <td>{{z.war_code}}</td>
                                  <td>{{z.war_des}}</td>
                                  <td v-if="isREcustomer()">
                                    <input type="text" class="form-control input-sm" v-model="z['itemname_other']" />
                                  </td>
                                  <td>{{z.lifetime == 'Y' ? 'ประกันตลอดอายุการใช้งาน' : z.tot_warranty}}</td>
                                  <td v-if="isREcustomer()">
                                    <input type="text" class="form-control input-sm" v-model="z['serial_number']" />
                                  </td>
                                  <td>
                                    <input type="text" class="form-control input-sm" v-model="z['remark']" />
                                  </td>
                                  <td>
                                    <datepicker input-class="form-control input-sm" v-model="z.startdate" @change="startWarrantybyItem(z)"></datepicker>
                                  </td>
                                  <td>
                                    <datepicker input-class="form-control input-sm" v-model="z.enddate" @change="startWarrantybyEnddate(z)"></datepicker>
                                  </td>
                                  <td v-if="useVendor()">
                                    <input type="text" class="form-control input-sm" v-model="z['vendor']" />
                                  </td>
                                  <td v-if="useVendor()">
                                    <datepicker input-class="form-control input-sm" v-model="z.vendor_start_dt" disabled></datepicker>
                                  </td>
                                  <td v-if="useVendor()">
                                    <datepicker input-class="form-control input-sm" v-model="z.vendor_end_dt" disabled></datepicker>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <!-- Loading (remove the following to stop the loading)-->
                  <div class="overlay" v-if="isLoading">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <!-- end loading -->
                </div>
              </div>
            </div>
            <app-form ref="appForm"></app-form>
          </div>
        </div>
        <input type="file" ref="File" accept=".xls, .xlsx" v-show="false" />
      </template>
    </re-page>
    <vue-project-list ref="ct_project" @send-data="sendComponent($event, 'project')"></vue-project-list>
    <vue-project-unit-list ref="ct_project_unit" :pre_event2="headerData['pre_event2']" @send-data="sendComponent($event, 'project_unit')"></vue-project-unit-list>
  </div>
</template>
<script>
  let page = {};
  let appForm = {};
  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        xt: $xt,
        isLoading: false,
        headerData: {},
        dataList: [],
        dataAdmin: {},
        company: window.baseCompany,
        transferDate: null,
      };
    },
    methods: {
      resetData() {
        let arr = ['pre_event', 'pre_des', 'pre_event_unit', 'pre_des_unit'];
        $linq(arr).foreach(f => this.$set(this.headerData, f, null));
        this.dataList = [];
      },
      async loadData() {
        this.isLoading = true;

        //if true Use(StartWarranty_ReadList2)
        let comp = ['GIS'].includes(this.company) ? '2' : '';

        let act = `CSM/MASTER/StartWarranty_ReadList${comp}?pre_event2=${encodeURIComponent(this.headerData.pre_event2 || '')}&pre_event=${encodeURIComponent(this.headerData.pre_event_unit || this.headerData.pre_event)}`;
        let rsp = await $xt.getServer(act);
        this.dataList = rsp.data.data_rows;

        this.isLoading = false;
      },
      async readWarranty(pre_event) {

        let act = `CSM/MASTER/StartWarranty_Read?pre_event=${pre_event}`;
        let rsp = await $xt.getServer(act);

        $linq(this.dataList).foreach(f => {
          $linq(f.item_warranty).foreach(x => {
            let p = $linq(rsp).where(w => w.war_code == x.war_code && w.loccode == f.loccode && w.itemno == x.itemno).firstOrDefault();

            if (!$xt.isEmpty(p)) {
              this.$set(x, "itemname_other", p.itemname_other);
              this.$set(x, "startdate", p.startdate);
              this.$set(x, "enddate", p.enddate);
              this.$set(x, "serial_number", p.serial_number);
              this.$set(x, "remark", p.remark);
            }
          });
        });

        await this.loadTransferDate(pre_event);

      },
      async loadTransferDate(pre_event) {
        let act = `CSM/MASTER/StartWarranty_TransferDate?pre_event=${pre_event || ''}`;
        let rsp = await $xt.getServer(act);
        this.transferDate = rsp;

        if (rsp != null) {
          $linq(this.dataList).foreach(f => {
            $linq(f.item_warranty).foreach(x => {
              this.startWarranty(x);
            });
          });
        }
        console.log("TransferDate: " + JSON.stringify(this.transferDate));
      },
      async saveData() {
        try {
          let formData = this.setData();
          let f = {
            header: formData
          };
          this.isLoading = true;
          let act = `CSM/MASTER/StartWarranty_Create`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $msg.alert(``, `Success`, `success`);
          this.isLoading = false;
        } catch (ex) {
          this.isLoading = false;
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          this.isLoading = false;
        }
      },
      async deleteData() {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูลรายการประกันทั้งหมด ใช่หรือไม่`)) {
          return;
        }

        try {
          let f = {
            pre_event: this.headerData['pre_event'],
            pre_event2: this.headerData['pre_event2']
          };
          this.isLoading = true;
          let act = `CSM/MASTER/StartWarranty_Delete`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $msg.alert(``, `Success`, `success`);
          this.isLoading = false;
        } catch (ex) {
          this.isLoading = false;
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          this.isLoading = false;
        }
        this.loadData();
      },
      setData() {
        let arr = [];
        console.log("setData");
        $linq(this.dataList).foreach(f => {
          $linq(f.item_warranty).foreach(x => {
            if (x.startdate != null) {
              arr.push({
                pre_event2: this.headerData["pre_event2"],
                pre_event: $xt.isEmpty(this.headerData["pre_event_unit"]) ? this.headerData["pre_event"] : this.headerData["pre_event_unit"],
                loccode: f.loccode,
                war_code: x.war_code,
                war_des: x.war_des,
                itemname_other: x.itemname_other,
                serial_number: x.serial_number,
                startdate: x.startdate,
                enddate: x.enddate,
                vendor: x.vendor,
                vendor_start_dt: x.vendor_start_dt,
                vendor_end_dt: x.vendor_end_dt,
                tot_date: x.tot_date,
                tot_month: x.tot_month,
                tot_year: x.tot_year,
              });
            }
          });
        });
        return arr;
      },
      async startWarrantybyItem(x) {
        if (!await $msg.confirm(`คุณต้องการเริ่มต้นประกัน ${x.war_des} ใช่หรือไม่ การกระทำนี้ไม่สามารถย้อนคืนได้ เมื่อ Start แล้ว กรุณากดปุ่ม Save เพื่อบันทึกรายการ`)) {
          return;
        }
        else {
          this.startWarranty(x);
        }
      },
      async startWarrantybyEnddate(x) {
        if (!await $msg.confirm(`คุณต้องการเริ่มต้นประกัน ${x.war_des} ใช่หรือไม่ การกระทำนี้ไม่สามารถย้อนคืนได้ เมื่อ Start แล้ว กรุณากดปุ่ม Save เพื่อบันทึกรายการ`)) {
          return;
        }
        else {
          var a = moment(x.enddate);
          var b = moment(x.startdate);

          var years = a.diff(b, 'year');
          b.add(years, 'years');

          var months = a.diff(b, 'months');
          b.add(months, 'months');

          var days = a.diff(b, 'days');
          this.$set(x, "tot_date", days);
          this.$set(x, "tot_month", months);
          this.$set(x, "tot_year", years);
          this.$set(x, "tot_warranty", (years + ' ปี/' + months + ' เดือน/' + days + ' วัน'));

          console.log(years + ' years ' + months + ' months ' + days + ' days');
          //console.log(x.tot_year + ' years ' + x.tot_month + ' months ' + x.tot_date + ' days');
        }
      },
      async startWarrantybyArea(item) {
        if (!await $msg.confirm(`คุณต้องการเริ่มต้นประกันทั้งหมดใน Area นี้ใช่หรือไม่ การกระทำนี้ไม่สามารถย้อนคืนได้ เมื่อ Start แล้ว กรุณากดปุ่ม Save เพื่อบันทึกรายการ`)) {
          return;
        }
        else {
          $linq(item).foreach(x => {
            this.startWarranty(x);
          });
        }
      },
      async startWarrantyAllItem() {
        if (!await $msg.confirm(`คุณต้องการเริ่มต้นประกันทั้งหมด ใช่หรือไม่ การกระทำนี้ไม่สามารถย้อนคืนได้ เมื่อ Start แล้ว กรุณากดปุ่ม Save เพื่อบันทึกรายการ`)) {
          return;
        }
        else {
          $linq(this.dataList).foreach(f => {
            $linq(f.item_warranty).foreach(x => {
              this.startWarranty(x);
            });
          });
        }
      },
      async startWarrantyInArea(x) {
        x.item_warranty.push({
          itemno: 1,
          war_code: x.war_code,
          war_des: x.war_des,
          loccode: x.loccode,
          locname: x.locname,
          serial_number: ""
        });
      },
      async sendComponent(e, type) {
        switch (type) {
          case "project":
            this.$set(this.headerData, "pre_event", e.pre_event);
            this.$set(this.headerData, "pre_event2", e.pre_event2);
            this.$set(this.headerData, "pre_des", e.pre_des);

            this.dataList = [];
            this.$set(this.headerData, "pre_event_unit", null);
            this.$set(this.headerData, "pre_des_unit", null);

            await this.loadData();
            await this.readWarranty(e.pre_event);
            break;
          case "project_unit":
            this.$set(this.headerData, "pre_event_unit", e.pre_event);
            this.$set(this.headerData, "pre_des_unit", e.pre_des);
            await this.loadData();
            await this.readWarranty(e.pre_event);
            break;
        }
      },
      startWarranty(x) {
        console.log("startWarranty");
        if ($xt.isEmpty(x.startdate)) {
          var todayDate = this.transferDate ?? new Date();
          todayDate = moment(todayDate).add(x.tot_year, 'years');
          todayDate = moment(todayDate).add(x.tot_month, 'months');
          todayDate = moment(todayDate).add((x.tot_date + (-1)), 'days');
          this.$set(x, "startdate", this.transferDate ?? new Date());
          this.$set(x, "enddate", todayDate);
        }
        else {
          var todayDate = x.startdate;
          todayDate = moment(todayDate).add(x.tot_year, 'years');
          todayDate = moment(todayDate).add(x.tot_month, 'months');
          todayDate = moment(todayDate).add((x.tot_date + (-1)), 'days');
          this.$set(x, "enddate", todayDate);
        }
      },
      async delWarranty(x) {
        if (!await $msg.confirm(`คุณต้องการลบวันเริ่มต้นประกัน ${x.war_des} ใช่หรือไม่ การกระทำนี้ไม่สามารถย้อนคืนได้ เมื่อลบแล้ว กรุณากดปุ่ม Save เพื่อบันทึกรายการ`)) {
          return;
        }
        else {
          this.$set(x, "startdate", null);
          this.$set(x, "enddate", null);
        }
      },
      addFile() {
        $(this.$refs.File).click();
      },
      async doUpload(f) {
        page.loadingBox.show();
        try {
          let act = `CSM/Master/WarrantyItemImport`;
          let fd = new FormData();
          fd.append('file', f);
          fd.append('pre_event', $xt.isEmpty(this.headerData["pre_event_unit"]) ? this.headerData["pre_event"] : this.headerData["pre_event_unit"]);

          let rsp = await $xt.postServerForm(act, fd);
          if (!rsp.success) {
            throw new Error(rsp.error);
          }
          else {
            $notify.success('นำเข้าข้อมูลเสร็จสิ้น');
          }
        } catch (ex) {
          $msg.alert("", ex.toString(), "danger");
        }
        finally {
          page.loadingBox.hide();
        }
        await this.loadData();
        await this.readWarranty(this.headerData['pre_event']);
      },
      isREcustomer() {
        return this.company != 'PAL';
      },
      useVendor() {
        return !['MG', 'PANNA', 'PAL'].includes(this.company);
      },
    },
    computed: {

    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = `Master : เริ่มต้นรายการประกัน`;
      document.title = page.pageTitle;

      appForm = this.$refs.appForm;
      appForm.btnRetrieve.show = false;
      appForm.btnPrint.show = false;
      appForm.btnBack.show = false;
      appForm.btnDelete.show = false;
      appForm.btnNew.click = this.resetData;
      appForm.btnSave.click = this.saveData;
      appForm.btnNew.show = true;
      appForm.btnSave.show = true;

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

    }
  };

  export default cpn;
</script>
