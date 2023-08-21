<template>
  <div>
    <div class="modal fade" ref="WorkTypeModal">
      <div class="modal-dialog" style="width:70% !important;">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Work Type</h4>
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
                      <tr>
                        <th style="width:1px">#</th>
                        <th style="width:50px" class="text-nowrap nowrap" nowrap>Group Code</th>
                        <th class="text-nowrap nowrap" nowrap>Group Name</th>
                        <th class="text-nowrap nowrap" nowrap>Add User</th>
                        <th class="text-nowrap nowrap" nowrap>Add Date</th>
                        <th class="text-nowrap nowrap" nowrap>Edit User</th>
                        <th class="text-nowrap nowrap" nowrap>Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in respData" style="cursor:pointer" @click="sendData(x)">
                        <td class="text-right">{{idx+1}}.</td>
                        <td class="text-nowrap nowrap" nowrap>{{x.type_code}}</td>
                        <td>{{x.type_name}}</td>
                        <td class="text-nowrap nowrap" nowrap>{{x.add_user}}</td>
                        <td class="text-nowrap nowrap" nowrap>{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                        <td class="text-nowrap nowrap" nowrap>{{x.edit_user}}</td>
                        <td class="text-nowrap nowrap" nowrap>{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
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
        retrieveSearch: {},
        respData: [],
      };
    },
    methods: {
      openModal() {
        (async () => {
          $(this.$refs.WorkTypeModal).modal('show');
          await this.loadData();
        })();
      },
      closeModal() {
        $(this.$refs.WorkTypeModal).modal('hide');
      },
      pageChange(pn) {
        (async () => {
          paging.setCurrentPage(pn);
          await this.loadData();
        })();
      },
      loadData() {
        (async () => {
          let url = `CSM/Center/Worktype_ReadList?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;

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
