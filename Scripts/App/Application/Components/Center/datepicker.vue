<template>
  <date-picker lang="en" format="DD/MM/YYYY" :lang="lang" :input-class="inputClass" width="100%" @input="evtInput" @change="evtChange" :not-after="dateAfter()" :not-before="dateBefore()" v-model="date" :disabled="disabled||false" append-to-body>
    <template slot="calendar-icon">
      <i class="fas fa-calendar"></i>
    </template>
  </date-picker>
</template>
<script>
  import DatePicker from 'vue2-datepicker';
  export default {
    props: ['inputClass', 'value', 'disabled', 'overdate', 'beforedate'],
    components: {
      'date-picker': DatePicker
    },
    data() {
      return {
        date: this.value,
        lang: {
          placeholder: {
            date: "__/__/____"
          }
        }
      };
    },
    methods: {
      evtInput() {
        this.$emit('input', this.date);
      },
      evtChange() {
        this.$emit('change', this.date);
      },
      dateBefore() {
        var boolean = this.beforedate || false;
        var date = boolean ? new Date() : "";
        return date;
      },
      dateAfter() {
        var date = ($xt.isEmpty(this.overdate) || this.overdate == 0) ? '' : moment(new Date()).add(this.overdate, 'days');;
        return date;
      },
      disableWeekends(date) {
        const day = new Date(date).getDay();
        return day === 0 || day === 6;
      },
    },
    watch: {
      value(newValue, oldValue) {
        this.$set(this, 'date', newValue)
      }
    }
  };
</script>
<style scoped>

  .mx-datepicker-popup {
    z-index: 2000 !important;
  }
</style>
