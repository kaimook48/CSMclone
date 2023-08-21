<template>
  <div>
    <div class="modal fade" ref="myModal">
      <div class="modal-dialog" v-bind:class="[modalSize]">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <slot name="header"></slot>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <!-- Modal footer -->
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modalSize: 'modal-md',
        ui: window.ui
      };
    },
    methods: {
      openModal() {
        $(this.$refs.myModal).modal('show');
      },
      closeModal() {
        $(this.$refs.myModal).modal('hide');
      },
      setSize(t) {
        this.$set(this, 'modalSize', t);
      },
    }
  };
</script>
