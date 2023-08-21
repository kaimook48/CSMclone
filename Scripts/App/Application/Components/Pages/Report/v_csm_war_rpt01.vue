<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <table-stick-2 :cellpad="14" :scale="300">
          <table class="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th class="tf-3-5">Customer</th>
                <th class="tf-2-5">Item No.</th>
                <th class="tf-4-5">Project</th>
                <th class="tf-3-5">Area</th>
                <th class="tf-4-5">รายการประกัน</th>
                <th class="tf-3-5">Serial No.</th>
                <th class="tf-3-5">Start Date</th>
                <th class="tf-3-5">End Date</th>
                <th class="tf-3">Warranty Balance</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="x in display">
                <tr class="text-navy" style="background-color:#e8e8e8;">
                  <td colspan="9"><h6>{{x.customer_name}}</h6></td>
                </tr>
                <template v-for="y in x.project">
                  <tr v-for="(z, index) in y.detail">
                    <td align="center" class="text-bold">{{z.cust_item}}</td>
                    <td align="center" class="text-bold">{{z.itemno}}</td>
                    <td>{{z.pre_des}}</td>
                    <td>{{z.loccode}}</td>
                    <td>{{z.war_des}}</td>
                    <td>{{z.serial_number}}</td>
                    <td align="center">{{z.startdate | date('DD/MM/YYYY')}}</td>
                    <td align="center">{{z.enddate | date('DD/MM/YYYY')}}</td>
                    <td align="center">{{z.balday_war}}</td>
                  </tr>
                </template>
                
              </template>
            </tbody>
          </table>
        </table-stick-2>
      </template>
    </report>
    <vue-project-list ref="project" @send-data="projectSelect($event)"></vue-project-list>
    <vue-project2-list ref="ct_project2" @send-data="projectSelect($event)"></vue-project2-list>
    <vue-ar-customer-list ref="customer" @send-data="customerSelect($event)"></vue-ar-customer-list>
  </div>
</template>
<script>
  import report from '../../center/report-condition.vue'

  let rpt = {};
  let condTemplate = [];

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
    field_name: 'war_des',
    display_name: 'รายการประกัน',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'or', //and or,
    func_name: '',
  });

  condTemplate.push({
    field_name: 'serial_number',
    display_name: 'Serial No.',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', '>=', '<='],
    operatorx_default: '>=',
    value_arr: null, //empty or null for textbox
    value_default: 0,
    multiple: true, //true,
    multiple_type: 'and',
    func_name: ''
  });

  condTemplate.push({
    field_name: 'startdate',
    display_name: 'Start Date',
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
    field_name: 'enddate',
    display_name: 'End Date',
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

  let vue = {
    data() {
      return {
        baseUrl,
        condTemplate,
        display: [],
        height: 0
      }
    },
    components: {
      report
    },
    methods: {
      async setRptData(d, cond) {
        this.$set(this, "display", d);
      },
      action1() {
        rpt.setRowData(value, displayValue)
      },
      openProjectModal() {
        this.$refs.ct_project2.openModal();
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
    },
    mounted() {
      rpt = this.$refs.rpt
      rpt.setTitle('Warranty')
      rpt.setTemplate(this.condTemplate)

      let defaultCond = [
        { field_name: 'customer_code', operatorx: '=', value: '', not_remove: false },
      ];
      rpt.setDefaultCond(defaultCond);

      rpt.dataUrl = `CSM/Report/v_csm_war_rpt01`;
    }
  }
  export default vue
</script>
