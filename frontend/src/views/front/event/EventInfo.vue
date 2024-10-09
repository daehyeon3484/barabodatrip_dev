<template>
  <main class="mt-1">
    <h5 v-if="!isMobile" class="text-center bg-info bg-gradient text-white" style="margin: 0;">{{ $t("common.event_list")}}</h5>
    <h6 v-else class="text-center bg-info bg-gradient text-white" style="margin: 0;">{{ $t("common.event_list")}}</h6>
    <div class="col-md-12 col-padding mt-1">
      <div :key="i" v-for="(events ,i) in evnetInfoList.filter(c => c.file_type == '1')">
        <a @click="goToDetail(events)">
          <div class="card mb-3">
            <div class="row g-0">
              <div class="col-md-4">
                <img :src="`/download/EVENT/${events.file_path}/${events.event_id}/${events.file_type}/${events.file_name}`" class="" style="height: 100%;">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <div :class="isMobile == true ? 'card-title text-dark fw-bold mobile-md' : 'card-title text-dark fw-bold mobile-md'">{{events.event_title}}</div>
                  <div :class="isMobile == true ? 'card-title text-dark fw-bold mobile-md' : 'card-title text-dark fw-bold mobile-md'">{{events.ymd_format}}</div>
                  <div :class="isMobile == true ? 'fw-bold mobile-md' : 'fw-bold'" v-html="events.event_desc"></div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="mt-3" v-if="evnetInfoList.length < 1" :class="isMobile == true ? 'mobile-lg' : ''">{{ $t("common.common_reg_no_product") }}</div>
    <div v-if="evnetInfoList.length < 3" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import { isDEmpty } from '@/is';
let timer = null
export default {
  data() {
    return {
      evnetInfoList: [],
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
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.isLoading = true
      if(isDEmpty(this.evnetInfoList)) {
        this.getEvnetInfoList();
      }
    }, 1000);
    this.resParam = JSON.parse(history.state.reqParam)
    this.lanTp = sessionStorage.get('lan_tp')
  },
  methods: {
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getEvnetInfoList() {
      this.evnetInfoList = await this.$api("/api/eventInfoList",{param:[this.lanTp]});
    },
    goToDetail(info) {
      let reqParam = {
        event_id: info.event_id,
        category:info.event_category,
        group_nm : this.resParam.group_nm,
        lan_tp : this.resParam.lan_tp

      }
      this.$router.push({path: "/eventDetail", state:{reqParam : JSON.stringify(reqParam)}});
    },
  }
}
</script>