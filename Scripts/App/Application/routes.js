let routes = [{
        name: 'start',
        path: '/page/',
        component: () =>
            import ('./Components/Pages/Default/home.vue'),
        meta: {
            auth: true,
            mangoMenu: {
                menu_name: '',
                menu_id: '',
                checkUserRight: false
            }
        }
    },
    {
        name: 'login',
        path: '/page/authentication/login/',
        component: () =>
            import ('./Components/Pages/Authentication/login.vue'),
        meta: {
            auth: false
        }
    },
    {
        name: 'login_cust',
        path: '/page/authentication/login_cust/',
        component: () =>
            import ('./Components/Pages/Authentication/login_cust.vue'),
        meta: {
            auth: false,
            auth: false,
        }
    },
    /* Home */
    {
        name: 'CustomerData',
        path: '/page/customerdata/',
        component: () =>
            import ('./Components/Pages/Default/CustomerData.vue'),
        meta: {
            auth: true,
        }
    },
    {
        name: 'CustomerDataView',
        path: '/page/customerdataview/',
        component: () =>
            import ('./Components/Pages/Default/CustomerDataView.vue'),
        meta: {
            auth: true
        }
    },
    {
        name: 'Form',
        path: '/page/form/',
        component: () =>
            import ('./Components/Pages/Default/Form.vue'),
        meta: {
            auth: true
        }
    },
    {
        name: 'FormDetail',
        path: '/page/formdetail/',
        component: () =>
            import ('./Components/Pages/Default/FormDetail.vue'),
        meta: {
            auth: true
        }
    },
    {
        name: 'MasterData',
        path: '/page/master/',
        component: () =>
            import ('./Components/Pages/Default/Master.vue'),
        meta: {
            auth: true
        }
    },
    /* Dashboard */
    {
        name: 'v_csm_dashboard',
        path: '/page/Dashboard/v_csm_dashboard/',
        component: () =>
            import (`./Components/Pages/Dashboard/v_csm_dashboard.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_dashboard2',
        path: '/page/Dashboard/v_csm_dashboard2/',
        component: () =>
            import (`./Components/Pages/Dashboard/v_csm_dashboard2.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_most_defect',
        path: '/page/Dashboard/v_csm_most_defect/',
        component: () =>
            import (`./Components/Pages/Dashboard/v_csm_most_defect.vue`),
        meta: {
            auth: true
        }
    },
    /* Transaction */
    {
        name: 'v_csm_trn_001',
        path: '/page/Transaction/v_csm_trn_001/',
        component: () =>
            import (`./Components/Pages/Transaction/v_csm_trn_001.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_trn_002',
        path: '/page/Transaction/v_csm_trn_002/',
        component: () =>
            import (`./Components/Pages/Transaction/v_csm_trn_002.vue`),
        meta: {
            auth: true
        }
    },
    /* Master */
    {
        name: 'v_csm_mas_001',
        path: '/page/master/v_csm_mas_001/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_001.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_002',
        path: '/page/master/v_csm_mas_002/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_002.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_003',
        path: '/page/master/v_csm_mas_003/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_003.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_004',
        path: '/page/master/v_csm_mas_004/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_004.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_005',
        path: '/page/master/v_csm_mas_005/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_005.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_006',
        path: '/page/master/v_csm_mas_006/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_006.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_007',
        path: '/page/master/v_csm_mas_007/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_007.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_008',
        path: '/page/master/v_csm_mas_008/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_008.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_009',
        path: '/page/master/v_csm_mas_009/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_009.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_010',
        path: '/page/master/v_csm_mas_010/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_010.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_011',
        path: '/page/Master/v_csm_mas_011/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_011.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_012',
        path: '/page/Master/v_csm_mas_012/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_012.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_013',
        path: '/page/Master/v_csm_mas_013/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_013.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_014',
        path: '/page/Master/v_csm_mas_014/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_014.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_015',
        path: '/page/Master/v_csm_mas_015/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_015.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_016',
        path: '/page/Master/v_csm_mas_016/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_016.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_017',
        path: '/page/Master/v_csm_mas_017/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_017.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_mas_018',
        path: '/page/Master/v_csm_mas_018/',
        component: () =>
            import (`./Components/Pages/Master/v_csm_mas_018.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_cus_001',
        path: '/page/Customer/v_csm_cus_001/',
        component: () =>
            import (`./Components/Pages/Customer/v_csm_cus_001.vue`),
        meta: {
            auth: true
        }
    },
    /* Report */
    {
        name: 'v_csm_rpt_001',
        path: '/page/Report/v_csm_rpt_001/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_rpt_001.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_rpt_002',
        path: '/page/Report/v_csm_rpt_002/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_rpt_002.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_rpt_003',
        path: '/page/Report/v_csm_rpt_003/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_rpt_003.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_rpt_004',
        path: '/page/Report/v_csm_rpt_004/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_rpt_004.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_rpt_005',
        path: '/page/Report/v_csm_rpt_005/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_rpt_005.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_rpt_006',
        path: '/page/Report/v_csm_rpt_006/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_rpt_006.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_war_rpt01',
        path: '/page/Report/v_csm_war_rpt01/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_war_rpt01.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_war_rpt02',
        path: '/page/Report/v_csm_war_rpt02/',
        component: () =>
            import (`./Components/Pages/Report/v_csm_war_rpt02.vue`),
        meta: {
            auth: true
        }
    },
    /* External View */
    {
        name: 'v_csm_external',
        path: '/page/External/v_csm_external/',
        component: () =>
            import (`./Components/Pages/external/v_csm_external.vue`),
        meta: {
            customer: true,
            customer_auth: true
        }
    },
    {
        name: 'v_mas_update_list',
        path: '/page/External/v_mas_update_list/',
        component: () =>
            import (`./Components/Pages/external/v_mas_update_list.vue`),
        meta: {
            customer: true,
            customer_auth: true
        }
    },
    {
        name: 'v_mas_form_sign',
        path: '/page/External/v_mas_form_sign/',
        component: () =>
            import (`./Components/Pages/external/v_mas_form_sign.vue`),
        meta: {
            customer: true,
            customer_auth: true
        }

    },
    {
        name: 'v_csm_external_detail',
        path: '/page/External/v_csm_external_detail/',
        component: () =>
            import (`./Components/Pages/external/v_csm_external_detail`),
        meta: {
            customer: true,
            customer_auth: true
        }

    },
    {
        name: 'v_csm_settings',
        path: '/page/External/v_csm_settings/',
        component: () =>
            import (`./Components/Pages/external/v_csm_settings`),
        meta: {
            customer: true,
            customer_auth: true
        }
    },
    {
        name: 'v_csm_request_d',
        path: '/page/External/v_csm_request_d/',
        component: () =>
            import (`./Components/Pages/external/v_csm_request_d.vue`),
        meta: {
            customer: true,
            customer_auth: true
        }
    },
    {
        name: 'v_csm_request',
        path: '/page/External/v_csm_request/',
        component: () =>
            import (`./Components/Pages/external/v_csm_request`),
        meta: {
            customer: true,
            customer_auth: true
        }
    },
    /* FAQ */
    {
        name: 'v_faq_item_type',
        path: '/page/faq/v_faq_item_type/',
        component: () =>
            import (`./Components/Pages/FAQ/v_faq_item_type.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_faq_create',
        path: '/page/faq/v_faq_create/',
        component: () =>
            import (`./Components/Pages/FAQ/v_faq_create.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_faq_view',
        path: '/page/article',
        component: () =>
            import (`./Components/Pages/FAQ/v_faq_view.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_faq_view_detail',
        path: '/page/article_detail',
        component: () =>
            import (`./Components/Pages/FAQ/v_faq_view_detail.vue`),
        meta: {
            auth: true
        }
    },
    /* Manual List */
    {
        name: 'v_csm_manual_list',
        path: '/page/manual/v_csm_manual_list/',
        component: () =>
            import (`./Components/Pages/Manual/v_csm_manual_list.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_manual_list_v2',
        path: '/page/manual/v_csm_manual_list_v2/',
        component: () =>
            import (`./Components/Pages/Manual/v_csm_manual_list_v2.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_manual_list_admin',
        path: '/page/manual/v_csm_manual_list_admin/',
        component: () =>
            import (`./Components/Pages/Manual/v_csm_manual_list_admin.vue`),
        meta: {
            auth: true
        }
    },
    /* History */
    {
        name: 'v_csm_call_history',
        path: '/page/history/v_csm_call_history/',
        component: () =>
            import (`./Components/Pages/History/v_csm_call_history.vue`),
        meta: {
            auth: true
        }
    },
    /* Tools */
    {
        name: 'v_csm_employee',
        path: '/page/Tools/v_csm_employee/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_employee.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_emp_d',
        path: '/page/Tools/v_csm_emp_d/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_emp_d.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_passcode',
        path: '/page/Tools/v_csm_passcode/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_passcode.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_revision',
        path: '/page/Tools/v_csm_revision/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_revision.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_tools',
        path: '/page/Tools/v_csm_tools/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_tools.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_doc_running',
        path: '/page/Tools/v_csm_doc_running/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_doc_running.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_erp_config',
        path: '/page/Tools/v_csm_erp_config/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_erp_config.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_db_list',
        path: '/page/Tools/v_csm_db_list/',
        component: () =>
            import (`./Components/Pages/Tools/v_csm_db_list.vue`),
        meta: {
            auth: true
        }
    },
    /* Others */
    {
        name: 'v_csm_config_001',
        path: '/page/Config/v_csm_config_001/',
        component: () =>
            import (`./Components/Pages/Config/v_csm_config_001.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_config_002',
        path: '/page/Config/v_csm_config_002/',
        component: () =>
            import (`./Components/Pages/Config/v_csm_config_002.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'v_csm_config_003',
        path: '/page/Config/v_csm_config_003/',
        component: () =>
            import (`./Components/Pages/Config/v_csm_config_003.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'access_denied',
        path: '/page/error/access_denied/',
        component: () =>
            import ('./Components/Errors/403.vue')
    },
    {
        name: 'content_not_found',
        path: '*',
        component: () =>
            import (`./Components/Errors/404.vue`)
    },
    //Approve
    {
        name: 'Approve Documents',
        path: '/page/Approve/v_csm_approve/',
        component: () =>
            import (`./Components/Pages/Approve/v_csm_approve.vue`),
        meta: {
            auth: true
        }
    },
    //Tracking
    {
        name: 'Tracking Bug Menu',
        path: '/page/Tracking/v_tracking_bug_001/',
        component: () =>
            import (`./Components/Pages/Tracking/v_tracking_bug_001.vue`),
        meta: {
            auth: true
        }
    },
    {
        name: 'Testlogin',
        path: '/page/Transaction/logintest',
        component: () =>
            import (`./Components/Pages/Transaction/logintest`),
        meta: {
            auth: true
        }
    },
    {
        name: 'Detail',
        path: '/page/Transaction/detail',
        component: () =>
            import (`./Components/Pages/Transaction/detail`),
        meta: {
            auth: true
        }
    },
    {
        name: 'Detail2',
        path: '/page/Transaction/detail2',
        component: () =>
            import (`./Components/Pages/Transaction/detail2`),
        meta: {
            auth: true
        }
    },
    //{
    //  name: 'Tracking Bug V0.5',
    //  path: '/page/Tracking/v_tracking_bug_002/',
    //  component: () => import(`./Components/Pages/Tracking/v_tracking_bug_002.vue`),
    //  meta: {
    //    auth: true
    //  }
    //},
];
export default routes;