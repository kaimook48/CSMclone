<template>
  <div class="content">
    <div class="callout callout-danger">
      <h1>Error</h1>
      <h3>Access Denied.</h3>
    </div>
  </div>
</template>
<script>
  export default {
    mounted() {
      document.title = `Error : Access Denied.`;
    }
  };
</script>
