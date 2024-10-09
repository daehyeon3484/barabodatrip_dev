<template>
  <tripLogin> 
    <div class="continer continer-login-div">
        <!-- <div class="row"> -->
        <div class="card bg-dark main-card card-login-div">
            <h1 class="mt-4 text-light">{{ $t("main.login") }}</h1>
            <div class="card-body">
              <div class="mb-2 row">
                <label  class="col-md-4 col-form-label  fw-bold text-start font-lg">* {{$t("order.email")}}</label>
                <div class="col-md-8">
                  <input type="text" class="form-control mobile-md" ref="mem_email" v-model.trim="userInfo.mem_email" :placeholder="$t(`common.common_login_email_input`)" :aria-label="$t(`common_login_email_input.order_email_input`)">
                </div>
                <div v-if="this.memEmailMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memEmailMsg}}</span></div>
              </div>
              <div class="mb-2 row">
                <label  class="col-md-4 col-form-label  fw-bold text-start font-lg">* {{$t("common.common_login_password")}}</label>
                <div class="col-md-8">
                  <input type="password" class="form-control mobile-md" ref="mem_password" v-model.trim="userInfo.mem_password" :placeholder="$t(`common.common_login_password_input`)" :aria-label="$t(`common.common_login_password_input`)" @keydown.enter="goLogin">
                </div>
                <div v-if="this.memPassMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memPassMsg}}</span></div>
              </div>
              <div class="mb-2 row">
                <div v-if="this.resultMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.resultMsg}}</span></div>
              </div>
              <div class="text-start p-modal-lg pt-3">
                <button type="button" class="btn btn-success btn-st-sm text-white me-2" @click="goJoin">{{$t('common.common_join')}}</button>
                <button type="button" class="btn btn-danger text-white btn-st-sm" @click="goLoginFind">{{$t('common.common_login_info_find')}}</button>
              </div>
            </div>
        </div>
        <!-- </div> -->
    </div>
  </tripLogin>
</template>
<script>
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import { isDEmpty } from '@/is';
import {swalTost} from '@/alert'
export default {
  
  data() {
    return {
      isMobile : false,
      userInfo : {
        mem_email : "",
        mem_password : "",
      },
      resultMsg : "",
      memEmailMsg : "",
      memPassMsg : ""
    }
  },
  emits: ['onLoginChange'],
  mounted() {
    this.isMobile = this.$isMobile()
  },
  unmounted() {
  },
  created() {
  },
  methods : {
    reset() {
      this.userInfo = {}
      this.resultMsg = ""
      this.memEmailMsg = ""
      this.memPassMsg = ""
      let closeBtn = document.querySelector('#modalLoginClose')
      closeBtn.click()
    },
    validationChk() {
      const regex1 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      this.memEmailMsg = ''
      this.memPassMsg = ''

      if(isDEmpty(this.userInfo.mem_email)) {
        this.$refs.mem_email.focus();
        this.memEmailMsg = this.$t('common.common_login_email_input')
        return false
      } else {
        if (!regex1.test(this.userInfo.mem_email)) {
          this.userInfo.mem_email = ''
          this.$refs.mem_email.focus()
          this.memEmailMsg = this.$t('common.common_login_email_validation')
          return false
        }
      }
      if(isDEmpty(this.userInfo.mem_password)) {
        this.$refs.mem_password.focus();
        this.memPassMsg = this.$t('common.common_login_password_input')
        return false
      }
      
      return true
    },
    async goLogin() {
      if(this.validationChk()) {
        let info = this.userInfo
        info = Object.assign(info, {company_type : sessionStorage.get('company_type')})
        let memInfo = await this.$api('/memChk', {info})
        if(memInfo.msg != 'success') {
          this.resultMsg = this.$t("common.common_login_email_password_fail")
          return false
        } else {
          swalTost.fire({
              title: this.$t("common.common_login_confirm"),
              icon : 'question',
              confirmButtonText: this.$t("main.login"),
              cancelButtonText: this.$t("common.common_cancel")
          }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  let resParam = await this.$api(`/loginCallback`, {info})
                  this.$store.commit("user", resParam);
                  window.location.reload(true)
                  window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
                  // this.$router.push({path: "/", query : {lan_tp : sessionStorage.get('lan_tp')} })
                  this.reset()
                } catch(err) {
                  console.log("err : ",err);
                }
              } 
          });
        }
      }
    },
    goJoin(){
      this.$emit('onLoginChange', {loginType : 'join'});
      let closeBtn = document.querySelector('#modalLoginClose')
      closeBtn.click()
    },
    goLoginFind() {
      this.$emit('onLoginChange', {loginType : 'find'});
      let closeBtn = document.querySelector('#modalLoginClose')
      closeBtn.click()
    }

  }

}
</script>