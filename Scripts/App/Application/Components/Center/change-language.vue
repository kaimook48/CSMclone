<template>
    <div>
        <modal ref="langModal" modal-size="modal-sm">
            <template slot="header">
                <h4>{{ui.select_language}}</h4>
            </template>
            <template slot="body">
                <div class="box-body">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <select class="form-control" @change="changeLang" v-model="user_lang">
                                <option value=""> -- Plase Select -- </option>
                                <option v-for="x in lang.langList" :value="x.lang_code">{{x.display_text}}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                lang: window.langList,
                ui: window.ui,
                user_lang: ''
            }
        },
        methods: {
            openModal() {

                (async () => {
                    if (await $msg.confirm(ui.alert_leave_page)) {
                        this.$refs.langModal.openModal();
                    }
                })();

            },
            changeLang() {
                localStorage.setItem("user_lang", this.user_lang || 'TH');
                window.location.href = window.location.href;
            }
        },
        mounted() {
            this.$refs.langModal.setSize('modal-sm');
        }
    };
</script>
