<template>
    <main class="mt-3">
      <div class="container">
        <h2 class="text-center">결제완료</h2>
      </div>
    </main>
</template>

<script>
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import {swal} from '@/alert'
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
    unmounted() {
    },
    methods : {
      init() {
        // self.close()
        //rescode=0000 성공 
        let cartId = this.$route.query.cart_id
        let rescode = this.$route.query.result_code
        
        if(rescode == '0000') {
          swal.fire({
            title: this.$t("common.order_success_msg"),
            icon : 'success',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_confirm"),
          })
          window.location.reload(true)
          window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
          // this.$router.push({path: "/", query:{lan_tp : sessionStorage.get('lan_tp')}})
        } else {
          swal.fire({
            title: this.$t("common.order_fail_msg"),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          this.$router.push({path: "/order", query:{cart_id : cartId, lan_tp : sessionStorage.get('lan_tp')}})
        }
      }
    }
}
</script>

<style>

</style>