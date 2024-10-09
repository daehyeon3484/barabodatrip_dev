<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info text-light">{{ $t("common.faq") }}{{ $t("common.list") }}</h5>
      <h6 v-else class="text-center bg-info text-light">{{ $t("common.faq") }}{{ $t("common.list") }}</h6>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2"> 
        <button type="button" :class="isMobile == 'true' ? 'float-end btn btn-info me-md-2 btn-st-sm' : 'float-end btn btn-info me-md-2 btn-st-sm'" @click="goQnaRegister('REGISTER')">{{ $t('product.regist') }}</button>
      </div>
      <table class="table table-hover table-sm table-striped table-bordered" style="cursor: pointer;">
        <thead>
          <tr class="table-danger">
            <th scope="col" :class="isMobile == true ? 'text-center font-sm' : 'text-center font-md'" align="center" valign="middle">{{ $t("common.subject") }}</th>
            <th scope="col" :class="isMobile == true ? 'text-center font-sm' : 'text-center font-md'" align="center" valign="middle">{{ $t("mycart.content") }}</th>
            <th scope="col" :class="isMobile == true ? 'text-center font-sm' : 'text-center font-md'" align="center" valign="middle">{{ $t("common.answer") }}</th>
          </tr>
        </thead>
        <tbody class="table-info">
          <tr :key="i" v-for="(qna, i) in qnaList">
            <td width="30%" class="text-break text-start font-sm" align="center" valign="middle">{{ qna.qna_ttl_nm }}</td>
            <td width="%" class="text-break text-start font-sm" align="center" valign="middle"><font-awesome-icon v-if="qna.secret_yn == 'Y'" :icon="['fas', 'lock']" /> {{qna.secret_yn == 'Y' && qna.mem_id != this.user.mem_id? $t("common.secret_noti_fail") : qna.qna_content}}</td>
            <td align="center" valign="middle" width="20%">
              <button v-if="qna.answer_yn == 'Y' && qna.secret_yn == 'Y'" type="button" :class="qna.mem_id != this.user.mem_id ? 'btn btn-secondary btn-sm col-auto text-nowrap btn-st-sm' : 'btn btn-success btn-sm col-auto text-nowrap btn-st-sm'"  @click="goAnswer(qna)" :disabled="qna.mem_id != this.user.mem_id ? true : false">{{qna.mem_id != this.user.mem_id ? $t('common.secret_noti') : $t('common.common_confirm')}}</button>
              <button v-if="qna.answer_yn == 'Y' && qna.secret_yn == 'N'" type="button" class="btn btn-success btn-sm col-auto text-nowrap btn-st-sm"  @click="goAnswer(qna)">{{$t('common.common_confirm')}}</button>
              <button v-if="qna.answer_yn == 'N' && qna.mem_id != this.user.mem_id" type="button" class="btn btn-secondary btn-sm col-auto text-nowrap btn-st-sm">{{$t('common.common_status_ing')}}</button>
              <button v-if="qna.answer_yn == 'N' && qna.mem_id == this.user.mem_id" type="button" class="btn btn-info btn-sm col-auto text-nowrap btn-st-sm" @click="goAnswer(qna)">{{$t("common.common_update")}}</button>
            </td>
          </tr>
          <tr v-if="qnaList.length < 1">
          <td colspan="5" :class="isMobile == true ? 'text-center font-md' : 'text-center font-lg'">{{ $t("common.community_nodata") }}</td>
          </tr>
        </tbody>
      </table>
      <font-awesome-icon :icon="['far', 'lock']" />
      <div v-if="qnaList.length < 5" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="col d-grid p-1">
          <button type="button" @click="goPage('home','1')" :class="isMobile == true ? 'btn btn-dark col-auto mt-2 btn-st-sm' : 'btn btn-dark col-auto mt-2 btn-st-md'">{{ $t("common.home") }}</button>
        </div>
      </div>  
    </div>
    <ModalAnswer :info="this.info"></ModalAnswer>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import ModalAnswer from '@/components/ModalAnswer.vue'
import { isDEmpty } from '@/is'
import {swal} from '@/alert'
let timer = null
export default {
  components : {
    ModalAnswer
  },
  data() {
    return {
      qnaList : [],
      info : {},
      lanTp : "",
      cou_id : "",
      resParam : {},
      isMobile : false,
      qna_id : "",
      qna_password : "",
      isLoading : true
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
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
      if(isDEmpty(this.qnaList)) {
        this.getQnaList();
      }
    }, 1000);
  },
  methods: {
    async getQnaList() {
      this.qnaList = await this.$api('/api/qnaList', {param : [this.resParam.lan_tp]})
    },
    goPage() {
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
      // this.$router.push({path: '/', query : {lan_tp : this.resParam.lan_tp}})
    },
    goAnswer(obj) {
      console.log("obj.answer_yn  :",obj.answer_yn)
      if(obj.answer_yn == 'Y') {
        if(obj.secret_yn == 'Y') {
          if(this.user.mem_id != obj.mem_id) {
            swal.fire({
                title: this.$t("common.secret_noti_fail"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
            })
            return false
          } else {
            this.info = {
              qna_id : obj.qna_id,
              mem_id : obj.mem_id,
              secret_yn : obj.secret_yn,
              lan_tp : this.resParam.lan_tp,
              qna_ttl_nm : obj.qna_ttl_nm
            }
          }
        } else {
          this.info = {
            qna_id : obj.qna_id,
            mem_id : obj.mem_id,
            secret_yn : obj.secret_yn,
            lan_tp : this.resParam.lan_tp,
            qna_ttl_nm : obj.qna_ttl_nm
          }
        }
        
      } else {
        this.qna_id = obj.qna_id
        this.mem_id = 
        this.qna_password = obj.qna_password
        this.goQnaRegister('modify')
      }
    },
    goQnaRegister(type) {
      if(isDEmpty(this.user.mem_id)) {
        swal.fire({
          title: this.$t("common.common_login_fail"),
          icon : 'warning',
          timer: 1500, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      }
      let reqParam = {
        lan_tp : this.resParam.lan_tp,
        type : type,
      }
      if(type == 'modify') {
        if(this.qna_password != '') {
          reqParam = Object.assign(reqParam, {qna_password : this.qna_password})
        }
        reqParam = Object.assign(reqParam, {qna_id : this.qna_id})
      }
      this.$router.push({path : '/qnaCreate', state : {reqParam : JSON.stringify(reqParam)}})
    }
  }
}
</script>







