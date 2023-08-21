<template>
    <div>
        <re-page ref="page">
            <template slot="body">
                <div class="box box-solid">
                    <div class="box-body with-border">
                        <div class="row">
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="tf-2-5 text-center">Manage</th>
                                                <th class="tf-2 text-center">No.</th>
                                                <th class="tf-7">Description</th>
                                                <th class="tf-3-5 text-center">Add Date</th>
                                                <th>Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="x,idx in displayData">
                                                <td align="center"><a href="#" @click.prevent="spliceRow(x)">Delete</a></td>
                                                <td align="center"><b>{{x.itemno}}.</b></td>
                                                <td>
                                                    <input type="text" class="form-control" v-model="x.itemname" />
                                                </td>
                                                <td align="center">{{x.adddate | date()}}</td>
                                                <td>
                                                    <input type="text" class="form-control" v-model="x.remark" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <button class="btn btn-sm bg-olive" @click.prevent="saveClick()"><i class="fas fa-save"></i> บันทึกข้อมูล</button>&nbsp;
                                <button class="btn btn-sm btn-github" @click.prevent="appendRow()"><i class="fas fa-plus-circle"></i> เพิ่มข้อมูล</button>
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
                displayData: [],
            }
        },
        methods: {
            async loadData() {
                let act = `CSM/Master/QCItem_ReadList`;
                let rsp = await $xt.getServer(act);
                this.displayData = rsp;
            },
            appendRow() {
                let itemno = this.displayData.length == 0 ? 1 : $linq(this.displayData).max(x => x.itemno) + 1;
                let line_number = this.displayData.length == 0 ? 1 : $linq(this.displayData).max(x => x.line_number) + 1;
                this.displayData.push({
                    itemno: itemno,
                    line_number: line_number,
                    itemname: null,
                    remark: null,
                    adddate: new Date(),
                });
            },
            spliceRow(e) {
                this.displayData = $linq(this.displayData).where(x => !(x.itemno == e.itemno)).toArray();
            },
            async saveClick() {
                try {
                    let f = {
                        item: this.displayData
                    };

                    page.loadingBox.show();
                    let act = `CSM/Master/QCItem_Create`;
                    let rsp = await $xt.postServerJson(act, f);
                    if (!rsp.success) {
                        throw rsp.error;
                    }
                    await this.loadData();
                } catch (ex) {
                    $msg.alert(``, ex.toString(), `danger`);
                } finally {
                    process = false;
                    page.loadingBox.hide();
                }
            },
        },
        mounted() {
            page = this.$refs.page;
            page.pageTitle = 'Setup : ตั้งค่าคำถามการประเมิน';
            document.title = page.pageTitle;
            this.loadData();
        }
    }

    export default cpn;
</script>
<style scoped>
</style>
