<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body with-border">
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label>Module</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch['module']" @change="retrieveSetPage(1)">
                    <option value="">-- Please Select --</option>
                    <option v-for="x in module" v-bind:value="x">{{ x }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label>Approve Status</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch['approve_status']" @change="retrieveSetPage(1)">
                    <option value="">-- Please Select --</option>
                    <option v-for="x in approveStatus" v-bind:value="x.value">{{ x.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label>Search by</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch['field']">
                    <option value="">-- Please Select --</option>
                    <option v-for="x in fields" v-bind:value="x.key">{{ x.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label>Search Keyword</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['search']" @keyup.enter="retrieveSearchClick()" ref="searchBox" />
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="retrieveSearchClick()"><i class="fa fa-search"></i></button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label>&nbsp;</label>
                  <div class="input-group">
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-olive pull-right" @click="toUpdateList()"><i class="fas fa-list"></i> ยืนยันการนำข้อมูลไปออก Update List</button>
                    </span>
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
                        <th class="tf-2"></th>
                        <th class="tf-3-5 text-center">Document No.</th>
                        <th class="tf-2-5 text-center">Item No.</th>
                        <th class="tf-2-5 text-center">Module</th>
                        <th class="tf-3">Revision No.</th>
                        <th>Subject</th>
                        <th class="tf-3-5">Type</th>
                        <th class="tf-3-5 text-center">Complete Date</th>
                        <th class="tf-2-5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody v-for="(x,idx) in data">
                      <tr>
                        <td align="center">
                          <span class="checkbox checkbox-inline">
                            <label>
                              <input type="checkbox" :name="'checkbox' + idx" v-model="x.isCheckData" />
                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                              &nbsp;
                            </label>
                          </span>
                        </td>
                        <td align="center"><a href="#" @click.prevent="queryString(x)">{{x.job_no}}</a></td>
                        <td align="center">{{x.itemno}}</td>
                        <td align="center">{{x.module}}</td>
                        <td align="center">{{x.revision}}</td>
                        <td>{{x.subject}}</td>
                        <td>{{itemTypeName(x.item_type)}}</td>
                        <td align="center">{{x.complete_date | date()}}</td>
                        <td align="center">
                          <span v-bind:class="[x.revision_is_import_by_admin == 'Y' ? 'label label-success' : 'label label-danger']">{{x.revision_is_import_by_admin == 'Y' ? 'Approve' : 'None'}}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
          </div>
        </div>
      </template>
    </re-page>
  </div>
</template>

<script type="text/javascript">
  let page = {}
  let paging = {}
  export default {
    data() {
      return {
        auth,
        ui: window.ui,
        xt: $xt,
        baseUrl,
        fields: [
          { key: 'job_no', name: 'CRM No.', type: 's', search: true, sort: true, sort_default: true, width: 200 },
        ],
        approveStatus: [
          { name: 'ALL', value: 'ALL' },
          { name: 'Approve', value: 'Y' },
          { name: 'None', value: 'N' },
        ],
        module: moduleCodeData,
        retrieveSearch: {},
        data: [],
        total: 0,
      };
    },
    methods: {
      async loadRetrieve() {
        let module = this.retrieveSearch['module'] == undefined ? "All Module" : this.retrieveSearch['module'];
        let approve_status = this.retrieveSearch['approve_status'] == undefined ? "N" : this.retrieveSearch['approve_status'];
        let act = `CSM/Manual/CheckUpdateList?module=${module}&approve_status=${approve_status}&skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;
        for (var key in this.retrieveSearch) {
          act += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;
        }

        let rsp = await $xt.getServer(act);
        this.$set(this, 'data', rsp.data);
        this.$set(this, 'total', rsp.total);

        paging.setTotalItems(rsp.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      retrieveSearchClick() {
        this.pageChange(1);
      },
      retrieveSetPage(x) {
        paging.setCurrentPage(x);
        this.loadRetrieve();
      },
      pageChange(x) {
        paging.setCurrentPage(x);
        this.loadRetrieve();
      },
      itemTypeName(code) {
        return $linq(this.serviceCodeData).where(x => x.serv_code == code).select(x => x.serv_name).firstOrDefault() || '';
      },
      async toUpdateList() {
        try {
          let count = $linq(this.data).where(x => x.isCheckData).count();
          if (count < 1) {
            $msg.alert(`คำเตือน`, "กรุณาเลือกอย่างน้อย 1 รายการ", `warning`);
            return
          }

          let arr = $linq(this.data).where(x => x.isCheckData).toArray();
          let obj = $linq(arr).where(x => x.attach_files == 0 && x.item_type != "11").firstOrDefault();
          if (obj != null && _obj.attach_files == 0) {
            $msg.alert(`คำเตือน`, `${obj.job_no} : รายการที่เลือกยังไม่ได้แนบรูปที่แท็บ Attach Files (Updates List)`, `warning`);
            return;
          }

          arr.forEach((x, idx) => {
            this.$set(x, 'revision_is_import_by_admin', x.revision_is_import_by_admin == "N" ? "Y" : "N");
          });

          page.loadingBox.show();
          let act = `CSM/Manual/UpdateCheckUpdateList`;
          let rsp = await $xt.postServerJson(act, { detail: arr });
          if (!rsp.success) {
            throw rsp.error;
          }
          this.loadRetrieve();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }

      },
      queryString(x) {
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${x.job_no}&ref_itemno=${x.itemno}`, "_blank");
      },
    },
    computed: {
      connectionCodeData() { return store.state.connectionCodeData },
      requestCodeData() { return store.state.requestCodeData },
      priorityCodeData() { return store.state.priorityCodeData },
      serviceCodeData() { return store.state.serviceCodeData },
      configData() { return store.state.configData },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = `Check Update List`;
      document.title = page.pageTitle;

      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);

      let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {};
      this.$set(this.retrieveSearch, 'field', field_init.key || '');
      this.$set(this.retrieveSearch, 'field_type', field_init.type || 's');

      let sort_init = $linq(this.module).where(x => x == 'All Module').firstOrDefault() || {};
      this.$set(this.retrieveSearch, 'module', sort_init || '');

      this.$set(this.retrieveSearch, 'approve_status', this.approveStatus[2].value || '');
      
      this.loadRetrieve();

    }
  };
</script>

<style scoped>
  table {
    border-collapse: unset !important;
  }
</style>
