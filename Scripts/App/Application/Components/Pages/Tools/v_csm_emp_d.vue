<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <div class="row">
              <div class="col-md-12">
                <!-- Tab -->
                <div class="nav-tabs-custom">
                  <ul class="nav nav-tabs">
                    <li v-for="x in tabData" v-bind:class="{'active':x.id==tabSelected}" v-show="x.show">
                      <a href="#" v-on:click.prevent="mainTabSelected(x)">
                        {{x.text}}
                        <span v-if="x.total > 0">({{x.total}})</span>
                        <span v-if="x.badge">({{x.badge}})</span>
                      </a>
                    </li>
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane active">
                      <!-- Search Panel -->
                      <div class="row">
                        <div class="col-lg-4 col-md-3">
                          <div class="form-group">
                            <label>{{ui.search||'Search'}}</label>
                            <div class="input-group">
                              <input type="text" class="form-control input-sm" v-model="retrieveSearch['text']" @keyup.enter="loadData()" />
                              <span class="input-group-btn"><button class="btn btn-sm btn-default" @click="loadData()"><i class="fa fa-search"></i></button></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                          <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs pull-right">
                              <li :class="{active:subTabSelected===1}"><a href="#" @click.prevent="onSubTabChange(1)">{{ui.csm_all_doc||'เอกสารทั้งหมด'}} ({{all_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===2}"><a href="#" @click.prevent="onSubTabChange(2)">Bug Software ({{bug_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===3}"><a href="#" @click.prevent="onSubTabChange(3)">Request ({{req_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===4}"><a href="#" @click.prevent="onSubTabChange(4)">Contract ({{contract_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===5}"><a href="#" @click.prevent="onSubTabChange(5)">Other ({{other_total || 0}})</a></li>
                            </ul>
                          </div>
                          <!-- Table -->
                          <div class="table-responsive">
                            <table class="table table-bordered table-hover table-striped">
                              <thead>
                                <tr>
                                  <th class="tf-2">No.</th>
                                  <th class="tf-3">CRM No.</th>
                                  <th class="tf-2-5">Date</th>
                                  <th class="tf-2">Itemno</th>
                                  <th class="tf-2-5">Module</th>
                                  <th class="tf-5">Subject</th>
                                  <th class="tf-4">Req. By</th>
                                  <th class="tf-4">Project</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(x, idx) in EmpData">
                                  <td align="center" class="text-bold">{{x.item}}.</td>
                                  <td align="center"><a v-bind:href="openRef(x)" target="_blank">{{x.job_no}}</a></td>
                                  <td align="center">{{x.job_date | date()}}</td>
                                  <td align="center" class="text-bold">{{x.itemno | number(0)}}.</td>
                                  <td align="center">{{x.module}}</td>
                                  <td>{{x.subject}}</td>
                                  <td>{{x.request_empno_name}}</td>
                                  <td>{{x.project}}</td>
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
  let paging = {};
  let process = false;
  let cpn = {
    data() {
      return {
        auth,
        baseUrl,
        tab1Active: 0,
        retrieveSearch: {},
        form: {},
        ui: window.ui,
        userid: auth.userid,
        empno: auth.empno,
        empname: '',
        EmpData: [],
        total: 0,
        all_total: {},
        bug_total: {},
        req_total: {},
        contract_total: {},
        other_total: {},
        tabData: [
          { id: 'tab1', icon: '', text: 'Wait', show: true, total: 0 },
          { id: 'tab2', icon: '', text: 'In Progress', show: true, total: 0 },
          { id: 'tab3', icon: '', text: 'Done', show: true, total: 0 },
          { id: 'tab4', icon: '', text: 'Complete', show: true, total: 0 },
        ],
        tabSelected: 'tab1',
        subTabSelected: 0,
        queryString,
      };
    },
    methods: {
      mainTabSelected(x) {
        this.tabSelected = x.id;
        this.subTabSelected = 1;
        this.callData();

        paging.setCurrentPage(1);
      },
      async onSubTabChange(t) {
        this.subTabSelected = t;
        await this.loadData();
      },
      getTabTotal(id, field) {
        $linq(this.tabData).where(x => x.id == id).foreach(x => {
          this.$set(x, 'total', field);
        });
      },
      async retrieveSort() {
        paging.setCurrentPage(1);
        this.loadData();
      },
      async retrieveSearch() {
        paging.setCurrentPage(1);
        await this.loadData();
      },
      async loadTotal() {
        let url = `CSM/Tools/CSMTotal?tabSelected=${this.tabSelected}&empno=${this.empno}&year=${this.queryString.year || ''}`;
        let rsp = await $xt.getServer(url);

        this.getTabTotal('tab1', rsp.total_wait);
        this.getTabTotal('tab2', rsp.total_in_progress);
        this.getTabTotal('tab3', rsp.total_done);
        this.getTabTotal('tab4', rsp.total_complete);
      },
      async loadData() {
        let url = `CSM/Tools/CSMRead?tabSelected=${this.tabSelected}&subTabSelected=${this.subTabSelected}&empno=${this.empno}&search_text=${encodeURIComponent(this.retrieveSearch.text || '')}&year=${this.queryString.year || ''}&skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;

        page.loadingBox.show();
        let rsp = await $xt.getServer(url);
        this.empname = rsp.empname;
        this.EmpData = rsp.data;
        this.all_total = rsp.all_total;
        this.bug_total = rsp.bug_total;
        this.req_total = rsp.req_total;
        this.contract_total = rsp.contract_total;
        this.other_total = rsp.other_total;

        paging.setTotalItems(rsp.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }

        if (paging.skipItems() == 0) {
          let i = 0;
          $linq(this.EmpData).foreach(f => {
            this.$set(f, 'item', ++i);
          });
        } else {
          let i = paging.skipItems();
          $linq(this.EmpData).foreach(f => {
            this.$set(f, 'item', ++i);
          });
        }

        paging.createPagesArray();
        page.loadingBox.hide();

        this.$refs.page.pageTitle = `Employee IT : ${rsp.empname}`;
        document.title = `Employee IT : ${rsp.empname}`;
      },
      async pageChange(pn) {
        paging.setCurrentPage(pn);
        await this.loadData();
      },
      callData() {
        this.loadTotal();
        this.loadData();
      },
      retrieveSetPage(x) {
        this.page.setCurrentPage(x);
        this.callData();
      },
      openRef(x) {
        return this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${x.job_no}&ref_itemno=${x.itemno}`
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = `Employee IT : `;
      document.title = page.pageTitle;

      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);

      this.$set(this, 'subTabSelected', 1);

      if (!$xt.isEmpty(this.queryString.empno)) {
        this.$set(this, 'empno', this.queryString.empno);
        this.mainTabSelected({ 'id': 'tab1' });
      } else {
        this.loadData(this.empno);
      }
    }
  };

  export default cpn;
</script>
<style scoped>

  thead tr th {
    text-align: center;
  }
</style>
