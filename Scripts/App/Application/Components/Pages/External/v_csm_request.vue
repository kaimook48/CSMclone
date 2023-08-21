<template>
    <div>
        <customer-page ref="page">
            <template slot="body">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="box box-solid">
                            <div class="box-body with-border">
                                <div class="col-md-4 col-sm-12 col-xs-12">
                                    <div class="form-group">
                                        <label>โมดูล</label>
                                        <select class="form-control" v-model="form.module" @change="onChangeModule()">
                                            <option v-for="x in moduleCodeData" v-text="x"></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="nav-tabs-custom">
                                        <ul class="nav nav-tabs">
                                            <li :class="{active: x.id===tabActive}" v-for="x in tabField" v-if="x.show">
                                                <a href="#" @click.prevent="onTabChange(x.id) "><i class="fas" :class="xt.isEmpty(x.icon) ? 'fa-circle' : x.icon"></i><span v-text="x.text"></span></a>
                                            </li>
                                        </ul>
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <div class="row">
                                                    <div class="col-lg-12 col-md-12 col-sm-12">
                                                        <table-stick height="550px">
                                                            <table class="table table-bordered table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="tf-3 text-center">รหัสเมนู</th>
                                                                        <th>ชื่อเมนู</th>
                                                                        <th class="tf-3"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="x,idx in menuData">
                                                                        <td align="center">{{x.menu_id}}</td>
                                                                        <td align="left">{{x.display}}</td>
                                                                        <td align="center"><button class="btn btn-sm bg-navy" @click.prevent="openDetail(x)"><i class="far fa-comments"></i> ความคิดเห็น</button></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </table-stick>
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
        </customer-page>
    </div>
</template>
<script type="text/javascript">

    let page = {};
    let paging = {};
    let cpn = {
        data() {
            return {
                baseUrl,
                baseRoute,
                queryString,
                ui: window.ui,
                xt: $xt,
                tabField: [
                    { id: 0, icon: '', text: ' การติดต่อทางธุรกิจ', show: true, icon: "fa fa-pencil-square-o" },
                    { id: 1, icon: '', text: ' มาสเตอร์', show: true, icon: "fa fa-address-book" },
                    { id: 2, icon: '', text: ' แบบบันทึกรายงาน', show: true, icon: "fa fa-file-text" },
                ],
                tabActive: 0,
                moduleCodeData: [
                    'AP',
                    'AR',
                    'BD',
                    'EVAL',
                    'IC',
                    'FA',
                    'GL',
                    'HR',
                    'MA',
                    'MRP',
                    'OF',
                    'PO',
                    'PM',
                    'RE',
                    'RT',
                    'SE',
                ],
                form: {},
                menuData: [],
            };
        },
        methods: {
            onTabChange(t) {
                this.tabActive = t;
                this.loadMenu();
            },
            async loadMenu() {
                let trn = `CSM/CustomerData/ExternalMenuReadList?module=${this.form.module}&tabSelected=${this.tabActive}`;
                let rsp = await $xt.getCustomerServer(trn);
                this.menuData = rsp.data;
            },
            onChangeModule() {
                this.tabActive = 0;
                this.loadMenu();
            },
            openDetail(x) {
                window.open(this.baseUrl + `page/external/v_csm_request_d/?module=${x.module}&menu_id=${x.menu_id}`, "_blank");
            },
        },
        mounted() {
            page = this.$refs.page;
            page.pageTitle = 'Request';
            document.title = page.pageTitle;

            this.$set(this.form, "module", $linq(this.moduleCodeData).select(x => x).firstOrDefault());
            this.onTabChange(0);
        }
    };
    export default cpn;
</script>
