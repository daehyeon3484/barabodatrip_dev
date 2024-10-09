<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{ events.event_title }}</h5>
      <h6 v-else class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{ events.event_title }}</h6>
      <div class="mt-1"> 
        <img :src="`/download/EVENT/${events.file_path}/${events.info_seq}/${events.file_type}/${events.file_name}`">
        <div class="card mt-1" style="border-radius: 8px;">
          <div class="card-body">
            <div class="mobile-md"><p class="card-title" style="color : #046582;font-weight: bold;">{{events.event_title}}</p></div>
            <div class="mobile-md"><p>{{$t("common.date_input")}} : {{events.ymd_format}}</p></div>
            <div class="mobile-md"><p class="bg-danger text-white">{{$t("common.event_reserv_cnt_input")}} : {{this.personnel_cnt}}</p></div>
          </div>
        </div>
        <div class="card-text border-top ">
          <div class="row pt-3 pb-3">
            <div class="input-group input-group-sm pb-1">
              <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{$t("common.event_reserv_cnt")}}</span>
              <select class="form-select form-select-sm font-md" v-model="total" @change="prodCntChange()">
                <option value="0">0</option>
                <option :value="i" :key="i" v-for="i in this.resParam.personnel_cnt">{{i}}</option>
              </select>
            </div>
            <div class="text-start pt-1"><span class="span-font-sm"><p class="text-danger">* {{$t("common.event_reserv_cnt_placeholder")}}</p></span></div>
          </div>
        </div>
      </div>
      <div v-if="this.total > 0"> 
        <div class="text-info" :key="idx" v-for="(k, idx) in this.total">
          <div class="mb-2 row">
            <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.name")}} [{{idx+1}}] </label>
            <div class="col-md-8">
              <input type="text" class="form-control mobile-md" :ref="`mem_nm`" v-model.trim="userInfo.mem_nm_arr[idx]" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_mem_nm_input")}}</span></div>
            </div>
          </div>
          <div v-if="idx == 0"> 
            <div class="mb-3 row">
              <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.tel")}} [{{idx+1}}]</label>
              <div class="col-md-8">
                <input type="text" class="form-control mobile-md" ref="mem_tel" v-model.trim="tel" :placeholder="$t(`common.order_tel_input`)" :aria-label="$t(`common.order_tel_input`)">
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_tel_input")}}</span></div>
              </div>
            </div>
            <div class="mb-3 row">
              <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.email")}} [{{idx+1}}]</label>
              <div class="col-md-8">
                <input type="text" class="form-control mobile-md" ref="mem_email" v-model.trim="email" :placeholder="$t(`common.common_email_input`)" :aria-label="$t(`common.common_email_input`)">
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_email_input")}}</span></div>
              </div>
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.passport_img")}} [{{ idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order == `${idx+1}` && c.file_type =='1')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`passDiv${idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="passFile" accept="image/*" @change="uploadFile($event.target.files, 1,`${idx+1}`)">
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.visa_img")}} [{{ idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order == `${idx+1}` && c.file_type =='2')">
                  <div class="position-relative admin-div text-start pb-1">
                    <div :id="`visaDiv${idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="visaFile" accept="image/*" @change="uploadFile($event.target.files, 2,`${idx+1}`)">
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.birth_img")}} [{{ idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${idx+1}` && c.file_type == '3')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`birthDiv${idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="birthFile" accept="image/*" @change="uploadFile($event.target.files, 3,`${idx+1}`)">
            </div>
          </div>
          <hr>
        </div>
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" :class="isMobile == true ? 'float-end btn btn-info btn-st-sm' : 'float-end btn btn-info btn-st-md'" @click="userInfoInsert">{{$t("common.common_reserv")}}</button>
        <button :class="isMobile == true ? 'float-end btn btn-danger me-md-2 btn-st-sm' : 'float-end btn btn-danger me-md-2 btn-st-md'" type="button" @click="deleteCutomerInfo">{{$t("common.order_customer_info_delete")}}</button>
        <button :class="isMobile == true ? 'float-end btn btn-dark me-md-2 btn-st-sm' : 'float-end btn btn-dark me-md-2 btn-st-md'" type="button" @click="goPage">{{$t("common.home")}}</button>
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import {isDEmpty} from '@/is';
import {swalTost, swal} from '@/alert'
let timer = null
export default {
  props:{
    cartList : Array
  },
  data() {
    return {
      index : 0,
      cnt : 0, 
      productTotal: 0,
      events : [],
      total: 0,
      trTp : "",
      sortSeq : "",
      userInfo : {
        mem_nm_arr : [],
      },
      tel : "",
      email : "",
      memberInfo : {mem_id : ""},
      passImgList : [
        {
          file_id : "",
          file_path : "",
          sort_order : "",
        }
      ],
      file_id_arr : [],
      file_path_arr : [],
      passport_name_arr : [],
      visa_name_arr : [],
      passport_obj : [],
      visa_obj : [],
      lanTp : "",
      resParam : {},
      products : {},
      reservInfoList : [],
      resType  : "REGISTER",
      personnel_cnt : 0,
      event_total_cnt : 0,
      checkFlag : false,
      event_title : "",
      ReservInsertList : [],
      ReservDelectList : [],
      delidx : 0,
      reserv_cnt : 0,
      eventReservCnt : 0,
      origin_cnt : 0,
      passportCnt : 0,
      isMobile : false,
      isLoading : true
    }
  },
  
  computed: {
    user() {
      return this.$store.state.user;
    },
    
  },
  mounted() {
    if(this.user.mem_id == undefined) {
      swal.fire({
        title: this.$t("common.common_login_fail"),
        icon : 'warning',
        timer: 1500, 
        confirmButtonText: this.$t("common.common_close"),
      })
      this.$router.push({path: "/login"});
    }
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    clearTimeout(timer)
  },
  created() {
    this.isMobile = this.$isMobile()
    this.personnel_cnt = this.resParam.personnel_cnt
    timer = setTimeout(() => {
      this.isLoading = true
      this.getPassPortImgage();
      this.getEventReservList()
      this.getEventInfo()
    }, 1000);
    // console.log("domain1 : ",this.email_domain);
    this.resParam = JSON.parse(history.state.reqParam)
  },
  methods: {
    async getEventInfo() {
      let eventInfo = await this.$api('/api/eventInfoDtl',{param:[this.resParam.event_id, this.resParam.lan_tp]});
      console.log("eventInfo : ", eventInfo[0])
      if(eventInfo.length > 0 ) {
        this.events = eventInfo[0]
      }
    },
    async prodCntChange() {
      let cnt = 0
      cnt = this.total
      this.personnel_cnt = this.resParam.personnel_cnt - this.total
      if(this.origin_cnt > this.total) {
        for(let i = this.origin_cnt ; i > this.total ; i--) {
          let imgs = await this.$api("/api/eventPassPortDtl",{param : [this.resParam.event_id, i]});     
          for(let j = 0; j < imgs.length; j++) {
            let info = {
                category : 'EVENT',
                categoryType : 'PASSPORT',
                filepath : imgs[j].file_path,
                event_id : imgs[j].event_id,
                mem_id : imgs[j].mem_id,
                file_type : imgs[j].file_type,
                sort_order : imgs[j].sort_order,
                file_name : imgs[j].file_name,
                modType : 'select'
              }
              this.$api(`/deleteFile/EVENT/PASSPORT`, {info});
              this.$api("/api/eventPassPortDelete",{param:[imgs[j].event_mem_file_id]});
          }
        }
        this.getPassPortImgage();
      }
      this.origin_cnt = cnt
    },
    async getEventReservList() {
      this.reservInfoList = await this.$api('/api/eventReservList', {param : [this.resParam.event_id,this.user.mem_id, 'Y']})
      if(this.reservInfoList.length > 0) {
        this.reservInfoList.forEach(item => {
          this.userInfo.mem_nm_arr.push(item.mem_nm)
        });
        this.tel = this.reservInfoList[0].tel
        this.email = this.reservInfoList[0].email
      }
    },
    async getPassPortImgage() {
      this.passImgList = await this.$api("/api/eventPassPortList",{param : [this.resParam.event_id, this.user.mem_id]});
    },
    async uploadFile(files, type,sort_order) {
      this.pfiles = files;
      let filepath = "";
      console.log(files, type,sort_order)
      let regType = 'REGISTER'
      let fileId = "nodata"
      if(this.pfiles.length > 0) {
        console.log(this.passImgList.length)
        if(this.passImgList.length > 0) {
          this.passImgList.forEach(item => {
            if(item.sort_order == sort_order && item.file_type == type) {
              filepath = item.file_path
              regType = 'MODIFY'
              fileId = item.event_mem_file_id
              let info = {
                category : 'EVENT',
                categoryType : 'PASSPORT',
                filepath : item.file_path,
                event_id : item.event_id,
                mem_id : item.mem_id,
                file_type : item.file_type,
                sort_order : item.sort_order,
                file_name : item.file_name,
                modType : 'select'
              }
              this.$api(`/deleteFile/EVENT/PASSPORT`, {info});
            } 
          });
          if(isDEmpty(filepath)) {
            filepath = this.$dateFormat ('todate');  
          }
        } else {
          filepath = this.$dateFormat ('todate');
        }
        
        const formData = new FormData()
        for(let i=0; i < this.pfiles.length ; i++) {
          formData.append('img', files[i])
        }
        await this.$api(`/upload/EVENT/PASSPORT/${filepath}/${this.resParam.event_id}/${this.user.mem_id}/${type}/${sort_order}/${regType}/${fileId}`,  formData);
        this.getPassPortImgage();
      }
    },
    deleteImage(obj) {
      swalTost.fire({
        title: this.$t("common.common_delete_confirm") ,
        icon : 'question',
        confirmButtonText: this.$t("common.common_delete"),
        cancelButtonText: this.$t("common.common_cancel")
      }).then(async (result) => {
        if (result.isConfirmed) {
          let info = {
            category : 'EVENT',
            categoryType : 'PASSPORT',
            filepath : obj.file_path,
            event_id : obj.event_id,
            mem_id : obj.mem_id,
            file_type : obj.file_type,
            sort_order : obj.sort_order,
            file_name : obj.file_name,
            modType : 'select'
          }
          await this.$api(`/deleteFile/EVENT/PASSPORT`, {info});
          await this.$api("/api/eventPassPortDelete",{param:[obj.event_mem_file_id]});
          this.getPassPortImgage();
        } 
      });
    },
    validationChk () {
      for(let idx =0 ; idx <  this.total; idx++) {
        if(isDEmpty(this.userInfo.mem_nm_arr[idx])){
          this.$refs.mem_nm[idx].focus();
          swal.fire({
            title: this.$t('order.name')+[idx+1]+this.$t('order.sub_input_msg'),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          return false
        }
        if(idx == 0) {
          const regex = /^[0-9]+$/
          const regex1 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
          if(isDEmpty(this.tel)){
            this.$refs.mem_tel[0].focus()
            swal.fire({
              title: this.$t('order.tel')+[1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          } else {
            if (!regex.test(this.tel)) {
                this.tel = ''
                this.$refs.mem_tel[0].focus()
                swal.fire({
                  title: this.$t("common.common_tel_number"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
                return false
            }
          }
          if(isDEmpty(this.email)){
            this.$refs.mem_email[0].focus()
            swal.fire({
              title: this.$t('order.email')+[1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          } else {
            if (!regex1.test(this.email)) {
              this.email = ''
              this.$refs.mem_email[0].focus()
              swal.fire({
                title: this.$t("common.common_login_email_validation"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              return false
            }
          }
        }
        let pass = document.querySelector(`#passDiv${idx}`)
        let visa = document.querySelector(`#visaDiv${idx}`)
        let birth = document.querySelector(`#birthDiv${idx}`)
        if(isDEmpty(pass)) {
          this.$refs.passFile[idx].focus()
          swal.fire({
            title: this.$t('order.passport_img_fail'),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          return false
        }
        if(isDEmpty(visa)) {
          this.$refs.visaFile[idx].focus()
          swal.fire({
            title: this.$t('order.passport_img_fail'),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          return false
        }
        if(isDEmpty(birth)) {
          this.$refs.birthFile[idx].focus()
          swal.fire({
            title: this.$t('order.passport_img_fail'),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          return false
        }
      }
      return true
    },
    async userInfoInsert() {
      if(this.total < 1) {
        swal.fire({
          title: this.$t('common.event_reserv_cnt_placeholder'),
          icon : 'warning',
          timer: 1500, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      } else  {
        if(this.validationChk()) {
          let eventInfo = await this.$api('/api/eventInfoDtl',{param:[this.resParam.event_id, this.resParam.lan_tp]});
          console.log("eventInfo : ", eventInfo[0])
          if(eventInfo.length > 0 ) {
            this.events = eventInfo[0]
          }
          if(this.total > this.events.eventPassportCnt) {
            swal.fire({
              title: this.$t('common.event_reserv_cnt_fail'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          swalTost.fire({
              title : this.$t('common.common_reserv_confirm'),
              icon : 'question',
              confirmButtonText: this.$t('common.common_insert'),
              cancelButtonText : this.$t('common.common_cancel')
          }).then(async (result) => {
            console.log(result)
              if(result.isConfirmed) {
                let data = {
                  event_id : this.resParam.event_id,
                  mem_id : this.user.mem_id,
                  mem_nm : this.userInfo.mem_nm_arr[0],
                  tel : this.tel,
                  email : this.email,
                  use_yn : 'Y',
                  del_yn : 'N',
                }
                let mData = {
                  mem_id : this.user.mem_id,
                  use_yn : 'Y',
                }
                if(this.reservInfoList.length < 1) {
                  let eventRvId = await this.$api("/api/commSequences", {param : ['EVT_RV','event_rv_id','9']})
                  data = Object.assign(data, {event_rv_id : eventRvId[0].commSeq})
                  data = Object.assign(data, {application_yn : 'Y'})
                  data = Object.assign(data, {reg_date : this.$dateFormat('filedate')})
                  await this.$api("/api/eventReservInsert" ,{param : [data]});
                  for(let i=0; i < this.total; i++) {
                    let eventRvMemId = await this.$api("/api/commSequences", {param : ['EVT_RV_MEM','event_rv_mem_id','9']})
                    mData = Object.assign(mData, {event_rv_mem_id : eventRvMemId[0].commSeq})
                    mData = Object.assign(mData, {event_rv_id : eventRvId[0].commSeq})
                    mData = Object.assign(mData, {mem_nm : this.userInfo.mem_nm_arr[i]})
                    mData = Object.assign(mData, {reg_date : this.$dateFormat('filedate')})
                    await this.$api("/api/eventReservMemInsert" ,{param : [mData]});
                  }
                } else {
                  data = Object.assign(data, {mod_date : this.$dateFormat('filedate')})
                  await this.$api("/api/eventReservUpdate" ,{param : [data, this.reservInfoList[0].event_rv_id]});
                  mData = Object.assign(mData, {mod_date : this.$dateFormat('filedate')})
                  for(let i=0; i < this.total; i++) {
                    mData = Object.assign(mData, {mem_nm : this.userInfo.mem_nm_arr[i]})
                    await this.$api("/api/eventReservMemUpdate" ,{param : [mData, this.reservInfoList[0].event_rv_id]});
                  }
                } 
                await this.$api("/api/eventInfoUpdate" ,{
                  param : [
                    {
                      personnel_cnt : this.personnel_cnt,
                    },
                    this.resParam.event_id
                  ]        
                }); 
                let info = {
                  event_title : this.events.event_title,
                  event_date : this.events.ymd_format,
                  email : this.email,
                  event_cnt : this.total,
                  mem_nm : this.user.mem_nm,
                  email_type : 'event_rv'
                }
                await this.$api('/smtp/email' , {info})
                swal.fire({
                  title: this.$t("common.order_customer_info_success"),
                  icon : 'success',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_confirm"),
                })
                this.$router.push({path:'/', query : {lan_tp : this.resParam.lan_tp}});
              }
          })    
        }
      }
      
    },
    async deleteCutomerInfo() {
        swalTost.fire({
          title: this.$t("common.event_rv_no_application") ,
          icon : 'question',
          confirmButtonText: this.$t('common.common_delete'),
          cancelButtonText: this.$t('common.common_cancel')
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.$api("/api/eventInfoUpdate" ,{
              param : [
                {
                  personnel_cnt : this.personnel_cnt + this.total,
                },
                this.resParam.event_id
              ]        
            }); 
            // 파일삭제
            if(this.passImgList.length > 0) {
              // let imgs = this.passImgList[0]
              let toDay = this.$dateFormat('todate')
              let info = {}
              let data = {}
              let fileArr = []
              let fileArr1 = []
              this.passImgList.forEach(item => {
                if(toDay == item.file_path) {
                  data = {
                    category : 'EVENT',
                    categoryType : 'PASSPORT',
                    filepath : item.file_path,
                    event_id : item.event_id,
                    mem_id : item.mem_id,
                    modType : 'all',
                  }
                  fileArr.push(data)
                } else {
                  data = {
                    category : 'EVENT',
                    categoryType : 'PASSPORT',
                    filepath : item.file_path,
                    event_id : item.event_id,
                    mem_id : item.mem_id,
                    modType : 'all',
                  }
                  fileArr1.push(data)
                } 
              })
              if(fileArr.length > 0) {
                info = fileArr[0]
              }
              if(fileArr1.length > 0) {
                info = fileArr[1]
              }
              this.$api(`/deleteFile/EVENT/PASSPORT`, {info});
              this.$api('/api/eventPassPortAllDelete', {param : [this.user.mem_id, this.resParam.event_id]})
            }
            if(this.reservInfoList.length > 0) {
              await this.$api('/api/eventReservDelete', {param : [this.reservInfoList[0].event_rv_id]})
              await this.$api('/api/eventReservMemDelete', {param : [{event_rv_id : this.reservInfoList[0].event_rv_id}]})
            }
            this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
          }
        });
    },
    async goPage() {
      let reservInfoList = await this.$api('/api/eventReservList', {param : [this.resParam.event_id,this.user.mem_id, 'Y']})
      let passCnt = await this.$api('/api/eventPassportCnt', {param : [this.resParam.event_id,this.user.mem_id]})
      let imgCnt = passCnt[0].imgGroupCnt
      if((reservInfoList.length < this.total) || (imgCnt < this.total)) {
        this.deleteCutomerInfo()
      } else {
        window.location.reload(true)
        window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
        // this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
      }
    }
    
  },
}

</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>