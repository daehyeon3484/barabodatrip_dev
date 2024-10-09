<template>
  <div class="col-md-12 col-padding"> 
    <div class="card mt-1" style="border-radius: 8px;">
      <div class="card-body">
        <div v-html="companys.company_content"></div>
      </div>
    </div>
  </div>
</template>

<script>
let timer = null
export default {
  data() {
      return {
        companys : {},
        isMobile : false,
        infoParam : {}
      }
  },
  mounted() {
    
    timer = setTimeout(() => {
      this.init()
    }, 1000);
    
  },
  unmounted() {
      clearTimeout(timer)
  },
  created() {
    
    this.infoParam = JSON.parse(history.state.reqParam)
  },
  methods : {
    async init() {
      let info = await this.$api("/api/companyDtl",{param:[this.infoParam.lan_tp]});
      this.companys = info[0];
      this.isMobile = this.$isMobile()
      console.log("this.isMobile :", this.isMobile)
    }
  }
}
</script>

<style>

</style>