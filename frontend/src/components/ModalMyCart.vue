<template>
  <div> 
    <button class="float-end btn btn-outline-warning me-md-2 text-light" hidden type="button" id="modalBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">test</button> 
    <!-- Modal -->
    <div class="modal fade modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div :class="isMobile == true ? 'fw-bold text-start mobile-lg' : 'fw-bold text-start'" id="staticBackdropLabel">{{ this.dataType == 'option' ? $t('product.paid_option') : $t('common.participation') }}</div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="this.dataType == 'option'"> 
              <div  v-if="this.optionDtlList.length > 0"> 
                <div class="input-group input-group-sm g-3 mt-1" :key="i" v-for="(opt,i) of this.optionDtlList">
                  <input type="text" class="form-control col-auto mobile-md" v-model="opt.opt_name" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readonly>
                  <span class="input-group-text col-md-2 span-font" id="inputGroup-sizing-sm">{{ $t("common.participation") }}</span>
                  <select class="form-select form-select-sm col-md-2 font-md" v-model="opt.participant_cnt" @change="optionChange($event, opt)">
                    <option value="0">0</option>                        
                    <option :value="i" :key="i" v-for="i in 50">{{i}}</option>                        
                  </select>
                  <a><button @click="goDelete(opt)" type="button" class="btn-close btn-close-sm btn-close-dark pt-1" aria-label="Close"></button></a>
                </div>
              </div>
              <div> 
                <div class="d-grid gap-10 d-md-flex justify-content-md-start pt-2">
                  <button type="button" class="btn btn-sm btn-primary btn-st-sm" @click="getOptions">{{ $t("common.paid_option_add") }}</button>
                </div>
                <div v-if="addFlag == true" class="col-auto pt-2 pb-3">
                  <div class="input-group">
                    <Multiselect
                      v-model="optValue"
                      mode="tags"
                      :close-on-select="false"
                      :searchable="false"
                      :create-option="true"
                      :options="options"
                      track-by="value"
                      label="label"
                      :placeholder="$t(`product.paid_option_select`)"
                      :noResultsText="$t(`product.noresults_text`)"
                      @change="addTag"
                    />
                  </div>
                </div>
                <div class="pt-3 ">
                  <div class="input-group input-group-sm g-3 mt-1" :key="i" v-for="(opt,i) in optionList">
                    <input type="text" class="form-control col-md-12 mobile-md" v-model="opt.opt_name" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readonly>
                    <span class="input-group-text col-md-2 span-font" id="inputGroup-sizing-sm">{{ $t("common.participation") }}</span>
                    <select class="form-select form-select-sm col-md-2 font-md" v-model="opt.participant_cnt" @change="optionAddChange($event, opt)">
                      <option value="0">0</option>                        
                      <option :value="i" :key="i" v-for="i in 50">{{i}}</option>                        
                    </select>
                  </div>
                </div>
                <div class="pt-3"> 
                  <div><span class="fw-bold text-info span-font-lg">{{$t("common.opt_total_price")}}</span></div>
                  <div><span class="fw-bold text-info span-font-lg">{{getCurrencyFormat(optionPriceTotal + optionAddPriceTotal)}} {{this.prod_price_tp}}</span></div>
                </div>
                <div v-if="failFlag" class="text-center"><span class="text-danger fw-bold span-font-lg">* {{ failMsg }}</span></div>
              </div>
            </div>
            <div v-else>
              <!-- <div v-if="hotelFlag"> 
                <div v-if="hotelsFlag" class="pt-3 ">
                  <div class="input-group input-group-sm g-3 mt-1">
                    <input type="text" class="form-control col-md-12 mobile-md" v-model="hotelLists.hotel_type_nm" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readonly>
                    <span class="input-group-text col-md-2 span-font" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span>
                    <select class="form-select form-select-sm col-md-2 font-md" v-model="hotel_s_personnel" @change="personnelChange()">
                      <option value="0">0</option>                        
                      <option :value="i" :key="i" v-for="i in 20">{{i}}</option>                        
                    </select>
                  </div>
                </div>
                <div v-else class="pt-3 ">
                  <span><strong class="text-secondary">{{ $t("common.common_hotel_type") }}</strong></span>
                  <div class="mobile-sm"><label class="text-center text-danger">* {{$t("common.common_hotel_noti")}}</label></div>
                  <div class="pt-1 pb-1 input-group input-group-sm g-3 ">
                    <div class="input-group-text">
                      <input class="form-check-input mt-0" type="checkbox" :value="hotelLists.origin_hotel_price" @change="changeCheck($event)">
                    </div>
                    <input type="text" v-model="hotelLists.hotel_type_nm" class="form-control">
                    <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span>
                    <select class="form-select form-select-sm font-md" v-model="hotel_s_personnel" @change="personnelChange()" :disabled="this.check_s_flag ? false : true">
                      <option value="0">0</option>
                      <option :value="i" :key="i" v-for="i in 20">{{i}}</option>
                    </select>
                  </div>
                </div>
                <div v-if="hoteldFlag" class="pt-2 ">
                  <div class="input-group input-group-sm g-3 mt-1">
                    <input type="text" class="form-control col-md-12 mobile-md" v-model="hotelListd.hotel_type_nm" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readonly>
                    <span class="input-group-text col-md-2 span-font" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span>
                    <select class="form-select form-select-sm col-md-2 font-md" v-model="hotel_d_personnel" @change="personnelChange()">
                      <option value="0">0</option>                        
                      <option :value="i" :key="i" v-for="i in d_personnels">{{i}}</option>                        
                    </select>
                  </div>
                </div>
                <div v-else class="pt-2 ">
                  <div class="pt-1 pb-1 input-group input-group-sm g-3 ">
                    <div class="input-group-text">
                      <input class="form-check-input mt-0" :value="hotelListd.origin_hotel_price" type="checkbox" aria-label="Checkbox for following text input" @change="changeCheck1($event)">
                    </div>
                    <input type="text" v-model="hotelListd.hotel_type_nm" class="form-control">
                    <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span>
                    <select class="form-select form-select-sm font-md" v-model="hotel_d_personnel" @change="personnelChange()" :disabled="this.check_d_flag ? false : true">
                      <option value="0">0</option>
                      <option :value="i" :key="i" v-for="i in d_personnels">{{i}}</option>
                    </select>
                  </div>
                </div>
              </div> -->
              <div :class="isMobile == true ? 'text-start mobile-lg pb-1' : 'text-start pb-1'"><span class="span-font text-danger">{{ $t("common.discount_noti") }}</span></div>
              <div class="text-start"><span class="span-font text-danger">* {{ $t("common.child") }} : {{$t("common.child_noti")}}</span></div>
              <div class="text-start"><span class="span-font text-danger">* {{ $t("common.children") }} : {{$t("common.children_noti")}}</span></div>
              <div class="text-start"><span class="span-font text-danger">* {{ $t("common.teenager") }} : {{$t("common.teenager_noti")}}</span> </div>
              <div class="input-group input-group-sm pb-1 pt-2">
                <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.adult") }}</span>
                <select class="form-select form-select-sm font-md" v-model="adult_cnt" @change="prodCntChange()">
                  <option value="0">0</option>
                  <option :value="i" :key="i" v-for="i in 50">{{i}}</option>
                </select>
              </div>
              <div class="input-group input-group-sm pb-1 pt-1">
                <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'">{{ $t("common.teenager") }}</span>
                <select class="form-select form-select-sm font-md" v-model="teen_cnt" @change="prodCntChange()">
                  <option value="0">0</option>                        
                  <option :value="i" :key="i" v-for="i in 50">{{i}}</option>                        
                </select>
              </div>
              <div class="input-group input-group-sm pb-1 pt-1">
                <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'">{{ $t("common.children") }}</span>
                <select class="form-select form-select-sm font-md" v-model="children_cnt" @change="prodCntChange()">
                  <option value="0">0</option>
                  <option :value="i" :key="i" v-for="i in 50">{{i}}</option>
                </select>
              </div>
              <div class="input-group input-group-sm pb-1 pt-1">
                <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'">{{ $t("common.child") }}</span>
                <select class="form-select form-select-sm font-md" v-model="child_cnt" @change="prodCntChange()">
                  <option value="0">0</option>
                  <option :value="i" :key="i" v-for="i in 50">{{i}}</option>
                </select>
              </div>
              <div class="pt-3"> 
                <div><span class="fw-bold text-info span-font-lg">{{$t("product.total_product_price")}}</span></div>
                <div><span  class="fw-bold text-info span-font-lg">: {{getCurrencyFormat(this.totalPrice + this.hotel_price_total)}} {{this.prod_price_tp}}</span></div>
              </div>
              <div v-if="failFlag" class="text-center"><span class="text-danger fw-bold">* {{ failMsg }}</span></div>
            </div>
            
          </div>
          <div class="modal-footer">
            <button id="modalClose" type="button" class="btn btn-secondary btn-sm btn-st-sm"  data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
            <!-- <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="goUpdate()">{{ this.dataType == 'option' ? $t("product.paid_option") : $t("common.participation")}} {{ $t("product.modify") }}</button> -->
            <button type="button" class="btn btn-primary btn-sm btn-st-sm" @click="goUpdate()">{{$t("product.modify")}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>          
</template>
<script>
import { isDEmpty } from '@/is';
import Multiselect from '@vueform/multiselect'
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
export default {
  components : {
    Multiselect
  },
  data() {
    return {
      infoList : [],
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
      origin_adult_cnt : 0,
      origin_teen_cnt : 0,
      origin_children_cnt : 0,
      origin_child_cnt : 0,
      adultTotalPrice : 0,
      teenTotalPrice : 0,
      childrenTotalPrice : 0,
      childTotalPrice : 0,
      label : "",
      optionList : [],
      dataType : "",
      addFlag : false,
      cart_id : "",
      mem_id : "",
      prod_id : "",
      optionAddPriceTotal : 0,
      prod_price_tp : "",
      iprice : 0,
      totalPrice : 0,
      lan_tp : "",
      optionDtlList : [],
      mycartList : [],
      origin_total_price : 0,
      origin_opt_total_price : 0,
      origin_opt_add_total_price : 0,
      deal_bas_r : 0,
      mem_type : "",
      imgs : [],
      pageType : "",
      failFlag : false,
      isMobile : false,
      failMsg : "",
      hotelCartList : [],
      d_personnels : [],
      orgin_hotel_price : 0,
      hotel_price_total : 0,
      hotel_s_total : 0,
      hotel_d_total : 0,
      hotelLists : {},
      hotelListd : {},
      hotel_s_personnel : 0,
      hotel_d_personnel : 0,
      hotelsFlag : false,
      hoteldFlag : false,
      hotel_s_list : {},
      hotel_d_list : {},
      check_s_flag : false,
      check_d_flag : false,
      hotel_s_price : 0,
      hotel_d_price : 0,
      hotelFlag : false
    }
  },
  props : {
    info : Array,

  },
  emits: ['onPriceChange'],
  watch:{
    info: {
      handler( newVal, oldVal ){
        this.reset()
        console.log( 'newVal:', newVal, 'oldVal:', oldVal )
        this.infoList = newVal
        this.init()
      },
      // deep: true
    },
    
    
  },
  mounted() {
    this.isMobile = this.$isMobile()
    
  },
  unmounted() {
    
  },
  created() {
    
  },
  methods : {
    reset() {
      this.infoList = []
      this.options= []
      this.selected=null
      this.optValue= []
      this.opt_code=""
      this.opt_name=""
      this.optionArray = []
      this.participant_cnt = 0
      this.optionPriceTotal = 0
      this.tempriceList = []
      this.optCodeArray = []
      this.tempOptList = []
      this.adult_cnt = 0
      this.teen_cnt = 0
      this.children_cnt = 0
      this.child_cnt = 0
      this.origin_adult_cnt = 0
      this.origin_teen_cnt = 0
      this.origin_children_cnt = 0
      this.origin_child_cnt = 0
      this.adultTotalPrice = 0
      this.teenTotalPrice = 0
      this.childrenTotalPrice = 0
      this.childTotalPrice = 0
      this.label = ""
      this.optionList = []
      this.dataType = ""
      this.addFlag = false
      this.cart_id = ""
      this.mem_id = ""
      this.prod_id = ""
      this.optionAddPriceTotal = 0
      this.prod_price_tp = ""
      this.iprice = 0
      this.totalPrice = 0
      this.lan_tp = ""
      this.optionDtlList = []
      this.mycartList = []
      this.origin_total_price = 0
      this.origin_opt_total_price = 0
      this.origin_opt_add_total_price = 0
      this.deal_bas_r = 0
      this.mem_type = ""
      this.imgs = []
      this.pageType = ""
      this.failFlag = false
      this.isMobile = false
      this.failMsg = ""
      this.hoteList = []
      this.d_personnels = []
      this.orgin_hotel_price = 0
      this.hotel_price_total = 0
      this.hotel_s_total = 0
      this.hotel_d_total = 0
      this.hotelLists = {}
      this.hotelListd = {}
      this.hotel_s_personnel = 0
      this.hotel_d_personnel = 0
      this.hotelsFlag = false
      this.hoteldFlag = false
      this.hotel_s_price = 0
      this.hotel_d_price = 0
      this.hotel_s_list = {}
      this.hotel_d_list = {}
      this.check_s_flag = false
      this.check_d_flag = false
      this.hotelFlag = false

    },
    async init() {
      this.mem_id = this.infoList.mem_id
      this.cart_id = this.infoList.cart_id
      this.dataType = this.infoList.data_type
      this.prod_id = this.infoList.prod_id
      this.prod_price_tp = this.infoList.price_type
      this.lan_tp = this.infoList.lan_tp
      this.iprice = parseInt(this.infoList.iprice)
      this.prod_unit = this.infoList.prod_unit
      this.deal_bas_r = this.infoList.deal_bas_r
      this.pageType = this.infoList.pageType
      if(this.dataType == 'option') {
        let optionDtlList = await this.$api('/api/optionDtl', {param : [this.prod_unit, this.mem_id, this.cart_id]})
        if(optionDtlList.length > 0) {
          this.optionDtlList = optionDtlList
        } else {
          this.optionDtlList = []
          this.optionPriceTotal = 0
          this.optionAddPriceTotal = 0
        }
        if(this.optionDtlList.length > 0) {
          let i = 0
          let tempList = []
          this.optionDtlList.forEach(item => {
            let data = {
              opt_code : item.opt_code,
              opt_name : item.opt_name,
              opt_price : item.origin_price,
              participant_cnt : item.participant_cnt,
              opt_id : item.opt_id,
              cart_id : item.cart_id,
              prod_id : item.prod_id,
              mem_id : item.mem_id,
              idx : i
            }
            tempList.push(data)
            i++
          })
          let total = 0
          tempList.forEach(temp => {
            let optionPriceTotal = parseInt(temp.opt_price) * parseInt(temp.participant_cnt)
            total += parseInt(optionPriceTotal) 
          }) 
          
          this.origin_opt_total_price = total
          
          this.optionPriceTotal = Math.round(total / this.deal_bas_r)
          this.optionArray = tempList
        }
      } else {
        let mycartList = await this.$api('/api/mycartList1', {param : [this.prod_unit,this.prod_unit,this.prod_unit,this.prod_unit,this.prod_unit,this.cart_id, this.lan_tp]})
        if(mycartList.length > 0) {
          this.mycartList = mycartList[0]
        } else {
          this.mycartList = []
        }
        let hotelCartList =  await this.$api('/api/hotelCartDtlList', {param : [this.prod_unit,this.cart_id]})
        if(!isDEmpty(hotelCartList)) {
          let hotelLists = hotelCartList.filter(c=> c.hotel_type == "S")
          let hotelListd = hotelCartList.filter(c=> c.hotel_type == "D")
          this.hotelLists = isDEmpty(hotelLists) ? hotelLists : hotelLists[0]
          this.hotelListd = isDEmpty(hotelListd) ? hotelListd : hotelListd[0]
          this.hotel_s_personnel = isDEmpty(this.hotelLists) ? 0  : parseInt(this.hotelLists.personnel_cnt) 
          this.hotel_d_personnel = isDEmpty(this.hotelListd) ? 0 : parseInt(this.hotelListd.personnel_cnt) 
          
          this.hotelsFlag = isDEmpty(this.hotelLists) ? false : true
          this.hoteldFlag = isDEmpty(this.hotelListd) ? false : true
          this.d_personnels = [2,4,6,8,10,12,14,16,18,20]
  
          let hotelList = await this.$api('/api/hotelDtlList', {param:[this.prod_unit,this.mycartList.prod_type, this.mycartList.prod_category]});
          this.hotelFlag = isDEmpty(hotelList) ? false : true
        // let data = null
          if(!isDEmpty(hotelList)) {
            let data = {}
            let hotelsArray = []
            let hoteldArray = []
            if(!this.hotelsFlag) {
              let hotelLists = hotelList.filter(c=> c.hotel_type == "S")
              hotelLists.forEach(item => {
                if(this.lan_tp == 'KOR') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                } else if(this.lan_tp == 'CHN') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_cn_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
      
                } else if(this.lan_tp == 'JPN') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_jp_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                } else if(this.lan_tp == 'VTN') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_vn_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                } else {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_en_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                }
                hotelsArray.push(data)
              })
              this.hotelLists = hotelsArray[0]
            }
            if(!this.hoteldFlag) {
              let hotelListd = hotelList.filter(c=> c.hotel_type == "D")
              hotelListd.forEach(item => {
                if(this.lan_tp == 'KOR') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                } else if(this.lan_tp == 'CHN') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_cn_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                    
                  }
      
                } else if(this.lan_tp == 'JPN') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_jp_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                } else if(this.lan_tp == 'VTN') {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_vn_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                } else {
                  data = {
                    hotel_type : item.hotel_type,
                    hotel_type_nm : item.hotel_en_type_nm,
                    hotel_price : item.hotel_price,
                    hotel_dtl_id : item.hotel_dtl_id,
                    origin_hotel_price : item.origin_hotel_price
                  }
                }
                hoteldArray.push(data)
              })
              this.hotelListd = hoteldArray[0]
            }
          }
        }
        this.totalPrice = parseInt(this.mycartList.cost_price)
        this.adult_cnt = parseInt(this.mycartList.adult_cnt)
        this.teen_cnt = parseInt(this.mycartList.teen_cnt)
        this.children_cnt = parseInt(this.mycartList.children_cnt)
        this.child_cnt = parseInt(this.mycartList.child_cnt)
        this.origin_adult_cnt = parseInt(this.mycartList.adult_cnt)
        this.origin_teen_cnt = parseInt(this.mycartList.teen_cnt)
        this.origin_children_cnt = parseInt(this.mycartList.children_cnt)
        this.origin_child_cnt = parseInt(this.mycartList.child_cnt)
        // this.hotel_price_total = parseInt(this.mycartList.hotel_price)
        
      }
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getOptions() {
      this.addFlag = true
      let productDetail = await this.$api("/api/productDetail",{param:[this.prod_unit, this.prod_unit, sessionStorage.get('lan_tp'), this.prod_id]});
      if(productDetail.length > 0) {
        this.productDetail = productDetail[0];
      }
      let optCodeArr = ""
      let options = []
      if(!isDEmpty(this.productDetail.opt_code)) {
        optCodeArr = this.productDetail.opt_code.split(',');
        options = await this.$api("/api/optionList2", {param:[this.prod_unit, optCodeArr]});
        let data = {}
        let tempArray = []
        options.forEach(item => {
          if(this.prod_unit == 'CNH') {
            data = {
              value : item.value,
              label : item.opt_cn_nm.concat(' ').concat(item.opt_price),
              opt_code : item.opt_code,
              opt_nm : item.opt_cn_nm.concat(' ').concat(item.opt_price),
              opt_price : item.origin_price,
            }
          } else if(this.prod_unit == 'KRW'){
            data = {
              value : item.value,
              label : item.opt_nm.concat('').concat(item.opt_price),
              opt_code : item.opt_code,
              opt_nm : item.opt_nm.concat(' ').concat(item.opt_price),
              opt_price : item.origin_price,
            }
          } else {
            data = {
              value : item.value,
              label : item.opt_en_nm.concat(' ').concat(item.opt_price),
              opt_code : item.opt_code,
              opt_nm : item.opt_nm,
              opt_price : item.origin_price,
              
            }
          }
          tempArray.push(data)
          
        })
        this.options = tempArray
        
      }
      let temp1 = []
      let temp2 = []
      temp1 = this.options
      temp2 = this.optionArray
      let result = temp1.filter(item => {
        return !temp2.some(other => other.opt_code === item.opt_code)
      })
      for(let i = 0; i < result.length; i++){
        let data = {
          opt_code : result[i].opt_code,
          opt_name : result[i].opt_name,
          opt_price : result[i].origin_price,
          participant_cnt : result[i].participant_cnt,
          opt_id : result[i].opt_id,
          cart_id : this.cart_id,
          prod_id : this.prod_id,
          mem_id : this.mem_id,
          idx : i
        }
        result = Object.assign(result, data)
      }
      this.options = []
      this.options = result
      
      // this.iprice = this.productDetail.prod_price;
      this.curUnit = this.$t("unit.unit_curr");
    },  
    addTag(value,label){
      let param1 = [];
      let param2 = {};
      let temprice = [];
      let labelStr = "";
      let tempCode = [];
      param1 = value;
      
      for(let i=0;i<param1.length;i++){
        param2 = param1[i].split(";");
        
        if(i == param1.length-1) {
          tempCode += param2[0]
        } else {
          tempCode += param2[0].concat(",");
        }
        temprice.push(param2[1]);
      }
      
      this.opt_code = tempCode;
      // this.optionArray = this.opt_code.split(',')
      labelStr += label.ariaLabel;
      // labelStr = labelStr.substring(0,labelStr.length-1)
      this.opt_name = labelStr
      let optNameArr = isDEmpty(this.opt_name) ? [] : this.opt_name.split(',')
      let optCodeArr = isDEmpty(this.opt_code) ? [] : this.opt_code.split(',')
      this.tempriceList = temprice
      // this.optionArray = code
      let optArrList = []
      if(optCodeArr.length > 0) {
        for(let i =0 ; i < optCodeArr.length; i++){
          let data = {
            opt_code : optCodeArr[i],
            opt_name : optNameArr[i],
            opt_price : temprice[i],
            idx : i
          }
          optArrList.push(data)
        }
      }
      this.optionList = optArrList
      this.optionList.forEach(c => {
        if(isDEmpty(c.participant_cnt)) {
          c = Object.assign(c, {participant_cnt : 0})
        }
        if(this.tempOptList.length > 0) {
          this.tempOptList.forEach(d => {
            if(c.opt_code == d.opt_code) {
              c.participant_cnt = d.participant_cnt
            }
          })
        }
      })
      if(this.optionList.length < 1) {
        this.optionPriceTotal = 0
        this.tempOptList = []
      } else {
        if(this.tempOptList.length > this.optionList.length) {
          this.optDelChange()
        } 
      }
    },
    optionChange(event, obj) {
      let participant_cnt = event.target.value
      let optionPriceTotal = 0
      let total = 0
      // let data = {}
      this.optionPriceTotal = 0
      if(this.optionArray.length > 0) {
        this.optionArray.forEach(item => {
          if(item.opt_code == obj.opt_code) {
            item.participant_cnt = participant_cnt
          }
          optionPriceTotal = parseInt(item.opt_price) * parseInt(item.participant_cnt)
          console.log("optionPriceTotal : ",optionPriceTotal)
          total += parseInt(optionPriceTotal) 
        })
        this.optionPriceTotal = Math.round(total / this.deal_bas_r)
      } 
      // else {
      //   this.optionPriceTotal = 0
      // }
    },
    optionAddChange(event, obj) {
      console.log("obj : ", obj)
      let participant_cnt = event.target.value
      let optionPriceTotal = 0
      let total = 0
      // let data = {}
      this.optionAddPriceTotal = 0
      if(this.optionList.length > 0) {
        this.optionList.forEach(item => {
          if(item.opt_code == obj.opt_code) {
            item.participant_cnt = participant_cnt
          }
          optionPriceTotal = parseInt(item.opt_price) * parseInt(item.participant_cnt)
          console.log("optionPriceTotal : ",optionPriceTotal)
          total += parseInt(optionPriceTotal) 
        }) 
        console.log("total : ",total, this.optionPriceTotal)
        this.optionAddPriceTotal = Math.round(total / this.deal_bas_r)
        this.tempOptList = this.optionList
      } 
      // else {
      //   this.optionAddPriceTotal = 0
      // }
    },
    optDelChange() {
      console.log("optDelChange")
      let total = 0
      this.optionList.forEach(item => {
        let optionPriceTotal = parseInt(item.opt_price) * parseInt(item.participant_cnt)
        console.log("optionPriceTotal : ",optionPriceTotal)
        total += parseInt(optionPriceTotal) 
      })
      this.origin_opt_total_add_price = total
      this.optionAddPriceTotal = Math.round(total / this.deal_bas_r)

    },
    prodCntChange() {
      this.totalPrice = 0
      console.log(this.iprice,this.adult_cnt,this.teen_cnt,this.children_cnt)
      this.adultTotalPrice = parseInt(this.iprice * this.adult_cnt)
      // let teenPriceTotal = parseInt(this.iprice *  this.teen_cnt)
      // let teenDiscount = Math.round((teenPriceTotal) * (3 / 100))
      // this.teenTotalPrice = teenPriceTotal - teenDiscount
      this.teenTotalPrice = this.iprice *  this.teen_cnt
      let childrenPriceTotal = parseInt(this.iprice *  this.children_cnt)
      let childrenDiscount = Math.round((childrenPriceTotal) * (2/100))
      this.childrenTotalPrice =  childrenPriceTotal - childrenDiscount
      this.childTotalPrice = 0
      
      console.log("adultTotalPrice  : ", this.adultTotalPrice)
      console.log("this.teenTotalPrice  : ", this.teenTotalPrice)
      console.log("childrenTotalPrice  : ", this.childrenTotalPrice)
      console.log("this.childTotalPrice  : ", this.childTotalPrice)

      console.log("adultTotalPrice  : ", this.adultTotalPrice, this.teenTotalPrice, this.childrenTotalPrice, this.childTotalPrice)
      let totalPrice = this.adultTotalPrice + this.teenTotalPrice + this.childrenTotalPrice + this.childTotalPrice
      console.log("totalPrice : ", totalPrice)
      this.origin_total_price = totalPrice
      this.totalPrice = Math.round(totalPrice / this.deal_bas_r)
    },
    changeCheck(event) {
      let checkeds = event.target.checked
      if(checkeds) {
        this.check_s_flag = true
        this.hotel_s_price = parseInt(this.hotelLists.origin_hotel_price)
      } else {
        this.check_s_flag = false
        this.hotel_s_price = 0
      }
    },
    changeCheck1(event) {
      let checked1 = event.target.checked
      if(checked1) {
        this.check_d_flag = true
        this.hotel_d_price = parseInt(this.hotelListd.origin_hotel_price)
      } else {
        this.check_d_flag = false
        this.hotel_d_price = 0
      }
    },
    personnelChange() {
      // if(type == 'S') {
        // this.hotel_s_personnel = parseInt(event.target.value)
        this.hotel_s_price = parseInt(this.hotelLists.origin_hotel_price)
        this.hotel_s_total = this.hotel_s_price * this.hotel_s_personnel
      // } else {
        // this.hotel_d_personnel = parseInt(event.target.value)
        this.hotel_d_price = parseInt(this.hotelListd.origin_hotel_price)
        this.hotel_d_total = this.hotel_d_price * this.hotel_d_personnel
      // }
      
      let origin_hotel_price = this.hotel_s_total + this.hotel_d_total
      this.orgin_hotel_price = origin_hotel_price
      this.hotel_price_total = Math.round(origin_hotel_price / this.deal_bas_r)
    },
    validationChk() {
      this.failFlag = false
      this.failMsg = ""
      if(this.dataType == 'option') {
        if(this.optionArray.length > 0) {
          this.optionArray.forEach(item => {
            console.log("item.participant_cnt : ", item.participant_cnt)
            if(item.participant_cnt < 1) {
              this.failFlag = true
            }
          })
          if(this.failFlag) {
            this.failMsg = this.$t('common.opt_participants_select')
            return false
          }
        } 
        if(this.optionList.length > 0) {
          this.optionList.forEach(item => {
            if(item.participant_cnt < 1) {
              this.failFlag = true
            }
          })
          if(this.failFlag) {
            this.failMsg = this.$t('common.opt_participants_select')
            return false
          }
        }
      } else {
        if(this.adult_cnt < 1 && this.teen_cnt < 1) {
          this.failFlag = true
          this.failMsg = this.$t('common.prod_cnt_fail')
          return false
        }
        // let totalCnt = parseInt(this.adult_cnt) + parseInt(this.teen_cnt) + parseInt(this.children_cnt)
        // let total_personnel = parseInt(this.hotel_s_personnel) + parseInt(this.hotel_d_personnel)
        // if(total_personnel != totalCnt) {
        //   this.failFlag = true
        //   this.failMsg = this.$t('common.common_personnel_noti')
        //   return false
        // }
      }
      return true
    },
    async goUpdate() {
      if(this.validationChk()) {
        if(this.dataType == 'option') {
          if(this.optionArray.length > 0) {
            let total = 0
            for(let i = 0; i < this.optionArray.length ; i++) {
              let data = {
                opt_code : this.optionArray[i].opt_code,
                opt_name : this.optionArray[i].opt_name,
                opt_price : this.optionArray[i].opt_price,
                participant_cnt : this.optionArray[i].participant_cnt,
                mod_date : this.$dateFormat('filedate')
              }
              let optPrice = this.optionArray[i].opt_price * this.optionArray[i].participant_cnt
              total += optPrice
              await this.$api('/api/optionDtlInsert', {param : [{opt_id : this.optionArray[i].opt_id, mem_id : this.optionArray[i].mem_id, cart_id : this.optionArray[i].cart_id }, data]})
            }
            this.origin_opt_total_price = total
          }
          if(this.optionList.length > 0) {
            let total = 0
            for(let i = 0; i < this.optionList.length ; i++) {
              let optSeq = ""
              if(isDEmpty(this.optionList[i].opt_id)) {
                optSeq = await this.$api("/api/commSequences", {param : ['OPTD','opt_id','8']});
              } 
              let data = {
                opt_id : isDEmpty(this.optionList[i].opt_id) ? optSeq[0].commSeq : this.optionList[i].opt_id,
                opt_code : this.optionList[i].opt_code,
                opt_name : this.optionList[i].opt_name,
                opt_price : this.optionList[i].opt_price,
                participant_cnt : this.optionList[i].participant_cnt,
                cart_id : this.cart_id,
                mem_id : this.mem_id,
                reg_date : this.$dateFormat('filedate')
              }
              let optPrice = this.optionList[i].opt_price * this.optionList[i].participant_cnt
              total += optPrice
              await this.$api("/api/optionDtlInsert", {param : [data , data]})
            }
            this.origin_opt_add_total_price = total
          }
          console.log("totalprice : ",this.origin_opt_total_price ,this.origin_opt_add_total_price)
          console.log("totalprice1 : ",parseInt(this.origin_opt_total_price) + parseInt(this.origin_opt_add_total_price))
          let optionPrice = this.origin_opt_total_price + this.origin_opt_add_total_price
          await this.$api("/api/myCartUpdate", {param : [{option_price : optionPrice}, this.cart_id]})
          this.reset()
          let temps = []
          temps.push({page_type : this.pageType})
          this.$emit('onPriceChange', temps);
          let HForm = document.querySelector("#modalClose")
          HForm.click()
          
        } else {
          console.log("this.failFlag : ", this.failFlag)
          let data = {
            cost_price : this.origin_total_price > 0 ? this.origin_total_price : this.totalPrice, // 상품참여인원 선택 가격
            adult_cnt : this.adult_cnt,
            teen_cnt : this.teen_cnt,
            children_cnt : this.children_cnt,
            child_cnt : this.child_cnt,
            hotel_price : this.orgin_hotel_price,
            mod_date : this.$dateFormat('filedate')
          }
          console.log("data 수정 : ", data)
          await this.$api("/api/myCartUpdate", {param : [data, this.cart_id]});
          let data1 = {}
          if(!this.hotelsFlag) {
            console.log(this.hotelLists,!isDEmpty(this.hotelLists.hotel_dtl_id))
            // if(!isDEmpty(this.hotelLists.hotel_dtl_id)) {
              const hotelSeq = await this.$api("/api/commSequences", {param : ['HOTCRAT','hotel_cart_id','7']});
              let data1 = {
                hotel_cart_id : hotelSeq[0].commSeq,
                cart_id : this.cart_id,
                mem_id : this.mem_id,
                hotel_dtl_id : this.hotelLists.hotel_dtl_id,
                hotel_type_nm : this.hotelLists.hotel_type_nm,
                hotel_type : this.hotelLists.hotel_type,
                hotel_price :  this.hotelLists.origin_hotel_price,
                personnel_cnt : this.hotel_s_personnel,
                reg_date : this.$dateFormat('filedate')
              }
              await this.$api("/api/hotelCartInsert", {param : [data1 , data]})
            // }
          } else {
            data1 = {
              personnel_cnt : this.hotel_s_personnel,
              mod_date : this.$dateFormat('filedate')
            }
            await this.$api("/api/hotelCartUpdate", {param : [data1, this.hotelLists.hotel_cart_id]});
          }
          if(!this.hoteldFlag) {
            console.log(this.hotelListd,!isDEmpty(this.hotelListd.hotel_dtl_id))
            // if(!isDEmpty(this.hotelListd.hotel_dtl_id)) {
              const hotelSeq = await this.$api("/api/commSequences", {param : ['HOTCRAT','hotel_cart_id','7']});
              let data = {
                hotel_cart_id : hotelSeq[0].commSeq,
                cart_id : this.cart_id,
                mem_id : this.mem_id,
                hotel_dtl_id : this.hotelListd.hotel_dtl_id,
                hotel_type_nm : this.hotelListd.hotel_type_nm,
                hotel_type : this.hotelListd.hotel_type,
                hotel_price :  this.hotelListd.origin_hotel_price,
                personnel_cnt : this.hotel_d_personnel,
                reg_date : this.$dateFormat('filedate')
              }
              await this.$api("/api/hotelCartInsert", {param : [data , data]})
            // }
          } else {
            data1 = {
              personnel_cnt : this.hotel_d_personnel,
              mod_date : this.$dateFormat('filedate')
            }
            await this.$api("/api/hotelCartUpdate", {param : [data1, this.hotelListd.hotel_cart_id]});
          }

          // this.reset()
          let temps = []
          if(this.pageType == 'reservInfo') {
            if(this.origin_adult_cnt > this.adult_cnt) {
              temps.push({origin_adult_cnt : this.origin_adult_cnt, adult_cnt : this.adult_cnt, mem_type : 'adult', page_type : this.pageType})  
            } 
            if(this.origin_teen_cnt > this.teen_cnt) {
              temps.push({origin_teen_cnt : this.origin_teen_cnt, teen_cnt : this.teen_cnt, mem_type : 'teen', page_type : this.pageType})  
            } 
            if(this.origin_children_cnt > this.children_cnt) {
              temps.push({origin_children_cnt : this.origin_children_cnt, children_cnt : this.children_cnt, mem_type : 'children', page_type : this.pageType})  
            } 
            if(this.origin_child_cnt > this.child_cnt) {
              temps.push({origin_child_cnt : this.origin_child_cnt, child_cnt : this.child_cnt, mem_type : 'child', page_type : this.pageType})  
            }
          } else {
            temps.push({page_type : this.pageType})
          }
          this.$emit('onPriceChange', temps);
          let HForm = document.querySelector("#modalClose")
          HForm.click()
          
        }
      }
    },
    async goDelete(obj) {
      if(this.dataType == 'option') {
        if(this.optionArray.length > 0) {
          let total = 0
          this.optionArray.forEach(item => {
            total += item.opt_price * item.participant_cnt
          })
          this.optionArray.forEach(item => {
            if(item.opt_id == obj.opt_id) {
              let optPrice =  item.opt_price * item.participant_cnt
              let data = {
                option_price : total - optPrice
              }
              this.$api("/api/myCartUpdate", {param : [data, this.cart_id]});
            }
          })
        }
        await this.$api('/api/optionDtlDelete', {param : [obj.opt_id]})
        this.$emit('onPriceChange', {page_type : this.pageType});
        this.reset()
        let HForm = document.querySelector("#modalClose")
        HForm.click()
      }
    }
  }

}
</script>

<style>

</style>