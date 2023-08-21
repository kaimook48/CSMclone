<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="row">
          <div class="col-lg-12">
            <div class="box box-default box-solid">
              <div class="box-header with-border">
                <h4 class="box-title text-center">{{header.subject}}</h4>
              </div>
              <div class="box-body">
                <div class="table-responsive">
                  <table style="width:100%">
                    <tbody>
                      <template v-for="x,idx in detail">
                        <tr>
                          <td style="width:100%">
                            <div class="col-lg-12">
                              <h5 class="text-navy">{{x.sort_itemno}}<span v-if="x.sort_itemno">.</span> {{x.subject}}</h5>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="width:100%">
                            <a :href="createPath(x.pic_path)" target="_blank"><img :src="createPath(x.pic_path)" class="img-responsive" width="550" height="450" v-if="x.pic_path" /></a>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>
  </div>
</template>
<script>
  let page = {};
  let cpn = {
    data() {
      return {
        auth: window.auth,
        queryString,
        header: {},
        detail: [],
      }
    },
    methods: {
      async readDocument() {
        let act = `CSM/Manual/FAQ_DocRead?docno=${this.queryString.docno || ''}`;
        let rsp = await $xt.getServer(act);
        this.header = rsp.header;
        this.detail = rsp.detail;

        document.title = this.header.subject;
      },
      createPath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'คำถามที่พบบ่อย (FAQ)';

      if (!$xt.isEmpty(this.queryString.docno)) {
        this.readDocument();
      }

    }
  }

  export default cpn;
</script>
<style scoped>

  thead > tr > th {
    background-color: #eeeeee;
    color: black;
    font-weight: 500 !important;
    vertical-align: middle !important;
  }

  .table-bordered {
    border: 1px solid black !important;
  }

    .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
      border: 1px solid black !important;
    }


  .isDisabled {
    color: currentColor;
    cursor: not-allowed;
    opacity: 0.5;
    text-decoration: none;
    pointer-events: none;
  }
</style>
