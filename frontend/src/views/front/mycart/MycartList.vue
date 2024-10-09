<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info text-light" style="margin: 0;">{{$t("product.mycart_list")}}</h5>
      <h6 v-else class="text-center bg-info text-light" style="margin: 0;">{{$t("product.mycart_list")}}</h6>
      <table class="table table-bordered mt-1">
        <tbody>
        <tr class="table-dark text-white" :key="i" v-for="(myCart, i) in myCartList"><!--  :key="i" v-for="(myCart, i) in myCartList" -->
          <td align="center" valign="middle" width="10%">
              <input type="radio"
                  :value="myCart.cart_id"
                  v-model="selectCartId"
                  @change="selectChange(myCart)"
              >
          </td>
          <td>
            <div align="center" valign="top"> 
              <img :src="`/download/${myCart.file_path}/${myCart.prod_id}/1/${myCart.file_name}`" style="max-width:200px; min-width: 100px; max-height:200px; min-height:100px ; " alt="" />
            </div> 
            <!-- <img :src="`/download/${myCart.file_path}/${myCart.prod_id}/1/${myCart.file_name}`" style="width:200px" alt="" /> -->
            <tr >
              <td class="pt-2" width="40%"> 
                <div class="text-start"><span class="text-white text-break span-font-sm">{{myCart.prod_title}}</span></div>
                <div class="text-start pt-1"><span class="text-white text-break span-font-sm">{{ myCart.ymd_format }}</span></div>
                <div class="text-start pt-1"><span class="text-info text-break span-font-sm">{{ $t("common.prod_price") }}</span></div>
                <div class="text-start pt-1"><span class="text-info text-break span-font-sm">{{ getCurrencyFormat(myCart.prod_price) }} {{ myCart.prod_price_tp}}</span></div>
                <div v-if="myCart.txn_type == 'N'" class="text-start pt-1" valign="middle"><span class="badge text-bg-danger me-1 span-font-ss">{{ $t("common.customer_info_nodata") }}</span></div>
                <div v-if="myCart.txn_type == 'T'" class="text-start pt-1" valign="middle"><span class="badge text-bg-primary me-1 span-font-ss">{{ $t("common.order_confirm") }}</span></div>
                <div v-if="myCart.txn_type == 'P'" class="text-start pt-1" valign="middle"><span class="badge text-bg-success me-1 span-font-ss">{{ $t("common.common_pay_complete") }}</span></div>
              </td>
            </tr>
          </td>
          <td width="50%"> 
            <div v-if="myCart.opt_code_chk != null && myCart.opt_code_chk != ''"> 
              <div class="text-start pt-1"><span class="text-info span-font">[{{$t("product.paid_option")}}]</span></div>
              <div class="text-white text-start pt-1" :key="i" v-for="(opt,i) in this.optionList.filter(c => c.cart_id == myCart.cart_id)">
                <span class="span-font"> {{opt.opt_name}} [{{ opt.participant_cnt }}]</span>
              </div>
              <div v-if="myCart.txn_type =='N'" class="pt-1">
                <button type="button" class="btn btn-primary btn-st-sm" 
                  data-bs-toggle="modal" data-bs-target="#staticBackdrop" 
                  @click="modifyInfo('option', myCart)">{{ this.optionList.length > 0 ? $t('product.modify') : $t('common.paid_option_add')}}</button>
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
              <div v-if="myCart.adult_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.adult") }} : {{ myCart.adult_cnt }}</span></div>
              <div v-if="myCart.teen_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.teenager") }} : {{ myCart.teen_cnt }}</span></div>
              <div v-if="myCart.children_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.children") }} : {{ myCart.children_cnt }}</span></div>
              <div v-if="myCart.child_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.child") }} : {{ myCart.child_cnt }}</span></div>
              <div v-if="myCart.txn_type =='N' && myCart.package_cnt == 0" class="pt-1">
                <button type="button" class="btn btn-sm btn-primary btn-st-sm" 
                  data-bs-toggle="modal" data-bs-target="#staticBackdrop" 
                  @click="modifyInfo('participant', myCart)">{{ $t('product.modify') }}</button>
              </div>
              <div v-if="myCart.option_price > 0"> 
                <div class="text-start pt-1"><span class="text-info span-font">[{{$t("common.opt_total_price")}}]</span></div>
                <div class="text-start pt-2"><span class="text-info span-font">{{getCurrencyFormat(myCart.option_price)}} {{myCart.prod_price_tp}}</span></div>
              </div>
              <div class="text-start pt-1">
                <div class="text-start pt-1"><span class="text-info span-font">[{{$t("product.total_product_price")}}]</span></div>
                <!-- <div class="text-start pt-2"><span class="text-info span-font">{{getCurrencyFormat(myCart.cost_price + myCart.option_price + myCart.hotel_price)}} {{myCart.prod_price_tp}}</span></div> -->
                <div class="text-start pt-2"><span class="text-info span-font">{{getCurrencyFormat(myCart.cost_price + myCart.option_price)}} {{myCart.prod_price_tp}}</span></div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="myCartList.length < 1">{{ $t("common.mycart_product_no_date") }}</div>
      <div v-if="myCartList.length < 1" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button v-if="myCartList.length > 0" type="button" :class="isMobile == true ? 'float-end btn btn-info btn-st-sm' : 'float-end btn btn-info btn-st-md'" @click="goToOrder">{{ txn_type == 'T' ? $t("common.order_confirm_title") : $t("mycart.customer_info")}}</button>
        <button v-if="myCartList.length > 0" :class="isMobile == true ? 'float-end btn btn-danger me-md-2 btn-st-sm' : 'float-end btn btn-danger me-md-2 btn-st-md'" type="button" @click="goToDalete()">{{$t("product.select_delect")}}</button>
        <button :class="isMobile == true ? 'float-end btn btn-dark me-md-2 btn-st-sm' : 'float-end btn btn-dark me-md-2 btn-st-md'" type="button" @click="goPage">{{$t("common.home")}}</button>
      </div>
    </div>
    <modalMyCart 
      :info="this.info" 
      @onPriceChange="receiveEmit">
    </modalMyCart>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {swalTost, swal} from '@/alert'
import modalMyCart from '@/components/ModalMyCart.vue';
// import { isDEmpty } from '@/is';
let timer = null
export default {
  components: { modalMyCart},
  // components : {
  //   Multiselect
  // },
  data() {
    return {
      myCartList : [],
      total: 1,
      totalPrice: 0,
      prodId : "",
      prodType : "",
      lanTp : "",
      cart_id : "",
      selectCartId : "",
      resParam : {},
      options: [],
      selected:null , 
      optValue: [],
      opt_code:"",
      opt_name:"",
      optionArray : [],
      participant_cnt : 0,
      optionPriceTotal : 0,
      tempriceList : [],
      optCodeArray : [],
      tempOptList : [],
      adult_cnt : 0,
      teen_cnt : 0,
      children_cnt : 0,
      child_cnt : 0,
      adultTotalPrice : 0,
      teenTotalPrice : 0,
      childrenTotalPrice : 0,
      childTotalPrice : 0,
      label : "",
      optionList : [],
      info : {},
      prod_price_tp : "",
      dataType : "",
      mem_id : "",
      prod_unit : "",
      deal_bas_r : 0,
      txn_type : "",
      isMobile : false,
      isLoading : true,
      hotelCartList : [],
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
      this.$router.push({path : '/'})
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
    timer = setTimeout(() => {
      this.isLoading = true
      this.getMycartList();
    }, 1000);
    this.isMobile = this.$isMobile()
  },
  methods: {
    
    receiveEmit(obj) {
      console.log(obj)
      this.getMycartList()
    },
    async getMycartList() {
      if(this.resParam.lan_tp == 'CHN') {
        this.prod_unit = 'CNH'
      } else if(this.resParam.lan_tp == 'KOR') {
        this.prod_unit = 'KRW'
      } else {
        this.prod_unit = 'USD'
      }
      this.myCartList = await this.$api('/api/mycartList', {param:[this.prod_unit, this.prod_unit, this.prod_unit, this.prod_unit,this.prod_unit, this.user.mem_id, this.resParam.lan_tp]});
      this.optionList = await this.$api("/api/optionDtlList", {param:[this.prod_unit,this.user.mem_id]});
      // this.hotelCartList = await this.$api("/api/hotelCartList", {param:[]});
      if(this.myCartList.length > 0) {
        this.prod_price_tp = this.myCartList[0].prod_price_tp
      }
    },
    modifyInfo(type, obj){
      console.log(type)
      this.dataType = type
      this.prod_id = this.myCartList[0].prod_id
      // this.cart_id = cart_id
      this.info = {
        data_type : type,
        price_type : obj.prod_price_tp ,
        prod_id : obj.prod_id,
        mem_id : this.user.mem_id,
        cart_id : obj.cart_id,
        lan_tp : this.resParam.lan_tp,
        iprice : obj.origin_price,
        prod_unit : this.prod_unit,
        deal_bas_r : obj.deal_bas_r,
        pageType : 'mycart'
      }
      console.log("this.info : ", this.info)
      
      
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    selectChange (obj) {
      this.cart_id = this.selectCartId
      this.prodId = obj.prod_id
      this.txn_type = obj.txn_type
      this.deal_bas_r = obj.deal_bas_r
      console.log("this.cart_id:", obj.deal_bas_r)
    },
    async goToDalete(){
      let msg = ""
      if(this.cart_id.length < 1) {
        return swal.fire({
                          title: this.$t("common.mycart_delete_product_select"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                })
        
      } 
      if(this.txn_type == 'N') {
        msg = this.$t("common.common_delete_confirm")
      } else if(this.txn_type == 'T') {
        msg = this.$t("common.mycart_customer_delete_confirm")
      } else {
        msg = this.$t("common.common_pay_complete_fail")
      }
      swalTost.fire({
          title: msg,
          icon : 'question',
          timer:0, 
          confirmButtonText: this.$t("common.common_delete"),
          cancelButtonText: this.$t("common.common_cancel"),
      }).then(async (result) => {
          if (result.isConfirmed) {
            if(this.txn_type == 'N') {
              const {error} = await this.$api('/api/mycartDelete', {param : [this.cart_id]});
              await this.$api('/api/optionDtlAllDelete', {param : [this.cart_id]});
              // await this.$api('/api/hotelCartDelete', {param : [this.cart_id]});
              if(error) {
                return swal.fire({
                        title: this.$t("common.common_delete_fail"),
                        icon : 'warning',
                        timer: 1500, 
                        confirmButtonText: this.$t("common.common_close"),
                      })
              }
            } else if(this.txn_type == 'T') {
              await this.$api('/api/mycartDelete', {param : [this.cart_id]});
              await this.$api('/api/optionDtlAllDelete', {param : [this.cart_id]});
              await this.$api('/api/mycartReservMemDelete', {param : [this.cart_id]});
              await this.$api('/api/mycartReservDelete', {param : [this.cart_id]});
              // await this.$api('/api/hotelCartDelete', {param : [this.cart_id]});

              let imgs = await this.$api('/api/passPortGroupList', {param : [this.cart_id]});
              if(imgs.length > 0) {
                for(let item of imgs) {
                  let info = {
                    filepath : item.file_path,
                    category : 'PASSPORT',
                    prod_id : item.prod_id,
                    mem_id : item.mem_id,
                    cart_id : item.cart_id,
                    mod_type : 'all',
                  }
                  await this.$api(`/deleteFile/PASSPORT`, {info});
                }
                await this.$api('/api/passportImgAllDelete', {param : [this.user.mem_id, this.prodId, this.cart_id]})
              }
            } else if(this.txn_type == 'P') {
              const {error} = await this.$api('/api/mycartDelete', {param : [this.cart_id]});
              if (error) {
                return swal.fire({
                          title: this.$t("common.common_delete_fail"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                })
              }
            }
            swal.fire({
                      title: this.$t("common.common_delete_success"),
                      icon : 'success',
                      timer: 1500, 
                      confirmButtonText: this.$t("common.common_confirm"),
            })
            this.getMycartList();
          } 
      });
    },
    goToOrder() {
      if(this.cart_id.length < 1) {
        return swal.fire({
                  title: this.$t("common.mycart_product_select"),
                  icon : 'info',
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
      let path = ""
      if(this.txn_type == 'N') {
        path = '/reservInfo'
      } else if(this.txn_type == 'T') {
        path = '/order'
      } else {
        return swal.fire({
                title: this.$t("common.common_delete_fail"),
                icon : 'warning',
                timer:1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
      }
      console.log("reqParam order : ",reqParam)
      this.$router.push({path: path, state:{ reqParam : JSON.stringify(reqParam) }});
    },
    // async cancel(cart_id){
    //   this.$swal.fire({
    //       title: this.$t("common.common_delete_confirm"),
    //       showCancelButton: true,
    //       confirmButtonText: this.$t("common.common_delete"),
    //       cancelButtonText: this.$t("common.common_cancel")
    //   }).then(async (result) => {
    //       if (result.isConfirmed) {
    //         const {error} = await this.$api('/api/mycartDelete', {param : [cart_id]});
    //         if (error) {
    //           return this.$swal(this.$t("common.common_delete_fail"));
    //         }
    //         await this.$api('/api/optionDtlAllDelete', {param : [cart_id]});
    //         this.$swal.fire(this.$t("common.common_delete_success"), '', 'success');
    //         this.getMycartList();
    //       } 
    //   });
    // },
    goPage() {
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
      // this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp}})
    }
  }
}
</script>
