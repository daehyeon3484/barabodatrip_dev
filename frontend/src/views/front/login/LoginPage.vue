<template>
  <main class="mt-2">
    <div class="continer">
      <div class="row">
        <div class="col-md-12">
          <div class="card main-card bg-dark">
            <h4 v-if="!isMobile" class="mt-4 fw-bold text-info">{{$t('main.login')}}</h4>
            <h6 v-else class="mt-4 text-info">{{$t('main.login')}}</h6>
            <!-- <div class="card-body" style="padding: 0 0 0 0"> -->
            <div class="card-body">
              <div v-if="this.lanTp == 'CHN'"> 
                <div v-if="!isMobile"> 
                  
                  <div class="mb-2 row">
                    <label  :class="isMobile == true ? 'col-md-4 col-form-label fw-bold text-start font-lg text-info' : 'col-3 col-form-label fw-bold text-start text-info'"><strong class="text-danger">*</strong> {{$t("order.email")}}</label>
                    <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                      <input type="text" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_email" v-model.trim="userInfo.mem_email" :placeholder="$t(`common.common_login_email_input`)" :aria-label="$t(`common_login_email_input.order_email_input`)">
                    </div>
                    <div v-if="this.memEmailMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memEmailMsg}}</span></div>
                  </div>
                  <div class="mb-2 row">
                    <label  :class="isMobile == true ? 'col-md-4 col-form-label fw-bold text-start font-lg text-info' : 'col-3 col-form-label fw-bold text-start text-info'"><strong class="text-danger">*</strong> {{$t("common.common_login_password")}}</label>
                    <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                      <input type="password" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_password" v-model.trim="userInfo.mem_password" :placeholder="$t(`common.common_login_password_input`)" :aria-label="$t(`common.common_login_password_input`)" @keydown.enter="goLogin">
                    </div>
                    <div v-if="this.memPassMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memPassMsg}}</span></div>
                  </div>
                  <div class="mb-2 row">
                    <div v-if="this.resultMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.resultMsg}}</span></div>
                  </div>
                  <div class="row"> 
                    <div class="d-grid gap-1 col-12">
                      <button type="button" :class="isMobile == true ? 'btn btn-primary btn-st-md' :  'btn btn-primary'"  @click="goLogin">{{$t('main.login')}}</button>
                    </div>
                  </div>
                  <qq ref="qq" class="pt-2"/>
                  <hr class="text-white">
                  <div class="row"> 
                    <div class="text-start p-modal-lg pt-2 mr-3">
                      <button type="button" class="btn btn-success btn-st-sm text-white me-2" @click="goJoin">{{$t('common.common_join')}}</button>
                      <button type="button" class="btn btn-danger text-white btn-st-sm" @click="goLoginFind">{{$t('common.common_login_info_find')}}</button>
                    </div>
                  </div>
                </div>
                <div v-else> 
                  <div class="mb-2 row">
                    <label  :class="isMobile == true ? 'col-md-4 col-form-label fw-bold text-start font-lg text-info' : 'col-3 col-form-label fw-bold text-start text-info'"><strong class="text-danger">*</strong> {{$t("order.email")}}</label>
                    <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                      <input type="text" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_email" v-model.trim="userInfo.mem_email" :placeholder="$t(`common.common_login_email_input`)" :aria-label="$t(`common_login_email_input.order_email_input`)">
                    </div>
                    <div v-if="this.memEmailMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memEmailMsg}}</span></div>
                  </div>
                  <div class="mb-2 row">
                    <label  :class="isMobile == true ? 'col-md-4 col-form-label fw-bold text-start font-lg text-info' : 'col-3 col-form-label fw-bold text-start text-info'"><strong class="text-danger">*</strong> {{$t("common.common_login_password")}}</label>
                    <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                      <input type="password" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_password" v-model.trim="userInfo.mem_password" :placeholder="$t(`common.common_login_password_input`)" :aria-label="$t(`common.common_login_password_input`)" @keydown.enter="goLogin">
                    </div>
                    <div v-if="this.memPassMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memPassMsg}}</span></div>
                  </div>
                  <div class="mb-2 row">
                    <div v-if="this.resultMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.resultMsg}}</span></div>
                  </div>
                  <div class="row"> 
                    <div class="d-grid gap-1 col-12">
                      <button type="button" :class="isMobile == true ? 'btn btn-primary btn-st-md' :  'btn btn-primary'"  @click="goLogin">{{$t('main.login')}}</button>
                    </div>
                  </div>
                  <hr class="text-white">
                  <div class="row"> 
                    <div class="text-start p-modal-lg pt-2 mr-3">
                      <button type="button" class="btn btn-success btn-st-sm text-white me-2" @click="goJoin">{{$t('common.common_join')}}</button>
                      <button type="button" class="btn btn-danger text-white btn-st-sm" @click="goLoginFind">{{$t('common.common_login_info_find')}}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else> 
                <!-- <div> 
                  <qq v-if="!this.isMobile" ref="qq" class="mb-4"/>
                  <qqMolbile v-else ref="qqM" class="mb-4"/>
                </div> -->
                <div class="mb-2 row">
                  <label  :class="isMobile == true ? 'col-md-4 col-form-label fw-bold text-start font-lg text-info' : 'col-md-3 col-form-label fw-bold text-start text-info'"><strong class="text-danger">*</strong> {{$t("order.email")}}</label>
                  <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                    <input type="text" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_email" v-model.trim="userInfo.mem_email" :placeholder="$t(`common.common_login_email_input`)" :aria-label="$t(`common_login_email_input.order_email_input`)">
                  </div>
                  <div v-if="this.memEmailMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memEmailMsg}}</span></div>
                </div>
                <div class="mb-2 row">
                  <label  :class="isMobile == true ? 'col-md-4 col-form-label fw-bold text-start font-lg text-info' : 'col-md-3 col-form-label fw-bold text-start text-info'"><strong class="text-danger">*</strong> {{$t("common.common_login_password")}}</label>
                  <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                    <input type="password" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_password" v-model.trim="userInfo.mem_password" :placeholder="$t(`common.common_login_password_input`)" :aria-label="$t(`common.common_login_password_input`)" @keydown.enter="goLogin">
                  </div>
                  <div v-if="this.memPassMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memPassMsg}}</span></div>
                </div>
                <div class="mb-2 row">
                  <div v-if="this.resultMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.resultMsg}}</span></div>
                </div>
                <div class="row"> 
                  <div class="d-grid gap-1 col-12">
                    <button type="button" :class="isMobile == true ? 'btn btn-primary btn-st-md' :  'btn btn-primary'"  @click="goLogin">{{$t('main.login')}}</button>
                  </div>
                </div>
                <googleLogin ref="google" class="pt-2"/>
                <kakao ref="kakao" class=""/>
                <hr class="text-white">
                <div class="row"> 
                  <div class="text-start p-modal-lg pt-2 mr-3">
                    <button type="button" :class="isMobile == true ? 'btn btn-success btn-st-sm text-white me-2' : 'btn btn-success text-white me-2'" @click="goJoin">{{$t('common.common_join')}}</button>
                    <button type="button" :class="isMobile == true ? 'btn btn-danger text-white btn-st-sm' : 'btn btn-danger text-white'" @click="goLoginFind">{{$t('common.common_login_info_find')}}</button>
                  </div>
                </div>
                
              </div>
              <div class="set-height"></div>
            </div>
          </div>
          <div :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
        </div>
      </div>
    </div>
    <!-- <modalLogin @onLoginChange="loginPopupEmit"></modalLogin> -->
    <modalLogin></modalLogin>
    <modalJoin></modalJoin>
    <modalIdPwFind></modalIdPwFind>
  </main>
</template>
<script>

import kakao from './kakao/KakaoLogin.vue'
import qq from './qq/QqWebLogin.vue'
const sessionStorage = generateSessionStorage()
import {generateSessionStorage} from '@/storage'
import { isDEmpty } from '@/is';
import {swalTost} from '@/alert'
import modalLogin from '@/components/ModalLogin.vue';
import modalJoin from '@/components/ModalJoin.vue';
import modalIdPwFind from '@/components/ModalIdPwFind.vue';
import googleLogin from './google/LoginGoogle.vue'
// import qqMolbile from './qq/QqMolbileLogin.vue';
export default {
    components : {
     googleLogin,
        kakao,
        qq,
        // qqMolbile,
        modalLogin,
        modalJoin,
        modalIdPwFind,  
    },
    data() {
        return {
            resParam : {},
            lanTp : "",
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
    mounted() {
        this.isMobile = this.$isMobile()
       
    },
    
    created(){
        this.lanTp = sessionStorage.get('lan_tp')
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
          // info = Object.assign(info, {company_type : sessionStorage.get('company_type')})
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
    //   loginPopupEmit(obj) {
    //   if(obj.loginType == 'join') {
    //     let btnJoin = document.querySelector('#joinModalBtn')
    //     btnJoin.click()
    //   } else if(obj.loginType == 'login') {
    //     let modalBtn = document.querySelector('#mobileModalBtn')
    //     modalBtn.click()
    //   } else if(obj.loginType == 'find') {
    //     let findBtn = document.querySelector('#findModalBtn')
    //     findBtn.click()
    //   }
    // },
      goJoin(){
        let btnJoin = document.querySelector('#joinModalBtn')
        btnJoin.click()
      },
      goLoginFind() {
        // this.$emit('onLoginChange', {loginType : 'find'});
        let findBtn = document.querySelector('#findModalBtn')
        findBtn.click()
      },
    }
}
</script>