<template>
  <div>
    <customer-page ref="page" id="toppage">
      <template slot="body">
        <div class="row">
          <!-- Comments Customer -->
          <div class="col-lg-12">
            <div class="col-lg-8 col-md-8 col-sm-8">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="info-box" @click.prevent="onItem('Y')" style="cursor:pointer;border-radius:13px">
                  <span class="info-box-icon bg-green" style="border-radius:13px"><i class="fa fa-comment"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">&nbsp;</span>
                    <span class="info-box-number" style="font-size:25px">&nbsp;Comment </span>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="box box-body " style="border-radius:13px">
                  <div class="content ">
                    <div class="row">
                      <div class="media">
                        <div class="col-lg-12 col-md-12 col-sm-12">
                          <!--comment-->
                          <div class="form-group">
                            <label>Comment</label>
                            <div class="media-body">
                              <div class="chat form-group">
                                <textarea ref="inputcomment" class="form-controlb" v-model="commentText" style="width:100%"></textarea>
                                <label class="pull-right" style="font-size:5px">&nbsp;</label>
                                <button class="btn btn-sm btn-success pull-right" style="vertical-align:bottom;border-radius:13px" @click.prevent="Comment()">Enter</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row chat" v-for="x in formData">
                      <div class="col-lg-11 col-md-11 col-sm-11 ">
                        <div class="row">
                          <div class="form-group cardchat">
                            <span class="chatbody" style="font-size:14px;">
                              <span><i class="fas fa-user-edit" style="font-size:20px; border-radius:100px;"></i></span>
                              <label class="media-heading" style="font:bold;color:#0053ff">{{x.customer_name}}</label>&nbsp;
                              <span v-if="!x.editMode">  {{x.description}}</span>
                            </span>
                            <textarea v-if="x.editMode" class="form-control" rows="2" v-model.trim="x.description"></textarea>
                          </div>
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a v-if="!x.editMode" class="pointer" @click.prevent="setedit(x)">Edit</a><a v-if="x.editMode" class="pointer" @click.prevent="updateDetail(x)">save</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="pointer" @click.prevent="deleteComment(x)">Delete</a></span>
                        </div>
                      </div>
                    </div>
                    <a class="pointer" @click="newcomment()">แสดงความคิดเห็น</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-sm-4 col-md-4">
              <div class="box box-success" style="border-radius:13px">
                  <div class="" style="padding:13px">
                    <div class="chatbody" style="font-size:14px;">
                      <span><i class="fas fa-circle" style="font-size:20px; border-radius:100px;"></i></span>
                      <label class="media-heading" style="font:bold;color:#0053ff">Module</label>&nbsp;
                    </div>
                    <label class="cardchat" style="min-width:360px;white-space:pre-wrap;">{{menuData.module}} </label>
                  </div>
                  <div class="" style="padding:13px">
                    <div class="chatbody" style="font-size:14px;">
                      <span><i class="fas fa-circle" style="font-size:20px; border-radius:100px;"></i></span>
                      <label class="media-heading" style="font:bold;color:#0053ff">MenuID</label>&nbsp;
                    </div>
                  <label class="cardchat" style="min-width:360px;white-space:pre-wrap;">{{menuData.menu_id}}</label>
                </div>
                <div class="col-12" style="padding:13px">
                  <div class="chatbody" style="font-size:14px;">
                    <span><i class="fas fa-circle" style="font-size:20px; border-radius:100px;"></i></span>
                    <label class="media-heading" style="font:bold;color:#0053ff">MenuName Thai</label>&nbsp;
                  </div>
                  <label class="cardchat" style="min-width:360px;white-space:pre-wrap;">{{menuData.menu_text}} </label>
                </div>
                <div class="col-12" style="padding:13px">
                  <div class="chatbody" style="font-size:14px;">
                    <span><i class="fas fa-circle" style="font-size:20px; border-radius:100px;"></i></span>
                    <label class="media-heading" style="font:bold;color:#0053ff">MenuName Eng.</label>&nbsp;
                  </div>
                  <label class="cardchat" style="min-width:360px;white-space:pre-wrap;">{{menuData.menu_text_e}} </label>
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
        baseUrl,
        baseRoute,
        queryString,
        ui: window.ui,
        xt: $xt,
        historyData: [],
        historyTotal: [],
        formData: [],
        menuData: {},
        commentText: "",
        d_data: [],
        change: false,
      };
    },
    methods: {
      async loadData() {
        let url = `CSM/CustomerData/ExternalModuleReadList?module=${this.queryString.module}&menu_id=${this.queryString.menu_id}`;
        let rsp = await $xt.getCustomerServer(url);

        $linq(rsp.data).foreach(x => {
          x.editMode = false;
        });
        this.formData = rsp.data;
        this.menuData = rsp.menu;
        console.log(this.menuData)

      },
      async Comment() {
        try {

          let comment = {
            customer_code: this.formData.customer_code,
            module: this.queryString.module,
            menu_id: this.queryString.menu_id,
            itemno: null,
            description: this.commentText || '',
          };
          let f = {
            comment: comment
          }
          let url = `CSM/CustomerData/ExternalModuleComment`;
          let rsp = await $xt.postCustomerJson(url, f);
          await this.loadData();
          this.commentText = "";
          if (!rsp.success) {
            throw rsp.error;
          }
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {

        }
      },
      async deleteComment(x) {
        if (!await $msg.confirm(`คุณต้องการลบ Comment นี้ใช่หรือไม่ โปรดยืนยันข้อมูลก่อนทำรายการดังกล่าว`)) {
          return;
        }
        try {
          let f = {
            comment: x
          };
          this.isLoading = true;
          let act = `CSM/CustomerData/Ext_DeleteCommentCustomer`;
          let rsp = await $xt.postCustomerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_delete_success);
          await this.loadData(rsp.data);
        } catch (ex) {
          this.isLoading = false;
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          this.isLoading = false;
        }
      },
      setedit(x) {
        x.editMode = !x.editMode;
      },
      async updateDetail(x) {
        try {
          let comment = {
            customer_code: this.formData.customer_code,
            module: this.queryString.module,
            menu_id: this.queryString.menu_id,
            itemno: x.itemno,
            description: x.description,
          };
          let f = {
            comment: comment
          };
          this.isLoading = true;
          //let act = `CSM/CustomerData/ExternalModuleComment?module=${this.queryString.module}&menu_id=${this.queryString.menu_id}`;
          let act = `CSM/CustomerData/ExternalModuleComment`;
          let rsp = await $xt.postCustomerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.loadData();

          this.commentText = "";

          if (!rsp.success) {
            throw rsp.error;
          }
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {

        }
      },
      newcomment() {
        this.change = true;
        $('html,body').scrollTop($('#toppage').offset().top);
      },


    },
    mounted() {
      page = this.$refs.page;
      page.pageTitle = 'CSM | Request Detail';
      document.title = page.pageTitle;

      this.loadData();


    }
  };
  export default cpn;
</script>
