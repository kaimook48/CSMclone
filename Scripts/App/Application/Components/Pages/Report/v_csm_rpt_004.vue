<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="tf-2-5 text-center">Code</th>
                  <th class="tf-3-5">Customer</th>
                  <th class="tf-3 text-center">Bug Software</th>
                  <th class="tf-3 text-center">Request</th>
                  <th class="tf-3 text-center">Contract</th>
                  <th class="tf-3 text-center">Other</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x,idx in display">
                  <td align="center"><b>{{x.customer_code}}</b></td>
                  <td>{{x.customer_name}}</td>
                  <td align="center"><a href="#" @click.prevent="openList(x, 'bug')">{{x.bug_total || 0}} รายการ</a></td>
                  <td align="center"><a href="#" @click.prevent="openList(x, 'request')">{{x.request_total || 0}} รายการ</a></td>
                  <td align="center"><a href="#" @click.prevent="openList(x, 'contract')">{{x.contract_total || 0}} รายการ</a></td>
                  <td align="center"><a href="#" @click.prevent="openList(x, 'other')">{{x.other_total || 0}} รายการ</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </report>
    <modal ref="listModal">
      <template slot="header">
        <h4>รายการเอกสารคงค้างทั้งหมด</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="tf-2-5 text-center">Ref. Code</th>
                    <th class="tf-4">Project</th>
                    <th class="tf-3 text-center">Document No.</th>
                    <th class="tf-2 text-center">No.</th>
                    <th class="tf-5">Description</th>
                    <th class="tf-3 text-center">Type</th>
                    <th class="tf-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x,idx in filterType()">
                    <td align="center"><b>{{x.refcode}}</b></td>
                    <td>{{x.pre_des}}</td>
                    <td align="center"><a :href="openReq(x)" target="_blank">{{x.job_no}}</a></td>
                    <td align="center">{{x.itemno}}.</td>
                    <td>{{x.detail}}</td>
                    <td align="center">{{itemTypeName(x.item_type)}}</td>
                    <td align="center">{{statusName(x.status)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </modal>
    <vue-project2-list ref="project" @send-data="projectSelect($event)"></vue-project2-list>
  </div>
</template>
<script>
  import report from '../../center/report-condition.vue'

  let rpt = {};

  let condTemplate = [];

  condTemplate.push({
    field_name: 'pre_event',
    display_name: 'โครงการ',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and', //and or,
    func_name: 'openProjectModal',
  });

  let vue = {
    data() {
      return {
        baseUrl,
        condTemplate,
        display: [],
        filterReport: [],
        typeSelect: "",
        statusCodeData,
      }
    },
    components: {
      report
    },
    methods: {
      async setRptData(d, cond) {
        this.$set(this, "display", d);
      },
      openProjectModal() {
        this.$refs.project.openModal();
      },
      projectSelect(e) {
        rpt.setRowData(e.pre_event, e.pre_des)
      },
      async openList(x, type) {
        this.$refs.listModal.openModal();
        this.filterReport = [];
        this.typeSelect = type;
        await this.loadList(x);
      },
      async loadList(x) {
        let act = `CSM/Report/ReportByType?customer_code=${x.customer_code || ''}`;
        let rsp = await $xt.getServer(act);
        this.filterReport = rsp.data;
      },
      filterType() {
        return $linq(this.filterReport).where(x => this.typeSelect == 'bug' ? ['03'].includes(x.item_type) : this.typeSelect == 'request' ? ["01", "02", "04", "05", "06", "07"].includes(x.item_type) : this.typeSelect == 'contract' ? (x.contract_type || "N") == "Y" : this.typeSelect == 'other' ? ["08", "09", "10", "11"].includes(x.item_type) : true).toArray();
      },
      openReq(x) {
        x = x || "";
        if ($xt.isEmpty(x)) {
          return this.baseUrl + `page/Transaction/v_csm_trn_001/`;
        }
        else {
          return this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${x.job_no}`
        }
      },
      itemTypeName(code) {
        return $linq(this.serviceCodeData).where(x => x.serv_code == code).select(x => x.serv_name).firstOrDefault() || '';
      },
      statusName(code) {
        return $linq(this.statusCodeData).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
    },
    mounted() {
      (async () => {
        rpt = this.$refs.rpt;
        rpt.setTitle('รายงานสรุปใบงาน CSM คงค้าง');
        rpt.setTemplate(this.condTemplate);

        await $xt.sleep(500);
        this.$refs.listModal.setSize('modal-xl');

        let defaultCond = [

        ];
        rpt.setDefaultCond(defaultCond);

        rpt.dataUrl = `CSM/Report/v_csm_rpt_004`;
      })()
    }
  }
  export default vue
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
</style>
