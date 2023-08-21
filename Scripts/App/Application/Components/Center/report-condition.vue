<template>
  <div>
    <re-page ref="page">
      <template #body>
        <div class="row">
          <div class="col-md-12">
            <div class="pull-right margin-btn-header">
              <button class="btn btn-sm btn-primary" @click="$refs.conditionModal.openModal()"><i class="fas fa-edit"></i> เงื่อนไขรายงาน</button>
              <button class="btn btn-sm bg-olive" @click="excel"><i class="fas fa-file-excel"></i> ดาวน์โหลดข้อมูลเป็น Excel</button>
            </div>
          </div>
        </div>
        <div class="content-report" ref="report_content">
          <div class="box box-widget">
            <div class="box-body">
              <div class="section-to-print" ref="datatable">
                <h4 class="text-center font-extra" v-if="showTitle">{{title}}</h4>
                <template v-if="showCond">
                  <div class="row">
                    <div class="col-md-12">
                      <p class="align-left"><span class="text-left">Reported Date = {{reportedDate | date('DD/MM/YYYY')}} Time = {{reportedDate | date('HH:mm:ss')}}</span></p>
                      <p class="align-center">
                        <span class="text-center">{{condText}}</span>
                      </p>
                    </div>
                  </div>
                </template>
                <slot name="display"></slot>
              </div>
            </div>
          </div>
        </div>
      </template>
    </re-page>

    <!-- Modal : Criteria -->
    <modal ref="conditionModal">
      <template slot="header">
        <h4 class="font-extra">เงื่อนไขรายงาน / Condition Report</h4>
      </template>
      <template slot="body">
        <slot name="extra-cond"></slot>
        <h6><span class="text-warning">หมายเหตุ : </span> หากต้องการข้อมูลทั้งหมดโดยไม่มีเงื่อนไขการเรียกข้อมูล ให้กดปุ่มลบ <i class="fas fa-trash"></i> เพื่อเรียกข้อมูลทั้งหมด</h6>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th class="tf-3-5"><span v-text="ui.re_data_name ||'ชื่อข้อมูล'"></span></th>
                  <th class="tf-3"><span v-text="ui.re_conditions ||'เงื่อนไข'"></span></th>
                  <th class="tf-6"><span v-text="ui.re_compare_values ||'ค่าเปรียบเทียบ'"></span></th>
                  <th class="tf-2-5"><span v-text="ui.re_multiple ||'multiple'"></span></th>
                  <th class="tf-1-5"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="condData.length == 0">
                  <td colspan="5" align="center"><i class="fas fa-info-circle"></i> ไม่มีเงื่อนไข หากต้องการเพิ่มเงื่อนไขการเรียกข้อมูลให้กดปุ่ม <span class="text-bold"><i class="fas fa-plus"></i> เพิ่มเงื่อนไข</span> ด้านซ้ายมือของท่าน หากไม่ต้องการสามารถกดปุ่ม <span class="text-bold">เรียกข้อมูล</span> ได้ทันที</td>
                </tr>
                <tr v-for="x in condData">
                  <td>
                    <select class="form-control input-sm" v-model.trim="x['field_name']" v-on:change="addOption(x)" v-bind:disabled="x.not_remove || false">
                      <option value="" v-text="ui.re_pls_select ||'- Please Select -'"></option>
                      <option v-for="z in condTemplate" v-bind:value="z.field_name" v-text="z.display_name"></option>
                    </select>
                  </td>
                  <td>
                    <select class="form-control input-sm" v-model.trim="x['operatorx']" v-on:change="" v-bind:disabled="!x['field_name'] || x.option.operatorx_arr.length<2">
                      <option v-for="z in x.option.operatorx_arr || []" v-bind:value="z" v-text="z"></option>
                    </select>
                  </td>
                  <td>
                    <!-- Data Type : Array Select -->
                    <template v-if="(x.option.value_arr || []).length>0">
                      <select class="form-control input-sm text-dark-blue" v-model.trim="x['value']" v-bind:disabled="!x['field_name']">
                        <option v-for="z in x.option.value_arr || []"
                                v-bind:value="z.value !== undefined ? z.value : z"
                                v-text="z.value !== undefined ? z.name : z">
                        </option>
                      </select>
                    </template>
                    <!-- Data Type : Text Search -->
                    <template v-else-if="x.option.func_name">
                      <div class="input-group input-group-sm">
                        <input type="text"
                               v-model.trim="x.display_value"
                               class="form-control input-sm text-dark-blue"
                               v-bind:disabled="(x.operatorx == 'is null' || x.operatorx == 'is not null')"
                               @keyup="doKeyup(x)" />
                        <span class="input-group-btn">
                          <button class="btn btn-sm bg-navy" v-bind:disabled="(x.operatorx == 'is null' || x.operatorx == 'is not null')" v-on:click="doAction(x)"><i class="fa fa-search"></i></button>
                          <button class="btn btn-sm btn-danger" v-on:click="$set(x,'value','');$set(x,'display_value','');"><i class="fa fa-times"></i></button>
                        </span>
                      </div>
                    </template>
                    <!-- Data Type : Int -->
                    <template v-else-if="x.option.field_type==='int' || x.option.field_type==='decimal'">
                      <number v-model.number="x['value']" v-bind:decimals="x.option.field_type==='int'?'0':'4'" class="form-control input-sm text-dark-blue" :disabled="(x.operatorx == 'is null' || x.operatorx == 'is not null')" v-bind:readonly="!x['field_name']"></number>
                    </template>
                    <!-- Data Type : Number -->
                    <template v-else-if="x.option.field_type === 'number'">
                      <i-input input-class="form-control input-sm text-dark-blue" v-model.number="x['value']" :number-only="true" :disabled="(x.operatorx == 'is null' || x.operatorx == 'is not null')" v-bind:readonly="!x['field_name']" @keyup="$set(x,'display_value',x['value'])"></i-input>
                    </template>
                    <!-- Data Type : Date -->
                    <template v-else-if="x.option.field_type==='date'">
                      <datepicker input-class="form-control input-sm text-dark-blue" v-model="x.value" :disabled="(x.operatorx == 'is null' || x.operatorx == 'is not null')" v-bind:readonly="!x['field_name']"></datepicker>
                    </template>
                    <!-- Data Type : Text -->
                    <template v-else>
                      <input type="text" v-model:value="x['value']" class="form-control input-sm text-dark-blue" v-bind:readonly="!x['field_name']" />
                    </template>
                  </td>
                  <td align="center">
                    <select v-show="x.option.multiple" class="form-control input-sm" v-model="x.option.multiple_type">
                      <option value="and" v-text="ui.re_and ||'And'"></option>
                      <option value="or" v-text="ui.re_or ||'Or'"></option>
                    </select>
                  </td>
                  <td align="center"><button class="btn btn-sm btn-danger" v-on:click="delCond(x)" v-bind:disabled="x.not_remove || false"><i class="fa fa-trash"></i></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button class="btn btn-sm btn-tumblr pull-left" v-on:click="addCond()"><i class="fas fa-plus"></i> <span v-text="ui.re_add_condition ||'เพิ่มเงื่อนไข'"></span></button>
        <button class="btn btn-sm btn-primary" v-on:click="callData()"><i class="fas fa-download"></i> <span v-text="ui.re_retri_dataa ||'เรียกข้อมูล'"></span></button>
      </template>
    </modal>

  </div>
</template>

<script>
  let page = {}
  let vue = {
    props: {
      extraCond: {
        type: Object
      },
      extraCond2: {
        type: Object
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      showCond: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        baseUrl,
        ui: window.ui,
        auth: window.auth,
        condData: [],
        dataUrl: '',
        selectedRow: {},
        title: '',
        reportedDate: new Date(),
        condTemplate: [],
        showPrint: true,
        state: {},
        condText: ''
      }
    },
    methods: {
      setTitle(title) {
        this.$set(this, 'title', title)
        document.title = title
        page.pageTitle = title
      },
      setTemplate(tmp) {
        this.$set(this, 'condTemplate', tmp)
      },
      setDefaultCond(cond) {
        let max = this.condData.length === 0 ? 0 : $linq(this.condData).max(x => x.itemno)
        $linq(cond).foreach(x => {
          let option = $linq(this.condTemplate).where(z => z.field_name === x.field_name).firstOrDefault() || {}
          x.itemno = ++max
          x.option = option
          x.operatorx = x.operatorx || option.operatorx_default
          x.value = $xt.isEmpty(x.value) ? option.value_default : x.value
          x.not_remove = x.not_remove
        })
        this.$set(this, 'condData', cond)
      },
      async callData(change_page = false) {
        if ($linq(this.condData).any(x => $xt.isEmpty(x.value))) {
          $msg.alert('คำเตือน', 'หากเลือกเงื่อนไขแล้วไม่สามารถใส่ค่าว่างได้', 'warning')
          return
        }

        $linq(this.condData).foreach(x => {
          x.field_type = x.option.field_type
          x.field_group = x.option.field_group
          x.multiple_type = x.option.multiple_type
          x.display_value = ((x.option.value_arr || []).length > 0) ? ($linq(x.option.value_arr).where(z => z.value === x.value).select(z => z.name).firstOrDefault() || '') : (x.value || x.display_value)
          x.table_name = x.option.table_name
        })
        let reorder = $linq(this.condData).groupBy(x => x.field_name).select(x => x.values).toArray()
        let reorder_data = []
        $linq(reorder).foreach(x => {
          reorder_data = $linq(reorder_data).union(x).toArray()
        })
        this.$set(this, 'condData', reorder_data)

        let serialize = ''
        /* Extra Condition (Not Check Type) */
        if (Object.keys(this.extraCond || {}).length > 0) {
          let param = $linq(Object.keys(this.extraCond || {})).select(x => {
            return `${x}=${$xt.isEmpty(this.extraCond[x]) ? '' : this.extraCond[x]}`
          }).toArray()
          serialize = param.join('&')
        }

        /* Extra Condition (Check Type) */
        if (Object.keys(this.extraCond2 || {}).length > 0) {
          let param = $linq(Object.keys(this.extraCond2 || {})).select(x => {
            let type = this.extraCond2[x].type
            let value = type === 'date' ? moment(this.extraCond2[x].value).format(this.extraCond2[x].format || 'DD/MM/YYYY') : this.extraCond2[x].value

            if (change_page && (this.extraCond2[x].useDefault || false)) {
              return `${x}=${this.extraCond2[x].default}`
            }
            else {
              return `${x}=${$xt.isEmpty(value) ? '' : value}`
            }
          }).toArray()
          serialize = param.join('&')
        }

        /* Set Text Condition */
        let cond_text = ''
        this.condData.forEach((x, idx) => {
          cond_text += `${x.option.display_name} ${x.operatorx} ${this.displayCondValue(x)} `
          if (!$xt.isEmpty(this.condData[idx + 1])) {
            cond_text += `${x.option.multiple_type} `
          }
        })
        this.$set(this, 'condText', cond_text)

        page.loadingBox.show()
        try {
          let r1 = await $xt.postServerJson(this.dataUrl + '?' + serialize, this.condData)
          if (!r1.success) {
            throw r1.error
          }
          await this.$parent.setRptData(r1.data, JSON.parse(JSON.stringify(this.condData)))
          this.$refs.conditionModal.closeModal()
        } catch (ex) {
          $msg.alert('เกิดข้อผิดพลาด', ex.toString(), 'danger')
        }
        page.loadingBox.hide()
      },
      addCond() {
        let max = this.condData.length === 0 ? 0 : $linq(this.condData).max(x => x.itemno)
        max++
        this.condData.push({ itemno: max, field_name: '', table_name: '', option: {} })
      },
      delCond(item) {
        this.$set(this, 'condData', $linq(this.condData).where(x => !(x.itemno === item.itemno)).toArray())
      },
      addOption(x) {
        let option = $linq(this.condTemplate).where(z => z.field_name === x.field_name).firstOrDefault() || {}
        if (!option.multiple) {
          if (x.field_name && $linq(this.condData).where(z => z.field_name === x.field_name).count() > 1) {
            $alert('', `ไม่สามารถเลือก <b>${option.display_name}</b> มากกว่าหนึ่งครั้งได้`, 'danger')
            this.$set(x, 'field_name', '')
            this.$set(x, 'operatorx', '')
            this.$set(x, 'value', '')
            this.$set(x, 'display_value', '')
            this.$set(x, 'option', {})
            return
          }
        }
        this.$set(x, 'operatorx', option.operatorx_default)
        this.$set(x, 'value', option.value_default)
        this.$set(x, 'display_value', '')
        this.$set(x, 'option', option)
      },
      doAction(x) {
        this.$set(this, 'selectedRow', x)
        this.$parent[x.option.func_name]()
        this.setCondText()
      },
      setRowData(value, displayValue) {
        this.$set(this.selectedRow, 'value', value)
        this.$set(this.selectedRow, 'display_value', displayValue)
      },
      displayCondValue(x) {
        return x.option.field_type === 'date' ? this.$options.filters.date(x.value, 'DD/MM/YYYY') : (x.display_value || x.value)
      },
      async excel() {
        page.loadingBox.show()
        try {
          //let f = new FormData()
          //f.append('html', $(this.$refs.datatable).html())
          let f = { html: $(this.$refs.datatable).html() }
          let r = await $xt.postServerJson('api/file/HtmlToXls/', f)
          window.open(dataServer + 'api/file/download?download=true&id=' + r)
        } catch (ex) {
          $msg.alert("", ex.toString(), "danger")
        }
        page.loadingBox.hide()
      },
      print() {
        //printWindow = window.open(baseUrl + 'page/report/v_rpt_print/', '_blank')
      }
    },
    mounted() {
      page = this.$refs.page

      window.addEventListener('message', e => {
        //printWindow.postMessage($(this.$refs.datatable).html(), "*")
        console.log("print request")
      }, false)

      $("#ReportBox").boxWidget()

      this.$refs.conditionModal.setSize("modal-xl")

      this.$refs.conditionModal.openModal()

      this.$nextTick(() => {
        $(window).resize(() => {
          let windowHeight = $(window).height()
          $(this.$refs.report_content).css({ "height": (windowHeight - 175) + "px" })
        })
        $(window).trigger('resize')
      })
    }
  }

  export default vue
</script>

<style scoped>

  .white-backgroud {
    background: #FFFFFF 0% 0% no-repeat padding-box;
    -webkit-box-shadow: 0px 5px 5px 0px rgba(227,218,227,1);
    -moz-box-shadow: 0px 5px 5px 0px rgba(227,218,227,1);
    box-shadow: 0px 5px 5px 0px rgba(227,218,227,1);
    opacity: 1;
  }

  .margin-btn-header {
    margin-top: -5px;
    margin-bottom: 5px;
  }

  .content-report {
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
