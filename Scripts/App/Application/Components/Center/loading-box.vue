<template>
  <div>
    <vue-element-loading :active="isActive" :is-full-screen="true" color="#02234e" text="ระบบกำลังดำเนินการ กรุณารอสักครู่" />
  </div>
</template>
<script>
  import VueElementLoading from 'vue-element-loading'
  let loadingBox = {
    components: {
      VueElementLoading
    },
    data() {
      return {
        isActive: false,
      }
    },
    methods: {
      show: function () {
        this.isActive = true;
      },
      hide: function () {
        this.isActive = false;
      },
      hidden: function (fn) {
        this.isActive = false;
        if (fn) {
          fn();
        }
      }
    },
    mounted() {
      //loader = $(this.$refs.loaddingPane);
    }
  };
  export default loadingBox;
</script>
