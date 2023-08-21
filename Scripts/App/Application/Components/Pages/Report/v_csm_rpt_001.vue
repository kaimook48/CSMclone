<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <div>
          <template v-for="x,idx in display">
            <div style="margin-bottom:10px;">
              <h4>รหัสชุดคำถามการประเมิน : {{x.qaform}} | ชื่อชุดคำถามการประเมิน : {{x.qaname}}</h4>
            </div>
            <table-stick height="500px">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th class="tf-3-5">CSM No.</th>
                    <th class="tf-2">Doc. Date</th>
                    <th class="tf-4">Customer</th>
                    <th class="tf-3-5">Tel.</th>
                    <th class="tf-3">Contact by</th>
                    <th class="tf-5">Subject</th>
                    <th class="tf-2">Status</th>
                    <th class="tf-3">Refcode</th>
                    <template v-for="t,idx2 in x.topic">
                      <th class="tf-4">{{t}}</th>
                    </template>
                    <th class="tf-3-5">ผลการประเมิน</th>
                    <th class="tf-5">Remark</th>
                    <th class="tf-5">ข้อเสนอแนะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x1,idx1 in x.job_ans">
                    <td>{{x1.job_no}}</td>
                    <td>{{x1.job_date | date()}}</td>
                    <td>{{x1.customer_name}}</td>
                    <td>{{x1.phone}}</td>
                    <td>{{x1.contract_user}}</td>
                    <td>{{x1.subject}}</td>
                    <td align="center">Y</td>
                    <td>{{x1.refcode}}</td>
                    <template v-for="a,idx3 in x1.score">
                      <td>{{a}}</td>
                    </template>
                    <td>{{(x1.get_score / x1.max_score) * 100 | number(2)}} %</td>
                    <td>{{x1.remark}}</td>
                    <td>{{x1.qa_remark}}</td>
                  </tr>
                </tbody>
              </table>
            </table-stick>
          </template>
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
    field_name: 'job_date_search',
    display_name: 'วันที่เอกสาร',
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
    field_name: 'pre_event',
    display_name: 'โครงการ',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'or', //and or,
    func_name: 'openProjectModal',
  });

  condTemplate.push({
    field_name: 'qaform',
    display_name: 'ชุดคำถาม',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: [], //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and', //and or,
    func_name: null,
  });

  condTemplate.push({
    field_name: 'job_no',
    display_name: 'เลขที่เอกสาร',
    field_type: 'string', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['='],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: false, //true,
    multiple_type: '',
    func_name: null
  });

  let vue = {
    data() {
      return {
        condTemplate,
        display: []
      }
    },
    components: {
      report
    },
    methods: {
      async setRptData(d, cond) {
        this.$set(this, "display", d);
      },
      async setCondForm() {
        let rep = await $xt.getServer(`CSM/Master/QC_ReadList`);
        $linq(this.condTemplate).where(x => x.field_name == 'qaform').foreach(x => {
          this.$set(x, 'value_arr', $linq(rep).select(x => {
            return {
              value: x.code,
              name: x.description
            }
          }).toArray())
        });
      },
      openProjectModal() {
        this.$refs.project.openModal();
      },
      projectSelect(e) {
        rpt.setRowData(e.pre_event, e.pre_des)
      }
    },
    mounted() {
      this.setCondForm();
      rpt = this.$refs.rpt;
      rpt.setTitle('รายงานการประเมินความพึงพอใจของลูกค้า');
      rpt.setTemplate(this.condTemplate);
      let defaultCond = [
        { field_name: 'qaform', operatorx: '=', value: '', not_remove: false },
      ];
      rpt.setDefaultCond(defaultCond);
      rpt.dataUrl = `CSM/Report/v_csm_rpt_001`;
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
