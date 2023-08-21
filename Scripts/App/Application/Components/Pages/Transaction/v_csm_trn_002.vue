<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div>
            <div class="nav-tabs-custom animated fadeIn">
                <ul class="nav nav-tabs">
                    <li v-for="tab in tabs" :key="tab.id" :class="{active:selectedTabs == tab.id}" ><a href="#" @click.prevent="changeTab(tab.id)">{{ tab.name }}</a></li>
                </ul>
                <div class="tab-content" ref="myContent">
                    <div class="tab-pane" v-bind:class="{active:selectedTabs == 'tab1'}">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="input-group">
                                <div class="input-group-btn">
                                    <select class="btn p-7-5 w-100 btn-default">
                                        <option v-for="x in searchParams" :key="x.name"><a href="#" @click.prevent="" >{{ x.name }}</a></option>
                                    </select>
                                    <!-- <button type="button" class="btn p-5-5 btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">ทั้งหมด <span class="caret"></span></button>
                                    <ul class="dropdown-menu">
                                        <li v-for="x in searchParams" :key="x.name"><a href="#" @click.prevent="" >{{ x.name }}</a></li>
                                    </ul> -->
                                </div><!-- /btn-group -->
                                <input type="text" class="form-control" placeholder="ขื่อผู้ติดต่อ, ชื่อบริษัท, มือถือ, Req No.">
                                </div><!-- /input-group -->
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-sm bg-navy pull-left" @click="searchData()"><i class="fas fa-search"></i> Search</button>
                            </div>

                            <div class="col-md-3 pull-right">
                                <button class="btn btn-sm btn-default pull-right" @click="filterData()"><i class="fas fa-filter"></i> ตัวกรอง</button>
                            </div>
                        </div>

                        <div class="row pt-5">
                            <div class="col-md-12">
                                <tab001 ref="tab001" @send-data="returnComponents('img', $event)"/>
                            </div>
                        </div>
                    </div>  
                    <div class="tab-pane" v-bind:class="{active:selectedTabs == 'tab2'}">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="input-group">
                                <div class="input-group-btn">
                                    <select class="btn p-7-5 w-100 btn-default">
                                        <option v-for="x in searchParams" :key="x.name"><a href="#" @click.prevent="" >{{ x.name }}</a></option>
                                    </select>
                                    <!-- <button type="button" class="btn p-5-5 btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">ทั้งหมด <span class="caret"></span></button>
                                    <ul class="dropdown-menu">
                                        <li v-for="x in searchParams" :key="x.name"><a href="#" @click.prevent="" >{{ x.name }}</a></li>
                                    </ul> -->
                                </div><!-- /btn-group -->
                                <input type="text" class="form-control" placeholder="ขื่อผู้ติดต่อ, ชื่อบริษัท, มือถือ, Req No.">
                                </div><!-- /input-group -->
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-sm bg-navy pull-left" @click="searchData()"><i class="fas fa-search"></i> Search</button>
                            </div>

                            <div class="col-md-3 pull-right">
                                <button class="btn btn-sm btn-default pull-right" @click="filterData()"><i class="fas fa-filter"></i> ตัวกรอง</button>
                            </div>
                        </div>

                        <div class="row pt-5">
                            <div class="col-md-12">
                                <tab002 ref="tabs002" @send-data="returnComponents('img', $event)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </template>
    </re-page>
        <filterPanel ref="filter_panel" @send-data="returnComponents('filter', $event)"></filterPanel>
        <img_preview ref="img_preview"/>
    </div>
</template>
<script>
    import filterPanel from './components/filterComponent.vue'
    import img_preview from './components/previewImage.vue'
    import tab001 from './components/v_csm_tabs1_trn_002.vue'
    import tab002 from './components/v_csm_tabs2_trn_002.vue'

    export default {
        components : { filterPanel, tab001, tab002, img_preview },
        data() {
            return {
                auth,
                baseUrl,
                baseRoute,
                queryString,
                ui: window.ui,
                xt: $xt,
                company: window.baseCompany,
                /*------ Select Tabs------*/
                selectedTabs : 'tab1',
                tabs : [
                    { name : "แจ้งเรื่อง", status : false, icon : '', id : "tab1" },
                    { name : "Reject", status : false, icon : '', id : "tab2" }
                ],
                /*---- Search Params -------*/
                searchParams : [
                    { name : 'ทั้งหมด', key : '' },
                    { name : 'ชื่อผู้ติดต่อ', key : '' },
                    { name : 'ชื่อบริษัท', key : '' },
                    { name : 'Req No.', key : '' },
                    { name : 'เบอร์โทรศัพท์', key : '' },
                ],
                resultFilter : {}
            }
        },
        methods : {
            changeTab(tab){
                this.selectedTabs = tab
            },
            filterData(){
                this.$refs.filter_panel.openPanel();
            },
            openDetailReq (item, no){
                this.$refs.detail_req.openPanel(item, no);
            },
            returnComponents(text, e){
                switch(text){
                    case "filter" :
                        this.resultFilter = e;
                        this.$refs.filter_panel.openPanel();

                        if(this.selectedTabs == 'tab1'){
                            this.$refs.tab001.loadApi(e);
                        }else{
                            this.$refs.tab002.loadApi(e);
                        }

                        break;
                    case "img" :
                        this.$refs.img_preview.viewImage(e);
                        break;
                }
            },
        },
        computed : {

        },
        mounted() {

        }
    }
</script>
<style scoped>
    select { text-align-last: left; font-size: 12px; }
</style>
<style>
    .btn-default{
        background-color: white;
        border: 1px solid #f4e5e5;
    }
    .pt-5{
        padding-top : 5px;
    }
    .p-5-5{
        padding: 5.5px 10px;
    }
    .p-link{
        color : #5690C6;
        cursor: pointer;
    }
    .pointer{
        cursor: pointer;
    }

    .p-7-5{
        padding: 7.5px 10px;
    }

    .w-80{
        width: 80px;
    }
    .w-100{
        width: 100px;
    }
</style>