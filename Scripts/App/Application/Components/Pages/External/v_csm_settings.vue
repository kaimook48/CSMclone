<template>
    <div>
        <customer-page ref="page">
            <template slot="body">
                <div class="row">
                    <div class="col-md-12 col-sm-6 col-xs-12">
                        <div class="info-box" style=" border-radius:15px;">
                            <span class="info-box-icon bg-green" >
                                <i class="fas fa-user-cog"></i>
                            </span>
                            <div class="info-box-content">
                                <h2 class="font-bold">Setting</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Tab Data-->
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="box box-success">
                            <div class="box-body">
                                <div class="col-md-12">
                                    <div class="nav-tabs-custom">
                                        <ul class="nav nav-tabs">
                                            <li :class="{active: x.id===tabActive}" v-for="x in tabField" v-if="x.show">
                                                <a href="#" @click.prevent="onTabChange(x.id)"><i class="fas" :class="xt.isEmpty(x.icon) ? 'fa-circle' : x.icon"></i> <span v-text="x.text"></span></a>
                                            </li>
                                        </ul>
                                        <div class="tab-content">
                                            <div class="tab-pane" :class="{active: tabActive===0}">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <button  class="btn btn-sm btn-info pull-right font-bold" v-on:click="addEmail">
                                                            <i class="fa fa-plus"></i>&nbsp; Add
                                                        </button>
                                                    </div>
                                                </div>
                                                <br />
                                                <div class="row">
                                                    <div class="col-lg-12 col-md-12 col-sm-12">
                                                        <div class="table-responsive">
                                                            <table class="table table-striped table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="col-lg-1" style="text-align:center;">No.</th>
                                                                        <th class="col-lg-9" style="text-align:left;">Email</th>
                                                                        <th class="col-lg-1" style="text-align:center;">Active</th>
                                                                        <th class="col-lg-1" style="text-align:center;">Manage</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                 
                                                                    <tr  v-for="x,idx in displayData ">
                                                                        <td align="center">{{idx+1}}</td>
                                                                        <td align="left">{{x.email}}</td>
                                                                        <td align="center" class="font-bold">
                                                                            <span  v-show="x.active=='Y'"style="color:#00c116;">Yes</span>
                                                                            <span v-show="x.active=='N'|| x.active==Null"style="color:#ff0000;">No</span>
                                                                        </td>
                                                                        <td align="center">
                                                                            <i class="fas fa-edit fa-1x text-info" style="cursor:pointer;" v-on:click="editEmail(x)"></i>&nbsp;
                                                                            <i class="fas fa-trash-alt fa-1x text-danger" style="cursor:pointer;" v-on:click="delEmail(x)"></i>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="input-group">
                                                    <p class="text-danger"><b>หมายเหตุ:</b> การตั้งค่า Email นี้เป็นการตั้งค่าเพื่อเปิดการใช้งานการแจ้งเตือนผ่าน Email ในกรณีที่ท่านได้แจ้งปัญหาเกี่ยวกับการใช้งาน MangoAnywhere และทางเราได้รับเรื่องและบันทึกเข้าในระบบ</p>
                                                    <p class="text-danger">เมื่อปัญหานั้นได้ถูกแก้ไขเรียบร้อยแล้ว ทางระบบจะแจ้งเตือนรายละเอียดเพิ่มเติมไปยัง Email ที่ท่านได้ระบุไว้ข้างต้น</p>
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
        <div class="modal fade" id="addEmailModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{isEdit ? 'Edit Email' : 'Add Email'}}</h5>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="">Email:</label>
                                    <input type="email" class="form-control" v-model.trim="formData['email']" placeholder="Enter your email">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="">Active:</label>
                                    <input type="checkbox" v-model.trim="formData['active']" true-value="Y" false-value="N">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="saveEmail()">Save Email</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
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
                displayData: [],
                displayPage: 0,
                formData: {},
                total: 0,
                /* Start Example Tab */
                tabField: [
                    { id: 0, icon: '', text: 'Email', show: true, icon: "fa fa-envelope" },
                ],
                tabActive: 0,

            };
        },
        methods: {
            onTabChange(t) {
                this.tabActive = t;
            },
            async loadDisplay() {
                let act = `CSM/CustomerData/EmailReadList`;
                let rsp = await $xt.getCustomerServer(act);
                this.displayData = rsp.data;
            },
            addEmail() {
                if (this.displayData.length >= 2) {
                    $alert('คำเตือน', 'ท่านได้เพิ่ม Email ครบจำนวน 2 Email แล้ว หากต้องการเปลี่ยนแปลง Email กรุณาเลือก Edit รายการ Email ที่ต้องการแก้ไข', 'danger')
                    return;
                }
                $('#addEmailModal').modal('show');
                this.formData = {};
            },
            editEmail(x) {
                $('#addEmailModal').modal('show');
                this.isEdit = true;
                this.$set(this, 'formData', JSON.parse(JSON.stringify(x)));
            },
            async saveEmail() {
                try {
                    let f = {
                        data: this.formData
                    };
                    let url = `CSM/CustomerData/EmailCreate`;

                    let rsp = await $xt.postCustomerJson(url, f);
                    if (!rsp.success) {
                        throw rsp.error;
                    }
                    $msg.alert(``, `Success`, `success`);
                    $('#addEmailModal').modal('hide');
                    await this.loadDisplay();
                } catch (ex) {
                    $msg.alert(``, ex.toString(), `danger`);
                } finally {
                    
                }
                //console.log(this.formData);
            },
            async readEmail(x) {
                let act = `CSM/CustomerData/EmailRead?itemno=${encodeURIComponent(x.itemno || '')}`;
                let rsp = await $xt.getServer(act);
                this.formData = rsp.data;
            },
            async delEmail(x) {
                this.$set(this, 'formData', JSON.parse(JSON.stringify(x)));
                if (!await $msg.confirm(`ต้องการลบข้อมูลใช่หรือไม่`)) {
                    return;
                }
                try {
                    let f = {
                        data: this.formData
                    };
                    let act = `CSM/CustomerData/Email_Delete`;
                    let rsp = await $xt.postCustomerJson(act, f);
                    if (!rsp.success) {
                        throw rsp.error;
                    }
                    $msg.alert(``, `Success`, `success`);
                    await this.loadDisplay();
                } catch (ex) {
                    $msg.alert(``, ex.toString(), `danger`);
                } finally {
                }
            },
        },
        mounted() {
            page = this.$refs.page;
            page.pageTitle = 'Settings';
            document.title = page.pageTitle;

            this.loadDisplay();

        }
    };
    export default cpn;
</script>
