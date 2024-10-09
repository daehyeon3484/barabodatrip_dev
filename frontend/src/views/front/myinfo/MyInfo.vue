<template>
  <main class="mt-1" >
    <div class="container">
      <h2 class="text-center bg-info text-light">{{$t("myinfo.title")}}</h2>
      <div v-if="myInfoList.length > 0"> 
        <table :class="this.tableClass">
          <tbody>
            <tr :class="this.tableClass" :key="i" v-for="(myInfo, i) in myInfoList">
              <td width="15%"   line-height="0px" class="" align="center" valign="middle">
                  <img class="myinfo-img" :src="`/download/${myInfo.file_path}/${myInfo.prod_id}/1/${myInfo.file_name}`" alt="" />
              </td>
              <td width="%" class="" align="center" valign="middle">
                <div class="mobile-sm text-white fw-bold text-start pt-2 text-break">{{myInfo.prod_title}}</div>
                <div class="mobile-sm text-white fw-bold text-start pt-2 text-break">{{myInfo.ymd_format}}</div>
                <div class="mobile-sm text-white fw-bold text-start pt-2">{{ $t("common.pay_type") }} : {{ myInfo.pay_type_nm }}</div>
                <div class="mobile-sm text-white fw-bold text-start pt-2">{{getCurrencyFormat(myInfo.reqamt)}} {{ myInfo.prod_price_tp }}</div>
                <div class="mobile-sm text-white fw-bold text-start pt-2">{{$t("common.payment_date")}} : {{myInfo.mod_date}}</div>
                <div v-if="myInfo.txn_type == 'R'" class="mobile-sm text-danger fw-bold text-start pt-2">{{$t("common.common_pay_cancel")}}</div>
                <div v-else-if="myInfo.txn_type == 'PR'" class="mobile-sm text-danger fw-bold text-start pt-2">{{$t("common.payment_cancel_noti")}}</div>
                <div v-else class="mobile-sm text-danger fw-bold text-start pt-2">{{ $t("common.common_pay_complete")}}</div>
              </td>
              <td align="center" valign="middle" width="20%"> 
                <!-- <button type="button" class="btn btn-warning  col-auto text-nowrap btn-st-sm" @click="goUploadList(myInfo)">QR</button> -->
                <!-- <button type="button" class="btn  btn-info text-nowrap" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="goUploadList(myInfo)">QR</button> -->
                <button type="button" :class="isMobile == 'true' ? 'btn btn-warning btn-sm col-auto text-nowrap btn-st-sm' : 'btn btn-warning btn-sm col-auto text-nowrap btn-st-md'" @click="goUploadList(myInfo)">{{ $t('common.common_customer_file_list') }}</button>
                <button v-if="myInfo.txn_type != 'R'" type="button"  :class="isMobile == 'true' ? 'btn  btn-danger text-nowrap col-auto btn-st-sm' : 'btn  btn-danger text-nowrap col-auto btn-st-md'" @click="fnSetChange(myInfo, 'cancel_req')">{{$t("common.common_cancel")}}</button>
              </td>
                
              
            </tr> 
            <!-- <tr>
              <td colspan="3" class="text-center text-white"><p>{{ $t("common.common_payment_not") }}</p></td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div v-if="myInfoEventList.length > 0"> 
        <table :class="this.tableClass1">
          <tbody>
            <tr><td colspan="3" class="text-center table table-danger">{{ $t("common.event_title") }}</td></tr>
            <tr :class="this.tableClass1" :key="i" v-for="(eventInfo, i) in myInfoEventList">
              <td width="15%"   line-height="0px" class="" align="center" valign="middle">
                  <img class="myinfo-img" :src="`/download/EVENT/${eventInfo.file_path}/${eventInfo.event_id}/1/${eventInfo.file_name}`" alt="" /> 
              </td>
              <td width="%" class="" align="center" valign="middle">
                <div class="mobile-sm text-white text-start mt-2 text-break">{{eventInfo.event_title}}</div>
                <div class="mobile-lg text-white text-start mt-2 p-modal-myinfo">{{eventInfo.ymd_format}}</div>
                <!-- <p class="text-dark fw-bold text-start"></p> -->
                <!-- <div v-html="eventInfo.event_desc"></div> -->
              </td>
              <td width="20%" align="center" valign="middle">
                <!-- <button type="button" class="btn btn-sm btn-warning text-nowrap btn-st-md" @click="goUploadList(eventInfo)">QR</button> -->
                <!-- <button type="button" class="btn  btn-info text-nowrap" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="goUploadList(eventInfo)">QR</button> -->
                <button type="button" :class="isMobile == 'true' ? 'btn btn-sm btn-info text-nowrap btn-st-sm' : 'btn btn-sm btn-info text-nowrap btn-st-md'" @click="goUploadList(eventInfo)">{{ $t('common.common_customer_file_list') }}</button>
                <!-- <button type="button" class="btn  btn-danger text-nowrap btn-fs" @click="fnSetChange(eventInfo, 'cancel_req')">{{$t("common.common_cancel")}}</button> -->
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
      <div v-if="myInfoList.length < 1 && myInfoEventList.length < 1" :class="isMobile == true ? 'mobile-md' : ''">{{ $t("common.myinfo_no_data") }}</div>
      <div v-if="myInfoEventList.length < 1 || myInfoList.length < 1 " :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button :class="isMobile == true ? 'float-end btn btn-info me-md-2 btn-st-sm' : 'float-end btn btn-info me-md-2 btn-st-md'" type="button" @click="goPage">{{$t("common.home")}}</button>
      </div>
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">QR</h1>
              <button type="button" class="btn-close btn-st-sm" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <vue-qrcode :value="`${this.url}?mem_id=${this.mem_id}&cart_id=${this.cart_id}&prod_id=${this.param_id}&type=${this.type}`" ></vue-qrcode>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary stn-st-sm" data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {isDEmpty} from '@/is';
import {swal} from '@/alert'
let timer = null
export default {
  data() {
    return {
      myInfoList : [],
      myInfoEventList : [],
      optName : "",
      prod_id : "",
      mem_id : "",
      cart_id  :"",
      tableClass : "",
      tableClass1 : "",
      url : 'https://barabodatrip.com/myInfoFileList',
      resParam : {},
      isMobile : false,
      param_id : "",
      type : "",
      isLoading : true
    }
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
        timer: 3000, 
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
      if(isDEmpty(this.myInfoList)) {
        this.myInfo()
      }
    }, 1000);
  },
  methods: {
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async myInfo() {
      this.myInfoList = await this.$api("/api/myInfoList", {param:[this.user.mem_id]});
      this.myInfoEventList = await this.$api("/api/myinfoEventList", {param:[this.user.mem_id, 'Y']});
      this.tableClass = this.myInfoList.length < 1 ? 'table' : 'table table-dark'
      this.tableClass1 = this.myInfoEventList.length < 1 ? 'table' : 'table table-dark'
    },
    goUploadList(info) {
      console.log("goUploadList")
      if(isDEmpty(info.prod_id)) {
        this.type = 'event'
        this.param_id = info.event_id
        this.cart_id = info.cart_id
        this.mem_id = info.mem_id
      } else {
        this.type = 'product'
        this.param_id = info.prod_id
        this.cart_id = info.cart_id
        this.mem_id = info.mem_id
      }
      this.$router.push({path:"/myInfoFileList", query :{param_id : this.param_id, mem_id : this.mem_id, cart_id : this.cart_id, type : this.type}});
    },
    goOrderCencel(order_id) {
      console.log(order_id);
    },
    async fnSetChange(info, type) {
      if(type == 'qr') {
        this.prod_id = info.prod_id;
        this.mem_id = info.mem_id
      } else if(type == 'file') {
        this.prod_id = info.prod_id
        this.mem_id = info.mem_id 
        this.cart_id = info.cart_id
      } else {
        //이메일 전송
        info = Object.assign(info, {user_cancel_type : 'PR'})
        info = Object.assign(info, {lan_tp : this.resParam.lan_tp})
        info = Object.assign(info, {email_type : 'payment_cancel'})
        await this.$api('/smtp/email', {info})
        swal.fire({
          title: this.$t("common.order_cancel_request_msg"),
          icon : 'success',
          timer: 3000, 
          confirmButtonText: this.$t("common.common_confirm"),
        })
        this.myInfo()
      }
    },
    goPage(){
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
      // this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
    }
  }
}
</script>
<style scoped>
  .btn{ width:70px; height:30px; background-color: #222222; color:white; display:flex; justify-content: center; align-items: center; margin-top:10px; cursor:pointer; }
  .btn-danger{
    background-color: red;
    color: white;
  }
  img{ margin-top:10px; }


.qrcode {
  display: inline-block;
  font-size: 0;
  margin-bottom: 0;
  position: relative;
}

.qrcode__image {
  background-color: #fff;
  border: 0.25rem solid #fff;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 15%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 15%;
}

</style>






