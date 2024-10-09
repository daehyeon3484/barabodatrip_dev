<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("common.common_custom_travel_application")}}</h5>
      <h6 v-else class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("common.common_custom_travel_application")}}</h6>
      <div class="row"> 
        <div class="mb-2 pt-3 row" >
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_travel_schedul_date")}}</label>
          <div class="date mt-1" style="padding:0">
            <span v-if="!isMobile" class="fw-bold mt-2 text-start">{{$t("common.common_start_date")}}:</span>
            <font-awesome-icon
              icon="fa-solid fa-calendar-days"
              transform="down-15 right-22"
              class="fa fa-calendar"
              style="z-index: 1;"
              @click="clickCalIcon('dp2From')"
            />
            <Datepicker
              id="datepicker"
              v-model="dp2From"
              :ref="inputs.dp2From"
              class="form-control me-2"
              :locale="locale"
              :weekStartsOn="0"
              :inputFormat="inputFormat"
              style="text-align: center;cursor: pointer; width: 120px;"
              @focus="setOldValue($event.target.value)"
              @update:modelValue="validateFromTo('from', 'dp2From', 'dp2To')"
            />
            <span v-if="!isMobile" class="fw-bold mt-2 text-start">{{$t("common.common_end_date")}}:</span>
            <font-awesome-icon
              icon="fa-solid fa-calendar-days"
              transform="down-15 right-22"
              style="z-index: 1;"
              @click="clickCalIcon('dp2To')"
            />
            <Datepicker
              id="datepicker"
              v-model="dp2To"
              :ref="inputs.dp2To"
              class="form-control"
              :locale="locale"
              :weekStartsOn="0"
              :inputFormat="inputFormat"
              style="text-align: center;cursor: pointer;width: 120px;"
              @focus="setOldValue($event.target.value)"
              @update:modelValue="validateFromTo('to', 'dp2From', 'dp2To')"
            />
          </div>
        </div>
        <div class="mb-2 row" > 
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_travel_type")}}</label>
          <div class="input-group-text bg-danger-subtle mt-1 div-color" :key="k" v-for="(travelType,k) in travelTypes"> 
            <div> 
              <input class="form-check-input me-1" type="checkbox" :value="travelType.com_cd_group_code"  @change="travelTypeChange($event,travelType,i)">
              <label class="form-check-label text-dark " for="flexCheckDefault">{{travelType.trv_type_name}}</label>
            </div>
          </div>
          <div v-if="typeFlag" class="mt-1" style="padding: 0;"> 
            <input class="form-control font-sm" v-model="trv_type_etc" :placeholder="$t(`common.common_travel_etc`)">
          </div>
        </div>
        <div class="mb-2 row"> 
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_destination_select")}}</label>
          <!-- <div class="d-flex " style="padding: 0;"> -->
            <!-- <checkbox type="checkbox"  :value="destination.com_cd_group_code"
            v-model="selectCartId" class=" text-dark me-1" :key="i" v-for="(destination,i) in destinations" @change="test($event)">{{destination.cd_name}}</checkbox> -->
            <div class="input-group-text bg-info"> 
              <span :key="i" v-for="(destination,i) in destinations"> 
                <input class="form-check-input mt-1 me-1" type="checkbox" :value="destination.com_cd_group_code"  @change="destinationChange($event,destination,i)">
                <label class="form-check-label me-1 text-white fw-bold" for="flexCheckDefault">{{destination.cd_name}}</label>
              </span>
            </div>
            <div v-if="destionationList.length > 0" class="input-group-text bg-info mt-1">
              <span :key="k" v-for="(destions, k) in this.destionationList">
                <button type="button" class="btn btn-dark text-white btn-st-md me-1">{{destions.dastion_name}}</button>
              </span>
            </div>
            <div class="mt-1" style="padding: 0;"> 
              <input class="form-control font-sm" v-model="destination_etc" :placeholder="$t(`common.common_travel_etc`)">
            </div>
          <!-- </div> -->
        </div>
        <div class="mb-2 row" > 
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_travel_hotel_type")}}</label>
          <div class="input-group-text bg-info mt-1" :key="k" v-for="(hotelType,k) in hotelTypes"> 
            <div class="form-check"> 
              <input class="form-check-input mt-1 me-1" type="radio" name="hotelType" :id="`hotelType${k}`" :value="hotelType.trv_accommo_group" @change="hotelTypeChange(hotelType,'type')">
              <label class="form-check-label text-white fw-bold" for="flexCheckDefault">{{hotelType.trv_accommo_name}}</label>
            </div>
          </div>
          <div v-if="typeFlag" class="mt-1" style="padding: 0;"> 
            <input class="form-control font-sm" v-model="trv_accommo_etc" :placeholder="$t(`common.common_travel_etc`)">
          </div>
        </div>
        <div v-if="hotelGradeFlag" class="mb-2 row" > 
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_hotel_grade")}}</label>
          <div class="input-group-text bg-info mt-1" :key="k" v-for="(hotelGrad,k) in hotelGrades"> 
            <div class="form-check"> 
              <input class="form-check-input mt-1 me-1" type="radio" name="hotelGrad" :id="`hotelGrad${k}`" :value="hotelGrad.trv_accommo_grade_group" @change="hotelTypeChange(hotelGrad,'grade')">
              <label class="form-check-label text-white fw-bold" for="flexCheckDefault">{{hotelGrad.trv_accommo_grade_name}}</label>
            </div>
          </div>
        </div>
        <div class="mb-2 row" > 
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_hotel_room")}}</label>
          <div class="input-group-text bg-info mt-1" :key="k" v-for="(hotelPeple,k) in hotelPeples"> 
            <div class="form-check"> 
              <input class="form-check-input mt-1 me-1" type="radio" name="hotelPeple" :id="`hotelPeple${k}`" :value="hotelPeple.trv_accommo_group" @change="hotelTypeChange(hotelPeple,'peple')">
              <label class="form-check-label text-white fw-bold" for="flexCheckDefault">{{hotelPeple.trv_accommo_peple_name}}</label>
            </div>
          </div>
        </div>
        <!-- <div class="mb-2 row" > 
          <label  class="col-form-label font-md fw-bold text-info text-start" style="padding:0">{{$t("common.common_hotel_bad")}}</label>
          <div class="input-group-text bg-info mt-1" :key="k" v-for="(hotelBad,k) in hotelBads"> 
            <div class="form-check"> 
              <input class="form-check-input mt-1 me-1" type="radio" name="hotelPeple" :id="`hotelPeple${k}`" :value="hotelBad.trv_accommo_group" @change="hotelTypeChange(hotelBad,'bad')">
              <label class="form-check-label text-white fw-bold" for="flexCheckDefault">{{hotelBad.trv_accommo_bad_name}}</label>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </main>
</template>    

<script>
// import {generateSessionStorage} from '@/storage'
// const sessionStorage = generateSessionStorage()
// import {swalTost, swal} from '@/alert'
import {swal} from '@/alert'
import { isDEmpty } from '@/is';
import { ref, reactive, defineComponent } from 'vue';
import Datepicker from 'vue3-datepicker';
import { ko } from 'date-fns/locale';
import { defineRefs } from '../../../helper.js';
// const moment = require('moment');
// import { watch } from '@vue/runtime-core';
const inputs = defineRefs(['dp2From', 'dp2To', 'dp2']);
let timer = null
let dp2From = ref();
let dp2To = ref();
let dateMsg = ref(null)
let closeMsg = ref(null)
export default defineComponent({
  components : {
    Datepicker
  },
  data() {
    return {
      isMobile : false,
      resParam : {},
      destinations : [],
      destionationList : [],
      travelTypes : [],
      travelTypeList : [],
      hotelTypes : [],
      hotelTypeList : [],
      hotelGrades : [],
      hotelGradeList : [],
      hotelBads : [],
      hotelBadList : [],
      hotelPeples : [],
      hotelPepleList : [],
      destination_etc : "",
      trv_type_etc : "",
      trv_atc_dtc : "",
      trv_accommo_etc : "",
      typeFlag : false,
      hotelGradeFlag : false,
    }
  },
  computed : {
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    console.log("this.user.user_id  :",this.user.mem_id)
    if(isDEmpty(this.user.mem_id)) {
      swal.fire({
        title: this.$t("common.common_login_fail"),
        icon : 'warning',
        timer: 3000, 
        confirmButtonText: this.$t("common.common_close"),
      })
      this.$router.push({path : '/'})
    }
    timer = setTimeout(() => {
      this.init();
    }, 1000);
    dateMsg = ref(this.$t("common.common_date_vaildation1"))
    closeMsg = ref(this.$t("common.common_close"))
  },
  unmounted() {
    clearTimeout(timer)
  },
  created() {
    this.isMobile = this.$isMobile()
    this.resParam = JSON.parse(history.state.reqParam)
  },
  setup() {
    const picked = ref(new Date());
    const locale = reactive(ko);
    const inputFormat = ref('yyyy-MM-dd');
    const dp2 = ref(new Date());
    const now = new Date();
    // const dp2 = ref(new Date());
    dp2From = ref(new Date(now.setDate(now.getDate())));
    dp2To = ref(new Date(now.setDate(now.getDate() + 3)));
    let oldVal = '';
    const clickCalIcon = (refId) => {
      const dp = inputs[refId].value;
      dp.inputRef.focus();
    };
    const setOldValue = (val) => {
      oldVal = val;
    };
    const validateFromTo = (target, refFrom, refTo) => {
      setTimeout(() => {
        const dpFrom = inputs[refFrom].value;
        const dpTo = inputs[refTo].value;
        if (dpFrom.input > dpTo.input) {
          swal.fire({
            title: dateMsg.value,
            icon : 'warning',
            timer: 3000, 
            confirmButtonText: closeMsg.value,
          })
          let date = null;
          if (oldVal) {
            const arrOldVal = oldVal.split('-');
            date = new Date(
              Number(arrOldVal[0]),
              Number(arrOldVal[1])-1 ,
              Number(arrOldVal[2]),
            );
          }
          if (target === 'from') {
            dp2From.value = date;
          } else if (target === 'to') {
            dp2To.value = date;
          }
          return;
        }
        
      }, 10);
    };
    const isTodayOver = (date) => {
      return date > new Date();
    };
    // watch(() => state.content, () => {
        
    //     console.log("state.content : ", state.content )
    // },{
    //     immediate:true,
    //     deep:true,
    // });
    
    // const modules = {
    //   name: 'ImageUploader',
    //   module: ImageUploader,
    //   options: {
    //     upload: file => {
    //       return new Promise((resolve, reject) => {
    //         const formData = new FormData();
    //         formData.append("img", file);
    //         axios.post(`/editorUpload/EDITOR/PRODUCT`, formData)
    //         .then(res => {
    //           console.log(res)
    //           resolve(res.data.url);
    //         })
    //         .catch(err => {
    //           reject("Upload failed");
    //           console.error("Error:", err)
    //         })
    //       })
    //     }
    //   }
    // }
    return {
      picked,locale,inputFormat,inputs,clickCalIcon,
      dp2From,dp2To,dp2,setOldValue,validateFromTo,isTodayOver,
      
    };
  },
  methods : {
    init() {
      this.getTravelCategory()
      this.getDestination()
      this.getTravelType()
      this.getHotelType()
      this.getHotelInfos()
    },
    getTravelCategory() {

    },
    async getDestination() {
      let cd_type = this.resParam.lan_tp
      this.destinations = await this.$api('/api/customNation', {param : [cd_type,'CG003']})
      console.log("nations : ", this.destinations)
    },
    async getTravelType() {
      let travelTypes = await this.$api('/api/getCode', {param : ['CG005']})
      travelTypes.forEach(item => {
        let cd_name = ""
        if(this.resParam.lan_tp == 'KOR') {
          cd_name = item.cd_name
        } else if(this.resParam.lan_tp == 'VTN') {
          cd_name = item.cd_vn_name
          
        } else if(this.resParam.lan_tp == 'JPN') {
          cd_name = item.cd_jp_name
          
        } else if(this.resParam.lan_tp == 'CHN') {
          cd_name = item.cd_cn_name
          
        } else {
          cd_name = item.cd_en_name
        }
        let data = {
          trv_group_type : item.com_cd_group_code,
          trv_type : item.com_cd_code,
          trv_type_name : cd_name
        }
        this.travelTypes.push(data)
      });
    },
    async getHotelType() {
      let hotelTypes = await this.$api('/api/getCode', {param : ['CG006']})
      hotelTypes.forEach(item => {
        let cd_name = ""
        if(this.resParam.lan_tp == 'KOR') {
          cd_name = item.cd_name
        } else if(this.resParam.lan_tp == 'VTN') {
          cd_name = item.cd_vn_name
          
        } else if(this.resParam.lan_tp == 'JPN') {
          cd_name = item.cd_jp_name
          
        } else if(this.resParam.lan_tp == 'CHN') {
          cd_name = item.cd_cn_name
          
        } else {
          cd_name = item.cd_en_name
        }
        let data = {
          trv_accommo_type_group : item.com_cd_group_code,
          trv_accommo_type : item.com_cd_code,
          trv_accommo_name : cd_name,
        }
        this.hotelTypes.push(data)
      });
    },
    async getHotelInfos() {
      let hotelInfos = await this.$api('/api/getCodeGroup', {param : ['CG006']})
      hotelInfos.forEach(item => {
        if(item.cd_code2 == 'H') {
          let cd_name = ""
          if(this.resParam.lan_tp == 'KOR') {
            cd_name = item.cd_name
          } else if(this.resParam.lan_tp == 'VTN') {
            cd_name = item.cd_vn_name
            
          } else if(this.resParam.lan_tp == 'JPN') {
            cd_name = item.cd_jp_name
            
          } else if(this.resParam.lan_tp == 'CHN') {
            cd_name = item.cd_cn_name
            
          } else {
            cd_name = item.cd_en_name
          }
          let data = {
            trv_accommo_grade_group : item.com_cd_group_code,
            trv_accommo_grade : item.com_cd_code,
            trv_accommo_grade_name : cd_name
          }
          this.hotelGrades.push(data)
        } else if(item.cd_code2 == 'P') {
          let cd_name = ""
          if(this.resParam.lan_tp == 'KOR') {
            cd_name = item.cd_name
          } else if(this.resParam.lan_tp == 'VTN') {
            cd_name = item.cd_vn_name
            
          } else if(this.resParam.lan_tp == 'JPN') {
            cd_name = item.cd_jp_name
            
          } else if(this.resParam.lan_tp == 'CHN') {
            cd_name = item.cd_cn_name
            
          } else {
            cd_name = item.cd_en_name
          }
          let data = {
            trv_accommo_peple_group : item.com_cd_group_code,
            trv_accommo_peple : item.com_cd_code,
            trv_accommo_peple_name : cd_name
          }
          this.hotelPeples.push(data)
        } else {
          let cd_name = ""
          if(this.resParam.lan_tp == 'KOR') {
            cd_name = item.cd_name
          } else if(this.resParam.lan_tp == 'VTN') {
            cd_name = item.cd_vn_name
            
          } else if(this.resParam.lan_tp == 'JPN') {
            cd_name = item.cd_jp_name
            
          } else if(this.resParam.lan_tp == 'CHN') {
            cd_name = item.cd_cn_name
            
          } else {
            cd_name = item.cd_en_name
          }
          let data = {
            trv_accommo_bad_group : item.com_cd_group_code,
            trv_accommo_bad : item.com_cd_code,
            trv_accommo_bad_name : cd_name
          }
          this.hotelBads.push(data)
        }
      });
    },
    async getHotelRoomKind() {
      // let hotelTypes = await this.$api('/api/getCode', {param : ['CG006']})
      // hotelGrades = hotelTypes.filter(c=> {c.cd_type == 'H'})
      // hotelGrades.forEach(item => {
      //   let cd_name = ""
      //   if(this.resParam.lan_tp == 'KOR') {
      //     cd_name = item.cd_name
      //   } else if(this.resParam.lan_tp == 'VTN') {
      //     cd_name = item.cd_vn_name
          
      //   } else if(this.resParam.lan_tp == 'JPN') {
      //     cd_name = item.cd_jp_name
          
      //   } else if(this.resParam.lan_tp == 'CHN') {
      //     cd_name = item.cd_cn_name
          
      //   } else {
      //     cd_name = item.cd_en_name
      //   }
      //   let data = {
      //     trv_accommo_type : item.com_cd_group_code,
      //     trv_accommo_grade : item.com_cd_code,
      //     trv_accommo_grade_name : cd_name
      //   }
      //   this.hotelGrades.push(data)
      // });
    },
    destinationChange(event,obj,idx) {
      let checkeds = event.target.checked
      
      if(checkeds) {
        this.destionationList.push(
          {
            trv_type : obj.cd_code1,
            destion_type : obj.com_cd_code,
            dastion_name : obj.cd_name,
          }
        )
      } else {
        for(let i = 0; i < this.destionationList.length; i++) {
          if(i == idx) {
            this.destionationList.splice(idx, 1);
          }
        }
      }

    },
    travelTypeChange(event,obj,idx) {
      let checkeds = event.target.checked
      if(checkeds) {
        if(obj.trv_group_type == 'CG005' && obj.trv_type == '06') {
          this.typeFlag = true
        }
        this.travelTypeList.push(
          {
            trv_group_type : obj.trv_group_type,
            trv_type : obj.trv_type,
            trv_type_name : obj.trv_type_name
          }
        )
      } else {
        if(obj.trv_group_type == 'CG005' && obj.trv_type == '06') {
          this.typeFlag = false
          this.trv_type_etc = ""
        }
        this.travelTypeList.splice(idx, 1);
      }
      console.log(this.travelTypeList)
    },
    hotelTypeChange(obj,type) {
      console.log("type : ",type)
      // console.log("type : ",type)
      if(type == 'type') {
        this.hotelGradeFlag = obj.trv_accommo_type == '01' ? true : false
      }
    }
  },

})
</script>
<style scoped>

div.date {
 display: inline-flex;
 padding: 0;
}
</style>