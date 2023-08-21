<template>
  <div>
    <customer-page ref="page">
      <template slot="body">
        <div class="row" style="margin-bottom:10px;">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <div class="info-box" @click.prevent="onItem('Y')" style="cursor:pointer;">
              <span class="info-box-icon bg-green"><i class="fas fa-tasks"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">รายการที่อยู่ในสถานะ Complete</span>
                <span class="info-box-number">{{displayTotal.total_complete}} รายการ จาก {{displayTotal.total_all_items}} รายการ</span>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12">
            <div class="info-box" @click.prevent="onItem('W')" style="cursor:pointer;">
              <span class="info-box-icon bg-aqua"><i class="fas fa-list-ol"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">รายการที่อยู่ในสถานะ Pending</span>
                <span class="info-box-number">{{displayTotal.total_queue}} รายการ จาก {{displayTotal.total_all_items}} รายการ</span>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12">
            <div class="info-box" @click.prevent="onItem()" style="cursor:pointer;">
              <span class="info-box-icon bg-navy"><i class="fas fa-folder-open"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">รายการ CSM ทั้งหมด</span>
                <span class="info-box-number">{{displayTotal.total_all_items}} รายการ</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="box box-solid">
              <div class="box-body">
                <div class="row">
                  <div class="col-md-2 col-sm-2 col-xs-2">
                    <div class="form-group">
                      <label>Sort by</label>
                      <select class="form-control" v-model="retrieveSearch.sort" @change="onSearch()">
                        <option v-for="x in sort" :value="x.value">{{x.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-2 col-sm-2 col-xs-2">
                    <div class="form-group">
                      <label>Module</label>
                      <select class="form-control" v-model="retrieveSearch.module" @change="onSearch()">
                        <option v-for="x in module" :value="x">{{x}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-2 col-sm-2 col-xs-2">
                    <div class="form-group">
                      <label>Search by</label>
                      <select class="form-control" v-model="retrieveSearch.field">
                        <option v-for="x in fields" :value="x.key">{{x.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-2 col-sm-2 col-xs-2">
                    <div class="form-group">
                      <label>Search</label>
                      <div class="input-group">
                        <input type="text" class="form-control" v-model="retrieveSearch.text" @keyup.enter="onSearch()" />
                        <span class="input-group-btn"><button class="btn bg-navy" @click.prevent="onSearch()"><i class="fas fa-search"></i></button></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th class="tf-3-5 text-center">Document No.</th>
                            <th class="tf-3 text-center">Date</th>
                            <th class="tf-2-5 text-center">No.</th>
                            <th class="tf-3 text-center">Module</th>
                            <th>Subject</th>
                            <th class="tf-2-5 text-center">Status</th>
                            <th class="tf-3-5 text-center">Response Date</th>
                            <th class="tf-3 text-center">Due Date</th>
                            <th class="tf-3-5 text-center">Complete Date</th>
                            <th class="tf-2-5 text-center">Overdue</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="pointer" v-for="x,idx in displayData" @click.prevent="openDetail(x)" style="height:40px">
                            <td class="text-bold" align="center"><p :class="statusClass('text-',x.status)" style="border-left-style:solid">{{x.d_job_no}}</p></td>
                            <td align="center">{{x.job_date | date()}}</td>
                            <td class="text-bold" align="center">{{x.itemno}}.</td>
                            <td align="center">{{x.module}}</td>
                            <td style="height:40px">{{x.subject}}</td>
                            <td align="center"><span class="label" :class="statusLabelClass('label-', x.status)" style="font-size:13px;">{{statusName(x.status)}}</span></td>
                            <td class="text-bold text-orange" align="center">{{x.response_date | date()}}</td>
                            <td class="text-bold text-danger" align="center">{{x.due_date | date()}}</td>
                            <td style="height:40px" align="center">{{x.complete_date | date()}}</td>
                            <td class="text-bold text-danger" align="center">{{x.d_overdue}}</td>
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
        </div>
      </template>
    </customer-page>
  </div>
</template>
<script type="text/javascript">
  let page = {};
  let paging = {};
  let cpn = {
    data() {
      return {
        baseUrl,
        baseRoute,
        queryString,
        ui: window.ui,
        auth: window.customer_auth,
        fields: [
          { key: 'job_no', name: 'CRM No.', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'subject', name: 'Subject', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'contract_user', name: 'Contact By', type: 's', search: true, sort: true, sort_default: true, width: 200 },
        ],
        sort: [
          { key: 'status', name: 'All Item', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: '' },
          { key: 'status', name: 'Pending', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'W' },
          { key: 'status', name: 'Complete', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'Y' },
        ],
        statusCode: [
          { id: 'H', name: 'Hold' },
          { id: 'W', name: 'Queue' },
          { id: 'I', name: 'In Progress' },
          { id: 'X', name: 'In Progress' },
          { id: 'U', name: 'In Progress' },
          { id: 'N', name: 'Cancel' },
          { id: 'Y', name: 'Complete' },
        ],
        statusColors: [
          { id: 'H', name: 'll' },
          { id: 'W', name: 'll' },
          { id: 'I', name: 'll' },
          { id: 'X', name: 'll' },
          { id: 'N', name: 'll' },
          { id: 'Y', name: 'll' },
        ],
        retrieveSearch: {},
        displayData: [],
        displayTotal: {},

        status: {},
        module: moduleCodeData
      };
    },
    methods: {
      onSearch() {
        paging.setCurrentPage(1);
        this.loadData();
      },
      openDetail(x) {
        window.open(this.baseUrl + `page/external/v_csm_external_detail/?job_no=${x.job_no}&itemno=${x.itemno}`, "_blank");
      },
      onItem(k) {
        let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {};
        let module_init = $linq(this.module).where(x => x == "All Module").firstOrDefault() || {};

        this.$set(this.retrieveSearch, 'field', field_init.key || '');
        this.$set(this.retrieveSearch, 'sort', k || '');
        this.$set(this.retrieveSearch, 'module', module_init || '');
        paging.setCurrentPage(1);
        this.loadData();

      },
      async loadTotal() {
        let act = `CSM/CustomerData/ExternalTotal`;
        let resp = await $xt.getCustomerServer(act);
        this.displayTotal = resp;
      },
      async loadData() {
        let act = `CSM/CustomerData/ExternalReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;
        for (var key in this.retrieveSearch) {
          act += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;
        }
        let resp = await $xt.getCustomerServer(act);
        let temp = "";
        $linq(resp.data).foreach(x => {
          let b = false;
          b = x.job_no == temp;
          x.d_job_no = !b ? x.job_no : "";
          temp = x.job_no;
          x.d_overdue = x.overdue >= 0 || $xt.isEmpty(x.overdue) ? x.overdue : 0;
        });

        this.displayData = resp.data;

        paging.setTotalItems(resp.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async pageChange(pn) {
        paging.setCurrentPage(pn);
        await this.loadData();
      },
      statusClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : status == 'I' ? prefix + 'info' : status == 'X' ? prefix + 'info' : status == 'N' ? prefix + 'danger' : status == 'H' ? prefix + 'warning' : '';
      },
      statusLabelClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : status == 'I' ? prefix + 'info' : status == 'X' ? prefix + 'info' : status == 'N' ? prefix + 'danger' : status == 'H' ? prefix + 'warning' : prefix + 'default';
      },
      statusName(code) {
        return $linq(this.statusCode).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
      statusColor(code) {
        return $linq(this.statusColors).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'ติดตามสถานะหรือความคืบหน้าของใบงาน';
      document.title = page.pageTitle;

      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);

      let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {};
      let module_init = $linq(this.module).where(x => x == "All Module").firstOrDefault() || {};
      this.$set(this.retrieveSearch, 'field', field_init.key || '');
      this.$set(this.retrieveSearch, 'sort', this.sort[2].value || '');
      this.$set(this.retrieveSearch, 'module', module_init || '');

      this.loadTotal();
      this.loadData();
    }
  };
  export default cpn;
</script>
