<template>
  <main class="mt-1">
    <div class="container">
      <h2 class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("common.notice")}}</h2>
      <div class="col-md-12 col-padding">
        <div class="card mt-1" style="border-radius: 8px;">
          <div class="card-body">
            <h5 class="card-title" style="color : #046582;font-weight: bold;" v-html="communitys.cou_ttl_nm"> </h5>
            <!-- <p>{{$t("common.date_input")}} : {{communitys.cou_ymd_format}}</p> -->
            <div v-html="communitys.cou_content"></div>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="col d-grid p-1">
            <button v-if="communitys.event_id != ''" type="button" @click="goPage('event')" :class="isMobile == true ? 'btn btn-info col-auto btn-st-sm' : 'btn btn-info col-auto btn-st-md'">{{ $t("common.event_input") }}</button>
            <button type="button" @click="goPage('list')" :class="isMobile == true ? 'btn btn-warning col-auto mt-2 btn-st-sm' : 'btn btn-warning col-auto mt-2 btn-st-md'">{{ $t("common.page") }}</button>
            <button type="button" @click="goPage('home')" :class="isMobile == true ? 'btn btn-dark col-auto mt-2 btn-st-sm' : 'btn btn-dark col-auto mt-2 btn-st-md'">{{ $t("common.home") }}</button>
          </div>
        </div>  
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>
<script>
let timer = null
export default {
  data() {
    return {
      lanTp : "",
      resParam : {},
      communitys : {},
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
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.isLoading = true
      this.getCommunityInfo();
    }, 1000);
  },
  methods: {
    async getCommunityInfo () {
      let info = await this.$api('/api/communityDtl',{param:['CG002',this.resParam.cou_id]});
      this.communitys = info[0];
    },
    goPage(type) {
      if(type == 'home') {
        window.location.reload(true)
        window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
      } else {
        let path = ""
        let reqParam = {}
        let data = {}
        if(type == 'event') {
          path = "/eventDetail"
          reqParam = {
            event_id : this.communitys.event_id,
            lan_tp : this.resParam.lan_tp
          }
          data = {
            reqParam : JSON.stringify(reqParam)
          }
        } else if(type == 'list') {
          path = "/communityList"
          reqParam = {
            event_id : this.communitys.event_id,
            lan_tp : this.resParam.lan_tp
          }
          data = {
            reqParam : JSON.stringify(reqParam)
          }
        } 
        this.$router.push({path : path, state : data})
      }
    }
  }
}
</script>



