<template>
  <div>
    <div class="modal fade" ref="EMPModal">
      <div class="modal-dialog" style="width:70% !important;">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Employee</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Search :</label>
                  <div class="input-group">
                    <input type="text" class="form-control" v-model.trim="retrieveSearch['search_text']" @keyup.enter="loadData" />
                    <span class="input-group-btn"><a class="btn btn-default" @click="loadData"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr class="text-center">
                        <th style="width:250px" class="no-wrap text-nowrap" nowrap>Employee Code</th>
                        <th>Employee Name</th>
                        <th>Project Contact</th>
                        <th style="width:300px;">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData" style="cursor:pointer" @click="sendData(x)">
                        <td>{{x.empcode}}</td>
                        <td>{{x.empfullname}}</td>
                        <td>{{x.pre_des}}</td>
                        <td>{{x.respon_type == "W" ? "Worker" : "Checker"}}</td>
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
    props: [
      'pre_event'
    ],
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
        respon_type: "",
      };
    },
    methods: {
      openModal(respon_type) {
        (async () => {
          this.respon_type = respon_type;
          $(this.$refs.EMPModal).modal('show');
          await this.loadData();
        })();
      },
      closeModal() {
        $(this.$refs.EMPModal).modal('hide');
      },
      pageChange(pn) {
        (async () => {
          paging.setCurrentPage(pn);
          await this.loadData();
        })();
      },
      loadData() {
        (async () => {
          let url = `CSM/MASTER/ProjectWorker_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;

          for (var key in this.retrieveSearch) {
            url += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;
          }

          let resp = await $xt.getServer(url);
          this.respData = $linq(resp.data.data_rows).where(w => w.respon_type == this.respon_type && w.pre_event == this.pre_event).toArray();

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
