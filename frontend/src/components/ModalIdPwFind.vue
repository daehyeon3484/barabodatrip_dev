<template>
  <div :class="isMobile == true ? 'mobile-lg' : ''"> 
    <button class="float-end btn btn-outline-warning me-md-2 text-light" hidden type="button" id="findModalBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop_find">test</button> 
    <!-- Modal -->
    <div class="modal fade modal-md" id="staticBackdrop_find" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel_find" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div :class="isMobile == true ? 'mobile fw-bold text-start' : 'fw-bold text-start'" id="staticBackdropLabel_find">{{$t('common.common_login_info_find')}}</div>
            <button id="modalFindClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div :class="isMobile == true ? 'fw-bold font-lg text-info text-center' : 'fw-bold text-info text-center'"> {{$t("common.common_login_email_find")}}</div>
            <div class="mb-2 row pt-2"> 
              <div class="input-group mb-2"> 
                <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{ $t("order.name") }}</span>
                <input type="text" class="form-control mobile-md" ref="id_mem_nm" v-model.trim="idInfo.mem_nm" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              </div>
              <div class="input-group mb-2"> 
                <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{ $t("order.tel") }}</span>
                <input type="text" class="form-control mobile-md" ref="id_mem_tel" v-model.trim="idInfo.mem_tel" :placeholder="$t(`common.order_tel_input`)" :aria-label="$t(`common.order_tel_input`)">
                <button class="btn btn-outline-secondary btn-st-sm" type="button" @click="goFind('idchk')">{{ $t("common.common_login_email_find") }}</button>
              </div>
              <div v-if="this.idMsg != ''" class="text-start"><span class="text-danger span-font-sm">* {{ this.idMsg }}</span></div>
            </div>

            <div :class="isMobile == true ? 'fw-bold font-lg text-info text-center' : 'fw-bold text-info text-center'"> {{$t("common.common_login_password_find")}}</div>
            <div class="mb-2 row pt-2">
              <div class="input-group mb-2"> 
                <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{ $t("order.name") }}</span>
                <input type="text" class="form-control mobile-md" ref="pw_mem_nm" v-model.trim="passInfo.mem_nm" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)" aria-describedby="inputGroup-sizing-sm">
              </div>
              <div class="input-group mb-2"> 
                <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{ $t("order.tel") }}</span>
                <input type="text" class="form-control mobile-md" ref="pw_mem_tel" v-model.trim="passInfo.mem_tel" :placeholder="$t(`common.order_tel_input`)" :aria-label="$t(`common.order_tel_input`)" aria-describedby="inputGroup-sizing-sm">
              </div>
              <div class="input-group mb-2"> 
                <input type="text" class="form-control mobile-md" ref="pw_mem_email" v-model.trim="passInfo.mem_email" :placeholder="$t(`common.common_login_email_input`)" :aria-label="$t(`common.common_login_email_input`)" aria-describedby="inputGroup-sizing-sm">
                <button class="btn btn-outline-secondary btn-st-sm" type="button" @click="goFind('passwordchk')">{{ $t("common.common_login_password_find") }}</button>
              </div>
              <div v-if="this.pwMsg != ''" class="text-start"><span class="text-danger span-font-sm">* {{ this.pwMsg }}</span></div>
            </div>
            <div v-if="this.resultMsg != ''" class="mb-2 row">
              <div class="input-group mb-2"> 
                <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{this.findMsg}}</span>
                <input class="text-info" type="text" v-model="this.resultMsg" aria-describedby="inputGroup-sizing-sm" readonly>
                <button class="btn btn-outline-secondary btn-st-sm" type="button" @click="copyClipboard">{{ $t('common.copy') }}</button>
              </div>
              <div v-if="this.copyMsg != ''" class="mb-2 row">
                <div class="text-start"><span class="text-info">{{ this.copyMsg }}</span></div>
              </div>
            </div>
            <div v-if="this.failMsg != ''" class="mb-2 row">
              <span class="text-danger text-start span-font">* {{ this.failMsg }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button  type="button" :class="isMobile== true ? 'btn btn-secondary mobile-ss btn-st-sm' : 'btn btn-secondary mobile-ss'" @click="reset">{{ $t("common.common_close") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>          
</template>
<script>
import { isDEmpty } from '@/is'
import {swalTost} from '@/alert'
export default {
  data() {
    return {
      popupData : {},
      targetId : "",
      popupFlag : false,
      communityList : [],
      isMobile : false,
      idInfo : {
        mem_nm : "",
        mem_tel : "",
        mem_email : "",
      },
      passInfo : {
        mem_nm : "",
        mem_tel : "",
        mem_email : "",
      },
      idMsg : "",
      pwMsg : "",
      resultMsg : "",
      idchkFlag : false,
      passchkFlag : false,
      findMsg : "",
      failMsg : "",
      copyMsg : ""

    }
  },
  emits: ['onLoginChange'],
  mounted() {
    this.isMobile = this.$isMobile()
    this.reset()
  },
  created() {

  },
  methods : {
    reset() {
      this.idInfo = {
        
      }
      this.passInfo = {
      }
      this.idMsg = ""
      this.pwMsg = ""
      this.resultMsg = ""
      this.idchkFlag = false
      this.passchkFlag = false
      this.findMsg = ""
      this.failMsg = ""
      this.copyMsg = ""
      let closeBtn = document.querySelector('#modalFindClose')
      closeBtn.click()
    },
    validationChk(type) {
      const regex = /^[0-9]+$/
      const regex1 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      this.idMsg = ''
      this.pwMsg = ''
      if(type == 'idchk') {
        if(isDEmpty(this.idInfo.mem_nm)) {
          this.$refs.id_mem_nm.focus();
          this.idMsg = this.$t('common.common_login_name_input')
          return false
        }
        if(isDEmpty(this.idInfo.mem_tel)) {
          this.$refs.id_mem_tel.focus();
          this.idMsg = this.$t('common.common_login_tel_input')
          return false
        } else {
          if (!regex.test(this.idInfo.mem_tel)) {
            this.idInfo.mem_tel = ''
            this.$refs.id_mem_tel.focus()
            this.idMsg = this.$t("common.common_tel_number")
            return false
          }
        }
      } else {
        if(isDEmpty(this.passInfo.mem_nm)) {
          this.$refs.pw_mem_nm.focus();
          this.pwMsg = this.$t('common.common_login_name_input')
          return false
        }
        if(isDEmpty(this.passInfo.mem_tel)) {
          this.$refs.pw_mem_tel.focus();
          this.pwMsg = this.$t('common.common_login_tel_input')
          return false
        } else {
          if (!regex.test(this.passInfo.mem_tel)) {
            this.passInfo.mem_tel = ''
            this.$refs.pw_mem_tel.focus()
            this.pwMsg = this.$t("common.common_tel_number")
            return false
          }
        }
        if(isDEmpty(this.passInfo.mem_email)) {
          this.$refs.pw_mem_email.focus();
          this.pwMsg = this.$t('common.common_login_email_input')
          return false
        } else {
          if (!regex1.test(this.passInfo.mem_email)) {
            this.passInfo.mem_email = ''
            this.$refs.pw_mem_email.focus()
            this.pwMsg = this.$t('common.common_login_email_validation')
            return false
          }
        }
      }
      return true
    },
    async goFind(type){
      // let info = this.userInfo
      // await this.$api('/join', {info})            
      this.resultMsg = ""
      this.failMsg = ""
      this.findMsg = ""
      if(this.validationChk(type)) {
        let msg = ""
        let info = {}
        if(type == 'idchk') {
          msg = this.$t("common.common_login_email_find")
          info = this.idInfo
        } else {
          msg = this.$t("common.common_login_password_find")
          info = this.passInfo
        }
        swalTost.fire({
            title: this.$t("common.common_login_info_find"),
            icon : 'warning',
            confirmButtonText: msg,
            cancelButtonText: this.$t("common.common_cancel")
        }).then(async (result) => {
            if (result.isConfirmed) {
              info = Object.assign(info, {type : type})
              let resData = await this.$api('/findChk', {info})
              if(resData.msg == 'success') {
                this.findMsg = type == 'idchk' ? this.$t("order.email") : this.$t("common.common_login_password")
                this.resultMsg = resData.resdata
              } else {
                this.failMsg = type == 'idchk' ? this.$t("common.find_email_fail") : this.$t("common.find_password_fail")
              }
            }
        });
      }
    },
    
    copyClipboard(){
      this.copyMsg = ""
      window.navigator.clipboard.writeText(this.resultMsg).then(() => {
      });
      this.copyMsg = this.$t('common.copy_success')

    }
  }

}
</script>

<style>

</style>