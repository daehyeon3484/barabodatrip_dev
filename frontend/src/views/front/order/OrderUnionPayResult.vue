<template>
    <main class="mt-3">
      <div class="container">
        <h2 class="text-center">결재완료</h2>
      </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
          popup : null
        }
    },
    created() {
      
    },
    mounted() {
      this.init()
    },
    methods : {
      init() {
        let rescode = this.$route.query.result_code
        let cartId = this.$route.query.cart_id
        let lanTp = this.$route.query.lan_tp
        opener.parent.location=`/orderResult?result_code=${rescode}&cart_id=${cartId}&lan_tp=${lanTp}`
        window.close()
      }
      
    }

}
</script>

<style>

</style>