<template>
  <main class="mt-1">
    <div class="container">
      <h4 v-if="!isMobile" class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("common.order_confirm_title")}}</h4>
      <h6 v-else class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("common.order_confirm_title")}}</h6>
      <div class="table-responsive mt-2 mt-1">
        <table class="table table-bordered mt-1">
          <tbody>
            <tr class="table-dark text-white"><!--  :key="i" v-for="(myCart, i) in myCartList" -->
              <td align="center" valign="middle">
                <div > 
                  <img :src="`/download/${products.file_path}/${products.prod_id}/1/${products.file_name}`" style="max-width:200px; min-width: 150px; height:150px " alt="" />
                </div> 
                <tr>
                  <td class="text-start pt-2"> 
                    <div class="text-start"><span class="text-white text-break span-font">{{products.prod_title}}</span></div>
                    <div class="text-start pt-1"><span class="text-white text-break span-font">{{ products.ymd_format }}</span></div>
                    <div class="text-start pt-1"><span class="text-info text-break span-font">{{ $t("common.prod_price") }} : {{ getCurrencyFormat(products.prod_price) }} {{ products.prod_price_tp}}</span></div>
                  </td>
                </tr>
              </td>
              <td width="50%">
                <div v-if="optionFlag"> 
                  <div class="text-start pt-1"><span class="text-info span-font-lg">[{{$t("product.paid_option")}}]</span></div>
                  <div class="text-white text-start pt-1" :key="i" v-for="(opt,i) in this.optionList">
                    <span class="span-font"> {{opt.opt_name}} [{{ opt.participant_cnt }}]</span>
                  </div>
                </div>
                <div>
                  <!-- <div class="text-start pt-1"><span class="text-info span-font">[{{ $t("common.common_hotel_type") }}]</span></div>
                  <div :key="k" v-for="(hotels, k) in hotelCartList.filter(c=> c.cart_id == products.cart_id)"> 
                    <div class="text-start pt-1" >
                      <span class="span-font">{{ hotels.hotel_type_nm }} : {{ hotels.personnel_cnt }}</span>
                    </div>
                  </div> -->
                  <div class="text-start pt-1"><span class="text-info span-font-lg">[{{ $t("common.participation") }}]</span></div>
                  <div v-if="products.adult_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.adult") }} : {{ products.adult_cnt }}</span></div>
                  <div v-if="products.teen_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.teenager") }} : {{ products.teen_cnt }}</span></div>
                  <div v-if="products.children_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.children") }} : {{ products.children_cnt }}</span></div>
                  <div v-if="products.child_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.child") }} : {{ products.child_cnt }}</span></div>
                  <div v-if="products.option_price > 0"> 
                    <div class="text-start pt-1">
                      <span class="text-info span-font">
                        {{$t("common.opt_total_price")}} : {{getCurrencyFormat(products.option_price)}} {{products.prod_price_tp}}
                      </span>
                    </div>
                  </div>
                  <div class="text-start pt-1">
                    <span class="fw-bold text-white span-font">
                      {{$t("product.total_product_price")}} : {{getCurrencyFormat(products.cost_price + products.option_price + products.hotel_price)}} {{ products.prod_price_tp}}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="products.length < 1">
              <td colspan="3" class="text-center">{{ $t("common.mycart_product_no_date") }}</td>
            </tr> 
          </tbody>
        </table>
      </div>
      <h4 v-if="!isMobile" class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{ $t("order.order_info") }}</h4>
      <h6 v-else class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{ $t("order.order_info") }}</h6>
      <div class="mb-3 pt-3 row">
        <label  class="col-md-3 col-form-label  fw-bold text-start font-md">{{ $t("order.name") }}</label>
        <div class="col-md-9">
          <input type="text" class="form-control mobile-md" v-model="this.mem_nm" readonly>
        </div>
      </div>
      <div class="mb-3 row">
        <label  class="col-md-3 col-form-label  fw-bold text-start font-md">{{$t("order.tel")}}</label>
        <div class="col-md-9">
          <input type="text" class="form-control mobile-md" v-model="this.tel" readonly>
        </div>
      </div>
      <div class="mb-3 row">
        <label  class="col-md-3 col-form-label  fw-bold text-start font-md">{{$t("order.email")}}</label>
        <div class="col-md-9">
          <input type="text" class="form-control mobile-md" v-model="this.email">
        </div>
      </div>
      <div v-if="this.resParam.lan_tp != 'CHN'" class="mb-3 row">
        <label  class="col-md-3 col-form-label  fw-bold text-start font-md">{{$t("common.area_info")}}</label>
        <div class="col-md-9">
          <input type="text" class="form-control mobile-md" v-model="this.buyr_area" :placeholder="$t(`common.area_info_input`)" :aria-label="$t(`common.area_info_input`)">
        </div>
      </div>
      
      <div class="mb-3 row">
        <label  class="col-md-3 col-form-label text-start text-dark fw-bold font-md">{{$t('common.pay_type')}}</label>
        <div class="col-md-9">
          <select class="form-select font-md" v-model.trim="payType">
              <option v-if="payTypeFlag" value="P">{{$t('common.pay_paypal')}}</option>
              <option v-if="!payTypeFlag" value="A">{{$t('common.pay_alipay')}}</option>
              <option v-if="!payTypeFlag" value="W">{{$t('common.pay_wechatpay')}}</option>
            <!-- <option v-if="this.resParam.lan_tp == 'CHN'" value="U">{{$t('common.pay_Unionpay')}}</option> -->
          </select>
        </div>
      </div> 
      <div v-if="this.payType != 'U'">
        <!-- alipay, wechatpay -->
        <form id="myForm" name="myForm" method="POST" action="https://online.funpay.co.kr/payment/payment.icb">
        <!-- <form id="myForm" name="myForm" method="POST" action="https://onlinetest.funpay.co.kr/payment/payment.icb"> -->
          <input type="hidden" id="ver" name="ver" :value="this.data.ver">
          <input type="hidden" id="mid" name="mid" :value="this.data.mid">
          <input type="hidden" id="mname" name="mname" :value="this.data.mname">
          <input type="hidden" id="servicetype" name="servicetype" :value="this.data.servicetype">
          <input type="hidden" id="refno" name="refno" :value="this.data.refno">
          <input type="hidden" id="reqcur"  name="reqcur"   :value="this.data.reqcur">
          <input type="hidden" id="reqamt"  name="reqamt"   :value="this.data.reqamt">
          <input type="hidden" id="buyername"  name="buyername"   :value="this.data.buyername">
          <input type="hidden" id="tel"  name="tel"   :value="this.data.tel">
          <input type="hidden" id="email"  name="email"   :value="this.data.email">
          <input type="hidden" id="product"  name="product"   :value="this.data.product">
          <input type="hidden" id="trade_information"  name="trade_information"   :value="this.data.trade_information">
          <input type="hidden" id="refer_url"  name="refer_url"   :value="this.data.refer_url">
          <input type="hidden" id="returnurl"  name="returnurl"   :value="this.data.returnurl">
          <input type="hidden" id="statusurl"  name="statusurl"   :value="this.data.statusurl">
          <input type="hidden" id="reqtype"  name="reqtype"   :value="this.data.reqtype">
          <input type="hidden" id="restype"  name="restype"   :value="this.data.restype">
          <input type="hidden" id="fgkey"  name="fgkey"   :value="this.data.fgkey">
          <input type="hidden" id="expiretime"  name="expiretime"   :value="this.data.expiretime">
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button :class="isMobile == true ? 'float-end btn btn-danger me-md-2 btn-st-md' : 'float-end btn btn-danger me-md-2'" type="button" @click="goDataFormat">{{$t("common.common_pay")}}</button>
            <button type="button" :class="isMobile == true ? 'float-end btn btn-dark btn-st-md'  : 'float-end btn btn-dark'" @click="goPage">{{$t("common.home")}}</button>
          </div>
        </form>
      </div>
      <div v-else-if ="this.payType == 'U'">
        <!-- unionpay -->
        <form id="uniForm" name="uniForm" method="POST" accept-charset="EUC-KR" action="https://pay.billgate.net/credit/abroad/certify.jsp">
        <!-- <form id="uniForm" name="uniForm" method="POST" accept-charset="EUC-KR" action="https://tpay.billgate.net/credit/abroad/certify.jsp"> -->
          <input type="hidden" id="SERVICE_ID" name="SERVICE_ID" :value="this.unionpay.SERVICE_ID">
          <input type="hidden" id="SERVICE_CODE" name="SERVICE_CODE" :value="this.unionpay.SERVICE_CODE">
          <input type="hidden" id="SERVICE_TYPE" name="SERVICE_TYPE" :value="this.unionpay.SERVICE_TYPE">
          <input type="hidden" id="ORDER_ID" name="ORDER_ID" :value="this.unionpay.ORDER_ID">
          <input type="hidden" id="ORDER_DATE" name="ORDER_DATE" :value="this.unionpay.ORDER_DATE">
          <input type="hidden" id="AMOUNT"  name="AMOUNT"   :value="this.unionpay.AMOUNT">
          <input type="hidden" id="RETURN_URL"  name="RETURN_URL"   :value="this.unionpay.RETURN_URL">
          <input type="hidden" id="ITEM_CODE"  name="ITEM_CODE"   :value="this.unionpay.ITEM_CODE">
          <input type="hidden" id="ITEM_NAME"  name="ITEM_NAME"   :value="this.unionpay.ITEM_NAME">
          <input type="hidden" id="USER_ID"  name="USER_ID"   :value="this.unionpay.USER_ID">
          <input type="hidden" id="USER_NAME"  name="USER_NAME"   :value="this.unionpay.USER_NAME">
          <input type="hidden" id="USER_EMAIL"  name="USER_EMAIL"   :value="this.unionpay.USER_EMAIL">
          <input type="hidden" id="WEBAPI_FLAG"  name="WEBAPI_FLAG"   :value="this.unionpay.WEBAPI_FLAG">
          <input type="hidden" id="USING_TYPE"  name="USING_TYPE"   :value="this.unionpay.USING_TYPE">
          <input type="hidden" id="CURRENCY"  name="CURRENCY"   :value="this.unionpay.CURRENCY">
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button :class="isMobile == true ? 'float-end btn btn-danger me-md-2 btn-st-sm' : 'float-end btn btn-danger me-md-2 btn-st-md'" type="button" @click="goDataFormat">{{$t("common.common_pay")}}</button>
            <button type="button" :class="isMobile == true ? 'float-end btn btn-dark btn-st-sm' : 'float-end btn btn-dark btn-st-md'" @click="goPage">{{$t("common.home")}}</button>
          </div>
        </form>
      </div> 
      <!-- <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="float-end btn btn-danger me-md-2" type="button" @click="orderConfirm(this.mem_seq, this.type, this.trSeq, this.mem_seq, `${idx+1}`, this.file_seq_arr[`${idx}`])">결재하기</button>
        <button type="button" class="float-end btn btn-dark" @click="cencel">취소</button>
      </div> -->
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {generateSessionStorage} from '@/storage'
import { isDEmpty } from '@/is'
const sessionStorage = generateSessionStorage()
import {swalTost, swal} from '@/alert'
// import {isDEmpty} from '@/is';
let timer = null
export default {
  data() {
    return {
      productList : [],
      index : 0,
      cnt : 0, 
      productTotal: 0,
      total: 1,
      totalPrice: 0,
      trSeq : "",
      trTp : "",
      // allChecked: false,
      cart_seq : [],
      total_price_str : "",
      order_cnt : 0,
      phone_kind:"010",
      phone_number : "",
      tel_kind : "",
      email_domain : "",
      domain : "",
      email_addr : "",
      message: "",
      inputText : "",
      sortSeq : "",
      userInfo : {
        mem_nm_arr : [],
      },
      memberInfo : {mem_seq : ""},
      productImageList : [],
      passImgList : [
        {
          file_seq : "",
          tr_seq : "",
          mem_nm : "",
          mem_id : "",
          file_type : "",
          file_category : "",
          file_path : "",
          file_name :"",
          sort_order : "",
        }
      ],
      products : {},
      type : "passport",
      memSeq : "",
      lanTp : "",
      resParam : {},
      resType : "",
      reservInfoList : [],

      ver : "", // 상용 V2
      mid : "",
      mname : "",
      servicetype : "",
      refno : "", //out_trade_no, // 거래키 생성
      reqcur : "", // 결재통화
      reqamt : 0, // 결재총 금액
      vat : 0, // 부가세
      buyername : '', 
      tel : "",
      email : "",
      product : "", // 상품명
      trade_information : "", 
      refer_url : "",
      returnurl : "", 
      statusurl : "", 
      fgkey : "", 
      expiretime : "", 
      reqtype : "", // 요청타입 (P: PC, M: M
      restype : "", // 응답타입 (PAGE or JSON) 
      data : {},
      payType : "A",
      orderId : "",
      mem_id : "",
      pay_type : "",
      prod_total_cnt : "",
      prod_option : "",
      pay_yn : "",

      unionpay : {},
      SERVICE_ID : "",
      SERVICE_CODE : "",
      SERVICE_TYPE : "",
      ORDER_ID : "",
      ORDER_DATE : "",
      AMOUNT : "",
      RETURN_URL : "",
      ITEM_CODE : "",
      ITEM_NAME : "",
      USER_NAME : "",
      USER_EMAIL : "",
      WEBAPI_FLAG : "",
      USING_TYPE : "",
      CURRENCY : "",
      popup : null,
      gx_web_client : "",
      buyr_area : "",
      mem_nm : "",
      optionPriceTotal : 0,
      origin_total_price : 0,
      isMobile : false,
      payTypeFlag : false,
      isLoading : true,
      hotelCartList : [],
      optionFlag : false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  watch:{
    email: {
      handler( newVal, oldVal ){
        console.log(newVal, oldVal)
        if(newVal != oldVal) {
          this.emailChange(newVal)
        }
        
      },
      // deep: true
    },
  },
  mounted() {
    if(this.user.mem_id == undefined) {
      alert("로그인을 해야 이용할 수 있습니다.");
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
    this.payTypeFlag = this.resParam.lan_tp == 'CHN' ? false : true
    this.payType = this.payTypeFlag == true ? 'P' : 'A'
    timer = setTimeout(() => {
      this.isLoading = true
      this.getProductList();
      this.getProductImage();
      this.getPassPortImgage();
      this.getReservInfoList()
    }, 1000);
  },
  methods: {
    
    async getPassPortImgage() {
      
      let passImgs = await this.$api("/api/passPortList",{param : [this.resParam.prod_id, this.user.mem_id, this.resParam.cart_id]});
      this.passImgList = passImgs;
      // this.reservInfoList = await this.$api('/api/reservInfoList', {param : ['T',this.resParam.prod_id,this.user.mem_id]})
      // this.reservInfoList = reservInfoList
      
    },
    async getProductImage() {
      this.productImageList = await this.$api("/api/imageList",{param:[this.resParam.prod_id]});
    },

    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getProductList() {
      let prod_unit = this.resParam.prod_unit
      let productList = await this.$api('/api/mycartList1', {param:[prod_unit,prod_unit,prod_unit,prod_unit,prod_unit,this.resParam.cart_id,this.resParam.lan_tp]});
      this.optionList = await this.$api("/api/optionDtl", {param:[prod_unit, this.user.mem_id, this.resParam.cart_id]});
      // this.hotelCartList = await this.$api("/api/hotelCartList", {param:[]});
      
      this.optionFlag = isDEmpty(this.optionList) ? false : true
      if(productList.length > 0) {
        this.products = productList[0]
      }
      this.optionPriceTotal = 0
      this.optionPriceTotal = this.products.option_price
      this.totalPrice = this.products.cost_price
      this.origin_total_price =  this.products.origin_cost_price + this.products.origin_opt_price
      
    },
    async getReservInfoList() {
      // T : 임시저장 상태
      let reservInfoList = await this.$api('/api/reservInfoList', {param : ['N','T',this.resParam.prod_id,this.user.mem_id, this.resParam.cart_id]})
      this.reservInfoList = reservInfoList
      this.tel = reservInfoList[0].tel
      this.email = reservInfoList[0].email
      this.orderId = reservInfoList[0].order_id
      this.mem_nm = reservInfoList[0].mem_nm
      
      console.log(this.reservInfoList )
    }, 
    async emailChange(email) {
      await this.$api("/api/orderUpdate", {param : [{email : email}, this.orderId]});
    },
    async goDataFormat() {
      // alipay, wechatpay 한화 300만원 이상 결제 안되게 처리
      // let currPrice = 16256
      // if(this.tel == "") {
      //   this.$swal(this.$t("common.order_tel_input"))
      //   return this.$refs.tels.focus()
      // }
      if(this.payType == "") {
        return swal.fire({
                  title: this.$t("common.pay_choice_input"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
      }
      // if(this.totalPrice > currPrice) {
      //   return this.$swal(this.$t("common.order_curr_price_fail"))
      // }
      // Alipay, wechatpay
      let reqType = ""
      let resType = ""
      let osType = false
      if(this.$isMobile()) { //mobile
        reqType = "M"
        if(this.payType == 'A' || this.payType == 'P'){
          resType = "PAGE"
        } else {
          resType = "JSON"
        }
      } else { // pc
        reqType = "P"
        resType = "PAGE"
      }
      let country_code = ""
      if(this.payType == 'P') {
        let locale = navigator.language || navigator.userLanguage
        country_code = locale.substring(locale.length,locale.length-2)
      }
      let orderInfo = {}
      let participant_cnt = this.products.adult_cnt + this.products.teen_cnt + this.products.children_cnt + this.products.child_cnt
      if(this.payType != 'U') {
        orderInfo = {
          costPrice : this.totalPrice,
          buyername : this.mem_nm,
          tel : this.tel,
          email : this.email,
          prodTitle : this.products.prod_title,
          prodId : this.products.prod_id,
          prodType : this.products.prod_type,
          memId : this.user.mem_id,
          inventoryCnt : this.products.inventory_cnt,
          participant_cnt : participant_cnt,
          cartId : this.resParam.cart_id,
          orderId : this.orderId,
          locale : country_code,
          reqType : reqType,
          resType : resType,
          // buyr_area : this.buyr_area,
          buyr_area : 'inchon',
          lanTp : this.resParam.lan_tp,
          osType : osType,
          origin_total_price : this.origin_total_price
        } 
        console.log(orderInfo)
        this.data = await this.$api(`payment/${this.payType}`,{orderInfo})
      } else {
        // Unionpay 
        orderInfo = {
          amount : this.totalPrice,
          prodId : this.products.prod_id,
          prodTitle : this.products.prod_title,
          memId : this.user.mem_id,
          memNm : this.mem_nm,
          email : this.email,
          total : this.products.cnh_price,
          payType : this.payType,
          inventoryCnt : this.products.inventory_cnt,
          cartId : this.resParam.cart_id,
          lanTp : this.resParam.lan_tp,
          orderId : this.orderId,
          locale : sessionStorage.get('locale'),
          reqType : reqType,
          resType : resType
        }
        // 결제창 호출 전 서버 호출
        this.unionpay = await this.$api(`payment/${this.payType}`,{orderInfo})
      }
      // if(this.resParam.lan_tp != 'CHN' && isDEmpty(this.buyr_area)) {
      //   return swal.fire({
                  //   title: this.$t("common.area_info_input"),
                  //   icon : 'warning',
                  //   timer: 1500, 
                  //   confirmButtonText: this.$t("common.common_close"),
                  // })
      // } else {
        this.orderConfirm(this.data)
      // }
    },
    async orderConfirm(orderInfo) {
      console.log(orderInfo)
      // this.unionpay = await this.$api(`testResult/${this.payType}`,{})
      swalTost.fire({
        title:  this.$t("common.common_pay_progress_confirm"),
        icon : 'question',
        confirmButtonText:  this.$t("common.common_pay"),
        cancelButtonText:  this.$t("common.common_cancel")
      }).then(async (result) => {
        if (result.isConfirmed) {
          if(this.$isMobile()) {
            if(this.payType == 'W') {
              let url = await this.$api(`/wechatpayment`, {orderInfo})
              window.location.href = url
            } else {
              document.querySelector("#myForm").submit()
            }
          } else {
            if(this.payType == 'A'|| this.payType == 'W'|| this.payType == 'P') {
              document.querySelector("#myForm").submit()
            }
          }
          // else {
          //   // Unionpay 팝업 호출부
            
          //   // await this.$api(`/testResult/${this.payType}`,{})
          //   let HForm = document.querySelector("#uniForm")
          //   HForm.charset = "euc-kr"; 
          //   window.open("", "gx_pop", "width=380,height=620,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,left=150,top=50")
          //   HForm.target = "gx_pop";
          //   HForm.submit()
          // } 
        }
      });
    },
    goPage() {
      this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
    }
  }
}
</script>







