<template>
<div class="form-group">
  <select ref="select" class="form-control input-sm" v-bind:class="otherClass" style="width: 310px; margin-right:10px;" >
    <slot></slot>
  </select>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: ['otherClass', 'options', 'value'],
    mounted: function () {
      var vm = this

      $.fn.select2.defaults.set("theme", "bootstrap")

      $(this.$refs.select)
        .select2({ data: this.options, containerCssClass: ':all:', width: 'element' })
        .val(this.value)
        .trigger('change')
        .on('change', function () {
          vm.$emit('input', this.value)
        })
    },
    watch: {
      value: function (n, o) {
        $(this.$refs.select).val(n).trigger('change', { ignore: true })
      },
      options: function (options) {
        $(this.$refs.select).select2({ data: options })
      }
    },
    destroyed: function () {
      $(this.$refs.select).off().select2('destory')
    }
  }
</script>