<template>
  <div>
    <re-page ref="page">
      <template #body>
        <div>
          <div class="nav-tabs-custom">
            <ul class="nav nav-tabs">
              <li v-bind:class="{active:tab1Active===0}"><a href="#" @click.prevent="changeTab1(0)">รายละเอียดเอกสาร</a></li>
              <li v-bind:class="{active:tab1Active===1}"><a href="#" @click.prevent="changeTab1(1)">สถานะเอกสาร ({{statusData.length || 0}})</a></li>
              <li v-bind:class="{active:tab1Active===2}"><a href="#" @click.prevent="changeTab1(2)">ประวัติการส่งงาน ({{assignmentData.length || 0}})</a></li>
              <li v-bind:class="{active:tab1Active===3}"><a href="#" @click.prevent="changeTab1(3)">ประวัติเอกสาร ({{csmHistotyData.length || 0}})</a></li>
            </ul>
            <div class="tab-content" ref="myContent">
              <!-- Open Requirement -->
              <div class="tab-pane" v-bind:class="{active:tab1Active===0}">
                <!-- ยกเลิกเอกสาร -->
                <div class="row" v-show="formData.job_status == 'N'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-danger">
                      <h4><i class="fas fa-times-circle"></i> ยกเลิกเอกสาร</h4>
                      เลขที่เอกสาร {{formData.job_no}} นี้เป็นเอกสารที่ถูกยกเลิกโดย Requestor <br />
                      <label v-show="formData['job_status'] == 'N'">เหตุผลการยกเลิก : {{formData['cancel_remark']}}</label>
                    </div>
                  </div>
                </div>
                <!-- เอกสารฉบับร่าง -->
                <div class="row" v-show="formData.job_status == 'H'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-warning">
                      <h4><i class="fas fa-info-circle"></i> หมายเหตุ</h4>
                      เลขที่เอกสาร {{formData.job_no}} นี้ เป็นเอกสารฉบับร่าง หากกดปุ่มบันทึกจะทำให้เอกสารฉบับนี้ส่งถึง ผู้รับผิดชอบหลัก ทันที
                    </div>
                  </div>
                </div>
                <!-- เอกสารรอการอนุมัติ -->
                <div class="row" v-show="(detailDataCount - prapproveDataReject) != prapproveDataAccept && formData.job_status != 'H'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-info">
                      <h4><i class="fas fa-warning"></i> เอกสารรอการอนุมัติ</h4>
                      เลขที่เอกสาร {{formData.job_no}} นี้รอการอนุมัติจากผู้อนุมัติทั้งหมดทุกรายการก่อนจะดำเนินการต่อได้ <br />
                      <span class="text-bold">หมายเหตุ : </span> หากต้องการแก้ไขรายละเอียดของเอกสารทั้งหมด กรุณากดปุ่มบันทึกข้อมูลก่อน จากนั้นให้กดปุ่มส่งอนุมัติใหม่อีกครั้ง
                    </div>
                  </div>
                </div>
                <!-- เอกสารอรับงาน -->
                <div class="row" v-show="formData.assign_empno != auth.empno && formData.job_status_tmp == 'W' && detailDataCount > 0 && prapproveDataAccept > 0 && detailDataCount == prapproveDataAccept && testerApproveCount == 0 && isRejectCount == 0">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-info">
                      <h4><i class="fas fa-warning"></i> เอกสารรอการรับงาน</h4>
                      เลขที่เอกสาร {{formData.job_no}} นี้รอการรับงานจาก {{formData.assign_empno_name}} กรุณารอการตอบรับจากผู้รับผิดชอบหลัก<br />
                      <span><b>หมายเหตุ : </b> คุณสามารถแก้ไขหรืออัพเดทข้อมูลเพิ่มเติมได้ หากผู้รับผิดชอบหลักยังไม่ได้รับงาน</span>
                    </div>
                  </div>
                </div>
                <!-- เอกสารรอ Tester ตรวจสอบ -->
                <div class="row" v-show="formData.job_status_tmp == 'W' && detailDataCount > 0 && prapproveDataAccept > 0 && detailDataCount == prapproveDataAccept && testerApproveWait > 0 && formData.tester_approve != 'R'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-warning">
                      <h4><i class="fas fa-warning"></i> เอกสารรอการตรวจสอบ</h4>
                      เลขที่เอกสาร {{formData.job_no}} นี้รอการตรวจสอบ เนื่องจากมีรายการที่เป็น Type Bug Software จึงต้องรอ Tester ตรวจสอบข้อมูลก่อนถึงผู้รับผิดชอบหลัก หากมีข้อสงสัยติดต่อทางทีม Tester ทันที<br />
                    </div>
                  </div>
                </div>
                <!-- เอกสาร Tester Reject -->
                <div class="row" v-show="testerApproveReject > 0">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-danger">
                      <h4><i class="fas fa-times-circle"></i> มีรายการที่ถูก Reject จาก Tester</h4>
                      เลขที่เอกสาร {{formData.job_no}} นี้เป็นเอกสารที่มีบางรายการไม่ผ่านการตรวจสอบจาก Tester โปรดตรวจสอบข้อมูลและติดต่อ Tester หากมีข้อสงสัย <br />
                    </div>
                  </div>
                </div>
                <!-- คำเตือนลูกค้าไม่ได้ต่อ Maintenance -->
                <div class="row" v-show="formData.mg_ma == 'N'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="callout callout-danger">
                      <h4><i class="fas fa-times-circle"></i> Customer MA Expire</h4>
                      ลูกค้า {{formData.customer_name}} ไม่ได้ต่อ MA <br />
                    </div>
                  </div>
                </div>
                <!-- Current Status -->
                <div class="row" id="current_job_status">
                  <div class="col-lg-6 col-md-12 col-sm-12">
                    <div class="box box-warning">
                      <div class="box-header with-border">
                        <h3 class="box-title font-bold">สถานะของใบงาน</h3>
                      </div>
                      <div class="box-body">
                        <div class="row">
                          <div class="col-lg-12 col-md-12 col-sm-12">
                            <div class="text-center">
                              <div class="header-progress-container">
                                <ol class="header-progress-list">
                                  <li class="header-progress-item" v-bind:class="{'done': ['W','I','Y'].includes(formData.job_status), 'todo': !['W','I','Y'].includes(formData.job_status)}"><b>Wait</b></li>
                                  <li class="header-progress-item" v-bind:class="{'done': ['I','Y'].includes(formData.job_status), 'todo': !['I','Y'].includes(formData.job_status)}"><b>In Progress</b></li>
                                  <li class="header-progress-item" v-bind:class="{'done': formData.job_status == 'Y', 'todo': formData.job_status != 'Y'}"><b>Complete</b></li>
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-12 col-sm-12 hidden-md hidden-sm">
                    <div class="box box-warning">
                      <div class="box-header with-border">
                        <h3 class="box-title font-bold">ระดับความสำคัญของใบงาน</h3>
                      </div>
                      <div class="box-body" style="height: 99px;">
                        <div class="text-center">
                          <h3 class="font-bold" v-bind:class="currentStatusClass()">{{currentStatusText()}}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Accept Job -->
                <div class="row" v-show="formData['assign_empno'] == auth.empno && formData['job_status_tmp'] == 'W' && detailDataCount > 0 && prapproveDataAccept > 0 && detailDataCount == prapproveDataAccept && testerApproveCount == 0 && prapproveDataReject == 0">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="box box-success">
                      <div class="box-header with-border">
                        <h3 class="box-title font-bold">Acception</h3>
                      </div>
                      <div class="box-body">
                        <div class="row">
                          <div class="col-lg-12 col-md-12 col-sm-12">
                            <div class="alert alert-warning alert-dismissible">
                              <h4><i class="icon fa fa-warning"></i>หมายเหตุ</h4>
                              เมื่อกดรับงานและบันทึกข้อมูลเรียบร้อย แล้วรายการของท่านจะไม่สามารถย้อนกลับได้อีก โปรดตรวจสอบข้อมูลก่อนรับงานนี้
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-12 col-md-12 col-sm-12">
                            <p class="text-danger">
                              หากต้องการเปลี่ยนผู้รับผิดชอบงานกรุณาเลื่อนลงไปด้านล่างแล้วเปลี่ยนผู้รับผิดชอบหลักก่อน จากนั้นกดปุ่ม Save เพื่อบันทึกการเปลี่ยนแปลง โดยที่ผู้รับผิดชอบงานในส่วนของ Tasks จะถูกเปลี่ยนไปตามผู้รับผิดชอบหลักเอง
                            </p>
                            <p class="text-danger">
                              (*** ซึ่งหากคุณได้กด Accept Job ไปแล้วจะไม่สามารถเปลี่ยนผู้รับผิดชอบหลักได้อีก ***)
                            </p>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-12 col-md-12 col-sm-12">
                            <button class="btn btn-sm bg-olive" @click="acceptJob"><i class="fas fa-check-circle"></i> รับงานนี้</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Reject Job -->
                <div class="row" v-show="formData['request_empno'] == auth.empno && isRejectCount > 0 && detailDataCount > 0 && formData['job_status'] != 'Y' && prapproveDataReject == 0">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="alert alert-danger">
                      <h4><i class="icon fas fa-times-circle"></i> สถานะงานถูก Reject จำนวน {{isRejectCount}} รายการ</h4>
                      <p>*** มีสถานะบางรายการที่ถูก Reject ดังนั้นหากต้องการส่งสถานะ Wait คืนให้ Worker จำเป็นต้องเข้าไปในรายการที่ต้องการเพื่อเปลี่ยนสถานะ</p>
                    </div>
                  </div>
                </div>
                <!-- Complete Job -->
                <div class="row" v-show="formData['request_empno'] == auth.empno && detailComplete == detailDataCount && detailDataCount > 0 && formData['job_status'] != 'Y'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="box box-success">
                      <div class="box-body">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="alert alert-success">
                              <h4><i class="icon fa fa-exclamation"></i> หมายเหตุ</h4>
                              <p>*** ดำเนินการเรียบร้อยแล้ว กรุณาปิดงาน โดยการคลิกที่ปุ่ม ด้านล่าง ***</p>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-12">
                            <button class="btn btn-success btn-lg" href="#" @click.prevent="saveClick()">{{ui.csm_complete || 'ปิดงานนี้'}}</button>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
                <!-- แบบประเมินสำหรับ CSM -->
                <div class="row" v-if="formData['job_status'] == 'Y'">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="box box-success">
                      <div class="box-header" id="qc_panel">
                        <h3 class="box-title font-bold">แบบประเมินความพึงพอใจ</h3>
                      </div>
                      <div class="box-body">
                        <fieldset>
                          <legend>ส่วนที่ 1 : เลือกชุดคำถาม</legend>
                          <div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-3">
                              <label>เลือกแบบประเมินชุดคำถาม</label>
                              <select class="form-control input-sm" v-model.trim="qc_form_code" style="width:100%" @change="loadFormQCDetail" v-bind:disabled="!xt.isEmpty(qc_user) || (formData.request_empno != auth.empno)">
                                <option value="" selected="selected" disabled="disabled">-- เลือกชุดคำถาม --</option>
                                <option :value="x.code" v-for="(x,idx) in questionData">{{x.description}}</option>
                              </select>
                            </div>
                          </div>
                        </fieldset>
                        <br />
                        <fieldset>
                          <legend>ส่วนที่ 2 : แบบประเมินจากชุดคำถาม</legend>
                          <template v-for="(x,idx) in answerData">
                            <div class="row">
                              <div class="col-lg-12 col-md-12 col-sm-12">
                                <span style="font-size: 16px !important">ข้อที่ {{idx+1}} {{x.itemname}}</span><span class="pull-right" style="font-size: 16px !important">คะแนนที่ได้ : {{x.score_ans}}</span>
                              </div>
                            </div>
                            <div class="row" style="margin-bottom:10px;">
                              <template v-for="(i,idx1) in x.max_score">
                                <div class="col-lg-1 col-md-1 col-sm-1">
                                  <div class="input-group">
                                    <div class="icheck-material-green">
                                      <input type="radio" :id="'score_status'+idx+idx1" :name="'radio_score'+idx" v-model.number="x.score_ans" :value="i" v-bind:disabled="!xt.isEmpty(qc_user) || (formData.request_empno != auth.empno)" />
                                      <label :for="'score_status'+idx+idx1">{{i}}</label>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </template>
                          <div class="row" v-if="!is_mango()">
                            <div class="col-lg-6 col-md-6 col-sm-12">
                              <label v-text="ui.suggestion || 'ข้อเสนอแนะ'"></label>
                              <textarea class="form-control input-sm" rows="3" v-model.trim="formData['qa_remark']"></textarea>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                              <span class="pull-right" style="font-size: 16px;">คะแนนรวมทั้งหมด : {{calculateScore('score_ans')}} / คะแนนเต็ม : {{calculateScore('max_score')}} / คิดเป็น : {{calculatePercentage()}} %</span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6">
                              <button class="btn btn-sm btn-success" @click="saveQC" v-bind:disabled="!xt.isEmpty(qc_user) || (formData.request_empno != auth.empno)"><i class="fa fa-save"></i> บันทึกแบบประเมิน</button>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6">
                              <span class="pull-right">ผู้ประเมิน : {{qc_user || ""}} วันที่ : {{qc_date | date('DD/MM/YYYY HH:mm')}}</span>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Document -->
                <div class="row" id="document_panel">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="box box-primary">
                      <div class="box-header">
                        <h3 class="box-title font-bold">ส่วนที่ 1 : รายละเอียดเอกสาร </h3>
                      </div>
                      <div class="box-body">
                        <fieldset v-bind:disabled="isDisabled()">
                          <!-- Subject -->
                          <div class="row">
                            <div class="col-lg-6 col-md-4 col-sm-4">
                              <div class="form-group">
                                <label class="text-danger" id="subject" v-text="ui.csm_subject || 'Subject'"></label><span class="pull-right text-bold">(ไม่เกิน 100 ตัวอักษร)</span>
                                <input type="text" class="form-control input-sm" v-model="formData['subject']" ref="subject" maxlength="100" />
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-4 col-sm-4">
                              <div class="form-group">
                                <label v-text="ui.csm_reqno || 'Req. No'"></label>
                                <input type="text" class="form-control input-sm text-bold" v-model="formData['job_no']" readonly />
                              </div>
                            </div>
                            <div class="col-lg-3 col-md-4 col-sm-4">
                              <div class="form-group">
                                <label class="text-danger" v-text="ui.csm_priority || 'Req. Priority'"></label>
                                <select class="form-control input-sm" v-model="formData['job_priority']" v-bind:disabled="(formData.request_empno != auth.empno || ['I','Y'].includes(formData['job_status']))">
                                  <option v-for="x in priorityCodeData" :value="x.prioity_code">{{x.prioity_des}}</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                          <!-- Description Contact -->
                          <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6">
                              <!-- Doc Date and Complete Date -->
                              <fieldset v-bind:disabled="isDisabled('h1')">
                              <div class="row">
                                <div class="col-lg-6">
                                  <div class="form-group">
                                    <label v-text="ui.csm_docdate || 'Doc. Date'"></label>
                                    <datepicker input-class="form-control input-sm" v-model="formData['job_date']" overdate="" :disabled="true"></datepicker>
                                  </div>
                                </div>
                                <div class="col-lg-6">
                                  <div class="form-group">
                                    <label v-text="ui.re_complete_date_v2 || 'Completed Date'"></label>
                                    <datepicker input-class="form-control input-sm" v-model="formData['job_complete_date']" disabled="true"></datepicker>
                                  </div>
                                </div>
                              </div>
                              <!-- Project -->
                              <div class="row" v-if="!formData['dpt_no']">
                                <div class="col-lg-4 col-md-6 col-sm-6">
                                  <div class="form-group">
                                    <label class="text-danger" v-text="ui.project || 'Project'"></label>
                                    <span class="input-group">
                                      <input type="text" class="form-control input-sm" v-model="formData['pre_event']" readonly />
                                      <span class="input-group-btn">
                                        <button class="btn btn-sm bg-navy" @click="$refs.ct_project2.openModal()" ref="pre_event"><i class="fa fa-search"></i></button>
                                        <button class="btn btn-sm btn-danger" @click="clearData(formData, ['pre_event', 'pre_des', 'customer_code', 'customer_name','mg_ma'])"><i class="fa fa-close"></i></button>
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div class="col-lg-8 col-md-6 col-sm-6">
                                  <div class="form-group">
                                    <label class="pull-right">(เลือกอย่างใดอย่างหนึ่ง)</label>
                                    <input type="text" class="form-control input-sm" v-model="formData['pre_des']" readonly />
                                  </div>
                                </div>
                              </div>
                              <!-- Department -->
                              <div class="row" v-if="!formData['pre_event']">
                                <div class="col-lg-4 col-md-6 col-sm-6">
                                  <div class="form-group">
                                    <label class="text-danger" v-text="ui.department || 'Department'"></label>
                                    <span class="input-group">
                                      <input type="text" class="form-control input-sm" v-model="formData['dpt_no']" readonly />
                                      <span class="input-group-btn">
                                        <button class="btn btn-sm bg-navy" @click="$refs.ct_department.openModal()"><i class="fa fa-search"></i></button>
                                        <button class="btn btn-sm btn-danger" @click="clearData(formData, ['dpt_no', 'dpt_no_name'])"><i class="fa fa-close"></i></button>
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div class="col-lg-8 col-md-6 col-sm-6">
                                  <div class="form-group">
                                    <label class="pull-right">(เลือกอย่างใดอย่างหนึ่ง)</label>
                                    <input type="text" class="form-control input-sm" v-model="formData['dpt_no_name']" readonly />
                                  </div>
                                </div>
                              </div>
                              </fieldset>
                              <!-- Customer -->
                              <fieldset v-bind:disabled="isDisabled('h2')">
                              <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-6">
                                  <div class="form-group">
                                    <label class="text-danger" v-text="ui.customer || 'Customer'"></label>
                                    <span class="input-group">
                                      <input type="text" class="form-control input-sm" v-model="formData['customer_code']" readonly />
                                      <span class="input-group-btn">
                                        <button class="btn btn-sm bg-navy" @click="customerModalSelected()"><i class="fa fa-search"></i></button>
                                        <button class="btn btn-sm btn-danger" @click="clearData(formData, ['customer_code', 'customer_name'])"><i class="fa fa-close"></i></button>
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div class="col-lg-8 col-md-6 col-sm-6">
                                  <div class="form-group">
                                    <label v-if="!isDeveloper() || !is_mango()">&nbsp;</label>
                                    <label class="pull-right"><a href="#" target="_blank" class="pointer" @click.prevent="queryStringRemoteIP()" v-if="isDeveloper() && is_mango()">(สำหรับ IT : ไปหน้าข้อมูลลูกค้า)</a></label>
                                    <input type="text" class="form-control input-sm" v-model="formData['customer_name']" readonly />
                                  </div>
                                </div>
                              </div>
                              </fieldset>
                              <!-- Contract -->
                              <fieldset v-bind:disabled="isDisabled('h1')">
                              <div class="row">
                                <div class="col-lg-4">
                                  <div class="form-group">
                                    <label class="text-danger" v-text="ui.csm_contract_user || 'Contract User'"></label>
                                    <input type="text" class="form-control input-sm" v-model="formData['contract_user']" maxlength="255" ref="contract_user" />
                                  </div>
                                </div>
                                <div class="col-lg-4">
                                  <span class="checkbox checkbox-inline" style="margin-top:25px">
                                    <label>
                                      <input type="checkbox" true-value="Y" false-value="N" v-model="formData['contract_by_cust']" @change="setContractUser()" />
                                      <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                      <span v-tooltip=" 'Default Contract User ตาม Customer' ">
                                        ลูกค้าเป็นผู้แจ้งเรื่องเอง
                                        <i class="fas fa-info-circle text-danger"></i>
                                      </span>
                                    </label>
                                  </span>
                                </div>
                                <div class="col-lg-4">
                                  <div class="form-group">
                                    <label v-text="ui.contract_pos || 'Contact Position'"></label>
                                    <input type="text" class="form-control input-sm" v-model="formData['contract_pos']" maxlength="255" />
                                  </div>
                                </div>
                              </div>
                              <!-- Contract Phone , E-mail -->
                              <div class="row">
                                <div class="col-lg-4">
                                  <div class="form-group">
                                    <label v-text="ui.re_phone || 'Tel.'"></label>
                                    <input type="text" class="form-control input-sm" v-model="formData['phone']" maxlength="255" ref="phone" />
                                  </div>
                                </div>
                                <div class="col-lg-4">
                                  <div class="form-group">
                                    <label v-text="ui.re_email || 'E-mail'"></label>
                                    <input type="text" class="form-control input-sm" v-model="formData['email']" maxlength="255" />
                                  </div>
                                </div>
                                <div class="col-lg-4">
                                  <div class="form-group">
                                    <label class="text-danger" v-text="ui.csm_contact_code || 'Connection'"></label>
                                    <select class="form-control input-sm" v-model="formData['connection_type']" v-bind:disabled="(formData.request_empno != auth.empno || ['I','Y'].includes(formData['job_status']))" ref="connection_type">
                                      <option v-for="(x,idx) in connectionCodeData" :value="x.contact_code">{{x.contact_name}}</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <!-- Remark -->
                              <div class="row">
                                <div class="col-md-4">
                                  <div class="form-group">
                                    <label v-text="'รายการที่ใช้บ่อย'"></label>
                                    <span class="input-group">
                                      <input type="text" class="form-control input-sm text-bold" v-model="formData['descode']" readonly />
                                      <span class="input-group-btn">
                                        <button class="btn btn-sm bg-navy" @click="openDescModal()"><i class="fa fa-search"></i></button>
                                        <button class="btn btn-sm btn-danger" @click="clearData(formData, ['descode', 'remark'])"><i class="fa fa-close"></i></button>
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <!--<div :class="{'col-lg-12': is_mango(), 'col-lg-8' : !is_mango()}">-->
                                <div class="col-lg-8">
                                  <label v-text="ui.csm_des_contact || 'Description Contact'"></label>
                                  <textarea class="form-control input-sm" rows="4" v-model.trim="formData['remark']"></textarea>
                                </div>
                              </div>
                              </fieldset>
                            </div>
                            <!-- History Request by Customer -->
                            <div class="col-lg-6 col-md-6 col-sm-6">
                              <div class="box box-solid">
                                <div class="box-header with-border">
                                  <h3 class="box-title"><i class="fa fa-folder-open"></i> ประวัติการเปิดใบงานของลูกค้า</h3>
                                </div>
                                <div class="box-body">
                                  <div class="row">
                                    <div class="col-lg-4">
                                      <div class="info-box">
                                        <span class="info-box-icon bg-green"><i class="ion ion-clipboard"></i></span>
                                        <div class="info-box-content">
                                          <span class="info-box-text">Request</span>
                                          <span class="info-box-number">{{historyTotal.total_request || 0}} รายการ</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-lg-4">
                                      <div class="info-box">
                                        <span class="info-box-icon bg-aqua"><i class="fa fa-hourglass-half"></i></span>
                                        <div class="info-box-content">
                                          <span class="info-box-text">Pending</span>
                                          <span class="info-box-number">{{historyTotal.total_assign || 0}} รายการ</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-lg-4">
                                      <div class="info-box">
                                        <span class="info-box-icon bg-teal"><i class="ion ion-cloud"></i></span>
                                        <div class="info-box-content">
                                          <span class="info-box-text">All Items</span>
                                          <span class="info-box-number">{{historyTotal.total_allitem || 0}} รายการ</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="hidden-md hidden-sm">
                                    <b class="text-danger">หมายเหตุ : </b> รายการทั้งหมดนี้จะไม่นับรวมกับเอกสารใบปัจจุบัน
                                  </div>
                                  <table-stick height="350px">
                                    <table class="table table-hover">
                                      <thead>
                                        <tr>
                                          <th class="tf-3-5">CSM No.</th>
                                          <th class="tf-3">Date</th>
                                          <th class="tf-4">Subject</th>
                                          <th class="tf-3-5" v-text="!xt.isEmpty(formData.pre_event) ? 'Project' : 'Department'"></th>
                                          <th class="tf-3-5">Req. By</th>
                                          <th class="tf-3">Contact By</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="x,idx in historyData" v-bind:class="{'bg-warning': x.job_status == 'W', 'bg-info': x.job_status == 'I', 'bg-success': x.job_status == 'Y'}">
                                          <th><a v-bind:href="baseUrl + 'page/Transaction/v_csm_trn_001/?job_no='+x.job_no" target="_blank">{{x.job_no}}</a></th>
                                          <td>{{x.job_date|date()}}</td>
                                          <td>{{x.subject}}</td>
                                          <td>{{xt.isEmpty(x.pre_event) ? x.dpt_name : x.pre_des}}</td>
                                          <td>{{x.request_empname}}</td>
                                          <td>{{x.contract_user}}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </table-stick>
                                  <!-- Pagination -->
                                  <div style="margin-top: 10px">
                                    <pagination class="pull-left" ref="historyPaging" @page-change="onPageChange($event.page, 'history')"></pagination>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Assignment -->
                <div class="row" id="assign_panel">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="box box-primary">
                      <div class="box-header">
                        <h3 class="box-title font-bold">ส่วนที่ 2 : การมอบหมายงาน</h3>
                      </div>
                      <div class="box-body">
                        <!-- Request Panel -->
                        <div class="row">
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label>Request by</label>
                              <span class="input-group">
                                <input type="text" class="form-control input-sm" v-model.trim="formData['request_empno_name']" readonly />
                                <span class="input-group-btn">
                                  <button class="btn btn-sm bg-navy" @click="empModalSelected('request')" v-bind:disabled="(formData.request_empno != auth.empno || ['W','I','Y','N'].includes(formData.job_status)) && !isAdmin"><i class="fa fa-search"></i></button>
                                </span>
                              </span>
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label v-text="ui.re_email || 'Email'"></label>
                              <input type="text" class="form-control input-sm" v-model.trim="formData['request_empno_email']" readonly />
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label v-text="ui.re_tel || 'Tel.'"></label>
                              <input type="text" class="form-control input-sm" v-model.trim="formData['request_empno_emptel']" readonly />
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label v-text="ui.re_tel_mobile || 'Mobile'"></label>
                              <input type="text" class="form-control input-sm" v-model.trim="formData['request_empno_empmob']" readonly />
                            </div>
                          </div>
                        </div>
                        <!-- Assign Panel -->
                        <div class="row">
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label class="text-danger">Responsible Person (ผู้รับผิดชอบหลัก)</label>
                              <span class="input-group">
                                <input type="text" class="form-control input-sm" v-model.trim="formData['assign_empno_name']" ref="assign_empno" readonly />
                                <span class="input-group-btn">
                                  <button class="btn btn-sm bg-navy" @click="empModalSelected('assign')" v-bind:disabled="['I','Y','N'].includes(formData['job_status']) && !isAdmin"><i class="fa fa-search"></i></button>
                                </span>
                              </span>
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label v-text="ui.re_email || 'Email'"></label>
                              <input type="text" class="form-control input-sm" v-model.trim="formData['assign_empno_email']" readonly />
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label v-text="ui.re_tel || 'Tel.'"></label>
                              <input type="text" class="form-control input-sm" v-model.trim="formData['assign_empno_emptel']" readonly />
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-6 col-sm-6s">
                            <div class="form-group">
                              <label v-text="ui.re_tel_mobile || 'Mobile'"></label>
                              <input type="text" class="form-control input-sm" v-model.trim="formData['assign_empno_empmob']" readonly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Tasks -->
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="box box-primary">
                      <div class="box-header" id="tasks_element">
                        <h3 class="box-title font-bold">ส่วนที่ 3 : รายละเอียดส่วนงาน</h3>
                      </div>
                      <div class="box-body">
                        <div class="nav-tabs-custom">
                          <ul class="nav nav-tabs">
                            <li :class="{active:tab2Active===0}"><a href="#" @click.prevent="changeTab2(0)">Tasks ({{detailData.length || 0}})</a></li>
                            <li :class="{active:tab2Active===1}" v-show="isShowTab2"><a href="#" @click.prevent="changeTab2(1)">Edit Tasks</a></li>
                            <li :class="{active:tab2Active===2}" v-show="isEditDetail || editDetailData.is_db"><a href="#" @click.prevent="changeTab2(2)">สถานะการอนุมัติ</a></li>
                          </ul>
                          <div class="tab-content">
                            <!-- Detail -->
                            <div class="tab-pane" v-bind:class="{active:tab2Active===0}">
                              <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                  <div class="table-responsive">
                                    <table class="table">
                                      <thead>
                                        <tr>
                                          <th v-if="changeMultiWorker() && is_mango()"></th>
                                          <th style="width: 1px;">No.</th>
                                          <th style="width: 1px" class="text-center">#</th>
                                          <th style="width: 100px" v-text="is_mango() ? 'Module' : 'Area'"></th>
                                          <th style="width: 400px">Subject</th>
                                          <th style="width: 150px">Type</th>
                                          <th style="width: 150px">Req. Type</th>
                                          <th style="width: 150px">Status</th>
                                          <th style="width: 250px">Worker</th>
                                          <th style="width: 250px">Checker</th>
                                          <th style="width: 150px">Response Date</th>
                                          <th style="width: 150px">Exspected Date</th>
                                          <th style="width: 150px">Due Date</th>
                                          <th style="width: 150px">Send Pretest Date</th>
                                          <th style="width: 150px">Over Due</th>
                                          <th style="width: 150px">Complete Date</th>
                                          <th style="width: 150px">Approve Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="(x, idx) in detailData" :class="statusClass('',x.status_tmp)">
                                          <td align="center" v-if="changeMultiWorker() && is_mango()">
                                            <span class="checkbox checkbox-inline">
                                              <label>
                                                <input type="checkbox" v-model="x.isCheckData" />
                                                <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                                &nbsp;
                                              </label>
                                            </span>
                                          </td>
                                          <td align="center" class="text-bold">{{x.itemno}}.</td>
                                          <td align="center" v-show="x.showEditOnly || formData.request_empno == auth.empno"><a href="#" @click.prevent="editDetail(x.itemno, false)">Edit</a></td>
                                          <td align="center" v-show="x.isViewOnly && !x.showEditOnly && !x.isTesterOnly"><a href="#" @click.prevent="editDetail(x.itemno, true)">View</a></td>
                                          <td align="center" v-show="x.isTesterOnly && !x.showEditOnly && is_mango()"><a href="#" @click.prevent="editDetail(x.itemno, true)">Review</a></td>
                                          <td>{{is_mango() ? x.module : areaName(x.module)}}</td>
                                          <td>{{x.subject}}</td>
                                          <td class="text-bold">{{itemTypeName(x.item_type)}}</td>
                                          <td>{{reqTypeName(x.req_type)}}</td>
                                          <td class="text-bold text-center" v-bind:class="statusClass('text-', x.status_tmp)">{{statusName(x.status_tmp)}}</td>
                                          <td>{{x.assign_empno_name}} <a href="#" @click.prevent="empModalSelected('change_worker')" v-if="is_mango() && x.isCheckData"><i class="fas fa-search"></i></a></td>
                                          <td>{{x.tester_empno_name}}</td>
                                          <td><b>{{x.response_date | date}}</b></td>
                                          <td class="text-danger"><b>{{x.due_date | date}}</b></td>
                                          <td><b>{{x.worker_end_date | date}}</b></td>
                                          <td>{{x.send_pretest_dt | date}}</td>
                                          <td align="center"><p class="text-danger"><b>{{x.overdue > 0 ? x.overdue : ''}}</b></p></td>
                                          <td class="text-success"><b>{{x.complete_date | date}}</b></td>
                                          <td>
                                            <label :class="{'label label-success': x.approve_status == 'Y' && x.tester_approve == 'Y',
                                                            'label label-danger': x.approve_status == 'C' && x.tester_approve == 'Y',
                                                            'label label-primary': x.approve_status == 'N' && x.tester_approve == 'Y',
                                                            'label label-purple': x.approve_status == 'Y' && x.tester_approve == 'N',
                                                            'label label-warning': x.approve_status == 'Y' && x.tester_approve == 'R'
                                                           }" style="font-size: 12px">
                                              {{x.approve_status == 'Y' && x.tester_approve == 'Y' ? 'ผ่านการอนุมัติแล้ว' : x.approve_status == 'C' && x.tester_approve == 'Y' ? 'ไม่ผ่านการอนุมัติ' : x.approve_status == 'N' && x.tester_approve == 'Y' ? 'รอการอนุมัติ' : x.approve_status == 'Y' && x.tester_approve == 'N' ? 'รอการตรวจสอบ' : x.approve_status == 'Y' && x.tester_approve == 'R' ? 'ไม่ผ่านการตรวจสอบ' : '' }}
                                            </label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <template v-if="is_mango()">
                                <div class="row">
                                  <div class="col-lg-12 col-md-12 col-sm-12">
                                    <button class="btn btn-sm btn-github" v-if="changeMultiWorker() && is_mango()" @click="saveChangeWorker()"><i class="fas fa-user-edit"></i> <span v-text="ui.csm_change_worker || 'บันทึก (สำหรับเปลี่ยนผู้ปฏิบัติงาน)'"></span></button>
                                    <button class="btn btn-sm btn-primary" v-if="(is_wait(formData.job_status_tmp) || formData.job_status_tmp=='H') && formData['request_empno'] == auth.empno" @click="addDetail">
                                      <i class="fa fa-plus"></i> <span v-text="ui.add_detail || 'Append Row'"></span>
                                    </button>
                                  </div>
                                </div>
                              </template>
                              <template v-if="!is_mango()">
                                <div class="row">
                                  <div class="col-lg-12 col-md-12 col-sm-12">
                                    <button class="btn btn-sm btn-github" v-if="changeMultiWorker()" @click="saveChangeWorker()"><i class="fas fa-user-edit"></i> <span v-text="ui.csm_change_worker || 'บันทึก (สำหรับเปลี่ยนผู้ปฏิบัติงาน)'"></span></button>
                                    <button class="btn btn-sm btn-primary" v-if="(is_wait(formData.job_status_tmp) || formData.job_status_tmp=='H') && formData['request_empno'] == auth.empno" @click="addDetail"><i class="fa fa-plus"></i> <span v-text="ui.add_detail || 'Append Row'"></span></button>
                                  </div>
                                </div>
                              </template>
                            </div>
                            <!-- Edit Detail -->
                            <div class="tab-pane" v-bind:class="{active:tab2Active===1}">
                              <!-- Current Tasks Status -->
                              <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                  <div class="callout" v-bind:class="statusClass('callout-', editDetailData['status_tmp'])">
                                    <span><b>Current Tasks Status : </b>{{statusName(editDetailData['status_tmp'])}}</span>
                                  </div>
                                </div>
                              </div>
                              <!-- Form Data ของ Detail ทั้งหมด -->
                              <div class="row" id="task_detail" ref="task_detail">
                                <!-- Template For Mango -->
                                <template v-if="is_mango()">
                                  <div class="col-md-12 col-sm-12 col-xs-12">
                                    <fieldset v-bind:disabled="((formData.request_empno != auth.empno && formData.assign_empno != auth.empno) ||
                                            (formData.job_status != 'W' && editDetailData.status != 'W') || editDetailData.status == 'Y' || isView) && !isAdmin">
                                      <!-- Service Type , Area , Req. Type , Platform -->
                                      <div class="row">
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.item_type)}">
                                            <label class="text-danger" v-text="ui.csm_service_type || 'Service Type'" ref="item_type"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['item_type']" @change="itemTypeChange()">
                                              <option v-for="x in filterService()" :value="x.serv_code">{{x.serv_name}}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.module)}">
                                            <label class="text-danger" v-text="ui.module || 'Module'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['module']" @change="moduleChange">
                                              <option v-for="x in moduleForMango" :value="x">{{x}}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.platform)}">
                                            <label class="text-danger" v-text="ui.csm_platform || 'Platform'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['platform']">
                                              <option v-for="x in platformCodeData" :value="x.id">{{x.name}}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.req_type)}">
                                            <label class="text-danger" v-text="ui.csm_req_type || 'Req. Type'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['req_type']">
                                              <option v-for="x in requestCodeData" :value="x.req_code" v-if="x.active==='Y'">{{x.req_des}}</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row">
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.object_type)}">
                                            <label v-text="ui.re_job_type || 'Job Type'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['object_type']">
                                              <option value="T">Transaction</option>
                                              <option value="M">Master</option>
                                              <option value="R">Report</option>
                                              <option value="F">Form</option>
                                              <option value="O">Other</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Warning : Subject -->
                                      <div class="row" v-show="!formData['dpt_no'] && !isView && formData['request_empno'] == auth.empno">
                                        <div class="col-md-8 col-sm-12 col-xs-12">
                                          <div class="callout callout-warning" style="margin-bottom:10px;">
                                            <strong>คำเตือน</strong> Subject และ Description จะถูกนำออกไปแสดงให้ลูกค้าเห็น โปรดบันทึกข้อมูลโดยใช้ถ้อยคำที่เป็นทางการ
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Subject -->
                                      <div class="row">
                                        <div class="col-md-8 col-sm-12 col-xs-12">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.subject)}">
                                            <label class="text-danger" v-text="ui.csm_subject || 'Subject'"></label><span class="pull-right text-bold">(ไม่เกิน 100 ตัวอักษร)</span>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['subject']" v-bind:readonly="editDetailData['assign_empno'] != auth.empno && formData['request_empno'] != auth.empno && !isAdmin" maxlength="100" />
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Description -->
                                      <div class="row">
                                        <div class="col-md-8 col-sm-12 col-xs-12">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.detail)}">
                                            <label class="text-danger" v-text="ui.csm_des || 'รายละเอียด'"></label>
                                            <textarea class="form-control input-sm" rows="5" v-model.trim="editDetailData['detail']"></textarea>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Revision (Bug Software) -->
                                      <fieldset v-show="['03'].includes(editDetailData['item_type'])">
                                        <div class="row">
                                          <div class="col-lg-2 col-md-3 col-sm-3" v-if="false">
                                            <div class="form-group">
                                              <label class="text-danger" v-text="ui.revision_date || 'วันที่ Revision'"></label>
                                              <datepicker input-class="form-control input-sm" v-model.trim="editDetailData['revision_add_dt']"></datepicker>
                                            </div>
                                          </div>
                                          <div class="col-md-6 col-sm-6 col-xs-5">
                                            <div class="form-group">
                                              <label :class="{'text-danger': formData['request_empno'] == auth.empno}">เลขที่ Revision ที่พบปัญหาของโปรแกรม</label><span class="text-bold pull-right">(กรอกได้เฉพาะตัวเลขเท่านั้น)</span>
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['revision_bug']" @keypress="numericOnly" v-bind:readonly="formData['request_empno'] != auth.empno" maxlength="28" ref="revision_bug" />
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- Risk Management -->
                                      <fieldset v-bind:disabled="formData.request_empno != auth.empno">
                                        <div class="row">
                                          <div class="col-md-8 col-sm-12 col-xs-12">
                                            <div class="table-responsive">
                                              <table class="table table-bordered table-striped table-hover">
                                                <thead>
                                                  <tr>
                                                    <th class="text-left text-middle risk-th" colspan="4">
                                                      Risk / Requirements Security
                                                      <span class="radio radio-inline">
                                                        <label>
                                                          <input type="radio" name="risk_detail" value="Y" v-model="editDetailData['risk_status']" @click="checkRisk('Y')">
                                                          <span class="cr"><i class="cr-icon fa fa-circle"></i></span>
                                                          <strong>Yes</strong>
                                                        </label>
                                                      </span>
                                                      <span class="radio radio-inline">
                                                        <label>
                                                          <input type="radio" name="risk_detail" value="N" v-model="editDetailData['risk_status']" @click="checkRisk('N')">
                                                          <span class="cr"><i class="cr-icon fa fa-circle"></i></span>
                                                          <strong>No</strong>
                                                        </label>
                                                      </span>
                                                      <span class="pull-right pointer" @click="appendRows('risk')" v-show="editDetailData['risk_status']=='Y'">
                                                        {{ui.add_detail || 'เพิ่มรายการ'}}
                                                      </span>
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr v-for="x,idx in showRisk()">
                                                    <td align="center" class="tf-1 text-middle">
                                                      <b>{{idx+1}}.</b>
                                                    </td>
                                                    <td class="tf-4">
                                                      <input type="text" class="form-control text-middle input-sm" v-model.trim="x.description" v-bind:disabled="editDetailData['risk_status']=='N'" />
                                                    </td>
                                                    <td align="center" class="tf-3 text-middle">{{x.adduser}}</td>
                                                    <td align="center" class="tf-1 text-middle"><a href="#" @click.prevent="spliceRows(x.itemno, 'risk')"><i class="fas fa-times" v-show="editDetailData['risk_status']=='Y' && x.itemno > 1"></i></a></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- Due Date , Complete Date , Contract -->
                                      <div class="row">
                                        <div class="col-lg-2 col-md-3 col-sm-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.response_date)}">
                                            <label class="text-danger" v-text="ui.response_date || 'วันที่ติดต่อกลับ'"></label>
                                            <datepicker input-class="form-control input-sm" :overdate="datePriority()" :beforedate="true" v-model.trim="editDetailData['response_date']"></datepicker>
                                          </div>
                                        </div>
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group">
                                            <label :class="{'text-danger': editDetailData.assign_empno == auth.empno}" v-text="'วันที่คาดหวัง'"></label>
                                            <datepicker input-class="form-control input-sm" :beforedate="true" v-model.trim="editDetailData['due_date']"></datepicker>
                                          </div>
                                        </div>
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group">
                                            <label v-text="ui.re_completed_date_com || 'วันที่งานเสร็จ'"></label>
                                            <datepicker input-class="form-control input-sm" v-model.trim="editDetailData['complete_date']" disabled="true"></datepicker>
                                          </div>
                                        </div>
                                        <div class="col-md-2 col-sm-3 col-xs-3">
                                          <div class="form-group">
                                            <label class="text-danger" v-text="ui.csm_contract_type || 'ประเภทของสัญญา'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['contract_type']" ref="contract_type" v-bind:disabled="!['01', '02', '04', '05'].includes(editDetailData.item_type)">
                                              <option value="">-- โปรดเลือกรายการที่กำหนด --</option>
                                              <option value="Y">อยู่ในสัญญา</option>
                                              <option value="N">ไม่อยู่ในสัญญา</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row">
                                        <div class="col-lg-2 col-md-3 col-sm-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.worker_start_date) && editDetailData.assign_empno == auth.empno}">
                                            <label :class="{'text-danger': xt.isEmpty(editDetailData.worker_start_date) && editDetailData.assign_empno == auth.empno}" v-text="ui.worker_start_date || 'วันที่เริ่มงาน(Worker)'"></label>
                                            <datepicker input-class="form-control input-sm" v-model.trim="editDetailData['worker_start_date']" :disabled="editDetailData.assign_empno != auth.empno"></datepicker>
                                          </div>
                                        </div>
                                        <div class="col-lg-2 col-md-3 col-sm-3">
                                          <div class="form-group" v-bind:class="{'has-error': xt.isEmpty(editDetailData.worker_end_date) && editDetailData.assign_empno == auth.empno}">
                                            <label :class="{'text-danger': xt.isEmpty(editDetailData.worker_end_date) && editDetailData.assign_empno == auth.empno}" v-text="ui.worker_end_date || 'วันที่คาดว่าจะเสร็จ(Worker)'"></label>
                                            <datepicker input-class="form-control input-sm" v-model.trim="editDetailData['worker_end_date']" :disabled="editDetailData.assign_empno != auth.empno"></datepicker>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Form Type -->
                                      <div class="row">
                                        <div class="col-md-8 col-sm-12 col-xs-12">
                                          <div class="callout callout-warning" v-show="editDetailData['edit_form_qty'] >= 2">
                                            <strong>คำเตือน:</strong> การแก้ไขฟอร์มนี้อาจมีค่าใช้จ่ายเกิดขึ้น เนื่องจากทางลูกค้าได้แจ้งแก้ไขฟอร์มนี้เป็นจำนวน {{editDetailData['edit_form_qty']}} ครั้งแล้ว ซึ่งจำนวนที่ทางเราจะแก้ไขให้โดยไม่คิดค่าใช้จ่ายภายใน 2 ครั้งเท่านั้น
                                          </div>
                                        </div>
                                      </div>
                                      <fieldset v-show="['04','05'].includes(editDetailData['item_type']) && !['RE'].includes(editDetailData['module'])" v-bind:disabled="(['Y'].includes(editDetailData['status']) || isView)">
                                        <div class="row">
                                          <div class="col-md-2">
                                            <label class="text-danger">ประเภทฟอร์ม</label>
                                            <div class="form-group">
                                              <div class="input-group">
                                                <input type="text" class="form-control input-sm" v-model.trim="editDetailData['formcode']" readonly>
                                                <span class="input-group-btn">
                                                  <button class="btn btn-sm bg-navy" @click="$refs.form_modal_1.openModal()"><i class="fas fa-search"></i></button>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-4">
                                            <div class="form-group">
                                              <label class="pull-right">(หากเลือก Type เป็น Request Form/Edit Form กรุณาเลือกประเภทฟอร์มด้วย)</label>
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['formname']" readonly>
                                            </div>
                                          </div>
                                          <div class="col-sm-3">
                                            <div style="margin-top:25px;">
                                              <span class="checkbox checkbox-inline" v-tooltip=" 'โปรดระวังการติ๊กเลือก ผิดที่โปรแกรม จำเป็นต้องเป็นข้อมูลที่ผิดที่โปรแกรมจริงๆ เท่านั้น ถึงจะเลือกติ๊กได้ มิเช่นนั้นอาจเกิดการบันทึกข้อมูลที่ไปแสดงยังลูกค้าผิดพลาดได้' ">
                                                <label>
                                                  <input type="checkbox" v-model="editDetailData['wrong_program']" true-value="Y" false-value="N" />
                                                  <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                                  ผิดที่โปรแกรม
                                                </label>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                    </fieldset>
                                    <fieldset v-bind:disabled="((formData.request_empno != auth.empno && formData.assign_empno != auth.empno && editDetailData.assign_empno != auth.empno) || editDetailData.status_tmp != 'W' || isView) && !isAdmin">
                                      <!-- Worker -->
                                      <div class="row">
                                        <div class="col-md-2 col-sm-6 col-xs-6">
                                          <div class="form-group">
                                            <label>Worker (คนปฏิบัติงาน)</label>
                                            <span class="input-group">
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['assign_empno']" readonly />
                                              <span class="input-group-btn">
                                                <button class="btn btn-sm bg-navy" @click="empModalSelected('assign_detail')"><i class="fa fa-search"></i></button>
                                                <button class="btn btn-sm btn-danger"><i class="fa fa-close"></i></button>
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        <div class="col-md-4 col-sm-6 col-xs-6">
                                          <div class="form-group">
                                            <label class="pull-right"><a href="#" @click.prevent="openCalenderModal()">(เช็คตารางงานของ Worker)</a></label>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['assign_empno_name']" readonly />
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-md-2 col-sm-2 col-xs-2">
                                            <div class="form-group">
                                              <label>รายการที่</label>
                                              <input type="text" class="form-control text-center text-bold" v-model="editDetailData['itemno']" readonly />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                    <fieldset v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno && (editDetailData.tester_empno != auth.empno && editDetailData.tester_empno_tmp != auth.empno && !emp_is_software_tester())) || ((!emp_is_software_tester() && editDetailData.tester_empno != auth.empno) && isView)">
                                      <!-- Tester -->
                                      <div class="row">
                                        <div class="col-md-2 col-sm-6 col-xs-6">
                                          <div class="form-group">
                                            <label>Tester (ผู้ตรวจสอบ)</label>
                                            <span class="input-group">
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['tester_empno']" readonly />
                                              <span class="input-group-btn">
                                                <button class="btn btn-sm bg-navy" @click="empModalSelected('tester')"><i class="fa fa-search"></i></button>
                                                <button class="btn btn-sm btn-danger"><i class="fa fa-close"></i></button>
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        <div class="col-md-4 col-sm-6 col-xs-6">
                                          <div class="form-group">
                                            <label class="pull-right">หมายเหตุ <i class="fas fa-info-circle text-danger" v-tooltip=" 'ข้อมูลของ Worker กับ Checker จะถูก Default ข้อมูลไว้ก่อน สามารถเปลี่ยนได้' "></i></label>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['tester_empno_name']" readonly />
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                    <div class="row">
                                      <div class="col-md-2 col-sm-6 col-xs-6">
                                        <div class="form-group">
                                          <label class="text-bold">FAQ</label>
                                          <span class="input-group">
                                            <input type="text" class="form-control input-sm text-bold" v-bind:class="{'pointer': editDetailData['ref_faq'] != ''}" style="color:#348eee !important;" @click.prevent="openFaq()" v-model="editDetailData['ref_faq']" readonly />
                                            <span class="input-group-btn">
                                              <button class="btn btn-sm bg-navy" @click="openFaqModal()" v-bind:disabled="formData.add_user != auth.userid && editDetailData.is_db">
                                                <i class="fa fa-search"></i>
                                              </button>
                                              <button class="btn btn-sm btn-danger" @click="clearData(editDetailData, ['ref_faq', 'faqname'])" v-bind:disabled="formData.add_user != auth.userid && editDetailData.is_db"><i class="fa fa-close"></i></button>
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                      <div class="col-md-4 col-sm-6 col-xs-6">
                                        <div class="form-group">
                                          <input type="text" class="form-control input-sm" style="margin-top:25px;" v-model.trim="editDetailData['faqname']" readonly />
                                        </div>
                                      </div>
                                    </div>
                                    <!-- Status Tester Approve -->
                                    <template v-if="editDetailData.tester_empno == auth.empno && editDetailData.status_tmp == 'W' && (['03'].includes(editDetailData.item_type) && formData.request_empno != auth.empno) && formData.job_status == 'W' && editDetailData.is_db">
                                      <!--&& emp_is_software_tester()-->
                                      <div class="row">
                                        <div class="col-md-8 col-sm-12 col-xs-12">
                                          <div class="box box-info">
                                            <div class="box-header with-border">
                                              <h3 class="box-title"><i class="fa fa-folder-open"></i> ตรวจสอบงานประเภท Bug Software</h3>
                                            </div>
                                            <div class="box-body">
                                              <div class="row">
                                                <div class="col-lg-2 col-md-3 col-sm-3">
                                                  <div class="icheck-material-green">
                                                    <input type="radio" id="testerApprove1" name="radio_tester_approve" v-model="editDetailData['tester_approve']" value="Y" />
                                                    <label for="testerApprove1">Approve</label>
                                                  </div>
                                                </div>
                                                <div class="col-lg-2 col-md-3 col-sm-3">
                                                  <div class="icheck-material-red">
                                                    <input type="radio" id="testerApprove2" name="radio_tester_approve" v-model="editDetailData['tester_approve']" value="R" />
                                                    <label for="testerApprove2">Reject to Requestor</label>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </template>
                                    <!-- Status Tester Approve (Reject Remark) -->
                                    <div class="row" v-if="editDetailData.tester_approve == 'R' && editDetailData.is_db">
                                      <div class="col-lg-10 col-md-10 col-sm-10">
                                        <div class="form-group">
                                          <label for="" class="text-danger">เหตุผลการส่งกลับ Requester (Reject Tester)</label>
                                          <textarea class="form-control input-sm" rows="6" v-model="editDetailData['tester_approve_remark']" v-bind:disabled="(editDetailData.tester_empno != auth.empno || !emp_is_software_tester()) && editDetailData.status_tmp != 'W'"></textarea>
                                        </div>
                                      </div>
                                    </div>
                                    <!-- Recovery Tester Approve (For Reject) -->
                                    <div class="row" v-if="editDetailData.tester_approve == 'R' && formData.request_empno == auth.empno && editDetailData.status_tmp != 'Y' && editDetailData.is_db">
                                      <div class="col-md-12 col-sm-12 col-xs-12">
                                        <h5 class="text-bold">สำหรับ Requester : Tester มีการ Reject กลับ หากต้องการให้เทสใหม่ให้กดที่นี้ <a class="btn btn-sm btn-github" href="#" @click.prevent="recoveryTesterTasks('Tester')"><i class="fas fa-recycle"></i> คืนสถานะ</a> หรือต้องการปิดรายการนี้ ให้กดที่นี้ <a class="btn btn-sm btn-danger" href="#" @click.prevent="recoveryTesterTasks('Close')"><i class="fas fa-times-circle"></i> ปิดรายการนี้</a></h5>
                                      </div>
                                    </div>
                                    <!-- Update Status Panel -->
                                    <div v-show="isEditDetail">
                                      <!-- Requester Case -->
                                      <fieldset v-show="formData['request_empno'] == auth.empno && ['S','T','X'].includes(editDetailData['status_tmp']) && !['T'].includes(editDetailData['tester_test_status'])">
                                        <div class="row">
                                          <div class="col-md-8 col-sm-12 col-xs-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Requester Status</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="req_status1" name="radio_req_status" v-model="editDetailData['status']" value="B" />
                                                      <label for="req_status1">Send Back</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-deeppurple">
                                                      <input type="radio" id="req_status2" name="radio_req_status" v-model="editDetailData['status']" value="T" />
                                                      <label for="req_status2">Test</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="req_status3" name="radio_req_status" v-model="editDetailData['status']" value="Y" />
                                                      <label for="req_status3">Complete</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- Worker Case Normal -->
                                      <fieldset v-show="editDetailData['assign_empno'] == auth.empno && (!['X','T','Y'].includes(editDetailData['status_tmp'])) && (!is_qc() || (['Y'].includes(editDetailData['tester_test_status']) || editDetailData['module'] == 'RE' && editDetailData['platform'] == 'WEB'))">
                                        <div class="row">
                                          <div class="col-md-8 col-sm-12 col-xs-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Worker Status</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="taskStatus1" name="radio_task_status" v-model="editDetailData['status']" value="W" />
                                                      <label for="taskStatus1">None</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-red">
                                                      <input type="radio" id="taskStatus2" name="radio_task_status" v-model="editDetailData['status']" value="R" />
                                                      <label for="taskStatus2">Reject</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="taskStatus3" name="radio_task_status" v-model="editDetailData['status']" value="I" />
                                                      <label for="taskStatus3">In Progress</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="taskStatus4" name="radio_task_status" v-model="editDetailData['status']" value="H" />
                                                      <label for="taskStatus4">Hold</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="taskStatus5" name="radio_task_status" v-model="editDetailData['status']" value="S" />
                                                      <label for="taskStatus5">Send Pretest</label>
                                                      <!--Send Pretest-->
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- Worker Case QC -->
                                      <fieldset v-show="editDetailData['assign_empno'] == auth.empno && is_qc() && !['S','T','Y','U'].includes(editDetailData['status_tmp']) && (!['Y'].includes(editDetailData['tester_test_status']))">
                                        <!--&& editDetailData['module'] != 'RE'-->
                                        <div class="row">
                                          <div class="col-md-8 col-sm-12 col-xs-12">
                                            <span class="pull-right"><b class="text-danger">หมายเหตุสำหรับ Worker : </b> เนื่องจาก Service Type นี้ จำเป็นต้องให้ Checker เป็นผู้ตรวจสอบก่อน</span>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-md-8 col-sm-12 col-xs-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Worker Status (QC)</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="qcStatus1" name="radio_qc_status" v-model="editDetailData['status']" value="W" />
                                                      <label for="qcStatus1">None</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-red">
                                                      <input type="radio" id="qcStatus2" name="radio_qc_status" v-model="editDetailData['status']" value="R" />
                                                      <label for="qcStatus2">Reject</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="qcStatus3" name="radio_qc_status" v-model="editDetailData['status']" value="I" />
                                                      <label for="qcStatus3">In Progress</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="qcStatus4" name="radio_qc_status" v-model="editDetailData['status']" value="H" />
                                                      <label for="qcStatus4">Hold</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="qcStatus5" name="radio_task_status" v-model="editDetailData['status']" value="X" />
                                                      <label for="qcStatus5">Send to Tester</label>
                                                      <!--Send to QC-->
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- QC Case(Tester) -->
                                      <fieldset v-show="editDetailData['tester_empno'] == auth.empno && formData['assign_empno'] != auth.empno && editDetailData['send_pretest_to_tester_status'] == 'Y'">
                                        <div class="row">
                                          <div class="col-md-8 col-sm-12 col-xs-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Checker Status</h3>
                                              </div>.
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-3 col-md-3 col-sm-3">
                                                    <div class="icheck-material-purple">
                                                      <input type="radio" id="testerStatus4" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="U" />
                                                      <label for="testerStatus4">Update Program</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-3 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="testerStatus1" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="B" />
                                                      <label for="testerStatus1">Defect</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-3 col-md-3 col-sm-3">
                                                    <div class="icheck-material-deeppurple">
                                                      <input type="radio" id="testerStatus2" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="T" />
                                                      <label for="testerStatus2">Test</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-3 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="testerStatus3" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="Y" />
                                                      <label for="testerStatus3">Send to Requester</label>
                                                      <!--Complete-->
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                    </div>
                                    <!-- Reject Remark -->
                                    <fieldset v-bind:disabled="(editDetailData['status_tmp'] == 'Y' || editDetailData['status_tmp'] == 'R') " v-if="editDetailData['status'] == 'R'">
                                      <div class="row">
                                        <div class="col-lg-10 col-md-10 col-sm-10">
                                          <div class="form-group">
                                            <label for="" class="text-danger">ความคิดเห็นจากผู้ปฏิบัติงาน (Reject Remark)</label>
                                            <textarea class="form-control input-sm" rows="6" v-model.trim="editDetailData['reject_remark']" ref="reject_remark"></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                    <!-- Recovery Tasks -->
                                    <div class="row" v-if="editDetailData.status == 'R' && formData.request_empno == auth.empno && formData.job_status != 'Y'">
                                      <div class="col-md-10 col-sm-12 col-xs-12">
                                        <h5 class="text-bold">สำหรับ Requester : หากมีการ Reject สามารถคลิกที่ <a class="btn btn-sm btn-github" href="#" @click.prevent="recoveryTasks()"><i class="fas fa-refresh"></i> เปลี่ยนสถานะ</a> เพื่อคืนสถานะ Wait ให้รายการนี้</h5>
                                      </div>
                                    </div>
                                    <fieldset v-bind:disabled="(editDetailData['assign_empno'] != auth.empno || isView)"
                                              v-show="((['S','B','T','Y','X','U'].includes(editDetailData['status']) && ['01','02','04','05','06','07'].includes(editDetailData['item_type']) && editDetailData['assign_empno'] == auth.empno) || (editDetailData['tester_empno'] == auth.empno && (editDetailData['revision_is_import'] == 'Y' || !xt.isEmpty(editDetailData['revision'])))) || isAdmin">
                                      <div class="row">
                                        <div class="col-md-1 margin-t-20">
                                          <span class="checkbox checkbox-inline">
                                            <label>
                                              <input type="checkbox" v-model="editDetailData['config']" true-value="Y" false-value="N" />
                                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                              &nbsp;
                                            </label>
                                          </span>
                                          <label>Config</label>
                                        </div>
                                        <div class="col-md-2" v-if="editDetailData['config'] == 'Y'">
                                          <label class="text-danger">Config Code</label>
                                          <input type="text" class="form-control input-sm" v-model.trim="editDetailData['config_code']" maxlength="30" />
                                        </div>
                                        <div class="col-md-5" v-if="editDetailData['config'] == 'Y'">
                                          <label class="text-danger">Config Description</label>
                                          <input type="text" class="form-control input-sm" v-model.trim="editDetailData['config_desc']" maxlength="300" />
                                        </div>
                                      </div>
                                    </fieldset>
                                    <!-- Update List -->
                                    <fieldset v-bind:disabled="(editDetailData['assign_empno'] != auth.empno || isView) && !isAdmin"
                                              v-show="((['S','B','T','Y','X','U'].includes(editDetailData['status']) && !['08','09'].includes(editDetailData['item_type'])
                                              && editDetailData['assign_empno'] == auth.empno) ||
                                              (['03','11'].includes(editDetailData['item_type']))
                                              || (editDetailData['tester_empno'] == auth.empno && (editDetailData['revision_is_import'] == 'Y' || !xt.isEmpty(editDetailData['revision'])))) || isAdmin">

                                      <div v-if="['01','02','03','04','06', '07','11'].includes(editDetailData['item_type']) && ['S','B','T','Y','X','U'].includes(editDetailData['status'])">
                                        <div class="row margin-t-10">
                                          <div v-bind:class="[!['11'].includes(editDetailData['item_type']) ? 'col-md-6' : 'col-md-3']">
                                            <div class="form-group">
                                              <fieldset v-show="!['03','11','9999'].includes(editDetailData['item_type'])">
                                                <label for="">ไปยัง Update List (คู่มือ)</label>
                                                <span class="checkbox checkbox-inline">
                                                  <label>
                                                    <input type="checkbox" v-model="editDetailData['revision_is_import']" true-value="Y" false-value="N" />
                                                    <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                                    &nbsp;
                                                  </label>
                                                </span>
                                                <label class="text-danger">(หากติ๊กเลือก จะเป็นการบังคับให้ทาง Requestor แนบไฟล์ในแท็บ เพิ่มไฟล์ (สำหรับคู่มือ) เพื่อนำไปทำคู่มือให้ลูกค้าเห็น)</label>
                                              </fieldset>
                                              <label class="text-danger">เลขที่ Revision</label>
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['revision']" placeholder="เลขที่ Revision" @keypress="numericOnly" maxlength="28" />
                                            </div>
                                          </div>
                                          <div class="col-sm-3" v-show="['11'].includes(editDetailData['item_type'])">
                                            <div class="form-group">
                                              <label for="">วันที่อัพเดทโปรแกรม</label>
                                              <datepicker input-class="form-control input-sm" v-model="editDetailData['update_software_dt']"></datepicker>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-sm-8">
                                            <div class="form-group">
                                              <label for="">ความคิดเห็นจากผู้ปฏิบัติงาน</label>
                                              <textarea class="form-control input-sm" rows="6" v-model.trim="editDetailData['description_worker']"></textarea>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                  </div>
                                </template>
                                <!-- Template For Customer -->
                                <div v-show="!is_mango()">
                                  <div class="col-md-7 col-sm-7 col-xs-7">
                                    <fieldset v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView">
                                      <!-- Service Type , Area , Req. Type , Platform -->
                                      <div class="row">
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label class="text-danger" v-text="ui.csm_service_type || 'Service Type'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['item_type']" v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView" @change="itemTypeChange()">
                                              <option v-for="x in serviceCodeData" :value="x.serv_code">{{x.serv_name}}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label v-text="ui.area || 'Area'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['module']" v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView">
                                              <option v-if="!formData['pre_event']" value="">กรุณาเลือกโครงการ</option>
                                              <option v-if="formData['pre_event'] && !moduleCodeData.length" value="">ไม่มีข้อมูล</option>
                                              <option v-if="formData['pre_event']" v-for="x in moduleCodeData" :value="x.loccode">{{x.locname}}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div class="col-lg-4 col-md-3 col-sm-3">
                                          <div class="form-group">
                                            <label v-text="ui.csm_req_type || 'Req. Type'"></label>
                                            <vue-select-2 :options="filterReqCodeData()"
                                                          :settings="{theme: 'bootstrap', selectionCssClass: 'form-control input-sm'}"
                                                          v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView">
                                            </vue-select-2>
                                          </div>
                                        </div>
                                      </div>
                                      <!--Sub Service (Customer)-->
                                      <div class="row">
                                        <div class="col-md-4">
                                          <!-- <div class="form-group">
                                            <label v-text="ui.csm_sub_service || 'หมวดงาน'"></label>
                                            <select-2 class="form-control input-sm col-md-12" v-model.trim="editDetailData['serv_code_d']" v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView" :options="filterSubData()" @change="filterSubData2()">
                                            </select-2>
                                          </div> -->
                                          <div class="form-group">
                                            <label v-text="ui.csm_sub_service || 'หมวดงาน'"></label>
                                            <vue-select-2 :options="filterSubData()"
                                                          :settings="{theme: 'bootstrap', selectionCssClass: 'form-control input-sm'}"
                                                          v-model.trim="editDetailData['serv_code_d']"
                                                          v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) ||
                                                           (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView">
                                            </vue-select-2>
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                           <div class="form-group">
                                            <label v-text="'ประเภทงาน'"></label>
                                            <vue-select-2 :options="filterSubData2()"
                                                          :settings="{theme: 'bootstrap', selectionCssClass: 'form-control input-sm'}"
                                                          v-model.trim="editDetailData['serv_code_d2']"
                                                           v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || 
                                                           (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView">
                                            </vue-select-2>
                                          </div>
                                          <!-- <div class="form-group">
                                            <label v-text="ui.csm_sub_service || 'ประเภทงาน'"></label>
                                            <select-2 class="form-control input-sm col-md-12" v-model.trim="editDetailData['serv_code_d2']" v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || (formData.job_status != 'W' && editDetailData.status_tmp != 'W') || isView" :options="filterSubData2()">
                                              <option v-for="x in filterSubData()" :value="x.serv_code_d">{{x.remark}}</option>
                                            </select-2>
                                          </div> -->
                                        </div>
                                        <!-- <div class="col-md-4">
                                          <div class="form-group">
                                          <label>Module</label>
                                          <vue-select-2 :options="[
                                                          { id: 'ALL', text: 'ALL' },
                                                          { id: 'AP', text: 'AP' },
                                                          { id: 'AR', text: 'AR' },
                                                          { id: 'GL', text: 'GL' }
                                                        ]"
                                                        :settings="{theme: 'bootstrap', selectionCssClass: 'form-control input-sm'}"
                                                        v-model="editDetailData['serv_code_d']">
                                          </vue-select-2>
                                        </div>
                                        </div> -->
                                      </div>
                                      <!-- Subject (Customer) -->
                                      <div class="row" style="margin-top:10px;">
                                        <div class="col-lg-12 col-md-12 col-sm-12">
                                          <div class="form-group">
                                            <label class="text-danger" v-text="ui.csm_subject || 'Subject'"></label><span class="pull-right  text-bold">(ไม่เกิน 100 ตัวอักษร)</span>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['subject']" v-bind:readonly="editDetailData['assign_empno'] != auth.empno && formData['request_empno'] != auth.empno" maxlength="100" />
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Description (Customer) -->
                                      <div class="row">
                                        <div class="col-lg-12 col-md-12 col-sm-12">
                                          <div class="form-group">
                                            <label class="text-danger" v-text="ui.csm_des || 'รายละเอียด'"></label>
                                            <textarea class="form-control input-sm" rows="5" v-model.trim="editDetailData['detail']"></textarea>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Due Date , Complete Date (Customer) -->
                                      <div class="row">
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label class="text-danger" v-text="ui.response_date || 'วันที่ติดต่อกลับ'"></label>
                                            <datepicker input-class="form-control input-sm" :overdate="datePriority()" v-model.trim="editDetailData['response_date']"></datepicker>
                                          </div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label v-text="ui.duedate || 'Due Date'"></label>
                                            <datepicker input-class="form-control input-sm text-success" v-model.trim="editDetailData['due_date']"></datepicker>
                                          </div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label v-text="ui.re_completed_date_com || 'Complete Date'"></label>
                                            <datepicker input-class="form-control input-sm" v-model.trim="editDetailData['complete_date']" disabled="true"></datepicker>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Alert Date (Customer) -->
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="form-group">
                                            <label>Alert Before Due Date(Days)</label>
                                            <number class="form-control input-sm" v-model="editDetailData['noti_date']"></number>
                                          </div>
                                        </div>
                                        <div class="col-md-8" style="margin-top:25px;">
                                          <span class="checkbox checkbox-inline">
                                            <label>
                                              <input type="checkbox" true-value="Y" false-value="N" v-model="editDetailData['noti_active']" v-bind:disabled="true">
                                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                              Alert Active
                                            </label>
                                          </span>
                                          <span class="checkbox checkbox-inline">
                                            <label>
                                              <input type="checkbox" true-value="Y" false-value="N" v-model="editDetailData['noti_line']" v-bind:disabled="true">
                                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                              Line
                                            </label>
                                          </span>
                                          <span class="checkbox checkbox-inline">
                                            <label>
                                              <input type="checkbox" true-value="Y" false-value="N" v-model="editDetailData['noti_email']" v-bind:disabled="true">
                                              <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                              Email
                                            </label>
                                          </span>
                                        </div>
                                      </div>
                                      <!-- Customer Contract -->
                                      <div class="row" v-if="company=='SCJV'">
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label class="text-danger" v-text="ui.csm_contract_type || 'ประเภทของประกัน'"></label>
                                            <select class="form-control input-sm" v-model.trim="editDetailData['contract_type']" ref="contract_type">
                                              <option value="">-- โปรดเลือกรายการที่กำหนด --</option>
                                              <option value="Y">อยู่ในประกัน</option>
                                              <option value="N">ไม่อยู่ในประกัน</option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Item Warrnaty , Serial Number , Price (For Claim) -->
                                      <div class="row">
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label>Item (รายการสินค้า)</label>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['item_name']" readonly />
                                          </div>
                                        </div>
                                        <div class="col-lg-8 col-md-4 col-sm-4" v-bind:class="{'col-lg-5' : (company=='GIS' || company=='SCJV')}">
                                          <div class="form-group">
                                            <label>Serial Number (รหัสสินค้า)</label>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['serial_number']" readonly />
                                          </div>
                                        </div>
                                        <!--Config For GIS-->
                                        <div class="col-sm-3" v-if="is_claim() && (company=='GIS' || company=='SCJV')">
                                          <div style="margin-top:25px;">
                                            <span class="checkbox checkbox-inline" v-tooltip="'ติ๊กเลือก เพื่อทำ AR ที่โปรแกรม ERP'">
                                              <label>
                                                <input type="checkbox" v-model="editDetailData['ar_status']" true-value="Y" false-value="N" />
                                                <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span> แจ้งเตือนเปิด Invoice
                                              </label>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row" v-if="is_claim() && company != 'GIS'">
                                        <div class="col-lg-4 col-md-4 col-sm-4">
                                          <div class="form-group">
                                            <label>Price (ค่าใช้จ่ายเพิ่มเติม)</label>
                                            <div class="input-group">
                                              <span class="input-group-addon"><i class="fas fa-coins"></i></span>
                                              <number decimals="2" class="form-control input-sm" v-model="editDetailData['claim_price']" :disabled="!is_claim()"></number>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                    <fieldset v-bind:disabled="(formData.request_empno != auth.empno && formData.assign_empno != auth.empno) || editDetailData.status != 'W'">
                                      <!-- Worker (Customer) -->
                                      <div class="row">
                                        <div class="col-lg-4 col-md-6 col-sm-6">
                                          <div class="form-group">
                                            <label>Worker (คนปฏิบัติงาน)</label>
                                            <span class="input-group">
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['assign_empno']" readonly />
                                              <span class="input-group-btn">
                                                <button class="btn btn-sm bg-navy" @click="empModalSelected('assign_detail')"><i class="fa fa-search"></i></button>
                                                <button class="btn btn-sm btn-danger"><i class="fa fa-close"></i></button>
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        <div class="col-lg-8 col-md-6 col-sm-6">
                                          <div class="form-group">
                                            <label class="pull-right"><a href="#" @click.prevent="openCalenderModal()">(เช็คตารางงานของ Worker)</a></label>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['assign_empno_name']" readonly />
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Checker หรือ Tester (Customer) -->
                                      <div class="row" v-if="is_qc()">
                                        <div class="col-lg-4 col-md-6 col-sm-6">
                                          <div class="form-group">
                                            <label>Checker (ผู้ตรวจสอบ)</label>
                                            <span class="input-group">
                                              <input type="text" class="form-control input-sm" v-model.trim="editDetailData['tester_empno']" readonly />
                                              <span class="input-group-btn">
                                                <button class="btn btn-sm bg-navy" @click="empModalSelected('tester')"><i class="fa fa-search"></i></button>
                                                <button class="btn btn-sm btn-danger"><i class="fa fa-close"></i></button>
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        <div class="col-lg-8 col-md-6 col-sm-6">
                                          <div class="form-group">
                                            <label class="pull-right">หมายเหตุ <i class="fas fa-info-circle text-danger" v-tooltip=" 'ข้อมูลของ Worker กับ Checker จะถูก Default ข้อมูลไว้ก่อน สามารถเปลี่ยนได้' "></i></label>
                                            <input type="text" class="form-control input-sm" v-model.trim="editDetailData['tester_empno_name']" readonly />
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                    <!-- Update Status Panel -->
                                    <div v-if="(isEditDetail || isViewOnly)">
                                      <!-- Requester Case (Customer) -->
                                      <fieldset v-show="formData['request_empno'] == auth.empno && ['S','T','X'].includes(editDetailData['status_tmp']) && !['T'].includes(editDetailData['tester_test_status'])">
                                        <div class="row">
                                          <div class="col-lg-10 col-md-12 col-sm-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Requester Status</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="req_status1" name="radio_req_status" v-model="editDetailData['status']" value="B" />
                                                      <label for="req_status1">Send Back</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-deeppurple">
                                                      <input type="radio" id="req_status2" name="radio_req_status" v-model="editDetailData['status']" value="T" />
                                                      <label for="req_status2">Test</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="req_status3" name="radio_req_status" v-model="editDetailData['status']" value="Y" />
                                                      <label for="req_status3">Complete</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- Worker Case Normal (Customer) -->
                                      <fieldset v-show="editDetailData['assign_empno'] == auth.empno && (!['X','T','Y'].includes(editDetailData['status_tmp'])) && !is_qc()">
                                        <div class="row">
                                          <div class="col-lg-10 col-md-12 col-sm-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Worker Status</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="taskStatus1" name="radio_task_status" v-model="editDetailData['status']" value="W" />
                                                      <label for="taskStatus1">None</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-red">
                                                      <input type="radio" id="taskStatus2" name="radio_task_status" v-model="editDetailData['status']" value="R" />
                                                      <label for="taskStatus2">Reject</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="taskStatus3" name="radio_task_status" v-model="editDetailData['status']" value="I" />
                                                      <label for="taskStatus3">In Progress</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="taskStatus4" name="radio_task_status" v-model="editDetailData['status']" value="H" />
                                                      <label for="taskStatus4">Hold</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="taskStatus5" name="radio_task_status" v-model="editDetailData['status']" value="S" />
                                                      <label for="taskStatus5">Send Pretest</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- Worker Case QC (Customer) -->
                                      <fieldset v-show="editDetailData['assign_empno'] == auth.empno && !['S','T','Y','U'].includes(editDetailData['status_tmp']) && is_qc()">
                                        <div class="row">
                                          <div class="col-lg-10 col-md-12 col-sm-12">
                                            <span class="pull-right"><b class="text-danger">หมายเหตุสำหรับ Worker : </b> เนื่องจาก Service Type นี้ จำเป็นต้องให้ Checker เป็นผู้ตรวจสอบก่อน</span>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-lg-10 col-md-10 col-sm-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Worker Status (QC)</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="qcStatus1" name="radio_qc_status" v-model="editDetailData['status']" value="W" />
                                                      <label for="qcStatus1">None</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-red">
                                                      <input type="radio" id="qcStatus2" name="radio_qc_status" v-model="editDetailData['status']" value="R" />
                                                      <label for="qcStatus2">Reject</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-cyan">
                                                      <input type="radio" id="qcStatus3" name="radio_qc_status" v-model="editDetailData['status']" value="I" />
                                                      <label for="qcStatus3">In Progress</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="qcStatus4" name="radio_qc_status" v-model="editDetailData['status']" value="H" />
                                                      <label for="qcStatus4">Hold</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="qcStatus5" name="radio_task_status" v-model="editDetailData['status']" value="X" />
                                                      <label for="qcStatus5">Send to QC</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                      <!-- QC Case (Customer) -->
                                      <fieldset v-show="editDetailData['tester_empno'] == auth.empno && formData['assign_empno'] != auth.empno && editDetailData['send_pretest_to_tester_status'] == 'Y'">
                                        <div class="row">
                                          <div class="col-lg-10 col-md-12 col-sm-12">
                                            <div class="box box-info">
                                              <div class="box-header with-border">
                                                <h3 class="box-title"><i class="fa fa-folder-open"></i> Checker Status</h3>
                                              </div>
                                              <div class="box-body">
                                                <div class="row">
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-amber">
                                                      <input type="radio" id="testerStatus1" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="B" />
                                                      <label for="testerStatus1">Send Back</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-deeppurple">
                                                      <input type="radio" id="testerStatus2" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="T" />
                                                      <label for="testerStatus2">Test</label>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-2 col-md-3 col-sm-3">
                                                    <div class="icheck-material-green">
                                                      <input type="radio" id="testerStatus3" name="radio_tester_status" v-model="editDetailData['tester_test_status']" value="Y" />
                                                      <label for="testerStatus3">Complete</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </fieldset>
                                    </div>
                                    <!-- Reject Remark -->
                                    <fieldset v-bind:disabled="(editDetailData['status_tmp'] == 'Y' || editDetailData['status_tmp'] == 'R') " v-show="editDetailData['status'] == 'R'">
                                      <div class="row">
                                        <div class="col-lg-10 col-md-10 col-sm-10">
                                          <div class="form-group">
                                            <label for="" class="text-danger">Reject Remark: *</label>
                                            <textarea class="form-control input-sm" rows="6" v-model.trim="editDetailData['reject_remark']" ref="reject_remark"></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </fieldset>
                                  </div>
                                  <!-- Detail : Select Item Warranty -->
                                  <div class="col-lg-5 col-md-5 col-sm-5">
                                    <div class="row">
                                      <div class="col-lg-12 col-md-12 col-sm-12">
                                        <div class="box box-success">
                                          <div class="box-header with-border">
                                            <h3 class="box-title"><i class="ion ion-folder"></i> รายการที่อยู่ในประกันตามโครงการ</h3>
                                          </div>
                                          <div class="box-body">
                                            <!-- Detail : Search Keyword -->
                                            <div class="row">
                                              <div class="col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-group">
                                                  <div class="input-group">
                                                    <input type="text" class="form-control input-sm" @keyup.enter="searchWarranty()" v-model.trim="war_text" placeholder="Keyword : Serial Number ชื่อรายการประกัน หรือ ชื่อพื้นที่" />
                                                    <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="searchWarranty()"><i class="ion ion-search"></i></button></span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <!-- Detail : Tab Customer and Supplier -->
                                            <div class="nav-tabs-custom">
                                              <ul class="nav nav-tabs">
                                                <li :class="{active:tabWarrantyActive===0}"><a href="#" @click.prevent="changeTab4(0)">รายการประกันสินค้า ({{customerWarData.length || 0}})</a></li>
                                              </ul>
                                              <div class="tab-content">
                                                <!-- Detail : Customer -->
                                                <div class="tab-pane" v-bind:class="{active:tabWarrantyActive===0}">
                                                  <!-- Table Customer -->
                                                  <table-stick height="300">
                                                    <table class="table table-bordered table-hover">
                                                      <thead>
                                                        <tr>
                                                          <th class="tf-1 text-middle" rowspan="2"></th>
                                                          <th class="tf-3 text-middle text-center" rowspan="2">พื้นที่</th>
                                                          <th class="tf-4 text-middle text-center" rowspan="2">รายการ</th>
                                                          <th class="tf-3 text-middle text-center" rowspan="2" v-if="isUsevendor()">รหัสสินค้า</th>
                                                          <th class="tf-3 text-center" colspan="2">Date Warranty Customer</th>
                                                          <th class="tf-3-5 text-middle text-center" rowspan="2">คงเหลือ</th>
                                                          <th class="tf-3 text-middle text-center" rowspan="2" v-if="isUsevendor()">ชื่อร้านค้า</th>
                                                          <th class="tf-3 text-center" colspan="2" v-if="isUsevendor()">Date Warranty Vendor</th>
                                                          <th class="tf-3-5 text-middle text-center" rowspan="2" v-if="isUsevendor()">คงเหลือ</th>
                                                        </tr>
                                                        <tr>
                                                          <th class="tf-3 text-center">วันเริ่มต้น</th>
                                                          <th class="tf-3 text-center">วันสิ้นสุด</th>
                                                          <th class="tf-3 text-center" v-if="isUsevendor()">วันเริ่มต้น</th>
                                                          <th class="tf-3 text-center" v-if="isUsevendor()">วันสิ้นสุด</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr v-for="x,idx in customerWarData">
                                                          <th align="center"><a href="#" @click.prevent="selectedWarrantyItem(x)" :class="{'isDisabled': ['I','Y'].includes(formData.job_status) || isView}"><i class="fas fa-reply"></i></a></th>
                                                          <td>{{x.locname}}</td>
                                                          <td>{{x.war_des}}</td>
                                                          <td v-if="isUsevendor()">{{x.serial_number}}</td>
                                                          <td>{{x.startdate | date()}}</td>
                                                          <td>{{x.enddate | date()}}</td>
                                                          <td v-if="x.lifetime != 'Y'">{{x.overdueY}} {{x.overdueM}} {{x.overdueD}}</td>
                                                          <td v-if="x.lifetime == 'Y'">ตลอดชีพ</td>
                                                          <td v-if="isUsevendor()">{{x.vendor}}</td>
                                                          <td v-if="isUsevendor()">{{x.vendor_start_dt | date()}}</td>
                                                          <td v-if="isUsevendor()">{{x.vendor_end_dt | date()}}</td>
                                                          <td v-if="isUsevendor()">{{x.vendorY}} {{x.vendorM}} {{x.vendorD}}</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </table-stick>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <br />
                              <!-- Detail : Comment, Attach File -->
                              <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12">
                                  <div class="nav-tabs-custom">
                                    <ul class="nav nav-tabs">
                                      <li :class="{active:tab3Active===0}"><a href="#" @click.prevent="changeTab3(0)">ความคิดเห็น (Comment) ({{showComment().length || 0}})</a></li>
                                      <li :class="{active:tab3Active===1}"><a href="#" @click.prevent="changeTab3(1)">เพิ่มไฟล์ Requestor ({{attachTasksCount('B') || 0}})</a></li>
                                      <li :class="{active:tab3Active===5}" v-if="is_mango() && ['03'].includes(editDetailData.item_type)">
                                        <a href="#" class="text-" @click.prevent="changeTab3(5)">เพิ่มไฟล์ Checker (Before) ({{attachTasksCount('S') || 0}})</a>
                                      </li>
                                      <li :class="{active:tab3Active===2}"><a href="#" @click.prevent="changeTab3(2)">เพิ่มไฟล์ Worker ({{attachTasksCount('A') || 0}})</a></li>
                                      <li :class="{active:tab3Active===3}"><a href="#" @click.prevent="changeTab3(3)">เพิ่มไฟล์ Checker (After) ({{attachTasksCount('Y') || 0}})</a></li>
                                      <li :class="{active:tab3Active===4}" v-if="is_mango()"><a href="#" @click.prevent="changeTab3(4)">เพิ่มไฟล์ คู่มือ ({{attachTasksCount('T') || 0}})</a></li>
                                    </ul>
                                    <div class="tab-content">
                                      <!-- Comments -->
                                      <div class="tab-pane" v-bind:class="{active:tab3Active===0}">
                                        <template v-for="x,idx in showComment()">
                                          <div class="row">
                                            <div class="col-lg-8 col-md-8 col-sm-12">
                                              <div v-bind:class="{'box box-success': x.add_user == auth.userid, 'box box-warning': x.add_user != auth.userid }">
                                                <div class="box-body with-border">
                                                  <div class="row">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 ">
                                                      {{x.itemno}}. <b>{{x.comment_user.toUpperCase()}}</b>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6">
                                                      <b class="pull-right">{{x.add_dt|date('DD/MM/YYYY HH:mm:ss')}}</b>
                                                    </div>
                                                  </div>
                                                  <div class="row">
                                                    <div class="col-lg-12 col-md-12 col-sm-12">
                                                      <div v-if="!x.edit" style="margin-top:15px;margin-bottom:15px;">
                                                        <span style="font-size:14px;" v-html="createBr(x['description'])"></span>
                                                      </div>
                                                      <div v-if="x.edit">
                                                        <div class="row">
                                                          <div class="col-md-12 col-sm-12 col-xs-12">
                                                            <textarea class="form-control input-sm" rows="2" v-model.trim="x.description"></textarea>
                                                          </div>
                                                        </div>
                                                        <div class="row">
                                                          <div class="col-md-12 col-sm-12 col-xs-12">
                                                            <div class="pull-right">
                                                              <a href="#" @click.prevent="updateComment(x)"> แก้ไข</a>&nbsp;
                                                              <a href="#" @click.prevent="setEditComment(x)"> ยกเลิก</a>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div class="row" v-if="x.add_user == auth.userid && !x.edit">
                                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                                      <a href="#" @click.prevent="setEditComment(x)">
                                                        <v-icon name="edit" v-tooltip=" 'Edit' " style="width:22px"></v-icon>
                                                      </a>
                                                      <a href="#" @click.prevent="deleteComment(x)">
                                                        <v-icon name="trash-2" v-tooltip=" 'Delete' " style="width:22px"></v-icon>
                                                      </a>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <!-- Add Comment Panel -->
                                        <div class="row" v-show="(formData['job_no'] && formData.job_status != 'H' && editDetailData.is_db && !isView) || (editDetailData.tester_empno == auth.empno && formData['job_no'] && editDetailData.is_db) || (isAdmin && editDetailData.is_db)">
                                          <div class="col-lg-8 col-md-8 col-sm-12">
                                            <div class="form-group">
                                              <label>Add Comment</label><span class="pull-right">
                                                <b class="text-danger">หมายเหตุ : </b><span class="text-warning">สีเหลือง</span> คือ Comment ของคนอื่น <span class="text-success">สีเขียว</span> คือ Comment ของเรา
                                              </span>
                                              <textarea class="form-control input-sm" rows="3" v-model.trim="commentText"></textarea>
                                            </div>
                                            <button class="btn btn-sm bg-aqua" @click="createComment()"><i class="fa fa-check-circle"></i> ส่งข้อความ</button>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Attach File (Requestor) -->
                                      <div class="tab-pane" v-bind:class="{active:tab3Active===1}">
                                        <div class="row">
                                          <div class="col-lg-9 col-md-12 col-sm-12">
                                            <table class="table table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:1px;">No.</th>
                                                  <th style="width:5px;">#</th>
                                                  <th style="width:300px;">File</th>
                                                  <th>Description</th>
                                                  <th>Add Date</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr v-for="x,idx in attachFileTab()">
                                                  <td align="center">{{idx+1}}.</td>
                                                  <td align="center"><a href="#" @click.prevent="delFile(x.itemno, x.item_type)"><i class="fas fa-times" v-if="x.add_user===auth.userid || isAdmin"></i></a></td>
                                                  <td align="center">
                                                    <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                                                    </p>
                                                    <p v-if="['mp4'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                    <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename))">
                                                      <i class="fas fa-file-word fa-5x" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-excel fa-5x" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-powerpoint fa-5x" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-pdf fa-5x" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file fa-5x" v-else=""></i>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                  </td>
                                                  <td><textarea class="form-control input-sm" rows="5" v-model.trim="x.description" v-bind:readonly="(x.add_user != auth.userid || isView) && !isAdmin"></textarea></td>
                                                  <td>{{x.add_dt | date('DD/MM/YYYY HH:mm')}}</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div class="row" v-if="(formData.request_empno == auth.empno && (formData.job_status != 'Y' || editDetailData.status != 'Y') && !isView) || isAdmin">
                                          <div class="col-lg-12 col-md-12 col-sm-12">
                                            <button class="btn btn-sm btn-success" @click="addFile()"><i class="fas fa-upload"></i> Attach File</button>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Attach File (Worker) -->
                                      <div class="tab-pane" v-bind:class="{active:tab3Active===2}">
                                        <div class="row">
                                          <div class="col-lg-9 col-md-12 col-sm-12">
                                            <table class="table table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:1px;">No.</th>
                                                  <th style="width:5px;">#</th>
                                                  <th style="width:300px;">File</th>
                                                  <th>Description</th>
                                                  <th>Description2</th>
                                                  <th>Add Date</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr v-for="x,idx in attachFileTab()">
                                                  <td>{{idx+1}}.</td>
                                                  <td align="center"><a href="#" @click.prevent="delFile(x.itemno, x.item_type)"><i class="fas fa-times" v-if="x.add_user===auth.userid || isAdmin"></i></a></td>
                                                  <td align="center">
                                                    <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                                                    </p>
                                                    <p v-if="['mp4'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                    <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename))">
                                                      <i class="fas fa-file-word fa-5x" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-excel fa-5x" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-powerpoint fa-5x" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-pdf fa-5x" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file fa-5x" v-else=""></i>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                  </td>
                                                  <td><textarea class="form-control input-sm" rows="5" v-model.trim="x.description" v-bind:readonly="(x.add_user != auth.userid || isView) && !isAdmin"></textarea></td>
                                                  <td><textarea class="form-control input-sm" rows="5" v-model.trim="x.description2" v-bind:readonly="(x.add_user != auth.userid || isView) && !isAdmin"></textarea></td>
                                                  <td>{{x.add_dt | date('DD/MM/YYYY HH:mm')}}</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div class="row" v-if="(editDetailData.assign_empno == auth.empno && (formData.job_status != 'Y' || editDetailData.status != 'Y') && !isView) || isAdmin">
                                          <div class="col-lg-12 col-md-12 col-sm-12">
                                            <button class="btn btn-sm btn-success" @click="addFile()"><i class="fas fa-upload"></i> Attach File</button>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Attach File (Checker) -->
                                      <div class="tab-pane" v-bind:class="{active:tab3Active===3}">
                                        <div class="row">
                                          <div class="col-lg-9 col-md-12 col-sm-12">
                                            <table class="table table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:1px;">No.</th>
                                                  <th style="width:5px;">#</th>
                                                  <th style="width:300px;">File</th>
                                                  <th>Description</th>
                                                  <th>Add Date</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr v-for="x,idx in attachFileTab()">
                                                  <td>{{idx+1}}.</td>
                                                  <td align="center"><a href="#" @click.prevent="delFile(x.itemno, x.item_type)"><i class="fas fa-times" v-if="x.add_user===auth.userid || isAdmin"></i></a></td>
                                                  <td align="center">
                                                    <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                                                    </p>
                                                    <p v-if="['mp4'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                    <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename))">
                                                      <i class="fas fa-file-word fa-5x" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-excel fa-5x" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-powerpoint fa-5x" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-pdf fa-5x" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file fa-5x" v-else=""></i>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                  </td>
                                                  <td><textarea class="form-control input-sm" rows="5" v-model.trim="x.description" v-bind:readonly="(x.add_user != auth.userid || isView) && !isAdmin"></textarea></td>
                                                  <td>{{x.add_dt | date('DD/MM/YYYY HH:mm')}}</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div class="row" v-if="((editDetailData.tester_empno == auth.empno && (formData.job_status != 'Y' || editDetailData.status != 'Y') && !isView) || emp_is_software_tester()) || isAdmin">
                                          <div class="col-lg-12 col-md-12 col-sm-12">
                                            <button class="btn btn-sm btn-success" @click="addFile()"><i class="fas fa-upload"></i> Attach File</button>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Attach File (Update List) -->
                                      <div class="tab-pane" v-bind:class="{active:tab3Active===4}">
                                        <div class="row">
                                          <div class="col-lg-9 col-md-12 col-sm-12">
                                            <table class="table table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:1px;">No.</th>
                                                  <th style="width:5px;">#</th>
                                                  <th style="width:300px;">File</th>
                                                  <th>Description</th>
                                                  <th>Add Date</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr v-for="x,idx in attachFileTab()">
                                                  <td>{{idx+1}}.</td>
                                                  <td align="center"><a href="#" @click.prevent="delFile(x.itemno, x.item_type)"><i class="fas fa-times" v-if="x.add_user===auth.userid || isAdmin"></i></a></td>
                                                  <td align="center">
                                                    <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                                                    </p>
                                                    <p v-if="['mp4'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                    <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename))">
                                                      <i class="fas fa-file-word fa-5x" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-excel fa-5x" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-powerpoint fa-5x" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-pdf fa-5x" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file fa-5x" v-else=""></i>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                  </td>
                                                  <td><textarea class="form-control input-sm" rows="5" v-model.trim="x.description" v-bind:readonly="(x.add_user != auth.userid || isView) && !isAdmin"></textarea></td>
                                                  <td>{{x.add_dt | date('DD/MM/YYYY HH:mm')}}</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div class="row" v-if="(formData['request_empno'] == auth.empno && editDetailData['status'] == 'Y') || isAdmin">
                                          <div class="col-lg-12 col-md-12 col-sm-12">
                                            <button class="btn btn-sm btn-success" @click="addFile()"><i class="fas fa-upload"></i> Attach File</button>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Attach File (Bug Software) -->
                                      <div class="tab-pane" v-bind:class="{active:tab3Active===5}">
                                        <div class="row">
                                          <div class="col-lg-9 col-md-12 col-sm-12">
                                            <table class="table table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:1px;">No.</th>
                                                  <th style="width:5px;">#</th>
                                                  <th style="width:300px;">File</th>
                                                  <th>Description</th>
                                                  <th>Add Date</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr v-for="x,idx in attachFileTab()">
                                                  <td>{{idx+1}}.</td>
                                                  <td align="center"><a href="#" @click.prevent="delFile(x.itemno, x.item_type)"><i class="fas fa-times" v-if="x.add_user===auth.userid || isAdmin"></i></a></td>
                                                  <td align="center">
                                                    <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                                                    </p>
                                                    <p v-if="['mp4'].includes(getFileExt(x.filename))">
                                                      <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                    <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename))">
                                                      <i class="fas fa-file-word fa-5x" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-excel fa-5x" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-powerpoint fa-5x" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file-pdf fa-5x" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                                      <i class="fas fa-file fa-5x" v-else=""></i>
                                                      <br />
                                                      <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                                                    </p>
                                                  </td>
                                                  <td>
                                                    <textarea class="form-control input-sm" rows="5" v-model.trim="x.description"
                                                              v-bind:readonly="((x.add_user != auth.userid || isView) && editDetailData.tester_empno != auth.empno) && !isAdmin"></textarea>
                                                  </td>
                                                  <td>{{x.add_dt | date('DD/MM/YYYY HH:mm')}}</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                        <div class="row" v-if="((((formData.job_status != 'Y' || editDetailData.status != 'Y') && !isView) || editDetailData.tester_empno == auth.empno)  && emp_is_software_tester()) || isAdmin">
                                          <div class="col-lg-12 col-md-12 col-sm-12">
                                            <button class="btn btn-sm btn-success" @click="addFile()"><i class="fas fa-upload"></i> Attach File</button>
                                          </div>
                                        </div>
                                      </div>
                                      <!-- Input Attach File -->
                                      <input type="file" ref="myFile" name="myFile" accept=".doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx, .pdf, .zip, .rar, .mp4, image/*" v-show="false" hidden>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <br />
                              <!-- Detail : Control Button -->
                              <div class="row">
                                <div class="col-lg-10 col-md-10 col-sm-12">
                                  <div class="row">
                                    <div class="col-lg-12 col-md-12 col-sm-12">
                                      <button class="btn btn-sm bg-navy" v-if="!editDetailData['is_db'] && (formData['request_empno'] == auth.empno || formData['assign_empno'] == auth.empno)" @click="confirmTasks()"><i class="fas fa-plus"></i> ยืนยันการทำรายการ</button>

                                      <button class="btn btn-sm bg-olive" v-if="((isEditDetail || isViewOnly) && ((editDetailData['assign_empno_tmp'] == auth.empno || formData['request_empno'] == auth.empno || formData['assign_empno'] == auth.empno || (editDetailData['tester_empno'] == auth.empno || editDetailData['tester_empno_tmp'] == auth.empno)) && !['H'].includes(formData['job_status'])) && editDetailData['is_db']) || (isAdmin && formData.job_no)" @click="confirmUpdateDetail()"><i class="fa fa-check-circle"></i> อัพเดทข้อมูล</button>

                                      <button class="btn btn-sm btn-github" v-if="is_mango() && (editDetailData['tester_empno'] == auth.empno) && (['03'].includes(editDetailData.item_type) && formData.request_empno != auth.empno) && ((editDetailData.tester_approve_tmp != 'Y' && editDetailData.status_tmp != 'Y') || editDetailData.tester_empno == auth.empno) && editDetailData.is_db" @click="updateTester()"><i class="fas fa-refresh"></i> บันทึกผลการทดสอบ (สำหรับ Tester เท่านั้น)</button>

                                      <button class="btn btn-sm bg-orange" @click="closeTasks()"><i class="fa fa-close"></i> <span v-text="editDetailData.is_db ? 'ปิดหน้าต่าง' : 'ยกเลิกรายการ'"></span></button>

                                      <button class="btn btn-sm btn-danger" v-if="(formData['request_empno'] == auth.empno || isAdmin) && ['N','W','H'].includes(editDetailData['status_tmp']) && !['I','Y'].includes(formData.job_status) && editDetailData.is_db" @click="delTask()"><i class="fas fa-trash"></i> <span v-text="'ลบรายการ'"></span></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- Detail : Approve Status -->
                            <div class="tab-pane" v-bind:class="{active:tab2Active===2}">
                              <div class="row">
                                <div class="col-md-8 col-sm-12 col-xs-12">
                                  <div class="table-responsive">
                                    <table class="table">
                                      <thead>
                                        <tr>
                                          <th class="text-center">No.</th>
                                          <th>Emp No.</th>
                                          <th>Emp Name</th>
                                          <th>{{formData['pre_event'] ? 'Project Position' : 'Department Position'}}</th>
                                          <th>Level App</th>
                                          <th>Approve Status</th>
                                          <th>Remark</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr v-for="(x, idx) in approveTab()">
                                          <td align="center">{{idx+1}}.</td>
                                          <td>{{x.empno}}</td>
                                          <td>{{x.empname}}</td>
                                          <td>{{x.fr_proj_type}}</td>
                                          <td>{{x.levelapp}}</td>
                                          <td>
                                            <label v-bind:class="{'label label-success': x.status == 'Y', 'label label-danger': x.status == 'C', 'label label-primary': x.status == 'N'}" style="font-size:12px">{{x.status == 'Y' ? 'อนุมัติเรียบร้อย' : x.status == 'C' ? 'ไม่อนุมัติ' : x.status == 'N' ? 'รอการอนุมัติ' : ''}}</label>
                                          </td>
                                          <td>{{x.remark_cancel}}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Control Document Button (Ex. บันทึกข้อมูล) -->
                    <app-form ref="appForm">
                      <template slot="extraBtn">
                        <!--isNewApprove && prapproveDataAccept <= 0 &&-->
                        <button class="btn btn-sm btn-warning" v-if="(isEdit && formData.request_empno == auth.empno && !['I','H','N','Y'].includes(formData.job_status) && tab2Active===0)|| isAdmin" @click="confirmNewApprove()"><i class="fas fa-refresh"></i> ส่งอนุมัติใหม่</button>

                        <button class="btn btn-sm btn-danger" v-if="isEdit && formData.request_empno == auth.empno && !['I','Y','N','H'].includes(formData['job_status']) && tab2Active===0" data-toggle="modal" data-target="#cancelModal"><i class="fas fa-times-circle"></i> ยกเลิกเอกสาร</button>

                        <button class="btn btn-sm bg-orange" v-if="formData['request_empno'] == auth.empno && !['W','I','Y','N'].includes(formData['job_status']) && tab2Active===0" @click="saveTemplate()"><i class="fas fa-save"></i> บันทึกฉบับร่าง</button>

                        <button class="btn btn-sm btn-danger" v-if="formData['request_empno'] == auth.empno && !['W','I','Y','N'].includes(formData['job_status']) && tab2Active===0 && !xt.isEmpty(formData.job_no)" @click="deleteTemplate()"><i class="fas fa-trash"></i> ยกเลิกฉบับร่าง</button>
                      </template>
                    </app-form>
                  </div>
                </div>
              </div>
              <!-- Status -->
              <div class="tab-pane" v-bind:class="{active:tab1Active===1}">
                <div class="row">
                  <div class="col-lg-8 col-md-8 col-sm-12">
                    <div class="table-responsive">
                      <table class="table table-bordered table-striped table-hover">
                        <thead>
                          <tr>
                            <th style="width:200px">Date/Time</th>
                            <th style="width:200px">Status</th>
                            <th style="width:200px">User</th>
                            <th style="width:300px">Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x in statusData">
                            <td>{{x.add_dt|date('DD/MM/YYYY HH:mm:ss')}}</td>
                            <td>
                              {{statusName(x.job_status)}}
                            </td>
                            <td>{{x.add_user.toUpperCase()}}</td>
                            <td>{{x.remark}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Assign History -->
              <div class="tab-pane" v-bind:class="{active:tab1Active===2}">
                <div class="row">
                  <div class="col-lg-8 col-md-8 col-sm-12">
                    <div class="table-responsive">
                      <table class="table table-bordered table-striped table-hover">
                        <thead>
                          <tr>
                            <th style="width:200px">Date/Time</th>
                            <th style="width:100px">Ref. Item</th>
                            <th style="width:200px">From</th>
                            <th style="width:200px">To</th>
                            <th style="width:300px">By</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x in assignmentData">
                            <td>{{x.add_dt|date('DD/MM/YYYY HH:mm:ss')}}</td>
                            <td>{{x.ref_itemno || 0}}</td>
                            <td>
                              {{x.req_emp_name}}
                            </td>
                            <td>{{x.assign_emp_name}}</td>
                            <td>{{x.add_user_name}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <!-- History -->
              <div class="tab-pane" v-bind:class="{active:tab1Active===3}">
                <div class="row">
                  <div class="col-lg-8 col-md-8 col-sm-12">
                    <div class="table-responsive">
                      <table class="table table-bordered table-striped table-hover">
                        <thead>
                          <tr>
                            <th style="width:200px">Date/Time</th>
                            <th style="width:200px">Operation</th>
                            <th style="width:200px">User</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x in csmHistotyData">
                            <td>{{x.edit_dt|date('DD/MM/YYYY HH:mm:ss')}}</td>
                            <td>
                              <span v-if="x.edit_type=='H'">Hold</span>
                              <span v-if="x.edit_type=='C'">Open</span>
                              <span v-if="x.edit_type=='U'">Update</span>
                              <span v-if="x.edit_type=='D'">Delete</span>
                              <span v-if="x.edit_type=='A'">Approve</span>
                            </td>
                            <td>{{x.edit_user}}</td>
                            <td>{{x.remark}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>

    <!-- Modal : Calendar Worker -->
    <div class="modal fade" ref="calenderModal">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title"><i class="ion ion-calendar"></i> Work Schedule</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4 col-sm-4 col-xs-4">
                <div class="form-group">
                  <label class="text-danger">ค้นหาจากรายชื่อพนักงาน</label>
                  <select class="form-control input-sm" v-model="checkEmpno">
                    <option v-for="x,idx in employeeData" :value="x.empno">{{x.empfullname_t}}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <div style="margin-top:25px;">
                  <button class="btn btn-sm bg-olive" @click="loadCheckDateWorker()">
                    <i class="fa fa-search"></i>
                    <span v-text="ui.search || 'Search'"></span>
                  </button>
                  <span class="pull-right"><b>ผลการค้นหาพบรายการทั้งหมด {{eventEmployee.length || 0}} รายการ</b></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <vue-event-calendar :title="'CSM Documents'" :events="eventEmployee">
                  <template scope="props">
                    <div v-for="(event, index) in props.showEvents" class="event-item">
                      <span style="font-size:14px;">Document No. <b class="pointer" @click="eventSelected(event.title)" v-text="event.title"></b></span>
                      <span class="pull-right">
                        {{event.dd2t}} :
                        <span>{{event.date}}</span>
                      </span>
                      <hr style="margin-top:5px;margin-bottom:5px;" />
                      Subject : <span v-text="event.desc"></span><br />
                      Request by : <span v-text="event.request_name"></span><br />
                      Assign by : <span v-text="event.assign_name"></span>
                    </div>
                  </template>
                </vue-event-calendar>
              </div>
            </div>
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
    <!-- Modal : Approve Detail -->
    <div class="modal fade" data-backdrop="static" data-keyboard="false" ref="approveModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" aria-label="Close" @click="closeApproveModal()">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">ยืนยันการส่งอนุมัติ</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="form-group">
                  <label class="text-danger">Form Approve</label>
                  <select class="form-control input-sm" v-model.trim="approveFormCode" @change="loadFormDetail()">
                    <option value="" disabled="disabled">-- Select Form Approve --</option>
                    <option v-for="x,idx in approveHeaderData" :value="x.formcode">{{x.form_name}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <span class="pull-right"><b class="text-danger">หมายเหตุ :</b> กรุณาตรวจสอบรายชื่อของผู้อนุมัติ ก่อนทำการกด Submit</span>
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style="width:1px;">No.</th>
                      <th>Employee</th>
                      <th style="width:150px;">Position</th>
                      <th style="width:150px;">Level Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="x,idx in approveDetailData">
                      <td class="text-bold text-center">{{x.itemno}}.</td>
                      <td>{{x.empfullname_t}}</td>
                      <td>{{x.fr_proj_type}}</td>
                      <td>{{x.levelapp}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-success" @click="confirmApprove()"><i class="fas fa-save"></i> ยืนยันการส่งอนุมัติ</button>
            <button class="btn btn-sm bg-navy" @click="closeApproveModal()"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal : Cancel Request -->
    <div class="modal fade" data-backdrop="static" data-keyboard="false" id="cancelModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">กรุณาระบุเหตุผลที่ต้องการ Cancel Request *</h5>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="message-text" class="col-form-label">ข้อความยืนยัน</label>
                <textarea class="form-control input-sm" v-model="formData.cancel_remark" rows="5"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-success" @click="cancelRequest()">ยืนยันการทำรายการ</button>
            <button class="btn btn-sm bg-navy" data-dismiss="modal"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal : FAQ-->
    <div class="modal fade" data-backdrop="static" data-keyboard="false" ref="FaqModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" aria-label="Close" @click="closeFaqModal()">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">FAQ</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-4 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>Search :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="faq_text" @keyup.enter="loadFaqData" />
                    <span class="input-group-btn"><a class="btn btn-sm bg-navy" @click="loadFaqData"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th style="width: 100px" class="text-center no-wrap text-nowrap" nowrap>เลขที่อ้างอิง</th>
                        <th>รายการทั้งหมด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(x,idx) in FaqData" style="cursor: pointer" @click="sendComponent(x, 'faq')">
                        <td class="text-center no-wrap text-nowrap" nowrap>{{x.docno}}</td>
                        <td>{{x.subject}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- Pagination -->
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div style="margin-top: 10px">
                  <pagination class="pull-left" ref="FaqPaging" @page-change="onPageChange($event.page, 'faq')"></pagination>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm bg-navy" @click="closeFaqModal()"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal : Description -->
    <div class="modal fade" data-backdrop="static" data-keyboard="false" ref="DescModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4><i class="fas fa-box-open"></i> Description</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-4 col-md-2 col-sm-2">
                <div class="form-group">
                  <label>{{ui.search || 'Search'}}</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="desc_text" @keyup.enter="loadDescriptionData" />
                    <span class="input-group-btn"><a class="btn btn-sm bg-navy" @click="loadDescriptionData"><i class="fa fa-search"></i></a></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="tf-3">Code</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="pointer"
                          v-for="(x,idx) in descriptionData"
                          @click="sendComponent(x, 'description')">

                        <td class="text-center no-wrap text-nowrap" nowrap>{{x.descode}}</td>
                        <td>{{x.desname}}</td>

                      </tr>
                      <tr>
                        <td class="text-center" v-if="descriptionData.length == 0" colspan="2">ยังไม่มีรายการ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <pagination class="pull-left" ref="descPaging" @page-change="onPageChange($event.page, 'description')"></pagination>
            <button class="btn btn-sm btn-danger" @click="closeDescModal()"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal : Center -->
    <vue-project-list ref="ct_project" @send-data="sendComponent($event, 'project')"></vue-project-list>
    <vue-project2-list ref="ct_project2" @send-data="sendComponent($event, 'project')"></vue-project2-list>
    <vue-department-list ref="ct_department" @send-data="sendComponent($event, 'department')"></vue-department-list>
    <vue-employee-list ref="ct_emp" @send-data="sendComponent($event, 'emp')"></vue-employee-list>
    <vue-responsible-employee-list ref="ct_responsible_emp" :pre_event="formData.pre_event" @send-data="sendComponent($event, 'emp')"></vue-responsible-employee-list>
    <vue-cm-customer-list ref="ct_cm_customer" @send-data="sendComponent($event, 'cm_customer')"></vue-cm-customer-list>
    <vue-form-list ref="form_modal_1" id="form_modal_1" :customer_code="formData['customer_code']" :pre_event="formData['pre_event']" :package_code="formData['package_code']" :formcode="editDetailData['formcode']" :item_type="editDetailData['item_type']" @send-data="sendComponent($event, 'form')"></vue-form-list>

  </div>
</template>

<script type="text/javascript">
  let page = {}
  let appForm = {}
  let supplierPaging = {}
  let historyPaging = {}
  let FaqPaging = {}
  let descPaging = {}
  export default {
    data() {
      return {
        auth,
        baseUrl,
        baseRoute,
        queryString,
        ui: window.ui,
        xt: $xt,
        company: window.baseCompany,
        tab1Active: 0,
        tab2Active: 0,
        tab3Active: 0,
        tabWarrantyActive: 0,
        isShowTab2: false,
        formData: {},
        editDetailData: {},
        detailData: [],
        prapproveData: [],
        prapproveDataTotal: 0,
        detailComplete: 0,
        commentData: [],
        commentCusData: [],
        attachmentData: [],
        statusData: [],
        csmHistotyData: [],
        assignmentData: [],
        historyData: [],
        historyTotal: {},
        FaqData: [],
        supplierData: [],
        customerWarData: [],
        employeeData: [],
        contactData: [],
        eventEmployee: [],
        checkEmpno: 0,
        detailDataCount: 0,
        testerApproveCount: 0,
        testerApproveWait: 0,
        testerApproveReject: 0,
        prapproveDataAccept: 0,
        isRejectCount: 0,
        prapproveDataReject: 0,
        commentText: "",
        commentCusText: "",
        approveHeaderData: [],
        approveDetailData: [],
        approveFormCode: "",
        questionData: [],
        answerData: [],
        descriptionData: [],
        subCodeData: [],
        subCodeData2: [],
        subData: [],
        qc_form_code: "",
        qc_user: "",
        qc_date: new Date(),
        empType: "",
        war_text: "",
        faq_text: "",
        desc_text: "",
        risk: [],
        type_impact: "",
        isView: false,
        isEdit: false,
        isEditDetail: false,
        isAppendRow: false,
        reloadData: false,
        checkAll: false,
        isNewApprove: false,
        newApprove: false,
        isAdmin: false,
        /* Variable : Center */
        moduleCodeData: "",
        moduleForMango: moduleCodeData,
        platformCodeData,
        statusCodeData,
      };
    },
    methods: {
      /* Method : Control */
      changeTab1(t) {
        this.tab1Active = t;
      },
      changeTab2(t) {
        if (t === 0) this.isShowTab2 = false;
        this.tab2Active = t;
      },
      changeTab3(t) {
        this.tab3Active = t;
      },
      changeTab4(t) {
        this.tabWarrantyActive = t;
      },
      onPageChange(pn, pt) {
        switch (pt) {
          case "supplier":
            supplierPaging.setCurrentPage(pn);
            this.loadSupplierWarranty();
            break;
          case "history":
            historyPaging.setCurrentPage(pn);
            this.loadHistory();
            break;
          case "faq":
            FaqPaging.setCurrentPage(pn);
            this.loadfaqData();
            break;
          case "description":
            descPaging.setCurrentPage(pn);
            this.loadDescriptionData();
            break;
        }
      },
      showEditTab() {
        this.isShowTab2 = true;
        this.changeTab2(1);
        this.changeTab3(0);
        appForm.btnSave.show = false;
        console.log("showEditTab " + appForm.btnSave.show.toString());
        this.$nextTick(() => {
          $('html,body').scrollTop($('#tasks_element').offset().top);
        });
      },
      /* Method : Main Function */
      addDetail() {
        this.isEditDetail = false;
        let q = $linq(this.detailData);
        let max = q.count() == 0 ? 0 : q.max(x => x.itemno);
        max = max + 1;
        console.log("datePriority" + this.datePriority)
        let todayDate = new Date();
        todayDate = moment(todayDate).add(this.datePriority(), 'days');

        this.detailData.push({
          itemno: max,
          subject: '',
          contract_user: '',
          phone: '',
          status: 'W',
          status_tmp: 'W',
          module: '',
          platform: '',
          item_type: '',
          req_type: '',
          assign_empno: this.formData['assign_empno'],
          assign_empno_tmp: this.formData['assign_empno'],
          assign_empno_name: this.formData['assign_empno_name'],
          tester_empno: this.formData['request_empno'],
          tester_empno_name: this.formData['request_empno_name'],
          tester_empno_tmp: this.formData['request_empno'],
          tester_empno_name_tmp: this.formData['request_empno_name'],
          add_user: this.auth.userid,
          add_dt: new Date(),
          due_date: todayDate,
          response_date: '',
          complete_date: '',
          revision: '',
          description_worker: '',
          is_db: false,
          contract_user: '',
          contract_type: '',
          ref_faq: '',
          faqname: '',
          risk_status: 'Y',
        });

        q = $linq(this.detailData);
        this.$set(this, 'editDetailData', q.where(x => x.itemno == max).firstOrDefault());
        this.showEditTab();
        this.checkRisk("Y");
      },
      async delTask() {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูลของ Tasks นี้ ใช่หรือไม่ โปรดตรวจสอบและยืนยันก่อนทำการลบข้อมูลนี้`)) {
          return
        }

        this.detailData = $linq(this.detailData).where(w => !(w.itemno == this.editDetailData['itemno'])).toArray()
        this.attachmentData = $linq(this.attachmentData).where(w => !(w.ref_itemno == this.editDetailData['itemno'])).toArray()
        this.risk = $linq(this.risk).where(w => !(w.ref_itemno == this.editDetailData['itemno'])).toArray()

        let itemno = 1
        this.detailData.forEach((f, idx) => {
          let old_itemno = f.itemno
          f.itemno = itemno++

          $linq(this.attachmentData).where(w => w.ref_itemno == old_itemno).foreach(g => {
            g.ref_itemno = f.itemno;
          });

          $linq(this.risk).where(w => w.ref_itemno == old_itemno).foreach(g => {
            g.ref_itemno = f.itemno;
          });
        })
        this.closeTasks();
      },
      async deleteDetail() {
        if (!await $msg.confirm(`คุณต้องการลบข้อมูลของ Tasks นี้ ใช่หรือไม่ โปรดตรวจสอบและยืนยันก่อนทำการลบข้อมูลนี้`)) {
          return;
        }
        else {
          this.changeTab2(0);
          this.detailData = $linq(this.detailData).where(w => !(w.itemno == this.editDetailData['itemno'])).toArray() || [];
        }

        if (['N', 'W', 'H'].includes(editDetailData['status_tmp'])) {
          try {
            let f = {
              form: this.formData,
            };
            page.loadingBox.show();
            let act = `CSM/Data/CSM_DeleteTemplate`;
            let rsp = await $xt.postServerJson(act, f);
            if (!rsp.success) {
              throw rsp.error;
            }
            $notify.success("ยกเลิกฉบับร่างเรียบร้อยแล้ว");
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({ path: newurl }, '', newurl);
            await $xt.sleep(1000);
            window.location.reload();
          } catch (ex) {
            $msg.alert(``, ex.toString(), `danger`);
          } finally {
            page.loadingBox.hide();
          }
        }
      },
      editDetail(itemno, isView) {
        this.isView = isView || false;
        if ($linq(this.detailData).any(x => x.itemno == itemno && x.is_db && !isView)) {
          this.isEditDetail = true;
        }
        else {
          this.isEditDetail = false;
        }
        var q = $linq(this.detailData).where(x => x.itemno == itemno).firstOrDefault();
        this.$set(this, 'editDetailData', q);
        var status = $linq(this.impact).where(x => x.ref_itemno == this.editDetailData.itemno).select(x => x.status).firstOrDefault();
        this.$set(this, 'type_impact', status);
        if (!isView && this.is_mango()) {
          this.updateReadStatus(itemno);
        }
        this.showEditTab();
        //let ck = ((['S', 'B', 'T', 'Y', 'X', 'U'].includes(this.editDetailData['status']) && !['08', '09'].includes(this.editDetailData['item_type']) && this.editDetailData['assign_empno'] == auth.empno) ||
        //  (['03', '11'].includes(this.editDetailData['item_type']))
        //  || (this.editDetailData['tester_empno'] == auth.empno && (this.editDetailData['revision_is_import'] == 'Y' || !xt.isEmpty(this.editDetailData['revision'])))) || this.isAdmin;
        //let ckk = ['01', '02', '03', '04', '06', '07', '11'].includes(this.editDetailData['item_type']) && ['S', 'B', 'T', 'Y', 'X', 'U'].includes(this.editDetailData['status']);
        //console.log("check revision status " + ck + "status2" + ckk);
      },
      checkRisk(status) {
        switch (status) {
          case "Y":
            $linq(this.risk).where(w => (w.ref_itemno == this.editDetailData.itemno)).count() < 1 ? this.appendRows('risk') : '';
            break;
        }
      },
      confirmTasks() {
        if ($xt.isEmpty(this.editDetailData.item_type)) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Service Type", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.module) && this.is_mango()) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Module", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.platform) && this.is_mango()) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Platform", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.req_type) && this.is_mango()) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Req. Type", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.object_type) && this.is_mango()) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Job Type", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.subject)) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Subject", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.detail)) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Description", `warning`);
          return;
        }
        else if (this.editDetailData.risk_status == 'Y' && $linq(this.risk).where(x => x.ref_itemno == this.editDetailData['itemno']).any(x => $xt.isEmpty(x.description)) && this.is_mango()) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Risk / Requirements Security <br> หากไม่มีให้เลือก No", `warning`);
          return;
        }
        else if ($xt.isEmpty(this.editDetailData.response_date)) {
          this.$refs.task_detail.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุ Response Date", `warning`);
          return;
        }
        else if (this.editDetailData.item_type == '03' && this.formData.request_empno == this.auth.empno && $xt.isEmpty(this.editDetailData.revision_bug) && this.is_mango()) {
          this.$refs.revision_bug.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          $msg.alert(`คำเตือน`, "กรุณาระบุเลขที่ Revision ที่พบปัญหาของโปรแกรม", `warning`);
          return;
        }
        else if (this.formData.request_empno == this.auth.empno && $xt.isEmpty(this.editDetailData.contract_type) && (this.is_mango() || this.company == 'SCJV')) {
          this.$refs.contract_type.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#task_detail').offset().top);
          });
          if (this.is_mango()) {
            $msg.alert(`คำเตือน`, "กรุณาเลือกประเภทของสัญญาว่า อยู่ในสัญญา หรือ ไม่อยู่ในสัญญา", `warning`);
          }
          if (this.company == 'SCJV') {
            $msg.alert(`คำเตือน`, "กรุณาเลือกประเภทของประกันว่า อยู่ในประกัน หรือ ไม่อยู่ในประกัน", `warning`);
          }
          return;
        }
        else {
          if ((this.formData["request_empno"] == this.auth.empno || this.formData["assign_empno"] == this.auth.empno) && this.formData["job_status"] != "Y") appForm.btnSave.show = true;
          this.changeTab2(0);
        }
      },
      closeTasks() {
        if (!this.isEditDetail && !this.editDetailData.is_db) {
          this.detailData = $linq(this.detailData).where(w => !(w.itemno == this.editDetailData.itemno)).toArray() || [];
          this.risk = $linq(this.risk).where(w => !(w.ref_itemno == this.editDetailData.itemno)).toArray() || [];
        }

        if (((this.formData.request_empno == this.auth.empno || this.formData.assign_empno == this.auth.empno) && !["Y", "N"].includes(this.formData.job_status) && this.testerApproveCount == 0 && this.isRejectCount == 0 && this.prapproveDataAccept > 0) || (this.prapproveDataAccept == 0 && $xt.isEmpty(this.formData.job_status)) || (this.formData.request_empno == this.auth.empno && ['W'].includes(this.formData.job_status))) {
          appForm.btnSave.show = true;
          console.log("closeTasks1 " + appForm.btnSave.show.toString());
        }

        if (['H'].includes(this.formData['job_status']) && this.formData['request_empno'] == this.auth.empno) {
          appForm.btnSave.show = true;
          console.log("closeTasks2 " + appForm.btnSave.show.toString());
        }

        if (this.isAdmin) {
          appForm.btnSave.show = true;
          console.log("closeTasks3 " + appForm.btnSave.show.toString());
        }

        this.changeTab2(0);
        this.commentText = '';
      },
      async acceptJob() {
        if (!await $msg.confirm(`คุณต้องการรับงาน ${this.queryString.job_no || 'ไม่พบข้อมูล'} นี้ ใช่หรือไม่`)) {
          this.$set(this.formData, "job_status", "W");
          return;
        }
        else {
          this.$set(this.formData, "job_status", "I");
          await this.saveClick();
          this.reloadData = true;
        }
      },
      async loadData(job_no) {
        page.loadingBox.show();
        let url = `CSM/Data/CSM_Read?job_no=${encodeURIComponent(job_no)}`;
        let resp = await $xt.getServer(url);
        let form = resp.data.form;

        form.job_date = form.job_date;
        form.job_complete_date = form.job_complete_date;
        form.assign_empno_tmp = form.assign_empno;
        form.request_empno_tmp = form.request_empno;
        form.job_status_tmp = form.job_status;
        form.job_priority = form.job_priority || '2';
        form.job_priority_tmp = form.job_priority;

        this.$set(this, "isEdit", true);
        this.$set(this, 'formData', form);
        this.$set(this, 'detailData', resp.data.detail);
        this.$set(this, "commentData", resp.data.comment);
        this.$set(this, 'attachmentData', resp.data.attach);
        this.$set(this, 'prapproveData', resp.data.approve_seq);
        this.$set(this, 'risk', resp.data.risk);
        this.$set(this, 'prapproveDataTotal', $linq(this.prapproveData).count());
        this.$set(this, 'detailDataCount', $linq(this.detailData).count());
        this.$set(this, 'isRejectCount', $linq(this.detailData).where(x => ['R'].includes(x.status)).count());
        this.$set(this, "detailComplete", $linq(this.detailData).where(w => ['Y', 'R'].includes(w.status)).count());

        this.$set(this, 'testerApproveCount', $linq(this.detailData).where(x => ['N', 'R'].includes(x.tester_approve) && x.status != 'Y').count());
        this.$set(this, 'testerApproveWait', $linq(this.detailData).where(x => ['N'].includes(x.tester_approve) && x.status != 'Y').count());
        this.$set(this, 'testerApproveReject', $linq(this.detailData).where(x => ['R'].includes(x.tester_approve) && x.status != 'Y').count());

        this.$set(this, 'prapproveDataAccept', $linq(this.detailData).where(x => ['Y'].includes(x.approve_status)).count());
        this.$set(this, 'prapproveDataReject', $linq(this.detailData).where(x => ['C'].includes(x.approve_status)).count());
        this.$set(this, 'isNewApprove', $linq(this.detailData).any(x => this.isApprove(x.item_type)));

        console.log("isEdit " + this.isEdit);
        console.log("prapproveDataAccept " + this.prapproveDataAccept);
        console.log("prapproveDataReject " + this.prapproveDataReject);
        console.log("isNewApprove " + this.isNewApprove);

        console.log("detailComplete " + this.detailComplete);
        console.log("detailDataCount " + this.detailDataCount);

        this.detailData.forEach((x, idx) => {
          this.$set(x, 'isCheckData', false);

          var isViewOnly = ((x.assign_empno != this.auth.empno && this.formData['request_empno'] != this.auth.empno) ||
            (x.assign_empno == this.auth.empno && this.formData['request_empno'] == this.auth.empno) && x.approve_status == "N" ||
            (this.formData['request_empno'] != this.auth.empno && x.assign_empno == this.auth.empno && ['C', 'N'].includes(x.approve_status)) ||
            ((x.assign_empno == this.auth.empno && this.formData['request_empno'] != this.auth.empno) && this.formData['job_status'] == 'W' && x.approve_status == 'Y') || (x.status == 'R' && this.formData['request_empno'] != this.auth.empno));
          this.$set(x, 'isViewOnly', isViewOnly);

          var isTesterOnly = this.formData["job_status"] == "W" && ((x.tester_empno == this.auth.empno || this.emp_is_software_tester()) && ["03"].includes(x.item_type) && this.is_mango()) && this.formData["request_empno"] != this.auth.empno;
          //console.log("isTesterOnly "+isTesterOnly)
          this.$set(x, 'isTesterOnly', isTesterOnly);

          var showEditOnly = ((x.assign_empno == this.auth.empno || x.tester_empno == this.auth.empno) && !['W'].includes(this.formData.job_status) && x.approve_status == 'Y') || this.formData.request_empno == this.auth.empno || (this.isAdmin && this.formData["job_status"] != "W" && !["03"].includes(x.item_type) && this.emp_is_software_tester() && this.is_mango());
          this.$set(x, 'showEditOnly', showEditOnly);

          var isBugTester = ["03"].includes(x.item_type && this.is_mango() && this.emp_is_software_tester());
          this.$set(x, 'isBugTester', isBugTester);

          this.$set(x, 'assign_empno_tmp', x.assign_empno);
          this.$set(x, 'tester_empno_tmp', x.tester_empno);
          this.$set(x, 'status_tmp', x.status);
          this.$set(x, 'tester_test_status', x.tester_test_status);
          this.$set(x, 'tester_approve_tmp', x.tester_approve);
          this.$set(x, "is_db", true);
        });

        this.commentData.forEach((x, idx) => {
          this.$set(x, "edit", false);
        });

        await this.loadHistory();
        await this.loadStatus();
        await this.loadCSMHistory();
        await this.loadAssignment();

        //LoadData(Customer)
        if (!this.is_mango()) {
          await this.loadDescriptionData();
          await this.loadArea();
          await this.loadCustomerWarranty();
          await this.loadSupplierWarranty();
        }

        let hideBtn = ['W', 'N'].includes(this.formData.job_status) && (this.formData.request_empno != this.auth.empno);
        if (hideBtn) {
          appForm.btnSave.show = false
          console.log("hideBtn1 " + appForm.btnSave.show.toString());
        };

        if (['H'].includes(this.formData.job_status)) {
          appForm.btnSave.show = true;
          console.log("hideBtn2 " + appForm.btnSave.show.toString());
        }

        if (['Y'].includes(this.formData.job_status)) {
          appForm.btnSave.show = false;
          console.log("hideBtn3 " + appForm.btnSave.show.toString());

          await this.loadFormQC();
          if (resp.data.qc.length > 0) {
            this.$set(this, "qc_form_code", $linq(resp.data.qc).select(x => x.qaform).firstOrDefault());
            this.$set(this, "qc_user", $linq(resp.data.qc).select(x => x.adduser_name).firstOrDefault());
            this.$set(this, "qc_date", $linq(resp.data.qc).select(x => x.add_dt).firstOrDefault());
            this.$set(this, "answerData", resp.data.qc);
            this.$set(this.formData, "qa_remark", $linq(resp.data.qc).select(x => x.remark).firstOrDefault());
          };
        };

        if (!$xt.isEmpty(this.queryString.ref_itemno)) {
          let x = $linq(this.detailData).where(x => x.itemno == this.queryString.ref_itemno).firstOrDefault();
          this.editDetail(this.queryString.ref_itemno, x.isViewOnly);
          this.updateReadStatus(this.queryString.ref_itemno);
        }

        document.title = `CSM No. ${job_no}`;
        page.loadingBox.hide();
      },
      async loadStatus() {
        let act = `csm/data/CSM_Read_Status?job_no=${encodeURIComponent(this.queryString.job_no || '')}`;
        let rsp = await $xt.getServer(act);
        this.statusData = rsp.data;
      },
      async loadCSMHistory() {
        let act = `csm/data/CSM_Read_History?job_no=${encodeURIComponent(this.queryString.job_no || '')}`;
        let rsp = await $xt.getServer(act);
        this.csmHistotyData = rsp.data;
      },
      async loadAssignment() {
        let act = `csm/data/CSM_Read_Assignment?job_no=${encodeURIComponent(this.queryString.job_no || '')}`;
        let rsp = await $xt.getServer(act);
        this.assignmentData = rsp.data;
      },
      async loadHistory() {
        let act = `csm/data/CSM_History?pre_event=${this.formData['pre_event'] || ''}&dpt_no=${this.formData['dpt_no'] || ''}&job_no=${this.formData['job_no'] || ''}&skip=${historyPaging.skipItems()}&take=${historyPaging.getItemsPerPage()}`;
        let rsp = await $xt.getServer(act);
        this.historyData = rsp.data;
        this.historyTotal = rsp.total;

        historyPaging.setTotalItems(rsp.total.total_allitem);
        if (!historyPaging.getItemsPerPage()) {
          historyPaging.setCurrentPage(1);
        }
        historyPaging.createPagesArray();

      },
      async loadArea() {
        let act = `CSM/MASTER/ProjArea_ReadList?pre_event2=${this.formData['pre_event2']}`;
        let rsp = await $xt.getServer(act);
        this.moduleCodeData = $linq(rsp.data.data_rows).where(x => x.active == 'Y').toArray();
      },
      async loadCustomerWarranty() {
        //alert(this.editDetailData.module)
        let search_war = this.war_text.length ? this.war_text : '';
        let act = `csm/data/CSM_WarrantyProjectList?pre_event=${this.formData['pre_event']}&text=${search_war || ''}`;
        let rsp = await $xt.getServer(act);

        $linq(rsp.data).foreach(x => {
          let overdue = diffDaysHours(moment(x.enddate, 'Y/M/D hh:mm:ss'), moment(new Date(), 'Y/M/D hh:mm:ss'), ['years', 'months', 'days', 'hours']);
          let v = diffDaysHours(moment(x.vendor_end_date, 'Y/M/D hh:mm:ss'), moment(new Date(), 'Y/M/D hh:mm:ss'), ['years', 'months', 'days', 'hours']);

          this.$set(x, 'overdueY', overdue.years <= 0 || $xt.isEmpty(overdue.years) || isNaN(overdue.years) ? '' : overdue.years + ' ปี ');
          this.$set(x, 'overdueM', overdue.months <= 0 || $xt.isEmpty(overdue.months) || isNaN(overdue.months) ? '' : overdue.months + ' เดือน ');
          this.$set(x, 'overdueD', overdue.days <= 0 || $xt.isEmpty(overdue.days) || isNaN(overdue.days) ? '' : overdue.days + ' วัน ');

          this.$set(x, 'vendorY', v.years <= 0 || $xt.isEmpty(v.years) || isNaN(v.years) ? '' : v.years + ' ปี ');
          this.$set(x, 'vendorM', v.months <= 0 || $xt.isEmpty(v.months) || isNaN(v.months) ? '' : v.months + ' เดือน ');
          this.$set(x, 'vendorD', v.days <= 0 || $xt.isEmpty(v.days) || isNaN(v.days) ? '' : v.days + ' วัน ');
          //this.$set(x, 'overdueH', overdue.hours <= 0 || $xt.isEmpty(overdue.hours) || isNaN(overdue.hours) ? '' : overdue.hours + ' ชั่วโมง ');
        });
        this.customerWarData = rsp.data;
        //console.log("CustWarranty " + JSON.stringify(this.customerWarData));
      },
      async loadSupplierWarranty() {
        let act = `csm/data/Warranty_VenderReadList?pre_event=${this.formData['pre_event']}&search_text=${this.war_text || ''}`;
        let rsp = await $xt.getServer(act);
        this.supplierData = rsp.data.data_rows;
      },
      async isCheckSave() {
        if ($xt.isEmpty(this.formData['subject'])) {
          this.$refs.subject.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : Subject`, `warning`);
          return;
        }
        else if ($xt.isEmpty(this.formData['pre_event']) && $xt.isEmpty(this.formData['dpt_no']) && this.is_mango()) {
          this.$refs.pre_event.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : Project Or Department`, `warning`);
          return;
        }
        else if ((!$xt.isEmpty(this.formData["pre_event"]) || !this.is_mango()) && $xt.isEmpty(this.formData['customer_code'])) {
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : Customer`, `warning`);
          return;
        }
        else if ($xt.isEmpty(this.formData['contract_user'])) {
          this.$refs.contract_user.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : ชื่อผู้ติดต่อ`, `warning`);
          return;
        }
        else if ($xt.isEmpty(this.formData['connection_type'])) {
          this.$refs.connection_type.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : Connection`, `warning`);
          return;
        }
        else if ($xt.isEmpty(this.formData['assign_empno_name'])) {
          this.$refs.assign_empno.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : Responbility Person`, `warning`);
          return;
        }
        else if (this.detailData.length > 0) {
          var countApprove = 0;
          var hasWarning = false;
          $linq(this.detailData).foreach(x => {
            let sm_service = $linq(this.serviceCodeData).where(w => w.serv_code == x.item_type).select(a => a.approve_st).firstOrDefault();
            if (sm_service == "Y") {
              countApprove = countApprove + 1;
            }
            if ($xt.isEmpty(x.response_date) && this.formData["request_empno"] == this.auth.empno) {
              hasWarning = true;
              $msg.alert(`Warning`, `These fields are required : Response Date in Tasks ${x.itemno}`, `warning`);
              return;
            }
          });
          if (countApprove > 0 && this.formData['request_empno'] == this.auth.empno && !hasWarning) {
            if ((this.prapproveDataTotal == 0 && !this.isEdit) || (['H'].includes(this.formData['job_status']) && this.formData['request_empno'] == this.auth.empno)) {
              await this.approveClick();
            } else {
              this.saveClick();
            }
            return;
          }
          else if (hasWarning) {
            return;
          }
          //Check Customer Warranty Status
          else if (this.formData.mg_ma == 'N' && $linq(this.detailData).any(x => !["03", "05", "08", "999"].includes(x.item_type)) && this.is_mango()) {
            $msg.alert(`Warning`, `ลูกค้าไม่ได้ต่อ MA ไม่สามารถเปิดเอกสารอื่นนอกจาก การใช้งานหรือแก้ไขฟอร์ม`, `warning`);
            return;
          }
          else {
            this.saveClick();
            return;
          }
        }
        else {
          this.saveClick();
        }
      },
      async saveClick() {
        if ($xt.isEmpty(this.formData['pre_event']) && $xt.isEmpty(this.formData['dpt_no']) && !this.is_mango() && this.detailComplete == this.detailDataCount && this.detailDataCount > 0) {
          this.$refs.pre_event.focus();
          this.$nextTick(() => {
            $('html,body').scrollTop($('#document_panel').offset().top);
          });
          $msg.alert(`Warning`, `These fields are required : Project Or Department`, `warning`);
          return;
        }

        try {
          let f = {
            form: this.formData,
            detail: this.detailData,
            risk: this.risk,
            attach: this.attachmentData,
            formcode: this.approveFormCode,
            baseUrl: (this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=`).toString()
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_Create`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);

          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?job_no=' + rsp.data;
          window.history.pushState({ path: newurl }, '', newurl);
          await this.loadData(rsp.data);

          if (!$xt.isEmpty(this.editDetailData.itemno)) {
            let itemno = this.editDetailData.itemno;
            let view = this.editDetailData.showEditOnly;
            await this.editDetail(itemno, view);
          }

          $('html,body').animate({ scrollTop: 0 }, 'slow');

          this.isEdit = true;
          this.approveFormCode = "";
          this.approveDetailData = [];
          $(this.$refs.approveModal).modal("hide");

        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async saveTemplate() {
        if (this.formData.mg_ma == 'N' && $linq(this.detailData).any(x => !["03", "05", "08", "999"].includes(x.item_type)) && this.is_mango()) {
          $msg.alert(`Warning`, `ลูกค้าไม่ได้ต่อ MA ไม่สามารถเปิดเอกสารอื่นนอกจาก การใช้งาน ได้`, `warning`);
          return;
        }
        if (!await $msg.confirm(`คุณต้องการบักทึกข้อมูลแบบฉบับร่างก่อน ใช่หรือไม่ เนื่องจากระบบจะทำการรันเลขที่เอกสารให้ทันที`)) {
          return;
        }
        try {
          let f = {
            form: this.formData,
            detail: this.detailData,
            risk: this.risk,
            attach: this.attachmentData,
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_CreateTemplete`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          $notify.success("บันทึกฉบับร่างเรียบร้อยแล้ว");
          var job_no = rsp.data;
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?job_no=' + job_no;
          window.history.pushState({ path: newurl }, '', newurl);
          await this.loadData(job_no);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async deleteTemplate() {
        if (!await $msg.confirm(`คุณต้องการยกเลิกเอกสารฉบับร่าง ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            form: this.formData,
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_DeleteTemplate`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success("ยกเลิกฉบับร่างเรียบร้อยแล้ว");
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.pushState({ path: newurl }, '', newurl);
          await $xt.sleep(1000);
          window.location.reload();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async confirmUpdateDetail() {
        if (this.is_mango()) {
          console.log("Rev " + this.editDetailData['revision']);
          if (this.editDetailData.status == "Y") {
            this.$set(this.editDetailData, 'complete_date', new Date());

            let has_error = false
            let error_message = "<ul>"

            if (this.editDetailData['revision_is_import'] == 'Y' || (this.formData['request_empno'] == this.auth.empno && ['01', '02', '06', '07'].includes(this.editDetailData['item_type']))) {
              var p = this.checkAttachFiles('T', "เพิ่มไฟล์ (สำหรับคู่มือ)", 4);
              has_error = p.has_error;
              error_message = p.error_message;
            }
            if (this.is_qc() && this.emp_is_software_tester() && this.editDetailData["tester_empno"] == this.auth.empno) {
              var p = this.checkAttachFiles('Y', "เพิ่มไฟล์ (สำหรับ Checker)", 3);
              has_error = p.has_error;
              error_message = p.error_message;
            }
            if (this.editDetailData['assign_empno'] == this.auth.empno) {
              if (this.editDetailData['item_type'] == '11' && !['W', 'R', 'I', 'H'].includes(this.editDetailData['status'])) {
                if (!this.editDetailData['revision'] || this.editDetailData['update_software_dt'] == null) {
                  error_message += "<li>Type CSM ของ Task นี้ถูกระบุว่าเป็น Type Update Software กรุณาระบุ Revision No. และ Update Date ด้วย</li>"
                  has_error = true
                }
              }
              if ($xt.isEmpty(this.editDetailData['response_date']) && this.formData["request_empno"] == this.auth.empno) {
                error_message += "<li>วันที่ติดต่อกลับ</li>"
                has_error = true
              }
              if ($xt.isEmpty(this.editDetailData['due_date']) && this.formData["assign_empno"] == this.auth.empno) {
                error_message += "<li>วันที่ครบกำหนด</li>"
                has_error = true
              }
              if (['04', '05'].includes(this.editDetailData['item_type']) && !['RE'].includes(this.editDetailData['module'])) {
                if ($xt.isEmpty(this.editDetailData['formcode'])) {
                  error_message += "<li>ประเภทเอกสาร</li>"
                  has_error = true
                }
                var file_pretest = $linq(this.attachmentData).where(x => x.ref_itemno == this.editDetailData['itemno'] && x.item_type == 'A').count();
                if (file_pretest < 1) {
                  let item_type_name = this.itemTypeName(this.editDetailData["item_type"]);
                  error_message += `<li>CRM Tasks นี้มี Type เป็น ${item_type_name} กรุณาแนบไฟล์และป้อน Description ที่แท็บ Attach Files (Worker) ด้วย</li>`
                  has_error = true
                }
              }
              if (this.editDetailData['config'] == 'Y' && $xt.isEmpty(this.editDetailData['config_code']) && this.formData["assign_empno"] == this.auth.empno) {
                error_message += "<li>Config Code</li>"
                has_error = true
              }
            }
            error_message += "</ul>"
            if (has_error) {
              $msg.alert(`Warning`, error_message, `warning`);
              return true;
            }
            if (this.editDetailData['status_tmp'] == 'Y') {
              await this.updateDetail();
            } else {
              if (!await $msg.confirm(`คุณกำลังจะบันทึกสถานะการทำงานเป็นเสร็จสมบูรณ์ การกระทำนี้ไม่สามารถกู้คืนได้ โปรดยืนยัน`)) {
                return;
              }
              await this.updateDetail();
            }
          }
          else if ((this.editDetailData['status'] == 'B' && this.formData["request_empno"] == this.auth.empno) || (this.editDetailData['tester_test_status'] == 'B' && this.is_qc() && this.editDetailData["tester_empno"] == this.auth.empno) && this.emp_is_software_tester()) {
            let has_error = false
            let error_message = "<ul>"

            if (this.editDetailData['tester_empno'] == this.auth.empno && $xt.isEmpty(this.commentText)) {
              error_message += "<li>กรุณาระบุเหตุผลในการ Send Back ที่แท็บ Comment ด้วย</li>";
              has_error = true;
            }
            error_message += "</ul>"
            if (has_error) {
              $msg.alert(`Warning`, error_message, `warning`);
              return true;
            }
            await this.updateDetail();
          }
          else {
            let has_error = false
            let error_message = "<ul>"

            if ($xt.isEmpty(this.editDetailData['response_date']) && this.formData["request_empno"] == this.auth.empno) {
              error_message += "<li>วันที่ติดต่อกลับ</li>"
              has_error = true
            }

            if ($xt.isEmpty(this.editDetailData['due_date']) && this.formData["assign_empno"] == this.auth.empno) {
              error_message += "<li>วันที่ครบกำหนด</li>"
              has_error = true
            }

            if (this.editDetailData['assign_empno'] == this.auth.empno) {
              if (($xt.isEmpty(this.editDetailData['worker_start_date']) || $xt.isEmpty(this.editDetailData['worker_end_date'])) && !['W', 'R', 'H'].includes(this.editDetailData['status'])) {
                error_message += "<li>ระบุวันที่เริ่มงานและวันที่คาดว่าจะเสร็จ</li>"
                has_error = true
                this.$refs.task_detail.focus();
                this.$nextTick(() => {
                  $('html,body').scrollTop($('#task_detail').offset().top);
                });
              }
              if (this.editDetailData['status'] == "R" && $xt.isEmpty(this.editDetailData['reject_remark'])) {
                error_message += "<li>Reject Remark</li>"
                has_error = true
              }
              //Check Worker Revision
              if ((this.editDetailData['revision_is_import'] == 'Y' || (['S', 'X'].includes(this.editDetailData['status']) && ['01', '02', '03', '04', '06', '07'].includes(this.editDetailData['item_type']))) && !this.editDetailData['revision']) {
                error_message += "<li>กรุณาป้อน Revision No.</li>"
                has_error = true
              }
              if (this.editDetailData['item_type'] == '11' && !['W', 'R', 'I', 'H'].includes(this.editDetailData['status'])) {
                if (!this.editDetailData['revision'] || this.editDetailData['update_software_dt'] == null) {
                  error_message += "<li>Type CSM ของ Task นี้ถูกระบุว่าเป็น Type Update Software กรุณาระบุ Revision No. และ Update Date ด้วย</li>"
                  has_error = true
                }
              }
              if (this.is_qc() && this.formData['request_empno'] == this.editDetailData['tester_empno'] && this.editDetailData['status'] == 'X' && this.editDetailData['module'] == 'RE' && this.editDetailData['platform'] == 'WEB') {
                this.$set(this.editDetailData, 'status', 'S');
              }
            }
            if (this.editDetailData['tester_empno'] == this.empno && this.is_qc()) {
              if (this.editDetailData['tester_test_status'] == "Y" && this.emp_is_software_tester()) {
                var p = this.checkAttachFiles('T', "เพิ่มไฟล์ (สำหรับคู่มือ)", 4);
                has_error = p.has_error;
                error_message = p.error_message;
              }
            }
            if (['04', '05'].includes(this.editDetailData['item_type']) && !['RE'].includes(this.editDetailData['module'])) {

              if ($xt.isEmpty(this.editDetailData['formcode'])) {
                error_message += "<li>Form Type</li>"
                has_error = true
              }
              if (this.editDetailData['assign_empno'] == this.empno && this.editDetailData['status'] == 'S') {

                var file_pretest = $linq(this.attachmentData).where(x => x.ref_itemno == this.editDetailData['itemno'] && x.item_type == 'A').count();

                if (file_pretest < 1 && this.editDetailData['assign_empno'] == this.empno) {
                  let item_type_name = this.itemTypeName(this.editDetailData["item_type"]);
                  error_message += `<li>CRM Tasks นี้มี Type เป็น ${item_type_name} กรุณาแนบไฟล์และป้อน Description ที่แท็บ Attach Files (Worker) ด้วย</li>`
                  has_error = true
                }
              }
            }

            error_message += "</ul>"
            if (has_error) {
              $msg.alert(`Warning`, error_message, `warning`);
              return true;
            }

            if (this.is_qc() && this.editDetailData['tester_test_status'] == 'Y' && this.editDetailData['status'] == 'Y' && this.editDetailData["tester_empno"] == this.auth.empno) {
              if (!await $msg.confirm(`คุณกำลังจะบันทึกสถานะการทำงานเป็นเสร็จสมบูรณ์ การกระทำนี้จะถูกส่งกลับไปยังผู้ที่ทำการเปิด CSM ใบนี้เพื่อทำการทดสอบอีกครั้ง และปิดงานเมื่อทดสอบเสร็จ โปรดยืนยัน`)) {
                return;
              }
              await this.updateDetail(); attachmentData
            } else {
              await this.updateDetail();
            }
          }
        }
        else {
          await this.updateDetail();
        }
      },
      async updateDetail() {
        try {
          let comment = {
            job_no: this.formData.job_no,
            ref_itemno: this.editDetailData.itemno,
            itemno: null,
            description: this.commentText || '',
            edit: false,
            add_user: this.auth.user_id,
            add_dt: new Date()
          };
          let f = {
            form: this.editDetailData,
            risk: this.risk,
            impact: this.impact,
            comment: $xt.isEmpty(this.commentText) ? null : comment,
            arr_comment: $linq(this.showComment()).where(x => x.edit == true).toArray(),
            attachfile: $linq(this.attachmentData).where(x => x.ref_itemno == this.editDetailData.itemno).toArray(),
            baseUrl: (this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=`).toString(),
            config_desc: this.editDetailData['config_desc']
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_UpdateDetail`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          if (rsp.success) {
            await this.loadData(rsp.data.job_no);

            var q = $linq(this.detailData).where(x => x.itemno == rsp.data.itemno).firstOrDefault();
            this.$set(this, 'editDetailData', q);
            this.$set(this, "commentText", "");

            $notify.success(this.ui.alert_save_success);
          } else {
            this.isView = false;
          }
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async createComment() {
        try {
          if ($xt.isEmpty(this.commentText)) {
            $msg.alert(`คำเตือน`, `กรุณากรอก Comment ก่อนกดส่งข้อความ`, `warning`);
            return;
          }
          let comment = {
            job_no: this.formData.job_no,
            ref_itemno: this.editDetailData.itemno,
            itemno: null,
            description: this.commentText || '',
            edit: false,
            add_user: this.auth.user_id,
            add_dt: new Date()
          };
          let f = {
            comment: $xt.isEmpty(this.commentText) ? null : comment,
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_CreateComment`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          if (rsp.success) {
            await this.loadData(rsp.data.job_no);

            var q = $linq(this.detailData).where(x => x.itemno == rsp.data.ref_itemno).firstOrDefault();
            this.$set(this, 'editDetailData', q);
            this.$set(this, "commentText", "");

            $notify.success(this.ui.alert_save_success);
          } else {
            this.isView = false;
          }
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      setEditComment(x) {
        x.edit = !x.edit;
        if (x.edit) {
          x.old_desc = x.description;
        }
        else {
          x.description = x.old_desc;
        }
      },
      async updateComment(x) {
        try {
          let f = {
            comment: x
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_UpdateComment`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(rsp.data);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async deleteComment(x) {
        if (!await $msg.confirm(`คุณต้องการลบ Comment นี้ใช่หรือไม่ โปรดยืนยันข้อมูลก่อนทำรายการดังกล่าว`)) {
          return;
        }
        try {
          let f = {
            comment: x
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_DeleteComment`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_delete_success);
          await this.loadData(rsp.data);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async recoveryTasks() {
        if (!await $msg.confirm(`คุณต้องการส่งเรื่องในรายการที่ ${this.editDetailData.itemno} กลับให้ผู้ปฏิบัติอีกครั้งใช่หรือไม่`)) {
          return;
        };
        try {
          this.$set(this.editDetailData, "status", "W");
          this.$set(this.editDetailData, "reject_remark", null);
          let f = {
            detail: this.editDetailData
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_RecoveryTasks`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(rsp.data.job_no);
          this.$set(this, 'editDetailData', $linq(this.detailData).where(x => x.itemno === rsp.data.itemno).firstOrDefault());
          this.$set(this, "commentText", "");
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async recoveryTesterTasks(keyword) {
        try {
          let f = {
            detail: this.editDetailData
          };
          page.loadingBox.show();
          let act = ``;
          act = keyword == `Tester` ? `CSM/Data/CSM_RecoveryTester` : keyword == "Close" ? `CSM/Data/CSM_CloseTasks` : "";
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(rsp.data.job_no);
          this.$set(this, 'editDetailData', $linq(this.detailData).where(x => x.itemno === rsp.data.itemno).firstOrDefault());
          this.$set(this, "commentText", "");
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async cancelRequest() {
        try {
          let f = {
            job_no: this.formData.job_no,
            cancel_remark: this.formData.cancel_remark,
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_CancelRequest`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(rsp.data);
          $("#cancelModal").modal('hide');
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      showComment() {
        return $linq(this.commentData).where(x => x.ref_itemno == this.editDetailData.itemno).orderBy(x => x.itemno).toArray();
      },
      async searchWarranty() {
        await this.loadCustomerWarranty();
        await this.loadSupplierWarranty();
      },
      selectedWarrantyItem(x) {
        var detail = this.editDetailData;
        this.$set(detail, "module", x.loccode);
        this.$set(detail, "item_name", x.war_des);
        this.$set(detail, "serial_number", x.serial_number);
      },
      /* Method : Approve */
      async approveClick() {
        $(this.$refs.approveModal).modal("show");
        await this.loadFormHeader();
      },
      closeApproveModal() {
        this.newApprove = false;
        $(this.$refs.approveModal).modal("hide");
      },
      async newApproveClick() {
        try {
          let f = {
            header: this.formData,
            detail: this.detailData,
            formcode: this.approveFormCode
          };
          page.loadingBox.show();
          let act = `CSM/Data/NewApprove`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(rsp.data);
          this.newApprove = false;
          this.approveFormCode = "";
          this.closeApproveModal();
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async confirmApprove() {
        if ($xt.isEmpty(this.approveFormCode)) {
          $msg.alert(`คำเตือน`, `กรุณาเลือก Form Code ที่ต้องการส่งอนุมัติ`, `warning`);
          return
        }
        if (this.newApprove && this.isEdit) {
          this.newApproveClick();
          return
        }
        this.saveClick();
      },
      async confirmNewApprove() {
        this.approveClick();
        this.newApprove = true;
      },
      async loadFormHeader() {
        this.approveFormCode = "";
        let act = `CSM/Data/CSM_FormApproveHeader`;
        let rsp = await $xt.getServer(act);
        this.approveHeaderData = rsp;
      },
      async loadFormDetail() {
        let act = `CSM/Data/CSM_FormApproveDetail?formcode=${this.approveFormCode}&pre_event=${this.formData.pre_event || ''}&dpt_no=${this.formData.dpt_no || ''}`;
        let rsp = await $xt.getServer(act);
        this.approveDetailData = rsp;
      },
      /* Method : Description Contact */
      async loadDescriptionData() {
        let act = `Anywhere/Master/Description_ReadList?type=CSM&skip=${descPaging.skipItems()}&take=${descPaging.getItemsPerPage()}&text=${this.desc_text}`;
        let resp = await $xt.getServer(act);
        this.descriptionData = resp.data;

        descPaging.setTotalItems(resp.total ?? 1);
        if (!descPaging.getItemsPerPage()) {
          descPaging.setCurrentPage(1);
        }
        descPaging.createPagesArray();
      },
      async openDescModal() {
        await this.loadDescriptionData();
        $(this.$refs.DescModal).modal("show");
      },
      closeDescModal() {
        $(this.$refs.DescModal).modal("hide");
      },
      /* Method : Ref. FAQ */
      async openFaqModal() {
        await this.loadFaqData();
        $(this.$refs.FaqModal).modal("show");
      },
      closeFaqModal() {
        $(this.$refs.FaqModal).modal("hide");
      },
      async loadFaqData() {
        let act = `CSM/Manual/FAQ_ViewReadList?field=docno&skip=${FaqPaging.skipItems()}&take=${FaqPaging.getItemsPerPage()}&text=${this.faq_text}`;
        let rsp = await $xt.getServer(act);
        this.FaqData = rsp.data;

        FaqPaging.setTotalItems(rsp.total);
        if (!FaqPaging.getItemsPerPage()) {
          FaqPaging.setCurrentPage(1);
        }
        FaqPaging.createPagesArray();
      },
      openFaq() {
        if ($xt.isEmpty(this.editDetailData['ref_faq'])) {
          return;
        }
        window.open(this.baseUrl + `page/article_detail/?docno=${this.editDetailData['ref_faq']}`, "_blank");
      },
      /* Method : Question */
      async loadFormQC() {
        let act = `CSM/Master/QC_ReadList`;
        let rsp = await $xt.getServer(act);
        this.questionData = rsp;
      },
      async loadFormQCDetail() {
        let act = `csm/data/QCCSR_Read?form_code=${encodeURIComponent(this.qc_form_code || '')}&doctype=CSR`;
        let rsp = await $xt.getServer(act);
        this.answerData = rsp.data;

        let qadata = $linq(this.answerData).firstOrDefault();
        this.$set(this.formData, "qa_remark", qadata.remark);
      },
      async saveQC() {
        if ($xt.isEmpty(this.qc_form_code)) {
          $msg.alert(`Warning`, `These fields are required : Form Code (ชุดคำถาม)`, `warning`);
          return;
        }
        if (this.answerData.length > 0) {
          let countAnswer = $linq(this.answerData).where(x => x.score_ans == 0).count();
          if (countAnswer > 0) {
            $msg.alert(`Warning`, `กรุณาเลือกคำตอบจำนวน ${countAnswer} ข้อ ก่อนทำการบันทึกข้อมูล`, `warning`);
            return;
          }
        }
        try {
          var job_no = this.formData["job_no"] || "";
          let qa_remark = this.formData["qa_remark"] || "";
          let qadata = $linq(this.answerData).firstOrDefault();
          this.$set(qadata, "remark", qa_remark);
          let f = {
            detail: this.answerData
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_CreateQC?job_no=${job_no}`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(job_no);
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      calculateScore(field) {
        return this.answerData.reduce((total, i) => {
          return total + i[field];
        }, 0);
      },
      calculatePercentage() {
        let score = $linq(this.answerData).sum(x => x.score_ans) || 0;
        let max_score = $linq(this.answerData).sum(x => x.max_score) || 0;
        return $xt.dec((score / max_score) * 100, 2);
      },
      /* Method : Component */
      empModalSelected(e) {
        this.empType = e || "";
        if (e == "assign_detail" || e == "tester") {
          (async () => {
            let act = `csm/data/CSM_CheckResponsibleEmp?pre_event=${encodeURIComponent(this.formData.pre_event)}`;
            let rsp = await $xt.getServer(act);
            if (rsp > 0) {
              let respon_type = (e == "assign_detail") ? "W" : "C";
              this.$refs.ct_responsible_emp.openModal(respon_type);
            }
            else {
              this.$refs.ct_emp.openModal();
            }
          })();
        }
        else {
          this.$refs.ct_emp.openModal();
        }
      },
      customerModalSelected() {
        this.$refs.ct_cm_customer.openModal();
      },
      async sendComponent(e, type) {
        switch (type) {
          case "project":
            if (this.is_mango()) {
              await this.loadCheckWarranty(e.customer_code);
              //await this.$set(this.formData, "mg_ma", "Y");
              console.log("MA " + this.formData.mg_ma);
              let test = "";
              if (test != "Y") {
                if (this.formData.mg_ma == "N") {
                  $msg.alert(`คำเตือน`,
                    "Customer Code " + e.customer_code + '</br>' +
                    "Customer Name " + e.customer_name + '</br></br>' +

                    "ไม่ได้ต่อ MA กับทาง " + this.auth.mainname + '</br>' +
                    "ดังนั่นลูกค้าจะไม่สามารถแจ้งเรื่องต่างๆ ที่เกี่ยวกับการเพิ่มเติม แก้ไข โปรแกรม รายงาน ฟอร์ม ได้"
                    , `warning`)
                }
                else if (this.formData.mg_ma == "S") {
                  $msg.alert(`คำเตือน`, `ลูกค้ายังไม่มี Passcode โปรดติดต่อ IT Support เพื่อสร้าง Passcode ก่อนใช้งาน`, `warning`);
                  return;
                }
              }
            }
            this.$set(this.formData, "pre_event", e.pre_event);
            this.$set(this.formData, "pre_event2", e.pre_event2);
            this.$set(this.formData, "pre_des", e.pre_des);
            this.$set(this.formData, "customer_code", e.customer_code);
            this.$set(this.formData, "customer_name", e.customer_name);

            this.loadHistory();
            if (!this.is_mango()) {
              this.loadArea();
              this.loadSupplierWarranty();
              this.loadCustomerWarranty();
            }
            this.setContractData();
            break;
          case "department":
            this.$set(this.formData, "dpt_no", e.dpt_code);
            this.$set(this.formData, "dpt_no_name", e.dpt_name);
            this.loadHistory();
            break;
          case "cm_customer":
            this.$set(this.formData, "customer_code", e.customer_code);
            this.$set(this.formData, "customer_name", e.name_th);
            this.setContractData();
            break;
          case "emp":
            switch (this.empType) {
              case "assign_detail":
                this.$set(this.editDetailData, 'assign_empno', e.empno);
                this.$set(this.editDetailData, 'assign_empno_name', e.empfullname);
                break;
              case "tester":
                this.$set(this.editDetailData, 'tester_empno', e.empno)
                this.$set(this.editDetailData, 'tester_empno_name', e.empfullname);
                break;
              case "request":
                this.$set(this.formData, 'request_empno', e.empno);
                this.$set(this.formData, 'request_empno_name', e.empfullname);
                this.$set(this.formData, 'request_empno_email', e.email);
                this.$set(this.formData, 'request_empno_emptel', e.emptel);
                this.$set(this.formData, 'request_empno_empmob', e.empmob);
                break;
              case "assign":
                this.$set(this.formData, 'assign_empno', e.empno);
                this.$set(this.formData, 'assign_empno_name', e.empfullname);
                this.$set(this.formData, 'assign_empno_email', e.email);
                this.$set(this.formData, 'assign_empno_emptel', e.emptel);
                this.$set(this.formData, 'assign_empno_empmob', e.empmob);
                //เปลี่ยน Worker ตาม Rsponsible
                $linq(this.detailData).foreach(x => {
                  this.$set(x, 'isCheckData', "Y");
                  this.$set(x, 'assign_empno', e.empno);
                  this.$set(x, 'assign_empno_name', e.empfullname);
                });
                break;
              case "change_worker":
                let arr = $linq(this.detailData).where(x => x.isCheckData).toArray();
                arr.forEach((x, idx) => {
                  this.$set(x, 'assign_empno', e.empno);
                  this.$set(x, 'assign_empno_name', e.empfullname);
                });
                break;
            }
            break;
          case "form":
            this.$set(this.editDetailData, 'formcode', e.formcode);
            this.$set(this.editDetailData, 'formname', e.formname);
            break;
          case "faq":
            this.$set(this.editDetailData, 'ref_faq', e.docno);
            this.$set(this.editDetailData, 'faqname', e.subject);
            $("#FaqModal").modal('hide');
            break;
          case "description":
            this.$set(this.formData, 'descode', e.descode);
            this.$set(this.formData, 'remark', e.desname);
            this.closeDescModal();
            break;
        }
      },
      clearData(data, field) {
        $linq(field).foreach(x => this.$set(data, x, null));
      },
      /* Method : Default Value */
      currentStatusText() {
        /* Variable : prioity_code, prioity_des, priority_status = 1 (ปกติ) , 2 (สำคัญ) , 3 (สำคัญมาก), active */
        let prio = $linq(this.priorityCodeData).select(x => x.prioity_des).firstOrDefault() || "";
        console.log("currentStatusText ", JSON.stringify(this.priorityCodeData))
        return $linq(this.priorityCodeData).where(w => w.prioity_code == this.formData.job_priority).select(x => x.prioity_des).firstOrDefault() || prio;
      },
      currentStatusClass() {
        /* Variable : prioity_code, prioity_des, priority_status = 1 (ปกติ) , 2 (สำคัญ) , 3 (สำคัญมาก), active */
        var status = $linq(this.priorityCodeData).where(w => w.prioity_code == this.formData.job_priority).select(x => x.priority_status).firstOrDefault() || "";
        return status == "3" ? "text-danger" : status == "2" ? "text-warning" : "text-info";
      },
      datePriority() {
        var to_date = $linq(this.priorityCodeData).where(w => w.prioity_code == this.formData.job_priority).select(x => x.to_date).firstOrDefault() || 0;
        return to_date;
      },
      itemTypeName(code) {
        return $linq(this.serviceCodeData).where(x => x.serv_code == code).select(x => x.serv_name).firstOrDefault() || '';
      },
      reqTypeName(code) {
        return $linq(this.requestCodeData).where(x => x.req_code == code).select(x => x.req_des).firstOrDefault() || '';
      },
      statusName(code) {
        let d = this.formData.job_status == 'I' && code == 'W' ? 'Queued' : $linq(this.statusCodeData).where(x => x.id == code).select(x => x.name).firstOrDefault() || '';
        return d;
      },
      statusClass(prefix, status) {
        return status == 'N' ? prefix + 'danger' : ['Y', 'S'].includes(status) ? prefix + 'success' : ['R', 'H'].includes(status) ? prefix + 'warning' : prefix + 'info';
      },
      areaName(code) {
        return $linq(this.moduleCodeData).where(x => x.loccode == code).select(x => x.locname).firstOrDefault() || '';
      },
      /* Method : Worker Calendar */
      async loadEmployee() {
        let act = `csm/center/Employee_ReadList`;
        let rsp = await $xt.getServer(act);
        this.employeeData = rsp.data.data_rows;
        this.checkEmpno = $linq(rsp.data.data_rows).select(x => x.empno).orderBy(desc).firstOrDefault() || 0;
      },
      async loadCheckDateWorker() {
        let act = `csm/data/CSM_CheckWorker?empno=${encodeURIComponent(this.checkEmpno)}`;
        let rsp = await $xt.getServer(act);
        this.eventEmployee = [];
        $linq(rsp).foreach(x => {
          let docdate = x.due_date == null ? x.response_date : x.due_date;
          let doctext = x.due_date == null ? 'Response Date' : 'Due Date';
          this.eventEmployee.push({
            date: moment(docdate).format("DD/MM/YYYY"),
            dd2t: doctext,
            title: x.job_no,
            desc: x.subject,
            request_name: x.request_name,
            assign_name: x.assign_name
          });
        });
      },
      async loadCheckWarranty(customer_code) {
        let act = `CSM/Data/CustomerWarrantyDate?customer_code=${customer_code || ''}`;
        let res = await $xt.getServer(act);
        this.$set(this.formData, "mg_ma", res.status || 'N');
        this.$set(this.formData, "package_code", res.package_code || '');
      },
      async loadContactData(customer_code) {
        let act = `CSM/master/CSM_CustomerContact?customer_code=${customer_code}&skip=0&take=100&search_text=`;
        let rsp = await $xt.getServer(act);
        this.$set(this, "contactData", rsp.data);
      },
      async setContractData() {
        await this.loadContactData(this.formData.customer_code);
        let contact = $linq(this.contactData).firstOrDefault() || null;
        this.$set(this.formData, "contract_user", contact != null ? contact.person_name : "");
        this.$set(this.formData, "contract_pos", contact != null ? contact.position : "");
        this.$set(this.formData, "phone", contact != null ? contact.phone : "");
        this.$set(this.formData, "email", contact != null ? contact.email : "");
      },
      async setContractUser() {
        let user_tmp = this.formData.contract_user != this.formData.customer_name ? this.formData.contract_user : "";
        this.formData.contract_user = this.formData.contract_by_cust == "Y" ? this.formData.customer_name : user_tmp;
      },
      async loadSubData() {
        let act = `csm/master/CSM_SubService_ReadList?skip=0&take=1000`;
        let rsp = await $xt.getServer(act);
        let data = rsp.data.data
        this.subCodeData = $linq(data).where(x => x.hdtype == "H") || [];
        this.subCodeData2 = $linq(data).where(x => x.hdtype == "D") || [];
      },
      filterReqCodeData() {
        let arr = [];

        $linq(this.requestCodeData).foreach(x => {
          arr.push(
            {
              id: x.req_code,
              text: x.req_des
            }
          )
        });
        //let serv_code = this.editDetailData.item_type;
        //console.log('Filter Activated ' + serv_code);
        let d = arr;
        return d;
      },
      filterSubData() {
        let arr = [];

        $linq(this.subCodeData).foreach(x => {
          arr.push(
            {
              id: x.serv_code,
              text: x.remark
            }
          )
        });
        return arr;
      },
      filterSubData2() {
        let arr = [];

        let d = $linq(this.subCodeData2).where(x => x.serv_code == this.editDetailData.serv_code_d).toArray()
        $linq(d).foreach(x => {
          arr.push(
            {
              id: x.serv_code_d,
              text: x.remark
            }
          )
        });
        return arr;
      },
      openCalenderModal() {
        $(this.$refs.calenderModal).modal("show");
        $(this.$refs.calenderModalmd).modal("show");
        this.loadEmployee();
      },
      eventSelected(event) {
        window.open(this.baseUrl + `page/Transaction/v_csm_trn_001/?job_no=${event}`, "_blank");
      },
      /* Method : Upload File */
      attachFileTab() {
        /* B = Requestor , A = Worker , Y = Checker , T = Update List */
        return $linq(this.attachmentData).where(x => x.item_type == (this.tab3Active == 1 ? "B" : this.tab3Active == 2 ? "A" : this.tab3Active == 3 ? "Y" : this.tab3Active == 4 ? "T" : this.tab3Active == 5 ? "S" : "") && x.ref_itemno == this.editDetailData.itemno).toArray() || [];
      },
      addFile() {
        $(this.$refs.myFile).click();
      },
      async delFile(itemno, item_type) {
        if (!await $msg.confirm(`คุณกำลังจะลบไฟล์แนบ โปรดยืนยัน`)) {
          return;
        }
        this.$set(this, 'attachmentData', $linq(this.attachmentData).where(x => !(x.itemno == itemno && x.ref_itemno == this.editDetailData.itemno && x.item_type == item_type)).toArray());
      },
      async fileUpload(file) {
        let f = new FormData();
        f.append("file", file);
        try {
          let r = await $xt.postServerForm('Data/CSM_FileUploadToTemp', f);
          //let r = await $xt.postServerForm('Data/CSM_FileUploadToTemp', f);//ใช้หลังบ้านของ anywhere
          if (!r.success) {
            throw r.error;
          }

          /* หากสำเร็จจะทำการ Push Data ลงใน attachmentData */
          let itemno = (this.attachmentData.length == 0 ? 0 : ($linq(this.attachmentData).max(x => x.itemno) || 0)) + 1;
          this.attachmentData.push({
            itemno: itemno,
            item_type: this.tab3Active == 1 ? "B" : this.tab3Active == 2 ? "A" : this.tab3Active == 3 ? "Y" : this.tab3Active == 4 ? "T" : this.tab3Active == 5 ? "S" : "",
            filepath: r.id || "",
            filename: r.filename || "",
            ref_itemno: this.editDetailData.itemno,
            add_user: this.auth.userid,
            add_dt: new Date(),
          });

          /* Fix : Bug Upload ไฟล์ต่อไปไม่ได้ ให้ทำการ Clear ไฟล์เดิมออกจากกล่อง Input File (by Kitapon 29/5/2563) */
          $(this.$refs.myFile).val("");
        }
        catch (ex) {
          $msg.alert('', ex.toString(), 'danger');
        }
      },
      createFilePath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
      downLoadFile(x) {
        return dataServer + `API/File/DownLoad?id=${x.filepath}&download=true&filename=${x.filename || ''}`;
      },
      getFileExt(f) {
        return f.split('.').pop().toLowerCase();
      },
      /* Method : Other */
      is_wait(status) {
        return !status || ["W", "H"].includes(status);
      },
      is_claim() {
        let isClaim = $linq(this.serviceCodeData).where(w => w.serv_code == this.editDetailData["item_type"]).select(x => x.claim_st).firstOrDefault();
        return isClaim == "Y" ? true : false;
      },
      is_qc() {
        let isQC = $linq(this.serviceCodeData).where(w => w.serv_code == this.editDetailData["item_type"]).select(x => x.qc_st).firstOrDefault();
        return isQC == "Y" ? true : false;
      },
      is_mango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        console.log("is_mango " + isMango)
        return isMango == "Y" ? true : false;
      },
      isApprove(item_type) {
        let approve = $linq(this.serviceCodeData).where(x => x.serv_code == item_type).select(x => x.approve_st).firstOrDefault();
        return approve == 'Y' ? true : false;
      },
      isAutoComplete() {
        let auto_complete = $linq(this.serviceCodeData).where(x => x.serv_code == this.editDetailData.item_type).select(x => x.auto_task).firstOrDefault();
        return auto_complete == 'Y';
      },
      commentCount(itemno) {
        return $linq(this.commentData).where(x => x.ref_itemno == itemno).count();
      },
      attachCount(itemno) {
        return $linq(this.attachmentData).where(x => x.ref_itemno == itemno).count();
      },
      attachTasksCount(item_type) {
        return $linq(this.attachmentData).where(x => x.ref_itemno == this.editDetailData.itemno && x.item_type == item_type).count();
      },
      approveTab() {
        return $linq(this.prapproveData).where(x => x.refitemno == this.editDetailData.itemno).toArray();
      },
      numericOnly(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46 && charCode !== 45) {
          evt.preventDefault();;
        } else {
          return true;
        }
      },
      /* Method : Mango Condition */
      async updateReadStatus(itemno) {
        try {
          let comment = $linq(this.commentData).where(x => x.ref_itemno == itemno).toArray();
          let f = {
            comment,
            tester_empno: this.editDetailData.tester_empno,
            assign_empno: this.editDetailData.assign_empno,
          };
          let act = `CSM/Data/UpdateReadStatus`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
        } catch (ex) {
          console.log(ex.toString());
        }
      },
      async getManagerTester() {
        let act = `CSM/Center/EmployeeTesterManager?type=${this.editDetailData.module}`;
        let resp = await $xt.getServer(act);
        if (resp.data) {
          this.$set(this.editDetailData, 'tester_empno', resp.data.empno);
          this.$set(this.editDetailData, 'tester_empno_name', resp.data.name);
          this.$set(this.editDetailData, 'tester_empno_tmp', this.editDetailData['tester_empno']);
          this.$set(this.editDetailData, 'tester_empno_name_tmp', this.editDetailData['tester_empno_name']);
        }
      },
      async updateTester() {
        try {
          if (this.editDetailData.tester_approve == 'R' && $xt.isEmpty(this.editDetailData.tester_approve_remark)) {
            $msg.alert(`คำเตือน`, `กรุณาระบุเหตุผลที่ต้องการ Reject ด้วย`, `warning`);
          }
          let f = {
            detail: this.editDetailData,
            attachfile: $linq(this.attachmentData).where(x => x.ref_itemno == this.editDetailData.itemno).toArray()
          };
          page.loadingBox.show();
          let act = `CSM/Data/CSM_ApproveTester`;
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          await this.loadData(rsp.data.job_no);
          this.$set(this, 'editDetailData', $linq(this.detailData).where(x => x.itemno === rsp.data.itemno).firstOrDefault());
          this.$set(this, "commentText", "");
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      emp_is_software_tester() {
        return ['P036', 'P038', 'P064'].includes(this.auth.emppos);
      },
      changeMultiWorker() {
        return this.formData.assign_empno_tmp == this.auth.empno && !['Y'].includes(this.formData.job_status);
      },
      async saveChangeWorker() {
        try {
          let q = $linq(this.detailData).where(x => x.isCheckData).toArray();

          let has_error = false
          let error_message = "<ul>"

          if ($linq(q).count() < 1 && this.formData.assign_empno == this.auth.empno) {
            error_message += "<li>กรุณาติ๊กเลือกอย่างน้อย 1 รายการ และทำการเปลี่ยน Worker ตามที่ท่านต้องการก่อนทำการบันทึกข้อมูลด้วย</li>"
            has_error = true
          }

          error_message += "</ul>"
          if (has_error) {
            $msg.alert(`These fields are required`, error_message, `warning`);

            return
          }

          page.loadingBox.show();
          let act = `CSM/Data/CSM_UpdateWorker`;
          let rsp = await $xt.postServerJson(act, { form: q, assign: this.formData.assign_empno });
          if (!rsp.success) {
            throw rsp.error;
          }
          $notify.success(this.ui.alert_save_success);
          this.loadData(this.formData.job_no)
          this.checkAll = false;
        } catch (ex) {
          page.loadingBox.hide();
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      itemTypeChange() {
        if (this.is_qc()) {
          this.getManagerTester();
        } else {
          this.$set(this.editDetailData, 'tester_empno', this.formData['request_empno']);
          this.$set(this.editDetailData, 'tester_empno_name', this.formData['request_empno_name']);
        }

        if ((this.auth.empcode.substring(0, 3) == "CUS" || this.auth.empcode.substring(0, 2) == "CS" || ['P013', 'P014'].includes(this.auth.emppos)) && !this.emp_is_software_tester()) {
          this.$set(this.editDetailData, 'req_type', '04');
        } else if (this.auth.empcode.substring(0, 3) == "IMP") {
          this.$set(this.editDetailData, 'req_type', '03');
        } else if (this.emp_is_software_tester()) {
          this.$set(this.editDetailData, 'req_type', '07');
        }

        if (!['01', '02', '04', '05'].includes(this.editDetailData.item_type)) {
          this.$set(this.editDetailData, 'contract_type', "N");
        } else {
          this.$set(this.editDetailData, 'contract_type', "");
        }

        if (this.isAutoComplete()) {
          this.$set(this.editDetailData, 'module', 'Other');
          this.$set(this.editDetailData, 'platform', '111');
          this.$set(this.editDetailData, 'subject', this.formData.subject);
          this.$set(this.editDetailData, 'due_date', new Date());
          this.$set(this.editDetailData, 'response_date', new Date());
        } else {

          let todayDate = new Date();
          todayDate = moment(todayDate).add(this.datePriority(), 'days');

          this.$set(this.editDetailData, 'module', this.editDetailData.module ?? '');
          this.$set(this.editDetailData, 'platform', this.editDetailData.platform ?? '');
          this.$set(this.editDetailData, 'subject', this.editDetailData.subject ?? '');
          this.$set(this.editDetailData, 'due_date', todayDate);
          this.$set(this.editDetailData, 'response_date', new Date());
        }

        if (!this.is_mango()) {
          let noti = $linq(this.serviceCodeData).where(x => x.serv_code == this.editDetailData.item_type).firstOrDefault();
          this.$set(this.editDetailData, 'noti_date', noti.noti_date ?? 0);
          this.$set(this.editDetailData, 'noti_active', noti.noti_active ?? "N");
          this.$set(this.editDetailData, 'noti_line', noti.noti_line ?? "N");
          this.$set(this.editDetailData, 'noti_email', noti.noti_email ?? "N");
        }
      },
      moduleChange() {
        if (this.is_qc()) {
          this.getManagerTester();
        }

        if (['RE', 'QCM', 'CSM', 'PPN'].includes(this.editDetailData.module)) this.$set(this.editDetailData, 'platform', 'WEB');
        else this.$set(this.editDetailData, 'platform', 'WIN');
      },
      checkAttachFiles(item_type, tab_name, tab_selected) {
        let has_error = false
        let error_message = ""

        var file = $linq(this.attachmentData).where(x => x.item_type == item_type && x.ref_itemno == this.editDetailData['itemno']).toArray();

        if ($linq(file).count() == 0) {
          error_message += `<li>กรุณาแนบไฟล์และป้อน Description หลังการทดสอบที่แท็บ ${tab_name} ด้วย</li>`;
          has_error = true;
        }

        let item_no = 0;
        $linq(file).foreach(x => {
          ++item_no;
          if (!x.description) {
            error_message += `<li>กรุณาป้อน Description รายการที่ ${item_no} ในแท็บ ${tab_name} ด้วย</li>`;
            has_error = true;
          }
        });

        if (has_error) {
          this.changeTab3(tab_selected);
        }

        return { has_error: has_error, error_message: error_message };
      },
      isAnyType(arr) {
        return $linq(this.detailData).any(x => arr.includes(x.item_type));
      },
      isCountType(arr) {
        return $linq(this.detailData).where(x => arr.includes(x.item_type)).count();
      },
      createBr(text) {
        text = text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@@:%_\+.~#?&//=]*)/ig, (url) => {
          return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
        return (text || '').replace(/(?:\r\n|\r|\n)/g, '<br />')
      },
      appendRows(type) {
        let x = {};
        switch (type) {
          case "risk":
            x.ref_itemno = this.editDetailData.itemno;
            x.itemno = $linq(this.risk).where(y => y.ref_itemno == x.ref_itemno).count();
            ++x.itemno;
            x.adduser = auth.empname;
            x.description = '';
            this.risk.push(x);
            break;
        }
      },
      spliceRows(itemno, keyword) {
        switch (keyword) {
          case "risk":
            this.risk = $linq(this.risk).where(x => !(x.itemno == itemno && x.ref_itemno == this.editDetailData.itemno)).toArray();
            break;
        }
      },
      showRisk() {
        return $linq(this.risk).where(x => x.ref_itemno == this.editDetailData.itemno).orderBy(x => x.itemno).toArray();
      },
      filterService() {
        let d = (this.formData.mg_ma == 'N' && this.is_mango()) ? $linq(this.serviceCodeData).where(x => ["03", "05", "08", "999"].includes(x.serv_code)).toArray() : $linq(this.serviceCodeData).where(x => x.serv_code != "999").toArray();
        //(this.formData.mg_ma == 'Y' && this.is_mango()) ?
        //: this.serviceCodeData
        //console.log("ServiceData " + JSON.stringify(this.serviceCodeData));
        return d;
      },
      queryStringRemoteIP() {
        if ($xt.isEmpty(this.formData.pre_event)) {
          return;
        }
        window.open(this.baseUrl + `page/CustomerDataView?customer_code=${this.formData.customer_code}&pre_event=${this.formData.pre_event}&tabSelected=tab2`, "_blank");
      },
      isDeveloper() {
        let department = this.auth.empcode.substring(0, 2);
        return department == 'IT';
      },
      isUsevendor() {
        return !['MG', 'PAL', 'PANNA'].includes(this.company);
      },
      isDisabled(type,value){
        let value2 = !$xt.isEmpty(value) ? value : true
        switch(type){
          case "h1" : 
            value2 = ((this.formData.request_empno != this.auth.empno || ['I','Y','N'].includes(this.formData['job_status'])) && !this.isAdmin)
          break
          case "h2" :
            value2 =((this.formData.request_empno != this.auth.empno || (($xt.isEmpty(this.formData.dpt_no) || !this.is_mango()) && ['I','Y','N'].includes(this.formData['job_status'])) && !this.isAdmin))
          break
        }
        return value2
      }
    },
    computed: {
      connectionCodeData() { return store.state.connectionCodeData },
      requestCodeData() { return store.state.requestCodeData },
      priorityCodeData() { return store.state.priorityCodeData },
      serviceCodeData() { return store.state.serviceCodeData },
      configData() { return store.state.configData },
    },
    mounted() {
      (async () => {
        page = this.$refs.page;
        page.pageTitle = 'Open Requirement';
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnNew.show = false;
        appForm.btnRetrieve.show = false;
        appForm.btnDelete.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnSave.click = this.isCheckSave;

        //$(document).ready(function () {
        //  $("#sel2").select2();
        //});

        this.$set(this.formData, 'job_date', new Date());
        this.$set(this.formData, 'request_empno', this.auth.empno);
        this.$set(this.formData, 'request_empno_tmp', this.auth.empno);
        this.$set(this.formData, 'assign_empno_tmp', this.auth.empno);
        this.$set(this.formData, 'connection_type', '');
        this.$set(this.formData, 'description_select', '');
        this.$set(this.formData, 'assign_dpt', '');
        this.$set(this, 'isAdmin', page.isAdmin());

        historyPaging = this.$refs.historyPaging;
        historyPaging.setCurrentPage(1);
        historyPaging.setItemsPerPage(5);

        FaqPaging = this.$refs.FaqPaging;
        FaqPaging.setCurrentPage(1);
        FaqPaging.setItemsPerPage(10);

        descPaging = this.$refs.descPaging;
        descPaging.setCurrentPage(1);
        descPaging.setItemsPerPage(10);

        //await store.dispatch('findConnection')
        //await store.dispatch('findRequest')
        //await store.dispatch('findPriority')
        //await store.dispatch('findService')
        //await store.dispatch('findConfig')

        this.loadSubData();
        let ref_customer = localStorage.getItem("X-Customer-CSM");
        if (ref_customer != null || ref_customer != undefined) {
          let p = JSON.parse(ref_customer);
          this.$set(this.formData, 'customer_code', p.customer_code);
          this.$set(this.formData, 'customer_name', p.name_th);
          localStorage.removeItem('X-Customer-CSM');
        }

        let ref_panel_customer = localStorage.getItem("X-Custome-Panel-CSM");
        if (ref_panel_customer != null || ref_panel_customer != undefined) {
          let p = JSON.parse(ref_panel_customer);
          this.$set(this.formData, 'pre_event', p.pre_event);
          this.$set(this.formData, 'pre_event2', p.pre_event2);
          this.$set(this.formData, 'pre_des', p.project);
          this.$set(this.formData, 'customer_code', p.customer_code);
          this.$set(this.formData, 'customer_name', p.name_th);
          this.$set(this.formData, 'contract_user', p.name_th);
          this.$set(this.formData, 'phone', p.tel);
          this.$set(this.formData, 'email', p.mail);
          this.loadHistory();
          if (!this.is_mango()) {
            this.loadArea();
            this.loadSupplierWarranty();
            this.loadCustomerWarranty();
          }
          localStorage.removeItem('X-Custome-Panel-CSM');
        }

        let ref_popup_customer = localStorage.getItem("Customer-Popup-CSM");
        if (ref_popup_customer != null || ref_popup_customer != undefined) {
          let p = JSON.parse(ref_popup_customer);
          this.$set(this.formData, 'pre_event', p.pre_event);
          this.$set(this.formData, 'pre_des', p.pre_des);
          this.$set(this.formData, 'customer_code', p.customer_code);
          this.$set(this.formData, 'customer_name', p.customer_name);
          this.$set(this.formData, 'contract_user', p.customer_name);
          this.$set(this.formData, 'phone', p.phone);
          if (!$xt.isEmpty(p.pre_event)) {
            this.loadHistory();
            if (!this.is_mango()) {
              this.loadArea();
              this.loadSupplierWarranty();
              this.loadCustomerWarranty();
            }
          }
          localStorage.removeItem("Customer-Popup-CSM");
        }

        if (!this.is_mango()) {
          this.loadSubData();
        }

        $xt.sleep(3000);
        do {
          this.$set(this.formData, 'job_priority', $linq(this.priorityCodeData).select(x => x.prioity_code).firstOrDefault());
          //console.log("First Prio ", this.formData.job_priority)
          await $xt.sleep(500)
        } while ($xt.isEmpty(this.formData.job_priority))

        if (!$xt.isEmpty(this.queryString.job_no)) {
          this.loadData(this.queryString.job_no);
        }
        else {
          (async () => {
            let url = `CSM/Center/Employee_GetData?empno=${this.auth.empno}`;
            let resp = await $xt.getServer(url);
            if (resp.data) {
              this.$set(this.formData, 'request_empno_name', resp.data.name)
              this.$set(this.formData, 'request_empno_email', resp.data.email)
              this.$set(this.formData, 'request_empno_emptel', resp.data.emptel)
              this.$set(this.formData, 'request_empno_empmob', resp.data.empmob)
            }
          })();
        }

        this.$nextTick(() => {
          $(this.$refs.myFile).on('change', (e) => {
            this.fileUpload(e.target.files[0]);
          });

        });
      })();
    }
  }
</script>

<style scoped>
  .info-box {
    min-height: 64px;
  }

  .info-box-icon {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
    display: block;
    float: left;
    height: unset !important;
    width: 90px;
    text-align: center;
    font-size: 45px;
    line-height: unset !important;
    background: rgba(0,0,0,0.2);
    background-color: rgba(0, 0, 0, 0.2);
  }

  .ion-clipboard {
    transform: unset;
  }

  .label-purple {
    background-color: purple;
  }

  .text-middle {
    vertical-align: middle;
  }

  .risk-th {
    background-color: #e32121 !important;
    vertical-align: middle;
    height: 50px;
    border-radius: 5px;
  }

  thead tr:nth-child(2) th {
    position: -webkit-sticky;
    position: sticky;
    top: 31.5px !important;
    z-index: 50;
  }

  /* .select2-container-multi .select2-choices {
    width: 150px;
  }*/
</style>
