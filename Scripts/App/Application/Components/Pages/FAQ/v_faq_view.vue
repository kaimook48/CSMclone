<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-9">
            <div class="box box-solid">
              <div class="box-header">
                <h4 class="box-title">คำถามที่พบบ่อย</h4>
              </div>
              <div class="box-body">
                <div class="row">
                  <div class="col-lg-2 col-md-2 col-sm-2">
                    <div class="form-group">
                      <label>ค้นหาโดย</label>
                      <select class="form-control" v-model="search.field">
                        <option value="subject">หัวข้อ</option>
                        <option value="docno">เลขที่อ้างอิง</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-4">
                    <div class="form-group">
                      <label>ค้นหา</label>
                      <div class="input-group">
                        <input type="text" class="form-control" v-model="search.text" @keyup.enter="textSearch" placeholder="ใส่คำค้นหาที่นี้" />
                        <span class="input-group-btn"><button class="btn bg-navy" @click.prevent="textSearch"><i class="fas fa-search"></i></button></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th>{{xt.isEmpty(label) ? 'รายการทั้งหมด' : label}}</th>
                            <th class="tf-3-5 text-center">เลขที่อ้างอิง</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x in displayData">
                            <td><a :href="openDetail(x)" target="_blank">{{x.subject}}</a></td>
                            <td align="center" class="text-bold">{{x.docno}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
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
                          <td><h6><i class="fas fa-angle-double-right"></i> <a href="#" @click.prevent="clearSerach();label=null">รายการทั้งหมด</a></h6></td>
                        </tr>
                        <template v-for="x in faq_type_filter">
                          <tr>
                            <td><h6><i class="fas" v-bind:class="{'fa-angle-double-right pointer': x.children.length > 0, 'fa-circle': x.children.length == 0}" @click.prevent="openExpand(x.children)"></i> <a href="#" @click.prevent="filterSearch(x.itemno);label=x.desc_type">{{x['desc_type']}} ({{x.count_lvl1}} รายการ)</a></h6></td>
                          </tr>
                          <template v-for="y in x.children" v-if="x.children.length > 0 && y.isExpand">
                            <tr>
                              <td><h6 style="padding-left:25px"><i class="fas" v-bind:class="{'fa-angle-double-right pointer': y.children.length > 0, 'fa-circle': y.children.length == 0}" @click.prevent="openExpand(y.children)"></i> <a href="#" @click.prevent="filterSearch(x.itemno, y.itemno);label=y.desc_type">{{y['desc_type']}} ({{y.count_lvl2}} รายการ)</a></h6></td>
                            </tr>
                            <template v-for="z in y.children" v-if="y.children.length > 0 && z.isExpand">
                              <tr>
                                <td><h6 style="padding-left:45px"><i class="fas" v-bind:class="{'fa-angle-double-right pointer': z.children.length > 0, 'fa-circle': z.children.length == 0}" @click.prevent="openExpand(z.children)"></i> <a href="#" @click.prevent="filterSearch(x.itemno, y.itemno, z.itemno);label=z.desc_type">{{z['desc_type']}} ({{z.count_lvl3}} รายการ)</a></h6></td>
                              </tr>
                              <tr v-for="x1 in z.children" v-if="z.children.length > 0 && x1.isExpand">
                                <td><h6 style="padding-left:65px"><i class="fas fa-circle"></i> <a href="#" @click.prevent="filterSearch(x.itemno, y.itemno, z.itemno, x1.itemno);label=x1.desc_type">{{x1['desc_type']}} ({{x1.count_lvl4}} รายการ)</a></h6></td>
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
      </template>
    </re-page>
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
        xt: $xt,
        search: {
          field: 'subject'
        },
        faq_type: [],
        faq_type_filter: [],
        label: null,
        readList: [],
        displayData: [],
        pageNumber: 1,
      }
    },
    methods: {
      /* Method : Load Retrieve */
      async loadDocument() {
        let act = `CSM/Manual/FAQ_ViewReadList?lvl_1=${this.search.lvl_1 || ''}&lvl_2=${this.search.lvl_2 || ''}&lvl_3=${this.search.lvl_3 || ''}&lvl_4=${this.search.lvl_4 || ''}&text=${this.search.text || ''}&field=${this.search.field || 'subject'}`;
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
        this.search = {
          'field': 'subject'
        };
        this.loadDocument();
      },
      /* Method : Open Detail */
      openDetail(x) {
        return this.baseUrl + `page/article_detail/?docno=${x.docno}`
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
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'คำถามที่พบบ่อย (FAQ)';
      document.title = page.pageTitle;

      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);

      (async () => {
        await this.loadDocument();
        await this.loadFAQ();
      })();
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
