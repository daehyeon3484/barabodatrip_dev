button<template>
  <main class="">
    <div id="app">
    <div id="container">
      <!-- <nav class="navbar navbar-dark bg-dark fixed-top"> -->
      <nav class="navbar navbar-dark bg-dark col-xs-6">
        <div class="container-fluid nav-div1">
          <div class="nav-div">
            <!-- <router-link class="navbar-brand" to="/"> -->
            <router-link class="navbar-brand" :to="{ path: '/', query: { lan_tp: lanTp}}">
              <img class="logo-img" src="./img/logo-1.png" alt="" >
            </router-link>
          </div>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">바라보다트립</h5>
              
              <a v-if="user.mem_id!=undifined" data-bs-dismiss="offcanvas" @click="goMyCart"> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-cart4 my-cart" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                </svg>
              </a>
              <button id="closeBtn" type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" ></button>
            </div>
            <div class="offcanvas-body"><!-- :data-bs-dismiss=items[0].offcanvas -->
              <!-- <select class="form-select form-select mb-3" v-model="$i18n.locale" @change="selLangChange($event)" ref="sel" @click="offCanvasChange" :data-bs-dismiss="this.offcanvas"> -->
              <select class="form-select form-select mb-3" v-model="$i18n.locale" @change="selLangChange($event)" ref="sel">
                <!-- <option  :value="item.nation_real_cd" v-for="(item, index) in nationList.filter(c => c.nation_real_cd == this.$i18n.locale)" :key="index">{{ item.nation_nm }}</option> -->
                <option  :value="item.nation_real_cd" v-for="(item, index) in nationList" :key="index">{{ item.nation_nm }}</option>
                <!-- <option  value="CHN">중국</option> -->
              </select>
              <!-- <form class="d-flex mt-2"> -->
              <form class="d-flex d-grid gap-2 d-md-flex mt-2">
                <button v-if="user.mem_id==undifined" class="btn btn-danger  btn-sm me-md-2" type="button" data-bs-dismiss="offcanvas"  @click="login">{{$t('main.login')}}</button>
                <!-- <button class="btn btn-danger btn-sm" type="button" data-bs-dismiss="offcanvas"  @click="logout">{{$t('main.login_out')}}</button> -->
                <button v-else class="btn btn-danger btn-sm" type="button" data-bs-dismiss="offcanvas"  @click="logout">{{$t('main.login_out')}}</button>
              </form>
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3 mt-3 text-start">
                <li v-if="user.mem_id!=undifined && paymentCnt > 0" class="nav-item">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goPaymentInfo" style="cursor:pointer;">{{$t('common.order_confirm_list')}}</a>
                </li>
                <li v-if="user.mem_id!=undifined" class="nav-item">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goMyInfo" style="cursor:pointer;">{{$t('main.myinfo')}}</a>
                </li>
                <li class="nav-item" v-for="(cate, i) in this.category1" :key="i">
                 <a class="nav-link" aria-current="page" data-bs-dismiss="offcanvas" @click="goList(cate)" style="cursor:pointer;">{{ cate.cd_group_nm }}</a>
                </li>
                <!-- <li class="nav-item">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goList()" style="cursor:pointer;">{{$t('main.theme_list')}}</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goList()" style="cursor:pointer;">{{$t('main.kpop_info')}}</a>
                </li> -->
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <router-view :key="$route.fullPath"></router-view>
      <!-- <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">{{$t('main.login')}}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <kakao ref="kakao"/>
                <facebook ref="facebook"/>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"  @click="modalClose">Close</button>
                <button type="button" class="btn btn-primary">Understood</button>
            </div>
            </div>
        </div>
      </div> -->

      <footer class="mt-3 bg-dark">
          <div class="row">
            <div class="col-12 col-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="d-block mb-2" role="img" viewBox="0 0 24 24"><title>Product</title><circle cx="12" cy="12" r="10"/><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"/></svg>
            </div>
              <ul class="list-unstyled text-small">
                <small><li class="link-secondary">Copyright © Enabled 2023 All Rights Reserved.</li></small>
                <small><li class="link-secondary">BarabodaTrip Corp.</li></small>
                <!-- <li><a class="link-secondary" href="#">tel :+82 1666-0046 email : barabodatrip@gmail.com</a></li> -->
                <small><li><a class="link-secondary" href="#">email : barabodatrip@gmail.com</a></li></small>
                <small><li><a class="link-secondary" href="#">Business license number : 249-86-01520</a></li></small>
                <small><li><a class="link-secondary" href="#">Address : 15-5, Incheon tower-daero 54beon-gil, <br>Yeonsu-gu, Incheon, Republic of Kore</a></li></small>
                <small><li><span><a class="link-secondary" @click="goPrivacy('terms')">Terms & Conditions</a></span></li></small>
                <small><li><span><a class="link-secondary" @click="goPrivacy('policy')">Privacy Policy</a></span></li></small>
              </ul>
          </div>
      </footer>
    </div>
  </div>
  </main>
</template>
<script>
// import {isDEmpty} from '@/is';
import {generateSessionStorage} from '@/storage'
import { isDEmpty } from './is';
const sessionStorage = generateSessionStorage()
export default {
  name : 'App',
  data() {
    return {
      isMobile : false,
      lanTp: "",
      lang : "",
      originLanTp : "",
      userChk :""  ,
      admChk :""  ,
      nationList : [],
      width : 0,
      height : 0,
      offcanvas : "",
      locale : "",
      groupCategoryList : [],
      category1:[],
      category2:[],
      paymentCnt : 0
    }
  },
  computed : {
    user() {
      console.log("this.$store.state.user :", this.$store.state.user);
      return this.$store.state.user
    }
  },
  mounted() {
    // this.goAdminChk();
    // this.onResize();
    // window.addEventListener('resize', this.handleResize);
    // window.addEventListener('resize', this.onResize, { passive: true })
    if(!isDEmpty(sessionStorage.get('lan_tp'))) {
      this.lanTp = sessionStorage.get('lan_tp')
    }
  },
  created(){
    console.log("lanchan : ", isDEmpty(sessionStorage.get('lan_tp')))
    if(isDEmpty(sessionStorage.get('lan_tp'))) {
      this.getLangChange();
    } else {
      this.lang = sessionStorage.get('locale')
      this.$i18n.locale = sessionStorage.get('locale')
      console.log("sessionStorage.get('locale') : ", sessionStorage.get('locale'))
    }
    console.log("this.$route.query.lan_tp : ", this.lanTp)
    this.getNationList();
    this.getGrpCategoryList()
    
  },
  methods : {
    goPage() {
      this.$router.push({path : '/', query : {lan_tp : sessionStorage.get('lan_tp')}})
    },
    
    getLangChange() {
      let locale = navigator.language || navigator.userLanguage
       console.log(locale);
      locale = locale.substring(0, 2);
      console.log("locale : ",locale)
      // if (locale == 'zh') {
      //   locale = 'zh' // 한국어가 아닌 경우 무조건 중국어로 설정
      // }
      this.$i18n.locale = isDEmpty(sessionStorage.get('locale')) ? locale : sessionStorage.get('locale')
      console.log("this.$i18n.locale : ",this.$i18n.locale)
      switch(this.$i18n.locale) {
        case 'ko' : 
          this.lanTp = "KOR";
          break;
        // case 'zh' :
        //   this.lanTp = "CHN";
        //   break;
        case 'cn' :
          this.lanTp = "CHN";
          break;
        // case 'ii' :
        //   this.lanTp = "CHN";
        //   break;
        case 'en' :
          this.lanTp = "ENG";
          break;
        case 'ja' :
          this.lanTp = "JPN";
          break;
        case 'jp' :
          this.lanTp = "JPN";
          break;
        default : 'KOR'
      }
      this.lang = locale
      sessionStorage.set('locale',locale)
      sessionStorage.set('lan_tp',this.lanTp)
      console.log("sessionStorage lo : ",sessionStorage.get('locale'))
      console.log("sessionStorage lan_tp : ",sessionStorage.get('lan_tp'))
      console.log("this.lanTp :", this.lanTp)
      // this.$router.push({path: "/", query : {lan_tp : this.lanTp}});
    },
    async getGrpCategoryList() {
      let groupCategoryList = await this.$api('/api/grpCategoryList', {});
      let cnt = await this.$api('/api/paymentCnt', {param : ['T', this.user.mem_id, this.lanTp]})
      this.paymentCnt = cnt[0].paymentCnt
      console.log("cnt.paymentCnt : ", cnt[0].paymentCnt)
      
      this.groupCategoryList = groupCategoryList
      let oCategory = []
      groupCategoryList.forEach(item => {
        let cdGroupNm = ""
        if(this.lanTp == 'KOR') {
          cdGroupNm = item.cd_group_nm
        } else if(this.lanTp == 'ENG') {
          cdGroupNm = item.cd_group_en_nm
        } else if(this.lanTp == 'JPN') {
          cdGroupNm = item.cd_group_jp_nm
        } else {
          cdGroupNm = item.cd_group_cn_nm
        }
        oCategory.push({ 
          cd_group_code :  item.cd_group_code,
          cd_group_nm : cdGroupNm
        })
      });
      console.log(oCategory)
      this.category1 = oCategory
    },
    async getNationList() {
      let locale = navigator.language || navigator.userLanguage
      console.log(locale);
      locale = locale.substring(0, 2);
      let nationList = await this.$api("/api/nationCodeList", {param:[{use_yn : 'Y'}]});
      let onation = []
      nationList.forEach(item => {
        onation.push({
          // nation_real_cd : item.nation_real_cd,
          nation_real_cd : item.nation_cd,
          nation_nm : item.nation_nm
        })
      })
      this.nationList = onation
      
    },
    
    async selLangChange(event){
      sessionStorage.remove('locale')
      sessionStorage.remove('lan_tp')
      let lang = event.target.value;
      this.$i18n.locale = lang
      switch(lang) {
        case 'ko' : 
          this.lanTp = "KOR";
          break;
        // case 'zh' :
        //   this.lanTp = "CHN";
        //   break;
        case 'cn' :
          this.lanTp = "CHN";
          break;
        // case 'ii' :
        //   this.lanTp = "CHN";
        //   break;
        case 'en' :
          this.lanTp = "ENG";
          break;
        case 'ja' :
          this.lanTp = "JPN";
          break;
        case 'jp' :
          this.lanTp = "JPN";
          break;
        default : 'KOR'
      }
      console.log("this.lanTp change :", this.lanTp)
      sessionStorage.set('locale', event.target.value)
      sessionStorage.set('lan_tp', this.lanTp)
      console.log("app change1 : ", sessionStorage.get('locale'))
      console.log("app change2 : ", sessionStorage.get('lan_tp'))
      this.$router.push({path: "/", query : {lan_tp : this.lanTp}});
      // setTimeout(function(){
      //   // this.offcanvas = "offcanvas";
      //   // console.log("this.offcanvas : ", this.offcanvas);
      // }, 1000);
        // this.btnClose()
      this.getGrpCategoryList()
      let HForm = document.querySelector("#closeBtn")
      HForm.click()
    },
    
    offCanvasChange(){
      this.offcanvas = "";
    },
    async login() {
      this.$router.push({path: "/login"});
      // this.$router.push({path: "/login", state : {reqParam : JSON.stringify(reqParam)}});
    },
    async logout() {
      // await this.$api(`/api/logout`,  {});
      // if(this.user.sns_type =='facebook') {
        // this.$refs.facebook.logout()
      // } else {
        window.location.href = '/auth/logout'
      // }

    },
    goList(category){
      let path = "";
      if(category.cd_group_code == 'CG003') {
        path = "/kpopInfo";
      } else if(category.cd_group_code == 'CG002') {
        path = "/themeList";
      } else if(category.cd_group_code == 'CG004') {
        path = "/enterList";
      } else {
        path = "/productList";
      }
      let reqParam = {
        prod_type:category.cd_group_code,
        group_nm:category.cd_group_nm
      }
      console.log("reqParam : ",reqParam);
      this.$router.push({path: path, state : {reqParam : JSON.stringify(reqParam)}});
    },
    goPrivacy(gubun) {
      let path = "";
      if(gubun == "policy") {
        path = "/policyInfo";
      } else {
        path = "/termsInfo";
      }
      this.$router.push({path: path});
    },
    goMyInfo(){
      let reqParam = {
        lan_tp : this.lanTp,
      }
      this.$router.push({path:"/myinfo", state : {reqParam : JSON.stringify(reqParam)}});
    },
    goMyCart() {
      let reqParam = {
        lan_tp : this.lanTp,
      }
      this.$router.push({path: "/mycart", state : {reqParam : JSON.stringify(reqParam)}});
    },
    goPaymentInfo() {
      let reqParam = {
        lan_tp : this.lanTp,
      }
      this.$router.push({path: "/paymentInfo", state : {reqParam : JSON.stringify(reqParam)}});
    },
    
  }
};
</script>


<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
   //width : 1399px;
  //height : 800px; 
  
}

nav {
  padding: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
body {

margin: 0;

} */
</style>

