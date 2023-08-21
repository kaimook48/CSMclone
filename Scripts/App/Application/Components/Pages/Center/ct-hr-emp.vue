<template>
  <div>
    <div class="modal fade" ref="EMPModal">
      <div class="modal-dialog" style="width:70% !important;">
        <div class="modal-content">
          <div class="modal-header">
            <h4><i class="fas fa-user"></i> ข้อมูลรายชื่อพนักงาน</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Search</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['search_text']" @keyup.enter="onSearch" />
                    <span class="input-group-btn"><a class="btn btn-sm btn-default" @click="onSearch"><i class="fa fa-search"></i></a></span>
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
                        <th class="tf-3 text-center">Code</th>
                        <th>Name</th>
                        <th class="tf-4">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData" style="cursor:pointer" @click="sendData(x)">
                        <td>{{x.empcode}}</td>
                        <td>{{x.empfullname}}</td>
                        <td>{{x.posname_t}}</td>
                      </tr>
                    </tbody>
                  </table>
                </table-stick-2>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
            <button type="button" class="btn btn-sm btn-default" data-dismiss="modal"><i class="fa fa-remove"></i> ปิดหน้าต่าง</button>
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
          search_text: '',
        },
        respData: [],
      }
    },
    methods: {
      async openModal() {
        this.$set(this.retrieveSearch, 'search_text', '')
        $(this.$refs.EMPModal).modal('show')
        await this.loadData()
      },
      closeModal() {
        $(this.$refs.EMPModal).modal('hide')
      },
      async pageChange(pn) {
        paging.setCurrentPage(pn)
        await this.loadData()
      },
      onSearch() {
        paging.setCurrentPage(1)
        this.loadData()
      },
      async loadData() {
        let url = `CSM/Center/Employee_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`
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
      },
      sendData(x) {
        this.$emit('send-data', x)
        this.closeModal()
      },
    },
    mounted() {
      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(500)
    }
  }
</script>
