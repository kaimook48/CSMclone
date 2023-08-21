<template>
    <div>
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover">
                <thead>
                <tr>
                    <th style="width:80px">#</th>
                    <th style="width:200px">No.</th>
                    <th style="width:200px">Req No</th>
                    <th style="width:400px">Req Date</th>
                    <th style="width:500px">Contact User</th>
                    <th style="width:150px">Phone</th>
                    <th style="width:250px">E-mail</th>
                    <th style="width:500px">Case Type</th>
                    <th style="width:200px">Module</th>
                    <th style="width:400px">Subject</th>
                    <th style="width:900px">Description</th>
                    <th style="width:100px">Picture</th>
                </tr>
                </thead>
                <tbody>
                    <template v-for="x in dataList">
                        <tr v-if="x.header == 0" style="background : #EAEAEA">
                            <td>                                  
                                <span class="checkbox checkbox-inline" style="margin-top:5px">
                                    <label>
                                        <input type="checkbox" true-value="Y" false-value="N" v-model="x.select" @change="selectRow(x, 'header')" />
                                        <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                    </label>
                                </span>
                            </td>
                            <td colspan="11">{{ x.name }}</td>
                        </tr>
                        <tr v-for="v in x.children" style="background : #FFF">
                            <td>
                                <span class="checkbox checkbox-inline" style="margin-top:5px">
                                    <label>
                                        <input type="checkbox" true-value="Y" false-value="N" v-model="v.select" @change="selectRow(x, 'sub')" />
                                        <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                    </label>
                                </span>
                            </td>
                            <td align="center">{{ v.itemno }}</td>
                            <td align="center" class="p-link" @click="openDetailReq(x, v.req_no)">{{ v.req_no }}</td>
                            <td>{{ v.req_date | date('DD/MM/YYYY HH:mm') }}</td>
                            <td>{{ v.contact_name }}</td>
                            <td>{{ v.phone }}</td>
                            <td>{{ v.email }}</td>
                            <td>{{ v.case_type }}</td>
                            <td align="center">{{ v.module }}</td>
                            <td>{{ v.subject }}</td>
                            <td>{{ v.desc }}</td>
                            <td align="center"><i class="fas fa-camera pointer" @click="viewImage(v.picture)"></i>&nbsp;&nbsp;{{ v.picture.length }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <detailReq ref="detail_req"></detailReq>
    </div>
</template>
<script>
    import detailReq from './detailReqComponent.vue'
    export default{
        components : {
            detailReq
        },
        props : [ 'filter' ],
        data(){ 
            return {
                /*-------- API Data ---------*/ 
                dataList : [],
                imgList : []
            }
        },
        methods: {
            loadApi(filter){
                console.log(filter);

                let data = [
                    { select : 'N', name : 'บริษัท กิตติมาศักดิ์ จำกัด', header : '0', children : [
                        { select : 'N', itemno : '1', req_no : 'LO904589', req_date : new Date(), contact_name : 'คุณเพ็ญพักตร์ กาญจนาภรณ์', phone : '087-9999999', email : 'jkkoi@gmail.com', case_type : 'แบบฟอร์มและรายงาน Erorr', module : 'AP', subject : 'ข้อมูลมาแสดงไม่ครบ', desc : ' ต้องการขอคู่มือการใช้งาน เนื่องจากเป็นพนักงานใหม่', detail_contact : 'โทรคุยแล้วติดต่อไม่ได้กรุณาติดต่อที่เบอร์ 081-1254638 ลูกค้าไม่ซ่อม', picture : [ { path : 'https://www.w3schools.com/howto/img_forest.jpg' },{ path : 'https://www.w3schools.com/howto/img_snow.jpg' },{ path : 'https://www.w3schools.com/howto/img_mountains.jpg' } ] },
                        { select : 'N', itemno : '2', req_no : 'LO904590', req_date : new Date(), contact_name : 'คุณเพ็ญพักตร์ กาญจนาภรณ์', phone : '087-0000000', email : 'jkkoi@gmail.com', case_type : 'แบบฟอร์มและรายงาน Erorr', module : 'AP', subject : 'ข้อมูลมาแสดงไม่ครบ', desc : ' ต้องการขอคู่มือการใช้งาน เนื่องจากเป็นพนักงานใหม่', detail_contact : 'โทรคุยแล้วติดต่อไม่ได้กรุณาติดต่อที่เบอร์ 081-1254638 ลูกค้าไม่ซ่อม', picture : [ { path : 'https://www.w3schools.com/howto/img_snow.jpg' } ] }
                    ] },
                    { select : 'N', name : 'บริษัท เมเจอร์ จำกัด', header : '0', children : [
                        { select : 'N', itemno : '1', req_no : 'LO904590', req_date : new Date(), contact_name : 'คุณเพ็ญพักตร์ กาญจนาภรณ์', phone : '087-9999999', email : 'jkkoi@gmail.com', case_type : 'แบบฟอร์มและรายงาน Erorr', module : 'AP', subject : 'ข้อมูลมาแสดงไม่ครบ', desc : ' ต้องการขอคู่มือการใช้งาน เนื่องจากเป็นพนักงานใหม่', detail_contact : 'โทรคุยแล้วติดต่อไม่ได้กรุณาติดต่อที่เบอร์ 081-1254638 ลูกค้าไม่ซ่อม', picture : [ { path : 'https://www.w3schools.com/howto/img_mountains.jpg' } ] },
                        { select : 'N', itemno : '2', req_no : 'LO904590', req_date : new Date(), contact_name : 'คุณเพ็ญพักตร์ กาญจนาภรณ์', phone : '087-0000000', email : 'jkkoi@gmail.com', case_type : 'แบบฟอร์มและรายงาน Erorr', module : 'AP', subject : 'ข้อมูลมาแสดงไม่ครบ', desc : ' ต้องการขอคู่มือการใช้งาน เนื่องจากเป็นพนักงานใหม่', detail_contact : 'โทรคุยแล้วติดต่อไม่ได้กรุณาติดต่อที่เบอร์ 081-1254638 ลูกค้าไม่ซ่อม', picture : [ { path : 'https://www.w3schools.com/howto/img_forest.jpg' } ] }
                    ] }
                ];

                this.dataList = data;
            },
            /*-------- Action Prevent -----------*/
            selectRow(item, type){
                console.log(item, type);
                if(type == 'header'){
                   item.children.forEach(v => { item.select == "Y" ? v.select = "Y": v.select = "N" })
                }
                if(type == 'sub'){
                    let checkSelect = $linq(item.children).all(x => x.select == "Y");
                    if(checkSelect){
                        item.select = "Y"
                    }else{
                        item.select = "N"
                    }
                }
            },
            openDetailReq (item, no){
                console.log(this.$root);
                this.$refs.detail_req.openPanel(item, no);
            },
            viewImage(source){
                this.$emit('send-data', source)
            }
        },
        mounted(){
            this.loadApi();
        }
    }
</script>
<style>
    
</style>