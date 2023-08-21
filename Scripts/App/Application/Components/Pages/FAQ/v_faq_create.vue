<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div v-show="page===0">
          <div class="row">
            <div class="col-lg-9 col-md-9 col-sm-9">
              <div class="box box-solid">
                <div class="box-header">
                  <h4 class="box-title">รายการคำถามที่พบบ่อย</h4>
                </div>
                <div class="box-body">
                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <div class="form-group">
                        <label>ค้นหา</label>
                        <div class="input-group">
                          <input type="text" class="form-control" v-model="search.text" @keyup.enter="textSearch" />
                          <span class="input-group-btn"><button class="btn bg-navy" @click.prevent="textSearch"><i class="fas fa-search"></i></button></span>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-8 col-md-8 col-sm-8">
                      <div class="pull-right" style="margin-top:30px">
                        <button class="btn btn-sm btn-default" @click.prevent="newDocument()">สร้างรายการใหม่</button>
                      </div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>หัวข้อ</th>
                          <th class="tf-3-5 text-center">เลขที่อ้างอิง</th>
                          <th class="tf-3-5 text-center">เพิ่มข้อมูลโดย</th>
                          <th class="tf-3-5 text-center">วันที่เพิ่มข้อมูล</th>
                          <th class="tf-3-5 text-center">แก้ไขข้อมูลโดย</th>
                          <th class="tf-3-5 text-center">วันที่แก้ไขข้อมูล</th>
                          <th class="tf-3-5 text-center">สถานะอนุมัติ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="x in displayData">
                          <td><a href="#" @click.prevent="readDocument(x.docno)">{{x.subject}}</a></td>
                          <td align="center" class="text-bold">{{x.docno}}</td>
                          <td align="center">{{x.adduser}}</td>
                          <td align="center">{{x.adddate | date()}}</td>
                          <td align="center">{{x.edituser}}</td>
                          <td align="center">{{x.editdate | date()}}</td>
                          <td align="center" :class="{'text-success': x.approve == 'Y'}">{{x.approve == 'Y' ? 'อนุมัติแล้ว' : 'ยังไม่อนุมัติ'}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3">
              <div class="box box-solid">
                <div class="box-header">
                  <h4 class="box-title">ค้นหาข้อมูลโดย</h4>
                </div>
                <div class="box-body">
                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                      <table>
                        <tbody>
                          <tr>
                            <td><h6><i class="fas fa-angle-double-right"></i> <a href="#" @click.prevent="clearSerach()">รายการทั้งหมด</a></h6></td>
                          </tr>
                          <template v-for="x in faq_type_filter">
                            <tr>
                              <td><h6><i class="fas" v-bind:class="{'fa-angle-double-right pointer': x.children.length > 0, 'fa-circle': x.children.length == 0}" @click.prevent="openExpand(x.children)"></i> <a href="#" @click.prevent="filterSearch(x.itemno)">{{x['desc_type']}} ({{x.count_lvl1}} รายการ)</a></h6></td>
                            </tr>
                            <template v-for="y in x.children" v-if="x.children.length > 0 && y.isExpand">
                              <tr>
                                <td><h6 style="padding-left:25px"><i class="fas" v-bind:class="{'fa-angle-double-right pointer': y.children.length > 0, 'fa-circle': y.children.length == 0}" @click.prevent="openExpand(y.children)"></i> <a href="#" @click.prevent="filterSearch(x.itemno, y.itemno)">{{y['desc_type']}} ({{y.count_lvl2}} รายการ)</a></h6></td>
                              </tr>
                              <template v-for="z in y.children" v-if="y.children.length > 0 && z.isExpand">
                                <tr>
                                  <td><h6 style="padding-left:45px"><i class="fas" v-bind:class="{'fa-angle-double-right pointer': z.children.length > 0, 'fa-circle': z.children.length == 0}" @click.prevent="openExpand(z.children)"></i> <a href="#" @click.prevent="filterSearch(x.itemno, y.itemno, z.itemno)">{{z['desc_type']}} ({{z.count_lvl3}} รายการ)</a></h6></td>
                                </tr>
                                <tr v-for="x1 in z.children" v-if="z.children.length > 0 && x1.isExpand">
                                  <td><h6 style="padding-left:65px"><i class="fas fa-circle"></i> <a href="#" @click.prevent="filterSearch(x.itemno, y.itemno, z.itemno, x1.itemno)">{{x1['desc_type']}} ({{x1.count_lvl4}} รายการ)</a></h6></td>
                                </tr>
                              </template>
                            </template>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="page===1">
          <div class="box box-solid">
            <div class="box-header">
              <h4 class="box-title">หัวข้อ (คำถามที่พบบ่อย)</h4>
              <button class="btn btn-sm btn-default pull-right" v-if="editMode && header.approve != 'Y'" @click.prevent="approveConfirm"><i class="fas fa-check-circle"></i> อนุมัติรายการ</button>
              <button class="btn btn-sm btn-default pull-right" v-if="editMode && header.approve == 'Y'" @click.prevent="approveCancel"><i class="fas fa-times-circle"></i> ยกเลิกการอนุมัติ</button>
            </div>
            <div class="box-body">
              <ol class="breadcrumb">
                <li><a href="#" @click.prevent="page=0"><i aria-hidden="true" class="fa fa-arrow-left"></i> กลับไปยังหน้ารายการ</a></li>
              </ol>
              <fieldset :disabled="header.approve == 'Y'">
                <!-- Header : Row 1 -->
                <div class="row">
                  <div class="col-lg-8 col-md-12 col-sm-12">
                    <div class="form-group">
                      <label class="text-danger">หัวข้อ</label> <span class="pull-right" :class="{'text-success': header.approve == 'Y'}">สถานะ : {{header.approve == 'Y' ? 'อนุมัติแล้ว' : 'ยังไม่อนุมัติ'}}</span>
                      <input type="text" class="form-control" v-model="header.subject" maxlength="200" />
                    </div>
                  </div>
                </div>
                <!-- Header : Row 2 -->
                <div class="row">
                  <div class="col-lg-2 col-md-3 col-sm-3">
                    <div class="form-group">
                      <label class="text-danger">หัวข้อหลัก</label>
                      <select class="form-control" v-model="header.lvl_1" @change="itemChange(1)">
                        <option :value="null">-- โปรดเลือกหัวข้อ --</option>
                        <option v-for="x in faq_type_lvl_1" :value="x.itemno" v-text="x.desc_type"></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-2 col-md-3 col-sm-3">
                    <div class="form-group">
                      <label>หัวข้อย่อย (1)</label>
                      <select class="form-control" v-model="header.lvl_2" @change="itemChange(2)">
                        <option :value="null">-- โปรดเลือกหัวข้อ --</option>
                        <option v-for="x in findLvl(2, header.lvl_1)" :value="x.itemno" v-text="x.desc_type"></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-2 col-md-3 col-sm-3">
                    <div class="form-group">
                      <label>หัวข้อย่อย (2)</label>
                      <select class="form-control" v-model="header.lvl_3" @change="itemChange(3)">
                        <option :value="null">-- โปรดเลือกหัวข้อ --</option>
                        <option v-for="x in findLvl(3, header.lvl_2)" :value="x.itemno" v-text="x.desc_type"></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-2 col-md-3 col-sm-3">
                    <div class="form-group">
                      <label>หัวข้อย่อย (3)</label>
                      <select class="form-control" v-model="header.lvl_4">
                        <option :value="null">-- โปรดเลือกหัวข้อ --</option>
                        <option v-for="x in findLvl(4, header.lvl_3)" :value="x.itemno" v-text="x.desc_type"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="box box-solid">
            <div class="box-header">
              <h4 class="box-title">รายละเอียดและคำอธิบาย</h4>
            </div>
            <div class="box-body">
              <!-- Detail : List FAQ -->
              <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <div class="table-responsive">
                    <table class="table">
                      <tbody>
                        <tr v-if="detail.length == 0">
                          <td colspan="3">-- ไม่พบข้อมูลกรุณากดปุ่มเพิ่มหัวข้อ --</td>
                        </tr>
                        <template v-for="x,idx in detail">
                          <tr>
                            <td align="center" class="tf-2-5 text-bold"><input type="text" class="form-control input-sm text-center" v-model="x.sort_itemno" /></td>
                            <td align="center" class="tf-2-5"><a href="#" :class="{'isDisabled': header.approve == 'Y'}" @click.prevent="spliceRow(idx)"><i class="fas fa-times"></i></a></td>
                            <td style="width:100%">
                              <div class="col-lg-12">
                                <input type="text" class="form-control input-sm" v-model="x.subject" />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" colspan="3">
                              <img :src="createPath(x.pic_path)" class="img-responsive" width="600" height="400" v-if="x.pic_path" /><br />
                              <button class="btn btn-sm btn-default" @click.prevent="addFile(x.itemno)"><i class="fas fa-cloud-upload-alt"></i> เลือกไฟล์ (รูปภาพเท่านั้น)</button>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <!-- Detail : Control Button (Ext. Save) -->
              <div class="row" style="margin-top:10px">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <button class="btn btn-sm btn-default" @click.prevent="appendRow()"><i class="fas fa-plus-circle"></i> เพิ่มหัวข้อ</button>
                  <button class="btn btn-sm btn-default" @click.prevent="sortOrder()"><i class="fas fa-refresh"></i> เรียงลำดับ</button>
                  <button class="btn btn-sm bg-olive" @click.prevent="saveData"><i class="fas fa-save"></i> บันทึกข้อมูล</button>
                  <button class="btn btn-sm btn-danger" v-if="editMode && header.approve != 'Y'" @click.prevent=""><i class="fas fa-trash"></i> ลบข้อมูล</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>
    <!-- Center : Input File -->
    <input type="file" ref="myFile" name="myFile" accept="image/*" style="display:none;">
  </div>
</template>
<script>
  let page = {};
  let paging = {};
  let cpn = {
    data() {
      return {
        baseUrl,
        auth: window.auth,
        search: {},
        readList: [],
        displayData: [],
        header: {},
        detail: [],
        faq_type: [],
        faq_type_lvl_1: [],
        faq_type_filter: [],
        itemno: 0,
        page: 0,
        editMode: false,
        pageNumber: 1,
      }
    },
    methods: {
      /* Method : Main Method */
      async loadDocument() {
        let act = `CSM/Manual/FAQ_DocReadList?lvl_1=${this.search.lvl_1 || ''}&lvl_2=${this.search.lvl_2 || ''}&lvl_3=${this.search.lvl_3 || ''}&lvl_4=${this.search.lvl_4 || ''}&text=${this.search.text || ''}`;
        let rsp = await $xt.getServer(act);
        this.readList = rsp.data;

        paging.setTotalItems(rsp.total);
        this.pageChange(this.pageNumber);
      },
      pageChange(pn) {
        pn = pn || 1;
        this.pageNumber = pn;
        paging.setCurrentPage(pn);
        this.$set(this, "displayData", $linq(this.readList).skip(paging.skipItems()).take(paging.getItemsPerPage()).toArray());
        paging.createPagesArray();
      },
      filterSearch(lvl_1, lvl_2 = null, lvl_3 = null, lvl_4 = null) {
        this.search = {
          lvl_1: lvl_1,
          lvl_2: lvl_2,
          lvl_3: lvl_3,
          lvl_4: lvl_4,
          text: '',
        };
        this.loadDocument();
      },
      textSearch() {
        paging.setCurrentPage(1);
        this.loadDocument();
      },
      clearSerach() {
        this.search = {};
        this.loadDocument();
      },
      async readDocument(docno) {
        this.editMode = true;
        this.page = 1;
        let act = `CSM/Manual/FAQ_DocRead?docno=${docno || ''}`;
        let rsp = await $xt.getServer(act);
        this.header = rsp.header;
        this.detail = rsp.detail;
      },
      newDocument() {
        this.editMode = false;
        this.header = {
          lvl_1: null,
          lvl_2: null,
          lvl_3: null,
          lvl_4: null,
        };
        this.detail = [];
        this.page = 1;
      },
      appendRow() {
        let itemno = $linq(this.detail).count() == 0 ? 1 : $linq(this.detail).max(x => x.itemno) + 1;
        this.detail.push({
          itemno: itemno,
          sort_itemno: itemno,
          subject: '',
          pic_path: '',
        });
      },
      spliceRow(idx) {
        this.detail.splice(idx, 1);

        let max = 1;
        $linq(this.detail).foreach(f => { f.sort_itemno = max++; });
      },
      async saveData() {
        try {
          let f = {
            header: this.header,
            detail: this.detail
          };
          let act = `CSM/Manual/FAQ_DocCreate`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          this.loadFAQ();
          this.loadDocument();
          this.page = 0;
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      /* Method : Approve Document */
      async approveConfirm() {
        if (!await $msg.confirm(`กรุณาตรวจสอบข้อมูลก่อน ทำการอนุมัติรายการนี้ โปรดยืนยัน`)) {
          return;
        }
        await this.toApprove();
      },
      async toApprove() {
        try {
          let f = {
            docno: this.header.docno
          };
          let act = `CSM/Manual/FAQ_DocApprove`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $msg.alert(`ทำรายการเสร็จสิ้น`, `อนุมัติรายการ ${this.header.docno} เรียบร้อยแล้ว`, `success`);
          this.loadDocument();
          this.loadFAQ();
          this.readDocument(this.header.docno);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async approveCancel() {
        if (!await $msg.confirm(`คุณต้องการยกเลิกการอนุมัติใช่หรือไม่ โปรดยืนยันการทำรายการ`)) {
          return;
        }
        await this.cancelApprove();
      },
      async cancelApprove() {
        try {
          let f = {
            docno: this.header.docno
          };
          let act = `CSM/Manual/FAQ_DocCancel`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $msg.alert(`ทำรายการเสร็จสิ้น`, `ยกเลิกอนุมัติรายการ ${this.header.docno} เรียบร้อยแล้ว`, `success`);
          this.loadDocument();
          this.loadFAQ();
          this.readDocument(this.header.docno);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      /* Method : Center */
      async loadFAQ() {
        let act = `CSM/Manual/FAQReadList`;
        let rsp = await $xt.getServer(act);
        $linq(rsp.data).foreach(f => {
          if (f.level === 1) f.isExpand = true;
          else f.isExpand = false;
        });

        this.countFAQ(rsp.data);
        this.faq_type = rsp.data;
        this.faq_type_lvl_1 = $linq(rsp.data).where(x => x.level == 1).toArray();

        $linq(this.faq_type).foreach(f => { f.children = []; });
        let arr = [];
        $linq(this.faq_type).foreach(f => {
          if (f.parent_itemno === 0) {
            arr.push(f);
          } else {
            this.generateChildData(f);
          }
        });
        this.$set(this, 'faq_type_filter', arr);
      },
      generateChildData(item) {
        let d = $linq(this.faq_type).where(x => x.itemno == item.parent_itemno).firstOrDefault();
        d.children.push(item);
      },
      countFAQ(arr) {
        $linq(arr).foreach(a => {
          a.count_lvl1 = $linq(this.readList).where(x => x.lvl_1 == a.itemno).count();
          a.count_lvl2 = $linq(this.readList).where(x => x.lvl_2 == a.itemno).count();
          a.count_lvl3 = $linq(this.readList).where(x => x.lvl_3 == a.itemno).count();
          a.count_lvl4 = $linq(this.readList).where(x => x.lvl_4 == a.itemno).count();
        });
      },
      openExpand(children) {
        $linq(children).foreach(f => { f.isExpand = !f.isExpand });
      },
      /* Method : Other Method */
      sortOrder() {
        this.detail = $linq(this.detail).orderBy(x => x.sort_itemno).toArray();
      },
      findLvl(level, main_lvl) {
        return $linq(this.faq_type).where(x => x.level == level && x.parent_itemno == main_lvl).toArray() || [];
      },
      itemChange(i) {
        if (i === 1) {
          this.header.lvl_2 = null;
          this.header.lvl_3 = null;
        } else if (i === 2) {
          this.header.lvl_3 = null;
          this.header.lvl_4 = null;
        } else if (i === 3) {
          this.header.lvl_4 = null;
        }
      },
      /* Method : Upload File */
      addFile(itemno) {
        this.itemno = itemno;
        $(this.$refs.myFile).click();
      },
      async doUpload(file) {
        let f = new FormData();
        f.append("file", file);
        try {
          let r = await $xt.postServerForm('Data/CSM_FileUploadToTemp', f);
          if (!r.success) {
            throw r.error;
          }
          let item = $linq(this.detail).where(x => x.itemno == this.itemno).firstOrDefault();
          item.pic_path = r.id || '';
        }
        catch (ex) {
          $msg.alert('', ex.toString(), 'danger');
        }
      },
      createPath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'สร้างหัวข้อคำถามที่พบบ่อย (FAQ)';
      document.title = page.pageTitle;

      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);

      (async () => {
        await this.loadDocument();
        await this.loadFAQ();
      })();

      this.$nextTick(() => {
        $(this.$refs.myFile).on('change', (e) => {
          this.doUpload(e.target.files[0]);
        })
      });
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

  a {
    color: #003399;
  }

  h6 {
    font-size: 13px;
  }
</style>
