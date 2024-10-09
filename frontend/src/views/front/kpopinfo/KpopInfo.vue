<template>
  <main class="mt-1">
    <h5 v-if="!isMobile"  class="text-center bg-info bg-gradient text-white" style="margin: 0;">{{this.resParam.group_nm}}</h5>
    <h6 v-else class="text-center bg-info bg-gradient text-white" style="margin: 0;">{{this.resParam.group_nm}}</h6>
    <div class="col-md-12 col-padding mt-1">
      <div :key="i" v-for="(kpopInfo ,i) in kpopInfoList.filter(c => c.file_type == '1')">
        <a @click="goToDetail(kpopInfo)">
          <div class="card mb-3">
            <div class="row g-0">
              <div class="col-md-4">
                <img :src="`/download/INFO/${kpopInfo.file_path}/${kpopInfo.info_seq}/${kpopInfo.file_type}/${kpopInfo.file_name}`" class="" style="height:100%">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <div :class="isMobile == true ? 'mobile-lg ' : ''"><p class="card-title fw-bold">{{kpopInfo.info_title}}</p></div>
                  <div :class="isMobile == true ? 'mobile-md ' : ''"><p class="card-text text-muted">{{kpopInfo.info_desc}}</p></div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div :class="isMobile == true ? 'mt-3 mobile-lg' : 'mt-3'" v-if="kpopInfoList.length < 1">{{ $t("common.common_reg_no_product") }}</div>
    <div v-if="kpopInfoList.length < 1" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
let timer = null
export default {
  data() {
    return {
      kpopInfoList: [],
      imgType : "",
      trSeq : "",
      trTp : "",
      iprice : 0,
      curUnit : "",
      lang : "",
      lanTp : "",
      info_seq : "",
      resParam : {},
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
  created() {
    this.resParam = JSON.parse(history.state.reqParam)
    this.lanTp = sessionStorage.get('lan_tp')
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.isLoading = true
      this.getKpopInfoList();
    }, 1000);
  },
  methods: {
    calculatePrice(cnt) {
      let total = this.total + cnt;
      if(total < 1) total = 1;
      this.total = total;
      this.totalPrice = this.iprice * this.total;
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getKpopInfoList() {
      this.kpopInfoList = await this.$api("/api/kpopInfoList",{param:[this.lanTp]});
    },
    goToDetail(info) {
      let reqParam = {
        info_seq: info.info_seq,
        category:info.kpop_category,
        group_nm : this.resParam.group_nm,
      }
      this.$router.push({path: "/kpopInfoDetail", state:{reqParam : JSON.stringify(reqParam)}});
    },
  }
}
</script>