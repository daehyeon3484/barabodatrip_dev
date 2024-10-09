<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info text-light">{{ $t("common.notice") }}{{ $t("common.list") }}</h5>
      <h6 v-else class="text-center bg-info text-light">{{ $t("common.notice") }}{{ $t("common.list") }}</h6>
      <table class="table table-hover table-sm" style="cursor: pointer;">
        <thead class="table-secondary">
          <tr>
            <th scope="col" :class="isMobile == true ? 'text-center font-md' : 'text-center font-lg'" align="center" valign="middle">{{ $t("common.gubun") }}</th>
            <th scope="col" :class="isMobile == true ? 'text-center font-md' : 'text-center font-lg'" align="center" valign="middle">{{ $t("common.subject") }}</th>
          </tr>
        </thead>
        <tbody class="table-white">
          <tr :key="i" v-for="(comunity, i) in communityList" @click="goPage('detail',comunity)">
            <td width="30%" :class="isMobile == true ? 'text-truncate text-center font-md text-info' : 'text-truncate text-center font-lg text-info'" align="center" valign="middle">{{comunity.event_id != null ? $t("common.event") : $t("common.notice")}}</td>
            <td width="%" :class="isMobile == true ? 'text-truncate text-center font-md text-danger' : 'text-truncate text-center font-lg text-danger'" align="center" valign="middle" v-html="comunity.cou_ttl_nm"></td>
          </tr>
          <tr v-if="communityList.length < 1">
          <td colspan="3" :class="isMobile == true ? 'text-center font-md' : 'text-center font-lg'">{{ $t("common.community_nodata") }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="communityList.length < 5" :class="isMobile == true ? 'mobile-nodata-height' : 'pc-nodata-height'"></div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="col d-grid p-1">
          <button type="button" @click="goPage('home','1')" :class="isMobile == true ? 'btn btn-dark col-auto mt-2 btn-st-sm' : 'btn btn-dark col-auto mt-2 btn-st-md'">{{ $t("common.home") }}</button>
        </div>
      </div>  
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import { isDEmpty } from '@/is';
let timer = null
export default {
  data() {
    return {
      communityList : [],
      lanTp : "",
      cou_id : "",
      resParam : {},
      isMobile : false,
      isLoading : true,
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
    timer = setTimeout(() => {
      if(isDEmpty(this.communityList)) {
        this.isLoading = true
        this.getComunityList();
      }
    }, 1000);
    this.isMobile = this.$isMobile()
    // this.lanTp = this.$route.query.lan_tp;
    this.resParam = JSON.parse(history.state.reqParam)
    
  },
  methods: {
    async getComunityList() {
      this.communityList = await this.$api('/api/communityList', {param : ['CG002',this.resParam.lan_tp, {"a.rls_yn" : "Y"}]})
      console.log("this.communityList : ", this.communityList)
    },
    goPage(type,info) {
      if(type == 'home'){
        window.location.reload(true)
        window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
        // this.$router.push({path: '/'})
      } else {
        let reqParam = {
          lan_tp : this.resParam.lan_tp,
          cou_id : info.cou_id
        }
        this.$router.push({path: '/communityDetail', state:{reqParam : JSON.stringify(reqParam)}})
      }
    },
    
  }
}
</script>







