<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="row">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active:tabActive===0}"><a href="#" @click.prevent="changeTab(0, 'Application')">Application ({{retrieveData.length || 0}})</a></li>
                <li :class="{active:tabActive===1}"><a href="#" @click.prevent="changeTab(1, 'Application')">Email Setup</a></li>
              </ul>
              <div class="tab-content">
                <div class="tab-pane" v-bind:class="{active:tabActive===0}">
                  <div class="row">
                    <div class="col-md-3 col-sm-6 col-xs-6">
                      <div class="form-group">
                        <label>Search</label>
                        <div class="input-group">
                          <input type="text" class="form-control input-sm" v-model="retrieveSearch.text" />
                          <span class="input-group-btn"><button class="btn btn-sm bg-navy"><i class="fas fa-search"></i></button></span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-9 col-sm-6 col-xs-6">
                      <div class="pull-right">
                        <div style="margin-top:30px">
                          <button class="btn btn-sm btn-github" @click="addType()"><i class="fas fa-plus-circle"></i> เพิ่มรายการ</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="table-responsive">
                        <table class="table table-bordered table-striped table-hover">
                          <thead>
                            <tr>
                              <th class="tf-2-5 text-center">No.</th>
                              <th class="tf-3-5 text-center">Application Type</th>
                              <th class="tf-6">Application Name</th>
                              <th class="tf-6">Application Path</th>
                              <th class="tf-2-5 text-center">Active</th>
                              <th class="tf-3 text-center">Manage</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(x,index) in retrieveData">
                              <td align="center">{{x.itemno}}.</td>
                              <td>{{x.app_type}}</td>
                              <td>{{x.app_name}}</td>
                              <td>{{x.path_app}}</td>
                              <td class="text-bold" align="center"><i class="fas fa-check" v-if="x.Active == 'Y'"></i></td>
                              <td align="center">
                                <a href="#" @click.prevent="editType(x)"><v-icon name="edit" style="width:22px;"></v-icon></a>&nbsp;
                                <a href="#" @click.prevent=""><v-icon name="trash-2" style="width:22px;"></v-icon></a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" v-bind:class="{active:tabActive===1}">
                  <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                          <li :class="{active:detailActive===0}"><a href="#" @click.prevent="changeTab(0, 'Email')">SMTP</a></li>
                          <li :class="{active:detailActive===1}"><a href="#" @click.prevent="changeTab(1, 'Email')">Email Template</a></li>
                        </ul>
                        <div class="tab-content">
                          <div class="tab-pane" v-bind:class="{active:detailActive===0}">
                            <div class="row">
                              <div class="col-md-12">
                                <div class="callout callout-info">
                                  การเปลี่ยนแปลงข้อมูลนี้จะถูกนำไปบันทึกแทนค่าใน Company Setup โปรดระมัดระวังในการตั้งค่านี้
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>SMTP Server</label>
                                  <input type="text" class="form-control input-sm" v-model.trim="emailData['email_smtp']" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>Port</label>
                                  <input type="text" class="form-control input-sm" v-model.trim="emailData['email_port']" />
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>Email Address</label>
                                  <input type="text" class="form-control input-sm" placeholder="mail@yourmail.com" v-model.trim="emailData['email']" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>Email Password</label>
                                  <input type="text" class="form-control input-sm" v-model.trim="emailData['passemail']" />
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>TLS/SSL</label>
                                  <select class="form-control input-sm" v-model.trim="emailData['email_smtp_tls']">
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12 col-md-12">
                                <div class="form-group">
                                  <button class="btn btn-sm bg-navy"><i class="fas fa-save"></i> บันทึกข้อมูล</button>
                                  <button class="btn btn-sm btn-default"><i class="fas fa-send"></i> Test Sending Email</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="tab-pane" v-bind:class="{active:detailActive===1}">
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="form-group">
                                  <label class="text-danger">Message Subject</label>
                                  <input type="text" class="form-control input-sm" v-model.trim="formEmailTmp['message_subject']">
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="form-group">
                                  <label>Message Body</label>
                                  <textarea id="text_area" class="form-control input-sm"></textarea>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12 col-md-12">
                                <div class="form-group">
                                  <button class="btn btn-sm bg-navy"><i class="fas fa-save"></i> บันทึกข้อมูล</button>
                                  <button class="btn btn-sm btn-default"><i class="fas fa-file"></i> Preview</button>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <h4>Dictionary</h4>
                                <table class="table table-bordered table-striped">
                                  <tbody>
                                    <tr v-for="x in dic">
                                      <td class="text-nowrap nowrap" nowrap style="width:1px">{{'{' + x.code + '}'}}</td>
                                      <td>{{x.desc}}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>
    <!-- Modal : Application Type -->
    <div class="modal fade" ref="addTypeModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{isEdit ? 'แก้ไข Application' : 'เพิ่ม Application'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="text-danger">Application</label>
                  <input type="text" class="form-control input-sm" v-model.trim="formData['app_type']" v-bind:disabled="isEdit">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="text-danger">Application Name</label>
                  <input type="text" class="form-control input-sm" v-model.trim="formData['app_name']">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label class="text-danger">Application Path</label>
                  <input type="text" class="form-control input-sm" v-model.trim="formData['path_app']">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Active</label>
                  <input type="checkbox" v-model="formData['Active']" true-value="Y" false-value="N" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-success" v-on:click="saveType()">บันทึกข้อมูล</button>
            <button type="button" class="btn btn-sm btn-default" data-dismiss="modal">ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  let page = {}
  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        baseUrl,
        xt: $xt,
        tabActive: 0,
        detailActive: 0,
        retrieveSearch: {},
        retrieveData: [],
        emailData: {},
        formEmailTmp: {},
        formData: {},
        dic: [],
        isEdit: false,
      }
    },
    methods: {
      changeTab(t, keyword) {
        switch (keyword) {
          case 'Application':
            this.tabActive = t
            switch (this.tabActive) {
              case 0:
                this.readApplication()
                break
              case 1:
                this.changeTab(0, 'Email')
                break
            }
            break
          case 'Email':
            this.detailActive = t
            switch (this.detailActive) {
              case 0:
                this.readEmail()
                break
              case 1:
                this.readTemplateEmail()
                break
            }
            break
        }
      },
      async readApplication() {
        let act = `CSM/Config/ApplicationTypeReadList`
        let rsp = await $xt.getServer(act)
        this.$set(this, 'retrieveData', rsp.data)
      },
      async readEmail() {
        let act = `CSM/Config/ReadSmtp`
        let rsp = await $xt.getServer(act)
        this.$set(this, 'emailData', rsp.data || { email_smtp_tls: 'Y' })
      },
      async readTemplateEmail() {
        let act = `CSM/Config/TemplateEmailRead`
        let rsp = await $xt.getServer(act)
        if (rsp.data != null) {
          this.$set(this, 'formEmailTmp', rsp.data)
          if (tinymce && tinymce.get('text_area')) {
            tinymce.get('text_area').setContent((rsp.data || {}).message_body || '')
            tinymce.get('text_area').undoManager.clear()
          }
        }
      },
      resetFormEmailTmp() {
        if (tinymce && tinymce.get('text_area')) {
          tinymce.get('text_area').setContent('')
          tinymce.get('text_area').undoManager.clear()
        }
      },
      addType() {
        $(this.$refs.addTypeModal).modal('show')
        this.isEdit = false
        this.formData = {
          Active: 'Y'
        }
      },
      editType(x) {
        $(this.$refs.addTypeModal).modal('show')
        this.isEdit = true
        this.$set(this, 'formData', JSON.parse(JSON.stringify(x)))
      },
      async saveType() {
        try {

          let has_error = false
          let error_message = '<ul>'

          if ($xt.isEmpty(this.formData.app_type)) {
            error_message += '<li>Application Type</li>'
            has_error = true
          }

          if ($xt.isEmpty(this.formData.app_name)) {
            error_message += '<li>Application Name</li>'
            has_error = true
          }

          error_message += '</ul>'
          if (has_error) {
            $msg.alert(`These fields are required`, error_message, `warning`)
            return
          }

          let f = {
            form: this.formData,
          }
          let act = `CSM/Config/ApplicationTypeCreateAndUpdate`
          let rsp = await $xt.postServerJson(act, f)
          if (!rsp.success) {
            throw rsp.error
          }
          $(this.$refs.addTypeModal).modal('hide')
          this.readApplication()
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`)
        } finally {

        }
      },
    },
    mounted() {
      page = this.$refs.page
      page.pageTitle = 'CSM : View Master'
      document.title = page.pageTitle

      this.changeTab(0, 'Application')
      this.resetFormEmailTmp()

      tinymce.init({
        selector: '#text_area',
        theme: 'modern',
        height: 300,
        plugins: [
          'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
          'searchreplace wordcount visualblocks visualchars code  insertdatetime media nonbreaking',
          'save table contextmenu directionality emoticons template paste textcolor'
        ],
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image |  forecolor backcolor'
      })

      let dic = this.dic
      dic.push({ code: 'customer_name', desc: 'ชื่อลูกค้า' })
      dic.push({ code: 'job_no', desc: 'CRM No.' })
      dic.push({ code: 'message_date', desc: 'วันที่ข้อความ' })
      dic.push({ code: 'subject', desc: 'Subject' })
      dic = $linq(dic).orderBy(x => x.code).toArray()
    }
  }
  export default cpn
</script>
