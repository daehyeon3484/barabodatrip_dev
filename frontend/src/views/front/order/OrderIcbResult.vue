<template>
    <main class="mt-3">
      <div class="container">
        <h2 class="text-center">결재완료</h2>
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
    methods : {
      init() {
        console.log("icb result : ",sessionStorage.get('lan_tp'))
        swal.fire({
          title: this.$t("common.order_success_msg"),
          icon : 'success',
          timer: 5000, 
          confirmButtonText: this.$t("common.common_confirm"),
        })
        // window.location.reload(true)
        // window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
        this.$router.push({path: "/", query:{lan_tp : sessionStorage.get('lan_tp')}})
      }
    }
}
</script>

<style>

</style>