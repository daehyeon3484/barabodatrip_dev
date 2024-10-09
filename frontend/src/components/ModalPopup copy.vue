<template>
  <div :class="isMobile == true ? 'mobile-lg' : ''"> 
    <button class="float-end btn btn-outline-warning me-md-2 text-light" hidden type="button" id="modalNoticeBtn" data-bs-toggle="modal" data-bs-target="#staticNoticeBackdrop">test</button> 
    <!-- Modal -->
    <div class="modal fade modal-md" id="staticNoticeBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticNoticeBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div :class="isMobile == true ? 'mobile fw-bold text-start' : 'fw-bold text-start'" id="staticNoticeBackdropLabel" v-html="popupData.cou_ttl_nm"></div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div :class="isMobile == true ? 'mobile-md' : ''" v-html="popupData.cou_content"></div>
            <div class="align-self-center mobile-md"> 
              <input class="form-check-input" type="checkbox" @change="changeCheck($event)"> {{$t("common.cookie_msg")}}
              <div v-if="this.btnCnt > 0" class="mt-2"> 
                <span :key="i" v-for="i in this.btnCnt">
                  <button type="button" :class="isMobile == true ? 'btn btn-info mobile-ss btn-st-sm me-1' : 'btn btn-info btn-sm btn-st-md me-1'" data-bs-dismiss="modal" @click="getNoticePopup(i)">{{i}}</button>
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="modalNoticeClose" type="button" :class="isMobile == true ? 'btn btn-secondary mobile-ss btn-st-sm' : 'btn btn-secondary btn-sm btn-st-md'" data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
            <button v-if="eventFlag" type="button" :class="isMobile == true ? 'btn btn-primary btn-st-sm' : 'btn btn-primary btn-sm btn-st-md'" data-bs-toggle="modal" data-bs-target="#staticNoticeBackdrop" @click="goEventReserv">{{ $t("common.event_input") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>          
</template>
<script>
import {isDEmpty} from '@/is';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      popupData : {},
      targetId : "",
      popupFlag : false,
      communitys : [],
      isMobile : false,
      eventFlag : false,
      btnCnt : 0
    }
  },
  props : {
    community : Array
  },
  watch:{
    community: {
      handler( newVal, oldVal ){
        console.log( 'community newVal:', newVal, 'oldVal:', oldVal )
        this.communitys = newVal
        let idx = 0
        if(this.communitys.length > 0) {
          this.eventFlag = isDEmpty(this.communitys[0].event_id) ? false : true
          this.popupFlag = true
        }
        this.getNoticePopup(idx)
      },
      // deep: true
    }
  },
  mounted() {
    this.isMobile = this.$isMobile()
  },
  unmounted() {
  },
  created() {
    console.log("props : ",this.$props.community)
    // this.getNoticePopup(this.$props.community)
  },
  methods : {
    changeCheck(event) {
      let checked = event.target.checked
      if(checked) {
        // this.setCookie("popupFlag", "N", 1);
        // this.showPopup = false;
      // 팝업을 닫을 때 쿠키 설정
        Cookies.set('hasSeenPopup', 'true', { expires: 1 }); // 7일 동안 쿠키 유지
      }
    },
    getCookie(name) {
      console.log(name)
      let cookie = document.cookie;
      if (document.cookie != "") { 
        let cookieArray = cookie.split("; ");
        for ( let index in cookieArray) {
          let cookieName = cookieArray[index].split("=");
          if (cookieName[0] == "popupFlag") {
            return cookieName[1];
          }
        }
      } 
      return
    },
    async getNoticePopup(idx){
      console.log("getNoticePopup")
      let toDay = this.$dateFormat('today')
      const hasSeenPopup = Cookies.get('hasSeenPopup');
      let cookieCheck = false
      if (!hasSeenPopup) {
        cookieCheck = true;
      }
      console.log(this.communitys.length, cookieCheck)
      if(this.communitys.length > 0 && cookieCheck) {
        this.btnCnt = this.communitys.length
        let HForm = document.querySelector("#modalNoticeBtn")
        for(let k = 0; k < this.communitys.length; k++) {
          if(k == idx) {
            let startDay = Number(this.communitys[k].popup_bgng_ymd)
            let endDay = Number(this.communitys[k].popup_bgng_ymd)
            // console.log("test :" , Number(toDay) >= startDay && Number(toDay) <= endDay, toDay,startDay)
            if(Number(toDay) >= startDay && Number(toDay) <= endDay) {
              this.popupData.cou_ttl_nm = this.communitys[k].cou_ttl_nm
              this.popupData.cou_content = this.communitys[k].cou_content
              if(!this.popupFlag) {
                HForm.click()
              }
            }
          }
        }

        // this.communitys.forEach(item => {
        //   // let attr = ""
        //   let startDay = Number(item.popup_bgng_ymd)
        //   let endDay = Number(item.popup_end_ymd)
        //   console.log("test :" , Number(toDay) >= startDay && Number(toDay) <= endDay, toDay,startDay)
        //   if(Number(toDay) >= startDay && Number(toDay) <= endDay) {
        //     this.popupData.cou_ttl_nm = item.cou_ttl_nm
        //     this.popupData.cou_content = item.cou_content
            
        //     // console.log("팝업")
        //     HForm.click()
        //   }
        // })
      } 
      
    },
    // changeData(i) {

    // },
    goEventReserv() {
      let reqParam = {
        lan_tp : this.lanTp
      }
      this.$router.push({path : '/eventInfo', state : {reqParam : JSON.stringify(reqParam)}})
    }
  }

}
</script>

<style>

</style>