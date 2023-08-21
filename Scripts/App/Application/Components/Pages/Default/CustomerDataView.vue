<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="row">
          <div class="col-md-12">
            <div class="nav-tabs-custom">
              <ul class="nav nav-tabs">
                <li :class="{active: x.id===tabActive}" v-for="x in tabField" v-if="x.show">
                  <a href="#" @click.prevent="onTabChange(x.id)"><span v-text="x.text"></span></a>
                </li>
                <li class="pull-right" style="margin-top:4px;margin-right:10px;">
                  <button class="btn btn-sm bg-navy" @click.prevent="addNew()"
                          v-show="subTabSelected!=0 && tabActive=='tab1'">
                    <i class="fas fa-plus"></i> {{ui.add_new || 'เพิ่ม'}}
                  </button>

                  <button class="btn btn-sm bg-navy" @click="addAppList()" v-if="['tab3','tab4'].includes(tabActive)"><i class="fas fa-plus"></i> เพิ่ม Application</button>
                  <button class="btn btn-sm btn-success"
                          @click.prevent="isVaild()" v-if="(![1,2,3].includes(subTabSelected) || tabActive!='tab1') && isDeveloper()">
                    <i class="fas fa-save"></i> บันทึกข้อมูล
                  </button>
                </li>
              </ul>
              <div class="tab-content">
                <div class="tab-pane" :class="{active: tabActive==='tab1'}">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs pull-right">
                          <li :class="{active:subTabSelected===3}"><a href="#" @click.prevent="onSubTabChange(3)">{{'Form'}}</a></li>
                          <li :class="{active:subTabSelected===2}"><a href="#" @click.prevent="onSubTabChange(2)">{{'Config'}}</a></li>
                          <li :class="{active:subTabSelected===1}"><a href="#" @click.prevent="onSubTabChange(1)">{{'Flow'}}</a></li>
                          <li :class="{active:subTabSelected===0}"><a href="#" @click.prevent="onSubTabChange(0)">{{'Detail'}}</a></li>
                          <!-- Banner-->
                          <li class="pull-left col-md-3" v-show="subTabSelected!=0" style="margin-left:-10px;">
                            <label>ค้นหา</label>
                            <div class="input-group">
                              <input type="text" class="form-control input-sm" v-model="search.text" @keyup.enter="onSearch()" />
                              <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="onSearch()"><i class="fas fa-search"></i></button></span>
                            </div>
                          </li>
                          <li class="pull-left header">
                            <h4 class="text-bold" v-show="subTabSelected===0">Information (รายละเอียด)</h4>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <!-- Subtab : Detail -->
                  <div v-show="subTabSelected===0">
                    <!-- Info -->
                    <div class="box box-info bg-boxfilter">
                      <div class="box-body ">
                        <div class="bg-boxfilterh" style="margin-bottom:10px">
                          <!-- Customer -->
                          <div class="row">
                            <div class="col-md-12">
                              <div class="col-sm-9">
                                <div class="form-group">
                                  <label class="pull-left">ลูกค้า</label>
                                  <div class="col-sm-12 pull-left">
                                    <span><i class="fas fa-building bg-boxfilter " style="font-size:20px"></i></span>
                                    <span><input type="text" class="form-boxxing-control bg-boxfilterh " style="width:120px;text-align:center;" v-model.trim="formData['ref_cus_code']" readonly></span>
                                    <input type="text" class="form-boxxing-control bg-boxfilterh " v-model.trim="formData['cus_name']" readonly style="width: 80%;">
                                  </div>
                                </div>
                              </div>
                              <!-- Maintenance -->
                              <div class="col-sm-1 form-group-lg pull-right">
                                <label class="text-center">Maintenance</label>
                                <div class="form-group text-center">
                                  <div class="input-group pull-left">
                                    <input type='checkbox' style="cursor:not-allowed" class='ios8-switch' id='checkbox-1' v-model="formData['cus_ma']" true-value="Y" false-value="N" disabled>
                                    <label for='checkbox-1'></label>
                                  </div>
                                </div>
                              </div>
                              <!-- Active -->
                              <div class="col-sm-1 form-group-lg pull-right">
                                <label>Passcode</label>
                                <div class="input-group">
                                  <div class="input-group">
                                    <input type='checkbox' style="cursor:pointer" class='ios8-switch' id='checkbox-2' v-model="formData['cus_active']" true-value="Y" false-value="N" @click="checkWarranty()">
                                    <label for='checkbox-2'></label>
                                  </div>
                                </div>
                              </div>
                              <!-- Go Live -->
                              <div class="col-sm-1 form-group-lg pull-right">
                                <label>Go Live</label>
                                <div class="input-group">
                                  <div class="input-group">
                                    <input type='checkbox' style="cursor:pointer" class='ios8-switch' id='checkbox-3' v-model="formData['go_live']" true-value="Y" false-value="N">
                                    <label for='checkbox-3'></label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- Project -->
                          <div class="row">
                            <div class="col-sm-12 ">
                              <div class="col-sm-12 ">
                                <div class="form-group">
                                  <label class="pull-left">โครงการ</label>
                                  <br />
                                  <div class="col-sm-12 pull-left">
                                    <span><i class="fas fa-business-time bg-boxfilter" style="font-size:20px"></i></span>
                                    <span><input type="text" class="form-boxxing-control bg-boxfilterh " style="width:100px;text-align: center;margin-left: 0.2%;" v-model.trim="formData['ref_pre_event']" readonly></span>
                                    <i class="fa fa-search btn" @click.prevent="$refs.Project.openModal()" style="font-size:17px;border-radius:10px; background:#e4e0e057;padding:8px 8px;vertical-align:top;margin-left: 1.5%;"></i>
                                    <span style="margin-left: 1%;"><input type="text" class="form-boxxing-control bg-boxfilterh" text-anchor="middle" style="font:bold;color:black;width: 56%;" readonly v-model.trim="formData['pre_des']"> </span>
                                    <!--Buttonn Search Project-->
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <!--Left Side-->
                          <div class="col-md-6">
                            <!--Warranty-->
                            <div class="row">
                              <!-- Warranty Start Date -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">Warranty Start Date :</label>
                                  <datepicker input-class="form-control input-sm" v-model="formData['warranty_start_dt']" :disabled="true"></datepicker>
                                </div>
                              </div>
                              <!-- Warranty End Date -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">Warranty End Date :</label>
                                  <datepicker input-class="form-control input-sm" v-model="formData['warranty_end_dt']" :disabled="true"></datepicker>
                                </div>
                              </div>
                            </div>
                            <!--MA-->
                            <div class="row">
                              <!-- MA Start Date -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">MA Start Date :</label>
                                  <datepicker input-class="form-control input-sm" v-model="formData['ma_start_dt']" :disabled="true"></datepicker>
                                </div>
                              </div>
                              <!-- MA End Date -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">MA End Date :</label>
                                  <datepicker input-class="form-control input-sm" v-model="formData['ma_end_dt']" :disabled="true"></datepicker>
                                </div>
                              </div>

                              <!-- Form Package -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label>Package :</label>
                                  <select class="form-control" v-model.trim="formData['package_code']" @change="isVaild()" :disabled="formData['isDb'] == 'N'">
                                    <option value="" disabled>-- Please select --</option>
                                    <option :value="x.package_code" v-for="(x,idx) in formPackageData">{{x.package_name}}</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <!-- License -->
                            <div class="row">
                              <!-- Total License -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">Total License :</label>
                                  <div class="input-group">
                                    <input type="text" class="form-control input-sm text-right" v-model.trim="formData['total_license']" disabled>
                                    <span class="input-group-btn">
                                      <button class="btn btn-sm bg-navy" @click="addNew('license')"><i class="fas fa-plus"></i></button>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <!-- Unlimit -->
                              <div class="col-md-6" style="margin-top:25px;">
                                <span class="checkbox checkbox-inline">
                                  <label>
                                    <input type="checkbox" true-value="Y" false-value="N" @change="isVaild()" v-model="formData['unlimit_license']">
                                    <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                    Unlimit License
                                  </label>
                                </span>
                                <span class="checkbox checkbox-inline">
                                  <label>
                                    <input type="checkbox" true-value="Y" false-value="N" @change="isVaild()" v-model="formData['branch']">
                                    <span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>
                                    Branch
                                  </label>
                                </span>
                              </div>
                            </div>
                            <!-- Company -->
                            <div class="row">
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">Multicompany :</label>
                                  <div class="input-group">
                                    <input type="text" class="form-control input-sm text-right" v-model.trim="formData['multi_comp']" disabled>
                                    <span class="input-group-btn">
                                      <button class="btn btn-sm bg-navy" @click="addNew('company')"><i class="fas fa-plus"></i></button>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <!-- DB -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label for="">Database :</label>
                                  <div class="input-group">
                                    <input type="text" class="form-control input-sm text-right" v-model.trim="formData['database_total']" disabled>
                                    <span class="input-group-btn">
                                      <button class="btn btn-sm bg-navy" @click="addNew('company')"><i class="fas fa-plus"></i></button>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <!-- DB Type -->
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label>Database :</label>
                                  <select class="form-control" v-model.trim="formData['db_type']" @change="isVaild()" :disabled="formData['isDb'] == 'N'">
                                    <option value="" disabled>-- Please select --</option>
                                    <option value="Q">SQL</option>
                                    <option value="S">Sybase</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <!-- Module -->
                            <div class="row" style="margin-top:5px;">
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label for="">Module :</label>
                                  <div>
                                    <button class="btn btn-sm" style="margin-right:5px;cursor:unset;" v-for="x in standard_module" readonly>{{x.module_code}}</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!-- Optional -->
                            <div class="row" style="margin-top:5px;">
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label for="">Optional :</label>
                                  <div>
                                    <button class="btn btn-sm" style="margin-right:5px;cursor:unset;" v-for="x in optional_module" readonly>{{x.module_code}}</button>
                                    <button class="btn btn-sm bg-navy" @click="addNew('module')"><i class="fas fa-plus"></i></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--Right Side-->
                          <div class="col-md-6">
                            <div class="row">
                              <button class="btn btn-sm bg-navy pull-right" @click="addNew('remark')"><i class="fas fa-plus"></i> เพิ่มรายละเอียดลูกค้า</button>
                            </div>
                            <div class="row">
                              <table-stick>
                                <table class="table table-hover table-bordered">
                                  <thead>
                                    <tr>
                                      <th class="tf-2 text-center">Manage</th>
                                      <th class="tf-2 text-center">#</th>
                                      <th class="tf-5">Subject</th>
                                      <th class="tf-6">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="x,idx in remarkData" @dblclick="addNew('view_remark',x)" style="cursor:pointer;">
                                      <td align="center">
                                        <a class="text-black" href="#" @click.prevent="setEdit(x,'remark')"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                                        <a class="text-danger" href="#" @click.prevent="onDelRemark(x)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                                      </td>
                                      <td class="text-center">{{x.itemno}}</td>
                                      <td>{{x.subject}}</td>
                                      <td>{{x.remark}}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </table-stick>
                            </div>
                            <div class="row">
                              <div class="col-md-12">
                                <pagination class="pull-left" ref="remark_paging" @page-change="pageChange($event.page,'remark')"></pagination>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--Mobile Header-->
                    <div class="row">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <h4 class="text-bold">Mobile Application (Passcode)</h4>
                      </div>
                    </div>
                    <!-- Mobile -->
                    <div class="box box-success bg-boxfilter">
                      <div class="box-body">
                        <div class="row">
                          <div class="col-sm-2">
                            <div class="form-group">
                              <label for="">รหัสเข้าใช้งาน</label>
                              <div class="input-group">
                                <input type="text" class="form-control" id="cus_code" v-model.trim="formData['cus_code']" :readonly="!isDeveloper()">
                                <span class="input-group-btn">
                                  <button class="btn btn-github" @click="copyText('cus_code')"><i class="fas fa-copy"></i></button>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-4" v-show="isDeveloper()">
                            <div class="form-group">
                              <label for="">รหัสผ่าน</label>
                              <div class="input-group">
                                <input type="text" class="form-control" id="user_pass" v-model.trim="formData['user_pass']" readonly>
                                <span class="input-group-btn">
                                  <button class="btn btn-default" v-on:click="createPassword">สร้างรหัสผ่าน</button>
                                  <button class="btn btn-github" @click="copyText('user_pass')"><i class="fas fa-copy"></i></button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label for="">Line Token</label>
                              <div class="input-group">
                                <input type="text" class="form-control" id="line_token" v-model.trim="formData['line_token']" :readonly="!isDeveloper()">
                                <span class="input-group-btn">
                                  <button class="btn btn-github" @click="copyText('line_token')"><i class="fas fa-copy"></i></button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Subtab : Flow -->
                  <div v-show="subTabSelected===1">
                    <div class="table-responsive">
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th class="tf-2 text-center">Manage</th>
                            <th class="tf-3 text-center">Code</th>
                            <th class="tf-4">Description</th>
                            <th class="tf-2 text-center">Module</th>
                            <th class="tf-4">Attach File</th>
                            <th class="tf-5">Remark</th>
                            <th class="tf-3 text-center">Add User</th>
                            <th class="tf-3 text-center">Add Date</th>
                            <th class="tf-3 text-center">Edit User</th>
                            <th class="tf-3 text-center">Edit Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x,idx in customerFlowData">
                            <td align="center">
                              <a class="text-black" href="#" @click.prevent="setEdit(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                              <a class="text-danger" href="#" @click.prevent="onDelFlow(x.flow_code)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                            </td>
                            <td class="text-center">{{x.flow_code}}</td>
                            <td>{{x.flow_name}}</td>
                            <td class="text-center">{{x.module}}</td>
                            <td>
                              <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename)) && x.filename != null">
                                <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                              </p>
                              <p v-if="['mp4'].includes(getFileExt(x.filename)) && x.filename != null">
                                <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                <br />
                                <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                              </p>
                              <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename)) && x.filepath != null">
                                <i class="fas fa-file-word" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-excel" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-powerpoint" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-pdf" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file" v-else=""></i>
                                <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                              </p>
                            </td>
                            <td>{{x.remark}}</td>
                            <td align="center">{{x.adduser}}</td>
                            <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                            <td align="center">{{x.edituser}}</td>
                            <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <pagination class="pull-left" ref="flow_paging" @page-change="pageChange($event.page,'flow')"></pagination>
                      </div>
                    </div>
                  </div>
                  <!-- Subtab : Config -->
                  <div v-show="subTabSelected===2">
                    <div class="table-responsive">
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th class="tf-2 text-center">Manage</th>
                            <th class="tf-3 text-center">Config Code</th>
                            <th class="tf-4">Config Name</th>
                            <th class="tf-5">Description</th>
                            <th class="tf-3">Attach File</th>
                            <th class="tf-3 text-center">Add User</th>
                            <th class="tf-3 text-center">Add Date</th>
                            <th class="tf-3 text-center">Edit User</th>
                            <th class="tf-3 text-center">Edit Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x,idx in customerConfigData">
                            <td align="center">
                              <a class="text-black" href="#" @click.prevent="setEdit(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                              <a class="text-danger" href="#" @click.prevent="onDelConfig(x.config_code)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                            </td>
                            <td align="center">{{x.config_code}}</td>
                            <td>{{x.config_name}}</td>
                            <td>{{x.remark}}</td>
                            <td>
                              <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename)) && x.filename != null">
                                <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                              </p>
                              <p v-if="['mp4'].includes(getFileExt(x.filename)) && x.filename != null">
                                <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                                <br />
                                <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                              </p>
                              <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename)) && x.filepath != null">
                                <i class="fas fa-file-word" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-excel" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-powerpoint" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file-pdf" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                                <i class="fas fa-file" v-else=""></i>
                                <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                              </p>
                            </td>
                            <td align="center">{{x.adduser}}</td>
                            <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                            <td align="center">{{x.edituser}}</td>
                            <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <pagination class="pull-left" ref="config_paging" @page-change="pageChange($event.page,'config')"></pagination>
                      </div>
                    </div>
                  </div>
                  <!-- Subtab : Form -->
                  <div v-show="subTabSelected===3">
                    <div class="table-responsive">
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th class="tf-2 text-center">Manage</th>
                            <th class="tf-3 text-center">Form Code</th>
                            <th class="tf-4-5">Form Name</th>
                            <th class="tf-3-5">Form 1</th>
                            <th class="tf-3-5">Form 2</th>
                            <th class="tf-3-5">Form 3</th>
                            <th class="tf-3-5">Form 4</th>
                            <th class="tf-3-5">Form 5</th>
                            <th class="tf-3 text-center">Add User</th>
                            <th class="tf-3 text-center">Add Date</th>
                            <th class="tf-3 text-center">Edit User</th>
                            <th class="tf-3 text-center">Edit Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="x,idx in customerFormData">
                            <td align="center">
                              <a class="text-black" href="#" @click.prevent="setEdit(x)"><v-icon name="edit" class="v-icon-width"></v-icon></a>
                              <a class="text-danger" href="#" @click.prevent="onDelForm(x.form_code)"><v-icon name="trash-2" class="v-icon-width"></v-icon></a>
                            </td>
                            <td align="center">{{x.form_code}}</td>
                            <td>{{x.form_name}}</td>
                            <td v-for="y in 5">
                              <a :href="downLoadFile(x,y)" style="margin-top:10px;" v-if="x['filepath'+y]">{{x['form'+y]}}</a>
                              <span v-if="!x['filepath'+y]">{{x['form'+y]}}</span>
                            </td>
                            <td align="center">{{x.adduser}}</td>
                            <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                            <td align="center">{{x.edituser}}</td>
                            <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <pagination class="pull-left" ref="form_paging" @page-change="pageChange($event.page,'form')"></pagination>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Remote App -->
                <div class="tab-pane" :class="{active: tabActive==='tab2'}">
                  <!--Remote IP Header -->
                  <div class="row" style="margin-bottom:10px">
                    <div class="col-md-6 col-sm-12 col-xs-12">
                      <h4 class="text-bold">Remote IP</h4>
                    </div>
                  </div>
                  <!-- Remote -->
                  <div class="box box-sucsse2">
                    <div class="box-body">
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-laptop" style="padding:7px 7px;background-color:#00a65a; border-radius:13px;color:white;margin-left:30px;margin-top:40px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">IP:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_ip']" :readonly="!isDeveloper()">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="glyphicon glyphicon-globe" style="padding:7px 7px;background-color:#00a65a; border-radius:13px;color:white;margin-left:30px;margin-top:40px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Domain:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_domain']" :readonly="!isDeveloper()">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="glyphicon glyphicon-user" style="padding:7px 7px;background-color:#00a65a; border-radius:13px;color:white;margin-left:30px;margin-top:40px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Username:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_username']" :readonly="!isDeveloper()">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-key" style="padding:7px 7px;background-color:#00a65a; border-radius:13px;color:white;margin-left:30px;margin-top:40px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Password :</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_password']" :readonly="!isDeveloper()">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-file-text" style="padding:7px 7px;background-color:#00a65a; border-radius:13px;color:white;margin-left:30px;margin-top:40px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Server Remark:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['remark_server']" :readonly="!isDeveloper()">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                  <!-- Database Header -->
                  <div class="row" style="margin-bottom:10px">
                    <div class="col-md-6 col-sm-12 col-xs-12">
                      <h4 class="text-bold">Database</h4>
                    </div>
                  </div>
                  <!-- Database -->
                  <div class="box box-danger">
                    <div class="box-body">
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-laptop" style="padding:7px 7px;background-color:red; border-radius:13px;color:white;margin-left:30px;margin-top:40px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Backup IP:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['backup_ip']" :readonly="!isDeveloper()">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-wifi" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Backup Port:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['backup_port']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fas fa-cog" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">DB Type:</h5>
                                    <select class="form-control" v-model.trim="formData['db_type']" @change="isVaild()" :disabled="xt.isEmpty(formData['cus_code'])">
                                      <option value="" disabled>-- Please select --</option>
                                      <option value="Q">SQL</option>
                                      <option value="S">Sybase</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style="text-align:center; text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fas fa-dice-d6" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">DB Name:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['db_name']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-file-text" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Daily Backup Name:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['daily_backup_name']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style="text-align:center; text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fas fa-book" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Backup Path:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['backup_path']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fa fa-file-text" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Hour Backup Name:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['hour_backup_name']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style="text-align:center; text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fas fa-book" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Backup Path:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['backup_path2']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fas fa-cog" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Tenant:</h5>
                                    <select class="form-control" v-model.trim="formData['tenant']" :disabled="xt.isEmpty(formData['cus_code'])" @change="isVaild()">
                                      <option value="" disabled>-- Please select --</option>
                                      <option value="N">Rent</option>
                                      <option value="Y">Purchased</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white;">
                              <i class="fas fa-cog" style="padding:7px 7px;background-color:red; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">Cloud Rent:</h5>
                                    <select class="form-control" v-model.trim="formData['cloud_rent']" :disabled="xt.isEmpty(formData['cus_code'])" @change="isVaild()">
                                      <option value="" disabled>-- Please select --</option>
                                      <option value="UIH">UIH</option>
                                      <option value="INET">INET</option>
                                      <option value="HUAWEI">HUAWEI</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                  <!-- VPN Header -->
                  <div class="row" style="margin-bottom:10px">
                    <div class="col-md-6 col-sm-12 col-xs-12">
                      <h4 class="text-bold">VPN</h4>
                    </div>
                  </div>
                  <!-- VPN -->
                  <div class="box box-info">
                    <div class="box-body">
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white; width:50px;height:50px;">
                              <i class="fa fa-laptop" style="padding:7px 7px;background-color:#00c0ef; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold pull-left">VPN IP:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_ip_vpn']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white; width:50px;height:50px;">
                              <i class="fa fa-wifi" style="padding:7px 7px;background-color:#00c0ef; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold"> VPN Port:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_domain_vpn']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white; width:50px;height:50px;">
                              <i class="glyphicon glyphicon-user" style="padding:7px 7px;background-color:#00c0ef; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">VPN Username:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_username_vpn']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style="text-align:center; text-anchor:middle;font-size:17px;background-color:white;width:50px;height:50px;">
                              <i class="fas fa-unlock-alt" style="padding:7px 7px;background-color:#00c0ef; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold">VPN Password:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['server_password_vpn']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-5">
                          <div class="info-box1">
                            <span class="info-box-icon" style=" text-anchor:middle;font-size:17px;background-color:white; width:50px;height:50px;">
                              <i class="fa fa-file-text" style="padding:7px 7px;background-color:#00c0ef; border-radius:10px;color:white;margin-left:30px;margin-top:41px"></i>
                            </span>
                            <div class="info-box-content">
                              <div class="row">
                                <div class="col-md-11">
                                  <div class="form-group">
                                    <h5 class="font-bold"> VPN Remark:</h5>
                                    <input type="text" class="form-control" v-model.trim="formData['remark_vpn']">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
                <!-- Link App -->
                <div class="tab-pane" :class="{active: tabActive==='tab3'}">
                  <div class="row">
                    <div class="col-md-3">
                      <div class="form-group">
                        <span class="input-group">
                          <input type="text" class="form-control" />
                          <span class="input-group-btn">
                            <button class="btn bg-navy"><i class="fa fa-search"></i></button>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div class="col-md-3">

                    </div>
                  </div>
                  <!-- Application -->
                  <div class="row">
                    <div class="col-lg-4 col-md-6 col-sm-6">
                      <div class="box box-purple">
                        <div class="box-body">
                          <div class="row">
                            <div class="col-lg-3 ">
                              <div class="form-group">
                                <label class="text-danger">No.</label>
                                <input type="text" class="form-control" v-model="formData.itemno" placeholder="99999" disabled />
                              </div>
                            </div>
                            <div class="col-lg-6 ">
                              <div class="form-group">
                                <label>Application Type</label>
                                <select class="form-control" disabled>
                                  <option value="">Multi App</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-lg-12 ">
                              <div class="form-group">
                                <label>Production Path</label>
                                <div class="input-group">
                                  <input type="text" class="form-control" v-model="formData.app_path_prod" />
                                  <span class="input-group-btn">
                                    <a class="btn bg-navy" type="button" v-bind:href="formData.app_path_prod" target="_blank" v-show="formData.app_path_prod"><i class="fas fa-external-link-alt"></i></a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 ">
                              <div class="form-group">
                                <label>Demo Path</label>
                                <div class="input-group">
                                  <input type="text" class="form-control" v-model="formData.app_path_demo" />
                                  <span class="input-group-btn">
                                    <a class="btn bg-navy " v-bind:href="formData.app_path_demo" target="_blank" v-show="formData.app_path_demo"><i class="fas fa-external-link-alt"></i></a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-4 col-md-6 col-sm-6" v-for="(x, idx) in showAppList()">
                      <div class="box box-purple">
                        <div class="box-body">
                          <div class="row">
                            <div class="col-lg-3 ">
                              <div class="form-group">
                                <label class="text-danger">No.</label>
                                <input type="text" class="form-control" v-model="x.itemno" disabled />
                              </div>
                            </div>
                            <div class="col-lg-6 ">
                              <div class="form-group">
                                <label>Application Type</label>
                                <select class="form-control" v-model.trim="x.app_type">
                                  <option value="">-- Please select --</option>
                                  <option v-for="x in appTypeData" v-bind:value="x.id">{{x.name}}</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-md-1 pull-right ">
                              <div class="form-group">
                                <button class="btn btn-sm btn-default pull-right" @click="removeAppList(x)">
                                  <i class="fa fa-trash text-danger"></i>
                                </button>
                              </div>
                            </div>
                            <div class="col-lg-12 ">
                              <div class="form-group">
                                <label>Production Path</label>
                                <div class="input-group">
                                  <input type="text" class="form-control" v-model="x.app_path_prod" />
                                  <span class="input-group-btn">
                                    <a class="btn bg-navy" type="button" v-bind:href="x.app_path_prod" target="_blank" v-show="x.app_path_prod"><i class="fas fa-external-link-alt"></i></a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-lg-12 ">
                              <div class="form-group">
                                <label>Demo Path</label>
                                <div class="input-group">
                                  <input type="text" class="form-control" v-model="x.app_path_demo" />
                                  <span class="input-group-btn">
                                    <a class="btn bg-navy " v-bind:href="x.app_path_demo" target="_blank" v-show="x.app_path_demo"><i class="fas fa-external-link-alt"></i></a>
                                  </span>
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
            </div>
          </div>
        </div>

        <!-- Input Attach File -->
        <input type="file" ref="myFile" name="myFile" accept=".doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx, .pdf, .zip, .rar, .mp4, image/*" style="display:none;">
      </template>
    </re-page>

    <!-- Modal : Add License -->
    <div class="modal fade" ref="LicenseModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{editMode ? 'Edit License' : 'Add License'}}

              <button type="button" class="btn btn-sm btn-success pull-right" v-on:click="onSaveLicense()">บันทึกข้อมูล</button>
            </h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-1">
                <div class="form-group">
                  <label for="">License :</label>
                  <div>
                    <number class="form-control input-sm" v-model="form.license" disabled></number>
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="form-group">
                  <label for="">Add License :</label>
                  <div>
                    <number class="form-control input-sm" v-model="form.add_license" v-on:input="CalTotal('license')"></number>
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="form-group">
                  <label for="">Total License :</label>
                  <div>
                    <number class="form-control input-sm" v-model="form.tot_license" disabled></number>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Remark :</label>
                  <div>
                    <input type="text" class="form-control input-sm" v-model.trim="form.remark" maxlength="500">
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label for="">Attachfile :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile()"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-2 text-center">No.</th>
                        <th class="tf-2 text-right">License</th>
                        <th class="tf-2-5 text-right">Add License</th>
                        <th class="tf-2-5 text-right">Total</th>
                        <th class="tf-7">Remark</th>
                        <th class="tf-5">Attach File</th>
                        <th class="tf-3 text-center">Add User</th>
                        <th class="tf-3 text-center">Add Date</th>
                        <th class="tf-3 text-center" v-show="false">Edit User</th>
                        <th class="tf-3 text-center" v-show="false">Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in LicenseData">
                        <td align="center">{{idx+1}}</td>
                        <td class="text-right">{{x.license}}</td>
                        <td class="text-right">{{x.add_license}}</td>
                        <td class="text-right">{{x.tot_license}}</td>
                        <td>{{x.remark}}</td>
                        <td>
                          <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                          </p>
                          <p v-if="['mp4'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                            <br />
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                          <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename)) && x.filepath != null">
                            <i class="fas fa-file-word" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-excel" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-powerpoint" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-pdf" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file" v-else=""></i>
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                        </td>
                        <td align="center">{{x.adduser}}</td>
                        <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                        <td align="center" v-show="false">{{x.edituser}}</td>
                        <td align="center" v-show="false">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">

          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add Company -->
    <div class="modal fade" ref="CompanyModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Multicompany' : 'Add Multicompany'}}</h5>
            <button type="button" class="btn btn-sm btn-success pull-right" v-on:click="onSaveCompany()">บันทึกข้อมูล</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Company :</label>
                  <div>
                    <number class="form-control input-sm" v-model.number="form.comp_qty" disabled></number>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Add Multicompany :</label>
                  <number class="form-control input-sm" v-model.number="form.add_comp" @keyup="CalTotal('company')"></number>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Total Multicompany :</label>
                  <div>
                    <number class="form-control input-sm" v-model.number="form.tot_comp" disabled></number>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Database :</label>
                  <div>
                    <number class="form-control input-sm" v-model="form.db_qty" disabled></number>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Add Database :</label>
                  <div>
                    <number class="form-control input-sm" v-model="form.add_db" v-on:input="CalTotal('company')"></number>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Total Database :</label>
                  <div>
                    <number class="form-control input-sm" v-model="form.tot_db" disabled></number>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile()"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-2 text-center">No.</th>
                        <th class="tf-2-5 text-right">Database</th>
                        <th class="tf-2-5 text-right">Add DB</th>
                        <th class="tf-2-5 text-right">Total DB</th>
                        <th class="tf-2-5 text-right">Company</th>
                        <th class="tf-2-5 text-right">Add Multicompany</th>
                        <th class="tf-2-5 text-right">Total Multicompany</th>
                        <th class="tf-5">Attach File</th>
                        <th class="tf-3 text-center">Add User</th>
                        <th class="tf-3 text-center">Add Date</th>
                        <th class="tf-3 text-center" v-show="false">Edit User</th>
                        <th class="tf-3 text-center" v-show="false">Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in databaseData">
                        <td align="center">{{idx+1}}</td>
                        <td class="text-right">{{x.db_qty}}</td>
                        <td class="text-right">{{x.add_db}}</td>
                        <td class="text-right">{{x.tot_db}}</td>
                        <td class="text-right">{{x.comp_qty}}</td>
                        <td class="text-right">{{x.add_comp}}</td>
                        <td class="text-right">{{x.tot_comp}}</td>
                        <td>
                          <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                          </p>
                          <p v-if="['mp4'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                            <br />
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                          <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename)) && x.filepath != null">
                            <i class="fas fa-file-word" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-excel" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-powerpoint" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-pdf" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file" v-else=""></i>
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                        </td>
                        <td align="center">{{x.adduser}}</td>
                        <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                        <td align="center" v-show="false">{{x.edituser}}</td>
                        <td align="center" v-show="false">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">

          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add Warranty Date -->
    <div class="modal fade" ref="WarrantyModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Warranty Date' : 'Add Warranty Date'}}</h5>
            <button type="button" class="btn btn-sm btn-success pull-right" v-on:click="onSaveHistory('warranty')">บันทึกข้อมูล</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Warranty Start Date :</label>
                  <datepicker input-class="form-control input-sm" v-model="form.start_dt" @change="setEndDate()"></datepicker>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Warranty End Date :</label>
                  <datepicker input-class="form-control input-sm" v-model="form.end_dt" :disabled="true"></datepicker>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-1 text-center">No.</th>
                        <th class="tf-3 text-center">Warranty Start Date</th>
                        <th class="tf-3 text-center">Warranty End Date</th>
                        <th class="tf-2 text-center">คงเหลือ</th>
                        <th class="tf-3">Attach File</th>
                        <th class="tf-2-5 text-center">Add User</th>
                        <th class="tf-3 text-center">Add Date</th>
                        <th class="tf-2-5 text-center">Edit User</th>
                        <th class="tf-3 text-center">Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in warrantyData">
                        <td align="center">{{idx+1}}</td>
                        <td>{{x.start_dt | date()}}</td>
                        <td>{{x.end_dt | date()}}</td>
                        <td>{{x.overdue}}</td>
                        <td>
                          <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                          </p>
                          <p v-if="['mp4'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                            <br />
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                          <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename)) && x.filepath != null">
                            <i class="fas fa-file-word" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-excel" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-powerpoint" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-pdf" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file" v-else=""></i>
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                        </td>
                        <td align="center">{{x.adduser}}</td>
                        <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                        <td align="center">{{x.edituser}}</td>
                        <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">

          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add MA Date -->
    <div class="modal fade" ref="MaModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit MA Date' : 'Add MA Date'}}</h5>
            <button type="button" class="btn btn-sm btn-success pull-right" v-on:click="onSaveHistory('ma')">บันทึกข้อมูล</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Warranty Start Date :</label>
                  <datepicker input-class="form-control input-sm" v-model="form.start_dt" @change="setEndDate()"></datepicker>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="">Warranty End Date :</label>
                  <datepicker input-class="form-control input-sm" v-model="form.end_dt" :disabled="true"></datepicker>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-1 text-center">No.</th>
                        <th class="tf-3 text-center">Warranty Start Date</th>
                        <th class="tf-3 text-center">Warranty End Date</th>
                        <th class="tf-2 text-center">คงเหลือ</th>
                        <th class="tf-3">Attach File</th>
                        <th class="tf-2-5 text-center">Add User</th>
                        <th class="tf-3 text-center">Add Date</th>
                        <th class="tf-2-5 text-center">Edit User</th>
                        <th class="tf-3 text-center">Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in maData">
                        <td align="center">{{idx+1}}</td>
                        <td>{{x.start_dt | date()}}</td>
                        <td>{{x.end_dt | date()}}</td>
                        <td>{{x.overdue}}</td>
                        <td>
                          <p v-if="['png','jpeg','jpg'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><img :src="createFilePath(x.filepath)" class="img-responsive" /></a>
                          </p>
                          <p v-if="['mp4'].includes(getFileExt(x.filename)) && x.filename != null">
                            <a :href="createFilePath(x.filepath)" target="_blank"><i class="fas fa-file-video fa-5x"></i></a>
                            <br />
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                          <p v-if="!['jpg','jpeg','png', 'mp4'].includes(getFileExt(x.filename)) && x.filepath != null">
                            <i class="fas fa-file-word" v-if="['doc','docx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-excel" v-else-if="['xls','xlsx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-powerpoint" v-else-if="['ppt','pptx'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file-pdf" v-else-if="['pdf'].includes(getFileExt(x.filename))"></i>
                            <i class="fas fa-file" v-else=""></i>
                            <a :href="downLoadFile(x)" style="margin-top:10px;"><i class="fas fa-download"></i> {{x.filename}}</a>
                          </p>
                        </td>
                        <td align="center">{{x.adduser}}</td>
                        <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                        <td align="center">{{x.edituser}}</td>
                        <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">

          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add Module -->
    <div class="modal fade" ref="ModuleModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Module' : 'Add Module'}}</h5>
            <button type="button" class="btn btn-sm btn-success pull-right" v-on:click="onSaveModule()">บันทึกข้อมูล</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-3" style="margin-top:25px;">

              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-2 text-center">No.</th>
                        <th class="tf-2 text-center">Module</th>
                        <th class="tf-2 text-center">Type</th>
                        <th class="tf-2 text-center">Active</th>
                        <th class="tf-7">Remark</th>
                        <th class="tf-3 text-center">Add By</th>
                        <th class="tf-3 text-center">Add Date</th>
                        <th class="tf-3 text-center">Edit User</th>
                        <th class="tf-3 text-center">Edit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in allmodule">
                        <td align="center">{{idx+1}}</td>
                        <td>{{x.module_code}}</td>
                        <td>{{x.module_type == 'S' ? 'Standard' : 'Optional'}}</td>
                        <td class="text-center"><input type="checkbox" true-value="Y" false-value="N" v-model="x.active" :disabled="x.module_type=='S'" /></td>
                        <td>
                          <input type="text" class="form-control input-sm" v-model.trim="x.remark" maxlength="500">
                        </td>
                        <td align="center">{{x.adduser}}</td>
                        <td align="center">{{x.add_dt|date('DD/MM/YYYY HH:mm')}}</td>
                        <td align="center">{{x.edituser}}</td>
                        <td align="center">{{x.edit_dt|date('DD/MM/YYYY HH:mm')}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">

          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add Config -->
    <div class="modal fade" ref="ConfigModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Config' : 'Add Config'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Config Code :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form['config_code']" maxlength="30" v-bind:disabled="editMode" readonly>
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="addNew('configcode')" v-bind:disabled="editMode"><i class="fas fa-search"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Config Name :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form['config_name']" maxlength="100" readonly>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Description :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form['remark']" maxlength="2000">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile()"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-success" v-on:click="onSaveConfig()">บันทึกข้อมูล</button>
            <button class="btn btn-sm btn-default" @click="closeModal('config')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add Form -->
    <div class="modal fade" ref="FormModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Form' : 'Add Form'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="">Form Code :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.form_code" maxlength="30" v-bind:disabled="editMode" readonly>
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="$refs.form_modal_1.openModal()" v-bind:disabled="editMode"><i class="fas fa-search"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Form Name :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form.form_name" maxlength="100">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Form 1 :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form.form1" maxlength="100">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile 1 :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename1" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile('1')"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Form 2 :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form.form2" maxlength="100">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile 2 :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename2" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile('2')"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Form 3 :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form.form3" maxlength="100">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile 3 :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename3" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile('3')"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Form 4 :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form.form4" maxlength="100">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile 4 :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename4" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile('4')"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Form 5 :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form.form5" maxlength="100">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Attachfile 5 :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename5" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile('5')"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-success" v-on:click="onSaveForm()">บันทึกข้อมูล</button>
            <button class="btn btn-sm btn-default" @click="closeModal('form')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Add Flow -->
    <div class="modal fade" ref="FlowModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Flow' : 'Add Flow'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="" class="text-danger">Flow Code :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form['flow_code']" maxlength="30" v-bind:disabled="editMode" readonly>
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-default" @click="addNew('workflow')" v-bind:disabled="editMode"><i class="fas fa-search"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="" class="text-danger">Description :</label>
                  <input type="text" class="form-control input-sm" v-model.trim="form['flow_name']" maxlength="100" readonly>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label v-text="ui.module || 'Module'"></label>
                  <select class="form-control input-sm" v-model.trim="form['module']">
                    <option v-for="x in moduleCodeData" :value="x">{{x}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Remark :</label>
                  <textarea class="form-control input-sm" rows="3" v-model.trim="form['remark']" maxlength="1000"></textarea>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Attachfile :</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model.trim="form.filename" disabled>
                    <span class="input-group-btn">
                      <button class="btn btn-sm bg-navy" @click="addFile()"><i class="fas fa-upload"></i></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-success" v-on:click="onSaveFlow()">บันทึกข้อมูล</button>
            <button class="btn btn-sm btn-default" @click="closeModal('flow')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : ConfigCode -->
    <div class="modal fade" ref="ConfigCodeModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{'Config Data'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-3">
                <div class="form-group">
                  <label>{{ui.search||'Search'}}</label>
                  <div class="input-group">
                    <input type="text" class="form-control input-sm" v-model="retrieveSearch['search_text']" @keyup.enter="loadConfigCode()" />
                    <span class="input-group-btn"><button class="btn btn-sm bg-navy" @click="loadConfigCode()"><i class="fa fa-search"></i></button></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-3 text-center">Code</th>
                        <th class="tf-4">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in ConfigCodeData" style="cursor:pointer" @click="sendComponent(x,'configcode')">
                        <td>{{x.code}}</td>
                        <td>{{x.remark}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-md-12">
                    <pagination class="pull-left" ref="configcode_paging" @page-change="pageChange($event.page,'configcode')"></pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-default" @click="closeModal('configcode')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Workflow -->
    <div class="modal fade" ref="WorkFlowModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{'Workflow Data'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th class="tf-3 text-center">Code</th>
                        <th class="tf-4">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x,idx in WorkflowData" style="cursor:pointer" @click="sendComponent(x,'workflow')">
                        <td>{{x.flow_code}}</td>
                        <td>{{x.flow_name}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-md-12">
                    <pagination class="pull-left" ref="workflow_paging" @page-change="pageChange($event.page,'workflow')"></pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-default" @click="closeModal('workflow')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Remark -->
    <div class="modal fade" ref="RemarkModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{editMode ? 'Edit Remark' : 'Add Remark'}}</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label v-text="ui.csm_subject || 'Subject'"></label>
                  <select class="form-control input-sm" v-model.trim="form['subject_code']">
                    <option v-for="x in subjectData" :value="x.subject_code">{{x.subject}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Remark :</label>
                  <textarea class="form-control input-sm" rows="3" v-model.trim="form['remark']" maxlength="1000"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-success" v-on:click="onSaveRemark()">บันทึกข้อมูล</button>
            <button class="btn btn-sm btn-default" @click="closeModal('remark')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : View Remark -->
    <div class="modal fade" ref="ViewRemark" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Subject : {{form['subject']}}</h2>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <label for="">Remark :</label>
                  <textarea class="form-control input-sm" rows="10" v-model.trim="form['remark']" maxlength="1000" disabled></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-sm btn-default" @click="closeModal('view_remark')"><i class="fas fa-times"></i> ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </div>

    <!--Center Modal-->
    <vue-project-list ref="Project" @send-data="setProject($event)"></vue-project-list>
    <vue-form-list ref="form_modal_1" id="form_modal_1" :customer_code="form['customer_code']" @send-data="sendComponent($event, 'form')"></vue-form-list>
  </div>
</template>
<script>
  let page = {};
  let paging = {};
  let config_paging = {};
  let form_paging = {};
  let flow_paging = {};
  let configcode_paging = {};
  let workflow_paging = {};
  let remark_paging = {};

  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        queryString,
        baseUrl,
        xt: $xt,
        tabField: [
          { id: "tab1", text: 'Information', show: true, icon: "" },
          { id: "tab2", text: 'Network and Server', show: this.isDeveloper(), icon: "" },
          { id: "tab3", text: 'Application', show: true, icon: "" },
        ],
        tabActive: "tab1",
        subTabSelected: 0,
        pageNumber: 1,
        data: [],
        form: {},
        formData: {
          package_code: "",
          isDb: "N"
        },
        customerConfigData: [],
        customerFlowData: [],
        customerFormData: [],
        ConfigCodeData: [],
        WorkflowData: [],
        databaseData: [],
        appData: [],
        LicenseData: [],
        warrantyData: [],
        maData: [],
        total: 0,
        retrieveSearch: {},
        appListData: [],
        appTypeData: [],
        tabData: [],
        tabSelected: '',
        customer_code: '',
        pre_event: '',
        tabInfo_isEdit: false,
        editMode: false,
        old_password: '',
        arCustData: {},
        allmodule: {},
        subjectData: [],
        formPackageData: [],
        standard_module: {},
        optional_module: {},
        search: {},
        moduleCodeData,
        formtype: "",
        remarkData: [],
        warrantyStatus: 'N'
      };
    },
    methods: {
      onTabChange(t) {
        this.tabActive = t;
      },
      async onSubTabChange(t) {
        this.subTabSelected = t;
        this.search = {};
        this.onSearch();
      },
      onSearch() {
        switch (this.subTabSelected) {
          //Flow
          case 1:
            this.loadFlowData();
            break;
          //Config
          case 2:
            this.loadConfigData();
            break;
          //Form
          case 3:
            this.loadFormData();
            break;
        };
      },
      pageChange(pn, keyword) {
        switch (keyword) {
          case "page":
            pn = pn || 1;
            paging.setCurrentPage(pn);
            this.loadConfigData();
            break;
          case "config":
            pn = pn || 1;
            config_paging.setCurrentPage(pn);
            this.loadConfigCode();
            break;
          case "form":
            pn = pn || 1;
            form_paging.setCurrentPage(pn);
            this.loadFormData();
            break;
          case "flow":
            pn = pn || 1;
            flow_paging.setCurrentPage(pn);
            this.loadFlowData();
            break;
          case "configcode":
            pn = pn || 1;
            configcode_paging.setCurrentPage(pn);
            this.loadConfigCode();
            break;
          case "workflow":
            pn = pn || 1;
            workflow_paging.setCurrentPage(pn);
            this.loadWorkflowData();
            break;
          case "remark":
            pn = pn || 1;
            remark_paging.setCurrentPage(pn);
            this.loadRemarkData();
            break;
        }
      },
      async addNew(type, data) {
        if ($xt.isEmpty(this.formData['cus_code'])) {
          $msg.alert('คำเตือน', 'ลูกค้ายังไม่มี Passcode <br/> ติดต่อทาง IT Support', 'warning');
          return
        }

        this.editMode = false;
        this.form = {
          customer_code: this.customer_code,
          pre_event: this.pre_event,
        };

        switch (this.subTabSelected) {
          //Flow
          case 1:
            $(this.$refs.FlowModal).modal('show');
            break;
          //Config
          case 2:
            $(this.$refs.ConfigModal).modal('show');
            break;
          //Form
          case 3:
            $(this.$refs.FormModal).modal('show');
            break;
        };
        switch (type) {
          case "license":
            await this.loadLicenseData();
            this.form.license = $linq(this.LicenseData).select(x => x.tot_license).firstOrDefault() ?? 0;
            this.form.add_license = 0;
            await this.CalTotal('license');
            $(this.$refs.LicenseModal).modal('show');
            break;
          case "company":
            this.loadCompanyData();
            $(this.$refs.CompanyModal).modal('show');
            break;
          case "module":
            this.loadModuleData();
            $(this.$refs.ModuleModal).modal('show');
            break;
          case "configcode":
            this.retrieveSearch.search_text = ""
            this.loadConfigCode()
            $(this.$refs.ConfigCodeModal).modal('show');
            break;
          case "workflow":
            $(this.$refs.WorkFlowModal).modal('show');
            break;
          case "warranty":
            this.loadHistoryData();
            $(this.$refs.WarrantyModal).modal('show');
            break;
          case "ma":
            this.loadHistoryData();
            $(this.$refs.MaModal).modal('show');
            break;
          case "remark":
            //this.loadRemarkData();
            this.form['subject_code'] = $linq(this.subjectData).select(x => x.subject_code).firstOrDefault() ?? "";
            $(this.$refs.RemarkModal).modal('show');
            break;
          case "view_remark":
            this.form['subject'] = data.subject;
            this.form['remark'] = data.remark;
            $(this.$refs.ViewRemark).modal('show');
            break;
        }
      },
      setEdit(x, type) {
        this.editMode = true;
        this.$set(this, 'form', JSON.parse(JSON.stringify(x)));
        console.log("setEdit" + type)
        switch (this.subTabSelected) {
          //Flow
          case 1:
            $(this.$refs.FlowModal).modal('show');
            break;
          //Config
          case 2:
            $(this.$refs.ConfigModal).modal('show');
            break;
          //Form
          case 3:
            $(this.$refs.FormModal).modal('show');
            break;
        };
        switch (type) {
          case "remark":
            $(this.$refs.RemarkModal).modal('show');
            break;
        }
      },
      reset(type) {
        this.form = {
          customer_code: this.customer_code,
          pre_event: this.pre_event,
        };
        this.editMode = false;
        switch (type) {
          case "license":
            this.form.license = $linq(this.LicenseData).select(x => x.tot_license).firstOrDefault() ?? 0;
            this.form.add_license = 0;
            this.CalTotal('license');
            break;
        }
      },
      /*Modal*/
      sendComponent(e, type) {
        switch (type) {
          case "form":
            this.$set(this.form, 'form_code', e.formcode);
            this.$set(this.form, 'form_name', e.formname);
            break;
          case "configcode":
            this.$set(this.form, 'config_code', e.code);
            this.$set(this.form, 'config_name', e.remark);
            $(this.$refs.ConfigCodeModal).modal('hide');
            break;
          case "workflow":
            this.$set(this.form, 'flow_code', e.flow_code);
            this.$set(this.form, 'flow_name', e.flow_name);
            $(this.$refs.WorkFlowModal).modal('hide');
            break;
          case "remark":
            //this.$set(this.form, 'flow_code', e.flow_code);
            //this.$set(this.form, 'flow_name', e.flow_name);
            //$(this.$refs.WorkFlowModal).modal('hide');
            break;
        }
      },
      closeModal(type) {
        switch (type) {
          case "license":
            $(this.$refs.LicenseModal).modal("hide");
            break;
          case "config":
            $(this.$refs.ConfigModal).modal("hide");
            break;
          case "flow":
            $(this.$refs.FlowModal).modal("hide");
            break;
          case "form":
            $(this.$refs.FormModal).modal("hide");
            break;
          case "configcode":
            $(this.$refs.ConfigCodeModal).modal("hide");
            break;
          case "workflow":
            $(this.$refs.WorkFlowModal).modal("hide");
            break;
          case "warranty":
            $(this.$refs.WarrantyModal).modal("hide");
            break;
          case "ma":
            $(this.$refs.MaModal).modal("hide");
            break;
          case "remark":
            $(this.$refs.RemarkModal).modal("hide");
            break;
          case "view_remark":
            $(this.$refs.ViewRemark).modal("hide");
            break;
        }
      },
      /*LoadData*/
      async loadRetrieve(customer_code, pre_event) {
        let url = `CSM/Data/CustomerDataViewRead?customer_code=${customer_code || this.customer_code}&pre_event=${pre_event || this.pre_event}`;
        let rsp = await $xt.getServer(url);

        if (rsp.data) {
          this.$set(this, 'formData', rsp.data);
          this.tabInfo_isEdit = this.formData['cus_code'] ? true : false;
          this.$set(this, 'old_password', rsp.data.user_pass);
          this.$set(this.formData, 'db_type', rsp.data.db_type ?? "");
          this.$set(this.formData, 'isDb', "Y");
        }
        if (rsp.ar_cust != null) {
          this.$set(this, 'arCustData', rsp.ar_cust);
          this.$set(this.formData, 'ref_cus_code', rsp.ar_cust.customer_code);
          this.$set(this.formData, 'cus_name', rsp.ar_cust.customer_name);
        }
        this.$set(this, 'appListData', rsp.app_list);
        this.$set(this, 'appTypeData', rsp.app_type);

        page.pageTitle = `Detail : ${this.formData['cus_name']}`;
        document.title = page.pageTitle;
      },
      async loadLicenseData() {
        let act = `csm/Data/License_ReadList?skip=0&take=10&customer_code=${this.customer_code}`;
        let rsp = await $xt.getServer(act);

        this.LicenseData = rsp.data;
      },
      async loadCompanyData() {
        let act = `csm/Data/Company_ReadList?skip=0&take=10&customer_code=${this.customer_code}`;
        let rsp = await $xt.getServer(act);

        this.databaseData = rsp.data;

        this.form.comp_qty = $linq(this.databaseData).sum(x => x.add_comp) ?? 0;
        this.form.add_comp = 0;
        this.form.db_qty = $linq(this.databaseData).sum(x => x.add_db) ?? 0;
        this.form.add_db = 0;
        await this.CalTotal('company');
      },
      async loadConfigData() {
        let act = `csm/data/CustomerConfig_ReadList?customer_code=${this.customer_code}&skip=${config_paging.skipItems()}&take=${config_paging.getItemsPerPage()}&search_text=${this.search.text || ''}`;
        let rsp = await $xt.getServer(act);

        this.customerConfigData = rsp.data;

        config_paging.setTotalItems(rsp.total || 1);
        if (!config_paging.getItemsPerPage()) {
          config_paging.setCurrentPage(1);
        }
        config_paging.createPagesArray();
      },
      async loadFormData() {
        let act = `csm/data/CustomerForm_ReadList?customer_code=${this.customer_code}&skip=${form_paging.skipItems()}&take=${form_paging.getItemsPerPage()}&search_text=${this.search.text || ''}`;
        let rsp = await $xt.getServer(act);

        this.customerFormData = rsp.data;

        form_paging.setTotalItems(rsp.total || 1);
        if (!form_paging.getItemsPerPage()) {
          form_paging.setCurrentPage(1);
        }
        form_paging.createPagesArray();
      },
      async loadFlowData() {
        let act = `csm/data/CustomerFlow_ReadList?customer_code=${this.customer_code}&skip=${flow_paging.skipItems()}&take=${flow_paging.getItemsPerPage()}&search_text=${this.search.text || ''}`;
        let rsp = await $xt.getServer(act);

        this.customerFlowData = rsp.data;

        flow_paging.setTotalItems(rsp.total || 1);
        if (!flow_paging.getItemsPerPage()) {
          flow_paging.setCurrentPage(1);
        }
        flow_paging.createPagesArray();
      },
      async loadConfigCode() {
        let act = `csm/Tools/ERPconfig_ReadList?skip=${configcode_paging.skipItems()}&take=${configcode_paging.getItemsPerPage()}&search_text=${this.retrieveSearch.search_text || ''}`;
        let rsp = await $xt.getServer(act);

        this.ConfigCodeData = rsp.data;

        configcode_paging.setTotalItems(rsp.total || 1);
        if (!configcode_paging.getItemsPerPage()) {
          configcode_paging.setCurrentPage(1);
        }
        configcode_paging.createPagesArray();
      },
      async loadWorkflowData() {
        let act = `csm/master/Flow_ReadList?skip=${workflow_paging.skipItems()}&take=${workflow_paging.getItemsPerPage()}&search_text=${this.search.text || ''}`;
        let rsp = await $xt.getServer(act);

        this.WorkflowData = rsp.data.data_rows;

        workflow_paging.setTotalItems(rsp.data.total || 1);
        if (!workflow_paging.getItemsPerPage()) {
          workflow_paging.setCurrentPage(1);
        }
        workflow_paging.createPagesArray();
      },
      async loadModuleData() {
        let act = `csm/Data/CustomerModule_ReadList?skip=0&take=999&customer_code=${this.customer_code}`;
        let rsp = await $xt.getServer(act);

        this.allmodule = rsp.data;
        this.standard_module = $linq(rsp.data).where(x => x.module_type == "S").toArray();
        this.optional_module = $linq(rsp.data).where(x => x.module_type == "O" && x.active == "Y").toArray();
      },
      async loadHistoryData() {
        let act = `csm/Data/History_ReadList?skip=0&take=10&customer_code=${this.customer_code}`;
        let rsp = await $xt.getServer(act);

        this.warrantyData = $linq(rsp.data).where(x => x.type == "W").toArray();
        this.maData = $linq(rsp.data).where(x => x.type == "M").toArray();
      },
      async loadRemarkData() {
        let act = `csm/Data/CustomerRemark_ReadList?skip=${remark_paging.skipItems()}&take=${remark_paging.getItemsPerPage()}&customer_code=${this.customer_code}`;
        let rsp = await $xt.getServer(act);

        this.remarkData = rsp.data;
        remark_paging.setTotalItems(rsp.total || 1);
        if (!remark_paging.getItemsPerPage()) {
          remark_paging.setCurrentPage(1);
        }
        remark_paging.createPagesArray();
      },
      async loadSubjectData() {
        let act = `csm/Master/CSMSubject_ReadList?active=Y`;
        let rsp = await $xt.getServer(act);

        this.subjectData = rsp.data.data;
      },
      async loadFormPackage() {
        let act = `csm/master/FormPackage_ReadList?search_text=${encodeURIComponent(this.search.text || '')}&type=H`;
        let rsp = await $xt.getServer(act);
        this.formPackageData = rsp.data.data_rows;
      },
      async getCustomerWarranty() {
        let act = `CSM/Data/CustomerWarrantyDate?customer_code=${this.customer_code || ''}&war=Y`;
        let res = await $xt.getServer(act);
        let d = res.data ?? {};
        this.warrantyStatus = (res.status == "Y" && $xt.isEmpty(d.cnno)) ? "Y" : "N";

        //console.log(`Start ${res.start_date} End ${res.end_date} Invno ${res.invno}`);
      },
      //BeforeSave
      async isVaild() {
        let has_error = false;
        let error_message = "<ul>";

        if ($xt.isEmpty(this.formData.cus_code)) {
          error_message += "<li>รหัสเข้าใช้งาน (Application)</li>";
          has_error = true;
          this.tabSelected = 'tab1';
        } else if ($xt.isEmpty(this.formData.user_pass)) {
          error_message += "<li>กรุณากดปุ่ม สร้างรหัสผ่าน</li>";
          has_error = true;
          this.tabSelected = 'tab1';
        }

        if (!$xt.isEmpty(this.formData.user_pass) && this.formData.user_pass != this.old_password) {
          if (!await $msg.confirm(`คุณได้ทำการเปลี่ยนแปลงรหัสผ่านเดิมที่ลูกค้าใช้เข้าสู่ระบบ CRM ซึ่งหากคุณต้องการเปลี่ยนแปลงรหัสผ่านใหม่ กรุณากดยืนยันเพื่อบันทึกข้อมูลและทำการแจ้งรหัสผ่านใหม่ให้ลูกค้ารับทราบด้วย`)) {
            return;
          }
          this.isSave();
          this.tabSelected = 'tab1';
          return;
        }

        error_message += "</ul>";
        if (has_error) {
          $msg.alert('คำเตือน', error_message, 'warning');
          return
        }
        this.isSave();
      },
      checkWarranty() {
        this.formData['cus_active'] = this.warrantyStatus;
        this.formData['cus_ma'] = this.warrantyStatus;
        console.log("warrantyStatus", this.warrantyStatus);

        //if (this.warrantyStatus = "N") {
        //  $msg.alert(`คำเตือน`,
        //    "Customer Code " + e.customer_code + '</br>' +
        //    "Customer Name " + e.customer_name + '</br></br>' +

        //    "ไม่ได้ต่อ MA กับทาง " + this.auth.mainname + '</br>'
        //    , `warning`)
        //}
      },
      /*SaveData*/
      async isSave() {
        try {
          let form = [{
            itemno: 99999,
            cus_active: this.formData['cus_active'],
            cus_ma: this.formData['cus_ma'],
            go_live: this.formData['go_live'],
            cus_code: this.formData['cus_code'],
            cus_name: this.formData['cus_name'],
            user_id: this.formData['user_id'],
            user_pass: this.formData['user_pass'],
            ref_pre_event: this.formData['ref_pre_event'],
            ref_cus_code: this.formData['ref_cus_code'],
            cus_ma_remark1: this.formData['cus_ma_remark1'],
            cus_ma_remark2: this.formData['cus_ma_remark2'],
            cus_ma_remark3: this.formData['cus_ma_remark3'],
            cus_ma_remark4: this.formData['cus_ma_remark4'],
            cus_ma_remark5: this.formData['cus_ma_remark5'],
            server_ip: this.formData['server_ip'],
            server_domain: this.formData['server_domain'],
            server_username: this.formData['server_username'],
            server_password: this.formData['server_password'],
            server_ip_vpn: this.formData['server_ip_vpn'],
            server_domain_vpn: this.formData['server_domain_vpn'],
            server_username_vpn: this.formData['server_username_vpn'],
            server_password_vpn: this.formData['server_password_vpn'],
            remark_vpn: this.formData['remark_vpn'],
            remark_server: this.formData['remark_server'],
            username_meeting: this.formData['username_meeting'],
            password_meeting: this.formData['password_meeting'],

            app_path_demo: this.formData.app_path_demo,
            app_path_prod: this.formData.app_path_prod,

            user_license: this.formData['user_license'],
            add_license: this.formData['add_license'],
            total_license: this.formData['total_license'],
            database_total: this.formData['database_total'],
            multi_comp: this.formData['multi_comp'],
            unlimit_license: this.formData['unlimit_license'],
            ma_st: this.formData['ma_st'],
            mrp_st: this.formData['mrp_st'],
            rental_st: this.formData['rental_st'],
            projplan_st: this.formData['projplan_st'],
            projection_st: this.formData['projection_st'],
            re_st: this.formData['re_st'],
            saleorder_st: this.formData['saleorder_st'],
            qcm_st: this.formData['qcm_st'],
            evaluacation_st: this.formData['evaluacation_st'],
            application_st: this.formData['application_st'],
            db_type: this.formData['db_type'],
            warranty_start_dt: this.formData['warranty_start_dt'],
            warranty_end_dt: this.formData['warranty_end_dt'],
            ma_start_dt: this.formData['ma_start_dt'],
            ma_end_dt: this.formData['ma_end_dt'],
            line_token: this.formData['line_token'],

            db_name: this.formData['db_name'],
            backup_ip: this.formData['backup_ip'],
            backup_port: this.formData['backup_port'],
            backup_path: this.formData['backup_path'],
            backup_path2: this.formData['backup_path2'],
            daily_backup_name: this.formData['daily_backup_name'],
            hour_backup_name: this.formData['hour_backup_name'],
            tenant: this.formData['tenant'],
            package_code: this.formData['package_code'],
            cloud_rent: this.formData['cloud_rent'],
          }];

          $linq(this.appListData).foreach(x => {
            form.push(x);
          });

          let url = '';
          if (this.tabInfo_isEdit) {
            url = 'CSM/Data/CustomerDataViewUpdate';
          } else {
            url = 'CSM/Data/CustomerDataViewCreate'
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(url, { detail: form });
          if (!rsp.success) {
            throw rsp.error;
          }
          this.loadRetrieve(this.queryString.customer_code, this.queryString.pre_event);
          $notify.success(this.ui.alert_save_success);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async onSaveLicense() {
        if (this.form.add_license == 0) {
          await $msg.alert(``, 'ต้องใส่ Add License อย่างน้อย 1 ', 'warning')
          return;
        }
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Data/License_Create`;
          if (this.editMode) {
            act = `CSM/Data/License_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.loadLicenseData();
          await this.loadRetrieve(this.customer_code, this.pre_event);
          $msg.alert(``, `Success`, `success`);
          this.reset('license');
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onSaveCompany() {
        if (this.form.add_comp < 1 && this.form.add_db < 1) {
          await $msg.alert(``, 'ต้องใส่ Add Company หรือ Add DB อย่างน้อย 1 ', 'warning')
          return;
        }
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Data/Company_Create`;
          if (this.editMode) {
            act = `CSM/Data/Company_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          await this.loadCompanyData();
          await this.loadRetrieve();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onSaveForm() {
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Data/CustomerForm_Create`;
          if (this.editMode) {
            act = `CSM/Data/CustomerForm_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.FormModal).modal('hide');
          await this.loadFormData();
          $msg.alert(``, `Success`, `success`);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onSaveConfig() {
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Data/CustomerConfig_Create`;
          if (this.editMode) {
            act = `CSM/Data/CustomerConfig_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.ConfigModal).modal('hide');
          await this.loadConfigData();
          $msg.alert(``, `Success`, `success`);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onSaveModule() {
        try {
          let f = {
            data: this.allmodule
          };
          let act = `CSM/Data/CustomerModule_CreateAndUpdate`;

          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.ConfigModal).modal('hide');
          await this.loadModuleData();
          $msg.alert(``, `Success`, `success`);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onSaveHistory(type) {
        switch (type) {
          case "warranty":
            this.form.type = "W";
            break;
          case "ma":
            this.form.type = "M";
            break;
        }
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Data/History_Create`;
          if (this.editMode) {
            act = `CSM/Data/History_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.WarrantyModal).modal('hide');
          await this.loadHistoryData();
          await this.loadRetrieve(this.customer_code, this.pre_event);
          $msg.alert(``, `Success`, `success`);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onSaveRemark() {
        try {
          let f = {
            data: this.form
          };
          let act = `CSM/Data/CustomerRemark_Create`;
          if (this.editMode) {
            act = `CSM/Data/CustomerRemark_Update`;
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          $(this.$refs.RemarkModal).modal('hide');
          await this.loadRemarkData();
          $msg.alert(``, `Success`, `success`);
          this.reset();
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      /*DeleteData*/
      async onDelForm(x) {
        if (!await $msg.confirm(`ต้องการลบข้อมูล ${x} ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            customer_code: this.customer_code,
            form_code: x
          };
          let act = `CSM/Data/CustomerForm_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.reset();
          await this.loadFormData();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onDelConfig(x) {
        if (!await $msg.confirm(`ต้องการลบข้อมูล ${x} ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            customer_code: this.customer_code,
            config_code: x
          };
          let act = `CSM/Data/CustomerConfig_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.reset();
          await this.loadConfigData();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onDelFlow(x) {
        if (!await $msg.confirm(`ต้องการลบข้อมูล ${x} ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            customer_code: this.customer_code,
            flow_code: x
          };
          let act = `CSM/Data/CustomerFlow_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.reset();
          await this.loadFlowData();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      async onDelRemark(x) {
        if (!await $msg.confirm(`ต้องการลบข้อมูลรายการที่ ${x.itemno} ใช่หรือไม่`)) {
          return;
        }
        try {
          let f = {
            customer_code: this.customer_code,
            itemno: x.itemno
          };
          let act = `CSM/Data/CustomerRemark_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }

          await this.reset();
          await this.loadRemarkData();
          $msg.alert(``, `Success`, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          page.loadingBox.hide();
        }
      },
      showAppList() {
        return $linq(this.appListData).toArray();
      },
      addAppList() {
        let q = $linq(this.appListData).orderBy(x => x.itemno);
        let max = q.count() == 0 ? 0 : q.max(x => x.itemno);
        max = max + 1;
        this.appListData.push({
          itemno: max,
          app_type: "",
          app_path_prod: "",
          app_path_demo: "",
          sitecode: "",
          db_name_show: "",
          db_name: "",
          db_expire_date: "",
        });
      },
      delRow(itemno) {
        this.appListData.splice(itemno);
        //$linq(this.appListData).where(x => x.itemno != itemno).toArray();
        console.log(JSON.stringify(this.appListData));
      },
      async removeAppList(x) {
        if (!await $msg.confirm(`คุณกำลังจะลบ Path App นี้ โปรดยืนยัน`)) {
          return;
        }
        this.appListData.splice(x, 1);
        let max = 1;
        let q = $linq(this.appListData).orderBy(x => x.itemno);
        $linq(q).foreach(x => {
          this.$set(x, 'itemno', max++);
        });
      },
      async createPassword() {
        let url = `CSM/Data/RandomKey?length=16`;
        let rsp = await $xt.getServer(url);
        this.$set(this.formData, 'user_pass', rsp);
      },
      setProject(e) {
        this.$set(this.formData, "ref_pre_event", e.pre_event);
        this.$set(this.formData, "pre_des", e.pre_des);
      },
      copyText(field) {
        var copyText = document.getElementById(field);
        copyText.select();
        document.execCommand("copy");
        var name = field == 'cus_code' ? 'Passcode' : 'user_pass' ? 'Password' : 'line_token' ? 'Line Token' : '';
        $notify.success(`คัดลอก ${name} ไปยังคลิปบอร์ดแล้ว`);
      },
      setEndDate() {
        var todayDate = this.form.start_dt ?? new Date();
        todayDate = moment(todayDate).add(1, 'years');
        todayDate = moment(todayDate).add(-1, 'days');
        this.$set(this.form, "end_dt", todayDate);
      },
      isDeveloper() {
        let department = auth.empcode.substring(0, 2);
        return department == 'IT' ||
          [
            'AD001',
            'AD002',
            'AD003',
            'AD004',
            'IMP003',
            'IMP004',
            'IT001',
            'PS007',
            'X0007',
            'AD011',
            'IMP016',
            'EX0001',
            'MG',
          ].includes(auth.empcode) || auth.emppos == 'P013';
      },
      /*Calculate*/
      CalTotal(type) {
        switch (type) {
          case "license":
            let d = ((this.form.license || 0) + (this.form.add_license || 0)) || 0;
            this.$set(this.form, 'tot_license', d);
            break;
          case "company":
            let tot_comp = $xt.int((this.form.add_comp || 0) + (this.form.comp_qty || 0));
            this.$set(this.form, 'tot_comp', tot_comp);
            let tot_db = $xt.int((this.form.add_db || 0) + (this.form.db_qty || 0));
            this.$set(this.form, 'tot_db', tot_db);
            break;
        }
      },
      /*AttachFile*/
      addFile(type) {
        this.formtype = type != null ? type : "";
        $(this.$refs.myFile).click();
      },
      async fileUpload(file) {
        let f = new FormData();
        f.append("file", file);
        try {
          let r = await $xt.postServerForm('Data/CSM_FileUploadToTemp', f);
          if (!r.success) {
            throw r.error;
          }
          /* หากสำเร็จจะทำการ Push Data ลงใน Form */
          this.$set(this.form, `filepath${this.formtype}`, r.id || "");
          this.$set(this.form, `filename${this.formtype}`, r.filename || "");
        }
        catch (ex) {
          $msg.alert('', ex.toString(), 'danger');
        }
      },
      createFilePath(x) {
        return dataServer + "Api/File/DownLoad?id=" + x
      },
      downLoadFile(x, i) {
        i = i || '';
        let path = x['filepath' + i] || '';
        let name = x['filename' + i] || '';

        return dataServer + `API/File/DownLoad?id=${path}&download=true&filename=${name}`;
      },
      getFileExt(f) {
        if (!$xt.isEmpty(f)) {
          return f.split('.').pop().toLowerCase();
        }
      },
      removeRow(idx) {
        this.$refs.detail.removeRow(idx, () => {
          let itemno = 1;
          $linq(this.detail).foreach(f => { f.itemno = itemno++ });
        });
      },
    },
    mounted() {
      page = this.$refs.page;

      config_paging = this.$refs.config_paging;
      config_paging.setCurrentPage(1);
      config_paging.setItemsPerPage(10);

      configcode_paging = this.$refs.configcode_paging;
      configcode_paging.setCurrentPage(1);
      configcode_paging.setItemsPerPage(10);

      form_paging = this.$refs.form_paging;
      form_paging.setCurrentPage(1);
      form_paging.setItemsPerPage(10);

      flow_paging = this.$refs.flow_paging;
      flow_paging.setCurrentPage(1);
      flow_paging.setItemsPerPage(10);

      workflow_paging = this.$refs.workflow_paging;
      workflow_paging.setCurrentPage(1);
      workflow_paging.setItemsPerPage(10);

      remark_paging = this.$refs.remark_paging;
      remark_paging.setCurrentPage(1);
      remark_paging.setItemsPerPage(10);

      //paging = this.$refs.paging;
      //paging.setCurrentPage(1);
      //paging.setItemsPerPage(10);

      if (!$xt.isEmpty(this.queryString.customer_code) && !$xt.isEmpty(this.queryString.pre_event)) {
        this.customer_code = this.queryString.customer_code;
        this.pre_event = this.queryString.pre_event;
        (async () => {
          await this.getCustomerWarranty();
          await this.loadRetrieve(this.queryString.customer_code, this.queryString.pre_event);
          await this.checkWarranty();
        })();
        this.loadModuleData();
        this.loadRemarkData();
        this.loadSubjectData();
        this.loadFormPackage();
      }


      if (!$xt.isEmpty(this.queryString.tabSelected)) {
        this.onTabChange(this.queryString.tabSelected);
      } else {
        this.onTabChange("tab1");
      }

      this.isDeveloper();
      this.$nextTick(() => {
        $(this.$refs.myFile).on('change', (e) => {
          this.fileUpload(e.target.files[0]);
        });
      });
    }
  };

  export default cpn;
</script>
