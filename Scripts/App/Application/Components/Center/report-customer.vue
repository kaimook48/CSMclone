<template>
  <div>
    <customer-page ref="page">
      <template slot="body">
        <div class="box" id="ReportBox">
          <div class="box-header with-border">
            <h4 class="box-title">เงื่อนไขการเรียกข้อมูล</h4>
            <div class="box-tools pull-right">
              <button type="button" class="btn btn-box-tool" data-widget="collapse">
                <i class="fa fa-minus"></i>
              </button>
            </div>
          </div>
          <div class="box-body">
            <div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th><span v-text="ui.re_data_name ||'ชื่อข้อมูล'"></span></th>
                    <th><span v-text="ui.re_conditions ||'เงื่อนไข'"></span></th>
                    <th><span v-text="ui.re_compare_values ||'ค่าเปรียบเทียบ'"></span></th>
                    <th><span v-text="ui.re_multiple ||'multiple'"></span></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x in condData">
                    <td style="width:20%">
                      <select class="form-control input-sm" v-model.trim="x['field_name']" v-on:change="addOption(x)" v-bind:disabled="x.not_remove">
                        <option value="" v-text="ui.re_pls_select ||'- Please Select -'"></option>
                        <option v-for="z in condTemplate" v-bind:value="z.field_name" v-text="z.display_name"></option>
                      </select>
                    </td>
                    <td style="width:20%">
                      <select class="form-control input-sm" v-model.trim="x['operatorx']" v-on:change="" v-bind:disabled="!x['field_name'] || x.option.operatorx_arr.length<2">
                        <option v-for="z in x.option.operatorx_arr || []" v-bind:value="z" v-text="z"></option>
                      </select>
                    </td>
                    <td>
                      <template v-if="(x.option.value_arr || []).length>0">
                        <select class="form-control input-sm" v-model.trim="x['value']" v-bind:disabled="!x['field_name']">
                          <template v-for="z in x.option.value_arr || []">
                            <option v-if="z.value!==undefined" v-bind:value="z.value" v-text="z.name"></option>
                            <option v-else v-bind:value="z" v-text="z"></option>
                          </template>
                        </select>
                      </template>

                      <template v-else-if="x.option.func_name">
                        <div class="input-group">
                          <input type="text" v-bind:value="x.display_value" class="form-control input-sm" readonly />
                          <span class="input-group-btn">
                            <button class="btn btn-sm btn-default" v-on:click="doAction(x)"><i class="fa fa-search"></i></button>
                            <button class="btn btn-sm btn-default" v-on:click="$set(x,'value','');$set(x,'display_value','');"><i class="fa fa-times"></i></button>
                          </span>
                        </div>
                      </template>
                      <template v-else-if="x.option.field_type==='int' || x.option.field_type==='decimal'">
                        <input type="text" v-model:value="x['value']" class="form-control input-sm" v-bind:readonly="!x['field_name']" />
                        <!--<number v-model.number:value="x['value']" v-bind:decimals="x.option.field_type==='int'?'0':'4'" class="form-control input-sm" v-bind:readonly="!x['field_name']"></number>-->
                      </template>
                      <template v-else-if="x.option.field_type==='date'">
                        <datepicker v-model:value="x['value']" input-class="form-control input-sm" v-bind:readonly="!x['field_name']"></datepicker>
                      </template>
                      <template v-else>
                        <input type="text" v-model:value="x['value']" class="form-control input-sm" v-bind:readonly="!x['field_name']" />
                      </template>
                    </td>
                    <td style="width:1%" class="text-center">
                      <select v-show="x.option.multiple" class="form-control input-sm" v-bind:value="x.option.multiple_type" style="min-width:100px" disabled>
                        <option value="and" v-text="ui.re_and ||'And'"></option>
                        <option value="or" v-text="ui.re_or ||'Or'"></option>
                      </select>
                    </td>
                    <td style="width:1%"><button class="btn btn-sm btn-danger" v-on:click="delCond(x)" v-bind:disabled="x.not_remove"><i class="fa fa-trash"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button class="btn btn-sm bg-navy" v-on:click="addCond()"><i class="fas fa-plus"></i> <span v-text="ui.re_add_condition ||'เพิ่มเงื่อนไข'"></span></button>
            <button class="btn btn-sm bg-olive" v-on:click="callData()"><i class="fas fa-download"></i> <span v-text="ui.re_retri_dataa ||'เรียกข้อมูล'"></span></button>
          </div>
        </div>
        <div class="box box-widget" v-show="showPrint">
          <div class="box-body">
            <div class="row">
              <div class="col-lg-12">
                <!--<button class="btn btn-sm btn-default" @click="print"><i class="fa fa-print"></i> พิมพ์</button>-->
                <button class="btn btn-sm btn-default" @click="excel"><i class="fa fa-file-excel-o"></i> ดาวน์โหลดข้อมูลเป็น Excel</button>
              </div>
            </div>
          </div>
        </div>
        <div class="box box-widget">
          <div class="box-body">

            <div class="section-to-print" ref="datatable">
              <h4 class="text-center">{{title}}</h4>
              <div v-show="showCondition">
                <p>
                  <template v-for="x in condData">
                    <span><b>{{x.option.display_name}} {{x['operatorx']}}</b> {{displayCondValue(x)}}</span>
                    <br />
                  </template>
                </p>
                <p>วันที่เรียกข้อมูล = {{reportedDate|date('DD/MM/YYYY HH:mm')}}</p>
              </div>
              <slot name="display"></slot>
            </div>
          </div>
        </div>
      </template>
    </customer-page>
  </div>
</template>
<script>
  let page = {};
  let printWindow = {};
  let vue = {
    data() {
      return {
        ui: window.ui,
        auth: window.auth,
        condData: [],
        dataUrl: '',
        selectedRow: {},
        title: '',
        reportedDate: new Date(),
        condTemplate: [],
        showCondition: true,
        showPrint: true
      };
    },
    methods: {
      setTitle(title) {
        this.$set(this, 'title', title);
        document.title = title;
        page.pageTitle = title;
      },
      setTemplate(tmp) {
        this.$set(this, 'condTemplate', tmp);
      },
      setDefaultCond(cond) {
        let max = this.condData.length === 0 ? 0 : $linq(this.condData).max(x => x.itemno);
        $linq(cond).foreach(x => {
          let option = $linq(this.condTemplate).where(z => z.field_name === x.field_name).firstOrDefault() || {};
          x.itemno = ++max;
          x.option = option;
          x.operatorx = x.operatorx || option.operatorx_default;
          x.value = $xt.isEmpty(x.value) ? option.value_default : x.value;
          //x.not_remove = true;
        });
        this.$set(this, 'condData', cond);
      },
      async  callData() {
        if ($linq(this.condData).any(x => $xt.isEmpty(x.value))) {
          $msg.alert('', 'เงื่อนไขไม่สามารถว่างได้', 'danger');
          return;
        }
        $linq(this.condData).foreach(x => {
          x.field_type = x.option.field_type;
          x.field_group = x.option.field_group;
          x.multiple_type = x.option.multiple_type;
          x.display_value = ((x.option.value_arr || []).length > 0) ? ($linq(x.option.value_arr).where(z => z.value === x.value).select(z => z.name).firstOrDefault() || '') : (x.value || x.display_value);
        });
        let reorder = $linq(this.condData).groupBy(x => x.field_name).select(x => x.values).toArray();
        let reorder_data = [];
        $linq(reorder).foreach(x => {
          reorder_data = $linq(reorder_data).union(x).toArray();
        });
        this.$set(this, 'condData', reorder_data);
        //page.loadingBox.show();
        try {
          let r1 = await $xt.postCustomerJson(this.dataUrl, this.condData);
          if (!r1.success) {
            throw r1.error;
          }
          await this.$parent.setRptData(r1.data, JSON.parse(JSON.stringify(this.condData)));
          $("#ReportBox").boxWidget('collapse');
        } catch (ex) {
          $msg.alert('', ex.toString(), 'danger');
        }
        //page.loadingBox.hide();
      },
      addCond() {
        let max = this.condData.length === 0 ? 0 : $linq(this.condData).max(x => x.itemno);
        max++;
        this.condData.push({ itemno: max, field_name: '', option: {} });
      },
      delCond(item) {
        this.$set(this, 'condData', $linq(this.condData).where(x => !(x.itemno === item.itemno)).toArray());
      },
      addOption(x) {
        let option = $linq(this.condTemplate).where(z => z.field_name === x.field_name).firstOrDefault() || {};
        if (!option.multiple) {
          if (x.field_name && $linq(this.condData).where(z => z.field_name === x.field_name).count() > 1) {
            $alert('', `ไม่สามารถเลือก <b>${option.display_name}</b> มากกว่าหนึ่งครั้งได้`, 'danger')
            this.$set(x, 'field_name', '');
            this.$set(x, 'operatorx', '');
            this.$set(x, 'value', '');
            this.$set(x, 'display_value', '');
            this.$set(x, 'option', {});
            return;
          }
        }
        this.$set(x, 'operatorx', option.operatorx_default);
        this.$set(x, 'value', option.value_default);
        this.$set(x, 'display_value', '');
        this.$set(x, 'option', option);
      },
      doAction(x) {
        this.$set(this, 'selectedRow', x);
        this.$parent[x.option.func_name]();
      },
      setRowData(value, displayValue) {
        this.$set(this.selectedRow, 'value', value);
        this.$set(this.selectedRow, 'display_value', displayValue);
      },
      displayCondValue(x) {
        return x.option.field_type === 'date' ? this.$options.filters.date(x.value, 'DD/MM/YYYY') : (x.display_value || x.value);
      },
      async excel() {
        //page.loadingBox.show();
        try {
          let f = new FormData();
          f.append('html', $(this.$refs.datatable).html())
          let r = await $xt.postCustomerForm('api/file/HtmlToXls/', f);
          window.open(dataServer + 'api/file/download?download=true&id=' + r);
        } catch (ex) {
          $msg.alert("", ex.toString(), "danger");
        }
        //page.loadingBox.hide();
      },
      print() {
        printWindow = window.open(baseUrl + 'page/report/v_qcc_rpt_print/', '_blank');
      }
    },
    mounted() {
      page = this.$refs.page;

      window.addEventListener('message', e => {
        printWindow.postMessage($(this.$refs.datatable).html(), "*");
        console.log("print request")
      }, false);

      $("#ReportBox").boxWidget();
    }
  };

  export default vue;
</script>
