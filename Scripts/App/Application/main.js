import Vue from 'vue'
import VueRouter from 'vue-router'
import VTooltip from 'v-tooltip'
import vueEventCalendar from 'vue-event-calendar'
import feather from 'vue-icon'
import actionLink from './Components/Center/action-link.vue'
import { formatNumberFilter, formatDateFilter } from './vue-filters'
import datepicker from './Components/Center/datepicker.vue'
import timepicker from './Components/Center/timepicker.vue'
import inumber from './Components/Center/number.vue'
import pagination from './Components/Center/pagination.vue'
import modal from './Components/Center/modal.vue'
import appForm from './Components/Center/form-template.vue'
import rePage from './Components/Layouts/re-layout.vue'
import customerPage from './Components/Layouts/customer-layout.vue'
import Navbar from './Components/Layouts/navbar.vue';
import NavbarD from './Components/Layouts/navbarD.vue';
import tableStick from './Components/Center/table-sticky.vue'
import tableStick2 from './Components/Center/table-sticky-2.vue'
import input from './Components/Center/input.vue'
import routes from './routes'
import store from './Store/store.js'
import select2 from './Components/Center/select-2.vue'

import 'vue-event-calendar/dist/style.css'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import VueCurrencyFilter from 'vue-currency-filter'
import ElementLoading from 'vue-element-loading'
import VueSelect2 from 'v-select2-component'

Vue.config.keyCodes.f2 = 113
Vue.use(VueRouter)
Vue.use(VTooltip)
Vue.use(feather, 'v-icon')
Vue.use(vueEventCalendar, { locale: 'en', color: '#010c1b' })
Vue.use(VueSweetalert2)

Vue.use(VueCurrencyFilter, {
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.',
})

Vue.filter('date', formatDateFilter)
Vue.filter('number', formatNumberFilter)

Vue.component('action-link', actionLink)
Vue.component('datepicker', datepicker)
Vue.component('timepicker', timepicker)
Vue.component('number', inumber)
Vue.component('app-form', appForm)
Vue.component('re-page', rePage)
Vue.component('navbar', Navbar)
Vue.component('navbarD', NavbarD)
Vue.component("customer-page", customerPage)
Vue.component('modal', modal)
Vue.component('pagination', pagination)
Vue.component('table-stick', tableStick)
Vue.component('table-stick-2', tableStick2)
Vue.component('select-2', select2)
Vue.component('vue-element-loading', ElementLoading)
Vue.component('i-input', input)

/* Modal : Center */
import ModalProject from './Components/Pages/Center/ct-project.vue'
import Modal2Project from './Components/Pages/Center/ct-project-2.vue'
import ModalProjectUnit from './Components/Pages/Center/ct-project-unit.vue'
import ModalWorkType from './Components/Pages/Center/ct-worktype.vue'
import ModalDepartment from './Components/Pages/Center/ct-department.vue'
import ModalCMCustomer from './Components/Pages/Center/ct-cm-customer.vue'
import ModalARCustomer from './Components/Pages/Center/ct-ar-customer.vue'
import ModalEMP from './Components/Pages/Center/ct-hr-emp.vue'
import ModalResponsibleEMP from './Components/Pages/Center/ct-emp-proj.vue'
import ModalItemCode from './Components/Pages/Center/ct-ibrcode.vue'
import ModalForm from './Components/Pages/Center/ct-form.vue'

Vue.component('vue-project-list', ModalProject)
Vue.component('vue-project2-list', Modal2Project)
Vue.component('vue-project-unit-list', ModalProjectUnit)
Vue.component('vue-department-list', ModalDepartment)
Vue.component('vue-worktype-list', ModalWorkType)
Vue.component('vue-cm-customer-list', ModalCMCustomer)
Vue.component('vue-ar-customer-list', ModalARCustomer)
Vue.component('vue-employee-list', ModalEMP)
Vue.component('vue-responsible-employee-list', ModalResponsibleEMP)
Vue.component('vue-itemcode-list', ModalItemCode)
Vue.component('vue-form-list', ModalForm)
Vue.component('vue-select-2', VueSelect2)

/* Vue Router */
const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.meta.redirect) {
        window.location.href = to.meta.redirect
        return
    }

    (async() => {
        let menu_name = ''
        let menu_id = ''
        let checkRight = false

        if (to.meta.mangoMenu && to.meta.mangoMenu.checkUserRight) {
            checkRight = true
            menu_name = to.meta.mangoMenu.menu_name || ''
            menu_id = to.meta.mangoMenu.menu_id || ''
        }

        let resp_lang = await $xt.getServer(`api/public/LanguageSelector?lang_code=${localStorage.getItem('user_lang') || ''}`)
        let lang = resp_lang.data.uiLang
        window.ui = lang
        window.langList = resp_lang.data.lang

        if (to.name == 'login') {
            if (window.location.hostname === 'csr.mangoconsultant.com' && window.location.href.toLowerCase().indexOf('/login_cust/') < 0) {
                window.location.href = '/page/authentication/login_cust/'
                return
            }
        }

        if (to.meta.auth) {
            let resp_init = await $xt.getServer(`api/public/ViewInitData2?menu_name=${menu_name}`)
            let auth = resp_init.data.auth
            let appinfo = resp_init.data.appinfo
            let userRight = resp_init.data.menu_right || []
            let projectRight = resp_init.data.project_right || []

            window.auth = auth
            window.appinfo = appinfo
            window.userRight = userRight
            window.projectRight = projectRight
        }

        if (to.meta.customer) {
            let rsp = await $xt.getCustomerServer(`CSM/AuthCustomer/GetInitCustomerData`)
            let customerAuth = rsp.data.cus_auth
            window.customer_auth = customerAuth
            if (to.meta.customer_auth && !customerAuth.is_authen) {
                window.location.href = baseUrl + 'page/authentication/login_cust/'
            }
        }

        if (checkRight && to.name !== 'access_denied') {
            let isEnable = $linq(window.userRight).any(x => x.menu_id === menu_id && x.isenable === 1)
            if (!isEnable) {
                window.location.href = baseUrl + `page/error/access_denied/`
                return
            }

            if (window.projectRight.length > 0) {
                let pre_event2 = $xt.queryString.pre_event2 || ''
                if ($xt.isEmpty(pre_event2) && !$xt.isEmpty($xt.queryString.pre_event)) {
                    let pre_event = $xt.queryString.pre_event || ''
                    pre_event2 = pre_event.substring(pre_event.length - 4, pre_event.length) + pre_event.substring(0, 3)
                }
                if (!$xt.isEmpty(pre_event2)) {
                    if (!$linq(window.projectRight).any(x => x.pre_event2 === pre_event2)) {
                        window.location.href = baseUrl + `page/error/access_denied/`
                        return
                    }
                }
            }
        }

        if (to.meta.isAdmin && !auth.is_admin) {
            window.location.href = baseUrl + `page/error/access_denied/`
            return
        }

        if (to.meta.userMango && auth.userid.toLowerCase() !== 'mango') {
            window.location.href = baseUrl + `page/error/access_denied/`
            return
        }

        if (to.name === 'login' && auth.is_authen) {
            window.location.href = baseUrl + 'page/'
        } else if (to.meta.auth && !auth.is_authen) {
            window.location.href = baseUrl + 'page/authentication/login/'
        } else {
            $('#firstLoading').hide()
            next()
        }
    })()
})

new Vue({
    store,
    router,
}).$mount("#app")