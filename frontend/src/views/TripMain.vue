<template>
  <main class=""> 
    <div class="continer">
      <vedioComponent v-if="infoList.length > 0" :info="infoList"></vedioComponent>
        <!-- <div v-if="infoList.length > 0" class="row"> 
        <div class="col-md-12 col-padding">
          <div id="carouselExampleDark" class="carousel slide ">
            <div class="carousel-inner mt-1" style="border-radius: 8px;">
              <item :itemText="info.vedio_url"  :key="i" v-for="(info, i) in infoList">
                <div :class="i == 0 ? 'carousel-item active' : 'carousel-item'" >
                  <div v-if="info.vedio_type == '02'"> 
                    <div class="videoContainer iframe16To9">
                      <video 
                        id="video_obj" 
                        autoplay="autoplay" 
                        preload="metadata"
                        loop="loop" 
                        muted="muted"
                        controls controlsList="nodownload"
                        >
                        <source :src="info.vedio_url"  type="video/mp4">
                      </video>
                    </div>
                  </div>
                  <div v-if="info.vedio_type == '04'"> 
                    <div class="videoContainer iframe16To9">
                      <video 
                        id="video_obj" 
                        autoplay="autoplay" 
                        preload="metadata"
                        loop="loop" 
                        muted="muted"
                        controls controlsList="nodownload"
                        >
                        <source :src="`/download/EVENT/202403/EVENT_INFO000001/4/bof.mp4`"  type="video/mp4">
                      </video>
                    </div>
                  </div>
                  <div v-if="info.vedio_type == '03'">  
                    <div class="iframeContainer iframe16To9">
                      <iframe :src="info.vedio_url" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
                    </div>
                  </div>
                  
                </div>
              </item>
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
      </div> -->
      <!-- <hr> -->
      <div v-if="kpopFlag"> 
        <div v-for="(cate, i) in category1.filter(c => c.cd_group_code == 'CG001')" :key="i" class="mt-1"> 
          <div class="row g-3 bg-info">
            <div :class="isMobile == true ? 'col-8 text-start text-white mobile-lg mt-1' : 'col text-start mt-1 text-white' " style="margin: 0 0 0 12px; padding: 0 0 0 0;">
                {{ cate.cd_group_nm }}
            </div>
            <div :class="isMobile == true ? 'col-3 bg-info text-white mobile-lg text-end mt-1' : 'col bg-info text-white text-end mt-1'" style="margin: 0 12px 0 0;padding: 0 0 0 0;">
                <a @click="goList(cate)">{{$t("main.review")}}</a>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-md-12 col-padding"> 
              <Carousel :autoplay="3000" :wrap-around="true">
                <Slide :key="i" v-for="(kpop ,i) in kpopList">
                  <div class="">
                    <a @click="goToDetail(kpop,cate);">
                      <img :src="`/download/${kpop.file_path}/${kpop.prod_id}/1/${kpop.file_name}`" :class="isMobile == true ? 'main-min-img' : 'main-max-img'"  alt="...">
                      <div class="card bg-dark mt-1">
                      <div :class="isMobile == true ? 'card-body fw-bold text-white mobile-lg' :'card-body fw-bold text-white'">
                        <!-- <h5 class="card-title"> -->
                          <div>{{kpop.prod_title}}<br> 
                            {{ kpop.package_type }}
                            <span v-if="kpop.progress_yn == 'Y'" class="badge text-bg-info mobile-md' : 'badge text-bg-info'">{{$t("common.common_progress")}}</span>
                            <span v-if="kpop.progress_yn == 'E'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_deadline")}}</span>
                            <span v-if="kpop.progress_yn == 'W'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_prod_progress")}}</span>
                            <span v-if="kpop.progress_yn == 'D'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_deadline_imminent")}}</span>
                          </div>
                          <div>{{kpop.ymd_format}}</div>
  
                        <!-- </h5> common_progress -->
                        <div class="card-text mt-2">
                          <i class="bi bi-calendar-check"></i>
                          <span :class="isMobile == true ? 'badge text-bg-success me-1 mobile-md' : 'badge text-bg-success me-1'">{{$t("main.kpop_tour")}}</span>
                          <span :class="isMobile == true ? 'badge text-bg-primary me-1 mobile-md' : 'badge text-bg-primary me-1'">{{$t("main.theme_tour")}}</span>
                          <span :class="isMobile == true ? 'badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("main.fan_meetting")}}</span>
                        </div>
                        <div :class="isMobile == true ? 'fw-bold text-center text-success mobile-lg' : 'fw-bold text-center text-success'">{{getCurrencyFormat(kpop.prod_price)}} {{kpop.prod_price_tp}}</div>
                        <!-- <p  v-if="this.$i18n.locale == 'ko'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} 원</p>
                        <p  v-if="this.$i18n.locale == 'ja'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} JPY</p>
                        <p  v-if="this.$i18n.locale == 'cn'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} CNY</p> -->
                      </div>
                    </div>
                    </a>
                  </div>
                </Slide>
              </Carousel>
            </div>
            <div v-if="!kpopFlag" :class="isMobile == true ? 'main-no-data-height text-secondary mt-1 mobile-lg' : 'main-no-data-height text-secondary mt-1'">{{$t("common.common_reg_no_product")}}</div>
          </div>
        </div>
      </div>
      <div v-if="themeFlag"> 
        <div v-for="(cate, i) in category1.filter(c => c.cd_group_code == 'CG002')" :key="i" class="mt-1"> 
          <div class="row g-3 bg-info">
            <div :class="isMobile == true ? 'col-8 text-start mt-1 text-white mobile-lg' : 'col text-start mt-1 text-white' " style="margin: 0 0 0 12px;padding: 0;">
                {{ cate.cd_group_nm }}
            </div>
            <div :class="isMobile == true ? 'col-3 bg-info text-white mobile-lg text-end mt-1' : 'col bg-info text-white text-end mt-1'" style="margin: 0 12px 0 0;padding: 0 0 0 0;">
                <a @click="goList(cate)">{{$t("main.review")}}</a>
            </div>
          </div>
          <div class="row mt-1">
            <div v-if="themeFlag" class="col-md-12 col-padding"> 
              <Carousel :autoplay="3000" :wrap-around="true">
                <Slide :key="i" v-for="(theme ,i) in themeList">
                  <div class="">
                    <a @click="goToDetail(theme,cate);">
                      <img :src="`/download/${theme.file_path}/${theme.prod_id}/1/${theme.file_name}`" :class="isMobile == true ? 'main-min-img' : 'main-max-img'" alt="...">
                      <div class="card bg-dark mt-1">
                        <div :class="isMobile == true ? 'card-body fw-bold text-white mobile-lg' :'card-body fw-bold text-white'">
                        <!-- <h5 class="card-title"> -->
                          {{theme.prod_title}} <span v-if="theme.progress_yn == 'Y'" class="badge text-bg-info mobile-md' : 'badge text-bg-info'">{{$t("common.common_progress")}}</span>
                            <span v-if="theme.progress_yn == 'E'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_deadline")}}</span>
                            <span v-if="theme.progress_yn == 'W'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_prod_progress")}}</span>
                            <span v-if="theme.progress_yn == 'D'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_deadline_imminent")}}</span>
                        <!-- </h5> -->
                        <div class="card-text mt-2">
                          <i class="bi bi-calendar-check"></i>
                          <span :class="isMobile == true ? 'badge text-bg-success me-1 mobile-md' : 'badge text-bg-success me-1'">{{$t("main.kpop_tour")}}</span>
                          <span :class="isMobile == true ? 'badge text-bg-primary me-1 mobile-md' : 'badge text-bg-primary me-1'">{{$t("main.theme_tour")}}</span>
                          <span :class="isMobile == true ? 'badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("main.fan_meetting")}}</span>
                        </div>
                        <div :class="isMobile == true ? 'fw-bold text-center text-success mobile-lg' : 'fw-bold text-center text-success'">{{getCurrencyFormat(theme.prod_price)}} {{theme.prod_price_tp}}</div>
                        <!-- <p  v-if="this.$i18n.locale == 'ko'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} 원</p>
                        <p  v-if="this.$i18n.locale == 'ja'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} JPY</p>
                        <p  v-if="this.$i18n.locale == 'cn'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} CNY</p> -->
                      </div>
                    </div>
                    </a>
                  </div>
                </Slide>
              </Carousel>
            </div>
            <div v-if="!themeFlag" :class="isMobile == true ? 'main-no-data-height text-secondary mt-1 mobile-lg' : 'main-no-data-height text-secondary mt-1'">{{$t("common.common_reg_no_product")}}</div>
          </div>
        </div>
      </div>
      <div v-if="kpopInfoFlag"> 
        <div v-for="(cate, i) in infoCategory.filter(c => c.cd_group_code == 'CG003')" :key="i" class="mt-1"> 
          <div class="row g-3 bg-info">
            <div :class="isMobile == true ? 'col-8 text-start mt-1 text-white mobile-lg' : 'col text-start mt-1 text-white' " style="margin: 0 0 0 12px;padding: 0;">
                {{ cate.cd_group_nm }}
            </div>
            <div :class="isMobile == true ? 'col-3 bg-info text-white mobile-lg text-end mt-1' : 'col bg-info text-white text-end mt-1'" style="margin: 0 12px 0 0;padding: 0 0 0 0;">
                <a @click="goList(cate)">{{$t("main.review")}}</a>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-md-12 col-padding"> 
              <Carousel :autoplay="5000" :wrap-around="true">
                <Slide :key="i" v-for="(kpopInfo ,i) in kpopInfoList.filter(c => c.file_type == '1')">
                  <div class="" >
                    <a @click="goToDetail(kpopInfo, cate);">
                      <img :src="`/download/INFO/${kpopInfo.file_path}/${kpopInfo.info_seq}/${kpopInfo.file_type}/${kpopInfo.file_name}`" :class="isMobile == true ? 'main-min-img' : 'main-max-img'" alt="...">
                      <div class="card bg-dark mt-1" style="border-radius: 8px;">
                        <div :class="isMobile == true ? 'card-body fw-bold text-white mobile-lg' :'card-body fw-bold text-white'">
                          <!-- <h5 class="card-title"> -->
                            <div>{{kpopInfo.info_title}}</div>
                            <div>{{kpopInfo.ymd_format}}</div>
                          <!-- </h5> -->
                          <!-- <p class="card-text">
                            <i :class="isMobile == true ? 'bi bi-calendar-check text-white mobile-md' : 'bi bi-calendar-check text-white '">{{kpopInfo.info_desc}}</i>
                          </p> -->
                        </div>
                      </div>
                    </a>
                  </div>
                </Slide>
              </Carousel>
            </div>
          </div>
          <div v-if="!kpopInfoFlag" :class="isMobile == true ? 'main-no-data-height text-secondary mt-1 mobile-lg' : 'main-no-data-height text-secondary mt-1'">{{$t("common.common_reg_no_kpopinfo")}}</div>
        </div>
      </div>
      <div v-if="enterFlag">
        <div v-for="(cate, i) in infoCategory.filter(c => c.cd_group_code == 'CG004')" :key="i" class="mt-1"> 
          <div class="row g-3 bg-info">
            <div :class="isMobile == true ? 'col-8 text-start mt-1 text-white mobile-lg' : 'col text-start mt-1 text-white' " style="margin: 0 0 0 12px;padding: 0;">
                {{ cate.cd_group_nm }}
            </div>
            <div :class="isMobile == true ? 'col-3 bg-info text-white mobile-lg text-end mt-1' : 'col bg-info text-white text-end mt-1'" style="margin: 0 12px 0 0;padding: 0 0 0 0;">
                <a @click="goList(cate)">{{$t("main.review")}}</a>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-md-12 col-padding"> 
              <Carousel :autoplay="3000" :wrap-around="true">
                <Slide :key="i" v-for="(enters ,i) in enterList">
                  <div class="">
                    <a @click="goToDetail(enters,cate);">
                      <img :src="`/download/${enters.file_path}/${enters.prod_id}/1/${enters.file_name}`" :class="isMobile == true ? 'main-min-img' : 'main-max-img'" alt="...">
                      <div class="card bg-dark mt-1">
                        <div :class="isMobile == true ? 'card-body fw-bold text-white mobile-lg' :'card-body fw-bold text-white'">
                        <!-- <h5 class="card-title"> -->
                          {{enters.prod_title}} <span v-if="enters.progress_yn == 'Y'" class="badge text-bg-info mobile-md' : 'badge text-bg-info'">{{$t("common.common_progress")}}</span>
                            <span v-if="enters.progress_yn == 'E'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_deadline")}}</span>
                            <span v-if="enters.progress_yn == 'W'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_prod_progress")}}</span>
                            <span v-if="enters.progress_yn == 'D'" class="badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("common.common_deadline_imminent")}}</span>
                        <!-- </h5> -->
                        <div class="card-text mt-2">
                          <i class="bi bi-calendar-check"></i>
                          <span :class="isMobile == true ? 'badge text-bg-success me-1 mobile-md' : 'badge text-bg-success me-1'">{{$t("main.kpop_tour")}}</span>
                          <span :class="isMobile == true ? 'badge text-bg-primary me-1 mobile-md' : 'badge text-bg-primary me-1'">{{$t("main.theme_tour")}}</span>
                          <span :class="isMobile == true ? 'badge text-bg-danger mobile-md' : 'badge text-bg-danger'">{{$t("main.fan_meetting")}}</span>
                        </div>
                        <div :class="isMobile == true ? 'fw-bold text-center text-success mobile-lg' : 'fw-bold text-center text-success'">{{getCurrencyFormat(enters.prod_price)}} {{enters.prod_price_tp}}</div>
                        <!-- <p  v-if="this.$i18n.locale == 'ko'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} 원</p>
                        <p  v-if="this.$i18n.locale == 'ja'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} JPY</p>
                        <p  v-if="this.$i18n.locale == 'cn'" class="small-text">{{getCurrencyFormat(theme.prod_price)}} CNY</p> -->
                      </div>
                    </div>
                    </a>
                  </div>
                </Slide>
              </Carousel>
            </div>
          </div>
          <div v-if="!enterFlag" :class="isMobile == true ? 'main-no-data-height text-secondary mt-1 mobile-lg' : 'main-no-data-height text-secondary mt-1'">{{$t("common.common_reg_no_product")}}</div>
        </div>
      </div>
      <div v-if="eventFlag"> 
        <div v-for="(cate, i) in infoCategory.filter(c => c.cd_group_code == 'CG005')" :key="i" class="mt-1"> 
          <div class="row g-3 bg-info">
            <div :class="isMobile == true ? 'col-8 text-start mt-1 text-white mobile-lg' : 'col text-start mt-1 text-white' " style="margin: 0 0 0 12px;padding: 0;">
                {{ cate.cd_group_nm }}
            </div>
            <div :class="isMobile == true ? 'col-3 bg-info text-white mobile-lg text-end mt-1' : 'col bg-info text-white text-end mt-1'" style="margin: 0 12px 0 0;padding: 0 0 0 0;">
                <a @click="goList(cate)">{{$t("main.review")}}</a>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-md-12 col-padding"> 
              <Carousel :autoplay="5000" :wrap-around="true">
                <Slide :key="i" v-for="(events ,i) in eventList.filter(c => c.file_type == '1')">
                  <div class="" >
                    <a @click="goToDetail(events, cate);">
                      <img :src="`/download/EVENT/${events.file_path}/${events.event_id}/${events.file_type}/${events.file_name}`" :class="isMobile == true ? 'main-min-img' : 'main-max-img'" alt="...">
                      <div class="card bg-dark" style="border-radius: 8px;">
                        <div class="card-body"> 
                          <div :class="isMobile == true ? 'card-body fw-bold text-white mobile-lg' :'card-body fw-bold text-white'" style="padding : 0 0 0 0;">{{events.event_title}}</div>
                          <div :class="isMobile == true ? 'card-body fw-bold text-white mobile-lg' :'card-body fw-bold text-white'" style="padding : 0 0 0 0;">{{events.ymd_format}}</div>    
                          <div :class="isMobile == true ? 'text-white mobile-md' : 'text-white'" v-html="events.event_desc"></div>
                        </div>
                      </div>
                    </a>
                  </div>
                </Slide>
              </Carousel>
            </div>
          </div>
          <div v-if="!eventFlag" :class="isMobile == true ? 'main-no-data-height text-secondary mt-1 mobile-lg' : 'main-no-data-height text-secondary mt-1'">{{$t("common.event_nodata")}}</div>
        </div>
      </div>
      <div v-if="!eventFlag && !kpopFlag && !enterFlag && !themeFlag && !kpopInfoFlag" :class="isMobile == true ? 'main-no-datas-height text-secondary mt-1 mobile-lg' : 'main-no-datas-height text-secondary mt-1'">{{$t("common.common_prod_progress")}}</div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
    <modalPopup v-if="communityFlag" :community="this.communityList"></modalPopup>
  </main>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import {isDEmpty} from '@/is';
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import modalPopup from '@/components/ModalPopup.vue'
import vedioComponent from '@/components/VedioComponent.vue';
// const vedioComponent = () => import(/* webpackChunkName: "vedioComponent" */ "@/components/VedioComponent.vue");


let timer = null
export default defineComponent({
  // name: 'WrapAround',
  components: {
    Carousel,
    Slide,
    modalPopup,
    vedioComponent,

    // noticePop
  },
  data() {
    return {
      prodCategory : "",
      kpopList : [],
      themeList : [],
      enterList : [],
      eventList : [],
      kpopFlag : true,
      themeFlag : true,
      enterFlag : true,
      eventFlag : true,
      communityFlag : true,
      kpopInfoFlag : true,
      groupCategoryList : [],
      imgType : "img",
      fileName1 : "20190528142932.jpg",
      fileName2 : "BUSAN_ONASIA_FESTIVAL.png",
      fileName3 : "life_photo_en.jpg",
      fileName4 : "sanmo_main_en.png",
      // vedioSrc : "https://bof.or.kr/type/a00/images/video/nct127_k.mp4",
      // vedioSrc : "https://bof.or.kr/type/a00/images/video/treasure_k.mp4",
      vedioSrc1 : "//player.bilibili.com/player.html?aid=746504762&bvid=BV1Br4y1f7vD&cid=1282328199&p=1",
      vedioSrc2 : "https://bof.or.kr/type/a00/images/video/nct127_k.mp4",
      vedioSrc3 : "//player.bilibili.com/player.html?aid=1853942344&bvid=BV1Ps421K7fu&cid=1525181605&p=1",
      lanTp : "",
      category1:[],
      infoCategory:[],
      kpopInfoList : [],
      resParam : {},
      nodata : false,
      popupData : {},
      targetId : "",
      popupFlag : false,
      communityList : [],
      isMobile : false,
      infoList : [],
      company_type : "",
      isLoading : true,
    }
  },
  watch:{
    lanTp : {
      handler( newVal, oldVal ){
        console.log( 'newVal:', newVal, 'oldVal:', oldVal )
        this.lanTp = newVal
      },
      deep: true
    },
  },
  async mounted() {
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    console.log("unmounted")
    // this.communityList = null
    // this.kpopList = null
    // this.kpopFlag = null
    // this.themeList = null
    // this.themeFlag = false
    // this.enterList = null
    // this.enterFlag = false
    // this.kpopInfoList = null
    // this.kpopInfoFlag = false
    // this.eventList = null
    // this.eventFlag = false
    clearTimeout(timer)
  },
  created() {
    this.isMobile = this.$isMobile()
    if(!isDEmpty(this.$route.query.lan_tp)) {
      this.lanTp = this.$route.query.lan_tp
    } else {
      this.lanTp = sessionStorage.get('lan_tp')
    }
    timer = setTimeout(() => {
      this.isLoading = true
      this.init()
    }, 1000);
    this.company_type = this.$route.query.company_type
    
  },
  methods: {
    async init() {
      this.monitorHistory()
      this.getMainList()
      this.getKpopInfoList()
      this.getEventList()
      this.getGrpCategoryList();  
      this.getComunityList();  
    },
    async monitorHistory() {
      console.log("monitorHistory");
      sessionStorage.set('company_type',this.company_type)

      let info = {
        os_type : this.$isMobile() ? 'mobile' : 'web',
        locale : navigator.language || navigator.userLanguage,
        company_type : this.company_type
      }
      console.log(info)
      await this.$api('/monitorHistory', {info})
    },
    async getComunityList() {
      let communityList = await this.$api('/api/communityList', {param : ['CG002',this.lanTp, {"a.popup_yn" : "Y"}]})
      if(!isDEmpty(communityList)) {
        this.communityFlag = true
        // this.communityList.push(communityList)
        this.communityList = communityList
      }
      // console.log("this.communityList : ", this.communityList)
    },
    async getGrpCategoryList() {
      let groupCategoryList = await this.$api('/api/grpCategoryList', {});
      let oCategory = []
      let iCategory = []
      // console.log("this.lanTp : ", this.lanTp)
      groupCategoryList.forEach(item => {
        let cdGroupNm = ""
        if(!(item.cd_group_code == 'CG003' || item.cd_group_code == 'CG004'|| item.cd_group_code == 'CG005')) {
          if(this.lanTp == 'KOR') {
            cdGroupNm = item.cd_group_nm
          } else if(this.lanTp == 'ENG') {
            cdGroupNm = item.cd_group_en_nm
          } else if(this.lanTp == 'JPN') {
            cdGroupNm = item.cd_group_jp_nm
          } else if(this.lanTp == 'VTN') {
            cdGroupNm = item.cd_group_vn_nm
          } else {
            cdGroupNm = item.cd_group_cn_nm
          }
          oCategory.push({ 
            cd_group_code :  item.cd_group_code,
            cd_group_nm : cdGroupNm
          })
        } else {
          if(this.lanTp == 'KOR') {
            cdGroupNm = item.cd_group_nm
          } else if(this.lanTp == 'ENG') {
            cdGroupNm = item.cd_group_en_nm
          } else if(this.lanTp == 'JPN') {
            cdGroupNm = item.cd_group_jp_nm
          } else if(this.lanTp == 'VTN') {
            cdGroupNm = item.cd_group_vn_nm
          } else {
            cdGroupNm = item.cd_group_cn_nm
          }
          iCategory.push({ 
            cd_group_code :  item.cd_group_code,
            cd_group_nm : cdGroupNm
          })
        } 
      });
      this.category1 = oCategory
      this.infoCategory = iCategory
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getMainList() {
      let prod_unit = ""
      if(this.lanTp == 'CHN') {
        prod_unit = 'CNH'
      } else if(this.lanTp == 'KOR') {
        prod_unit = 'KRW'
      } else {
        prod_unit = 'USD'
      }
      let productList = await this.$api("/api/productList", {param:[prod_unit, this.lanTp]});
      console.log("this.productList : ", this.productList)
      // let kpops = []
      // let themes = null
      // let enters = null
      if(productList.length > 0) {
        this.kpopList = productList.filter( kpop => kpop.prod_type == 'CG001')
        this.kpopFlag = !isDEmpty(this.kpopList) ? true : false
        this.themeList = productList.filter( theme => theme.prod_type == 'CG002')
        this.themeFlag = !isDEmpty(this.themeList) ? true : false
        this.enterList = productList.filter( enter => enter.prod_type == 'CG004')
        this.enterFlag = !isDEmpty(this.enterList) ? true : false
      }
      console.log("kpops  :", !isDEmpty(this.kpopList))
      
      // let info = this.kpopInfoList
      // this.kpopList = kpops
      // this.themeList= themes
      // this.enterList = enters
      
    },
    async getKpopInfoList() {
      let kpopInfoList = await this.$api("/api/kpopInfoList", {param:[this.lanTp]});
      this.infoList = []
      let vedioArray = []
      if(!isDEmpty(kpopInfoList)) {
        let i = 0
        kpopInfoList.forEach(item => {
          let vedioUrl = kpopInfoList[i].vedio_url.split(",",-1);  
          let data = {
            vedio_url : vedioUrl[0],
            vedio_type : item.vedio_type,
            info_title : item.info_title
          }
          vedioArray.push(data);
          i++
        })

        this.infoList.push(...vedioArray);
      this.kpopInfoList.push(...kpopInfoList)
        this.kpopInfoFlag =  true
      }
      
    },
    async getEventList() {
      let eventList = await this.$api("/api/eventInfoList", {param:this.lanTp});
      if(!isDEmpty(eventList)) {
        this.eventFlag = true
        this.eventList.push(...eventList)
      }
    },
    goToDetail(info, cate) {
      let path = "";
      let reqParam = {}
      if(cate.cd_group_code == 'CG003') {
        path = "/kpopInfoDetail";
        reqParam = {
          info_seq: info.info_seq,
          prod_type:cate.cd_group_code,
          group_nm : cate.cd_group_nm,
        }
      } else if(cate.cd_group_code == 'CG004') {
        reqParam = {
          prod_id: info.prod_id,
          prod_type:cate.cd_group_code,
          group_nm : cate.cd_group_nm,
        }
        console.log("reqParam11 : ", reqParam) 
        path = "/enterProgram";
      } else if(cate.cd_group_code == 'CG005') {
        reqParam = {
          event_id: info.event_id,
          prod_type:cate.cd_group_code,
          group_nm : cate.cd_group_nm,
        }
        console.log("reqParam11 : ", reqParam) 
        path = "/eventDetail";
      } 
      else {
        reqParam = {
          prod_id: info.prod_id,
          prod_type:cate.cd_group_code,
          group_nm : cate.cd_group_nm,
          prod_category : info.prod_category,
          lan_tp : this.lanTp,
          changeFlag : false
        }
        path = "/productDetail";
      }
      console.log("reqParam : ", reqParam)
      this.$router.push({path: path, state :{reqParam: JSON.stringify(reqParam)}});
    },
    goList(cate){
      let path = "";
      if(cate.cd_group_code == 'CG003') {
        path = "/kpopInfo";
      } else if(cate.cd_group_code == 'CG004') {
        path = "/enterList";
      } else if(cate.cd_group_code == 'CG005') {
        path = "/eventInfo";
      } else {
        path = "/productList";
      }
      let reqParam = {
        prod_type:cate.cd_group_code,
        group_nm:cate.cd_group_nm,
      }
      this.$router.push({path: path, state:{reqParam: JSON.stringify(reqParam)}});
    },
    goEventReserv() {
      let reqParam = {
        lan_tp : this.lanTp
      }
      this.$router.push({path : '/eventInfo', state : {reqParam : JSON.stringify(reqParam)}})
    }
  }
});
</script>
