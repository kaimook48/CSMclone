<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <table-stick :height="height">
          <table class="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th class="tf-2">No.</th>
                <th class="tf-3-5">CSM No.</th>
                <th class="tf-3-5">Revision</th>
                <th class="tf-3-5" v-if="!is_revision_bug()">Revision Bug</th>
                <th class="tf-2-5">Item No.</th>
                <th class="tf-3-5">
                  Req. Date <a class="text-white" href="#" @click.prevent="getSort('reqDate')"><i class="fas fa-arrow-up" v-show="!sort_date"></i><i class="fas fa-arrow-down" v-show="sort_date"></i></a>
                </th>
                <th class="tf-3-5">Due Date</th>
                <th class="tf-4-5">Company</th>
                <th class="tf-3" v-text="isMango() ? 'Module' : 'Area'"></th>
                <th class="tf-5-5">Subject</th>
                <th class="tf-3-5">Type</th>
                <th class="tf-3-5">Priority</th>
                <th class="tf-3-5">Req. Type</th>
                <th class="tf-3-5">Job Type</th>
                <th class="tf-4">Tester</th>
                <th class="tf-4">Assign. By</th>
                <th class="tf-4">Req. By</th>
                <th class="tf-3">Status</th>
                <th class="tf-3-5" v-if="!is_reject()">Reject Remark</th>
                <th class="tf-3-5">Send Pretest Date</th>
                <th class="tf-3-5">Send To QC Date</th>
                <th class="tf-3-5">Complete Date</th>
                <th class="tf-3-5">Work Duration</th>
                <th class="tf-4">Contact User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(z, index) in display || []">
                <td align="center" class="text-bold">{{index+1}}.</td>
                <td align="center"><a v-bind:href="openReq(z)" target="_blank">{{z.job_no}}</a></td>
                <td align="center">{{z.revision_}}</td>
                <td align="center" v-if="!is_revision_bug()">{{z.revision_bug}}</td>
                <td align="center" class="text-bold">{{z.itemno}}.</td>
                <td align="center">{{z.job_date | date('DD/MM/YYYY HH:mm')}}</td>
                <td align="center">{{z.due_date | date('DD/MM/YYYY HH:mm')}}</td>
                <td>{{z.customer_name}}</td>
                <td align="center">{{isMango() ? z.module : areaName(z.module)}}</td>
                <td>{{z.subject}}</td>
                <td class="small">{{itemTypeName(z.item_type)}}</td>
                <td align="center">{{jobName(z.job_priority)}}</td>
                <td align="center" class="small">{{reqTypeName(z.req_type)}}</td>
                <td align="center">{{JobTypeName(z.object_type)}}</td>
                <td>{{z.tester_name}}</td>
                <td>{{z.assign_name}}</td>
                <td>{{z.request_name}}</td>
                <td align="center" :class="statusClass('text-', z.status)">{{statusName(z.status)}}</td>
                <td v-if="!is_reject()">{{z.reject_remark}}</td>
                <td align="center">{{z.send_pretest_dt | date('DD/MM/YYYY HH:mm')}}</td>
                <td align="center">{{z.send_pretest_to_tester_dt | date('DD/MM/YYYY HH:mm')}}</td>
                <td align="center">{{z.complete_date | date('DD/MM/YYYY HH:mm')}}</td>
                <td align="center"><span>{{z.overdueM}}{{z.overdueD}}{{z.overdueH}}</span></td>
                <td>{{z.contract_user}}</td>
              </tr>
            </tbody>
          </table>
        </table-stick>
      </template>
    </report>
    <vue-project-list ref="project" @send-data="projectSelect($event)"></vue-project-list>
    <vue-employee-list ref="employee" @send-data="employeeSelect($event)"></vue-employee-list>
    <vue-ar-customer-list ref="customer" @send-data="customerSelect($event)"></vue-ar-customer-list>
  </div>
</template>
<script>
  import report from '../../center/report-condition.vue'

  let rpt = {};

  let condTemplate = [];
  let item_type = [];

  condTemplate.push({
    field_name: 'module',
    display_name: 'Module',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: module, //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'req_type',
    display_name: 'Req. Type',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: false, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'status',
    display_name: 'Job Status',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'or',
    func_name: null
  });

  condTemplate.push({
    field_name: 'platform',
    display_name: 'Platform',
    field_type: 'string', //int, decimal, booleano
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: 'WIN',
    multiple: true, //true,
    multiple_type: 'and', //and or,
    func_name: '',
  });

  condTemplate.push({
    field_name: 'revision_',
    display_name: 'เลขที่ Revision',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', '>=', '<='],
    operatorx_default: '>=',
    value_arr: null, //empty or null for textbox
    value_default: '0',
    multiple: true, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'revision_bug_',
    display_name: 'Revision ที่พบปัญหา',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', '>=', '<='],
    operatorx_default: '>=',
    value_arr: null, //empty or null for textbox
    value_default: '0',
    multiple: true, //true,
    multiple_type: 'and',
    func_name: null
  });

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

  condTemplate.push({
    field_name: 'job_date_search',
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
    field_name: 'due_date',
    display_name: 'Due Date',
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
    field_name: 'item_type',
    display_name: 'Service Type',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', '!='],
    operatorx_default: '=',
    value_arr: item_type, //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'subject',
    display_name: 'Subject',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', 'Like'],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'request_empno',
    display_name: 'Req.By',
    field_type: 'int', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'or', //and or,
    func_name: 'openEmployeeModal'
  });

  condTemplate.push({
    field_name: 'assign_empno',
    display_name: 'Assignment',
    field_type: 'int', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'or', //and or,
    func_name: 'openEmployeeModal'
  });

  condTemplate.push({
    field_name: 'contract_user',
    display_name: 'Contact User',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: false, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'connection_type',
    display_name: 'Connection',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: false, //true,
    multiple_type: 'and',
    func_name: null
  });

  condTemplate.push({
    field_name: 'send_pretest_dt',
    display_name: 'Send Pretest Date',
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
    field_name: 'send_pretest_to_tester_dt',
    display_name: 'Send To QC Date',
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
    field_name: 'object_type',
    display_name: 'Job Type',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and', //and or,
    func_name: '',
  });

  let vue = {
    data() {
      return {
        baseUrl,
        condTemplate,
        display: [],
        height: 0,
        moduleCodeData: "",
        moduleForMango: moduleCodeData,
        platformCodeData,
        statusCodeData,
        sort_date: false,
        job_type: [
          { id: "T", name: "Transaction" },
          { id: "M", name: "Master" },
          { id: "R", name: "Report" },
          { id: "F", name: "Form" },
          { id: "O", name: "Other" },
        ]
      }
    },
    components: {
      report
    },
    methods: {
      async setRptData(d, cond) {
        this.$set(this, "display", d);
        $linq(this.display).foreach(x => {
          let overdue = this.diffDaysHours(moment(x.complete_date, 'Y/M/D hh:mm:ss'), moment(x.job_date, 'Y/M/D hh:mm:ss'), ['months', 'days', 'hours']);

          this.$set(x, 'overdueM', overdue.months <= 0 || $xt.isEmpty(overdue.months) || isNaN(overdue.months) ? '' : overdue.months + ' เดือน ');
          this.$set(x, 'overdueD', overdue.days <= 0 || $xt.isEmpty(overdue.days) || isNaN(overdue.days) ? '' : overdue.days + ' วัน ');
          this.$set(x, 'overdueH', overdue.hours <= 0 || $xt.isEmpty(overdue.hours) || isNaN(overdue.hours) ? '' : overdue.hours + ' ชั่วโมง ');
        });
      },
      diffDaysHours(mm_object1, mm_object2, periods) {
        let less, more, diff, obj = {};
        if (mm_object1.isSameOrBefore(mm_object2)) {
          less = mm_object2;
          more = mm_object2;
        }
        else {
          less = mm_object2;
          more = mm_object1;
        }
        $linq(periods).foreach(x => {
          diff = Math.abs(less.diff(more, x));
          less = moment(less).add(diff, x);
          obj[x] = diff;
        });
        return obj
      },
      action1() {
        rpt.setRowData(value, displayValue)
      },
      openProjectModal() {
        this.$refs.project.openModal();
      },
      openEmployeeModal() {
        this.$refs.employee.openModal();
      },
      openCustomerModal() {
        this.$refs.customer.openModal();
      },
      employeeSelect(e) {
        rpt.setRowData(e.empno, e.empfullname_t)
      },
      projectSelect(e) {
        rpt.setRowData(e.pre_event, e.pre_des)
      },
      customerSelect(e) {
        rpt.setRowData(e.customer_code, e.customer_name)
      },
      itemTypeName(code) {
        return $linq(this.serviceCodeData).where(x => x.serv_code == code).select(x => x.serv_name).firstOrDefault() || '';
      },
      jobName(code) {
        return $linq(this.priorityCodeData).where(x => x.prioity_code == code).select(x => x.prioity_des).firstOrDefault() || '';
      },
      reqTypeName(code) {
        return $linq(this.requestCodeData).where(x => x.req_code == code).select(x => x.req_des).firstOrDefault() || '';
      },
      JobTypeName(code) {
        return $linq(this.job_type).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
      statusName(code) {
        return $linq(this.statusCodeData).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
      areaName(code) {
        return $linq(this.moduleCodeData).where(x => x.loccode == code).select(x => x.locname).firstOrDefault() || '';
      },
      statusClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : status == 'I' ? prefix + 'info' : status == 'N' ? prefix + 'danger' : status == 'H' ? prefix + 'warning' : '';
      },
      isMango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        return isMango == "Y" ? true : false;
      },
      getSort(sort) {
        switch (sort) {
          case "reqDate":
            if (!this.sort_date) {
              this.display = $linq(this.display).orderBy(x => x.job_date).toArray();
              this.sort_date = true;
            }
            else {
              this.display = $linq(this.display).orderByDescending(x => x.job_date).toArray();
              this.sort_date = false;
            }
            break;
          default:
            this.display = $linq(this.display).orderByDescending(x => x.job_date).toArray();
            break;
        }
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
      is_reject() {
        return $linq(this.display).any(x => $xt.isEmpty(x.reject_remark));
      },
      is_revision_bug() {
        return $linq(this.display).any(x => $xt.isEmpty(x.revision_bug));
      }
    },
    computed: {
      connectionCodeData() { return store.state.connectionCodeData },
      requestCodeData() { return store.state.requestCodeData },
      priorityCodeData() { return store.state.priorityCodeData },
      serviceCodeData() { return store.state.serviceCodeData },
      configData() { return store.state.configData },
    },
    mounted() {
      (async () => {
        rpt = this.$refs.rpt
        rpt.setTitle('รายงานการติดตามสถานะงาน')
        rpt.setTemplate(this.condTemplate)

        await $xt.sleep(500)
        $linq(this.condTemplate).where(x => x.field_name == 'module').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.moduleForMango).select(x => {
            return {
              value: x,
              name: x
            }
          }).toArray())
        });

        $linq(this.condTemplate).where(x => x.field_name == 'req_type').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.requestCodeData).select(x => {
            return {
              value: x.req_code,
              name: x.req_des
            }
          }).toArray())
        });

        $linq(this.condTemplate).where(x => x.field_name == 'item_type').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.serviceCodeData).select(x => {
            return {
              value: x.serv_code,
              name: x.serv_name
            }
          }).toArray())
        });

        $linq(this.condTemplate).where(x => x.field_name == 'connection_type').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.connectionCodeData).select(x => {
            return {
              value: x.contact_code,
              name: x.contact_name
            }
          }).toArray())
        });

        $linq(this.condTemplate).where(x => x.field_name == 'status').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.statusCodeData).select(x => {
            return {
              value: x.id,
              name: x.name
            }
          }).toArray())
        });

        $linq(this.condTemplate).where(x => x.field_name == 'platform').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.platformCodeData).where(x => x.id != '111').select(x => {
            return {
              value: x.id,
              name: x.name
            }
          }).toArray())
        });

        $linq(this.condTemplate).where(x => x.field_name == 'object_type').foreach(x => {
          this.$set(x, 'value_arr', $linq(this.job_type).select(x => {
            return {
              value: x.id,
              name: x.name
            }
          }).toArray())
        });

        let defaultCond = [
          { field_name: 'item_type', operatorx: '=', value: '', not_remove: false },
          { field_name: 'revision_bug_', operatorx: '=', value: '', not_remove: false },
        ];
        rpt.setDefaultCond(defaultCond);

        rpt.dataUrl = `CSM/Report/v_csm_rpt_006`;

        this.height = $(window).height() - 360;
      })()
    }
  }
  export default vue
</script>
