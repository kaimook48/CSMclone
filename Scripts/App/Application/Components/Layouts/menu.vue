<template>
  <div>
    <ul class="sidebar-menu tree" data-widget="tree">
      <li><a :href="baseUrl+'page/'"><img :src="`${baseUrl}Content/Images/Icon SVG/home.svg`" width="20" />&nbsp;<span>{{ui.view_home_page||'หน้าหลัก'}}</span></a></li>
      <template v-for="x in menu">
        <li :class="{'treeview':x.children.length>0 && !x.disabled}">
          <a :href="x.link||'#'" :class="{link_disabled:x.disabled}" @click="canGo($event, x.disabled)" target="_blank" v-if="x.show">
            <img :src="`${baseUrl}Content/Images/Icon SVG/${x.icon}.svg`" width="20" />&nbsp;<span> {{x.display_text}}</span><span class="pull-right-container" v-if="x.children.length>0">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul v-if="x.children.length>0 && !x.disabled" class="treeview-menu">
            <template v-for="y in x.children">
              <li :class="{'treeview':y.children.length>0 && !y.disabled}">
                <a :href="y.link||'#'" :class="{link_disabled:y.disabled}" @click="canGo($event, y.disabled)" v-if="y.show"><i :class="{'fas fa-circle': y.children.length > 0, 'far fa-circle': y.children.length == 0}"></i> <span> {{y.display_text}}</span></a>
                <ul v-if="y.children.length>0 && !y.disabled" class="treeview-menu">
                  <li v-for="z in y.children"><a :href="z.link||'#'" @click="canGo($event, z.disabled)" v-if="z.show"><i class="far fa-circle"></i> {{z.display_text}}</a></li>
                </ul>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        auth,
        menu: [],
        baseUrl: window.baseUrl,
        ui: window.ui,
        xt: $xt,
      }
    },
    methods: {
      isDeveloper() {
        let department = auth.empcode.substring(0, 2);
        return department == 'IT';
      },
      isShowReport() {
        return this.isDeveloper() || ["AD007", "AD004"].includes(this.auth.empcode);
      },
      canGo(e, dis) {
        if (dis) {
          e.preventDefault();
        }
      },
      createMenu() {
        let menu =
          [
            {
              menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_dashboard || 'Dashboard', link: '', check_right: false, icon: "monitor", show: true, children: [
                { menu_name: 'CSM_WEB', menu_id: '', display_text: 'Customer Service Dashboard', link: baseUrl + 'page/dashboard/v_csm_dashboard', check_right: false, show: true, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: 'All Company Dashboard', link: baseUrl + 'page/dashboard/v_csm_dashboard2', check_right: false, show: true, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: 'Most Defect Dashboard', link: baseUrl + 'page/dashboard/v_csm_most_defect', check_right: false, show: true, children: [] }
              ],
            },
            {
              menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_create_doc || 'Create Document', link: baseUrl + 'page/transaction/v_csm_trn_001/', check_right: false, icon: "edit", show: true, children: [],
            },
            {
              menu_name: 'CSM_WEB', menu_id: '', display_text: ui.menu_report || 'Reports', link: '', check_right: false, icon: "file", show: true, children: [
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_asses_report || 'รายงานการประเมินความพึงพอใจ', link: baseUrl + 'page/report/v_csm_rpt_001/', show: true, check_right: false, children: [] },
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_status_report || 'รายงานติดตามสถานะงาน', link: '', show: true, check_right: false, children: [
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'ตามสถานะงาน', link: baseUrl + 'page/report/v_csm_rpt_002/', show: true, check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'ตามโครงการ', link: baseUrl + 'page/report/v_csm_rpt_005/', show: this.isShowReport(), check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'Tester', link: baseUrl + 'page/report/v_csm_rpt_006/', show: this.isMango(), check_right: false, children: [] },
                  ]
                },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: 'รายงานสรุป CSM คงค้าง', link: baseUrl + 'page/report/v_csm_rpt_004/', show: this.isMango(), check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: 'Requirement Check List', link: baseUrl + 'page/report/v_csm_rpt_003/', show: this.isMango(), check_right: false, children: [] },
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_warranty_report || 'Warranty Report', link: '', show: true, check_right: false, children: [
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'Warranty', link: baseUrl + 'page/report/v_csm_war_rpt01/', show: !this.isMango(), check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'Warranty', link: baseUrl + 'page/report/v_csm_war_rpt02/', show: this.isMango(), check_right: false, children: [] },
                  ]
                },
              ],
            },
            {
              menu_name: 'CSM_WEB', menu_id: '', display_text: ui.re_master_setup || 'Master Setup', link: '', icon: "folder", show: true, check_right: false, children: [
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_priority || 'Setup Priority', link: baseUrl + 'page/master/v_csm_mas_009/', show: true, check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_connect || 'Setup Connection', link: baseUrl + 'page/master/v_csm_mas_005/', show: true, check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_service || 'Setup Service Type', link: baseUrl + 'page/master/v_csm_mas_006/', show: true, check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_subject || 'Subject Service Type', link: baseUrl + 'page/master/v_csm_mas_017/', show: !this.isMango(), check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_req || 'Setup Request Type', link: baseUrl + 'page/master/v_csm_mas_010/', show: true, check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_project || 'Setup Project Work', link: baseUrl + 'page/master/v_csm_mas_007/', show: true, check_right: false, children: [] },
                { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_description || 'Setup Description', link: baseUrl + 'page/master/v_csm_mas_015/', show: true, check_right: false, children: [] },
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_warranty || 'Setup Warranty', link: '', show: true, check_right: false, children: [
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.re_group_insurance || 'กลุ่มงานประกัน', link: baseUrl + 'page/master/v_csm_mas_001/', show: true, check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.re_insurance_list || 'รายการประกัน', link: baseUrl + 'page/master/v_csm_mas_002/', show: true, check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_increase_area || 'เพิ่มพื้นที่ในโครงการ', link: baseUrl + 'page/master/v_csm_mas_003/', show: true, check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_area || 'ตั้งค่าพื้นที่โครงการ', link: baseUrl + 'page/master/v_csm_mas_004/', show: true, check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_start_waranty || 'เริ่มต้นรายการประกัน', link: baseUrl + 'page/master/v_csm_mas_008/', show: true, check_right: false, children: [] },
                  ]
                },
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_cust || 'Setup Customers', link: '', check_right: false, show: true, children: [
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_cust_list || 'รายการลูกค้า', link: baseUrl + 'page/customer/v_csm_cus_001/', show: true, check_right: true },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_workflow || 'Setup Workflow', link: baseUrl + 'page/master/v_csm_mas_013/', show: this.isMango(), check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.module || 'Setup Module', link: baseUrl + 'page/master/v_csm_mas_014/', show: this.isMango(), check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_setup_subject || 'Setup Subject', link: baseUrl + 'page/master/v_csm_mas_016/', show: this.isMango(), check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_package || 'Setup Package', link: baseUrl + 'page/master/v_csm_mas_018/', show: this.isMango(), check_right: false, children: [] },
                  ]
                },
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_set_asses || 'ตั้งค่าชุดคำถามประเมิน', link: '', show: true, check_right: false, children: [
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_asses_q || 'ตั้งค่าคำถามประเมิน', link: baseUrl + 'page/master/v_csm_mas_011/', show: true, check_right: true },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: ui.csm_manage_q || 'จัดการชุดคำถาม', link: baseUrl + 'page/master/v_csm_mas_012', show: true, check_right: true },
                  ]
                },
              ]
            },
            {
              menu_name: 'CSM_WEB', menu_id: '', display_text: 'สำหรับแอดมินเท่านั้น', link: '', check_right: false, icon: "admin", show: this.auth.is_admin, children: [
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: 'ตั้งค่าผู้ให้บริการ', link: "", show: true, check_right: false, children: [
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'จัดการหมายเลขโทรศัพท์', link: baseUrl + 'page/config/v_csm_config_001/', show: true, check_right: false, children: [] },
                    { menu_name: 'CSM_WEB', menu_id: '', display_text: 'จัดการสถานะผู้ให้บริการ', link: baseUrl + 'page/config/v_csm_config_002/', show: true, check_right: false, children: [] },
                  ]
                },
                {
                  menu_name: 'CSM_WEB', menu_id: '', display_text: 'ตั้งค่าโปรแกรม', link: baseUrl + 'page/config/v_csm_config_003/', show: true, check_right: false, children: [],
                },
              ],
            },
          ];

        this.menu = menu;
      },
      isMango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        return isMango == "Y" ? true : false;
      },
    },
    computed: {
      configData() { return store.state.configData },
    },
    async beforeMount() {
      await this.$store.dispatch('findConfig')
    },
    mounted() {
      (async () => {
        await $xt.sleep(1100)
        //do {
        //  console.log("LoadMenu");
        //  await $xt.sleep(500)
        //} while (this.configData.length == 0);

        this.createMenu()
        this.$nextTick(() => {
          $('[data-widget="tree"]').tree();
        });
      })()


    }
  }
</script>
<style scoped>
  .link_disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .treeview-menu {
    white-space: normal;
  }
</style>
