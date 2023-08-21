<template>
    <div>
        <div class="panel-req-detail" :class="isOpen?'open-panel': ''">
            <div class="row">
                <div class="panel-req-header"><span @click="openPanel()" class="pointer"><i class="fas fa-chevron-left"></i> ข้อมูล{{ header.name }}</span></div>
            </div>
            <div class="row padding-t-10 padding-l-10" style="padding-right: 90px;">
                <div class="col-md-12 detail-body">
                    <!-- skip page -->
                    <div class="d-flex req-paging">
                        <span class="padding-t-5 padding-r-5">Item No. {{ detail.itemno + "/" + total_page }}</span>
                        <button class="btn btn-sm btn-navy" @click.prevent="pageChange('back')" v-bind:disabled="detail.itemno == 1"><i class="fas fa-chevron-left"></i></button>&nbsp;
                        <button class="btn btn-sm btn-navy" @click.prevent="pageChange('next')" v-bind:disabled="detail.itemno == total_page"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <!-- end skip page -->
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="" id="req_no" v-text="'Req. No.'"></label>
                                <input type="text" class="form-control input-sm text-aqua" v-model="detail['req_no']" ref="req_no" disabled/>
                              </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="" id="req_date" v-text="'Req. Date'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['req_date_preview']" ref="req_date" disabled/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="" id="contact_name" v-text="'Contract User'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['contact_name']" ref="contact_name" disabled/>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label class="" id="phone" v-text="'Phone'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['phone']" ref="phone" disabled/>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="" id="email" v-text="'Email'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['email']" ref="email" disabled/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <div class="form-group">
                                <label class="" id="module" v-text="'Module'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['module']" ref="module" disabled/>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="" id="case_type" v-text="'Case Type'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['case_type']" ref="case_type" disabled/>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="" id="subject" v-text="'Subject'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['subject']" ref="subject" disabled/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="" id="description" v-text="'Description'"></label>
                                <textarea class="form-control" cols="20" v-model="detail['desc']"  rows="5" disabled></textarea>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="" id="description" v-text="'Picture'"></label>
                                <div class="row img-preview">
                                    <div class="image-req-preview">
                                        <img src="https://www.w3schools.com/howto/img_forest.jpg" alt="" style="width:100%; height: 105px;" />
                                    </div>
                                    <div class="image-req-preview">
                                        <img src="https://www.w3schools.com/howto/img_forest.jpg" alt="" style="width:100%; height: 105px;"/>
                                    </div>
                                    <div class="image-req-preview">
                                        <img src="https://www.w3schools.com/howto/img_forest.jpg" alt="" style="width:100%; height: 105px;"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="" id="detail_contact" v-text="'รายละเอียดการติดต่อ'"></label>
                                <input type="text" class="form-control input-sm" v-model="detail['detail_contact']" ref="detail_contact" disabled/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                ui: window.ui,
                isOpen : false,
                header : { children : [] },
                detail : {},
                current_page : 1,
                next_page : null,
                total_page : 1,
            }
        },
        methods : {
            openPanel(params, no){
                this.isOpen = !this.isOpen;
                
                if(!$xt.isEmpty(params)){
                    console.log(params, no);
                    let cerrent = $linq(params.children).where(x => x.req_no == no).firstOrDefault();
                    this.header = params;
                    this.total_page = params.children.length || 1;
                    cerrent.req_date_preview = moment(cerrent.req_date).format('DD/MM/YYYY HH:mm');
                    this.detail = cerrent;
                    console.log(cerrent);
                    this.panel_paging(params, no)
                }
                
            },
            panel_paging(params, id){
                /* 
                    หาหน้าปัจจุบัน 
                    หาหน้าถัดไป
                */
               let cur_p = $linq(params.children).indexOf(x => x.req_no == id);
               let next_p = cur_p + 1
               this.current_page = cur_p;
               this.next_page = next_p;
            },
            pageChange(navigator){
                let item = this.detail
                let idx = navigator == "next" ? parseInt(item.itemno) + 1 : parseInt(item.itemno) - 1
                let parseItem = $linq(this.header.children).where(w => parseInt(w.itemno) === idx).firstOrDefault()
                
                parseItem.req_date_preview = moment(parseItem.req_date).format('DD/MM/YYYY HH:mm');
                this.$set(this, 'detail', JSON.parse(JSON.stringify(parseItem)))
                //console.log(pn);
            }
        },
        mounted(){

        }
    }
</script>
<style>
    .pointer{
        cursor : pointer;
    }
    .req-paging{
        position: absolute;
        right: 10px;
    }
    .panel-req-detail{
        background: #ecf0f5;
        position : fixed;
        display: none;
        top : 50px;
        bottom : 0;
        transition: opacity 1s ease-out;
        opacity: 0;
        width: 100%;
        height: 89%;
        z-index: 1050;
        margin-left: -15px;
    }
    .open-panel{
        display : block;
        opacity: 1;
    }
    .panel-req-header{
        padding: 15px;
        background: #fff;
    }
    .detail-body{
        background: #fff;
        border-radius: 5px;
        padding-top : 10px;
        padding-bottom: 10px;
    }
    .image-req-preview{
        float: left;
        width: 33.33%;
        padding: 5px;
        cursor: pointer;
    }
    .img-preview{
        background: #fff !important;
        border: 1px solid #eee;
        padding: 5px;
        border-radius: 5px;
        margin-left: 0px;
    }
    .btn-navy{
        background: #001F3F;
        color : #fff;
    }
</style>