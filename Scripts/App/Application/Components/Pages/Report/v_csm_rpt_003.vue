<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <div>
          <table-stick height="500px">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th class="tf-3-5">เลขที่เอกสาร</th>
                  <th class="tf-2 text-center">ลำดับ</th>
                  <th class="tf-3 text-center">วันที่</th>
                  <th class="tf-3 text-center">เวลา (น.)</th>
                  <th class="tf-3-5">ชื่อผู้ติดต่อ</th>
                  <th class="tf-2-5 text-center">โมดูล</th>
                  <th class="tf-5">หัวข้อ</th>
                  <th class="tf-5">รายละเอียด</th>
                  <th class="tf-5">ผลลัพธ์ที่ต้องการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(x, index) in display || []">
                  <th class="text-bold">{{x.job_no}}</th>
                  <td align="center" class="text-center">{{x.itemno}}.</td>
                  <td align="center">{{x.job_date | date()}}</td>
                  <td align="center">{{x.job_date | date('HH:mm')}}</td>
                  <td>{{x.contract_user}}</td>
                  <td align="center">{{x.module}}</td>
                  <td>{{x.detail}}</td>
                  <td>{{x.subject}}</td>
                  <td>{{x.description}}</td>
                </tr>
              </tbody>
            </table>
          </table-stick>
        </div>
      </template>
    </report>
    <vue-project-list ref="project" @send-data="projectSelect($event)"></vue-project-list>
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

  let vue = {
    data() {
      return {
        condTemplate,
        display: [],
        moduleForMango: moduleCodeData,
      }
    },
    components: {
      report
    },
    methods: {
      async setRptData(d, cond) {
        let arr = []
        d.forEach(f => {
          f.data2.forEach(x => {
            arr.push(x)
          })
        })
        this.$set(this, "display", arr);
      },
      openProjectModal() {
        this.$refs.project.openModal();
      },
      projectSelect(e) {
        rpt.setRowData(e.pre_event, e.pre_des)
      },
    },
    mounted() {
      rpt = this.$refs.rpt;
      rpt.setTitle('Requirement Check List');
      rpt.setTemplate(this.condTemplate);

      let defaultCond = [
        { field_name: 'job_date', operatorx: '>=', value: new Date(new Date().getFullYear(), new Date().getMonth(), 1), not_remove: false },
        { field_name: 'job_date', operatorx: '<=', value: new Date(), not_remove: false },
      ];
      rpt.setDefaultCond(defaultCond);

      $linq(this.condTemplate).where(x => x.field_name == 'module').foreach(x => {
        this.$set(x, 'value_arr', $linq(this.moduleForMango).select(x => {
          return {
            value: x,
            name: x
          }
        }).toArray())
      });

      rpt.dataUrl = `CSM/Report/v_csm_rpt_002`;
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
