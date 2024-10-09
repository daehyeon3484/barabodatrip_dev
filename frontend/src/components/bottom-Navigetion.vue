<template>
  <div class="navbar1" :style="isMobile == true ? 'bottom: 8px' : 'bottom: 0px'" align="center" valign="top">
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['fa', 'home']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer" @click="goPage('home')" />
      <font-awesome-icon v-else class="bg-info" :icon="['fa', 'home']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer" @click="goPage('home')" />
    </a>
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['fas', 'cart-plus']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer;" @click="goPage('cart')" />
      <font-awesome-icon v-else class="bg-info" :icon="['fas', 'cart-plus']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer;" @click="goPage('cart')" />
    </a>
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['fas', 'gift']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer;" @click="goPage('event')" />
      <font-awesome-icon v-else class="bg-info" :icon="['fas', 'gift']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer;" @click="goPage('event')" />
    </a>
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['fas', 'bell']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer;" @click="goPage('noti')" />
      <font-awesome-icon v-else class="bg-info" :icon="['fas', 'bell']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer;" @click="goPage('noti')" />
    </a>
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['far', 'user']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer;" @click="goPage('myinfo')" />
      <font-awesome-icon v-else class="bg-info" :icon="['far', 'user']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer;" @click="goPage('myinfo')" />
    </a>
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['fas', 'star']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer;" @click="goPage('kpopInfo')" />
      <font-awesome-icon v-else class="bg-info" :icon="['fas', 'star']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer;" @click="goPage('kpopInfo')" />
    </a>
    <a :style="isMobile == true ? 'padding: 8px 2.5%' : 'padding: 10px 4.2%' ">
      <font-awesome-icon v-if="!isMobile" class="bg-info" :icon="['fa-regular', 'fa-circle-question']" style="border-radius: 8px;width:35px;height: 35px;cursor: pointer;" @click="goPage('qna')" />
      <font-awesome-icon v-else class="bg-info" :icon="['fa-regular', 'fa-circle-question']" style="border-radius: 9px;width:30px;height: 30px;cursor: pointer;" @click="goPage('qna')" />
    </a>
  </div>
  </template>
  <!-- 
    <font-awesome-icon :icon="['far', 'star']" />
  <font-awesome-icon :icon="['fas', 'gift']" />
   -->
  
  <script>
  // import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  // import { fas } from '@fortawesome/free-solid-svg-icons';
  // import { CurvedBottomNavigation } from "bottom-navigation-vue";
  // import { CurvedBottomNavigation  } from "bottom-navigation-vue";
  // import "bottom-navigation-vue/dist/style.css";
  import {generateSessionStorage} from '@/storage'
  const sessionStorage = generateSessionStorage()
  export default {
    // components: { FontAwesomeIcon },
    data(){
      return {
        isMobile : false
      }
    },
    mounted() {
      this.isMobile = this.$isMobile()
    },
    methods : {
      goPage(type) {
        let reqParam = {
          lan_tp : sessionStorage.get('lan_tp'),
        }
        let obj = sessionStorage.get('category')
        let categorys = JSON.parse(obj)
        if(type == 'home') {
          window.location.reload(true)
          window.location.href= `/?lan_tp=${sessionStorage.get('lan_tp')}`
          // this.$router.push({path : '/', query : {lan_tp : sessionStorage.get('lan_tp')}})        
        } else if(type == 'cart') {
          this.$router.push({path: "/mycart", state : {reqParam : JSON.stringify(reqParam)}});
        } else if(type == 'noti') {
          this.$router.push({path : "/communityList", state : {reqParam : JSON.stringify(reqParam)}});
        } else if(type == 'myinfo') {
          this.$router.push({path:"/myinfo", state : {reqParam : JSON.stringify(reqParam)}});
        } else if(type == 'qna') {
          if(reqParam.lan_tp == 'CHN' && this.isMobile == false) {
            let btnQr = document.querySelector('#modalQrBtn')
            btnQr.click()
          } else {
            this.$router.push({path:"/qna", state : {reqParam : JSON.stringify(reqParam)}});
            
          }
        } else if(type == 'kpopInfo') {
          let kpopInfos = categorys.filter(item => item.cd_group_code == 'CG003')
          reqParam = {
            prod_type: kpopInfos.cd_group_code,
            group_nm: kpopInfos.cd_group_nm
          }
          this.$router.push({path:"/kpopInfo", state : {reqParam : JSON.stringify(reqParam)}});
        } else if(type == 'event') {
          let events = categorys.filter(item => item.cd_group_code == 'CG005')
          reqParam = {
            prod_type: events.cd_group_code,
            group_nm: events.cd_group_nm
          }
          this.$router.push({path:"/eventInfo", state : {reqParam : JSON.stringify(reqParam)}});
        }
      }
    }
  }
  </script>  
  