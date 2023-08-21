<template>
  <div>
    <re-page ref="page">
      <template #body>
        <div class="row">
          <div class="col-lg-3 col-md-12 col-sm-12 hidden-sm hidden-xs">
            <!-- Panel : Search Customer Panel -->
            <div class="row">
              <div class="col-md-12">
                <div class="box box-solid">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-search"></i>&nbsp;{{ui.csm_cust_search || 'ค้นหาข้อมูลลูกค้า'}}</h3>
                  </div>
                  <div class="box-body hidden-sm hidden-xs">
                    <vue-element-loading :active="customerLoading" spinner="spinner" color="#02234e" text="ระบบกำลังค้นหาข้อมูลของท่าน กรุณารอสักครู่..." />
                    <!-- Search box -->
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <div class="input-group">
                            <input type="text" class="form-control input-sm" v-model.trim="customerSearch" v-bind:placeholder="ui.csm_search_key || 'Keyword : ชื่อ เบอร์โทรศัพท์ อีเมล'" @keyup.enter="searchCustomer()" />
                            <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="searchCustomer()"><i class="fa fa-search"></i></button></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Customer Total -->
                    <div class="row">
                      <div class="col-md-12">
                        <b class="pull-right">{{ui.csm_searsh_results||'ผลลัพธ์ของการค้นหามีทั้งหมด'}} {{customerTotal || 0}} {{ui.re_items||'รายการ'}}</b>
                      </div>
                    </div>
                    <!-- List Data Customer -->
                    <ul class="nav nav-pills nav-stacked">
                      <li v-for="(x,idx) in customerlist">
                        <a href="#" @click.prevent="openCSMbyCustomer(x)">
                          <i class="ion ion-person"></i> {{x.name_th}}
                          <b class="pull-right">{{x.customer_type == 'CM_CUSTOMER' ? 'ข้อมูลจากลูกค้าใหม่' : 'ข้อมูลจากลูกหนี้'}}</b><br />
                          <i class="ion ion-android-phone-portrait"></i> {{xt.isEmpty(x.tel) ? '-' : x.tel}}<br />
                          <i class="ion ion-email"></i> {{xt.isEmpty(x.mail) ? '-' : x.mail}}<br />
                          โครงการ : {{x.project}}
                        </a>
                      </li>
                    </ul>
                    <!-- Pagination , Button Add Customer -->
                    <div style="margin-top: 10px" v-show="!is_mango()">
                      <pagination class="pull-left" ref="customerPaging" @page-change="pageChange($event.page, 'customer')"></pagination>
                      <span class="pull-right"><button class="btn btn-sm bg-olive" @click="mainOpenCustomer()"><i class="fa fa-edit"></i> {{ui.re_add_customers || 'เพิ่มข้อมูลลูกค้า'}}</button></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Panel : Customer Service -->
            <div class="row">
              <div class="col-md-12">
                <div class="box box-solid">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-user"></i>&nbsp;{{ui.csm_cust_service||'ผู้ให้บริการลูกค้า'}}</h3>
                  </div>
                  <div class="box-body no-padding" style="max-height:200px;overflow-y:auto">
                    <ul class="nav nav-pills nav-stacked">
                      <li v-for="x,idx in callCenterStatus">
                        <a href="#">
                          <i class="ion ion-android-phone-portrait"></i> {{x.agent_name}}
                          <span class="pull-right">
                            <span v-if="xt.isEmpty(x.state_code)">ไม่พบสถานะ <i class="fa fa-circle"></i></span>
                            <span v-if="x.state_code == '1001'">พร้อมให้บริการ  <i class="fa fa-circle text-success"></i></span>
                            <span v-if="x.state_code != '1001' && !xt.isEmpty(x.state_code)">ติดสายหรือไม่ว่าง  <i class="fa fa-circle text-warning"></i></span>
                          </span>
                          <br />ผู้ให้บริการ : {{x.empfullname_t}}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- Panel : CSM Due Date Panel -->
            <div class="row">
              <div class="col-md-12">
                <div class="box box-solid" id="DueDateBox">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-clock-o"></i>&nbsp;{{ui.csm_doc_overdue||'เอกสารที่เกินวันกำหนด'}}</h3>
                    <div class="box-tools pull-right">
                      <button type="button" class="btn btn-box-tool" data-widget="collapse">
                        <i class="fas fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div class="box-body no-padding" style="max-height:200px;overflow-y:auto">
                    <vue-element-loading :active="duedateLoading" spinner="spinner" color="#02234e" text="ระบบกำลังค้นหาข้อมูลของท่าน กรุณารอสักครู่..." />
                    <ul class="nav nav-pills nav-stacked">
                      <li v-for="x,idx in csmDueDate">
                        <a :href="openReq(x)" target="_blank">
                          <i class="fa fa-folder-open"></i> {{x.job_no}}
                          <span class="pull-right text-danger">วันที่ : {{x.due_date | date()}}</span><br />
                          <span>ผู้ปฏิบัติงาน : </span> <span v-text="x.worker_name"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- Panel : Call History-->
            <div class="row">
              <div class="col-md-12">
                <div class="box box-solid" id="HistoryBox">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-folder"></i>&nbsp;{{ui.csm_call_history||'ประวัติการโทรเข้า'}}</h3>
                    <div class="box-tools pull-right">
                      <button type="button" class="btn btn-box-tool" data-widget="collapse">
                        <i class="fas fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div class="box-body no-padding" style="max-height:200px;overflow-y:auto">
                    <vue-element-loading :active="duedateLoading" spinner="spinner" color="#02234e" text="ระบบกำลังค้นหาข้อมูลของท่าน กรุณารอสักครู่..." />
                    <ul class="nav nav-pills nav-stacked">
                      <li v-for="x,idx in callHistoryData">
                        <a href="#" @click.prevent="">
                          <i class="fas fa-phone"></i> Tel : {{x.telephone}}
                          <span class="pull-right"><i class="fas fa-clock"></i> {{x.income_dt | date('DD/MM/YYYY HH:mm')}} </span><br />
                          <span>ผู้ให้บริการ : </span><span v-text="x.empname"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="box-footer text-center" v-if="callHistoryData.length > 0">
                    <a :href="baseUrl+'page/history/v_csm_call_history'" target="_blank" class="uppercase">View All History</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-9 col-md-12 col-sm-12">
            <!-- Platform : PC, Notebook -->
            <div class="row">
              <div class="col-md-12">
                <div class="nav-tabs-custom">
                  <ul class="nav nav-tabs hidden-sm hidden-xs">
                    <li :class="{active:tabSelected===0}"><a class="text-green" href="#" @click.prevent="onTabChange(0)">{{ui.csm_req_doc||'เอกสารที่ส่งคำขอ'}} (<span v-text="total.total_request || 0"></span>)</a></li>
                    <li :class="{active:tabSelected===1}"><a class="text-aqua" href="#" @click.prevent="onTabChange(1)">{{ui.csm_respon_doc||'เอกสารที่ได้เป็นผู้รับผิดชอบหลัก'}} (<span v-text="total.total_responsible || 0"></span>)</a></li>
                    <li :class="{active:tabSelected===2}"><a class="text-orange" href="#" @click.prevent="onTabChange(2)">{{ui.csm_assign_doc||'เอกสารที่ได้รับมอบหมาย'}} (<span v-text="total.total_tasks || 0"></span>)</a></li>
                    <li :class="{active:tabSelected===4}"><a class="text-purple" href="#" @click.prevent="onTabChange(4)">{{ui.csm_panding_doc||'เอกสารที่รอการตรวจสอบ'}} (<span v-text="total.total_checking + total.total_tester_bug || 0"></span>)</a></li>
                    <li :class="{active:tabSelected===3}"><a class="text-teal" href="#" @click.prevent="onTabChange(3)">{{ui.csm_all_doc||'เอกสารทั้งหมด'}} (<span v-text="total.total_items || 0"></span>)</a></li>
                  </ul>
                  <div class="tab-content">
                    <div class="tab-pane active">
                      <vue-element-loading :active="isLoading" spinner="spinner" color="#02234e" text="ระบบกำลังค้นหาข้อมูล CSM ของท่าน กรุณารอสักครู่..." />
                      <!-- Panel : Search -->
                      <div class="row">
                        <div class="col-md-12 hidden-md hidden-lg">
                          <div class="form-group">
                            <label class="text-danger">เอกสาร</label>
                            <select class="form-control input-sm" v-model.number="tabSelected" @change="onTabChange(tabSelected)">
                              <option value="0">{{ui.csm_req_doc||'เอกสารที่ส่งคำขอ'}}</option>
                              <option value="1">{{ui.csm_respon_doc||'เอกสารที่ได้เป็นผู้รับผิดชอบหลัก'}}</option>
                              <option value="2">{{ui.csm_assign_doc||'เอกสารที่ได้รับมอบหมาย'}}</option>
                              <option value="4">{{ui.csm_panding_doc||'เอกสารที่รอการตรวจสอบ'}}</option>
                              <option value="3">{{ui.csm_all_doc||'เอกสารทั้งหมด'}} </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-12 hidden-md hidden-lg" v-show="[0].includes(tabSelected) || [1,2,4].includes(tabSelected) && is_mango()">
                          <div class="form-group">
                            <label class="text-danger">ประเภท</label>
                            <select class="form-control input-sm" v-model.number="subTabSelected" @change="onSubTabChange(subTabSelected)">
                              <option v-for="x in subtab" :value="x.value" v-show="x.show">{{x.name}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-3">
                          <div class="form-group">
                            <label>{{ui.re_search_by||'Search By'}}</label>
                            <select class="form-control input-sm" v-model="retrieveSearch.field">
                              <option v-for="x in fields" :value="x.key">{{ x.name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-2 col-md-3">
                          <div class="form-group">
                            <label>{{ui.re_job_status||'Job Status'}}</label>
                            <select class="form-control input-sm" v-model="retrieveSearch.job_status" @change="retrieveSort()">
                              <option v-for="x in status" :value="x.value">{{ x.name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-3">
                          <div class="form-group">
                            <label>{{ui.search||'Search'}}</label>
                            <div class="input-group">
                              <input type="text" class="form-control input-sm" v-model="retrieveSearch.text" @keyup.enter="loadData()" />
                              <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="loadData()"><i class="fa fa-search"></i></button></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Panel : Detail Data -->
                      <div class="row hidden-sm hidden-xs">
                        <div class="col-md-12">
                          <div class="nav-tabs-custom" v-show="tabSelected===0">
                            <ul class="nav nav-tabs pull-right">
                              <li :class="{active:subTabSelected===0}"><a href="#" @click.prevent="onSubTabChange(0)">{{ui.csm_current_doc||'เอกสารปัจจุบัน'}}</a></li>
                              <li :class="{active:subTabSelected===1}"><a href="#" @click.prevent="onSubTabChange(1)">{{ui.csm_draft_doc||'เอกสารฉบับร่าง'}} ({{total.total_hold || 0}})</a></li>
                              <li class="pull-left header">
                                <button class="btn btn-sm bg-navy" @click.prevent="onCreateDocument()"><i class="fas fa-edit"></i> {{ui.csm_create_doc || 'เปิดเอกสารใหม่'}}</button>
                              </li>
                            </ul>
                          </div>
                          <div class="nav-tabs-custom" v-show="[1].includes(tabSelected) && is_mango()">
                            <ul class="nav nav-tabs pull-right">
                              <li :class="{active:subTabSelected===5}"><a href="#" @click.prevent="onSubTabChange(5)">{{ui.csm_all_doc||'เอกสารทั้งหมด'}} ({{total.total_responsible || 0}})</a></li>
                              <li :class="{active:subTabSelected===6}"><a href="#" @click.prevent="onSubTabChange(6)">Bug Software ({{totalSub.bug_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===7}"><a href="#" @click.prevent="onSubTabChange(7)">Request ({{totalSub.request_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===9}"><a href="#" @click.prevent="onSubTabChange(9)">Contract ({{totalSub.contract_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===8}"><a href="#" @click.prevent="onSubTabChange(8)">Other ({{totalSub.other_total || 0}})</a></li>
                            </ul>
                          </div>
                          <div class="nav-tabs-custom" v-show="[2].includes(tabSelected) && is_mango()">
                            <ul class="nav nav-tabs pull-right">
                              <li :class="{active:subTabSelected===5}"><a href="#" @click.prevent="onSubTabChange(5)">{{ui.csm_all_doc||'เอกสารทั้งหมด'}} ({{total.total_tasks || 0}})</a></li>
                              <li :class="{active:subTabSelected===6}"><a href="#" @click.prevent="onSubTabChange(6)">Bug Software ({{totalSub.bug_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===7}"><a href="#" @click.prevent="onSubTabChange(7)">Request ({{totalSub.request_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===9}"><a href="#" @click.prevent="onSubTabChange(9)">Contract ({{totalSub.contract_total || 0}})</a></li>
                              <li :class="{active:subTabSelected===8}"><a href="#" @click.prevent="onSubTabChange(8)">Other ({{totalSub.other_total || 0}})</a></li>
                            </ul>
                          </div>
                          <div class="nav-tabs-custom" v-show="tabSelected===4 && is_mango()">
                            <ul class="nav nav-tabs pull-right">
                              <li :class="{active:subTabSelected===3}"><a href="#" @click.prevent="onSubTabChange(3)">{{ui.csm_waiting_tester || 'เอกสารรอการทดสอบ'}} ({{total.total_checking || 0}})</a></li>
                              <li :class="{active:subTabSelected===5}"><a href="#" @click.prevent="onSubTabChange(5)">{{ui.csm_waiting_approve_assign || 'เอกสารรอการตรวจสอบที่ได้รับมอบหมาย'}} ({{total.total_tester_assign || 0}})</a></li>
                              <li :class="{active:subTabSelected===4}"><a href="#" @click.prevent="onSubTabChange(4)">{{ui.csm_waiting_approve || 'เอกสารรอการตรวจสอบ'}} ({{total.total_tester_bug || 0}})</a></li>
                            </ul>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <table-stick-2 ref="table_stick" :scale="380">
                            <table class="table table-striped table-hover">
                              <thead>
                                <tr>
                                  <th style="width:250px;">CSM No.</th>
                                  <th style="width:150px;">Date</th>
                                  <th style="width:150px;">Assign Date</th>
                                  <th class="text-nowrap nowrap" style="width:600px;">Subject</th>
                                  <th style="width:200px;">Project</th>
                                  <th style="width:200px;">Req. By</th>
                                  <th style="width:200px;">Contact By</th>
                                  <th style="width:200px;">Phone</th>
                                  <th style="width:150px;">Job Priority</th>
                                  <th style="width:200px;">Job Status</th>
                                  <th style="width:200px;" v-if="!is_mango() && company=='GIS'">QA Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr :class="{'warning': x.job_status == 'H','text-bold':x.job_status == 'W'}" v-for="(x,idx) in datalist">
                                  <td align="center"><a v-bind:href="openReq(x)" target="_blank">{{x.job_no}}</a></td>
                                  <td align="center">{{x.job_date | date('DD/MM/YYYY HH:mm')}}</td>
                                  <td align="center">{{x.assign_date | date()}}</td>
                                  <td>{{x.subject}}</td>
                                  <td :class="{'text-warning': xt.isEmpty(x.project)}">
                                    <p v-if="!is_mango()">{{(xt.isEmpty(x.project) && xt.isEmpty(x.dpt_no) && !xt.isEmpty(x.customer_code)) ? 'ไม่ระบุโครงการ' : (xt.isEmpty(x.project) && !xt.isEmpty(x.customer_code)) ? "By Customer" :  x.project}}</p>
                                    <p v-if="!isDeveloper() && is_mango()">{{(xt.isEmpty(x.project) && !xt.isEmpty(x.customer_code)) ? "By Customer" : x.project}}</p>
                                    <p v-if="isDeveloper() && !xt.isEmpty(x.project) && is_mango()">
                                      <a href="#" @click.prevent="queryStringRemoteIP(x)">{{x.project}}</a>
                                    </p>
                                  </td>
                                  <td>{{x.request_empno_name}}</td>
                                  <td align="center">{{x.contract_user}}</td>
                                  <td align="center">{{x.phone}}</td>
                                  <td align="center" :class="priorityStatusClass(x.job_priority)">{{priorityName(x.job_priority)}}</td>
                                  <td align="center">
                                    <!-- Case No Tasks -->
                                    <p class="text-danger" v-show="x.task_count==0"><b>No Tasks</b></p>
                                    <!-- Case Complete in Tasks -->
                                    <p class="text-warning" v-show="is_complete(x) && x.task_count > 0"><b>Done <i class="fa fa-warning" v-tooltip="'ดำเนินการเสร็จแล้ว กรุณาตรวจสอบข้อมูล และปิดงาน'"></i></b></p>
                                    <!-- Case Checking in Tasks -->
                                    <p class="text-purple" v-show="x.task_count > 0 && x.task_send_qc > 0 && x.task_waiting_update == 0"><b>Checking {{x.task_qty}} <i class="fa fa-warning" v-tooltip="'สถานะบ้างรายการกำลังถูกตรวจสอบ โดย Checker กรุณารอ'"></i></b></p>
                                    <!-- Case Wait Tester in Tasks -->
                                    <p class="text-teal" v-show="x.task_count > 0 && (x.task_tester_approve > 0 && x.task_tester_reject == 0)"><b>Wait Tester <i class="fa fa-warning" v-tooltip="'เนื่องจากมี Type Bug Software จึงจำเป็นต้องให้ Tester ตรวจสอบก่อน'"></i></b></p>
                                    <!-- Case Wait Approve in Tasks -->
                                    <p class="text-teal" v-show="x.task_count > 0 && x.task_waiting_approve > 0"><b>Wait Approve <i class="fa fa-warning" v-tooltip="'มีรายการที่จำเป็นต้องรอการอนุมัติ'"></i></b></p>
                                    <!-- Case Wait Update Programs in Tasks -->
                                    <p class="text-teal" v-show="x.task_count > 0 && x.task_waiting_update > 0"><b>Update Program <i class="fa fa-warning" v-tooltip="'มีรายการที่จำเป็นต้องรอให้ Programmer Update โปรแกรม'"></i></b></p>
                                    <!-- Case Reject Tester in Tasks -->
                                    <p class="text-red" v-show="x.task_count > 0 && x.task_tester_reject > 0"><b>Reject Tester <i class="fa fa-warning" v-tooltip="'เนื่องจากมีบางรายการ Tester Reject โปรดตรวจสอบข้อมูล'"></i></b></p>
                                    <!-- Case Testing in Tasks -->
                                    <p class="text-purple" v-show="x.task_count > 0 && x.task_waiting_test > 0"><b>Testing <i class="fa fa-warning" v-tooltip="'บ้างรายการกำลังถูกทดสอบจาก Req. กรุณารอ Req. ปิดงาน'"></i></b></p>
                                    <!-- Case Normal -->
                                    <p :class="statusClass('text-', x.job_status)" v-show="!is_complete(x) && x.task_count > 0 && x.task_send_qc == 0 && (x.task_tester_approve == 0 && x.task_tester_reject == 0) && x.task_waiting_approve == 0 && x.task_waiting_update == 0 && x.task_waiting_test == 0"><b>{{statusName(x.job_status)}} {{x.task_qty}}</b></p>
                                  </td>
                                  <td v-if="!is_mango() && company=='GIS'">
                                    <p v-show="x.qa_status <= 0"><b>None</b></p>
                                    <p class="text-success" v-show="x.qa_status > 0">
                                      <b>Checked</b>
                                      <i class="fa fa-check"></i>
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </table-stick-2>
                        </div>
                        <!-- Pagination -->
                        <div class="col-md-12 margin-t-10">
                          <pagination class="pull-left hidden-sm hidden-xs" ref="paging" @page-change="pageChange($event.page, 'main')"></pagination>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Platform : Mobile -->
            <div class="row hidden-md hidden-lg">
              <div class="col-md-12">
                <div class="box box-solid" v-bind:class="{'warning': x.job_status == 'H','text-bold':x.job_status == 'W'}" v-for="(x,idx) in datalist">
                  <div class="box-header with-border">
                    <a v-bind:href="openReq(x)" target="_blank">
                      <h3 class="box-title">
                        <!--<i class="fa fa-folder-open"></i>&nbsp;-->
                        {{x.job_no}}
                      </h3>
                    </a>
                    <div class="box-tools pull-right">
                      <!-- Case No Tasks -->
                      <span class="badge badge-danger" v-show="x.task_count==0"><b>No Tasks</b></span>
                      <!-- Case Complete in Tasks -->
                      <span class="badge badge-warning" v-show="is_complete(x) && x.task_count > 0"><b>Done <i class="fa fa-warning" v-tooltip="'ดำเนินการเสร็จแล้ว กรุณาตรวจสอบข้อมูล และปิดงาน'"></i></b></span>
                      <!-- Case Checking in Tasks -->
                      <span class="badge badge-purple" v-show="x.task_count > 0 && x.task_send_qc > 0 && x.task_waiting_update == 0"><b>Checking {{x.task_qty}} <i class="fa fa-warning" v-tooltip="'สถานะบ้างรายการกำลังถูกตรวจสอบ โดย Checker กรุณารอ'"></i></b></span>
                      <!-- Case Wait Tester in Tasks -->
                      <span class="badge badge-teal" v-show="x.task_count > 0 && (x.task_tester_approve > 0 && x.task_tester_reject == 0)"><b>Wait Tester <i class="fa fa-warning" v-tooltip="'เนื่องจากมี Type Bug Software จึงจำเป็นต้องให้ Tester ตรวจสอบก่อน'"></i></b></span>
                      <!-- Case Wait Approve in Tasks -->
                      <span class="badge badge-teal" v-show="x.task_count > 0 && x.task_waiting_approve > 0"><b>Wait Approve <i class="fa fa-warning" v-tooltip="'มีรายการที่จำเป็นต้องรอการอนุมัติ'"></i></b></span>
                      <!-- Case Wait Update Programs in Tasks -->
                      <span class="badge badge-teal" v-show="x.task_count > 0 && x.task_waiting_update > 0"><b>Update Program <i class="fa fa-warning" v-tooltip="'มีรายการที่จำเป็นต้องรอให้ Programmer Update โปรแกรม'"></i></b></span>
                      <!-- Case Reject Tester in Tasks -->
                      <span class="badge badge-danger" v-show="x.task_count > 0 && x.task_tester_reject > 0"><b>Reject Tester <i class="fa fa-warning" v-tooltip="'เนื่องจากมีบ้างรายการ Tester Reject โปรดตรวจสอบข้อมูล'"></i></b></span>
                      <!-- Case Testing in Tasks -->
                      <span class="badge badge-purple" v-show="x.task_count > 0 && x.task_waiting_test > 0"><b>Testing <i class="fa fa-warning" v-tooltip="'บ้างรายการกำลังถูกทดสอบจาก Req. กรุณารอ Req. ปิดงาน'"></i></b></span>
                      <!-- Case Normal -->
                      <span class="badge badge-secondary" v-bind:class="statusClass('text-', x.job_status)" v-show="!is_complete(x) && x.task_count > 0 && x.task_send_qc == 0 && (x.task_tester_approve == 0 && x.task_tester_reject == 0) && x.task_waiting_approve == 0 && x.task_waiting_update == 0 && x.task_waiting_test == 0"><b>{{statusName(x.job_status)}} {{x.task_qty}}</b></span>

                      <button type="button" class="btn btn-box-tool" data-toggle="collapse" :data-target="'#'+x.job_no">
                        <i class="fas fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div class="box-body no-padding collapse" style="max-height:200px;overflow-y:auto" :id="x.job_no">
                    <div class="col-lg-12" style="margin-top:5px;">
                      <p>Assign Date : {{x.assign_date|date()}}</p>
                      <p>Subject : {{x.subject}}</p>
                      <p>Project : {{(xt.isEmpty(x.project) && !xt.isEmpty(x.customer_code)) ? "By Customer" : x.project}}</p>
                      <p>Req By : {{x.request_empno_name}}</p>
                      <p>Contact By : {{x.contract_user}}</p>
                      <p v-if="x.phone">Phone : {{x.phone}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row text-center hidden-lg hidden-md">
              <button class="btn btn-sm bg-navy" style="width:130px !important;" @click.prevent="loadData('take')"><i class="fas fa-refresh"></i> Load More</button>
            </div>
            <!-- End Platform : Mobile -->
          </div>
        </div>
      </template>
    </re-page>
  </div>
</template>

<script type="text/javascript">

  let page = {}
  let paging = {}
  let customerPaging = {}

  let home = {
    data() {
      return {
        auth: window.auth,
        baseUrl,
        baseRoute,
        queryString,
        company: window.baseCompany,
        ui: window.ui,
        newDate: new Date(),
        isLoading: false,
        customerLoading: false,
        duedateLoading: false,
        height: 0,
        fields: [
          { key: 'job_no', name: 'CSM No.', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'subject', name: 'Subject', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'pre_des', name: 'Project', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'dpt_no_name', name: 'Department', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'request_empno_name', name: 'Req. By', type: 's', search: true, sort: true, sort_default: true, width: 200 },
          { key: 'contract_user', name: 'Contact By', type: 's', search: true, sort: true, sort_default: true, width: 200 },
        ],
        status: [
          { key: 'job_status', name: 'All Item', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: '' },
          { key: 'job_status', name: 'None', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'W' },
          { key: 'job_status', name: 'Pending', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'P' },
          { key: 'job_status', name: 'Done', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'D' },
          { key: 'job_status', name: 'Complete', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'C' },
          { key: 'job_status', name: 'Cancel', type: 'f', search: true, sort: true, sort_default: true, width: 200, value: 'N' },
        ],
        subtab: [
          { value: 0, name: ui.csm_current_doc || 'เอกสารปัจจุบัน', group: 1, show: true },
          { value: 1, name: ui.csm_draft_doc || 'เอกสารฉบับร่าง', group: 1, show: true },
          { value: 5, name: ui.csm_all_doc || 'เอกสารทั้งหมด', group: 4, show: false },
          { value: 6, name: 'Bug Software', group: 2, show: false },
          { value: 7, name: 'Request', group: 2, show: false },
          { value: 9, name: 'Contract', group: 2, show: false },
          { value: 8, name: 'Other', group: 2, show: false },
          { value: 3, name: ui.csm_waiting_tester || 'เอกสารรอการทดสอบ', group: 3, show: false },
          //{ value: 5, name: ui.csm_waiting_approve_assign || 'เอกสารรอการตรวจสอบที่ได้รับมอบหมาย', group: 3, show: false },
          { value: 4, name: ui.csm_waiting_approve || 'เอกสารรอการตรวจสอบ', group: 3, show: false },
        ],
        retrieveSearch: {},
        tabSelected: 0,
        subTabSelected: 0,
        datalist: [],
        customerlist: [],
        csmDueDate: [],
        callCenterStatus: [],
        callHistoryData: [],
        total: {},
        totalSub: {},
        customerSearch: "",
        customerTotal: 0,
        statusCode,
        xt: $xt,
        selected: 0,
        select_sub: 0,
        loadmore: 10,
      };
    },
    methods: {
      pageChange(pn, pt) {
        switch (pt) {
          case "main":
            paging.setCurrentPage(pn);
            this.loadData();
            break;
          case "customer":
            customerPaging.setCurrentPage(pn);
            this.searchCustomer();
            break;
        }
      },
      async onTabChange(t) {
        t = t ?? this.tabSelected;
        this.tabSelected = t;
        let tab = [];
        switch (this.tabSelected) {
          case 0:
            tab = [1];
            this.subTabSelected = 0;
            this.retrieveSearch.job_status = 'P';
            break;
          case 1:
            tab = this.is_mango ? [2] : [2, 4];
            this.subTabSelected = 5;
            this.retrieveSearch.job_status = 'P';
            if (this.is_mango()) {
              this.loadTotalResponsible();
            }
            break;
          case 2:
            tab = this.is_mango ? [2] : [2, 4];
            this.subTabSelected = 5;
            this.retrieveSearch.job_status = 'P';
            if (this.is_mango()) {
              this.loadTotalTask();
            }
            break;
          case 4:
            tab = this.is_mango ? [3] : [3, 4];
            this.subTabSelected = 3;
            this.retrieveSearch.job_status = 'P';
            break;
        }

        this.onSetTab(tab);
        await this.loadTotal();
        await this.loadData();
      },
      async onSubTabChange(t) {
        this.subTabSelected = t

        if (this.subTabSelected == 1) {
          this.retrieveSearch.job_status = ''
        }
        else if (this.subTabSelected == 0) {
          this.retrieveSearch.job_status = 'P'
        }

        await this.loadTotal()
        await this.loadData()
      },
      onSetTab(j = []) {
        this.subtab.forEach(x => {
          if (j.includes(x.group)) {
            if (x.value == 5) {
              x.name = [1, 2].includes(this.tabSelected) ? ui.csm_all_doc || 'เอกสารทั้งหมด' : ui.csm_waiting_approve_assign || 'เอกสารรอการตรวจสอบที่ได้รับมอบหมาย';
            }
            x.show = true
          }
          else
            x.show = false;
        });
      },
      async retrieveSort() {
        if (this.tabSelected == 1 && this.is_mango()) {
          this.loadTotalResponsible();
        } else if (this.tabSelected == 2 && this.is_mango()) {
          this.loadTotalTask();
        }
        paging.setCurrentPage(1);
        this.loadData();
        this.loadTotal();
      },
      async searchData() {
        paging.setCurrentPage(1);
        await this.loadData();
      },
      async loadTotal() {
        let act = `CSM/Data/Total?job_status=${this.retrieveSearch.job_status || ''}`;
        let rsp = await $xt.getServer(act);
        this.total = rsp;
      },
      async loadTotalResponsible() {
        let act = `CSM/Data/TotalResponsible?job_status=${this.retrieveSearch.job_status || ''}`;
        let rsp = await $xt.getServer(act);
        this.totalSub = rsp;
      },
      async loadTotalTask() {
        let act = `CSM/Data/TotalTasks?job_status=${this.retrieveSearch.job_status || ''}`;
        let rsp = await $xt.getServer(act);
        this.totalSub = rsp;
      },
      async loadData(take) {
        this.isLoading = true
        if (take) {
          this.loadmore = this.loadmore + 10
          paging.setItemsPerPage(this.loadmore)
        }
        else {
          paging.setItemsPerPage(100)
        }

        let act = `CSM/Data/ReadDocument?skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}&tabSelected=${this.tabSelected || '0'}&subTabSelected=${this.subTabSelected || '0'}`
        for (var key in this.retrieveSearch) {
          act += `&${key}=${encodeURIComponent(this.retrieveSearch[key])}`
        }
        let rsp = await $xt.getServer(act)
        this.datalist = rsp.data.detail

        paging.setTotalItems(rsp.data.total)
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1)
        }
        paging.createPagesArray()

        await $xt.sleep(100)
        await this.$refs.table_stick.createStick()

        this.isLoading = false
      },
      async loadDocumentOverdue() {
        this.duedateLoading = true;
        let act = `CSM/Data/DocumentOverdue`;
        let rsp = await $xt.getServer(act);
        this.csmDueDate = rsp;
        this.duedateLoading = false;
      },
      async loadCustomerService() {
        let act = `CSM/Data/CustomerService`;
        let rsp = await $xt.getServer(act);
        this.callCenterStatus = rsp.agent;
      },
      async loadHistoryService() {
        let act = `CSM/Data/HistoryService`;
        let rsp = await $xt.getServer(act);
        this.callHistoryData = rsp.data;
      },
      openReq(x) {
        x = x || "";
        if ($xt.isEmpty(x)) {
          return this.baseUrl + `page/Transaction/v_csm_trn_001/`;
        }
        else {
          return this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${x.job_no}`
        }
      },
      queryStringRemoteIP(x) {
        window.open(this.baseUrl + `page/CustomerDataView?customer_code=${x.customer_code}&pre_event=${x.pre_event}&tabSelected=tab2`, "_blank");
      },
      onCreateDocument() {
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/`, "_blank");
        //this.$router.push({ name: 'v_csm_trn_001' });
      },
      openCSMbyCustomer(x) {
        localStorage.setItem("X-Custome-Panel-CSM", JSON.stringify(x));
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/`, "_blank");
      },
      mainOpenCustomer() {
        page.openCustomer();
      },
      async searchCustomer() {
        this.customerLoading = true;
        let act = `csm/data/SearchCustomer?search_text=${encodeURIComponent(this.customerSearch)}&skip=${customerPaging.skipItems()}&take=${customerPaging.getItemsPerPage()}`;
        let rsp = await $xt.getServer(act);
        this.customerlist = rsp.data.data_rows;
        this.customerTotal = rsp.data.total;

        customerPaging.setTotalItems(rsp.data.total);
        if (!customerPaging.getItemsPerPage()) {
          customerPaging.setCurrentPage(1);
        }
        customerPaging.createPagesArray();

        this.customerLoading = false;
      },
      priorityName(code) {
        return $linq(this.priorityCodeData).where(x => x.prioity_code == code).select(x => x.prioity_des).firstOrDefault() || '';
      },
      priorityStatusClass(code) {
        /* Variable : prioity_code, prioity_des, priority_status = 1 (ปกติ) , 2 (สำคัญ) , 3 (สำคัญมาก), active */
        var status = $linq(this.priorityCodeData).where(w => w.prioity_code == code).select(x => x.priority_status).firstOrDefault() || "";
        return status == "3" ? "text-danger" : status == "2" ? "text-warning" : "text-info";
      },
      statusClass(prefix, status) {
        return status == 'Y' ? prefix + 'success' : status == 'I' ? prefix + 'info' : status == 'N' ? prefix + 'danger' : status == 'H' ? prefix + 'warning' : '';
      },
      statusName(code) {
        return $linq(this.statusCode).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
      },
      is_complete(x) {
        return x.task_send_pretest == x.task_count && !["Y", "N"].includes(x.job_status);
      },
      is_mango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        return isMango == "Y" ? true : false;
      },
      isDeveloper() {
        let department = this.auth.empcode.substring(0, 2);
        return department == 'IT';
      },
      notificationDeveloper() {
        this.$swal({
          type: 'info',
          title: 'แจ้งเตือน',
          text: `สวัสดี ${this.auth.empname} คุณมีรายการงานคงค้างจำนวน 0 รายการ`,
        });
      },
      /* Method : Center */
      loadCenter() {
        store.dispatch('findPriority');
        store.dispatch('findConnection');
      },
    },
    computed: {
      priorityCodeData() { return store.state.priorityCodeData },
      connectionCodeData() { return store.state.connectionCodeData },
      configData() { return store.state.configData },
    },
    async beforeMount() {
      await this.loadCenter()
    },
    async mounted() {
      page = this.$refs.page
      page.pageTitle = 'CSM : Customer Service Management'
      document.title = page.pageTitle

      paging = this.$refs.paging
      paging.setCurrentPage(1)
      paging.setItemsPerPage(100)

      customerPaging = this.$refs.customerPaging
      customerPaging.setCurrentPage(1)
      customerPaging.setItemsPerPage(5)

      let field_init = $linq(this.fields).where(x => x.search).firstOrDefault() || {}
      this.$set(this.retrieveSearch, 'field', field_init.key || '')
      this.$set(this.retrieveSearch, 'field_type', field_init.type || 's')
      this.$set(this.retrieveSearch, 'job_status', this.status[2].value || '')

      await this.loadTotal()
      await this.loadData()

      await this.loadDocumentOverdue()
      await this.loadCustomerService()
      await this.loadHistoryService()

      $(window).resize(() => {
        let windowHeight = $(window).height()
        this.$set(this, 'height', windowHeight - 400)
      })
      $(window).trigger('resize')

      $('#HistoryBox').boxWidget()
      $("#DueDateBox").boxWidget()
    }
  }
  export default home
</script>

<style scoped>
  .led {
    -webkit-animation: led .8s infinite;
    -moz-animation: led .8s infinite;
    -ms-animation: led .8s infinite;
    -o-animation: led .8s infinite;
    animation: led .8s infinite;
  }

  @-webkit-keyframes led {
    from {
      opacity: .2;
    }

    to {
      opacity: 1;
    }
  }

  @-moz-keyframes led {
    from {
      opacity: .2;
    }

    to {
      opacity: 1;
    }
  }

  @-ms-keyframes led {
    from {
      opacity: .2;
    }

    to {
      opacity: 1;
    }
  }

  @-o-keyframes led {
    from {
      opacity: .2;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes led {
    from {
      opacity: .2;
    }

    to {
      opacity: 1;
    }
  }

  .badge {
    padding: 1px 9px 2px;
    font-size: 12.025px;
    font-weight: bold;
    white-space: nowrap;
    color: #ffffff;
    background-color: #999999;
    -webkit-border-radius: 9px;
    -moz-border-radius: 9px;
    border-radius: 9px;
  }

  .badge-danger {
    background-color: #f74844;
  }

    .badge-danger:hover {
      background-color: #953b39;
    }

  .badge-warning {
    background-color: #f89406;
  }

    .badge-warning:hover {
      background-color: #c67605;
    }

  .badge-success {
    background-color: #468847;
  }

    .badge-success:hover {
      background-color: #356635;
    }

  .badge-info {
    background-color: #3a87ad;
  }

    .badge-info:hover {
      background-color: #2d6987;
    }

  .badge-inverse {
    background-color: #333333;
  }

    .badge-inverse:hover {
      background-color: #1a1a1a;
    }

  .badge-teal {
    background-color: #39CCCC;
  }

  .badge-purple {
    background-color: #605ca8;
  }
</style>
