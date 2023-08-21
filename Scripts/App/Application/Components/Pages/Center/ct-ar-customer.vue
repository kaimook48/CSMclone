<template>
  <div>
    <div class="modal fade" ref="ARCustomerModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4><i class="fas fa-box-open"></i> ข้อมูลลูกค้า (AR)</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Search</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['search_text']" @keyup.enter="loadData" />
                    <span class="input-group-btn"><a class="btn bg-navy" @click="loadData"><i class="fa fa-search"></i></a></span>
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
                        <th class="tf-3">Code</th>
                        <th>Customer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData" style="cursor:pointer" @click="sendData(x)">
                        <td>{{x.customer_code}}</td>
                        <td>{{x.customer_name}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
        },
        respData: [],
      };
    },
    methods: {
      openModal() {
        (async () => {
          $(this.$refs.ARCustomerModal).modal('show');
          await this.loadData();
        })();
      },
      closeModal() {
        $(this.$refs.ARCustomerModal).modal('hide');
      },
      pageChange(pn) {
        (async () => {
          paging.setCurrentPage(pn);
          await this.loadData();
        })();
      },
      loadData() {
        (async () => {
          let url = `CSM/Center/AR_Customer_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;

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
