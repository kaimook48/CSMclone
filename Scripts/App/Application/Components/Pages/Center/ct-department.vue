<template>
  <div>
    <div class="modal fade" ref="DepartmentModal">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h4>ข้อมูลแผนก</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>ค้นหา</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['search_text']" @keyup.enter="loadData" />
                    <span class="input-group-btn"><a class="btn btn-sm btn-default" @click="loadData"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th class="tf-3 text-center">Code</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData" style="cursor:pointer" @click="sendData(x)">
                        <td align="center" class="text-bold">{{x.dpt_code}}</td>
                        <td>{{x.dpt_name}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
          search_text: "",
        },
        respData: [],
      };
    },
    methods: {
      openModal() {
        (async () => {
          $(this.$refs.DepartmentModal).modal('show');
          await this.loadData();
        })();
      },
      closeModal() {
        $(this.$refs.DepartmentModal).modal('hide');
      },
      pageChange(pn) {
        (async () => {
          paging.setCurrentPage(pn);
          await this.loadData();
        })();
      },
      loadData() {
        (async () => {
          let url = `CSM/Center/Department_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;

          for (var key in this.retrieveSearch) {
            url += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;
          }

          let resp = await $xt.getServer(url);
          this.respData = resp.data.data_rows;

          paging.setTotalItems(resp.data.total);
          if (!paging.getItemsPerPage()) {
            paging.setCurrentPage(1);
          }
          paging.createPagesArray();

        })();
      },
      sendData(x) {
        this.$emit("send-data", x);
        this.closeModal();
      },
    },
    mounted() {
      paging = this.$refs.paging;
      paging.setCurrentPage(1);
      paging.setItemsPerPage(10);
    }
  };
</script>
