<template>
    <main class="mt-3">
      <div class="container">
        <h2 class="text-center">로그인</h2>
      </div>
      <modalSpiner v-if="isLoading"></modalSpiner>
    </main>
</template>

<script>
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
// const localStorage = generateSessionStorage()
import modalSpiner from '@/components/ModalSpiner.vue';
import {isDEmpty} from '@/is';
let timer = null
export default {
    components  : {
      modalSpiner
    },
    data() {
        return {
          isLoading : false
        }
    },
    created() {
      // let mem_id = this.$route.query.lan_tp
      timer = setTimeout(() => {
        this.init()
      }, 1000);
    },
    mounted() {
      
    },
    unmounted() {
      clearTimeout(timer)
    },
    methods : {
      async init() {
        this.isLoading = true
        let data = {}
        data = {
          mem_id : this.$route.query.mem_id,
          mem_nick : this.$route.query.mem_nick,
          mem_nm : this.$route.query.mem_nm,
          mem_profile_path : this.$route.query.mem_profile_path,
          sns_type : this.$route.query.sns_type,
          mem_token : this.$route.query.mem_token,
          ip : this.$route.query.ip,
          os_tp : this.$route.query.os_tp,
          use_yn : this.$route.query.use_yn,
          admin_yn : this.$route.query.admin_yn,
          reg_date : this.$route.query.reg_date,
          company_type : sessionStorage.get('company_type')
        }
        if(!isDEmpty(sessionStorage.get('company_type')) && this.$route.query.lan_tp == 'CHN') {
          await this.$api('/api/loginUpdate', {param:[{company_type : sessionStorage.get('company_type')}, this.$route.query.mem_sns_id]})
        }
        // console.info("data : ", localStorage.get('resParam'))
        this.$store.commit("user", data);
        // let res = await this.$api('/smtp/email', data)
        console.info("result lan : ", sessionStorage.get('lan_tp'))
        this.isLoading = false
        window.location.reload(true)
        window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
        // this.$router.push({path: "/", query : {lan_tp : sessionStorage.get('lan_tp')} })
      },
      
    }
}
</script>

<style>

</style>