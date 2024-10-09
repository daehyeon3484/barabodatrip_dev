<template>
  <main class="">
    <div id="app">
    <div id="container">
      <!-- <nav class="navbar navbar-dark bg-dark fixed-top"> -->
      <nav class="navbar navbar-dark bg-dark col-xs-6">
        <div class="container-fluid nav-div1">
          <div class="nav-div">
            <!-- <router-link class="navbar-brand" to="/"> -->
            <router-link class="navbar-brand" :to="{ path: '/', query: { lan_tp: lanTp}}">
              <img v-if="lanTp != 'CHN'" class="logo-img" src="./img/logo.png" alt="" >
              <img v-else class="logo-img" src="./img/logo_cn.png" alt="" >
            </router-link>
          </div>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-end bg-dark text-white" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div class="offcanvas-header">
              <h5 v-if="!isMobile" class="offcanvas-title" id="offcanvasDarkNavbarLabel">{{ $t("main.subject") }}</h5>
              <h6 v-else class="offcanvas-title pt-3" id="offcanvasDarkNavbarLabel">{{ $t("main.subject") }}</h6>
              <a v-if="user.mem_id!=undifined" data-bs-dismiss="offcanvas" @click="goMyCart"> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-cart4 my-cart" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                </svg>
              </a>
              <button id="closeBtn" type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" ></button>
            </div>
            
            <div class="offcanvas-body"><!-- :data-bs-dismiss=items[0].offcanvas -->
              <select class="form-select form-select mb-3 font-lg" v-model="$i18n.locale" @change="selLangChange($event)" ref="sel">
                <!-- <option  :value="item.nation_real_cd" v-for="(item, index) in nationList.filter(c=> c.nation_real_cd == this.$i18n.locale)" :key="index">{{ item.nation_nm }}</option> -->
                <option  :value="item.nation_real_cd" v-for="(item, index) in nationList" :key="index">{{ item.nation_nm }}</option>
              </select>
              <!-- <form class="d-flex mt-2"> -->
              <form class="d-flex d-grid gap-2 d-md-flex mt-2">
                <button v-if="user.mem_id==undifined" :class="isMobile == true ? 'btn btn-danger btn-sm me-md-2 btn-st-sm' : 'btn btn-danger btn-sm me-md-2 btn-st-md'" type="button" data-bs-dismiss="offcanvas"  @click="login">{{$t('main.login')}}</button>
                <!-- <button class="btn btn-danger btn-sm" type="button" data-bs-dismiss="offcanvas"  @click="logout">{{$t('main.login_out')}}</button> -->
                <button v-else :class="isMobile == true ? 'btn btn-danger btn-sm btn-st-sm' : 'btn btn-danger btn-sm btn-st-md'" type="button" data-bs-dismiss="offcanvas"  @click="logout">{{$t('main.login_out')}}</button>
                <!-- <button v-if="user.mem_id != undifined" :class="isMobile == true ? 'btn btn-info btn-sm btn-st-sm' : 'btn btn-info btn-sm btn-st-md'" type="button" data-bs-dismiss="offcanvas"  @click="goCumstomTravel">{{$t('common.common_custom_travel')}}</button> -->
                <!-- <button v-if="user.mem_id != undifined && user.mem_id =='MEM0000000006'" :class="isMobile == true ? 'btn btn-info btn-sm btn-st-sm' : 'btn btn-info btn-sm btn-st-md'" type="button" data-bs-dismiss="offcanvas"  @click="goTest">이메일테스트</button> -->
              </form>
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3 mt-3 text-start">
                <li class="nav-item font-lg">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goCommonPage('company')" style="cursor:pointer;">{{$t('common.common_company_info')}}</a>
                </li>
                <li class="nav-item font-lg">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goCommonPage('notice')" style="cursor:pointer;"><font-awesome-icon class="" :icon="['fas', 'bell']"></font-awesome-icon>  {{$t('common.notice')}}</a>
                </li>
                <li v-if="user.mem_id!=undifined && paymentCnt > 0" class="nav-item font-lg">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goPaymentInfo" style="cursor:pointer;"><font-awesome-icon :icon="['far', 'credit-card']" />  {{$t('common.order_confirm_list')}}</a>
                </li>
                <li v-if="user.mem_id!=undifined" class="nav-item font-lg">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goMyInfo" style="cursor:pointer;"><font-awesome-icon class="" :icon="['fas', 'user']"></font-awesome-icon>  {{$t('main.myinfo')}}</a>
                </li>
                <li class="nav-item font-lg" v-for="(cate, i) in this.category1" :key="i">
                 <a class="nav-link" aria-current="page" data-bs-dismiss="offcanvas" @click="goList(cate)" style="cursor:pointer;"><font-awesome-icon class="" :icon="icons[i]"></font-awesome-icon>  {{ cate.cd_group_nm }}</a>
                </li>
                <!-- <li class="nav-item">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goList()" style="cursor:pointer;">{{$t('main.theme_list')}}</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goList()" style="cursor:pointer;">{{$t('main.kpop_info')}}</a>
                </li> -->
                
                <li v-if="user.mem_id != undifined" class="nav-item font-lg mt-5">
                  <a class="nav-link" data-bs-dismiss="offcanvas"  @click="goJoinOut" style="cursor:pointer;"><font-awesome-icon :icon="['fas', 'user-slash']" />  {{$t("common.join_out")}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <router-view :key="$route.fullPath"></router-view>
      <!-- <div>  -->
        <!-- </div> -->
      <!-- <ModalSpiner></ModalSpiner> -->
      <bottomNavigetion ></bottomNavigetion>
      <footer class="mt-3 bg-dark">
        <div class="row ">
            <div class="text-center mb-5 mt-2"> 
              <ul class="list-unstyled text-small text-secondary">
                <li class="font-sm">Copyright © Enabled 2023 All Rights Reserved.</li>
                <li class="font-sm">BarabodaTrip Corp.</li>
                <!-- <li><a class="link-light" href="tel:082-1666-8431">tel :+82 1666-8431</a></li> -->
                <li class="font-sm"><a class="link-light" href="tel:02-1666-8431">tel :+82 1666-8431</a></li>
                <li class="font-sm"><a class="link-light" href="mailto:barabodatrip@gmail.com">email : barabodatrip@gmail.com</a></li>
                <li class="font-sm">Business license number : 249-86-01520</li>
                <li class="font-sm"><a>Address : 15-5, Incheon tower-daero 54beon-gil, <br>Yeonsu-gu, Incheon, Republic of Kore</a></li>
                <li class="font-sm"><span><a class="link-light font-sm" @click="goPrivacy('terms')">Terms & Conditions</a></span></li>
                <li class="font-sm"><span><a class="link-light font-sm" @click="goPrivacy('policy')">Privacy Policy</a></span></li>
              </ul>
            </div>
          </div>
      </footer>
    </div>
  </div>
  
  <!-- <modalLogin @onLoginChange="loginPopupEmit"></modalLogin>
  <modalJoin></modalJoin>
  <modalIdPwFind></modalIdPwFind> -->
  <!-- <modalJoinOut></modalJoinOut> -->
  <modalQr></modalQr>
  </main>
</template>
<script>
// import {isDEmpty} from '@/is';
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import { isDEmpty } from '@/is';
// import modalLogin from '@/components/ModalLogin.vue';
// import modalJoin from '@/components/ModalJoin.vue';
// import modalIdPwFind from '@/components/ModalIdPwFind.vue';
// import modalJoinOut from '@/components/ModalJoinOut.vue';
import bottomNavigetion from '@/components/bottom-Navigetion.vue';
// import ModalSpiner from './components/ModalSpiner.vue';
import {swalTost, swal} from '@/alert'
import modalQr from './components/ModalQr.vue';
let timer = null
export default {
  name : 'App',
  components: { 
    bottomNavigetion, 
    modalQr
    // modalLogin,
    // modalJoin,
    // modalIdPwFind,
    // ModalSpiner
  },
  data() {
    return {
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
      paymentCnt : 0,
      isMobile : false,
      icons : []
    }
  },
  computed : {
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
  },
  unmounted() {
    clearTimeout(timer)
  },
  created(){
    console.log("user : ", this.user)
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.getNationList();
    }, 1000);
    if(isDEmpty(sessionStorage.get('lan_tp'))) {
      this.getLangChange();
    } else {
      this.lang = sessionStorage.get('locale')
      this.$i18n.locale = sessionStorage.get('locale')
      this.lanTp = sessionStorage.get('lan_tp')
    }
  },
  methods : {
    // goPage() {
    //   this.$router.push({path : '/', query : {lan_tp : sessionStorage.get('lan_tp')}})
    // },
    getLangChange() {
      let locale = navigator.language || navigator.userLanguage
      locale = locale.substring(0, 2);
      // if (locale == 'zh') {
      //   locale = 'zh' // 한국어가 아닌 경우 무조건 중국어로 설정
      // }
      if(locale == 'ko') {
        locale = 'en'
      }
      this.$i18n.locale = isDEmpty(sessionStorage.get('locale')) ? locale : sessionStorage.get('locale')
      console.log("locale : ",locale)
      // this.$i18n.locale = locale
      // this.$i18n.locale = 'zh'
      switch(this.$i18n.locale) {
        case 'zh' : 
          this.lanTp = "CHN";
          break;
        case 'ko' :
          this.lanTp = "KOR";
          break;
        case 'en' :
          this.lanTp = "ENG";
          break;
        case 'ja' :
          this.lanTp = "JPN";
          break;
        case 'jp' :
          this.lanTp = "JPN";
          break;
        case 'vi' :
          this.lanTp = "VTN";
          break;
        case 'vn' :
          this.lanTp = "VTN";
          break;
        default : 'ENG'
      }
      this.lang = locale
      sessionStorage.set('locale',locale)
      sessionStorage.set('lan_tp',this.lanTp)
    },
    async getGrpCategoryList() {
      let groupCategoryList = await this.$api('/api/grpCategoryList', {});
      if(!isDEmpty(this.user.mem_id)) {
        let cnt = await this.$api('/api/paymentCnt', {param : ['T', this.user.mem_id, this.lanTp]})
        console.log(cnt)
        this.paymentCnt = cnt[0].paymentCnt
      }
      let oCategory = []
      groupCategoryList.forEach(item => {
        let cdGroupNm = ""
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
      });
      this.icons.push(
        ['fas', 'face-grin-stars'],//kpop 001
        ['fas', 'mountain-sun'],//테마 002
        ['fas', 'star'],//kpop소식 003
        ['fas', 'guitar'],//엔터 004
        ['fas', 'gift'],//이벤트 005
      )
      sessionStorage.set('category', JSON.stringify(oCategory))
      this.category1 = []
      this.category1 = oCategory
    },
    async getNationList() {
      let nationList = await this.$api("/api/nationCodeList", {param:[{use_yn : 'Y'}]});
      let onation = []
      nationList.forEach(item => {
        if(item.nation_cd.substring(0,2) != 'ko') {
          onation.push({
            nation_real_cd : item.nation_cd.substring(0, 2),
            nation_nm : item.nation_nm
          })
        }
      })
      this.nationList.push(...onation)
      this.getGrpCategoryList()
      
    },
    
    async selLangChange(event){
      sessionStorage.remove('locale')
      sessionStorage.remove('lan_tp')
      let lang = event.target.value;
      
      this.$i18n.locale = lang
      console.log("this.$i18n.locale:", this.$i18n.locale)
      switch(this.$i18n.locale) {
        case 'ko' : 
          this.lanTp = "KOR";
          break;
        case 'zh' :
           this.lanTp = "CHN";
           break;
        case 'en' :
          this.lanTp = "ENG";
          break;
        case 'ja' :
          this.lanTp = "JPN";
          break;
        case 'jp' :
          this.lanTp = "JPN";
          break;
        case 'vi' :
          this.lanTp = "VTN";
          break;
        case 'vn' :
          this.lanTp = "VTN";
          break;
        default : 'ENG'
      }
      // this.getGrpCategoryList()
      sessionStorage.set('locale', event.target.value)
      sessionStorage.set('lan_tp', this.lanTp)
      window.location.reload(true)
       window.location.href= `/?lan_tp=${this.lanTp}`
      // this.$router.push({path: "/", query : {lan_tp : this.lanTp}});
      let HForm = document.querySelector("#closeBtn")
      HForm.click()
    },
    
    offCanvasChange(){
      this.offcanvas = "";
    },
    async login() {
      // let data = {}
      // data = {
      //   mem_id : "MEM0000000001",
      //   mem_nm : "test이름",
      // }
      // this.$store.commit("user", data);
      // this.$router.push({path: "/", query : {lan_tp : 'KOR'}});
      // if(!this.isMobile && this.lanTp == 'CHN') {
      // if(this.isMobile) {
      //   let modalBtn = document.querySelector('#mobileModalBtn')
      //   modalBtn.click()
      // } else {
        this.$router.push({path: "/login"});
      // }
    },
    async logout() {
      // if(this.user.sns_type == 'kakao') {
      //   let info = {
      //     sns_type : this.user.sns_type,
      //     mem_token : this.user.mem_token
      //   }
      //   // this.$store.commit("user", {});
      //   // window.location.href = `/auth/${this.user.sns_type}/${this.user.mem_token}/logout`
      //   let resMsg = await this.$api(`/auth/${this.user.sns_type}/logout`, {info});
      //   if(resMsg == 'success') {
      //     this.$store.commit("user", {});
      //     this.$router.push({path: "/", query : {lan_tp : this.lanTp}})
      //   }
      // }
        
      // if(this.user.sns_type =='facebook') {
      //   // let reqParam = {type : "logout"}
      //   // this.$router.push({path: "/login", state : {reqParam : JSON.stringify(reqParam)}});
      //   // this.$refs.facebook.logout()
      // } else {
      window.location.href = '/auth/logout'
      // }

    },
    // loginPopupEmit(obj) {
    //   if(obj.loginType == 'join') {
    //     let btnJoin = document.querySelector('#joinModalBtn')
    //     btnJoin.click()
    //   } else if(obj.loginType == 'login') {
    //     let modalBtn = document.querySelector('#mobileModalBtn')
    //     modalBtn.click()
    //   } else if(obj.loginType == 'find') {
    //     let findBtn = document.querySelector('#findModalBtn')
    //     findBtn.click()
    //   }
    // },
    goList(category){
      let path = "";
      if(category.cd_group_code == 'CG003') {
        path = "/kpopInfo";
      } else if(category.cd_group_code == 'CG002') {
        path = "/themeList";
      } else if(category.cd_group_code == 'CG004') {
        path = "/enterList";
      } else if(category.cd_group_code == 'CG005') {
        path = "/eventInfo";
      } 
      else {
        path = "/productList";
      }
      let reqParam = {
        prod_type:category.cd_group_code,
        group_nm:category.cd_group_nm
      }
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
      console.log("reqParam : ", reqParam)
      this.$router.push({path: "/mycart", state : {reqParam : JSON.stringify(reqParam)}});
    },
    goPaymentInfo() {
      let reqParam = {
        lan_tp : this.lanTp,
      }
      this.$router.push({path: "/paymentInfo", state : {reqParam : JSON.stringify(reqParam)}});
    },
    goCumstomTravel() {
      let reqParam = {
        lan_tp : this.lanTp,
      }
      this.$router.push({path: "/customTravel", state : {reqParam : JSON.stringify(reqParam)}});
    },
    goCommonPage(type) {  
      let path = ""
      let reqParam = {}
      if(type == 'notice') {
        path = "/communityList"
        reqParam = {
          lan_tp : this.lanTp
        }
      } else {
        path = "/companyInfo"
        reqParam = {
          lan_tp : this.lanTp
        }
      } 
      this.$router.push({path : path, state : {reqParam : JSON.stringify(reqParam)}});
    },
    async goJoinOut() {
      if(!isDEmpty(this.user.mem_id)) {
        swalTost.fire({
          title : this.$t('common.join_out_confirm_msg'),
          icon : 'question',
          confirmButtonText: this.$t('common.common_delete'),
          cancelButtonText : this.$t('common.common_cancel')
        }).then(async (result) => {
          if(result.isConfirmed) {
            await this.$api('/api/memberDelete', {param :[this.user.mem_id]})
            swal.fire({
              title: this.$t("common.join_out_success"),
              icon : 'success',
              timer: 3000, 
              confirmButtonText: this.$t("common.common_confirm"),
            })
            window.location.href = '/auth/logout'
          }
        })
      }
    },
    async goTest() {
      let info = {
        test : "test"
      }
      console.log(info)
      await this.$api('/smtp/email/test', {info})
    }
  }
};
</script>

