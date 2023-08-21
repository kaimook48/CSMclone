<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-solid">
          <div class="box-body">
            <!-- Search Panel -->
            <div class="row">
              <div class="col-lg-2 col-md-3">
                <div class="form-group">
                  <label>Search By</label>
                  <select class="form-control input-sm" v-model="retrieveSearch['field']">
                    <option v-for="x in fields" :value="x.key">{{ x.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-2 col-md-3">
                <div class="form-group">
                  <label>Job Status</label>
                  <select class="form-control input-sm" v-model="retrieveSearch['job_status']" @change="loadData()">
                    <option v-for="x in status" :value="x.value">{{ x.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-4 col-md-3">
                <div class="form-group">
                  <label>Search</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model="retrieveSearch['text']" @keyup.enter="loadData" />
                    <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="loadData"><i class="fa fa-search"></i></button></span>
                  </div>
                </div>
              </div>
            </div>
            <!-- List Data -->
            <div class="row">
              <div class="col-md-12">
                <table-stick-2 ref="csm_stick" :scale="280">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th style="width:130px; text-align:center">CRM No.</th>
                        <th style="width:100px; text-align:center">Date</th>
                        <th style="width:180px; text-align:center">Subject</th>
                        <th style="width:120px; text-align:center">Project</th>
                        <th style="width:120px; text-align:center">Req. By</th>
                        <th style="width:120px; text-align:center">Contact By</th>
                        <th style="width:120px; text-align:center">Tel</th>
                        <th style="width:120px; text-align:center">Job Priority</th>
                        <th style="width:120px; text-align:center">Job Status</th>
                        <th style="width:120px; text-align:center">Response Date</th>
                        <th style="width:120px; text-align:center">Job Due Date</th>
                        <th style="width:120px; text-align:center">Complete Date</th>
                        <th style="width:120px; text-align:center">Over Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in datalist">
                        <td align="center" style="width:130px;white-space:nowrap"><a href="#" @click.prevent="openModal(x)">{{x.job_no}}</a></td>
                        <td align="center" style="width:100px;">{{x.job_date | date()}}</td>
                        <td style="width:180px;">{{x.subject}}</td>
                        <td style="width:120px;">{{x.project}}</td>
                        <td style="width:120px;">{{x.request_empno_name}}</td>
                        <td style="width:120px;">{{x.contract_user}}</td>
                        <td align="center" style="width:120px;">{{x.phone}}</td>
                        <td align="center"><p v-bind:class="{'text-warning': x.job_priority == '3', 'text-danger': x.job_priority == '4'}">{{priorityName(x.job_priority)}}</p></td>
                        <td align="center"><p v-bind:class="statusClass('text-', x.job_status)"><b>{{statusName(x.job_status)}}</b></p></td>
                        <td align="center" style="width:120px;">{{x.response_date | date()}}</td>
                        <td align="center" style="width:120px;">{{x.job_due_date | date()}}</td>
                        <td align="center" style="width:120px;">{{(x.job_status == "N" ? x.cancel_dt : x.job_complete_date) | date()}}</td>
                        <td align="center" style="width:120px;"><p v-bind:class="{'text-danger':x.is_overdue}"><b>{{x.overdue}}</b></p></td>
                      </tr>
                    </tbody>
                  </table>
                </table-stick-2>
              </div>
            </div>
            <!-- Pagination -->
            <div class="row margin-t-10">
              <div class="col-md-12">
                <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page)"></pagination>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>

    <!-- Modal : Tools -->
    <modal ref="toolModal">
      <template slot="header">
        <h4><i class="fas fa-user-edit"></i> Edit Document : CSM No. {{formData['job_no']}}</h4>
      </template>
      <template slot="body">
        <h4 class="text-blue">Document : Header</h4>
        <div class="row">
          <div class="col-md-2 col-sm-6 col-xs-6">
            <div class="form-group">
              <label>Document No.</label>
              <input type="text" class="form-control input-sm text-bold pointer" @click="openReq()" v-model="formData['job_no']" readonly />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>Job Status</label>
              <select class="form-control input-sm" v-model="formData['job_status']" @change="changeCompleteDate(formData, 'job_status', 'job_complete_date')">
                <option v-for="x in statusCode" v-bind:value="x.id">{{x.name}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>Due Date</label>
              <datepicker input-class="form-control input-sm" v-model.trim="formData['job_due_date']"></datepicker>
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>Job Complete Date</label>
              <datepicker input-class="form-control input-sm" v-model.trim="formData['job_complete_date']"></datepicker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-2">
            <div class="form-group">
              <label>Responsible Person (ผู้รับผิดชอบหลัก)</label>
              <span class="input-group">
                <input type="text" class="form-control input-sm" @click="openEmployeeModal('req')" v-model="formData['request_empno']" readonly />
                <span class="input-group-btn">
                  <button class="btn btn-sm bg-navy" @click="openEmployeeModal('req')"><i class="fa fa-search"></i></button>
                </span>
              </span>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <div class="form-group">
              <label>&nbsp;</label>
              <input type="text" class="form-control input-sm" v-model="formData['request_empno_name']" readonly />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label>Assign</label>
              <span class="input-group">
                <input type="text" class="form-control input-sm" @click="openEmployeeModal('assign')" v-model="formData['assign_empno']" readonly />
                <span class="input-group-btn">
                  <button class="btn btn-sm bg-navy" @click="openEmployeeModal('assign')"><i class="fa fa-search"></i></button>
                </span>
              </span>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-xs-6">
            <div class="form-group">
              <label>&nbsp;</label>
              <input type="text" class="form-control input-sm" v-model="formData['assign_empno_name']" disabled />
            </div>
          </div>
        </div>
        <hr />
        <h4 class="text-blue">Document : Detail</h4>
        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th class="tf-2-5 text-center">Item No.</th>
                    <th class="tf-3">Module</th>
                    <th class="tf-4">Subject</th>
                    <th class="tf-3-5">Type</th>
                    <th class="tf-3-5">Req. Type</th>
                    <th class="tf-3-5">Status</th>
                    <th class="tf-3-5">Response Date</th>
                    <th class="tf-3-5">Due Date</th>
                    <th class="tf-3-5">Complete Date</th>
                    <th class="tf-2-5 text-center">Revision</th>
                    <th class="tf-3 text-center">Revision No.</th>
                    <th class="tf-3 text-center">Wrong Program</th>
                    <th class="tf-3 text-center">Approve</th>
                    <th class="tf-3 text-center">Form Status</th>
                    <th class="tf-3 text-center">Tester Appr</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(x,idx) in detailData" v-bind:class="statusClass('',x.status)">
                    <td align="center" class="text-bold">{{x.itemno}}.</td>
                    <td>
                      <select class="form-control input-sm" v-model="x.module">
                        <option v-for="m in moduleForMango" v-bind:value="m">{{m}}</option>
                      </select>
                    </td>
                    <td><input type="text" class="form-control input-sm" v-model.trim="x.subject" /></td>
                    <td width="100">
                      <select class="form-control input-sm" v-model="x.item_type">
                        <option v-for="item in serviceCodeData" v-bind:value="item.serv_code">{{item.serv_name}}</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control input-sm" v-model="x.req_type">
                        <option v-for="req in requestCodeData" v-bind:value="req.req_code">{{req.req_des}}</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control input-sm" v-model="x.status" @change="changeCompleteDate(x, 'status', 'complete_date')">
                        <option v-for="status in statusCodeData" v-bind:value="status.id">{{status.name}}</option>
                      </select>
                    </td>
                    <td><datepicker input-class="form-control input-sm" v-model.trim="x.response_date"></datepicker></td>
                    <td><datepicker input-class="form-control input-sm" v-model.trim="x.due_date"></datepicker></td>
                    <td><datepicker input-class="form-control input-sm" v-model.trim="x.complete_date"></datepicker></td>
                    <td align="center"><input type="checkbox" v-model="x.revision_is_import" true-value="Y" false-value="N" /></td>
                    <td><input type="text" class="form-control input-sm" v-model.trim="x.revision" :disabled="x.revision_is_import != 'Y'" /></td>
                    <td align="center"><input type="checkbox" v-model="x.wrong_program" true-value="Y" false-value="N" /></td>
                    <td>
                      <select class="form-control input-sm" v-model="x.approve_status">
                        <option value="N">Waiting</option>
                        <option value="C">Reject</option>
                        <option value="Y">Approve</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control input-sm" v-model="x.formcode_status">
                        <option value="N">None</option>
                        <option value="Y">Sign</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-control input-sm" v-model="x.tester_approve">
                        <option value="N">None</option>
                        <option value="Y">Approved</option>
                        <option value="R">Reject</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <a class="btn btn-sm btn-warning pull-left" @click="confirmResetApprove(formData['job_no'], 'reset')"><i class="fa fa-check"></i> ล้างสถานะการอนุมัติ</a>
        <a class="btn btn-sm btn-tumblr pull-left" @click="confirmResetApprove(formData['job_no'], 'active')"><i class="fa fa-refresh"></i> อนุมัติเอกสาร (Approve)</a>
        <a class="btn btn-sm btn-tumblr pull-left" @click="TesterApprove()"><i class="fab fa-accessible-icon"></i> อนุมัติเอกสาร (Tester)</a>
        <a class="btn btn-sm bg-olive pull-left" @click="All_Complete()"><i class="fas fa-check-double"></i> ปิดงานทั้งหมด</a>
        <a class="btn btn-sm btn-danger pull-left" @click="Delete(formData['job_no'])"><i class="fa fa-trash"></i> ลบเอกสาร</a>
        <a class="btn btn-sm bg-olive" @click="update()"><i class="fa fa-edit"></i> บันทึกข้อมูล</a>
      </template>
    </modal>
    <!-- Modal : Center -->
    <vue-employee-list ref="ct_emp" @send-data="sendComponent($event, 'employee')"></vue-employee-list>

  </div>
</template>

<script>
  let page = {}
  let paging = {}
  let cpn = {
    data() {
      return {
        auth,
        tab1Active: 0,
        search: {},
        form: {},
        baseUrl,
        ui: window.ui,
        fields: [
          { key: 'job_no', name: 'CSM No.', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'pre_des', name: 'Project', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'dpt_no_name', name: 'Department', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'request_empno_name', name: 'Req. By', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'contract_user', name: 'Contact By', type: 's', search: true, sort: true, sort_default: true, width: 200 },
        ],
        status: [
          { key: 'job_status', name: 'All Item', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: '' },
          { key: 'job_status', name: 'None', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'W' },
          { key: 'job_status', name: 'In Progress', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'I' },
          { key: 'job_status', name: 'Done', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'D' },
          { key: 'job_status', name: 'Complete', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'C' },
        ],
        retrieveSearch: {},
        datalist: [],
        formData: {},
        detailData: [],
        isLoading: false,
        moduleForMango: moduleCodeData,
        platformCodeData,
        statusCode,
        statusCodeData,
        empType: "",
      }
    },
    methods: {
      async loadData() {
        this.isLoading = true
        let act = `CSM/Data/ReadDocument?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}&tabSelected=3&subTabSelected=0`
        for (var key in this.retrieveSearch) {
          act += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`
        }
        let rsp = await $xt.getServer(act)
        this.datalist = rsp.data.detail
        paging.setTotalItems(rsp.data.total)
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1)
        }
        paging.createPagesArray()
        this.isLoading = false
      },
      pageChange(pn) {
        paging.setCurrentPage(pn)
        this.loadData()
      },
      openModal(x) {
        this.$refs.toolModal.openModal()
        var job_no = this.$set(this.formData, 'job_no', x.job_no)
        this.$set(this.formData, 'job_status', x.job_status)
        this.loadDataModal(job_no)
      },
      openEmployeeModal(type) {
        this.empType = type || ""
        this.$refs.ct_emp.openModal()
      },
      async sendComponent(e, type) {
        switch (this.empType) {
          case "req":
            this.$set(this.formData, 'request_empno', e.empno)
            this.$set(this.formData, 'request_empno_name', e.empfullname)
            break
          case "assign":
            this.$set(this.formData, 'assign_empno', e.empno)
            this.$set(this.formData, 'assign_empno_name', e.empfullname)
            break
        }
      },
      async loadDataModal(job_no) {
        let url = `CSM/Data/CSM_Read?job_no=${encodeURIComponent(job_no)}`
        let resp = await $xt.getServer(url)
        this.$set(this, 'formData', resp.data.form)
        this.$set(this, 'detailData', resp.data.detail)
      },
      async update() {
        try {
          let f = {
            form: this.formData,
            detail: this.detailData,
          }
          let act = `CSM/Tools/csr_update_db`
          let rsp = await $xt.postServerJson(act, f)
          if (!rsp.success) {
            throw rsp.error
          }
          this.loadDataModal(this.formData['job_no'])
          this.loadData()
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {

        }
      },
      async confirmResetApprove(job_no, type) {
        if (!await $msg.confirm(`การกระทำนี้ไม่สามารถกู้คืนได้ โปรดยืนยัน`)) {
          return
        }
        switch (type) {
          case "reset":
            this.deleteApprove(job_no)
            break
          case "active":
            this.activeApprove(job_no)
            break
        }
      },
      async TesterApprove() {
        try {
          let f = {
            detail: this.detailData,
          }
          let act = `CSM/Tools/CSM_TesterApprove`
          let rsp = await $xt.postServerJson(act, f)
          if (!rsp.success) {
            throw rsp.error
          }
          this.loadDataModal(this.formData['job_no'])
          this.loadData()
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {

        }
      },
      async All_Complete() {
        try {
          let f = {
            form: this.formData,
            detail: this.detailData,
          }
          let act = `CSM/Tools/CSM_AllComplete`
          let rsp = await $xt.postServerJson(act, f)
          if (!rsp.success) {
            throw rsp.error
          }
          this.loadDataModal(this.formData['job_no'])
          this.loadData()
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {
        }
      },
      async activeApprove(job_no) {
        try {
          let act = `CSM/Tools/csr_active_approve?job_no=${job_no}`
          let rsp = await $xt.postServerJson(act, null)
          if (!rsp.success) {
            throw rsp.error
          }
          this.loadDataModal(this.formData['job_no'])
          this.loadData()
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {

        }
      },
      async deleteApprove(job_no) {
        try {
          let act = `CSM/Tools/csr_delete_approve?job_no=${job_no}`
          let rsp = await $xt.postServerJson(act, null)
          if (!rsp.success) {
            throw rsp.error
          }
          this.loadDataModal(this.formData['job_no'])
          this.loadData()
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {

        }
      },
      async Delete(job_no) {
        if (!await $msg.confirm(`การกระทำนี้ไม่สามารถกู้คืนได้ โปรดยืนยันการลบข้อมูล`)) {
          return
        }

        try {
          let act = `CSM/Tools/csr_delete_db?job_no=${job_no}`
          let rsp = await $xt.postServerJson(act, null)
          if (!rsp.success) {
            throw rsp.error
          }
          this.loadData()
          this.$refs.toolModal.closeModal()
          $notify.success(this.ui.alert_save_success)
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {
        }
      },
      changeCompleteDate(parent, field, update) {
        this.$set(parent, update, parent[field] == 'Y' ? new Date() : null)
      },
      priorityName(code) {
        return $linq(this.priorityCodeData).where(x => x.prioity_code == code).select(x => x.prioity_des).firstOrDefault() || ''
      },
      priorityStatusClass(code) {
        /* Variable : prioity_code, prioity_des, priority_status = 1 (ปกติ) , 2 (สำคัญ) , 3 (สำคัญมาก), active */
        var status = $linq(this.priorityCodeData).where(w => w.prioity_code == code).select(x => x.priority_status).firstOrDefault() || ""
        return status == "3" ? "text-danger" : status == "2" ? "text-warning" : "text-info"
      },
      statusClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : status == 'I' ? prefix + 'info' : status == 'N' ? prefix + 'danger' : status == 'H' ? prefix + 'warning' : ''
      },
      statusName(code) {
        return $linq(this.statusCode).where(x => x.id == code).select(x => x.name).firstOrDefault() || ''
      },
      openReq() {
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${this.formData['job_no']}`, "_blank")
      },
    },
    computed: {
      serviceCodeData() { return store.state.serviceCodeData },
      configData() { return store.state.configData },
    },
    async mounted() {
      page = this.$refs.page
      page.pageTitle = `CSM : Admin Tools`
      document.title = page.pageTitle
      window.page = page

      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(100)

      let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {}
      this.$set(this.retrieveSearch, 'field', field_init.key || '')
      this.$set(this.retrieveSearch, 'field_type', field_init.type || 's')
      this.$set(this.retrieveSearch, 'job_status', this.status[0].value || '')

      this.loadData()

      this.$refs.toolModal.setSize('modal-xl-2')
    }
  }

  export default cpn
</script>
