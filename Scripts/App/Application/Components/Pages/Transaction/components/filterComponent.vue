<template>
    <div class="filter-backdrop">
        <div class="filter-csm-wrap">
            <div class="filter-csm p-30">
                <div class="row">
                    <span class="f-16 f-black" style="float: right;" @click="openPanel()"><i class="fas fa-times"></i></span>
                    <span><i class="fas fa-filter"></i> ตัวกรอง</span>
                </div>
                <div class="row pt-15">
                    <span>ค้นหาตามวันที่</span>
                </div>
                <div class="row d-flex pt-15 border-b">
                    <div class="form-group">
                        <label class="sm-text" v-text="ui.start || 'เริ่ม'"></label>
                        <datepicker input-class="form-control input-sm" v-model.trim="start_date"></datepicker>
                    </div>
                    <div class="form-group pr-5 pl-5">
                        <label>&nbsp;</label>
                        <label v-text="ui.to || 'ถึง'"></label>
                    </div>
                    <div class="form-group">
                        <label class="sm-text" v-text="ui.end || 'สิ้นสุด'"></label>
                        <datepicker input-class="form-control input-sm" v-model.trim="end_date"></datepicker>
                    </div>
                </div>
                <div class="row pt-15">
                    <span>ค้นหาตาม Modules</span>
                </div>
                <div class="row d-flex pt-15 border-b">
                    <div>
                        <ul style="margin-left: -40px;">
                            <li class="in-block md-toggle" :class="x.active ? 'active' : '' " v-for="x in moduleData" :key="x.name" @click="filterModule(x)"><span>{{ x.name }}</span></li>
                        </ul>
                    </div>
                </div>
                <div class="row pt-15">
                    <span>ค้นหาตาม Case Type</span>
                </div>
                <div class="row d-flex pt-15 border-b">
                    <div>
                        <ul style="margin-left: -40px;">
                            <li class="in-block md-toggle" :class="x.active ? 'active' : '' " v-for="x in caseType" :key="x.serv_code" @click="filterCaseType(x)"><span>{{ x.name }}</span></li>
                        </ul>
                    </div>
                </div>
                <div class="row d-flex pt-15 pull-center filter-footer border-t">
                    <button class="btn bg-filter-white" @click="clearFilter()"> ล้าง</button>
                    &nbsp;&nbsp;
                    <button class="btn bg-filter" @click="saveFilter()"> ตกลง</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    // import center_md from '../../../../../../Others/data-center.js'
    export default {
        data() {
            return {
                ui: window.ui,
                isOpen : false,
                start_date : new Date(),
                end_date : null,
                modules : window.moduleCodeData,
                caseType : [],
                moduleData : [], 
            }
        },
        methods : {
            async openPanel(){
                this.isOpen = !this.isOpen
                console.log(this.isOpen);

                // console.log(window);
                if(this.isOpen){
                    $('.filter-backdrop').addClass('backdrop-open')
                    await $xt.sleep(300);
                    $('.filter-csm-wrap').addClass('control-open');
                }else{
                    $('.filter-csm-wrap').removeClass('control-open');
                    await $xt.sleep(300);
                    $('.filter-backdrop').removeClass('backdrop-open')
                }
            },
            loadModules(){
                let md = this.modules;
                let md_array = [];
                md.forEach(x => {
                    let obj = { name : x, active : false }
                    md_array.push(obj);
                })

                this.moduleData = md_array;
            },
            async loadCaseType(data){
                try {
                    let url = `CSM/Center/ServiceType`
                    let action = await $xt.getServer(url);

                    let newCase = [];
                    action.data.data_rows.forEach(x => { 
                        let obj = { name : x.serv_name, code : x.serv_code,  active : false }
                        newCase.push(obj);
                    } );
                    this.caseType = newCase;
                }catch(ex){
                    $msg.alert(``, ex.toString(), `danger`);
                }
            },
            filterModule(item){
                item.active = !item.active;
            },
            filterCaseType(item){
                console.log(item);
                item.active = !item.active;
            },
            clearFilter(){
                this.start_date = new Date()
                this.end_date = null
                this.caseType.forEach(x => x.active = false);
                this.moduleData.forEach(x => x.active = false);
            },
            saveFilter(){
                if( $xt.isEmpty(this.start_date) || $xt.isEmpty(this.end_date)){ $msg.alert(``, `กรุณากรอกข้อมูลให้ครบถ้วน`, `warning`); return }
                if($linq(this.caseType).all(x => x.active == false)){ $msg.alert(``, `กรุณากรอกข้อมูลให้ครบถ้วน`, `warning`); return }
                if($linq(this.moduleData).all(x => x.active == false)){ $msg.alert(``, `กรุณากรอกข้อมูลให้ครบถ้วน`, `warning`); return }

                let searchCenter = {
                    start_date : this.start_date,
                    end_date : this.end_date,
                    case_type : this.caseType,
                    modules : this.moduleData
                }
                
                this.$emit('send-data', searchCenter);
            }
        },
        computed: {
        },
        async updated(){
        },
        mounted() {
            this.loadModules();
            this.loadCaseType();

            
        }
    }
</script>
<style>
    .filter-backdrop{
        z-index: 1050;
        display: none;
        /* padding-top: 100px; */
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        /* background-color: rgb(0,0,0); */
        transition: opacity 1s ease-out;
        opacity: 0;
        background-color: rgba(0,0,0,0.4);
    }
    .backdrop-open{
        display : block;
        opacity: 1;
    }
    .filter-csm-wrap{
        position: fixed;
        /* top: 50px; */
        top : 0;
        bottom: 0;
        right: 0;
        width: 30em;
        transform: translateX(100%);
        transition: .3s ease-out;
    }
    .filter-csm{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #FFF;
        box-shadow: 5px 10px #88888829;
        /* color: #eee; */
        overflow: hidden;
        padding: 1em;
    }

    .bg-filter{
        background: #303952;
        color: #fff;
        width: 100px;
    }
    
    .bg-filter-white{
        background: transparent;
        border: 1px solid #303952;
        width: 100px;
    }
    
    .pull-center{
        display: flex;
        justify-content: center;
    }

    .filter-footer{
        position: absolute;
        bottom: 7px;
        width: 100%;
    }

    .btn.bg-filter:hover {
        color: #fff;
    }

    .in-block{
        display: inline-block;
    }
    .md-toggle{
        padding: 5px 15px;
        border: 1px solid #303952;
        border-radius: 8px;
        margin: 3px 5px;
        cursor: pointer;
    }
    .in-block.md-toggle.active {
        background: #303952;
        color: #fff;
    }

    .d-flex{
        display: flex;
    }

    .pl-15{
        padding-left: 15px;
    }

    .p-30{
        padding: 15px 30px;
    }

    .pr-15{
        padding-right: 15px;
    }

    .f-16{
        font-size: 16px;
    }

    .pt-15{
        padding-top: 15px;
    }

    .pr-5{
        padding-right: 5px;
    }

    .sm-text{
        font-size: 8px;
    }
    
    .pl-5{
        padding-left: 5px;
    }
    .border-t{
        padding-top: 5px;
        border-top: 1px solid #88888829;
    }
    .border-b{
        padding-bottom: 5px;
        border-bottom: 1px solid #88888829;
    }

    .f-black{
        color: black;
        cursor: pointer;
    }

    .control-open {
        transform: translateX(0%);
    }


    /* demo display */
    *,*:before, *:after {box-sizing: border-box;}
</style>