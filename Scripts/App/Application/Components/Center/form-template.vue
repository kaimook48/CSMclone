<template>
    <div>
        <slot name="form-trn-ReadList">
        </slot>
        <slot name="form-field">
        </slot>
        <div class="row" v-if="allBtnShow">
            <div class="col-lg-12 col-md-12">
                <div class="form-group">
                    <button class="btn btn-sm  btn-primary" v-bind:disabled="btnRetrieve.disabled" v-if="btnRetrieve.show" v-on:click="btnRetrieveClick"><i class="fa fa-list"></i>&nbsp;&nbsp;{{ui.retrieve == null ? "Retrieve" : ui.retrieve}}</button>
                    <button class="btn btn-sm  btn-info" v-bind:disabled="btnNew.disabled || menuRights.IsReadOnly" v-if="btnNew.show" v-on:click="btnNewClick"><i class="fa fa-plus"></i>&nbsp;&nbsp;{{ui.new == null ? "New" : ui.new }}</button>
                    <button class="btn btn-sm  btn-success" v-bind:disabled="btnSave.disabled || menuRights.IsReadOnly" v-if="btnSave.show" v-on:click="btnSaveClick"><i class="fa fa-save"></i>&nbsp;&nbsp;{{ui.save == null ? "Save" : ui.save}}</button>
                    <button class="btn btn-sm  btn-danger" v-bind:disabled="btnDelete.disabled || menuRights.IsReadOnly" v-if="btnDelete.show" v-on:click="btnDeleteClick"><i class="fa fa-trash"></i>&nbsp;&nbsp;{{ui.delete == null ? "Delete" : ui.delete}}</button>
                    <button class="btn btn-sm  btn-secondary" v-bind:disabled="btnPrint.disabled || menuRights.IsNotPrint" v-if="btnPrint.show" v-on:click="btnPrintClick"><i class="fa fa-print"></i>&nbsp;&nbsp;{{ui.print == null ? "Print" : ui.print}}</button>
                    <button class="btn btn-sm  btn-warning" v-bind:disabled="btnBack.disabled" v-if="btnBack.show" v-on:click="btnBackClick"><i class="fa fa-reply"></i>&nbsp;&nbsp;{{ui.back == null ? "Back" : ui.back }}</button>
                    <button class="btn btn-sm  btn-warning" v-bind:disabled="btnSaveAs.disabled || menuRights.IsNotSaveAs" v-if="btnSaveAs.show" v-on:click="btnSaveAsClick"><i class="fa fa-file-export"></i>&nbsp;&nbsp;{{ui.saveas == null ? "Export As" : ui.saveas}}</button>
                    <button class="btn btn-sm  btn-primary" v-bind:disabled="btnRefresh.disabled" v-if="btnRefresh.show" v-on:click="btnRefreshClick"><i class="fa fa-sync"></i>&nbsp;&nbsp;Refresh</button>
                    <slot name="extraBtn"></slot>
                </div>
            </div>
        </div>
        <slot name="form-detail">
        </slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                btnRetrieve: {
                    show: true,
                    disabled: false,
                    click() { }
                },
                btnNew: {
                    show: true,
                    disabled: false,
                    click() { }
                },
                btnSave: {
                    show: true,
                    disabled: false,
                    click() { }
                },
                btnSaveAs: {
                    show: false,
                    disabled: false,
                    click() { }
                },
                btnDelete: {
                    show: true,
                    disabled: false,
                    click() { }
                },
                btnPrint: {
                    show: true,
                    disabled: false,
                    click() { }
                },
                btnBack: {
                    show: true,
                    disabled: false,
                    click() { }
                },
                btnRefresh: {
                    show: false,
                    disabled: false,
                    click() { }
                },
                ui: window.ui,
                allBtnShow: true,
                footer_show: false,
                panel_func: false,
                menuRights: {}
            };
        },
        methods: {
            btnRetrieveClick() {
                this.btnRetrieve.click();
            },
            btnNewClick() {
                this.btnNew.click();
            },
            btnSaveClick() {
                this.btnSave.click();
            },
            btnSaveAsClick() {
                this.btnSaveAs.click();
            },
            btnDeleteClick() {
                this.btnDelete.click();
            },
            btnPrintClick() {
                this.btnPrint.click();
            },
            btnBackClick() {
                this.btnBack.click();
            },
            btnRefreshClick() {
                this.btnRefresh.click();
            },

        },
        mounted() {

        }
    }
</script>
