<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{this.eventInfo.event_title}}</h5>
      <h6 v-else class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{this.eventInfo.event_title}}</h6>
      <div class="row" v-if="!imgList">
        <div class="col-md-12 col-padding">
          <div id="carouselExampleRide" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div :class="`carousel-item ${i==0?'active':''}`" :key="i" v-for="(img, i) in imgList.filter(c => c.file_type == '1')">
                <div class="imgContainer"> 
                  <img class="" :src="`/download/EVENT/${img.file_path}/${img.info_seq}/${img.file_type}/${img.file_name}`">
                </div>
              </div>
            </div>
            <!-- <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button> -->
          </div>
        </div>
      </div>
      <div class="row mt-1" v-if="vedioFlag">
        <div class="col-md-12 col-padding">
          <div v-if="eventInfo.vedio_type=='01'">
            <div :key="i" v-for="(info, i) in infoList"> 
              <iframe  id="player" type="text/html" width="100%" height="300"
              :src="`https://www.youtube.com/embed/${info.vedio_url}?autoplay=1&origin=https://barabodatrip.com`"
              frameborder="0"></iframe>
              <div class="card mt-1" style="border-radius: 8px;">
                <div class="card-body">
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-title" style="color : #046582;font-weight: bold;">{{eventInfo.event_title}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p>{{$t("common.date_input")}} : {{eventInfo.ymd_format}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-text"><i class="bi bi-calendar-check">{{ info.vedio_title }}</i></p></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_desc"></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_content"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="eventInfo.vedio_type == '02'"> 
            <div :key="i" v-for="(info, i) in infoList"> 
              <div class="player-container">
                <vue3-video-player @play="your_method" :src='info.vedio_url'></vue3-video-player>
              </div>
              <div class="card mt-1" style="border-radius: 8px;">
                <div class="card-body">
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-title" style="color : #046582;font-weight: bold;">{{eventInfo.event_title}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p>{{$t("common.date_input")}} : {{eventInfo.ymd_format}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-text"><i class="bi bi-calendar-check">{{ info.vedio_title }}</i></p></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_desc"></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_content"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="eventInfo.vedio_type=='03'">  
            <div :key="i" v-for="(info, i) in this.infoList"> 
              <div class="iframeContainer iframe16To9">
                <iframe :src="info.vedio_url" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
              </div>
              <div class="card mt-1" style="border-radius: 8px;">
                <div class="card-body">
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-title" style="color : #046582;font-weight: bold;">{{eventInfo.event_title}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p>{{$t("common.date_input")}} : {{eventInfo.ymd_format}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-text"><i class="bi bi-calendar-check">{{ info.vedio_title }}</i></p></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_desc"></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_content"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="eventInfo.vedio_type=='04'">
            <!-- <div class="row g-3 bg-info" style="margin: 0;padding: 0;">
              <h5 class="text-start mt-2 fw-bold" style="color : #046582;">
                {{this.eventInfo.event_title}}
              </h5>
            </div> -->
            <div :key="i" v-for="(info, i) in this.infoList" class="mt-1"> 
              <div class="videoContainer iframe16To9">
                <video 
                  id="video_obj" 
                  autoplay="autoplay" 
                  preload="metadata"
                  loop="loop" 
                  muted="muted"
                  controls controlsList="nodownload"
                  >
                  <source :src="`/download/EVENT/202403/EVENT_INFO000001/4/${info.vedio_url}`"  type="video/mp4">
                </video>
              </div>
              <div class="card mt-1" style="border-radius: 8px;">
                <div class="card-body">
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-title" style="color : #046582;font-weight: bold;">{{eventInfo.event_title}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p>{{$t("common.date_input")}} : {{eventInfo.ymd_format}}</p></div>
                  <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-text"><i class="bi bi-calendar-check">{{ info.vedio_title }}</i></p></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else> 
        <!-- <div :key="i" v-for="(info, i) in eventInfo" class="mt-1">  -->
        <div class="mt-1"> 
          <div class="card mt-1" style="border-radius: 8px;">
            <div class="card-body">
              <div :class="isMobile == true ? 'mobile-lg' : ''"><p class="card-title" style="color : #046582;font-weight: bold;">{{eventInfo.event_title}}</p></div>
              <div :class="isMobile == true ? 'mobile-lg' : ''"><p>{{$t("common.date_input")}} : {{eventInfo.ymd_format}}</p></div>
              <!-- <p class="card-text">
                <i class="bi bi-calendar-check">{{ info.vedio_title }}</i>
              </p> -->
              <!-- <div class="p-modal" v-html="eventInfo.event_desc"></div> -->
              <div :class="isMobile == true ? 'mobile-md' : ''" v-html="eventInfo.event_content"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-1 card" v-if="imgDetail != undifined">
        <div class="col-md-12 col-padding">
          <img :src="`/download/EVENT/${imgDetail.file_path}/${imgDetail.event_id}/${imgDetail.file_type}/${imgDetail.file_name}`" class="img-fluid" style="border-radius: 8px;width:100%;height:100%;"/>
        </div>
      </div>
      <!-- <button type="button" class="float-end btn btn-info" @click="userInfoInsert">{{$t("common.common_reserv")}}</button>
      <button class="float-end btn btn-danger me-md-2" type="button" @click="deleteCutomerInfo">{{$t("common.order_customer_info_delete")}}</button>
      <button class="float-end btn btn-warning me-md-2" type="button" @click="goPage">{{$t("common.common_cancel")}}</button>
    </div> -->
      <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
        <!-- <button type="button" :class="isClass" @click="goEventReserv" :disabled="this.isDesabled">{{ $t("common.event_reserv_input") }}</button> -->
        <button type="button" :class="isMobile == true ? 'btn btn-info btn-st-sm text-white' : 'btn btn-info text-white btn-st-md'" @click="goEventReserv" disabled>{{ $t("common.event_reserv_input") }}</button>
        <button type="button" :class="isMobile == true ? 'btn btn-dark btn-st-sm text-white' : 'btn btn-dark text-white btn-st-md'" @click="goPage">{{ $t("common.home") }}</button>
      </div>
      <div class="row mt-3">
        <div class="col-md-12 col-padding">
          <ul class="nav nav-pills" id="myTab" role="tablist">
            <li class="nav-item font-lg" role="presentation">
              <a class="nav-link  adopt-tab active"  id="comment-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="true">{{$t("product.comment")}}</a>
            </li>
          </ul>
          <div class="tab-content mt-2 card" id="myTabContent" style="border-radius: 9px;">
            <div class="tab-pane fade show active" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
              <div class="row">
                <div class="bg-dark text-white col-md-12 col-padding p-2" style="border-radius: 9px;">
                  <div class="d-flex flex-column comment-section" id="myGroup" v-for="(comments, i) in commentList" :key="i">
                    <div class="p-2" >
                      <div class="d-flex flex-row user-info">
                        <!-- <img class="rounded-circle" :src=comments.user_img_path style="width=40px;height: 40px;"> -->
                        <img class="rounded-circle me-1" :src=comments.user_img_path style="width : 40px; height: 40px;">
                        <div class="d-flex flex-column justify-content-start ml-2">
                          <div class="comment-footer">
                            <span class="d-block fw-bold text-start">{{comments.user_nick}}</span>
                            <span class="date fw-bold">{{$t("product.reg_date")}} : {{comments.reg_date}}</span>
                            <span class="action-icons">
                              <span v-if="this.user.mem_id == comments.mem_id">
                                <a href="#collapse-1" data-abc="true" data-bs-toggle="collapse"  role="button" :class="pencilFlag == false ? 'collapsed' : ''" :aria-expanded="pencilFlag == false ? 'false' : 'true'" aria-controls="collapse-1" @click="paramInput(comments, 'update')">
                                  <font-awesome-icon :icon="['fas', 'pencil']" />
                                </a>
                                <a data-abc="true" @click="commentDelete(comments.comment_id)">
                                  <font-awesome-icon class="me-1" :icon="['fas', 'trash-can']" />
                                </a>
                              </span>
                              <span v-if="comments.like_cnt > 0">
                                <a data-abc="true" @click="likeUpdate(comments.like_cnt+1, comments.comment_id)"> 
                                  <font-awesome-icon class="me-1"  :icon="['fas', 'heart']" style="color:red"/>
                                </a>
                              </span>
                              <span v-else>
                                <a data-abc="true" @click="likeUpdate(comments.like_cnt+1, comments.comment_id)"> 
                                  <font-awesome-icon class="me-1" :icon="['fas', 'heart']"/>
                                </a>
                              </span>
                              <span v-if="this.like_sum_cnt > 0">
                                <span class="start-90 badge rounded-pill text-bg-danger">{{comments.like_cnt}}</span>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="mt-2">
                        <p class="comment-text text-start">{{comments.comment_content}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="p-2">
                    <div class="d-flex flex-row fs-12">
                        <div class="like p-2 cursor">
                          <i class="fa fa-thumbs-o-up"></i> 
                          <span class="ml-1">{{$t('product.comment_like')}} {{this.like_sum_cnt}}</span>
                        </div>
                        <div class="like p-2 cursor action-collapse" data-bs-toggle="collapse" href="#collapse-1"  @click="setClass" role="button" aria-expanded="false" aria-controls="collapse-1">
                          <i class="fa fa-commenting-o"></i>
                          <span class="ml-1" @click="init">{{$t("product.comment")}}</span>
                        </div>
                        <!-- <div class="like p-2 cursor action-collapse" data-bs-toggle="collapse" href="#collapse-2" role="button" aria-expanded="false" aria-controls="collapse-2">
                          <i class="fa fa-share"></i>
                        <span class="ml-1">{{$t("product.comment_share")}}</span></div>                 -->
                    </div>
                  </div>
                  <div id="collapse-1" :class="pencilFlag == false ? 'bg-light p-2 collapse' : 'bg-light p-2 collapse show'" data-parent="#myGroup">
                  <!-- <div id="collapse-1" class="bg-light p-2 collapse" data-parent="#myGroup"> -->
                    <div class="d-flex flex-row align-items-start">
                      <!-- <div v-if="this.user.mem_id != undifined"> -->
                      <div v-if="this.user.mem_id != undifined && comments.mem_id != ''"> 
                        <!-- <img class="rounded-circle" :src=this.user.profileIMG width="40"> -->
                        <img class="rounded-circle me-1" :src=this.user.mem_profile_path style="width : 40px; height: 40px;">                          
                      </div>
                      <textarea class="form-control ml-1 shadow-none textarea" v-model="this.content"></textarea>
                    </div>
                    <div> 
                      {{commont_content}}
                    </div>
                    <div class="mt-2 text-right">
                      <span v-if="this.gubun != 'update'">
                        <button :class="isMobile == true ? 'btn btn-primary btn-sm shadow-none me-2 btn-st-md' : 'btn btn-primary btn-sm shadow-none me-2'" type="button" @click="commentInsert()">{{$t("product.regist")}}</button>
                      </span>
                      <span v-else>
                        <button :class="isMobile == true ? 'btn btn-primary btn-sm shadow-none me-2 btn-st-md' : 'btn btn-primary btn-sm shadow-none me-2'" type="button" @click="commentUpdate()">{{$t("product.modify")}}</button>
                      </span>
                      <span>
                        <button :class="isMobile == true ? 'btn btn-outline-primary btn-sm ml-1 shadow-none btn-st-md' : 'btn btn-outline-primary btn-sm ml-1 shadow-none'" type="button" @click="commentCancel">{{$t("product.cancel")}}</button>
                      </span>
                    </div>
                  </div>
                    <!-- <div id="collapse-2" class="bg-light p-2 collapse" data-parent="#myGroup">
                      <div class="d-flex flex-row align-items-start">
                        
                        <font-awesome-icon class="me-2" :icon="['fab', 'facebook']" style="width:40;height: 40;" />
                        <font-awesome-icon class="me-2" :icon="['fab', 'weixin']" style="width:40;height: 40;color: green;"/>
                        <font-awesome-icon :icon="['fab', 'qq']" style="width:40;height: 40;"/> -->
                        <!-- <i class="bi bi-facebook"></i>
                        <i class="fa fa-twitter border p-3 rounded mr-1"></i>
                        <i class="fa fa-instagram border p-3 rounded mr-1"></i>
                        <i class="fa fa-weibo  border p-3 rounded mr-1" style="color:red"></i>
                        <i class="fa fa-qq border p-3 rounded mr-1" style="color:blue"></i> -->
                        <!-- <i class="fa fa-linkedin border p-3 rounded mr-1"></i> -->
                        <!-- <i class="fa fa-dribbble border p-3 rounded mr-1"></i> -->
                        <!-- <i class="fa fa-pinterest-p border p-3 rounded mr-1"></i> -->
                      <!-- </div> -->
                    <!-- </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>
<script>
import {isDEmpty} from '@/is';
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import {swalTost, swal} from '@/alert'
let timer = null
export default {
  data() {
    return {
      width: 0,
      height: 0,
      trTp : "EVENT",
      lanTp : "",
      info_seq : "",
      url : "",
      memberList : [],
      img_path : "",
      content : "",
      eventInfo : {},
      infoList : {},  
      gubun : "",
      resParam : {},
      imgList : [],
      imgDetail : null,
      videoInfo : {},
      eventFlag : false,
      isMobile : false,
      commentList : [],
      comments : [
        {
          comment_content: "",
          comment_id: "",
          lan_tp: "",
          like_cnt: 0,
          mod_date: "",
          reg_date: "",
          prod_id: "",
          user_email: "",
          user_img_path: "",
          user_nick: ""
        }
      ],
      comment_id : "",
      like_sum_cnt : 0,
      pencilFlag : true,
      vedioFlag : false,
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
  computed : {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.resParam = JSON.parse(history.state.reqParam)
    this.lanTp = sessionStorage.get('lan_tp')
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.isLoading = true
      this.getEventInfoList();
      this.getCommentList()
    }, 1000);
  },
  methods: {
    setClass() {
      this.gubun = ""
      this.content = ""
    },
    async getEventInfoList () {
      let info = await this.$api('/api/eventInfoDtl',{param:[this.resParam.event_id, this.lanTp]});
      this.eventInfo = info[0];
      console.log("this.eventInfo : ", this.eventInfo)
      // this.kpopImageList = info;
      let vedioUrlArry = [];
      let vedioTitleArry = [];
      let vedioArray = [];
      console.log("this.eventInfo1 : ", info[0].vedio_url)
      
      if(!isDEmpty(info[0].vedio_url)) {
        vedioUrlArry = info[0].vedio_url.split(",",-1);
        console.log("vedioUrlArry : ", vedioUrlArry)
      } else if(!isDEmpty(info[0].vedio_title)){
        vedioTitleArry = info[0].vedio_title.split(",", -1);
      }
      if(vedioUrlArry.length > 0)  {
        for(let i=0; i < vedioUrlArry.length; i++){
          let data = {
            vedio_url : vedioUrlArry[i],
          }
          if(vedioTitleArry.length > 0) {
            data = Object.assign(data, { vedio_title : vedioTitleArry[i] }) 
          }
          vedioArray.push(data);
        }
      }
      this.infoList = vedioArray;
      console.log("vedioArray : ", vedioArray)
      this.infoList = vedioArray;
      this.vedioFlag = !isDEmpty(this.eventInfo.vedio_url) ? true : false
      this.getImglist() 
    },
    
    async getImglist() {
      // let imgList = await this.$api('/api/kpopImageList', {param : [this.resParam.event_id,this.resParam.lan_tp,'Y']})
      let imgList = await this.$api('/api/kpopImageList', {param : [this.resParam.event_id]})
      this.imgList = imgList
      imgList.forEach(item => {
        if(item.file_type == '2') {
          this.imgList.push(item)
        } else if(item.file_type == '3') {
          this.imgDetail = item
        } else if(item.file_type == '4') {
          this.videoInfo = item
        }
      })
    },
    
    async goEventReserv() {
      let eventRservChk = await this.$api('/api/eventReservList', {param : [ this.eventInfo.event_id, this.user.mem_id, 'Y' ]})
      let info = await this.$api('/api/eventInfoDtl',{param:[this.resParam.event_id, this.lanTp]});
      this.eventInfo = info[0];
      let toDay = this.$dateFormat('today')
      let startDay = Number(this.eventInfo.start_day)
      let end_day = Number(this.eventInfo.end_day)
      console.log(toDay,startDay,end_day)
      console.log(Number(toDay) <= end_day)
      if(Number(toDay) <= end_day) {
        this.eventFlag = false
      } else {
        this.eventFlag = true
        return swal.fire({
                          title: this.$t("common.expire_end"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
        
      }
      console.log("eventRservChk : ", eventRservChk.length)
      if(this.eventFlag == false) {
        if(eventRservChk.length > 0) {
          return swal.fire({
                          title: this.$t("common.event_complete_noti"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
        } else {
          let reqParam = {
            lan_tp : this.lanTp,
            event_id : this.eventInfo.event_id,
            event_total_cnt : this.eventInfo.event_total_cnt,
            personnel_cnt : this.eventInfo.personnel_cnt,
            event_title : this.eventInfo.event_title
          }
          console.log("reqParam : ", reqParam)
          this.$router.push({path : '/eventReserv', state : {reqParam : JSON.stringify(reqParam)}})
        }
      } else {
        this.isDesabled = true
      }
    },
    goPage() {
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.lanTp}`
      // this.$router.push({path : '/', query : {lan_tp : this.lanTp}})
    },
    // onReady() {
    //   this.$refs.youtube.playVideo();
    // },
    paramInput(comments,gubun){
      // console.log(comments);
      // if(gubun != 'like'){
        // }
      this.gubun = gubun
      this.content = comments.comment_content
      this.comment_id = comments.comment_id
    },
    // tab 스크립트
    async getCommentList() {
      // console.log("commentList");
      this.pencilFlag = false
      this.gubun = ""
      this.content = ""
      this.commentList = await this.$api('/api/commentList',{param:[this.resParam.event_id, 'event']});
      let like_sum_cnt = await this.$api('/api/commentLikeCnt',{param:[this.resParam.event_id, 'event']});
      this.like_sum_cnt = like_sum_cnt[0].like_cnt
      console.log("commentLikeCnt : ",this.like_sum_cnt);
    },
    commentCancel() {
      this.gubun = ""
      this.content = ""
      return false;
    },
    async commentInsert() {
      this.pencilFlag = true
      if(isDEmpty(this.user.mem_id)) {
        return swal.fire({
                  title: this.$t("common.comment_login_fail"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
      }
      if(isDEmpty(this.content)) {
        return swal.fire({
                  title: this.$t("common.comment_content_nodata"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
      }
      // const maxId = await this.$api("/api/maxCommentId",{param:[this.resParam.prod_id]});
      swalTost.fire({
        title : this.$t('common.common_insert_confirm'),
        icon : 'question',
        confirmButtonText: this.$t('common.common_insert'),
        cancelButtonText : this.$t('common.common_cancel')
      }).then(async (result) => {
        if(result.isConfirmed) {
          const commSeq = await this.$api("/api/commSequences", {param : ['COMMENT','comment_id','6']});
          const {error} = await this.$api("/api/commentInsert", 
                          {param : [{
                            comment_content : this.content,
                            comment_id : commSeq[0].commSeq,
                            mem_id : this.user.mem_id,
                            lan_tp: this.lanTp,
                            like_cnt: 0,
                            reg_date: this.$dateFormat('filedate'),
                            prod_id: this.resParam.event_id,
                            user_email: this.user.mem_email,
                            user_img_path: this.user.mem_profile_path,
                            user_nick: this.user.mem_nick,
                            comment_type : 'event'
                          }
                          ]});
          if (error) {
            // console.error(error);
            return swal.fire({
                          title: this.$t("common.comment_insert_fail"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
          }
          this.gubun = ""
          this.content = ""
          
          swal.fire({
            title: this.$t("common.common_success"),
            icon : 'success',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_confirm"),
          })
          this.getCommentList();
        }
      }) 
    },
    async commentUpdate() {
      this.pencilFlag = true
      swalTost.fire({
        title : this.$t('common.common_update_confirm'),
        icon : 'question',
        confirmButtonText: this.$t('common.common_insert'),
        cancelButtonText : this.$t('common.common_cancel')
      }).then(async (result) => {
          if(result.isConfirmed) {
            const {error} = await this.$api("/api/commentUpdate", 
                            {param:[
                              {
                                comment_content : this.content,
                                like_cnt : this.comments.like_cnt,
                                mod_date : this.$dateFormat('filedate')
                              },
                              this.comment_id
                              ]});
            if (error) {
              // console.error(error);
              return swal.fire({
                          title: this.$t("common.comment_update_fail"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
            }
            this.gubun = ""
            this.content = ""
            swal.fire({
              title: this.$t("common.common_update_success"),
              icon : 'success',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_confirm"),
            })
            this.getCommentList();
          }
      })    
    },
    async likeUpdate(like_cnt,comment_id) {
      const {error} = await this.$api("/api/commentUpdate", 
                              {param:[
                                {like_cnt : like_cnt},
                                comment_id
                                ]});
      if (error) {
        // console.error(error);
        return swal.fire({
                          title: this.$t("common.comment_like_fail"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
      }
      this.getCommentList();
    },
    commentDelete(comment_id) {
      swalTost.fire({
          title : this.$t('common.common_delete_confirm'),
          icon : 'question',
          confirmButtonText: this.$t('common.common_delete'),
          cancelButtonText : this.$t('common.common_cancel')
      }).then(async (result) => {
          if(result.isConfirmed) {
              const {error} = await this.$api("/api/commentDelete", 
                              {param:[comment_id]});
              if (error) {
                // console.error(error);
                return swal.fire({
                          title: this.$t("common.comment_delete_fail"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
              }
              swal.fire({
                title: this.$t("common.common_delete_success"),
                icon : 'success',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_confirm"),
              })
              this.getCommentList();
          }
      }); 
    
    },
     
  }
}
</script>

<!-- <style src="../../../node_modules/@vueform/multiselect/themes/default.css"></style> -->

<style>
@import url(https://fonts.googleapis.com/css?family=Calibri:400,300,700);
/* #myTab .tab-content > [id='home-tab-pane']  {
    background-color: #EF476F;
}

#myTab .tab-content > [id='profile-tab-pane']  {
    background-color: #FF6663;
}

#myTab .tab-content > [id='contact-tab-pane']  {
    background-color: #FFD166;
} */

li a.active {
    background: #E9C46A;
}
.nav-pills > li > a.adopt-tab {
    color: #EF476F;
    border: none;
}
.nav-pills > li > a.adopt-tab.active {
    background-color: #EF476F;
    color: white;
    border: none;
}
.nav-pills > li > a.donate-tab {
    color: #EF476F;
    border: none;
}
.nav-pills > li> a.donate-tab.active {
    background-color: #EF476F;
    border: none;
}
.nav-pills > li > a.join-tab {
    color: #EF476F;
    border: none;
}
.nav-pills > li > a.join-tab.active {
    background-color: #EF476F;
    border: none;
}

body {
  background: #eee;
}

.date {
  font-size: 11px;
}

.comment-text {
  font-size: 12px;
}

.fs-12 {
  font-size: 12px;
}

.shadow-none {
  box-shadow: none;
}

.name {
  color: #007bff;
}

.cursor:hover {
  color: blue;
}

.cursor {
  cursor: pointer;
}

.textarea {
  resize: none;
}

.fa-facebook {
  color: #3b5999;
}

.fa-twitter {
  color: #55acee;
}

.fa-linkedin {
  color: #0077B5;
}

.fa-instagram {
  color: #e4405f;
}

.fa-dribbble {
  color: #ea4c89;
}

.fa-pinterest {
  color: #bd081c;
}

.fa {
  cursor: pointer;
}

.action-icons a {
    padding-left: 7px;
    vertical-align: middle;
    color: #99abb4;
}

.action-icons a:hover {
    color: #1976d2;
}
/* .nav-pills > li > a.adopt-tab.active { */
.action-icons > a:hover >i.fa-heart  {
    color: #f70909;
}


</style>

