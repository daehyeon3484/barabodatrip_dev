<template>
  <div id="vedioDiv" v-if="infoFlag" class="row"> 
    <div class="col-md-12 col-padding">
      <div id="carouselExampleDark" class="carousel slide carousel-fade" data-bs-touch="false">
        <div class="carousel-inner mt-1" style="border-radius: 8px;">
          <div :key="i" v-for="(info, i) in this.infoList">
            <div :class="i == 0 ? 'carousel-item active' : 'carousel-item'" >
              <div v-if="info.vedio_type == '02'"> 
                <div class="videoContainer iframe16To9">
                  <video
                    :autoplay="false" 
                    preload="metadata"
                    :loop="false" 
                    :muted="false"
                    controls controlsList="nodownload"
                    >
                    <source :src="info.vedio_url"  type="video/mp4">
                    <!-- <source src="https://vod.kbs.co.kr/index.html?source=episode&sname=vod&stype=vod&program_code=T2023-0087&program_id=PS-2023071917-01-000&broadcast_complete_yn=Y&local_station_code=00&section_code=04&section_sub_code=01"  type="video/mp4"> -->
                  </video>
                </div>
              </div>
              <div v-if="info.vedio_type == '04'"> 
                <div class="videoContainer iframe16To9">
                  <!-- poster="/download/202405/PRD000002/1/20240511183559560.jpg" -->
                  <video 
                    :autoplay="false" 
                    preload="metadata"
                    :loop="false" 
                    :muted="false"
                    controls
                    >
                    <source :src="`/download/EVENT/202403/EVENT_INFO000001/4/${info.vedio_url}?loop=true`"  type="video/mp4">
                  </video>
                </div>
              </div>
              <div v-if="info.vedio_type == '03'">  
                <div class="iframeContainer iframe16To9">
<!-- <iframe width="560" height="315" data-src="https://www.youtube.com/embed/xxxxxxxxx" data-cookiescript="accepted" alt="Please accept cookie policy first" frameborder="0" allowfullscreen></iframe> -->
<!-- <iframe width="560" height="315" data-src="`${info.vedio_url}?autoplay=1&mute=0`" 
  autoplay scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" alt="Please accept cookie policy first"
  data-cookiescript="accepted" ></iframe> -->
                  <!-- <iframe :data-src ="`${info.vedio_url}`" border="0" frameborder="no" framespacing="0" allowfullscreen="true" data-cookiescript="accepted" data-cookiecategory="targeting functionality"></iframe> -->
                  <iframe :id="`frame${i}`" :src ="`${info.vedio_url}`"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let timer = null
// import { isDEmpty } from '@/is'
export default {
  data() {
    return {
      cloneList : [],
      infoList : [],
      infoFlag : false    
    }
  },
  props : {
    info : Array
  },
  mounted() {
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    this.infoList = null
    this.infoFlag = false
    this.$props.info = null
    // $('iframe').remove()
    clearTimeout(timer)
    
  },
  created() {
    timer = setTimeout(() => {
      this.infoFlag = true
      this.isLoading = true
      console.log("this.$props.info1 : ", this.$props.info)
      this.init(this.$props.info)
    }, 1000);
  },
  methods : {
    init(infos) {
      this.infoList = infos
    }
  }

}
</script>

<style>

</style>