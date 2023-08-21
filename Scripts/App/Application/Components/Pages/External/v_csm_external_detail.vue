<template>
  <div>
    <customer-page ref="page">
      <template slot="body">
        <div class="row">
          <!--Left Side-->
          <div class="col-lg-8">
            <!-- Task Details -->
            <div class="row">
              <div class="col-md-12">
                <div class="box box-info">
                  <div class="box-body with-border">
                    <!-- Subject -->
                    <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-lg-offset-1">
                        <div class="form-group">
                          <label><i class="fa fa-folder"></i> Subject</label>
                          <input type="text" class="form-control" v-model.trim="formData['subject']" />
                        </div>
                      </div>
                    </div>
                    <!-- Description -->
                    <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-lg-offset-1">
                        <div class="form-group">
                          <label><i class="fa fa-pencil-square-o"></i>  Description</label>
                          <input class="form-control" style="height:auto;min-height:50px;white-space:pre-wrap;" v-model.trim="formData['detail']" />
                        </div>
                      </div>
                    </div>
                    <!-- Service Type -->
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-3 col-lg-offset-1">
                        <div class="form-group">
                          <label><i class="fa fa-laptop"></i> Service Type</label>
                          <input class="form-control" v-model.trim="formData['serv_name']" readonly>
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-3">
                        <div class="form-group">
                          <label><i class="fa fa-television"></i> Platform</label>
                          <input class="form-control" v-model.trim="formData['platform']" readonly>
                        </div>
                      </div>
                    </div>
                    <!-- Module -->
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-3 col-lg-offset-1">
                        <div class="form-group">
                          <label><i class="fas fa-paste"></i> Module</label>
                          <input class="form-control" v-model.trim="formData['module']" readonly>
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-3">
                        <div class="form-group">
                          <label><i class="fa fa-user"></i> Req. Type</label>
                          <input class="form-control" v-model.trim="formData['req_des']" readonly>
                        </div>
                      </div>
                    </div>
                    <!-- Date -->
                    <div class="row">
                      <div class="col-lg-3 col-md-2 col-sm-2 col-lg-offset-1">
                        <label>  ติดต่อกลับ</label>
                        <div class="input-group">
                          <label class="form-control">{{formData['response_date']|date('DD/MM/YYYY')}} </label>
                          <span class="input-group-addon" style="border-color:#d0d0d0; background-color: #d0d0d0;"><i class="fa fa-calendar"></i></span>
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-2 col-sm-2">
                        <div class="form-group">
                          <label>วันที่ครบกำหนด</label>
                          <div class="input-group">
                            <label class="form-control">{{formData['due_date']|date('DD/MM/YYYY')}} </label>
                            <span class="input-group-addon" style="border-color:#d0d0d0; background-color: #d0d0d0;"><i class="fa fa-calendar-minus-o" style="border-color:gray; "></i></span>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-2 col-sm-2">
                        <div class="form-group">
                          <label>วันที่แล้วเสร็จ</label>
                          <div class="input-group">
                            <label class="form-control">{{formData['complete_date']|date('DD/MM/YYYY')}} </label>
                            <span class="input-group-addon" style="border-color:#d0d0d0; background-color: #d0d0d0;"><i class="fa fa-calendar-check-o" style="border-color:gray;"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Operator -->
                    <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-3 col-lg-offset-1">
                        <div class="form-group">
                          <label><i class="fas fa-user-cog"></i> Operator</label>
                          <input type="text" class="form-control" v-model.trim="formData['operator_name']" readonly />
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-3">
                        <div class="form-group">
                          <label><i class="fas fa-user-tie"></i> Contract User</label>
                          <input type="text" class="form-control" v-model.trim="formData['contract_user']" readonly />
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-3">
                        <div class="form-group">
                          <label><i class="fa fa-phone-volume"></i> Phone</label>
                          <input type="text" class="form-control" v-model.trim="formData['phone']" readonly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Attach File-->
            <div class="row">
              <div class="col-md-12">
                <div class="box box-info">
                  <div class="box-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th style="width:1px;">No.</th>
                            <th style="width:5px;">#</th>
                            <th style="width:300px;">File</th>
                            <th>Description</th>
                            <th>Add Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x,idx in attachFile">
                            <td>{{idx+1}}.</td>
                            <td align="center"><i class="fas fa-times" v-if="x.add_user===auth.userid"></i></a></td>
                            <td align="center">
                              <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename))">
                                <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                              </p>
                              <p v-if="!['jpg','jpeg','png'].includes(getFileExt(x.filename))">
                                <i class="fas fa-file-word fa-5x" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-excel fa-5x" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-powerpoint fa-5x" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-pdf fa-5x" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file fa-5x" v-else=""></i>
                                <br />
                                <a :href="createFilePath(x.filepath)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                              </p>
                            </td>
                            <td><textarea class="form-control" rows="5" v-model.trim="x.description" readonly></textarea></td>
                            <td>{{x.add_dt | date('DD/MM/YYYY HH:mm')}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--Right Side-->
          <div class="col-lg-4">
            <!--Comment Input-->
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="box box-success">
                  <div class="col-md-9 col-sm-12 col-xs-12">
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="info-box-content">
                          <label style="color:white;">.</label>
                          <span class="info-box-text"><h4>กล่องแสดงความคิดเห็น</h4></span>
                        </div>
                      </div>
                      <div class="col-lg-12" style="position:absolute;top:10px; ">
                        <span class="info-box-icon bg-green" style="border-radius:20px; height:80px; width:80px; "><i class="fas fa-comment-dots"></i></span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <label style="line-height:20px;"></label>
                    </div>
                  </div>
                  <div class="box-body with-border">
                    <div class="row">
                      <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="cardchat form-group bg-gray">
                          <textarea class="form-control" v-model.trim="commentText" placeholder="พิมพ์ข้อความ.." style="white-space:pre-wrap;height:auto; "></textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-success pull-right" @click.prevent="createComment()">
                          <i class="fa fa-pencil-square-o"></i> ส่งข้อความ
                        </button>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
            <!--Comment Customer-->
            <div class="row" v-for="x,idx in commentData">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="box box-success">
                  <div class="box-body with-border">
                    <div class="row chat">
                      <div class="col-lg-6 col-md-6 col-sm-6 ">
                        {{idx+1}}. <b>{{xt.isEmpty(x.customer_code) ? x.req_name : x.customer_name}}</b>&nbsp;
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6">
                        <b class="pull-right ">{{x.add_dt|date('DD/MM/YYYY HH:mm:ss')}}&nbsp;<i class="far fa-clock"></i></b>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="cardchat bg-gray">
                          <span class="chatbody" style="font-size:14px;">{{x.description}}</span>
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
    </customer-page>
  </div>
</template>
<script type="text/javascript">

  let page = {};
  let cpn = {
    data() {
      return {
        auth,
        baseUrl,
        baseRoute,
        queryString,
        ui: window.ui,
        xt: $xt,
        formData: {},
        attachFile: [],
        commentData: [],
        commentText: "",
        platformCodeData,
      };
    },
    methods: {
      async loadData() {
        let url = `CSM/CustomerData/ExternalRead?job_no=${this.queryString.job_no}&itemno=${this.queryString.itemno}`;
        let resp = await $xt.getCustomerServer(url);
        this.formData = resp.detail;
        this.attachFile = resp.attach;
        this.commentData = resp.comment;
        this.$set(this.formData, "platform", $linq(this.platformCodeData).where(x => x.id == this.formData.platform).select(x => x.name).firstOrDefault());

        page.pageTitle = `รายละเอียดเอกสารเลขที่ ${this.formData.job_no}`;
        document.title = page.pageTitle;

      },
      createFilePath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
      getFileExt(f) {
        return f.split('.').pop().toLowerCase();
      },
      async createComment() {
        try {
          let comment = {
            job_no: this.formData.job_no,
            ref_itemno: this.formData.itemno,
            itemno: null,
            description: this.commentText || '',
          };
          let f = {
            comment: comment
          };
          let url = `CSM/CustomerData/ExternalCommentCreate`;

          let rsp = await $xt.postCustomerJson(url, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          this.commentText = "";
          await this.loadData();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {

        }

      },

    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'รายละเอียดเอกสาร';
      document.title = page.pageTitle;

      this.loadData();

    }
  };
  export default cpn;
</script>
<style scoped>
  .form-control {
    border: 0;
    background-color: #f7f7f7;
  }

  .input {
    border: 0;
  }
</style>
