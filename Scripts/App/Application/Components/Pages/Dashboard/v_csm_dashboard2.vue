<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <section class="content-header">
          <h1>
            CSM Company Dashboard
            <small>Version 1.0</small>
          </h1>
          <ol class="breadcrumb">
            <li><a href="#"><i class="fas fa-home"></i> Home</a></li>
            <li class="active">Dashboard</li>
          </ol>
        </section>
        <section class="content">
          <!-- Chart Display -->
          <div class="box box-solid">
            <div class="box-body">
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label>เดือน</label>
                    <select class="form-control input-sm" v-model.number="cond.month">
                      <option v-for="x, idx in month_th" :value="idx+1">{{x}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label>ปี</label>
                    <div class="input-group">
                      <input type="text" class="form-control input-sm" v-model.number="cond.year" @keyup.enter="loadAll()" />
                      <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="loadAll()"><i class="fa fa-search"></i></button></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <hr style="border-top: 1px solid silver;" />
                  <canvas ref="stacked_barChart" style="width:100% !important;height:500px !important"></canvas>
                  <br />
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="table-responsive">
                    <table class="table table-bordered table-striped table-hover">
                      <thead>
                        <tr>
                          <th colspan="8">สรุปรายงานรับแจ้งซ่อมบ้านหลังโอน (After Sales)</th>
                          <th class="tf-3" rowspan="2">งานแจ้งซ่อมสะสมในเดือน</th>
                          <th class="tf-3" rowspan="2">ลูกค้าเซ็นปิดจบ 100%</th>
                          <th class="tf-3" rowspan="2">งานค้างสะสมในเดือน</th>
                          <th class="tf-3" rowspan="2">% ปิดจบ (เทียบงานทั้งหมดในเดือน)</th>

                          <td :rowspan="3" style="background-color:white;"></td>
                          <th colspan="4">(A) งานค้างซ่อม สะสมยกมา</th>

                          <td :rowspan="3" style="background-color:white;"></td>
                          <th colspan="4">(B) งานซ่อมปัจจุบัน ในเดือน {{month_th[cond.month-1]}} {{cond.year}}</th>
                        </tr>
                        <tr>
                          <th class="tf-2">ลำดับ</th>
                          <th class="tf-3">ภาค</th>
                          <th class="tf-2-5">รหัสย่อ</th>
                          <th class="tf-4">โครงการ</th>
                          <th class="tf-3">ฝ่ายขาย (Sales) รับเรื่อง-ตรวจสอบงานซ่อม</th>
                          <th class="tf-3">ผู้จัดการ (PM) ตรวจสอบ</th>
                          <th class="tf-3">เจ้าหน้าที่ (AF/QC) ประสานงาน</th>
                          <th class="tf-3">เจ้าหน้าที่ (FM) ควบคุม</th>
                          <!--(A)-->
                          <th class="tf-3">งานค้างซ่อมสะสมยกมา (Brought Forward)</th>
                          <th class="tf-3" style="background-color: #0b570b;">ลูกค้าเซ็นปิดจบ (รับมอบงานซ่อม 100%)</th>
                          <th class="tf-3" style="background-color: #a47c06;">งานระหว่างซ่อม (รวมงานระหว่างดำเนินการซ่อมสะสม)</th>
                          <th class="tf-3" style="background-color: #a40f2d;">งานซ่อม-ยังไม่เข้าซ่อม (รวมงานที่ยังไม่ซ่อมสะสม)</th>
                          <!--(B)-->
                          <th class="tf-3">งานซ่อมปัจจุบันในเดือน (New Item)</th>
                          <th class="tf-3" style="background-color: #0b570b;">ลูกค้าเซ็นปิดจบ (รับมอบงานซ่อม 100%)</th>
                          <th class="tf-3" style="background-color: #a47c06;">งานระหว่างซ่อม (รวมงานระหว่างดำเนินการซ่อมสะสม)</th>
                          <th class="tf-3" style="background-color: #a40f2d;">งานซ่อม-ยังไม่เข้าซ่อม (รวมงานที่ยังไม่ซ่อมสะสม)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="text-center text-bold pointer tr-hovered" v-for="x, idx in rptHeader" :class="{'table-selected': x.checked}" :style="{'font-size': x.projtype == 'ALL' ? '1.2em' : ''}" @click="selectProj(x)">
                          <td colspan="8" align="right"><b>{{x.projtype_name || 'ไม่ระบุ'}}</b></td>
                          <td>{{x.accu_total | number(0)}}</td>
                          <td>{{x.accu_complete | number(0)}}</td>
                          <td>{{x.accu_inprogress | number(0)}}</td>
                          <td>{{x.complete_per | number(0)}}%</td>
                          <td :rowspan="rptHeader.length" style="background-color:white !important;" v-if="idx == 0"></td>
                          <td>{{x.prev_total | number(0)}}</td>
                          <td>{{x.prev_complete | number(0)}}</td>
                          <td>{{x.prev_inprogress | number(0)}}</td>
                          <td>{{x.prev_none | number(0)}}</td>
                          <td :rowspan="rptHeader.length" style="background-color:white !important;" v-if="idx == 0"></td>
                          <td>{{x.this_total | number(0)}}</td>
                          <td>{{x.this_complete | number(0)}}</td>
                          <td>{{x.this_inprogress | number(0)}}</td>
                          <td>{{x.this_none | number(0)}}</td>
                        </tr>
                        <tr><td colspan="22"></td></tr>
                        <tr class="text-center" :class="[fadein ? 'fade-in' : 'fade-out']" v-for="x, idx in rptDetail">
                          <td>{{idx+1}}</td>
                          <td align="left">{{x.projtype_name || 'ไม่ระบุ'}}</td>
                          <td align="left">{{x.refcode}}</td>
                          <td align="left">{{x.projname}}</td>
                          <td align="left"></td>
                          <td align="left"></td>
                          <td align="left"></td>
                          <td align="left"></td>
                          <td>{{x.accu_total | number(0)}}<div class="bg-progress bg-danger" :style="{'width': calper('accu_total', x)+'%'}"></div></td>
                          <td>{{x.accu_complete | number(0)}}</td>
                          <td>{{x.accu_inprogress | number(0)}}<div class="bg-progress bg-danger" :style="{'width': calper('accu_inprogress', x)+'%'}"></div></td>
                          <td>{{x.complete_per | number(0)}}%<div class="bg-progress" :style="{'width': (x.complete_per * 0.92)+'%'}"></div></td>

                          <td :rowspan="rptDetail.length" style="background-color:white;" v-if="idx == 0"></td>
                          <td>{{x.prev_total | number(0)}}</td>
                          <td>{{x.prev_complete | number(0)}}</td>
                          <td>{{x.prev_inprogress | number(0)}}<div class="bg-progress bg-danger" :style="{'width': calper('prev_inprogress', x)+'%'}"></div></td>
                          <td>{{x.prev_none | number(0)}}</td>

                          <td :rowspan="rptDetail.length" style="background-color:white;" v-if="idx == 0"></td>
                          <td>{{x.this_total | number(0)}}</td>
                          <td>{{x.this_complete | number(0)}}</td>
                          <td>{{x.this_inprogress | number(0)}}<div class="bg-progress bg-danger" :style="{'width': calper('this_inprogress', x)+'%'}"></div></td>
                          <td>{{x.this_none | number(0)}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </re-page>
  </div>
</template>
<script type="text/javascript">
  import Chart from 'chart.js';
  import 'chartjs-plugin-labels';
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let month_th = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  let page = {};
  let cpn = {
    data() {
      return {
        baseUrl,
        baseRoute,
        queryString,
        ui: window.ui,
        isLoading: false,
        fadein: true,
        cond: { year: year, month: month },
        month_th: month_th,
        dashData: [],
        rptTemp: {},
        rptHeader: [],
        rptDetail: [],
        summaryTotal: {}
      };
    },
    methods: {
      randomMath() {
        return Math.round(Math.random() * 255);
      },
      async loadTotal() {
        let act = `csm/report/GetTotalSummary`;
        let rsp = await $xt.getServer(act);
        this.$set(this, "summaryTotal", rsp);
      },
      reset() {
        this.$set(this, "dashData", []);
        this.$set(this, "rptHeader", []);
        this.$set(this, "rptDetail", []);
      },
      async loadAll() {
        page.loadingBox.show();
        await this.loadDashData();
        await this.loadRptData();
        page.loadingBox.hide();
      },
      async loadDashData() {       
        let act = `csm/report/Dash_AllCompanySummary?year=${this.cond.year}&month=${this.cond.month}`;
        let resp = await $xt.getServer(act);
        this.$set(this, "dashData", resp || []);
        this.loadChart();       
      },
      async loadRptData() {
        let act = `csm/report/Rpt_AllCompanyDetail?year=${this.cond.year}&month=${this.cond.month}`;
        let resp = await $xt.getServer(act);
        this.$set(this, "rptTemp", JSON.parse(JSON.stringify(resp)));
        this.$set(this, "rptHeader", resp.header || []);
        this.$set(this, "rptDetail", resp.detail || []);
        $linq(this.rptHeader).foreach(x => x.checked = x.projtype == 'ALL');
      },
      async loadChart() {
        let resp = await this.dashData || [];
        let labels = $linq(resp || []).select(x => x.projtype_name).distinct().toArray() || [];
        let accu_prev_arr = $linq(resp || []).select(x => x.accu_prev).toArray() || [];
        let accu_this_arr = $linq(resp || []).select(x => x.accu_this).toArray() || [];
        let accu_complete_arr = $linq(resp || []).select(x => x.accu_complete).toArray() || [];
        let accu_done_arr = $linq(resp || []).select(x => x.accu_done).toArray() || [];
        let accu_inprogress_arr = $linq(resp || []).select(x => x.accu_inprogress).toArray() || [];
        let accu_none_arr = $linq(resp || []).select(x => x.accu_none).toArray() || [];
        let accu_reject_arr = $linq(resp || []).select(x => x.accu_reject).toArray() || [];

        //find maximum values
        let max_arr = $linq(resp || []).where(w => w.projtype == 'ALL').select(x => {
          return {
            target: (x.accu_prev + x.accu_this),
            progress: (x.accu_complete + x.accu_done + x.accu_inprogress + x.accu_none + x.accu_reject)
          }
        }).toArray() || [];
        let max_target = $linq(max_arr).max(x => x.target) || 0;
        let max_pg = $linq(max_arr).max(x => x.progrss) || 0;
        let max = Math.max.apply(null, [max_target, max_pg]);
        max = Math.ceil(max + (max * 0.2)); // +เพิ่มอีก 20% 

        //const labels = ['รวมทุกภาค', 'เหนือ', 'ตะวันออก', 'อีสาน', 'กลาง', 'ใต้'];
        const data = {
          labels: labels,
          datasets: [
            //Progress Bar
            {
              label: "ลูกค้าเซ็นปิดจบ(สะสม)",
              backgroundColor: 'rgb(120, 190, 146)',
              borderWidth: 1,
              data: accu_complete_arr,
              xAxisID: "bar-x-axis1",
              yAxisID: "bar-y-axis1",
              stack: "background"
            },
            {
              label: "ซ่อมเสร็จ(สะสม)",
              backgroundColor: 'rgb(190, 234, 170)',
              borderWidth: 1,
              data: accu_done_arr,
              xAxisID: "bar-x-axis1",
              yAxisID: "bar-y-axis1",
              stack: "background"
            },
            {
              label: "กำลังซ่อม(สะสม)",
              backgroundColor: 'rgb(182, 223, 237)',
              borderWidth: 1,
              data: accu_inprogress_arr,
              xAxisID: "bar-x-axis1",
              yAxisID: "bar-y-axis1",
              stack: "background"
            },
            {
              label: "ยังไม่ได้ซ่อม(สะสม)",
              backgroundColor: 'rgb(239, 226, 170)',
              borderWidth: 1,
              data: accu_none_arr,
              xAxisID: "bar-x-axis1",
              yAxisID: "bar-y-axis1",
              stack: "background"
            },
            {
              label: "ยกเลิก(สะสม)",
              backgroundColor: 'rgb(242, 180, 166)',
              borderWidth: 1,
              data: accu_reject_arr,
              xAxisID: "bar-x-axis1",
              yAxisID: "bar-y-axis1",
              stack: "background"
            },

            //Target Bar
            {
              label: "งานค้างซ่อมยกมา(สะสม)",
              backgroundColor: 'rgba(0, 64, 152, 0.40)',
              borderWidth: 1,
              data: accu_prev_arr,
              xAxisID: "bar-x-axis2",
              yAxisID: "bar-y-axis2",
              stack: "target"
            },
            {
              label: "งานระหว่างซ่อม(สะสม)",
              backgroundColor: 'rgba(119, 0, 145, 0.20)',
              borderWidth: 1,
              data: accu_this_arr,
              xAxisID: "bar-x-axis2",
              yAxisID: "bar-y-axis2",
              stack: "target"
            }
          ]
        };

        var options = {
          responsive: true,
          title: {
            display: true,
            text: `สรุปสถานะงานแจ้งซ่อมรวมทุกโครงการ ประจำเดือน ${month_th[this.cond.month - 1]} ปี ${this.cond.year}`,
            fontSize: 16,
          },
          interaction: {
            intersect: true,
          },
          plugins: {
            labels: {
              visible: false,
              render: 'value',
              fontColor: 'rgba(0, 0, 0, 0)',
              showZero: true
            }
          },
          scales: {
            xAxes: [
              {
                display: true,
                stacked: true,
                id: "bar-x-axis2",
                categoryPercentage: 0.5,
                barPercentage: 1,
                ticks: {
                  mirror: true,
                  display: false,
                }
              },
              {
                display: true,
                stacked: true,
                id: "bar-x-axis1",
                type: 'category',
                categoryPercentage: 0.25,
                barPercentage: 1,
                gridLines: {
                  offsetGridLines: true
                },
                offset: true
              }
            ],
            yAxes: [{
              display: false,
              id: "bar-y-axis2",
              stacked: true,
              ticks: {
                beginAtZero: false,
                min: 0,
                max: max
              }
            },
            {
              display: true,
              id: "bar-y-axis1",
              stacked: true,
              ticks: {
                beginAtZero: false,
                min: 0,
                max: max
              }
            }]
          }
        };

        new Chart(this.$refs.stacked_barChart, {
          type: 'bar',
          data: data,
          options: options,
        });

      },
      async selectProj(x) {
        $linq(this.rptHeader).foreach(f => f.checked = f.projtype == x.projtype);

        this.$set(this, 'fadein', false);
        await $xt.sleep(200);
        this.$set(this, 'rptDetail', []);

        this.$set(this, 'fadein', true);
        this.$set(this, 'rptDetail', $linq(this.rptTemp.detail || []).where(w => x.projtype == 'ALL' ? true : w.projtype == x.projtype).toArray() || []);
      },
      calper(key, x) {
        let num = x[key] || 0;
        let div = $linq(this.rptHeader).where(w => w.projtype == x.projtype).select(s => s[key]).firstOrDefault() || 0;
        let result = div == 0 ? 0 : (num * 100) / div;
        let over = result * 0.92; //ความกว้างที่เกินออกมาต้องตัดออก
        return over.toFixed(2);
      }
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'CSM : Customer Service Dashboard 2';
      document.title = page.pageTitle;

      Chart.defaults.global.defaultFontFamily = "'Roboto', 'Sarabun', sans-serif";
      Chart.defaults.global.defaultFontColor = 'black';
      Chart.defaults.global.defaultFontSize = 13;

      this.loadTotal();
      this.loadAll();
    }
  };
  export default cpn;
</script>
<style scoped>
  .hr-vertical {
    border: none;
    border-left: 1px solid #333;
    height: 100vh;
    width: 1px;
  }
  .table > tbody > tr > td{
    position: relative;
    opacity: .999;    
  }
  .tr-hovered {
    height: 38px;
  }
  .tr-hovered:hover {
    transition: 0.2s;
    font-size: 1.2em;
  }
  .bg-yellow {
    background-color: #f7d13d !important;
  }
  .bg-danger {
    background-color: #ff777e !important;
  }
  .bg-progress {
    position: absolute;
    margin: 5px;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #10c472;
    z-index: -1;
  }

  .fade-in {
    animation: fadein 0.5s;
    /*-moz-animation: fadein 2s;*/ /* Firefox */
    /*-webkit-animation: fadein 2s;*/ /* Safari and Chrome */
    /*-o-animation: fadein 2s;*/ /* Opera */
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .fade-out {
    animation: fadeout 0.5s;
  }

  @keyframes fadeout {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
</style>
