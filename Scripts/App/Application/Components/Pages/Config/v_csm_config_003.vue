<template>
    <div>
        <re-page ref="page">
            <template slot="body">
                <div class="box box-widget">
                    <div class="box-body">
                        <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                                <li :class="{active:tabActive===0}"><a href="#" @click.prevent="onTabChange(0)">Program Settings</a></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane" :class="{active:tabActive===0}">
                                    <div class="row">
                                        <div class="col-md-12 col-sm-12 col-xs-12">
                                            <table class="table table-bordered">
                                                <tbody>
                                                    <tr v-for="x,idx in initial">
                                                        <td v-text="x.description"></td>
                                                        <td align="center" class="tf-3-5">
                                                            <span class="checkbox" v-if="x.type == 'checkbox'">
                                                                <label>
                                                                    <input type="checkbox" true-value="Y" false-value="N" v-model="x.config_value">
                                                                    <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                                                    &nbsp;
                                                                </label>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div style="margin-top:10px">
                                        <div class="pull-right">
                                            <button class="btn btn-sm bg-olive" @click.prevent="saveClick()"><i class="fas fa-save"></i> <span v-text="ui.save || 'Save'"></span></button>
                                        </div>
                                    </div>
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

    let initial = [];
    initial.push({ config_id: 'TRN0001', description: "โปรแกรมใช้สำหรับ Mango เท่านั้น (Program for Mango Only)", config_value: null, type: "checkbox" });

    let cpn = {
        data() {
            return {
                auth,
                ui: window.ui,
                tabActive: 0,
                initial
            };
        },
        methods: {
            onTabChange(t) {
                this.tabActive = t;
            },
            async loadConfig() {
                let act = `CSM/Config/Config_ReadList`;
                let rsp = await $xt.getServer(act);
                if (rsp.data.length > 0) {
                    $linq(this.initial).foreach(x => {
                        x.config_value = $linq(rsp.data).where(z => z.config_id === x.config_id).select(x => x.config_value).firstOrDefault();
                    });
                }
            },
            async saveClick() {
                try {
                    let f = {
                        config: this.initial
                    };
                    let act = `CSM/Config/Config_Create`;
                    page.loadingBox.show();
                    let rsp = await $xt.postServerJson(act, f);
                    if (!rsp.success) {
                        throw rsp.error;
                    }
                    $notify.success(this.ui.alert_save_success);
                    await this.loadConfig();
                } catch (ex) {
                    $msg.alert(``, ex.toString(), `danger`);
                } finally {
                    page.loadingBox.hide();
                }
            }
        },
        computed: {

        },
        mounted() {
            page = this.$refs.page;
            page.pageTitle = 'Program Config : Settings';
            document.title = page.pageTitle;

            this.loadConfig();
        }
    };
    export default cpn;
</script>
<style scoped>
    .checkbox, .radio {
        margin-top: unset;
        margin-bottom: unset;
    }

        .checkbox label, .radio label {
            padding-left: 10px;
        }
</style>
