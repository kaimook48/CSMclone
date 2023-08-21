<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <div>
          <template v-for="x,idx in display || []">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="form-group">
                  <h5 class="text-navy">{{xt.isEmpty(x.customer_name) ? 'สำนักงานใหญ่' : x.customer_name}}</h5>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <table-stick :height="height">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-2 text-center">No.</th>
                        <th class="tf-3-5 text-center">Document No.</th>
                        <th class="tf-3 text-center">Job Date</th>
                        <th class="tf-3 text-center">Due Date</th>
                        <th class="tf-3 text-center">Type</th>
                        <th class="tf-4">Subject</th>
                        <th class="tf-3-5">Request by</th>
                        <th class="tf-3">Req. Date</th>
                        <th class="tf-3-5">Assign by</th>
                        <th class="tf-3">Send QC Date</th>
                        <th class="tf-3-5">Tester by</th>
                        <th class="tf-3 text-center">Tester Date</th>
                        <th class="tf-3 text-center">Status</th>
                        <th class="tf-3 text-center">Approve</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="i,idx2 in x.detail">
                        <td align="center">{{idx2+1}}.</td>
                        <td align="center"><a :href="openReq(i.job_no)" target="_blank">{{i.job_no}}</a></td>
                        <td align="center">{{i.job_date | date()}}</td>
                        <td align="center">{{i.due_date | date()}}</td>
                        <td align="center">{{itemTypeName(i.item_type)}}</td>
                        <td>{{i.subject}}</td>
                        <td>{{i.request_name}}</td>
                        <td>{{i.response_date | date()}}</td>
                        <td>{{i.assign_name}}</td>
                        <td>{{i.send_pretest_dt | date()}}</td>
                        <td>{{i.tester_name}}</td>
                        <td align="center">{{i.tester_test_dt | date()}}</td>
                        <td align="center" :class="statusClass('text-', i.status)"><b>{{statusName(i.status)}}</b></td>
                        <td align="center"><a href="#" :class="approveClass('text-', i.approve_status)" @click.prevent="showApproveLoop(i)">{{approveName(i.approve_status)}}</a></td>
                      </tr>
                    </tbody>
                  </table>
                </table-stick>
              </div>
            </div>
          </template>
        </div>
      </template>
    </report>
    <modal ref="approveLoop">
      <template slot="header">
        <h4>ข้อมูลผู้อนุมัติ</h4>
      </template>
      <template slot="body">
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th class="text-center">No.</th>
                <th>Emp No.</th>
                <th>Emp Name</th>
                <th>Position</th>
                <th>Level App</th>
                <th>Approve Status</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(x, idx) in approve">
                <td align="center">{{idx+1}}.</td>
                <td>{{x.empno}}</td>
                <td>{{x.empname}}</td>
                <td>{{x.fr_proj_type}}</td>
                <td>{{x.levelapp}}</td>
                <td>
                  <label v-bind:class="{'label label-success': x.status == 'Y', 'label label-danger': x.status == 'C', 'label label-primary': x.status == 'N'}" style="font-size:12px">{{x.status == 'Y' ? 'อนุมัติเรียบร้อย' : x.status == 'C' ? 'ไม่อนุมัติ' : x.status == 'N' ? 'รอการอนุมัติ' : ''}}</label>
                </td>
                <td>{{x.remark_cancel}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </modal>
    <vue-project2-list ref="project" @send-data="projectSelect($event)"></vue-project2-list>
    <vue-ar-customer-list ref="customer" @send-data="customerSelect($event)"></vue-ar-customer-list>
  </div>
</template>
<script>
  import report from '../../center/report-condition.vue'

  let rpt = {};

  let condTemplate = [];

  condTemplate.push({
    field_name: 'pre_event',
    display_name: 'Project',
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

  condTemplate.push({
    field_name: 'job_date',
    display_name: 'Req. Date',
    field_type: 'date', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', '>=', '<='],
    operatorx_default: '>=',
    value_arr: null, //empty or null for textbox
    value_default: moment().format('DD/MM/YYYY'),
    multiple: true, //true,
    multiple_type: 'and', //and or,
    func_name: '',
  });

  condTemplate.push({
    field_name: 'customer_code',
    display_name: 'Customer',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'or', //and or,
    func_name: 'openCustomerModal',
  });
  let vue = {
    data() {
      return {
        baseUrl,
        condTemplate,
        xt: $xt,
        display: [],
        approve: [],
        height: 0,
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
      openCustomerModal() {
        this.$refs.customer.openModal();
      },
      customerSelect(e) {
        rpt.setRowData(e.customer_code, e.customer_name)
      },
      itemTypeName(code) {
        return $linq(this.serviceCodeData).where(x => x.serv_code == code).select(x => x.serv_name).firstOrDefault() || '';
      },
      statusName(code) {
        return $linq(this.statusCodeData).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
      statusClass(prefix, status) {
        return status == 'N' ? prefix + 'danger' : ['Y', 'S'].includes(status) ? prefix + 'success' : ['R', 'H'].includes(status) ? prefix + 'warning' : prefix + 'info';
      },
      approveName(code) {
        return code == 'Y' ? 'อนุมัติแล้ว' : 'ยังไม่อนุมัติ';
      },
      approveClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : prefix + 'danger';
      },
      openReq(job_no) {
        return this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${job_no || ''}`
      },
      async showApproveLoop(i) {
        let act = `CSM/Report/ApproveLoop?job_no=${i.job_no || ''}&itemno=${i.itemno || ''}`;
        let rsp = await $xt.getServer(act);
        this.approve = rsp;
        this.$refs.approveLoop.openModal();
      },
    },
    mounted() {
      (async () => {


        rpt = this.$refs.rpt;
        rpt.setTitle('รายงานติดตามสถานะงานตามโครงการ');
        rpt.setTemplate(this.condTemplate);

        this.$refs.approveLoop.setSize("modal-lg");

        let defaultCond = [
        ];
        rpt.setDefaultCond(defaultCond);

        this.height = $(window).height() - 360;

        rpt.dataUrl = `CSM/Report/v_csm_rpt_005`;
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
