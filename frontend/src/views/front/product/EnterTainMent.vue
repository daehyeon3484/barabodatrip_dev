<template>
  <main class="mt-1"> 
    <div class="continer">
      <h5 v-if="!isMobile" class="text-center bg-info bg-gradient text-white" style="margin:0">{{this.resParam.group_nm}}</h5>
      <h6 v-else class="text-center bg-info bg-gradient text-white" style="margin:0">{{this.resParam.group_nm}}</h6>
      <div class="row mt-1"> 
        <div class="col-md-12 col-padding">
          <div :key="i" v-for="(product ,i) in productList">
            <a @click="goToDetail(product.prod_id,product.prod_type)">
              <div class="card mb-3" >
                <div class="row g-0">
                  <div class="col-md-4">
                    <img :src="`/download/${product.file_path}/${product.prod_id}/1/${product.file_name}`" class="" style="height: 100%;" alt="..."/>
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <div :class="isMobile == true ? 'mobile-lg fw-bold' : 'fw-bold'"><p class="card-title">{{product.prod_title}}</p></div>
                      <!-- <div :class="isMobile == true ? 'mobile-md ' : ''"><p class="card-text text-muted" v-html="product.prod_desc"></p></div> -->
                      <div :class="isMobile == true ? 'card-body fw-bold text-dark mobile-lg' :'card-body fw-bold text-dark'" style="padding : 0 0 0 0;">{{product.ymd_format}}</div>
                      <div :class="isMobile == true ? 'mobile-lg fw-bold text-success mt-2' : 'fw-bold text-success mt-2'"><p>{{getCurrencyFormat(product.prod_price)}} {{product.prod_price_tp}}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="mt-3" v-if="productList.length < 1" :class="isMobile == true ? 'mobile-lg' : ''">{{ $t("common.common_reg_no_product") }}</div>
      <div v-if="productList.length < 5" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
// import { watch } from 'vue';
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
let timer = null
export default {
  data() {
    return {
      productList: [],
      imgType : "",
      prodId : "",
      prodType : "",
      iprice : 0,
      curUnit : "",
      lang : "",
      resParam : {},
      lanTp : "",
      isMobile : false,
      isLoading : true
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    clearTimeout(timer)
  },
  // beforeUpdated() {
  //   console.log("productList updated")
  //   console.log("this.resParam productlist3: ", this.resParam)
  //   watch(() => this.resParam, () => {
  //     console.log("111111111111")
      
  //     this.init()
  //   }, { deep: true }
  //   )
  // },
  created() {
    console.log("productList1")
    this.resParam = JSON.parse(history.state.reqParam)
    console.log("this.resParam productlist: ", this.resParam)
    this.lanTp = sessionStorage.get('lan_tp')
    timer = setTimeout(() => {
      this.isLoading = true
      this.init()
    }, 1000);
    this.isMobile = this.$isMobile()
  },
  methods: {
    init() {
      this.getProductList();
    },
    calculatePrice(cnt) {
      let total = this.total + cnt;
      if(total < 1) total = 1;
      this.total = total;
      this.totalPrice = this.iprice * this.total;
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getProductList() {
      console.log(this.resParam)
      let prod_unit = ""
      if(this.lanTp == 'CHN') {
        prod_unit = 'CNH'
      } else if(this.lanTp == 'KOR') {
        prod_unit = 'KRW'
      } else {
        prod_unit = 'USD'
      }
      this.productList = await this.$api("/api/productList1",{param:[prod_unit,this.lanTp,this.resParam.prod_type]});
    },
    goToDetail(prod_id, prod_type) {
      let reqParam = {
        prod_id: prod_id,
        prod_type:prod_type,
      }
      this.$router.push({path: "/productDetail", state:{reqParam: JSON.stringify(reqParam)}});
    },
    
  }
}
</script>