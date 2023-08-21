<template>
  <div>
    <div class="modal fade" data-easein="expandIn" ref="Project2Modal">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h4><i class="fas fa-box-open"></i> ข้อมูลโครงการ</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label>Project Type</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch['proj_type']" @change="loadData()">
                    <option value="">-- Please Select --</option>
                    <option v-for="x in proj_type" :value="x.value">{{x.name}}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label>Search</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['search_text']" @keyup.enter="pageChange(1)" />
                    <span class="input-group-btn"><a class="btn btn-sm bg-navy" @click="loadData()"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="d-flex margin-t-25">
                  <div class="form-check form-switch form-check-custom form-check-solid me-5">
                    <input class="form-check-input h-20px w-30px" type="checkbox" true-value="Y" false-value="N" v-model="retrieveSearch['projrunno']" @change="loadData()" />
                    <label class="form-check-label">Project Contract Only</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table-stick-2 ref="table_stick">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th class="tf-3-5">Project No</th>
                        <th class="tf-3-5">Ref.Code</th>
                        <th class="tf-5">Project Name</th>
                        <th class="tf-5">Customer</th>
                        <th class="tf-2">Warranty</th>
                        <th class="tf-2">MA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData"
                          class="pointer"
                          v-bind:class="{'text-bold': x.projrunno == 0}"
                          @click="sendData(x)">

                        <td>{{x.pre_event}}</td>
                        <td>{{x.refcode}}</td>
                        <td>
                          {{x.pre_des}}
                          <span class="text-danger pull-right" style="font-weight: bold;" v-if="x.clo == 'Y'">(Closed)</span>
                        </td>
                        <td>{{x.customer_name}}</td>
                        <td class="text-center text-success"><i class="fa fa-check" v-if="x.warranty == 'Y'"></i></td>
                        <td class="text-center text-success"><i class="fa fa-check" v-if="x.ma == 'Y'"></i> </td>

                      </tr>
                    </tbody>
                  </table>
                </table-stick-2>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
            <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal"><i class="fa fa-remove"></i> ปิดหน้าต่าง</button>
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
        retrieveSearch: {},
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
          $(this.$refs.Project2Modal).modal('show')
          await this.loadData()
        })()
      },
      closeModal() {
        $(this.$refs.Project2Modal).modal('hide')
      },
      pageChange(pn) {
        (async () => {
          paging.setCurrentPage(pn)
          await this.loadData()
        })()
      },
      loadData() {
        (async () => {
          let url = `CSM/Center/Project_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`

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
      statusName(value) {
        return value == 'Y' ? "Yes" : "No"
      },
      statusClass(status) {
        return status == 'Y' ? 'text-success' : 'text-danger'
      },
    },
    mounted() {
      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(500)

      this.$set(this.retrieveSearch, "proj_type", "")
    }
  }
</script>
