<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <div class="row">
              <div class="col-lg-2">
                <div class="form-group">
                  <label>เลือกปีที่ต้องการค้นหา</label>
                  <select class="form-control input-sm" v-model.trim="retrieveSearch.year" @change="loadRetrieve">
                    <option value="">-- เลือกทั้งหมด --</option>
                    <option v-for="x in getYear()">{{x}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover table-striped">
                    <thead>
                      <tr>
                        <th class="tf-3 text-center">รหัสพนักงาน</th>
                        <th class="tf-6">ชื่อพนักงาน</th>
                        <th class="tf-3 text-center">Wait</th>
                        <th class="tf-3 text-center">In Progress</th>
                        <th class="tf-3 text-center">Done</th>
                        <th class="tf-3 text-center">Complete</th>
                        <th class="tf-3 text-center">Reject</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x, index) in EmpData">
                        <td align="center" class="text-bold">{{x.empcode}}</td>
                        <td><a v-bind:href="queryString(x)" target="_blank">{{x.empname}}</a></td>
                        <td align="center">{{x.wait > 0 ? x.wait : '0'}}</td>
                        <td align="center" class="text-info">{{x.in_progress > 0 ? x.in_progress : '0'}}</td>
                        <td align="center" class="text-warning">{{x.done > 0 ? x.done : '0'}}</td>
                        <td align="center" class="text-success">{{x.complete > 0 ? x.complete : '0'}}</td>
                        <td align="center" class="text-danger">{{x.cancel > 0 ? x.cancel : '0'}}</td>
                      </tr>
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
        auth,
        baseUrl,
        tab1Active: 0,
        retrieveSearch: {
          year: moment(new Date()).format('YYYY')
        },
        form: {},
        ui: window.ui,
        userid: auth.userid,
        empno: auth.empno,
        EmpData: [],
        total: 0,
        fields: [
          { key: 'empname', name: 'Emp Name', type: 's', search: true, sort: true, sort_default: true, width: 200 },
        ],
        sort_key: '',
      };
    },
    methods: {
      async loadRetrieve() {
        let field_type = $linq(this.fields).where(x => x.key == this.retrieveSearch.field).select(x => x.type).firstOrDefault() || 's';
        this.$set(this.retrieveSearch, 'field_type', field_type);

        page.loadingBox.show();
        let url = `CSM/Tools/EmployeeReadList?sort=empcode`;
        for (var key in this.retrieveSearch) {
          url += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`;
        }
        let rsp = await $xt.getServer(url);
        this.EmpData = rsp.data;
        this.total = rsp.total;
        page.loadingBox.hide();
      },
      retrieveSearchClick() {
        this.loadRetrieve();
      },
      setEmpty() {
        this.retrieveSearch['search'] = '';
        this.loadRetrieve();
      },
      queryString(x) {
        return this.baseUrl + `page/Tools/v_csm_emp_d/?empno=${x.empno}&year=${this.retrieveSearch.year || ''}`
      },
      getYear() {
        var years = []
        var dateStart = moment(new Date(2017, 1, 1));
        var dateEnd = moment().add(10, 'y');

        while (dateEnd.diff(dateStart, 'years') >= 0) {
          years.push(dateStart.format('YYYY'));
          dateStart.add(1, 'year');
        }
        return years;
      },
    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = `รายชื่อพนักงาน IT ทั้งหมด`;
      document.title = page.pageTitle;

      this.loadRetrieve();

      let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {};
      this.$set(this.retrieveSearch, 'field', field_init.key || '');
      this.$set(this.retrieveSearch, 'field_type', field_init.type || 's');
    }
  };

  export default cpn;
</script>
