<template>
  <main class="mt-1">
    <div class="container">
      <h2 class="text-center bg-info text-light" style="margin: 0;">{{$t('common.order_confirm_list')}}</h2>
      <table class="table table-bordered mt-1">
        <tbody>
        <tr class="table-dark text-white" :key="i" v-for="(myCart, i) in paymentInfoList"><!--  :key="i" v-for="(myCart, i) in myCartList" -->
          <td align="center" valign="middle" width="10%">
              <input type="radio"
                  :value="myCart.cart_id"
                  v-model="selectCartId"
                  @change="selectChange(myCart)"
              >
          </td>
          <td align="center" valign="top" width="40%">
            <div > 
              <img :src="`/download/${myCart.file_path}/${myCart.prod_id}/1/${myCart.file_name}`" style="max-width:200px; min-width: 150px; height:150px " alt="" />
            </div> 
            <!-- <img :src="`/download/${myCart.file_path}/${myCart.prod_id}/1/${myCart.file_name}`" style="width:200px" alt="" /> -->
            <tr>
              <td class="text-start pt-2" width="40%"> 
                <div class="text-start"><span class="text-white text-break span-font">{{myCart.prod_title}}</span></div>
                <div class="text-start pt-1"><span class="text-white text-break span-font">{{ myCart.ymd_format }}</span></div>
                <div class="text-start pt-1"><span class="text-info text-break span-font">[{{ $t("common.prod_price") }}]</span></div>
                <div class="text-start pt-1"><span class="text-info text-break span-font">{{ getCurrencyFormat(myCart.prod_price) }} {{ myCart.prod_price_tp}}</span></div>
              </td>
            </tr>
          </td>
          <td width="50%"> 
            <div v-if="this.optionList.length > 0"> 
              <div class="text-start pt-1"><span class="text-info span-font-lg">[{{$t("product.paid_option")}}]</span></div>
              <div class="text-white text-start pt-1" :key="i" v-for="(opt,i) in this.optionList">
                <span class="span-font"> {{opt.opt_name}} [{{ opt.participant_cnt }}]</span>
              </div>
            </div>
            <div>
              <!-- <div v-if="myCart.hotel_price != null"> 
                <div class="text-start pt-1"><span class="text-info span-font">[{{ $t("common.common_hotel_type") }}]</span></div>
                <div :key="k" v-for="(hotels, k) in hotelCartList.filter(c=> c.cart_id == myCart.cart_id)"> 
                  <div class="text-start pt-1" >
                    <span class="span-font">{{ hotels.hotel_type_nm }} : {{ hotels.personnel_cnt }}</span>
                  </div>
                </div>
              </div> -->
              <div class="text-start pt-1"><span class="text-info span-font-lg">[{{ $t("common.participation") }}]</span></div>
              <div v-if="myCart.adult_cnt > 0" class="text-start pt-1"><span class="span-font">* {{ $t("common.adult") }} : {{ myCart.adult_cnt }}</span></div>
              <div v-if="myCart.teen_cnt > 0" class="text-start pt-1"><span class="span-font">* {{ $t("common.teenager") }} : {{ myCart.teen_cnt }}</span></div>
              <div v-if="myCart.children_cnt > 0" class="text-start pt-1"><span class="span-font">* {{ $t("common.children") }} : {{ myCart.children_cnt }}</span></div>
              <div v-if="myCart.child_cnt > 0" class="text-start pt-1"><span class="span-font">* {{ $t("common.child") }} : {{ myCart.child_cnt }}</span></div>
              <div v-if="myCart.option_price > 0"> 
                <div class="text-start pt-1">
                  <div><span class="text-info span-font">[{{$t("common.opt_total_price")}}]</span></div>
                  <div class="pt-2"><span class="text-info span-font">{{getCurrencyFormat(myCart.option_price)}} {{myCart.prod_price_tp}}</span></div>
                </div>
              </div>
              <div class="text-start pt-1">
                <div><span class="fw-bold text-white span-font">[{{$t("product.total_product_price")}}]</span></div>
                <div><span class="fw-bold text-white span-font pt-2">{{getCurrencyFormat(myCart.cost_price + myCart.option_price + myCart.hotel_price)}} {{ myCart.prod_price_tp}}</span></div>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="!paymentFlag">
          <td colspan="3" class="text-center">{{ $t("common.mycart_product_no_date") }}</td>
        </tr> 
        </tbody>
      </table>
      <div v-if="!paymentFlag" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" :class="isMobile == true ? 'float-end btn btn-info btn-st-sm' : 'float-end btn btn-info btn-st-md'" @click="goToOrder">{{ $t("common.order_confirm_title") }}</button>
        <button :class="isMobile == true ? 'float-end btn btn-dark me-md-2 btn-st-sm' : 'float-end btn btn-dark me-md-2 btn-st-md'" type="button" @click="goPage">{{$t("common.home")}}</button>
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {swal} from '@/alert'
import { isDEmpty } from '@/is';
let timer = null
export default {
  // components : {
  //   OrderList
    
  // },
  
  data() {
    return {
      paymentInfoList : [],
      total: 1,
      totalPrice: 0,
      prodId : "",
      prodType : "",
      lanTp : "",
      cart_id : "",
      selectCartId : "",
      resParam : {},
      optionList : [],
      optionPriceTotal : 0,
      prod_unit : "",
      deal_bas_r : 0,
      isMobile : false,
      isLoading : true,
      hotelCartList : [],
      paymentFlag : true
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
      this.getPaymentList();
    }, 1000);
    
  },
  methods : {
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getPaymentList() {
      let prod_unit = ""
      if(this.resParam.lan_tp == 'CHN') {
        prod_unit = 'CNH'
      } else if(this.resParam.lan_tp == 'KOR') {
        prod_unit = 'KRW'
      } else {
        prod_unit = 'USD'
      }
      this.prod_unit = prod_unit
      this.paymentInfoList = await this.$api('/api/paymentInfoList', {param:[prod_unit,prod_unit,prod_unit,prod_unit,prod_unit,'T',this.user.mem_id, this.resParam.lan_tp]});
      this.optionList = await this.$api("/api/paymentOptionList", {param:[this.user.mem_id,'T']});
      this.hotelCartList = await this.$api("/api/hotelCartList", {param:[]});
      this.paymentFlag = isDEmpty(this.paymentInfoList) ? false : true
    },
    selectChange (obj) {
      this.cart_id = this.selectCartId
      this.prodId = obj.prod_id
      this.deal_bas_r = obj.deal_bas_r
    },
    goToOrder() {
      if(this.cart_id.length < 1) {
        return swal.fire({
                title: this.$t("common.payment_product_select"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
      } 
      let reqParam = {
        cart_id: this.cart_id, 
        prod_id : this.prodId,
        lan_tp : this.resParam.lan_tp,
        prod_unit : this.prod_unit,
        deal_bas_r : this.deal_bas_r
      }
      this.$router.push({path:'/order', state:{ reqParam : JSON.stringify(reqParam) }});
    },
    goPage() {
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
      // this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
    }

  }
}
</script>







