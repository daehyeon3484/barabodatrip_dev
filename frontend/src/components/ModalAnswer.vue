<template>
  <div :class="isMobile == true ? 'mobile-lg' : ''"> 
    <button class="float-end btn btn-outline-warning me-md-2 text-light" hidden type="button" id="modalAnsewerBtn" data-bs-toggle="modal" data-bs-target="#staticAnsewer">test</button> 
    <!-- Modal -->
    <div class="modal fade modal-md" id="staticAnsewer" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticAnsewerLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div :class="isMobile == true ? 'mobile fw-bold text-start' : 'fw-bold text-start'" id="staticAnsewerLabel">{{ $t("common.faq") }}</div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2 row">
              <label  class="col-md-2 col-form-label  fw-bold text-start font-md">{{$t("common.subject")}}</label>
              <!-- <div :class="isMobile == true ? 'mobile fw-bold text-start' : 'fw-bold text-start'" style="font-weight: 100;" id="staticAnsewerLabel">{{ this.infos.qna_ttl_nm }}sdfffffffffffffffffffffffffffffffffffffffffffffffffff</div> -->
              <div class="col-md-10"> 
                <div class="col-form-label  fw-bold text-start font-md" style="height: auto;background: #EDF0F5;">{{ this.infos.qna_ttl_nm }}</div>
              </div>
            </div>
            <div v-if="this.info.secret_yn == 'Y'" class="mb-2 row">
              <label  class="col-form-label  fw-bold text-start font-md">* {{$t("common.common_login_password")}}</label>
              <div class="input-group mb-3">
                <input type="password" class="form-control mobile-md" ref="mem_password" v-model.trim="qna_password" :placeholder="$t(`common.common_password_len`)" :aria-label="$t(`common.common_password_len`)" @keydown.enter="getQnaDetail">
                <button class="btn btn-outline-secondary btn-st-sm" type="button" @click="getQnaDetail">{{ $t("common.common_confirm") }}</button>
              </div>
              <div v-if="this.memPassMsg != ''" class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ this.memPassMsg}}</span></div>
            </div>
            <div v-if="this.viewFlag"> 
              <div class="mb-2 row">
                <span class="icon">Q</span>
                <span class="col-form-label  fw-bold text-start font-md">{{$t("common.common_reg_date")}} : {{ qnas.qna_ymd_format }}</span>
                <div class="col-form-label  fw-bold text-start font-md" style="height: 100px;background: #EDF0F5;">{{ qnas.qna_content }}</div>
                <!-- <div class="content-area">
                  <div style="height: 500px;background: #EDF0F5;">임시 영역</div>
                </div> -->
              </div>
              <div class="mb-2 row">
                <span class="icon answer">A</span>
                <span class="col-form-label  fw-bold text-start font-md">{{$t("common.common_reply_date")}} : {{ qnas.answer_ymd_format }}</span>
                <div class="col-form-label  fw-bold text-start font-md" style="height: 100px;background: #EDF0F5;">{{ qnas.qna_answer_content }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="modalClose" type="button" :class="isMobile == true ? 'btn btn-secondary mobile-ss btn-st-sm' : 'btn btn-secondary btn-sm btn-st-md'" data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>          
</template>
<script>
import { isDEmpty } from '@/is'
// import {swal} from '@/alert'
export default {
  data() {
    return {
      infos : {},
      qnas : {},
      isMobile : false,
      qna_password : "",
      memPassMsg : "",
      viewFlag : false
    }
  },
  props : {
    info : Array
  },
  watch:{
    info: {
      handler( newVal, oldVal ){
        console.log( 'newVal:', newVal, 'oldVal:', oldVal )
        this.infos = newVal
        this.getPopup()
        this.qna_password = ""
        this.viewFlag = false
        this.memPassMsg = ""
        this.qnas = {}
        if(this.infos.secret_yn != 'Y') {
          this.getQnaDetail()
        }
      },
      // deep: true
    }
  },
  mounted() {
    this.isMobile = this.$isMobile()
  },
  unmounted() {
  },
  created() {
  },
  methods : {
    getPopup() {
      let modalBtn = document.querySelector("#modalAnsewerBtn")
      modalBtn.click()
      
    },
    validationChk() {
      const regex = /^[0-9]+$/
      this.memPassMsg = ""
      if(isDEmpty(this.qna_password)) {
        this.$refs.mem_password.focus();
        this.memPassMsg = this.$t('common.common_login_password_input')
        return false
      } else {
        if(this.qna_password.length != 4) {
          this.qna_password = ''
          this.$refs.mem_password.focus();
          this.memPassMsg = this.$t('common.common_password_len')
          return false
        }
        if(regex){
          if (!regex.test(this.qna_password)) {
            this.qna_password = ''
            this.$refs.mem_password.focus()
            this.memPassMsg = this.$t("common.common_password_number")
            return false
          }
        }
      }
      return true
    },
    async getQnaDetail(){
      if(this.info.secret_yn == 'Y') {
        if(this.validationChk()) {
          let qnas = await this.$api('/api/qnaChkDetail', {param : [this.infos.lan_tp,this.infos.qna_id, this.infos.mem_id,this.qna_password]})  
          if(!isDEmpty(qnas)) {
            this.qnas = qnas[0]
            this.viewFlag = true
          } else {
            this.memPassMsg = this.$t("common.common_login_password_fail")
            return false
          }
        }
      } else {
        let qnas = await this.$api('/api/qnaDetail', {param : [this.infos.lan_tp,this.infos.qna_id, this.infos.mem_id]})
        this.qnas = qnas[0]
        this.viewFlag = true
      }
      
    },
  }

}
</script>

<style>

</style>