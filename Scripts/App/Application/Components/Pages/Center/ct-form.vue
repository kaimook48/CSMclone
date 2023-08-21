<template>
  <div>
    <div class="modal fade" ref="FormModal">
      <div class="modal-dialog" style="width:70% !important;">
        <div class="modal-content">
          <div class="modal-header">
            <h4>ฟอร์มเอกสาร</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-3 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>ค้นหา</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="retrieveSearch['text']" @keyup.enter="onSearch" />
                    <span class="input-group-btn"><a class="btn btn-sm btn-default" @click="onSearch"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="typecode==='004'">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <p class="text-success">*** จากเอกสารสัญญาสำหรับลูกค้าเช่า ข้อ 2.5 ลูกค้าสามารถแก้ไขแบบฟอร์มได้ 4 ขั้นตอนการทำงานตามที่กำหนด และแก้ไขได้เฉพาะรูปแบบ A4 เท่านั้น หากอยู่นอกเหนือจากที่ระบุ จะมีค่าใช้จ่ายทุกกรณี</p>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr class="text-center">
                        <th class="tf-3">Form Code</th>
                        <th>Form Name</th>
                        <th>Form Name (ENG)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in displayData" style="cursor:pointer" @click="sendData(x)">
                        <td class="text-bold">{{x.formcode}}</td>
                        <td>{{x.formname}}</td>
                        <td>{{x.formname_e}}</td>
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
      'id',
      'customer_code',
      'pre_event',
      'formcode',
      'item_type',
      'package_code',
    ],
    data() {
      return {
        baseUrl,
        baseRoute,
        queryString,
        ui,
        retrieveSearch: {},
        displayData: [],
        typecode: "",
      };
    },
    methods: {
      async openModal() {
        $(this.$refs.FormModal).modal('show');
        await this.loadTypeCode();
        await this.loadData();
      },
      closeModal() {
        $(this.$refs.FormModal).modal('hide');
      },
      pageChange(pn) {
        paging.setCurrentPage(pn);
        this.loadData();
      },
      onSearch() {
        this.pageChange(1);
      },
      async loadTypeCode() {
        let url = `CSM/Center/GetTypeCode?pre_event=${this.pre_event || ''}`;
        let resp = await $xt.getServer(url);
        this.$set(this, "typecode", resp.typecode || "");
      },
      async loadData() {
        let url = `CSM/Center/FormReadList?pre_event=${this.pre_event || ''}&package_code=${this.package_code|| ''}&skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;
        for (var key in this.retrieveSearch) {
          url += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;
        }

        let resp = await $xt.getServer(url);
        this.displayData = resp.data;

        paging.setTotalItems(resp.total);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
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

      this.$set(this.retrieveSearch, "text", "");
    }
  };
</script>
