<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <div class="row">
              <div class="col-md-2 col-sm-6 col-xs-6">
                <div class="form-group">
                  <label>{{ui.re_search_by || 'Search By'}}</label>
                  <select class="form-control input-sm" v-model="retrieveSearch['field']">
                    <option value="" disabled>-- Please Select --</option>
                    <option v-for="x in fields" :value="x.key">{{ x.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3 col-sm-6 col-xs-6">
                <div class="form-group">
                  <label>{{ui.re_search || 'Search'}}</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model="retrieveSearch['search']" @keyup.enter="retrieveSearchClick()" ref="searchBox" />
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="retrieveSearchClick()"><i class="fa fa-search"></i></button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-3 pull-right">
                <button class="btn btn-sm btn-tumblr pull-right" @click="importFile"><i class="fas fa-file-import"></i> Import Excel</button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table-stick-2 ref="customer_stick" :scale="280">
                  <table class="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th class="tf-3">Code</th>
                        <th class="tf-4">Name</th>
                        <th class="tf-4">Address (1)</th>
                        <th class="tf-4">Address (2)</th>
                        <th class="tf-3-5">Phone</th>
                        <th class="tf-3-5">Fax</th>
                        <th class="tf-3-5">Tax</th>
                        <th class="tf-2-5 text-center">Detail</th>
                        <th class="tf-2-5 text-center">Form</th>
                        <th class="tf-2-5 text-center">Log In</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in data">
                        <td v-text="x.customer_code"></td>
                        <td v-text="x.customer_name"></td>
                        <td v-text="x.address1"></td>
                        <td v-text="x.address2"></td>
                        <td v-text="x.phone"></td>
                        <td v-text="x.fax"></td>
                        <td v-text="x.tax_id"></td>
                        <td align="center"><a :href="openDetail(x)" target="_blank"><i class="fas fa-eye"></i> View</a></td>
                        <td align="center"><a :href="openForm(x)" target="_blank"><i class="fas fa-eye"></i> View</a></td>
                        <td align="center"><a href="#" @click.prevent="openCust(x)" v-if="x.cus_code && x.user_pass"><i class="fas fa-sign-in-alt"></i> Log In</a></td>
                      </tr>
                    </tbody>
                  </table>
                </table-stick-2>
              </div>
            </div>
            <div class="row margin-t-10">
              <div class="col-md-12">
                <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
              </div>
            </div>
          </div>
        </div>
        <input type="file" ref="File" accept=".xls, .xlsx" v-show="false" />
      </template>
    </re-page>
  </div>
</template>

<script>
  import XLSX from 'xlsx'

  let page = {}
  let paging = {}

  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        baseUrl,
        fields: [
          { key: 'customer_name', name: 'Name', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'customer_code', name: 'Code', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'cus_code', name: 'Passcode', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'server_ip', name: 'IP', type: 's', search: true, sort: true, sort_default: true, width: 200 },
        ],
        sort_key: '',
        sort_type: 'desc',
        retrieveSearch: {},
        data: [],
        customer_name: '',
      }
    },
    methods: {
      async retrieveSearchClick() {
        this.sort_key = this.retrieveSearch.field
        this.pageChange(1)
      },
      async loadRetrieve() {
        page.loadingBox.show()

        let field_type = $linq(this.fields).where(x => x.key == this.retrieveSearch.field).select(x => x.type).firstOrDefault() || 's'
        this.$set(this.retrieveSearch, 'field_type', field_type)

        let url = `CSM/Data/CustomerDataReadList?sort=${this.sort_key}&sort_type=${this.sort_type}&skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`
        for (var key in this.retrieveSearch) {
          url += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`
        }

        let rsp = await $xt.getServer(url)
        this.data = rsp.data
        this.total = rsp.total

        paging.setTotalItems(rsp.total)
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1)
        }
        paging.createPagesArray()

        await $xt.sleep(200)
        await this.$refs.customer_stick.createStick()

        page.loadingBox.hide()
      },
      async pageChange(pn) {
        paging.setCurrentPage(pn)
        await this.loadRetrieve()
      },
      openCust(x) {
        //console.log(x.cus_code)
        let cusdata = { passcode: x.cus_code, userpass: x.user_pass }
        localStorage.setItem("X-Login-Customer", JSON.stringify(cusdata))
        window.open(this.baseUrl + `page/authentication/login_cust/`, "_blank")
      },
      openDetail(x) {
        return this.baseUrl + `page/CustomerDataView?customer_code=${x.customer_code}&pre_event=${x.pre_event}`
      },
      openForm(x) {
        this.customer_name = x.customer_name
        return baseUrl + `page/Form?customer_code=${x.customer_code}`
      },
      importFile() {
        $(this.$refs.File).click()
      },
      async fileImport(f) {
        page.loadingBox.show()
        try {
          let act = `CSM/Data/Customer_Import`
          let fd = new FormData()
          fd.append('file', f)

          let rsp = await $xt.postServerForm(act, fd)
          if (!rsp.success) {
            throw new Error(rsp.error)
          }
          else {
            $notify.success('นำเข้าข้อมูลเสร็จสิ้น')
          }
        } catch (ex) {
          $msg.alert("", ex.toString(), "danger")
        }
        finally {
          page.loadingBox.hide()
        }
      },
    },
    mounted() {
      page = this.$refs.page
      page.pageTitle = 'CSM : View Customer Data'
      document.title = page.pageTitle
      window.page = page

      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(500)

      let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {}
      this.$set(this.retrieveSearch, 'field', field_init.key || '')
      this.$set(this.retrieveSearch, 'field_type', field_init.type || 's')

      this.loadRetrieve()

      this.$nextTick(() => {
        $(this.$refs.File).on('click', (e) => {
          e.target.value = null
        })

        $(this.$refs.File).on('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.fileImport(e.target.files[0])
          }
        })
      })
    }
  }
  export default cpn
</script>
