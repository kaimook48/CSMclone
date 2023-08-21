<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <app-form ref="appForm">
              <template slot="form-field">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th class="tf-3 text-center">การจัดการ</th>
                          <th>รายละเอียดหัวข้อ</th>
                          <th class="tf-3-5 text-center">ประเภทหัวข้อ</th>
                          <th class="tf-2-5 text-center">ลำดับชั้น</th>
                          <th class="tf-3 text-center">สถานะ</th>
                          <th class="tf-3-5 text-center">เพิ่มข้อมูลโดย</th>
                          <th class="tf-3-5 text-center">วันที่เพิ่มข้อมูล</th>
                          <th class="tf-3-5 text-center">แก้ไขข้อมูลโดย</th>
                          <th class="tf-3-5 text-center">วันที่แก้ไขข้อมูล</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="x,idx in dataDefault">
                          <!-- FAQ : Level 1 -->
                          <tr class="text-bold">
                            <td align="center">
                              <a href="#" @click.prevent="appendChild(x.level+1, x)">เพิ่ม</a> |
                              <a href="#" @click.prevent="spliceChild(idx)" :class="{'isDisabled': x.is_lvl1}">ลบ</a>
                            </td>
                            <td><input type="text" class="form-control input-sm" v-model="x['desc_type']" /></td>
                            <td align="center">หัวข้อหลัก</td>
                            <td align="center">{{x.level}}</td>
                            <td align="center" :class="{'text-danger': x.is_lvl1}">{{x.is_lvl1 ? 'นำไปใช้แล้ว' : 'ยังไม่ได้ใช้งาน'}}</td>
                            <td align="center">{{x.adduser}}</td>
                            <td align="center">{{x.adddate | date()}}</td>
                            <td align="center">{{x.edituser}}</td>
                            <td align="center">{{x.editdate | date()}}</td>
                          </tr>
                          <template v-for="y,idx1 in x.children" v-if="x.children.length > 0">
                            <!-- FAQ : Level 2 -->
                            <tr>
                              <td align="center">
                                <a href="#" @click.prevent="appendChild(y.level+1, y)">เพิ่ม</a> |
                                <a href="#" @click.prevent="spliceRow(x, idx1)" :class="{'isDisabled': y.is_lvl2}">ลบ</a>
                              </td>
                              <td><input type="text" class="form-control input-sm" v-model="y['desc_type']" style="padding-left:30px;" /></td>
                              <td align="center">หัวข้อย่อย</td>
                              <td align="center">{{y.level}}</td>
                              <td align="center" :class="{'text-danger': y.is_lvl2}">{{y.is_lvl2 ? 'นำไปใช้แล้ว' : 'ยังไม่ได้ใช้งาน'}}</td>
                              <td align="center">{{y.adduser}}</td>
                              <td align="center">{{y.adddate | date()}}</td>
                              <td align="center">{{y.edituser}}</td>
                              <td align="center">{{y.editdate | date()}}</td>
                            </tr>
                            <template v-for="z,idx2 in y.children" v-if="y.children.length > 0">
                              <!-- FAQ : Level 3 -->
                              <tr>
                                <td align="center">
                                  <a href="#" @click.prevent="appendChild(z.level+1, z)">เพิ่ม</a> |
                                  <a href="#" @click.prevent="spliceRow(y, idx2)" :class="{'isDisabled': z.is_lvl3}">ลบ</a>
                                </td>
                                <td><input type="text" class="form-control input-sm" v-model="z['desc_type']" style="padding-left:40px;" /></td>
                                <td align="center">หัวข้อย่อย</td>
                                <td align="center">{{z.level}}</td>
                                <td align="center" :class="{'text-danger': z.is_lvl3}">{{z.is_lvl3 ? 'นำไปใช้แล้ว' : 'ยังไม่ได้ใช้งาน'}}</td>
                                <td align="center">{{z.adduser}}</td>
                                <td align="center">{{z.adddate | date()}}</td>
                                <td align="center">{{z.edituser}}</td>
                                <td align="center">{{z.editdate | date()}}</td>
                              </tr>
                              <!-- FAQ : Level 4 -->
                              <tr v-for="x1,idx3 in z.children" v-if="z.children.length > 0">
                                <td align="center">
                                  <a href="#" :class="{'isDisabled': x1.is_lvl4}" @click.prevent="spliceRow(z, idx3)">ลบ</a>
                                </td>
                                <td><input type="text" class="form-control input-sm" v-model="x1['desc_type']" style="padding-left:50px;" /></td>
                                <td align="center">หัวข้อย่อย</td>
                                <td align="center">{{x1.level}}</td>
                                <td align="center" :class="{'text-danger': x1.is_lvl4}">{{x1.is_lvl4 ? 'นำไปใช้แล้ว' : 'ยังไม่ได้ใช้งาน'}}</td>
                                <td align="center">{{x1.adduser}}</td>
                                <td align="center">{{x1.adddate | date()}}</td>
                                <td align="center">{{x1.edituser}}</td>
                                <td align="center">{{x1.editdate | date()}}</td>
                              </tr>
                            </template>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
              <template slot="extraBtn">
                <button class="btn btn-sm btn-default" @click.prevent="appendRow(1)"><i class="fas fa-plus-circle"></i> เพิ่มหัวข้อใหญ่</button>
              </template>
            </app-form>
          </div>
        </div>
      </template>
    </re-page>
  </div>
</template>
<script>
  let page = {};
  let appForm = {};
  let cpn = {
    data() {
      return {
        auth: window.auth,
        dataDefault: [],
        dataDisplay: [],
        dataTemp: [],
        max: 0,
      }
    },
    methods: {
      async loadData() {
        let act = `CSM/Manual/FAQReadList`;
        let rsp = await $xt.getServer(act);
        $linq(rsp.data).foreach(x => {
          x.children = [];
        });
        this.dataDefault = rsp.data;
        this.dataTemp = [];
        this.max = $linq(this.dataDefault).max(x => x.itemno);

        let arr = [];
        $linq(this.dataDefault).foreach(f => {
          if (f.parent_itemno === 0) {
            arr.push(f);
          } else {
            this.generateChildData(f);
          }
        });
        this.$set(this, 'dataDefault', arr);
      },
      generateChildData(item) {
        let d = $linq(this.dataDefault).where(x => x.itemno == item.parent_itemno).firstOrDefault();
        d.children.push(item);
      },
      async saveData() {
        try {
          this.onSetData();
          let f = {
            data: this.dataTemp
          };
          let act = `CSM/Manual/FAQ_Create`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.loadData();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      appendRow(level) {
        this.max += 1;
        this.dataDefault.push({
          itemno: this.max,
          desc_type: "",
          parent_itemno: 0,
          level: level,
          faq_type: 'H',
          children: [],
        });
      },
      appendChild(level, obj) {
        this.max += 1;
        obj.children.push({
          itemno: this.max,
          desc_type: '',
          parent_itemno: obj.itemno,
          level: level,
          faq_type: 'D',
          children: [],
        });
      },
      async spliceRow(obj, index) {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูลนี้ใช่หรือไม่ หากยืนยันกรุณากดปุ่มบันทึกอีกครั้งเพื่อยืนยันข้อมูล`)) {
          return;
        }
        obj.children.splice(index, 1);
      },
      async spliceChild(index) {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูลนี้ใช่หรือไม่ หากยืนยันกรุณากดปุ่มบันทึกอีกครั้งเพื่อยืนยันข้อมูล`)) {
          return;
        }
        this.dataDefault.splice(index, 1);
      },
      onSetData() {
        $linq(this.dataDefault).foreach(f => {
          this.dataTemp.push(f);
          if (f.children.length > 0) {
            this.onSetChildren(f.children);
          }
        });
      },
      onSetChildren(children) {
        let arr = $linq(children).toArray() || [];
        $linq(arr).foreach(v => {
          this.dataTemp.push(v);
          if (v.children.length > 0) {
            this.onSetChildren(v.children);
          }
        });
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'Setup : สร้างกลุ่มหัวข้อคำถามที่พบบ่อย (FAQ)';
      document.title = page.pageTitle;

      appForm = this.$refs.appForm;
      appForm.btnRetrieve.show = false;
      appForm.btnNew.show = false;
      appForm.btnDelete.show = false;
      appForm.btnPrint.show = false;
      appForm.btnBack.show = false;
      appForm.btnSave.click = this.saveData;

      this.loadData();
    }
  }

  export default cpn;
</script>
<style scoped>

  thead > tr > th {
    background-color: #eeeeee;
    color: black;
    font-weight: 500 !important;
    vertical-align: middle !important;
  }

  .table-bordered {
    border: 1px solid black !important;
  }

    .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
      border: 1px solid black !important;
    }


  .isDisabled {
    color: currentColor;
    cursor: not-allowed;
    opacity: 0.5;
    text-decoration: none;
    pointer-events: none;
  }
</style>
