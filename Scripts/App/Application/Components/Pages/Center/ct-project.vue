<template>
  <div>
    <div class="modal fade" data-easein="expandIn" ref="ProjectModal">
      <div class="modal-dialog" style="width: 70% !important;">
        <div class="modal-content">
          <div class="modal-header">
            <h4><i class="fas fa-box-open"></i> ข้อมูลโครงการ</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Search</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['search_text']" @keyup.enter="pageChange(1)" />
                    <span class="input-group-btn"><a class="btn btn-sm btn-default" @click="loadData"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Project Type</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch['proj_type']" @change="loadData">
                    <option value="">-- Select --</option>
                    <option v-for="x in proj_type" :value="x.value">{{x.name}}</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Project Status</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch['status_clo']" @change="loadData">
                    <option value="">-- Select --</option>
                    <option value="Y">ปิดโครงการ</option>
                    <option value="N">ยังดำเนินโครงการ</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table-stick-2 ref="table_stick">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th class="tf-3 text-center">Project No</th>
                        <th class="tf-3 text-center">Ref.Code</th>
                        <th>Project Name</th>
                        <th>Customer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData" style="cursor: pointer" @click="sendData(x)">
                        <td>{{x.pre_event}}</td>
                        <td>{{x.refcode}}</td>
                        <td>
                          {{x.pre_des}}
                          <span class="text-danger pull-right" style="font-weight: bold;" v-if="x.clo == 'Y'">(Closed)</span>
                        </td>
                        <td>{{x.customer_name}}</td>
                      </tr>
                    </tbody>
                  </table>
                </table-stick-2>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
            <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal"><i class="fa fa-remove"></i> {{ui.close}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  let paging = {}
  export default {
    data() {
      return {
        baseUrl,
        baseRoute,
        queryString,
        ui,
        retrieveSearch: {
          search_text: "",
          proj_type: "",
          status_clo: ""
        },
        proj_type: [
          { value: "1", name: "Trading" },
          { value: "2", name: "Construction" },
          { value: "3", name: "Real Estate" }
        ],
        respData: [],
      }
    },
    methods: {
      openModal() {
        (async () => {
          $(this.$refs.ProjectModal).modal('show')
          this.retrieveSearch.search_text = ""
          paging.setCurrentPage(1)
          await this.loadData()
        })()
      },
      closeModal() {
        $(this.$refs.ProjectModal).modal('hide')
      },
      pageChange(pn) {
        (async () => {
          paging.setCurrentPage(pn)
          await this.loadData()
        })()
      },
      loadData() {
        (async () => {
          let url = `CSM/Center/ProjectContact_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`

          for (var key in this.retrieveSearch) {
            url += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`
          }

          let resp = await $xt.getServer(url)
          this.respData = resp.data.data_rows

          paging.setTotalItems(resp.data.total)
          if (!paging.getItemsPerPage()) {
            paging.setCurrentPage(1)
          }
          paging.createPagesArray()

          await $xt.sleep(200)
          await this.$refs.table_stick.createStick()
        })()
      },
      sendData(x) {
        this.$emit("send-data", x)
        this.closeModal()
      },
    },
    mounted() {
      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(100)
    }
  }
</script>
