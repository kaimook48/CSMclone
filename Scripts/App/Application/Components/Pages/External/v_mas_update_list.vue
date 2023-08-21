<template>
  <div>
    <report ref="rpt">
      <template slot="display">
        <div>
          <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
              <li v-for="x in tabModuleData" :class="{active:x.id===tabModuleSelected}" v-show="x.show">
                <a href="#" @click.prevent="mainTabModuleSelected(x)">
                  <label class="label label-success" v-if="x.total > 0">{{x.total}}</label> <span v-text="x.text"></span>
                </a>
              </li>
              <li class="pull-right">
                <button class="btn btn-sm btn-default" @click="onExport"><i class="fas fa-file-export"></i> ดาวน์โหลดข้อมูลเป็น Excel</button>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active">
                <div class="table-responsive">
                  <table class="table table-bordered" v-show="filterData.length > 0">
                    <thead>
                      <tr>
                        <th class="tf-2 text-center">No.</th>
                        <th class="tf-3-5 text-center">
                          Revision No.
                          <a href="#" @click.prevent="getSort('Revision')"><i class="fas fa-arrow-up" v-show="sort_rev"></i><i class="fas fa-arrow-down" v-show="!sort_rev"></i></a>
                        </th>
                        <th>Subject</th>
                        <th class="tf-2-5 text-center">Module</th>
                        <th class="tf-2-5 text-center">
                          Date
                          <a href="#" @click.prevent="getSort('Date')"><i class="fas fa-arrow-up" v-show="sort_date"></i><i class="fas fa-arrow-down" v-show="!sort_date"></i></a>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in filterData">
                        <td align="center" class="text-bold">{{idx+1}}.</td>
                        <td align="center">{{x.revision}}</td>
                        <td><a href="#" @click.prevent="showAttachment(x)">{{x.subject}}</a></td>
                        <td align="center" class="text-bold">{{x.module}}</td>
                        <td align="center" class="text-bold">{{x.add_dt | date()}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="col-md-12" v-show="filterData.length < 1">
                    <h5>ไม่พบรายการอัพเดทซอฟต์แวร์</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </report>
    <!-- Modal : Attachment -->
    <modal ref="showFileModal">
      <template slot="header">
        <h4 class="modal-title">{{subject}}</h4>
      </template>
      <template slot="body">
        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th style="width:50px">No.</th>
                    <th style="width:300px">File</th>
                    <th style="width:500px">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(y, idx) in dataAttachment">
                    <td>{{(idx+1)|number(0)}}</td>
                    <td>
                      <p><a :href="filePath(y.filepath)" target="_blank"><img :src="filePath(y.filepath)" class="img-responsive" /></a></p>
                    </td>
                    <td>{{y.description}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
  import report from '../../center/report-customer.vue';
  import XLSX from 'xlsx';

  let rpt = {};

  let condTemplate = [];

  condTemplate.push({
    field_name: 'platform',
    display_name: 'Platform',
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

  condTemplate.push({
    field_name: 'add_dt',
    display_name: 'วันที่',
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
    field_name: 'revision',
    display_name: 'เลขที่ Revision',
    field_type: 'decimal', //int, decimal, boolean
    field_group: 'search',
    operatorx_arr: ['=', '>=', '<='],
    operatorx_default: '=',
    value_arr: null, //empty or null for textbox
    value_default: '',
    multiple: true, //true,
    multiple_type: 'and',
    func_name: null
  });

  let vue = {
    data() {
      return {
        baseUrl,
        condTemplate,
        tabModuleData: [],
        tabModuleSelected: "",
        moduleCodeData: [
          'ALL',
          'BD',
          'OF',
          'PO',
          'IC',
          'AP',
          'AR',
          'FA',
          'GL',
          'PM',
          'SE',
          'RT',
          'MA',
          'MRP',
          'EVAL',
          'RE',
        ],
        updateList: [],
        filterData: [],
        dataAttachment: [],
        total: 0,
        subject: "",
        isLoading: false,
        platformCodeData,
        sort_rev: false,
        sort_date: false,
      }
    },
    components: {
      report
    },
    methods: {
      async setRptData(d, cond) {
        this.$set(this, "updateList", d.data);
        this.$set(this, 'total', d.total);

        this.tabModuleData.forEach((x, idx) => {
          this.$set(x, 'total', 0);
        });

        this.tabModuleData.forEach((x, idx) => {
          if (x.id == 'ALL') {
            this.$set(x, 'total', $linq(this.total).select(x2 => x2.total).sum());
          } else {
            $linq(this.total).where(x2 => x2.module == x.id).foreach(x2 => {
              this.$set(x, 'total', x2.total);
            });
          }
        });

        this.mainTabModuleSelected({ id: 'ALL', name: 'ALL' });
      },
      mainTabModuleSelected(x) {
        this.tabModuleSelected = x.id;
        this.$set(this, 'filterData', x.id == 'ALL' ? this.updateList : $linq(this.updateList).where(w => w.module == x.id).toArray());
      },
      async showAttachment(x) {
        this.$refs.showFileModal.openModal();
        this.subject = x.subject;

        let rsp = await $xt.getCustomerServer(`CSM/CustomerData/ReadPicture?job_no=${x.job_no}&module=${x.module}&revision=${x.revision}`);
        this.$set(this, 'dataAttachment', rsp.data);
      },
      filePath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
      onExport() {
        let arr = [];
        $linq(this.filterData).foreach(x => {
          arr.push({
            'Revision': x.revision,
            'Module': x.module,
            'Document': x.job_no,
            'Itemno': x.itemno,
            'Subject': x.subject,
            'Detail': x.detail
          })
        });
        var dataWS = XLSX.utils.json_to_sheet(arr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dataWS);
        XLSX.writeFile(wb, 'export.xlsx');
      },
      getSort(sort) {
        this.tabModuleSelected = this.tabModuleSelected;

        switch (sort) {
          case "Revision":
            if (!this.sort_rev) {
              this.filterData = $linq(this.filterData).orderByDescending(x => x.revision).toArray();
              this.sort_rev = true;
            }
            else
            {
              this.filterData = $linq(this.filterData).orderBy(x => x.revision).toArray();
              this.sort_rev = false;
            }
            break;
          case "Date":
            if (!this.sort_date) {
              this.filterData = $linq(this.filterData).orderByDescending(x => x.add_dt).toArray();
              this.sort_date = true;
            }
            else
            {
              this.filterData = $linq(this.filterData).orderBy(x => x.add_dt).toArray();
              this.sort_date = false;
            }
            break;
          default:
            this.filterData = $linq(this.filterData).orderByDescending(x => x.add_dt).toArray();
            break;
        }
      },
    },
    beforeMount() {
      this.moduleCodeData.forEach((x, idx) => {
        this.tabModuleData.push({
          id: x, icon: '', text: x, show: true, total: 0
        });
      });
    },
    mounted() {
      rpt = this.$refs.rpt;
      rpt.setTitle('รายการอัพเดทโปรแกรมทั้งหมด');
      rpt.setTemplate(this.condTemplate);
      rpt.showPrint = false;

      this.$refs.showFileModal.setSize("modal-lg");

      $linq(this.condTemplate).where(x => x.field_name == 'platform').foreach(x => {
        this.$set(x, 'value_arr', $linq(this.platformCodeData).where(x => x.id != '111').select(x => {
          return {
            value: x.id,
            name: x.name
          }
        }).toArray())
      });

      let defaultCond = [
        { field_name: 'platform', operatorx: '=', value: 'WIN', not_remove: true },
        { field_name: 'revision', operatorx: '>=', value: '0', not_remove: true },
      ];
      rpt.setDefaultCond(defaultCond);

      rpt.dataUrl = `CSM/CustomerData/InvokeReport?rpt_name=ManualReadListReport`;
      rpt.callData();
      this.mainTabModuleSelected({ id: "ALL" });
    }
  }
  export default vue
</script>
<style scoped>

  thead > tr > th {
    background-color: #eeeeee;
    color: black;
    font-weight: 400 !important;
    vertical-align: middle !important;
  }
</style>
