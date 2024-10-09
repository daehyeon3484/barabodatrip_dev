<template>
  <main class="mt-1">
    <div class="container">
      <h2 class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("common.notice")}}</h2>
      <div class="col-md-12 col-padding">
        <div class="card mt-1" style="border-radius: 8px;">
          <div class="card-body">
            <div class="mb-2 row"> 
              <label  class="col-md-2 col-form-label  fw-bold text-start font-md">{{$t("common.subject")}}</label>
              <input class="form-control mobile fw-bold text-start mobile-md" ref="title" v-model="qna_ttl_nm">
            </div>
            <div class="mb-2 row"> 
              <label  class="col-md-2 col-form-label  fw-bold text-start font-md">{{$t("mycart.content")}}</label>
              <!-- <div class="form-floating"> -->
                <textarea class="form-control font-sm" id="floatingTextarea2" ref="content" v-model="qna_content" style="height: 100px"></textarea>
              <!-- </div> -->
            </div>
            <div class="mb-2 row">
              <label  class="col-md-2 col-form-label  fw-bold text-start font-md">{{$t("common.gubun")}}</label>
              <select class="form-select font-md" v-model.trim="secret_yn" @change="secretChange($event)">
                <option value ='N'>{{$t('common.general_noti')}}</option>
                <option value = 'Y'>{{$t('common.secret_noti')}}</option>
              </select>
            </div>
            <div v-if="this.secret_yn == 'Y'" class="mb-2 row">
              <label  class="col-md-2 col-form-label  fw-bold text-start font-md">* {{$t("common.common_login_password")}}</label>
              
                <input type="password" class="form-control mobile-md" ref="mem_password" v-model.trim="qna_password" :placeholder="$t(`common.common_password_len`)" :aria-label="$t(`common.common_password_len`)">
              
              <div class="mt-2 text-start"><span class="text-danger span-font-sm">* {{ $t("common.common_password_len")}}</span></div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="col d-grid p-1">
            <button type="button" @click="qnaCreate" :class="isMobile == true ? 'btn btn-info col-auto btn-st-sm' : 'btn btn-info col-auto btn-st-md'">{{ this.resParam.type == 'REGISTER' ? $t("product.regist") : $t("common.common_update") }}</button>
            <button type="button" @click="qnaDelete" :class="isMobile == true ? 'btn btn-danger col-auto mt-2 btn-st-sm' : 'btn btn-danger col-auto mt-2 btn-st-md'">{{ $t("common.common_delete") }}</button>
            <button type="button" @click="goPage" :class="isMobile == true ? 'btn btn-dark col-auto mt-2 btn-st-sm' : 'btn btn-dark col-auto mt-2 btn-st-md'">{{ $t("common.page") }}</button>
          </div>
        </div>  
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>
<script>
import { isDEmpty } from '@/is';
import {swalTost, swal} from '@/alert'
let timer = null
export default {
  data() {
    return {
      lanTp : "",
      resParam : {},
      communitys : {},
      isMobile : false,
      qna_ttl_nm : "",
      qna_content : "",
      secret_yn : "N",
      qna_password : "",
      qna_id : "",
      isLoading : true
    };
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    if(this.user.mem_id == undefined) {
      swal.fire({
        title: this.$t("common.common_login_fail"),
        icon : 'warning',
        timer: 1500, 
        confirmButtonText: this.$t("common.common_close"),
      })
      this.$router.push({path:'/'});
    }
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    clearTimeout(timer)
  },
  created() {
    this.resParam = JSON.parse(history.state.reqParam)
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.isLoading = true
      if(this.resParam.type == 'modify') {
        this.getQnaInfo();
      }
    }, 1000);
  },
  methods: {
    async getQnaInfo () {
      this.qna_password = ""
      let qnas = await this.$api('/api/qnaDetail', {param : [this.resParam.lan_tp,this.resParam.qna_id, this.user.mem_id]})
        let qna = qnas[0]
        this.qna_ttl_nm = qna.qna_ttl_nm
        this.qna_content = qna.qna_content
        this.secret_yn = qna.secret_yn
        this.qna_password = this.resParam.qna_password
        this.qna_id = qna.qna_id
    },
    goPage() {
      let reqParam = {}
      reqParam = {
        lan_tp : this.resParam.lan_tp
      }
      this.$router.push({path : '/qna', state : {reqParam : JSON.stringify(reqParam)}})
    },
    secretChange(event) {
      if(event.target.value == 'Y') {
        this.qna_password = ""
      }
    },
    validateChk() {
      const regex = /^[0-9]+$/
      if(isDEmpty(this.qna_ttl_nm)) {
        this.$refs.title.focus()
        swal.fire({
          title: this.$t("common.common_subject_input"),
          icon : 'warning',
          timer: 3000, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      } 
      if(isDEmpty(this.qna_content)) {
        this.$refs.content.focus()
        swal.fire({
                  title: this.$t("common.common_inquiry_input"),
                  icon : 'warning',
                  timer: 3000, 
                  confirmButtonText: this.$t("common.common_close"),
        })
        return false
      }
      if(this.secret_yn == 'Y') {
        if(isDEmpty(this.qna_password)) {
          this.qna_password = ''
          this.$refs.mem_password.focus()
          swal.fire({
                  title: this.$t("common.common_login_password_input"),
                  icon : 'warning',
                  timer: 3000, 
                  confirmButtonText: this.$t("common.common_close"),
          })
          return false
        } else {
          if(this.qna_password.length != 4) {
            this.qna_password = ''
            this.$refs.mem_password.focus();
            swal.fire({
                  title: this.$t("common.common_password_len"),
                  icon : 'warning',
                  timer: 3000, 
                  confirmButtonText: this.$t("common.common_close"),
            })
            return false
          } else {
            if (!regex.test(this.qna_password)) {
              this.qna_password = ''
              this.$refs.mem_password.focus()
              swal.fire({
                  title: this.$t("common.common_password_len"),
                  icon : 'warning',
                  timer: 3000, 
                  confirmButtonText: this.$t("common.common_close"),
              })
              return false
            }
          }
        }
      }
      return true
    },
    async qnaCreate(){
      if(this.validateChk()) {
        
        swalTost.fire({
          title: this.resParam.type == 'REGISTER' ? this.$t("common.common_insert_confirm") : this.$t("common.common_update_confirm"),
          icon : 'question',
          timer:0, 
          confirmButtonText: this.resParam.type == 'REGISTER' ? this.$t("common.common_insert") : this.$t("common.common_update"),
          cancelButtonText: this.$t("common.common_cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let reg_date = this.$dateFormat('filedate')
            if(this.resParam.type == 'REGISTER') {
              const commSeq = await this.$api("/api/commSequences", {param : ['QNA','qna_id','6']});
              let data = {
                qna_id : commSeq[0].commSeq,
                mem_id : this.user.mem_id,
                qna_ttl_nm : this.qna_ttl_nm,
                qna_content : this.qna_content,
                secret_yn : this.secret_yn,
                answer_yn : 'N',
                lan_tp : this.resParam.lan_tp,
                qna_date : reg_date,
                reg_date : reg_date,
              }
              if(this.secret_yn == 'Y') {
                data = Object.assign(data, {qna_password : this.qna_password})
              }
              await this.$api('/api/qnaInsert', {param : [data]})
            } else {
              let data = {
                qna_ttl_nm : this.qna_ttl_nm,
                qna_content : this.qna_content,
                secret_yn : this.secret_yn,
                qna_password : this.qna_password,
                qna_date : reg_date,
                mod_date : reg_date,
              }
              await this.$api('/api/qnaUpdate', {param : [data, this.qna_id]})
            }
            let reqParam = {
              lan_tp : this.resParam.lan_tp
            }
            this.$router.push({path : '/qna', state : {reqParam : JSON.stringify(reqParam)}})
          }
        });
      }
      console.log("qnaCreate")
    },
    async qnaDelete() {
      await this.$api("/api/qnaDelete", {param : [this.qna_id]})
      let reqParam = {
        lan_tp : this.resParam.lan_tp
      }
      this.$router.push({path : '/qna', state : {reqParam : JSON.stringify(reqParam)}})
    }
  }
}
</script>



