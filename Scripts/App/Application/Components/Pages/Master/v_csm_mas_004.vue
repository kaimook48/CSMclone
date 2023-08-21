<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <!-- Project Contract -->
            <div class="row">
              <div class="col-lg-2 col-md-4">
                <div class="form-group">
                  <label class="text-danger">Project Contract</label>
                  <span class="input-group">
                    <input type="text" class="form-control input-sm" v-model="header.pre_event" readonly />
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="$refs.ct_project.openModal()"><i class="fa fa-search"></i></button>
                      <button class="btn btn-sm btn-danger" @click="clearData(header, ['pre_event', 'pre_des'])" v-change="resetProjCon"><i class="fa fa-close"></i></button>
                    </span>
                  </span>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <label class="pull-right">&nbsp;</label>
                  <input type="text" class="form-control input-sm" v-model="header.pre_des" readonly />
                </div>
              </div>
            </div>
            <!-- Main Data -->
            <div class="row">
              <div class="col-lg-12 col-md-12">
                <div class="nav-tabs-custom">
                  <ul class="nav nav-tabs">
                    <li :class="{active:tabActive===0}"><a href="#" @click.prevent="changeTab(0)">รายการโครงการย่อย ({{projPhase.length || 0}})</a></li>
                    <li class="pull-right"><app-form ref="appForm"></app-form></li>
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane" :class="{active:tabActive===0}">
                      <div class="row">
                        <div class="col-lg-12 col-md-12">
                          <b class="pull-right">จำนวนโครงการทั้งหมด : {{projPhase.length || 0}} โครงการ | จำนวน Area ของโครงการ : {{projArea.length || 0}} Area</b>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12 col-md-12">
                          <table-stick height="500">
                            <table class="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th class="tf-2-5">Ref. Code</th>
                                  <th class="tf-2-5">Project No.</th>
                                  <th class="tf-6">Project (Unit/Phase)</th>
                                  <template v-for="x,idx in projArea">
                                    <th class="tf-3-5 text-center">{{x.locname}}</th>
                                  </template>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td colspan="3"></td>
                                  <td align="center" v-for="z,idx2 in projArea" class="text-nowrap nowrap">
                                    <input type='checkbox' :id="idx2" @change="checkAll($event,z.loccode)" true-value="Y" false-value="N"> เลือกทั้งหมด
                                  </td>
                                </tr>
                                <tr :class="{'font-bold': x.projrunno == 0}" v-for="x,idx in projPhase">
                                  <th>{{x.refcode}}</th>
                                  <td>{{x.pre_event}}</td>
                                  <td>{{x.pre_des}}</td>
                                  <template v-for="z,idx2 in projArea">
                                    <td align="center">
                                      <input type='checkbox' v-model="x['chk,'+x.pre_event+','+z.loccode]" :id=" 'id'+idx2+'#'+idx " true-value="Y" false-value="N">
                                    </td>
                                  </template>
                                </tr>
                                <tr v-if="projPhase.length == 0">
                                  <td colspan="3" align="center">-- กรุณาเลือกโครงการ --</td>
                                </tr>
                              </tbody>
                            </table>
                          </table-stick>
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

    <!-- Center Modal -->
    <vue-project-list ref="ct_project" @send-data="sendComponent($event, 'project')"></vue-project-list>

  </div>
</template>
<script>
  let page = {};
  let appForm = {};
  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        tabActive: 0,
        projPhase: [],
        projArea: [],
        header: {},
        dataAdmin: {},
      };
    },
    methods: {
      changeTab(t) {
        this.tabActive = t;
      },
      resetProjCon() {
        this.header = {};
      },
      clearData(data, field) {
        $linq(field).foreach(x => this.$set(data, x, null));
        if (field[0] == 'pre_event') {
          this.projPhase = [];
          this.projArea = [];
        }
      },
      checkAll(e, loccode) {
        $linq(this.projPhase).foreach(x => {
          if (e.target.checked) {
            this.$set(x, `chk,${x.pre_event},${loccode}`, "Y");
          } else {
            this.$set(x, `chk,${x.pre_event},${loccode}`, "N");
          }
        })
      },
      async loadPhase(pre_event2) {
        let url = `CSM/Center/UnitPhase0_ReadList?pre_event2=${pre_event2 || ''}`;
        let resp = await $xt.getServer(url);
        this.projPhase = resp.data.data_rows;

      },
      async loadArea(pre_event2) {
        let act = `CSM/MASTER/ProjArea_ReadList?pre_event2=${pre_event2}`;
        let rsp = await $xt.getServer(act);
        $linq(rsp.data.data_rows).foreach(x => {
          x.cc_select = "N"
        });
        this.projArea = $linq(rsp.data.data_rows).where(x => x.active == "Y").toArray();
      },
      async loadProjArea(pre_event) {
        let act = `CSM/MASTER/AreaInProject_ReadList?pre_event=${pre_event}`;
        let rsp = await $xt.getServer(act);

        $linq(this.projPhase).foreach(f => {
          let p = $linq(rsp).where(w => w.pre_event == f.pre_event).toArray();
          $linq(p).foreach(x => {
            this.$set(f, `chk,${x.pre_event},${x.loccode}`, "Y");
          })
        });
      },
      setData() {
        let arr = [];
        $linq(this.projPhase).foreach(m => {
          let p = Object.getOwnPropertyNames(m);
          $linq(p).where(x1 => x1.indexOf('chk,') > -1).foreach(f => {
            if (m[f] == "Y") {
              let sp = f.split(",")
              arr.push({
                pre_event: sp[1],
                loccode: sp[2]
              });
            }
          });
        });
        return arr
      },
      async saveData() {
        try {
          let formData = this.setData();
          let f = {
            pre_event: this.header.pre_event,
            header: formData
          };
          let act = `CSM/MASTER/AreaInProjec_Create`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      sendComponent(e, type) {
        switch (type) {
          case "project":
            this.$set(this.header, "pre_event", e.pre_event);
            this.$set(this.header, "pre_event2", e.pre_event2);
            this.$set(this.header, "pre_des", e.pre_des);
            (async () => {
              await this.loadPhase(e.pre_event2);
              await this.loadArea(e.pre_event2);
              await this.loadProjArea(e.pre_event);
            })();
            break;
        }
      },
    },
    computed: {

    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'Master : ตั้งค่าพื้นที่โครงการ';
      document.title = page.pageTitle;

      appForm = this.$refs.appForm;
      appForm.btnRetrieve.show = false;
      appForm.btnPrint.show = false;
      appForm.btnBack.show = false;
      appForm.btnNew.show = false;
      appForm.btnDelete.show = false;
      appForm.btnSave.click = this.saveData;

    }
  };

  export default cpn;
</script>
