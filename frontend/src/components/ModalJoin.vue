<template>
  <div :class="isMobile == true ? 'mobile-lg' : ''"> 
    <button class="float-end btn btn-outline-warning me-md-2 text-light" hidden type="button" id="joinModalBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop_join">test</button> 
    <!-- Modal -->
    <div class="modal fade modal-md" id="staticBackdrop_join" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel_join" aria-hidden="true">
      <div class="modal-dialog ">
        <div class="modal-content bg-white">
          <div class="modal-header">
            <div :class="isMobile == true ? 'mobile fw-bold text-start text-dark' : 'fw-bold text-start text-dark'" id="staticBackdropLabel_join">{{$t('common.common_join')}}</div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2 row">
              <label  :class="isMobile == true ? 'col-md-4 col-form-label  fw-bold text-start font-lg text-dark' : 'col-md-3 col-form-label  fw-bold text-start text-dark'"><strong class="text-danger">*</strong> {{$t("order.name")}}</label>
              <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                <input type="text" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_nm" v-model.trim="userInfo.mem_nm" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              </div>
              <div v-if="this.memNmMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memNmMsg}}</span></div>
            </div>
            <div class="mb-2 row">
              <label  :class="isMobile == true ? 'col-md-4 col-form-label  fw-bold text-start font-lg text-dark' : 'col-md-3 col-form-label  fw-bold text-start text-dark'"><strong class="text-danger">*</strong> {{$t("order.tel")}}</label>
              <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                <input type="text" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_tel" v-model.trim="userInfo.mem_tel" :placeholder="$t(`common.order_tel_input`)" :aria-label="$t(`common.order_tel_input`)">
              </div>
              <div v-if="this.memTelMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memTelMsg}}</span></div>
            </div>
            <div class="mb-2 row">
              <label  :class="isMobile == true ? 'col-form-label  fw-bold text-start font-lg text-dark' : 'col-form-label  fw-bold text-start text-dark'"><strong class="text-danger">*</strong> {{$t("order.email")}}</label>
              <div class="input-group mb-3" >
                <input type="text" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_email" v-model.trim="userInfo.mem_email" :placeholder="$t(`common.common_login_email_input`)" :aria-label="$t(`common.common_login_email_input`)" @keydown.enter="memChk">
                <button class="btn btn-outline-secondary btn-st-sm" type="button" @click="memChk">{{ $t("common.common_duplication") }}</button>
              </div>
              <div v-if="this.memEmailMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memEmailMsg}}</span></div>
            </div>
            <div class="mb-2 row">
              <label  :class="isMobile == true ? 'col-form-label  fw-bold text-start font-lg text-dark' : 'col-form-label  fw-bold text-start text-dark'"><strong class="text-danger">*</strong> {{$t("common.common_login_password")}}</label>
              <div :class="isMobile == true ? 'col-md-8' : 'col-md-9'">
                <input type="password" :class="isMobile == true ? 'form-control mobile-md' : 'form-control'" ref="mem_password" v-model.trim="userInfo.mem_password" :placeholder="$t(`common.common_login_password_validation`)" :aria-label="$t(`common.common_login_password_validation`)" @keydown.enter="goJoin">
              </div>
              <div v-if="this.memPassMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memPassMsg}}</span></div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="modalJoinClose" type="button" :class="isMobile== true ? 'btn btn-secondary mobile-ss btn-st-sm' : 'btn btn-secondary mobile-ss'" data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
            <button type="button" :class="isMobile== true ? 'btn btn-primary btn-st-sm' : 'btn btn-primary'" @click="goJoin">{{$t('common.common_join')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>          
</template>
<script>
import { isDEmpty } from '@/is'
import {swalTost, swal} from '@/alert'
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
export default {
  data() {
    return {
      popupData : {},
      targetId : "",
      popupFlag : false,
      communityList : [],
      isMobile : false,
      userInfo : {
        mem_nm : "",
        mem_tel : "",
        mem_email : "",
        mem_password : ""
      },
      memNmMsg : "",
      memTelMsg : "",
      memEmailMsg : "",
      memPassMsg : "",
      chkFlag : false

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
      this.memNmMsg = ""
      this.memTelMsg = ""
      this.memEmailMsg = ""
      this.memPassMsg = ""
      this.chkFlag = false
      let closeBtn = document.querySelector('#modalJoinClose')
      closeBtn.click()
    },
    async memChk() {
      this.memEmailMsg = ""
      const regex1 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      if(isDEmpty(this.userInfo.mem_email)) {
        this.$refs.mem_email.focus();
        this.memEmailMsg = this.$t('common.common_login_email_input');
      } else {
        if (!regex1.test(this.userInfo.mem_email)) {
          this.userInfo.mem_email = ''
          this.$refs.mem_email.focus()
          this.memEmailMsg = this.$t('common.common_login_email_validation');
        }
      }
      let info = this.userInfo
      let memInfos = await this.$api('/memChk/join', {info})
      if(memInfos.msg ==  'duplication') {
        this.userInfo.mem_email = ''
        this.$refs.mem_email.focus();
        this.memEmailMsg = this.$t('common.common_join_duplication')
      } else {
        this.memEmailMsg = this.$t('common.common_login_email_use')
        this.chkFlag = true
      }
    },
    validationChk() {
      const regex = /^[0-9]+$/
      const regex1 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      // const regex2 = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%-])[a-z\d!@#$%-]{8,16}$/
      const regex2 = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/
      this.memNmMsg = ''
      this.memTelMsg = ''
      this.memEmailMsg = ''
      this.memPassMsg = ''

      if(isDEmpty(this.userInfo.mem_nm)) {
        this.$refs.mem_nm.focus();
        this.memNmMsg = this.$t('common.common_login_name_input')
        return false
      }
      if(isDEmpty(this.userInfo.mem_tel)) {
        this.$refs.mem_tel.focus();
        this.memTelMsg = this.$t('common.common_login_tel_input')
        return false
      } else {
        if (!regex.test(this.userInfo.mem_tel)) {
          this.userInfo.mem_tel = ''
          this.$refs.mem_tel.focus()
          this.memTelMsg = this.$t("common.common_tel_number")
          return false
        }
      }
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
      } else {
        if (!regex2.test(this.userInfo.mem_password)) {
          this.userInfo.mem_password = ''
          this.$refs.mem_password.focus()
          this.memPassMsg = this.$t('common.common_login_password_validation')
          return false
        } 
      }
      if(!this.chkFlag) {
        this.$refs.mem_email.focus()
        this.memEmailMsg = this.$t('common.common_email_duplication')
        return false
      }
      return true
    },
    async goJoin(){
      // let info = this.userInfo
      // await this.$api('/join', {info})            
      if(this.validationChk()) {
        swalTost.fire({
            title: this.$t("common.common_join_confirm"),
            icon : 'warning',
            showCancelButton: true,
            confirmButtonText: this.$t("common.common_join"),
            cancelButtonText: this.$t("common.common_cancel")
        }).then(async (result) => {
            if (result.isConfirmed) {
              let info = this.userInfo
              info = Object.assign(info, {company_type : sessionStorage.get('company_type')})
              let resdata = await this.$api('/join', {info})            
              if(resdata.msg == 'success') {
                this.$emit('onLoginChange', {loginType : 'login'});
                swal.fire({
                  title: this.$t("common.common_join_success"),
                  icon : 'success',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_confirm"),
                })
                this.reset()
              }
            } 
        });
      }
    },
  }

}
</script>

<style>

</style>