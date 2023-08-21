<template>
  <div>
    <re-page ref="page">
      <template slot="body">
        <div class="box box-widget">
          <div class="box-body">
            <!-- Customer List -->
            <div class="row" v-show="show_panel===0">
              <div class="col-md-12">
                <!-- Search Panel , New Customer -->
                <div class="row">
                  <div class="col-md-4 col-sm-6 col-xs-6">
                    <div class="form-group">
                      <label v-text="ui.re_search_text ||'Search Text'"></label>
                      <div class="input-group">
                        <input type="text" class="form-control" placeholder="Keyword : Code / Name / Tel" v-model.trim="search.text" @keypress.enter="loadData(),loadOldCust()" />
                        <span class="input-group-btn">
                          <button class="btn btn-default" @click="loadData(),loadOldCust()"><i class="fa fa-search"></i></button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-8 col-sm-6 col-xs-6">
                    <div class="pull-right" style="margin-top:30px;" v-show="!is_mango()">
                      <button class="btn btn-sm btn-success" @click.prevent="newClick()"><i class="fa fa-plus"></i> <span v-text="ui.re_newcustomers || 'New Customer'"></span></button>
                    </div>
                  </div>
                </div>
                <div class="nav-tabs-custom">
                  <ul class="nav nav-tabs">
                    <li v-bind:class="{active:tabActive===3}"><a href="#" @click.prevent="onTabChange(3),loadData()">ลูกค้าใหม่ ({{customerTotal || 0}})</a></li>
                    <li v-bind:class="{active:tabActive===4}"><a href="#" @click.prevent="onTabChange(4),loadOldCust()">ลูกค้าเก่า ({{oldCustTotal || 0}})</a></li>
                  </ul>
                  <div class="tab-content">
                    <!-- New Customer List-->
                    <div class="tab-pane" v-bind:class="{active:tabActive===3}">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                              <thead>
                                <tr class="tr-table-header">
                                  <th style="width:5px;" v-text="ui.code || 'Code'"></th>
                                  <th style="width:300px;">{{ui.name|| 'Name'}}</th>
                                  <th>{{ui.re_address || 'Address'}}</th>
                                  <th style="width:100px;">{{ui.re_mobile_phone || 'Mobile'}}</th>
                                  <th style="width:100px;">{{'Tel'}}</th>
                                  <th style="width:1px;"></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="x,idx in customerList">
                                  <td>{{x.customer_code}}</td>
                                  <td>
                                    <a href="#" @click.prevent="setEdit(x)">{{x.title_name}} {{x.first_name}} {{x.last_name}}</a>
                                  </td>
                                  <td><input type="text" class="form-control showaddr" placeholder="ไม่มีข้อมูล" v-model="x.address" readonly></td>
                                  <td>{{x.telephone}}</td>
                                  <td>{{x.tel}}</td>
                                  <td align="center">
                                    <a class="btn btn-xs btn-default" href="#" @click.prevent="setEdit(x)"><i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <!--Paging-->
                      <div class="row">
                        <div class="col-lg-12 col-md-12">
                          <pagination class="pull-left" ref="paging" @page-change="pageChange($event.page, 'CustomerList')"></pagination>
                        </div>
                      </div>
                    </div>
                    <!-- Old Customer List-->
                    <div class="tab-pane" v-bind:class="{active:tabActive===4}">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                              <thead>
                                <tr class="tr-table-header">
                                  <th style="width:5px;" v-text="ui.code || 'Code'"></th>
                                  <th style="width:300px;">{{ui.name|| 'Name'}}</th>
                                  <th>{{ui.re_address || 'Address'}}</th>
                                  <th style="width:100px;">{{ui.re_mobile_phone || 'Mobile'}}</th>
                                  <th style="width:1px;"></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="x,idx in OldCustList">
                                  <td>{{x.customer_code}}</td>
                                  <td>
                                    <a href="#" @click.prevent="editCust(x)">{{x.customer_name}}</a>
                                  </td>
                                  <td><input type="text" class="form-control showaddr" placeholder="ไม่มีข้อมูล" v-model="x.address" readonly></td>
                                  <td>{{x.phone}}</td>
                                  <td align="center">
                                    <a class="btn btn-xs btn-default" href="#" @click.prevent="editCust(x)"><i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <!--Paging-->
                      <div class="row">
                        <div class="col-lg-12 col-md-12">
                          <pagination class="pull-left" ref="paging2" @page-change="pageChange($event.page, 'OldCustList')"></pagination>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <!-- Form Main Data -->
            <div class="nav-tabs-custom" v-show="show_panel===1">
              <ul class="nav nav-tabs">
                <li :class="{active:tabActive===0}"><a href="#" @click.prevent="onTabChange(0)" v-show="!oldCust">Information</a></li>
                <li :class="{active:tabActive===5}"><a href="#" @click.prevent="onTabChange(5)" v-show="oldCust">Information</a></li>
                <li :class="{active:tabActive===1}">
                  <a href="#" @click.prevent="onTabChange(1)">
                    {{ui.re_mobile_phone || 'Mobile No.'}}
                  </a>
                </li>
                <li :class="{active:tabActive===2}">
                  <a href="#" @click.prevent="onTabChange(2)">
                    {{ui.re_contect_person || 'Contact Person (Corporation)'}}
                  </a>
                </li>
              </ul>
              <div class="tab-content">
                <!-- Tab1 : New Cust Information -->
                <div class="tab-pane" v-bind:class="{active:tabActive===0}">
                  <fieldset>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <table class="table table-striped table-bordered">
                          <tbody>
                            <!--Identity-->
                            <tr>
                              <th class="text-right" style="width:200px;max-width:200px"><span> {{ui.re_identity || 'Identity' }}</span> :</th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.cust_code || 'Customer Code' }}</span></label>
                                      <input type="text" class="form-control" readonly v-model.trim="form.customer_code">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.re_persontype || 'Person Type'}}</span></label>
                                      <select class="form-control" v-model="form.legal_person" style="width:100%;">
                                        <option value="N">บุคคลธรรมดา</option>
                                        <option value="Y">นิติบุคคล</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_nametitle || 'Title Name' }}</span></label>
                                      <input type="text" class="form-control" list="title_th" v-model="form.title_name" maxlength="250">
                                      <datalist id="title_th">
                                        <option>นาย</option>
                                        <option>นางสาว</option>
                                        <option>นาง</option>
                                        <option>บริษัท</option>
                                      </datalist>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label class="text-danger"><span> {{ui.re_firstname || 'Firstname'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.first_name" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_lastname || 'Lastname' }}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.last_name" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_nickname || 'Nickname'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.nickname" maxlength="50">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_title_other || 'Title (Other Language)'}}</span></label>
                                      <input type="text" class="form-control" list="title_en" v-model="form.title_name_en" maxlength="10">
                                      <datalist id="title_en">
                                        <option>Mr.</option>
                                        <option>Mrs.</option>
                                        <option>Ms.</option>
                                      </datalist>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.re_first_other || 'Firstname (Other Language)'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.first_name_en" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.re_last_other || 'Lastname (Other Language)'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.last_name_en" maxlength="50">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_sex || 'Sex' }}</span></label>
                                      <select class="form-control" v-model="form.sex" style="width:100%;">
                                        <option value="" v-text="ui.re_pls_select || '- Please Select -' "></option>
                                        <option value="M">ชาย</option>
                                        <option value="F">หญิง</option>
                                        <option value="O">อื่นๆ</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label v-text="ui.re_dateofbirth || 'Date Of Birth (DD/MM/YYYY)'"></label>
                                      <datepicker input-class="form-control" overdate="" v-model="form.birthday" @change="form.age = birthCount(form.birthday)"></datepicker>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.re_age_year || 'Age (years)'}}</span></label>
                                      <input type="text" class="form-control" number-format decimals="0" readonly list="" v-model="form.age">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label v-text="ui.re_marriage_status || 'Marriage Status'"></label>
                                      <select class="form-control" v-model="form.status" style="width:100%;">
                                        <option value="" v-text="ui.re_pls_select || '- Please Select -' "></option>
                                        <option value="01">Single - โสด</option>
                                        <option value="02">Married - สมรส</option>
                                        <option value="04">Divorced - หย่าร้าง</option>
                                        <option value="03">Widowed - หม้าย</option>
                                        <option value="06">Marriage is not registered - สมรสไม่จดทะเบียน</option>
                                        <option value="07">Separated - แยกกันอยู่</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_nationality || 'Nationality' }}</span></label>
                                      <input type="text" class="form-control" list="nationality" v-model="form.nationality" maxlength="50" />
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ ui.re_cardid || 'Card ID'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.card_id" maxlength="13">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_passportid || 'Passport ID'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.pass_id" maxlength="30">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_taxid || 'Tax ID' }}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.tax_id" maxlength="15">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label v-text="ui.re_class_passport_date || 'Card/Passport Issue Date'"></label>
                                      <datepicker input-class="form-control input-sm" v-model="form.issue_date" overdate=""></datepicker>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label v-text="ui.re_card_pas_ex|| 'Card/Passport Expire Date'"></label>
                                      <datepicker input-class="form-control input-sm" v-model="form.exp_date" overdate=""></datepicker>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_card_pass_by || 'Card/Passport Issue by'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.issue_by" maxlength="50">
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <!-- Contact Info -->
                            <tr>
                              <th class="text-right" style="width:200px;max-width:200px"><span>{{ui.re_contact_info_v2 || 'Contact Info' }}</span> :</th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>Mobile No.</span></label>
                                      <input type="text" class="form-control" v-model="form.telephone">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ 'Tel.'}}</span></label>
                                      <input type="text" class="form-control" v-model="form.tel">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_fax || 'Fax'}}</span></label>
                                      <input type="text" class="form-control" v-model="form.fax_id">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ 'E-Mail'}}</span></label>
                                      <input type="text" class="form-control" v-model="form.mail">
                                    </div>
                                  </div>
                                </div>

                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label>Line ID</label>
                                      <input type="text" class="form-control" v-model="form.id_line" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label>Facebook</label>
                                      <input type="text" class="form-control" v-model="form.facebook" maxlength="200">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_send_direct_mail || 'Send Direct Mail'}}</span></label>
                                      <select class="form-control" v-model="form.send_dm">
                                        <option value="" disabled v-text="ui.re_pls_select || '- Please Select -' "></option>
                                        <option value="Y">ส่ง</option>
                                        <option value="N">ไม่ส่ง</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_send_sms || 'Send SMS.'}}</span></label>
                                      <select class="form-control" v-model="form.send_sms">
                                        <option value="" disabled v-text="ui.re_pls_select || '- Please Select -' "></option>
                                        <option value="Y">ส่ง</option>
                                        <option value="N">ไม่ส่ง</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <!-- Address -->
                            <tr>
                              <th class="text-right" style="width:200px;max-width:200px">
                                <span>Address</span> :
                              </th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_house_no || 'House No.'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.unit_no" placeholder="บ้านเลขที่" maxlength="10">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_village || 'Village'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.vaillage" placeholder="หมู่บ้าน" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_building || 'Building'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.building" placeholder="อาคาร" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_moo || 'Moo'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.m_no" placeholder="หมู่ที่" maxlength="10">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_lane_juntion || 'Sub-Road / Junction'}}</span> </label>
                                      <input type="text" class="form-control" v-model="addr.junction" placeholder="ซอย/แยก" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_road || 'Road'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.road" placeholder="ถนน" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_subdis || 'Sub-District'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.sub_district" placeholder="ตำบล" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_district || 'District'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.district" placeholder="อำเภอ" maxlength="50">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_province || 'Province' }}</span></label>
                                      <input type="text" class="form-control" v-model="addr.province" placeholder="จังหวัด" maxlength="50">

                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_country || 'Country'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.country" list="country" placeholder="ประเทศ" maxlength="50">
                                    </div>
                                  </div>

                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_zipcode || 'Zipcode' }}</span></label>
                                      <input type="text" class="form-control" v-model="addr.zip_code" placeholder="รหัสไปรษณีย์" maxlength="15">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_phone || 'Phone'}}</span> </label>
                                      <input type="text" class="form-control" v-model="addr.telephone" placeholder="โทรศัพท์" maxlength="40">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_fax || 'Fax' }}</span></label>
                                      <input type="text" class="form-control" v-model="addr.fax" placeholder="Fax" maxlength="40">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_branch_number || 'Branch Number'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.branch_number" placeholder="Branch Number" maxlength="5">
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <!-- Tab1 : Old Cust Information -->
                <div class="tab-pane" v-bind:class="{active:tabActive===5}">
                  <fieldset disabled>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <table class="table table-striped table-bordered">
                          <tbody>
                            <!--Identity-->
                            <tr>
                              <th class="text-right" style="width:200px;max-width:200px"><span> {{ui.re_identity || 'Identity' }}</span> :</th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.cust_code || 'Customer Code' }}</span></label>
                                      <input type="text" class="form-control" readonly v-model.trim="form.customer_code">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <div class="form-group">
                                        <label class="text-danger"><span> {{ui.re_firstname || 'Firstname'}}</span></label>
                                        <input type="text" class="form-control" list="" v-model="form.customer_name" maxlength="50">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <div class="form-group">
                                        <label><span>{{ ui.re_cardid || 'Card ID'}}</span></label>
                                        <input type="text" class="form-control" list="" v-model="form.card_id" maxlength="13">
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span> {{ui.re_first_other || 'Firstname (Other Language)'}}</span></label>
                                      <input type="text" class="form-control" list="" v-model="form.customer_name_en" maxlength="50">
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <div class="form-group">
                                        <label><span>{{ui.re_taxid || 'Tax ID' }}</span></label>
                                        <input type="text" class="form-control" list="" v-model="form.tax_id" maxlength="15">
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <div class="form-group">
                                        <label v-text="ui.re_dateofbirth || 'Date Of Birth (DD/MM/YYYY)'"></label>
                                        <datepicker input-class="form-control" overdate="" v-model="form.birthday" @change="form.age = birthCount(form.birthday)"></datepicker>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <div class="form-group">
                                        <label><span> {{ui.re_age_year || 'Age (years)'}}</span></label>
                                        <input type="text" class="form-control" number-format decimals="0" readonly list="" v-model="form.age">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <!-- Contact Info -->
                            <tr>
                              <th class="text-right" style="width:200px;max-width:200px"><span>{{ui.re_contact_info_v2 || 'Contact Info' }}</span> :</th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ 'Tel.'}}</span></label>
                                      <input type="text" class="form-control" v-model="form.phone">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.re_fax || 'Fax'}}</span></label>
                                      <input type="text" class="form-control" v-model="form.fax">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ 'E-Mail'}}</span></label>
                                      <input type="text" class="form-control" v-model="form.email">
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <!-- Address -->
                            <tr>
                              <th class="text-right" style="width:200px;max-width:200px">
                                <span>Address</span> :
                              </th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.address1 || 'Address1'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.address1" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.address2 || 'Address2'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.address2" maxlength="50">
                                    </div>
                                  </div>
                                  <div class="col-md-3">
                                    <div class="form-group">
                                      <label><span>{{ui.address3 || 'Address3'}}</span></label>
                                      <input type="text" class="form-control" v-model="addr.address3" maxlength="10">
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <!-- Tab2 : Mobile No. -->
                <div class="tab-pane" v-bind:class="{active:tabActive===1}">
                  <fieldset v-bind:disabled="is_mango()">
                    <div class="row">
                      <div class="col-md-12">
                        <table class="table table-striped table-bordered">
                          <tbody>
                            <tr v-for="x,idx in phoneList">
                              <th class="text-right">NO. {{x.itemno}}</th>
                              <td>
                                <div class="row">
                                  <div class="col-md-3">
                                    <input type="text" class="form-control" v-model="x.detail" placeholder="Mobile No." maxlength="10">
                                  </div>
                                  <div class="col-md-2">
                                    <input type="radio" name="mobile" v-model.trim="x.default_contact" value="Y" @change="set_contact_default(x.itemno)">
                                    <span>Set As Default</span>
                                  </div>
                                  <div class="col-md-2">
                                    <button class="btn btn-danger btn-sm" v-if="idx!=0" @click="remove_contact(x)" v-bind:disabled="x.default_contact =='Y'">
                                      <i class="fa fa-times"></i>
                                      <span>Remove</span>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <th class="text-right">&nbsp;</th>
                              <td>
                                <div class="row">
                                  <div class="col-md-12">
                                    <button class="btn btn-info" @click="addPhone()" v-show="auth.is_admin">
                                      <i class="fa fa-plus"></i><span>Append Row</span>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <!-- Tab3 : Contact Person (Corporation) -->
                <div class="tab-pane" v-bind:class="{active:tabActive===2}">
                  <div class="row">
                    <div class="col-lg-12">
                      <span class="pull-right">
                        <button class="btn btn-sm btn-info" @click="addPerson()"><i class="fas fa-plus"></i> {{ui.re_append_row || 'Append Row'}}</button>
                      </span>
                    </div>
                  </div>
                  <fieldset>
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="table-responsive">
                          <table class="table table-hover table-bordered">
                            <thead>
                              <tr>
                                <th class="tf-2 text-center">Edit</th>
                                <th class="tf-2 text-center">#</th>
                                <th class="tf-4 text-center">{{ui.re_contacts || 'Contacts'}}</th>
                                <th class="tf-3-5 text-center">{{ui.re_position || 'Position'}}</th>
                                <th class="tf-3 text-center">{{ui.re_phone || 'Phone'}}</th>

                                <th class="tf-3-5 text-center">{{ui.re_email || 'E-mail'}}</th>
                                <th class="tf-3 text-center">{{ui.re_line || 'Line'}}</th>
                                <th class="tf-3 text-center">{{ui.re_web || 'Website'}}</th>
                                <th class="tf-3 text-center">{{ui.re_remark || 'Remark'}}</th>
                                <th class="tf-3 text-center">{{ui.csm_up_program || 'Up Program'}}</th>
                                <th class="tf-3 text-center">{{ui.csm_training || 'Training'}}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(x,idx) in cmList">
                                <td align="center">
                                  <a href="#" @click.prevent="edit(x)"><i class="fa fa-edit"></i></a>
                                  <a href="#" @click.prevent="remove_person(x)"> <i class="text-danger fa fa-trash"></i></a>
                                </td>
                                <td align="center">{{idx+1}}</td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.person_name" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.position" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.phone" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.email" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.lineid" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.website" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td>
                                  <input type="text" class="form-control" v-model.trim="x.remark" v-bind:readonly="!x.isEdit" />
                                </td>
                                <td align="center" v-bind:class="{'text-success': x.set_update == 'Y', 'text-danger': x.set_update == 'N' || x.set_update == null}" v-if="!x.isEdit">
                                  <span v-text="x.set_update == 'Y' ? 'Yes' : 'No'"></span>
                                </td>
                                <td align="center" v-bind:class="{'text-success': x.set_training == 'Y', 'text-danger': x.set_training == 'N' || x.set_training == null}" v-if="!x.isEdit">
                                  <span v-text="x.set_training == 'Y' ? 'Yes' : 'No'"></span>
                                </td>
                                <td v-if="x.isEdit">
                                  <select class="form-control input-sm" v-model="x.set_update">
                                    <option value="N">No</option>
                                    <option value="Y">Yes</option>
                                  </select>
                                </td>
                                <td v-if="x.isEdit">
                                  <select class="form-control input-sm" v-model="x.set_training">
                                    <option value="N">No</option>
                                    <option value="Y">Yes</option>
                                  </select>
                                </td>
                              </tr>
                              <tr>
                                <td class="text-center" colspan="11" v-if="cmList.length == 0">ไม่มีข้อมูล</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </fieldset>
                </div>
              </div>
            </div>
            <app-form ref="appForm"></app-form>
          </div>
        </div>
      </template>
    </re-page>

  </div>
</template>
<script>
  let process = false;
  let page = {};
  let appForm = {};
  let paging = {};
  let paging2 = {};
  let cpn = {
    data() {
      return {
        auth,
        ui: window.ui,
        tabActive: 0,
        show_panel: 0,
        search: {},
        customerList: [],
        OldCustList: [],
        customerTotal: 0,
        oldCustTotal: 0,
        switchTotal: 0,
        form: {},
        addr: {},
        phoneList: [],
        cmList: [],
        editMode: false,
        oldCust: true,
      };
    },
    methods: {
      async onTabChange(t) {
        this.tabActive = t;
      },
      async onPanelChange(t) {
        this.show_panel = t;
        switch (this.show_panel) {
          case 0:
            appForm.btnSave.show = false;
            appForm.btnDelete.show = false;
            appForm.btnBack.show = false;
            break;
          case 1:
            appForm.btnSave.show = true;
            appForm.btnDelete.show = this.auth.is_admin && !this.oldCust;
            appForm.btnBack.show = true;
            break;
        }
      },
      async pageChange(pn, type) {
        switch (type) {
          case "CustomerList":
            paging.setCurrentPage(pn);
            await this.loadData();
            break;
          case "OldCustList":
            paging2.setCurrentPage(pn);
            await this.loadOldCust();
            break;
        };
      },
      async resetData() {
        this.SetData();

        this.onPanelChange(0);
        this.onTabChange(3);

        this.editMode = false;
        this.oldCust = true;
        await this.loadData();
      },
      async SetData() {
        this.form = {};
        this.addr = {};
        this.phoneList = [];
        this.cmList = [];
        //this.addPhone();
        //this.addPerson();
      },
      async newClick() {
        this.SetData();

        this.onPanelChange(1);
        this.onTabChange(0);
        this.oldCust = false;
        appForm.btnDelete.show = false;
      },
      async loadData() {
        let act = `CSM/Master/Customer_ReadList?search_text=${encodeURIComponent(this.search.text || '')}&skip=${paging.skipItems()}&take=${paging.getItemsPerPage()}`;
        let rsp = await $xt.getServer(act);

        this.customerList = rsp.data.data_rows.data;
        this.customerTotal = rsp.data.data_rows.total;

        paging.setTotalItems(this.customerTotal);
        if (!paging.getItemsPerPage()) {
          paging.setCurrentPage(1);
        }
        paging.createPagesArray();
      },
      async loadOldCust() {
        let act = `CSM/Master/OldCust_ReadList?search_text=${encodeURIComponent(this.search.text || '')}&skip=${paging2.skipItems()}&take=${paging2.getItemsPerPage()}`;
        let rsp = await $xt.getServer(act);

        this.OldCustList = rsp.data.data_rows.data;
        this.oldCustTotal = rsp.data.data_rows.total;

        paging2.setTotalItems(this.oldCustTotal);
        if (!paging2.getItemsPerPage()) {
          paging2.setCurrentPage(1);
        }
        paging2.createPagesArray();
      },
      async readData(x) {
        let act = `CSM/Master/Customer_Read?customer_code=${encodeURIComponent(x || '')}`;
        let rsp = await $xt.getServer(act);

        this.form = rsp.info;
        this.addr = rsp.address == null ? {} : rsp.address;
        if (rsp.mobile.length != 0) { this.phoneList = rsp.mobile };
        if (rsp.contact.length != 0) { this.cmList = rsp.contact };
        this.csr = rsp.ck_csr;

        $linq(this.cmList).foreach(x => {
          x.set_update = x.status1 ?? "N";
          x.set_training = x.status2 ?? "N";
          this.$set(x, "isEdit", false)
        });
        this.oldCust = false;
      },
      async oldCustRead(x) {
        let act = `CSM/Master/OldCust_Read?customer_code=${encodeURIComponent(x || '')}`;
        let rsp = await $xt.getServer(act);

        this.form = rsp.info;
        this.addr = rsp.address == null ? {} : rsp.address;
        if (rsp.mobile.length != 0) { this.phoneList = rsp.mobile };
        if (rsp.contact.length != 0) { this.cmList = rsp.contact };
        this.csr = rsp.ck_csr;

        $linq(this.cmList).foreach(x => {
          x.set_update = x.status1 ?? "N";
          x.set_training = x.status2 ?? "N";
          x.isEdit = false;
        });
        this.oldCust = true;
      },
      async saveClick() {
        if (process) return;
        if ($xt.isEmpty(this.form.first_name) && !this.oldCust) {
          $msg.alert(`คำเตือน`, "กรุณาระบุ " + this.ui.re_firstname, `warning`);
          return;
        }
        $linq(this.cmList).foreach(x => {
          x.status1 = x.set_update ?? "N";
          x.status2 = x.set_training ?? "N";
        });
        try {
          let f = {
            info: this.form,
            address: this.addr,
            mobile: this.phoneList,
            contact: this.cmList
          };
          let act = `CSM/Master/Customer_Create`;
          if (this.editMode) {
            act = `CSM/Master/Customer_Update`;
            if (this.oldCust) {
              act = `CSM/Master/OldCust_Update`;
            }
          }
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          this.resetData();
          $msg.alert(``, this.ui.alert_save_success, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      async deleteClick() {
        if (process) return;
        if (!this.editMode) return;
        if (!await $msg.confirm(this.ui.alert_delete_data)) {
          return;
        }
        try {
          let f = {
            info: this.form,
            address: this.addr,
            mobile: this.phoneList,
            contact: this.cmList
          };
          let act = `CSM/Master/Customer_Delete`;
          page.loadingBox.show();
          let rsp = await $xt.postServerJson(act, f);
          if (!rsp.success) {
            throw rsp.error;
          }
          this.resetData();
          $msg.alert(``, this.ui.alert_delete_success, `success`);
        } catch (ex) {
          $msg.alert(``, ex.toString(), `danger`);
        } finally {
          process = false;
          page.loadingBox.hide();
        }
      },
      setEdit(x) {
        this.onPanelChange(1);
        this.onTabChange(0);
        this.editMode = true;
        this.readData(x.customer_code);
        $('html,body').scrollTop(0);
      },
      editCust(x) {
        this.onPanelChange(1);
        this.onTabChange(5);
        this.editMode = true;
        this.oldCustRead(x.customer_code);
        $('html,body').scrollTop(0);
      },
      birthCount(birth) {
        birth = birth || moment(new Date()).format('YYYY');
        let day = new Date();
        let now = day.getFullYear();
        birth = moment(birth).format('YYYY');
        let age = now - birth;
        if (age < 0) age = 0;
        return age;
      },
      set_contact_default(itemno) {
        $linq(this.phoneList).foreach(x => {
          x.default_contact = (x.itemno == itemno) ? 'Y' : 'N';
        });
        this.form.telephone = $linq(this.phoneList).where(x => x.itemno == itemno).select(x => x.detail).firstOrDefault();
      },
      addPhone() {
        let itemno = this.phoneList.length == 0 ? 1 : ($linq(this.phoneList).select(x => x.itemno).max() ?? 0);
        this.phoneList.push({
          itemno: ++itemno,
          detail: '',
          default_contact: 'N',
        })
      },
      remove_contact(d) {
        if (d.default_contact == "Y") {
          $msg.alert(`คำเตือน`, " ไม่สามารถลบเบอร์โทรหลักได้", `warning`);
          return;
        }
        this.phoneList = $linq(this.phoneList).where(x => x.itemno != d.itemno).toArray();
        let run_item = 1;
        $linq(this.phoneList).foreach(x => {
          x.itemno = run_item;
          run_item++;
        });
      },
      addPerson() {
        let ctp_code = $linq(this.cmList).select(x => x.ctp_code).lastOrDefault() || 0;
        this.cmList.push({
          ctp_code: ++ctp_code,
          person_name: '',
          position: '',
          phone: '',
          email: '',
          website: '',
          lineid: '',
          website: '',
          remark: '',
          set_update: 'N',
          set_training: 'N',
          isEdit: true
        })
      },
      edit(data) {
        let d = $linq(this.cmList).where(x => x.cpt_code == data.cpt_code).firstOrDefault()
        this.$set(d, "isEdit", !d.isEdit)
        console.log("D " + JSON.stringify(d))
      },
      remove_person(data) {
        this.cmList = ($linq(this.cmList).where(x => x.ctp_code != data.ctp_code).toArray());
        let run_item = 1;
        $linq(this.cmList).foreach(x => {
          x.ctp_code = run_item;
          run_item++;
        });
      },
      SetPerson(d, type) {
        switch (type) {
          case "Update":
            $linq(this.cmList).foreach(x => {
              x.set_update = (x.ctp_code == d.ctp_code) ? 'Y' : 'N';
            });
            break;
          case "Training":
            $linq(this.cmList).foreach(x => {
              x.set_training = (x.ctp_code == d.ctp_code) ? 'Y' : 'N';
            });
            break;
        }
      },
      is_mango() {
        let isMango = $linq(this.configData).where(x => x.config_id == "TRN0001").select(x => x.config_value).firstOrDefault();
        return isMango == "Y" ? true : false;
      },
    },
    computed: {
      configData() { return store.state.configData },
    },
    mounted() {
      (async () => {
        page = this.$refs.page;
        page.pageTitle = `Setup : Customers`;
        document.title = page.pageTitle;

        appForm = this.$refs.appForm;
        appForm.btnNew.show = false;
        appForm.btnPrint.show = false;
        appForm.btnBack.show = false;
        appForm.btnRetrieve.show = false;
        appForm.btnSave.click = this.saveClick;
        appForm.btnBack.click = this.resetData;
        appForm.btnDelete.click = this.deleteClick;

        paging = this.$refs.paging;
        paging.setCurrentPage(1);
        paging.setItemsPerPage(10);

        paging2 = this.$refs.paging2;
        paging2.setCurrentPage(1);
        paging2.setItemsPerPage(10);

        this.onTabChange(3);
        this.resetData();

        let ref_customer = localStorage.getItem("X-Master-Customer");
        if (ref_customer != null || ref_customer != undefined) {
          let p = JSON.parse(ref_customer);
          this.newClick();
          this.editMode = true;
          this.$set(this.form, 'customer_code', p.customer_code);
          this.$set(this.form, 'first_name', p.first_name);
          this.$set(this.form, 'last_name', p.last_name);
          this.$set(this.form, 'nickname', p.nickname);
          this.$set(this.form, 'tel', p.tel);
          this.$set(this.form, 'mail', p.mail);
          localStorage.removeItem('X-Master-Customer');
        }

        this.loadOldCust();
      })();
    }
  };

  export default cpn;
</script>
<style scoped>
  .showaddr {
    background-color: white;
    border-color: white;
  }
</style>
