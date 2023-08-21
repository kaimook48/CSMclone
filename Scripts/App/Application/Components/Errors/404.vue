<template>
  <div class="content">
    <div class="callout callout-danger">
      <h1>Error</h1>
      <h3>Content Not Found.</h3>
    </div>
  </div>
</template>
<script>
  export default {
    mounted() {
      document.title = `Error : Content Not Found.`;
    }
  };
</script>
