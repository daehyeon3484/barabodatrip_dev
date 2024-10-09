<template>
  <main class="mt-1"> 
    <div class="continer">
      <div v-if="this.productImage.length > 0" class="row" > 
        <div class="col-md-12 col-padding">
          <div id="carouselExampleRide" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div :class="`carousel-item ${i==0?'active':''}`" :key="i" v-for="(img, i) in productImage" >
                <div class="imgContainer"> 
                  <img class="" :src="`/download/${img.file_path}/${img.prod_id}/${img.file_type}/${img.file_name}`" >
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
      <div class="row mt-1">
        <div class="col-md-12 col-padding">
          <div class="card shadow-sm" style="border-radius: 9px;">
            <div class="card-body">
              <div :class="isMobile == true ? 'card-title text-break mobile-lg fw-bold text-info' : 'fw-bold card-title text-break text-info'">{{productDetail.prod_title}}</div>
              <div :class="isMobile == true ? 'mobile-lg pb-1 text-info' : 'pb-1 text-info'"><span>{{ $t("common.date_input") }} : {{ productDetail.ymd_format }}</span></div>
              <div v-if="packageFlag" :class="isMobile == true ? 'mobile-lg text border-top pt-1 pb-1' : 'text border-top pt-1 pb-1'">
                <span><strong class="text-secondary">{{ $t("common.common_prod_package") }}</strong></span>
                <div class="mobile-sm"><label class="text-center text-danger">* {{$t("common.common_prod_package_noti")}}</label></div>
                <div class="pt-1 pb-1">
                  <select class="form-select form-select-sm font-md " v-model="prod_package_id" @change="packageChange($event)">
                    <option :value="packages.prod_id" :key="i" v-for="(packages,i) in productPackageList">{{packages.prod_name}}</option>
                  </select>
                </div>
              </div>
              <div :class="isMobile == true ? 'mobile-lg text border-top pt-1 pb-1' : 'text border-top pt-1 pb-1'"><span><strong class="text-secondary">{{ $t("common.common_location") }}</strong></span></div>
              <div :class="isMobile == true ? 'mobile-lg pb-1' : 'pb-1'"><span><strong class="text-info">{{ productDetail.tr_place }}</strong></span></div>
              <div :class="isMobile == true ? 'mobile-lg text border-top pt-1 pb-1' : 'text border-top pt-1 pb-1'"><span><strong class="text-secondary">{{ $t("common.common_prod_desc") }}</strong></span></div>
              <!-- <div :class="isMobile == true ? 'mobile-lg pb-1' : 'pb-1'"><span class="text-info text-start">{{ productDetail.prod_desc }}</span></div> -->
              <div class="mobile-md pb-1 text-info text-start" v-html="productDetail.prod_desc"></div>
              <div :class="isMobile == true ? 'card-title pt-1 border-top fw-bold text-info mobile-lg' : 'card-title pt-1 border-top fw-bold text-info'">
                <div :class="isMobile == true ? 'mobile-lg' : ''"><label class="text-end text-secondary pb-1" >[ {{$t("common.common_prod_quantity")}} {{ productDetail.inventory_cnt}} ]</label></div>
                {{getCurrencyFormat(this.prod_price)}} {{this.curUnit}}
              </div>
              <div v-if="hotelFlag" :class="isMobile == true ? 'mobile-lg text border-top pt-1 pb-1' : 'text border-top pt-1 pb-1'">
                <span><strong class="text-secondary">{{ $t("common.common_hotel_type") }}</strong></span>
                <div class="mobile-sm"><label class="text-center text-danger">* {{$t("common.common_hotel_noti")}}</label></div>
                <div class="pt-1 pb-1 input-group input-group-sm g-3 ">
                  <!-- <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span> -->
                  <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" :value="hotel_s_list.origin_hotel_price" @change="changeCheck($event)">
                  </div>
                  <input type="text" v-model="hotel_s_list.hotel_type_nm" class="form-control">
                  <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span>
                  <select class="form-select form-select-sm font-md" v-model="hotel_s_personnel" @change="personnelChange($event,'S')" :disabled="this.check_s_flag ? false : true">
                    <option value="0">0</option>
                    <option :value="i" :key="i" v-for="i in 20">{{i}}</option>
                  </select>
                </div>
                <div class="pt-1 pb-1 input-group input-group-sm g-3 ">
                  <!-- <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span> -->
                  <div class="input-group-text">
                    <input class="form-check-input mt-0" :value="hotel_d_list.origin_hotel_price" type="checkbox" aria-label="Checkbox for following text input" @change="changeCheck1($event)">
                  </div>
                  <input type="text" v-model="hotel_d_list.hotel_type_nm" class="form-control">
                  <span :class="isMobile == true ? 'input-group-text span-font' : 'input-group-text'" id="inputGroup-sizing-sm">{{ $t("common.common_personnel") }}</span>
                  <select class="form-select form-select-sm font-md" v-model="hotel_d_personnel" @change="personnelChange($event,'D')" :disabled="this.check_d_flag ? false : true">
                    <option value="0">0</option>
                    <option :value="i" :key="i" v-for="i in d_personnels">{{i}}</option>
                  </select>
                </div>
              </div>
              <!-- <div v-if="productDetail.seat_yn = 'Y'" class="card-text border-top pb-1"> 
                <div :class="isMobile == true ? 'mobile-lg' : ''"><label class="text-end text-secondary fw-bold pt-1 pb-1">{{ $t("common.common_seat_option") }}</label></div>
                <div :class="stand_yn == 'Y' ? 'input-group-text bg-secondary' : 'input-group-text bg-info'">
                    <input class="form-check-input mt-1 me-1" type="radio" name="seatType" :id="`seatType0`" value="30000" @change="seatChange($event,'ground')" :disabled="stand_yn == 'Y' ? true : false">
                    <label class="form-check-label text-white fw-bold" for="flexCheckDefault">{{ $t("common.common_ground") }}</label>
                </div>
                <div :class="stand_yn == 'Y' ? 'input-group-text bg-info' : 'input-group-text bg-secondary'"> 
                  <input class="form-check-input mt-1 me-1" type="radio" name="seatType" :id="`seatType1`" value="30000" @change="seatChange($event,'stand')" :disabled="stand_yn == 'Y' ? false : true">
                  <label class="form-check-label text-white fw-bold" for="flexCheckDefault">{{ $t("common.common_stand") }}</label>
                </div>
              </div> -->
              <div v-if="options.length > 0" class="card-text border-top pb-1">
                <div :class="isMobile == true ? 'mobile-lg' : ''"><label class="text-end text-secondary fw-bold pt-1 pb-1">{{ $t("product.paid_option") }}</label></div>
                <div v-html="this.optionMsg"></div>
                <div class="col-auto pb-1">
                  <div class="input-group">
                    <Multiselect
                      v-model="optValue"
                      mode="tags"
                      :close-on-select="false"
                      :searchable="false"
                      :create-option="true"
                      :options="options"
                      track-by="value"
                      label="label"
                      :placeholder="$t(`product.paid_option_select`)"
                      :noResultsText="$t(`product.noresults_text`)"
                      @change="addTag"
                    />
                  </div>
                </div>
              </div>
              <div v-if="this.optionArray.length > 0" class="card-text border-top pb-1">
                <div class="row pt-1 pb-1">
                  <div :class="isMobile == true ? 'mobile-md' : ''"><label class="text-center text-info pt-1 pb-1">{{$t("common.opt_participants")}}</label></div>
                  <div class="pt-1 ">
                    <div class="input-group input-group-sm g-3 pt-1" :key="i" v-for="(opt,i) of this.optionArray">
                      <input type="text" class="form-control col-md-12 mobile-md" v-model="opt.opt_name" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readonly>
                      <span class="input-group-text col-md-2 span-font" id="inputGroup-sizing-sm">{{ $t("common.participation") }}</span>
                      <select class="form-select form-select-sm col-md-2 font-md" @change="optionChange($event, opt)">
                        <option value="0">0</option>                        
                        <option :value="i" :key="i" v-for="i in 50">{{i}}</option>                        
                      </select>
                    </div>
                    <!-- <div> 
                      <span class="text-center text-danger" id="inputGroup-sizing-sm">{{ optionPriceTotal }}</span>
                    </div> -->
                  </div>
                </div>
              </div>
              <div v-if="this.productDetail.package_cnt != 0" class="card-text border-top pt-3 pb-3"> 
                <div class="row pb-2"> 
                  <div :class="isMobile == true ? 'mobile-md' : ''"><label class="text-center text-info">{{$t("common.trip_participants")}}</label></div>
                  <div :class="isMobile == true ? 'mobile-md' : ''"><label class="text-center text-info">{{$t("common.supporti_document")}}</label></div>
                  <div class="text-start pb-1"><span class="span-font text-danger">{{ $t("common.discount_noti") }}</span></div>
                  <span class="span-font text-danger text-start">* {{ $t("common.child") }} : {{$t("common.child_noti")}}</span>
                  <span class="span-font text-danger text-start">* {{ $t("common.children") }} : {{$t("common.children_noti")}}</span>
                  <span class="span-font text-danger text-start">* {{ $t("common.teenager") }} : {{$t("common.teenager_noti")}}</span>
                  <div class="input-group input-group-sm pb-1 pt-2">
                    <span class="input-group-text span-font" id="inputGroup-sizing-sm">{{ $t("common.adult") }}</span>
                    <select class="form-select form-select-sm font-md" v-model="adult_cnt" @change="prodCntChange">
                      <option value="0">0</option>
                      <option :value="i" :key="i" v-for="i in 50">{{i}}</option>
                    </select>
                  </div>
                  <div class="input-group input-group-sm pb-1 pt-1">
                    <span class="input-group-text span-font">{{ $t("common.teenager") }}</span>
                    <select class="form-select form-select-sm font-md" v-model="teen_cnt" @change="prodCntChange">
                      <option value="0">0</option>                        
                      <option :value="i" :key="i" v-for="i in 50">{{i}}</option>                        
                    </select>
                  </div>
                  <div class="input-group input-group-sm pb-1 pt-1">
                    <span class="input-group-text span-font">{{ $t("common.children") }}</span>
                    <select class="form-select form-select-sm font-md" v-model="children_cnt" @change="prodCntChange">
                      <option value="0">0</option>
                      <option :value="i" :key="i" v-for="i in 50">{{i}}</option>
                    </select>
                  </div>
                  <div class="input-group input-group-sm pb-1 pt-1">
                    <span class="input-group-text span-font">{{ $t("common.child") }}</span>
                    <select class="form-select form-select-sm font-md" v-model="child_cnt" @change="prodCntChange">
                      <option value="0">0</option>
                      <option :value="i" :key="i" v-for="i in 50">{{i}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row pt-3 pb-2 border-top">
                <div class="row" v-if="optionPriceTotal > 0"> 
                  <div class="col-6">
                    <div :class="isMobile == true ? 'fw-bold text-info mobile-lg' : 'fw-bold text-info'">{{$t("common.opt_total_price")}}</div>
                  </div>
                  <div class="col-6">
                    <div :class="isMobile == true ? 'fw-bold text-info mobile-lg' : 'fw-bold text-info'">{{getCurrencyFormat(optionPriceTotal)}} {{productDetail.prod_price_tp}}</div>
                  </div>
                </div>
                <div class="col-6">
                  <div :class="isMobile == true ? 'fw-bold text-info mobile-lg' : 'fw-bold text-info'">{{$t("product.total_product_price")}}</div>
                </div>
                <div class="col-6">
                  <div :class="isMobile == true ? 'fw-bold text-info mobile-lg' : 'fw-bold text-info'">{{getCurrencyFormat(totalPrice + optionPriceTotal + hotel_price_total)}} {{productDetail.prod_price_tp}}</div>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="col d-grid">
                  <button type="button" @click="mycartInsert" :class="isMobile == 'true' ? 'btn btn-info col-auto btn-st-sm' : 'btn btn-info col-auto btn-st-md'">{{$t("product.mycart_put")}}</button>
                  <button type="button" @click="goPage" :class="isMobile == 'true' ? 'btn btn-dark col-auto btn-st-sm mt-2' : 'btn btn-dark col-auto btn-st-md mt-2'">{{$t("common.home")}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12 col-padding">
          <ul class="nav nav-pills" id="myTab" role="tablist">
            <li class="nav-item font-lg" role="presentation">
              <a class="nav-link  adopt-tab active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">{{$t("product.product_info")}}</a>
            </li>
            <li class="nav-item font-lg" role="presentation">
              <a class="nav-link  donate-tab"  id="comment-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">{{$t("product.comment")}}</a>
            </li>
            <!-- <li class="nav-item" role="presentation">
              <a class="nav-link join-tab" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</a>
            </li> -->
          </ul>
          <div class="tab-content mt-2 card" id="myTabContent" style="border-radius: 9px;">
            
            
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
              <img v-if="productDetail.file_name != undefined && productDetail.file_name != null" :src="`/download/${productDetail.file_path}/${productDetail.prod_id}/3/${productDetail.file_name}`" class="img-fluid pb-5" style="border-radius: 8px;width:100%;height:100%;"/>
              <div v-else v-html="productDetail.prod_content"></div>
            <!-- <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0"> -->
              <!-- <img :src="`/download/${productDetail.file_path}/${productDetail.prod_id}/3/${productDetail.file_name}`" class="img-fluid pb-5" style="border-radius: 8px;width:100%;height:100%;"/> -->
            </div>
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
              <div class="row">
                <div class="bg-dark text-white col-md-12 col-padding p-2" style="border-radius: 9px;">
                  <div class="d-flex flex-column comment-section" id="myGroup" v-for="(comments, i) in commentList" :key="i">
                    <div >
                      <div class="d-flex flex-row user-info ">
                        <!-- <img class="rounded-circle" :src=comments.user_img_path style="width=40px;height: 40px;"> -->
                        <img v-if="comments.user_img_path != ''" class="rounded-circle me-1" :src=comments.user_img_path style="width : 40px; height: 40px;">
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
                  <!-- <div class="detail-color p-2"> -->
                  <div class="bg-dark text-white p-2">
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
                          <span class="ml-1">{{$t("product.comment_share")}}</span>
                        </div>                 -->
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
                        <font-awesome-icon class="me-2" :icon="['fab', 'facebook']" style="width:40;height: 40;cursor: pointer;" @click="snsMessage('facebook')" />
                        <font-awesome-icon class="me-2" :icon="['fab', 'weixin']" style="width:40;height: 40;color: green;cursor: pointer;" @click="snsMessage('weixin')"/>
                        <font-awesome-icon :icon="['fab', 'qq']" style="width:40;height: 40;cursor: pointer;"/>
                        <i class="bi bi-facebook"></i>
                        <i class="fa fa-twitter border p-3 rounded mr-1"></i>
                        <i class="fa fa-instagram border p-3 rounded mr-1"></i>
                        <i class="fa fa-weibo  border p-3 rounded mr-1" style="color:red"></i>
                        <i class="fa fa-qq border p-3 rounded mr-1" style="color:blue"></i>
                        <i class="fa fa-linkedin border p-3 rounded mr-1"></i>
                        <i class="fa fa-dribbble border p-3 rounded mr-1"></i>
                        <i class="fa fa-pinterest-p border p-3 rounded mr-1"></i>
                      </div>
                    </div> -->
                </div>
              </div>
            </div>
              <!-- <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">..dfsdfsdfdsfsdf.</div> -->
          </div>
        </div>
      </div>
    </div>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import Multiselect from '@vueform/multiselect'
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import { isDEmpty } from '@/is';
import {swalTost, swal} from '@/alert'
// import ModalSpiner from '@/components/ModalSpiner.vue';
let timer = null
export default {
  components : {
    Multiselect,
    // ModalSpiner
},
  data() {
    return {
      productId: 0,
      productDetail: {},
      productImage: [],
      total: 1,
      totalPrice: 0,
      imgType : "",
      prodId : "",
      prodType : "",
      lanTp : "",
      iprice : 0,
      idx : 0,
      curUnit : "",
      options: [],
      selected:null , 
      optValue: [],
      tempValue:[],
      opt_code:"",
      totPrice:0,
      opt_name:"",
      memberList : [],
      img_path : "",
      content : "",
      gubun : "",
      resParam : {},
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
      showTp : false,
      optionArray : [],
      participant_cnt : 0,
      optionPriceTotal : 0,
      tempriceList : [],
      optCodeArray : [],
      tempOptList : [],
      adult_cnt : 0,
      teen_cnt : 0,
      children_cnt : 0,
      child_cnt : 0,
      adultTotalPrice : 0,
      teenTotalPrice : 0,
      childrenTotalPrice : 0,
      childTotalPrice : 0,
      prod_price : 0,
      origin_total_price : 0,
      origin_opt_total_price : 0,
      isMobile : false,
      pencilFlag : true,
      isLoading : true,
      prod_package_id : "",
      productPackageList : null,
      packageFlag : false,
      changeFlag : false,
      hotelList : [],
      hotel_s_list : {},
      hotel_d_list : {},
      hotel_d_personnel : 0,
      hotel_s_personnel : 0,
      check_s_flag : false,
      check_d_flag : false,
      d_personnels : [],
      hotel_price_total : 0,
      hotel_s_total : 0, 
      hotel_d_total : 0, 
      ht_price : 0,
      hotelFlag : false,
      optionMsg : "",
      tiketCheck : false,
      linkFlag : false,
    };
  },
  computed : {
    user() {
      return this.$store.state.user
    }
    
  },
  mounted() {
    this.isMobile = this.$isMobile()
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    clearTimeout(timer)
  },
  created() {
    // console.log("user : ", this.user);
    if(isDEmpty(this.$route.query.prod_id)) {
      this.resParam = JSON.parse(history.state.reqParam)
    } else {
      this.resParam.company_type = this.$route.query.company_type
      this.resParam.prod_id = this.$route.query.prod_id
      this.linkFlag = this.$route.query.linkFlag
      // this.resParam.changeFlag = this.$route.query.changeFlag
    }
    // this.resParam.prod_id = isDEmpty(this.$route.query.prod_id) ? this.resParam.prod_id : this.$route.query.prod_id
    console.log("this.resParam 111: ", this.resParam)
    console.log("sessionStorage.get('lan_tp'): ", sessionStorage.get('lan_tp'))
    
    // this.changeFlag = this.resParam.changeFlag
    timer = setTimeout(() => {
      if(this.linkFlag) {
        this.getLangChange()
        this.monitorHistory()
      } else {
        // this.lanTp = sessionStorage.get('lan_tp')
        this.lanTp = this.resParam.lan_tp
      }
      this.init()
    }, 1000);
    
  },
  methods: {
    init() {
      this.isLoading = true
      this.getProductDetail();
      this.getProductImage();
      this.getCommentList();
      
    },
    getLangChange() {
      let locale = navigator.language || navigator.userLanguage
      locale = locale.substring(0, 2);
      // if (locale == 'zh') {
      //   locale = 'zh' // 한국어가 아닌 경우 무조건 중국어로 설정
      // }
      if(locale == 'ko') {
        locale = 'zh'
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
    async monitorHistory() {
      console.log("monitorHistory");
      sessionStorage.set('company_type',this.resParam.company_type)

      let info = {
        os_type : this.$isMobile() ? 'mobile' : 'web',
        locale : navigator.language || navigator.userLanguage,
        company_type : this.resParam.company_type
      }
      console.log(info)
      await this.$api('/monitorHistory', {info})
    },
    setClass() {
      this.gubun = ""
      this.content = ""
    },
    paramInput(comments,gubun){
      // console.log(comments);
      // if(gubun != 'like'){
        // }
      this.gubun = gubun
      this.content = comments.comment_content
      this.comment_id = comments.comment_id
    },
    calculatePrice(cnt) {
      let total = this.total + cnt;
      if(total < 1) total = 1;
      this.total = total;
      // this.totalPrice = this.iprice * this.total;
      this.totalPrice = (this.totPrice + this.iprice) * this.total;
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    // async getHotelList() {
    //   this.hotel_id = hotel_id
    //   let hotelList = await this.$api('/api/hotelDtlList', {});
    //   let tempArray = null
    //   let data = null
    //   let prod_unit = ""
    //   let prod_unit_type = ""
    //   tempArray = []
    //   data = {}
    //   if(this.lanTp == 'CHN') {
    //     prod_unit = 'CNH'
    //     prod_unit_type = '¥'
    //   } else if(this.lanTp == 'KOR') {
    //     prod_unit = 'KRW'
    //     prod_unit_type = '₩'
    //   } else {
    //     prod_unit = 'USD'
    //     prod_unit_type = '$'
    //   }
    //   hotelList.forEach(item => {
    //       if(this.lanTp == 'CHN') {
    //         data = {
    //           value : item.value,
    //           label : item.opt_cn_nm.concat(' ').concat('¥').concat(item.opt_price),
    //           opt_code : item.opt_code,
    //           opt_nm : item.opt_cn_nm,
    //           opt_price : item.origin_price,
    //         }
    //       } else if(this.lanTp == 'KOR') {
    //         data = {
    //           value : item.value,
    //           label : item.opt_nm.concat(' ').concat('₩').concat(item.opt_price),
    //           opt_code : item.opt_code,
    //           opt_nm : item.opt_nm,
    //           opt_price : item.origin_price,
              
    //         }
    //       } else {
    //         data = {
    //           value : item.value,
    //           label : item.opt_en_nm.concat(' ').concat('$').concat(item.opt_price),
    //           opt_code : item.opt_code,
    //           opt_nm : item.opt_en_nm,
    //           opt_price : item.origin_price,
    //         }
    //       }
    //       tempArray.push(data)
          
    //     })
    //     this.options = tempArray
    // },
    addTag(value,label){
      let param1 = [];
      let param2 = {};
      let temprice = [];
      let labelStr = "";
      let tempCode = [];
      param1 = value;
      let code = []
      for(let i=0;i<param1.length;i++){
        param2 = param1[i].split(";");
        
        if(i == param1.length-1) {
          tempCode += param2[0]
        } else {
          tempCode += param2[0].concat(",");
        }
        temprice.push(param2[1]);
      }
      console.log("label.ariaLabel : ", label.ariaLabel)
      
      this.opt_code = tempCode;
      // this.optionArray = this.opt_code.split(',')
      console.log("code : ", code)
      labelStr += label.ariaLabel;
      console.log("labelStr : ", labelStr)
      // labelStr = labelStr.substring(0,labelStr.length-1)
      this.opt_name = labelStr
      let optNameArr = isDEmpty(this.opt_name) ? [] : this.opt_name.split(',')
      let optCodeArr = isDEmpty(this.opt_code) ? [] : this.opt_code.split(',')
      this.tempriceList = temprice
      console.log("this.opt_code : ", this.opt_code)
      console.log("this.opt_name : ", this.opt_name)
      // this.optionArray = code
      console.log(this.optionArray)
      let optArrList = []
      if(optCodeArr.length > 0) {
        for(let i =0 ; i < optCodeArr.length; i++){
          let data = {
            opt_code : optCodeArr[i],
            opt_name : optNameArr[i],
            opt_price : temprice[i],
            idx : i
          }
          optArrList.push(data)
        }
      }
      console.log("optArrList :", optArrList)
      this.optionArray = optArrList
      this.optionArray.forEach(c => {
        if(isDEmpty(c.participant_cnt)) {
          c = Object.assign(c, {participant_cnt : 0})
        }
        if(this.tempOptList.length > 0) {
          this.tempOptList.forEach(d => {
            if(c.opt_code == d.opt_code) {
              c.participant_cnt = d.participant_cnt
            }
          })
        }
      })
      console.log("this.optionArray :", this.optionArray)
      console.log("this.optionArray.length :", this.optionArray.length)
      if(this.optionArray.length < 1) {
        this.optionPriceTotal = 0
        this.tempOptList = []
      } else {
        if(this.tempOptList.length > this.optionArray.length) {
          this.optDelChange()
        } 
      }
    },
    packageChange(event) {
      this.resParam.prod_id = event.target.value
      this.changeFlag = true
      this.init()
    },
    async getProductDetail() {
      console.log(this.resParam);
      let prod_unit = ""
      let prod_unit_type = ""
      if(this.lanTp == 'CHN') {
        prod_unit = 'CNH'
        prod_unit_type = '¥'
      } else if(this.lanTp == 'KOR') {
        prod_unit = 'KRW'
        prod_unit_type = '₩'
      } else {
        prod_unit = 'USD'
        prod_unit_type = '$'
      }
      console.log(prod_unit_type)
      let productDetail = null
      let prodPackageList = null
      this.productPackageList = null
      
      productDetail = await this.$api("/api/productDetail",{param:[prod_unit,prod_unit,this.lanTp, this.resParam.prod_id]});
      if(!isDEmpty(productDetail)) {
        this.productDetail = productDetail[0]
      }
      if(this.productDetail.prod_type == '01' && this.productDetail.prod_category == 'CG001') {
        this.checkDate()
      }
      prodPackageList = await this.$api("/api/productPackageList", {param:[prod_unit,this.lanTp, this.productDetail.prod_type,this.productDetail.prod_category]});
      let hotelList = await this.$api('/api/hotelDtlList', {param:[prod_unit, this.productDetail.prod_type, this.productDetail.prod_category]});
      this.hotelFlag = isDEmpty(hotelList) ? false : true
      // let data = null
      if(!isDEmpty(hotelList)) {
        let data = {}
        let hotelLists = hotelList.filter(c=> c.hotel_type == "S")
        let hotelListd = hotelList.filter(c=> c.hotel_type == "D")
        let hotelsArray = []
        let hoteldArray = []
        hotelLists.forEach(item => {
          if(this.lanTp == 'KOR') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          } else if(this.lanTp == 'CHN') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_cn_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }

          } else if(this.lanTp == 'JPN') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_jp_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          } else if(this.lanTp == 'VTN') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_vn_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          } else {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_en_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          }
          hotelsArray.push(data)
        })
        this.hotel_s_list = hotelsArray[0]

        hotelListd.forEach(item => {
          if(this.lanTp == 'KOR') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          } else if(this.lanTp == 'CHN') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_cn_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
              
            }

          } else if(this.lanTp == 'JPN') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_jp_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          } else if(this.lanTp == 'VTN') {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_vn_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          } else {
            data = {
              hotel_type : item.hotel_type,
              hotel_type_nm : item.hotel_en_type_nm,
              hotel_price : item.hotel_price,
              hotel_dtl_id : item.hotel_dtl_id,
              origin_hotel_price : item.origin_hotel_price
            }
          }
          hoteldArray.push(data)
        })
        this.hotel_d_list = hoteldArray[0]
      }
      this.d_personnels = [2,4,6,8,10,12,14,16,18,20]

      if(!isDEmpty(prodPackageList)) {
        this.packageFlag = true
        this.productPackageList = []
        prodPackageList.forEach(item => {
          this.productPackageList.push({
            prod_id : item.prod_id,
            prod_name : item.package_type.concat(' ').concat(this.getCurrencyFormat(item.prod_price)).concat(' ').concat(item.prod_price_tp)
          })
        })
        this.prod_package_id = this.resParam.prod_id
      }
      // deal_bas_r
      
      let optCodeArr = ""
      let options = []
      if(!isDEmpty(this.productDetail.opt_code)) {
        optCodeArr = this.productDetail.opt_code.split(',');
        options = await this.$api("/api/optionList2", {param:[prod_unit, optCodeArr]});
        let optionMsgs = await await this.$api("/api/optionMsg", {param:[optCodeArr, this.productDetail.prod_type, this.productDetail.prod_category]});
        console.log("optionMsgs :",optionMsgs)
        if(!isDEmpty(optionMsgs)) {
          if(this.lanTp == 'CHN') {
            this.optionMsg = optionMsgs[0].opt_cn_msg
          } else if(this.lanTp == 'JPN') {
            this.optionMsg = optionMsgs[0].opt_jp_msg
          } else if(this.lanTp == 'VTN') {
            this.optionMsg = optionMsgs[0].opt_vn_msg
          } else if(this.lanTp == 'KOR') {
            this.optionMsg = optionMsgs[0].opt_msg
          } else {
            this.optionMsg = optionMsgs[0].opt_en_msg
          }
          console.log("options : ", options)
        }
        let data = {}
        let tempArray = []
        options.forEach(item => {
          if(this.lanTp == 'CHN') {
            data = {
              value : item.value,
              label : item.opt_cn_nm.concat(' ').concat('¥').concat(item.opt_price),
              opt_code : item.opt_code,
              opt_nm : item.opt_cn_nm,
              opt_price : item.origin_price,
            }
          } else if(this.lanTp == 'KOR') {
            data = {
              value : item.value,
              label : item.opt_nm.concat(' ').concat('₩').concat(item.opt_price),
              opt_code : item.opt_code,
              opt_nm : item.opt_nm,
              opt_price : item.origin_price,
              
            }
          } else {
            data = {
              value : item.value,
              label : item.opt_en_nm.concat(' ').concat('$').concat(item.opt_price),
              opt_code : item.opt_code,
              opt_nm : item.opt_en_nm,
              opt_price : item.origin_price,
            }
          }
          tempArray.push(data)
          
        })
        this.options = tempArray
      }
      console.log(this.productDetail)
      this.iprice = this.productDetail.origin_price;
      this.prod_price = this.productDetail.prod_price
      this.totalPrice = this.productDetail.prod_price;
      this.curUnit = this.productDetail.prod_price_tp;
      
    },
    checkDate() {
      let toDay = this.$dateFormat('today')
      if(Number(toDay) > 20240808) {
        this.tiketCheck = true
        this.groundTiketCnt = 26
      }
    },
    changeCheck(event) {
      let checkeds = event.target.checked
      if(checkeds) {
        this.check_s_flag = true
        this.hotel_s_price = this.hotel_s_list.origin_hotel_price
      } else {
        this.check_s_flag = false
        this.hotel_s_price = 0
      }
    },
    changeCheck1(event) {
      let checked1 = event.target.checked
      if(checked1) {
        this.check_d_flag = true
        this.hotel_d_price = this.hotel_d_list.origin_hotel_price
      } else {
        this.check_d_flag = false
        this.hotel_d_price = 0
      }
    },
    personnelChange(event,type) {
      if(type == 'S') {
        this.hotel_s_personnel = event.target.value
        this.hotel_s_total = parseInt(this.hotel_s_price * this.hotel_s_personnel)
      } else {
        this.hotel_d_personnel = event.target.value
        this.hotel_d_total = parseInt(this.hotel_d_price * this.hotel_d_personnel)
      }
       let origin_hotel_price = this.hotel_s_total + this.hotel_d_total
       this.orgin_hotel_price = origin_hotel_price
      this.hotel_price_total = Math.round(origin_hotel_price / this.productDetail.deal_bas_r)
    },
    async getProductImage() {
      const productImage = await this.$api("/api/imageList",{param:[this.resParam.prod_id]});
      productImage.forEach(c => {
        if(c.file_type =='2') {
          this.productImage.push({...c})
        }
      })
      // this.productImage
      console.log("this.productImage : ", this.productImage.length)
    },
    optionChange(event, obj) {
      console.log("obj : ", obj)
      let participant_cnt = event.target.value
      let optionPriceTotal = 0
      let total = 0
      // let data = {}
      this.optionPriceTotal = 0
      if(this.optionArray.length > 0) {
        this.optionArray.forEach(item => {
          if(item.opt_code == obj.opt_code) {
            item.participant_cnt = participant_cnt
          }
          optionPriceTotal = parseInt(item.opt_price) * parseInt(item.participant_cnt)
          console.log("optionPriceTotal : ",optionPriceTotal)
          total += parseInt(optionPriceTotal) 
        }) 
        this.origin_opt_total_price = total
        this.optionPriceTotal = Math.round(total / this.productDetail.deal_bas_r)
        this.tempOptList = this.optionArray
      } else {
        this.optionPriceTotal = 0
      }
    },
    optDelChange() {
      let total = 0
      this.optionArray.forEach(item => {
        let optionPriceTotal = parseInt(item.opt_price) * parseInt(item.participant_cnt)
        console.log("optionPriceTotal : ",optionPriceTotal)
        total += parseInt(optionPriceTotal) 
      })
      this.origin_opt_total_price = total
      this.optionPriceTotal = Math.round(total / this.productDetail.deal_bas_r)
    },
    prodCntChange() {
      this.totalPrice = 0
      if(!(this.productDetail.prod_category == '01' && this.productDetail.prod_type == 'CG001')) {
        this.adultTotalPrice = this.iprice * this.adult_cnt
        // let teenPriceTotal = this.iprice *  this.teen_cnt
        // let teenDiscount = Math.round((this.iprice *  this.teen_cnt) * (3 / 100))
        // this.teenTotalPrice = teenPriceTotal - teenDiscount
        this.teenTotalPrice = this.iprice *  this.teen_cnt
        let childrenPriceTotal = this.iprice *  this.children_cnt
        let childrenDiscount = this.iprice * this.children_cnt
        this.childrenTotalPrice =  childrenPriceTotal - childrenDiscount
        this.childTotalPrice = 0
        
        console.log("adultTotalPrice  : ", this.adultTotalPrice, this.teenTotalPrice, this.childrenTotalPrice, this.childTotalPrice)
        let totalPrice = this.adultTotalPrice + this.teenTotalPrice + this.childrenTotalPrice + this.childTotalPrice
        console.log("totalPrice : ", totalPrice)
        if(this.adult_cnt == 0 && this.teen_cnt == 0) {
          this.totalPrice = this.productDetail.prod_price
        } else {
          this.origin_total_price = totalPrice
          this.totalPrice = Math.round(totalPrice / this.productDetail.deal_bas_r)
        }
      } else {
        this.totalPrice = Math.round(this.iprice / this.productDetail.deal_bas_r)
        this.origin_total_price = this.iprice
      }
    },
    optAddChange() {
      this.optionArray.forEach(item => {
        if(isDEmpty(item.participant_cnt)) { 
          item = Object.assign(item, {participant_cnt : 0})  
        } 
      })
    },
    // seatChange(event,type) {
    //   let seatPrice = 0
    //   let origin_price = this.productDetail.origin_price
    //   seatPrice = event.target.value
    //   let tempPrice = 0
    //   if(type == 'ground') {
    //     tempPrice = parseInt(origin_price - seatPrice)
    //   } else {
    //     tempPrice = parseInt(seatPrice)
    //   }
    //   this.totalPrice = Math.round(tempPrice / this.productDetail.deal_bas_r)
    //   this.product
    // },
    validationChk() {
      if((this.productDetail.progress_yn != 'Y') && (this.productDetail.progress_yn != 'D')) {
        let msg = ""
        if(this.productDetail.progress_yn == 'W') {
          msg = this.$t("common.common_reg_no_product")
        } else if(this.productDetail.progress_yn == 'E') {
          msg = this.$t("common.common_deadline_product")
        }
        swal.fire({
          title: msg,
          icon : 'warning',
          timer: 1500, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      }
      if(isDEmpty(this.user.mem_id)) {
        swal.fire({
          title: this.$t("common.common_login_fail"),
          icon : 'warning',
          timer: 1500, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      }
      if(this.adult_cnt == 0 && this.teen_cnt == 0) {
        swal.fire({
          title: this.$t("common.prod_cnt_fail"),
          icon : 'warning',
          timer: 1500, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      }
      if(this.productDetail.prod_category == '01' && this.productDetail.prod_type == 'CG001') {
        let total_cnt = parseInt(this.adult_cnt)  + parseInt(this.teen_cnt) + parseInt(this.children_cnt)
        if(total_cnt  != parseInt(this.productDetail.package_cnt)) {
          swal.fire({
            title: this.$t("common.common_package_cnt_fail"),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          return false
        }
      }
      if(this.productDetail.inventory_cnt < 1) {
        swal.fire({
          title: this.$t("common.common_no_inventory_cnt"),
          icon : 'warning',
          timer: 1500, 
          confirmButtonText: this.$t("common.common_close"),
        })
        return false
      }
      
      if(this.hotelFlag) {
        let totalCnt = parseInt(this.adult_cnt) + parseInt(this.teen_cnt) + parseInt(this.children_cnt)
        let total_personnel = parseInt(this.hotel_s_personnel) + parseInt(this.hotel_d_personnel)
        if(total_personnel != totalCnt) {
          swal.fire({
            title: this.$t("common.common_personnel_noti"),
            icon : 'warning',
            timer: 1500, 
            confirmButtonText: this.$t("common.common_close"),
          })
          return false
        }
      }
      return true
    },
    async mycartInsert(){
      if(this.validationChk()) {
        let mycartChk = await this.$api("/api/mycartChk",{param:[this.resParam.prod_id, this.user.mem_id]});// this.user.mem_id
        if(mycartChk[0].cartChk > 0) {
          return swal.fire({
                    title: this.$t("common.mycart_dupulicate"),
                    icon : 'warning',
                    timer: 1500, 
                    confirmButtonText: this.$t("common.common_close"),
                  })
        } else {
          const commSeq = await this.$api("/api/commSequences", {param : ['CART','cart_id','6']});
          const {error} = await this.$api("/api/mycartInsert", 
                            {param:[{
                              cart_id : commSeq[0].commSeq,
                              prod_id : this.resParam.prod_id,
                              mem_id : this.user.mem_id,
                              product_price : this.iprice, // 상품 가격
                              cost_price : this.origin_total_price, // 상품참여인원 선택 가격
                              hotel_price : this.orgin_hotel_price, // 호텔참여인원 선택 가격
                              txn_type : 'N', // 고객진행상태
                              adult_cnt : this.adult_cnt,
                              teen_cnt : this.teen_cnt,
                              children_cnt : this.children_cnt,
                              child_cnt : this.child_cnt,
                              option_price : this.origin_opt_total_price,// 옵션 선택 가격
                              pay_yn : 'N',
                              reg_date : this.$dateFormat('filedate')
                            }
                            ]});
          if(this.optionArray.length > 0) {
            for(let i = 0; i < this.optionArray.length ; i++) {
              if(this.optionArray[i].participant_cnt != 0) {
                const optSeq = await this.$api("/api/commSequences", {param : ['OPTD','opt_id','8']});
                
                let data = {
                  opt_id : optSeq[0].commSeq,
                  cart_id : commSeq[0].commSeq,
                  mem_id : this.user.mem_id,
                  opt_code : this.optionArray[i].opt_code,
                  opt_name : this.optionArray[i].opt_name,
                  opt_price : this.optionArray[i].opt_price,
                  participant_cnt : this.optionArray[i].participant_cnt,
                  reg_date : this.$dateFormat('filedate')
                }
                await this.$api("/api/optionDtlInsert", {param : [data , data]})
              }
            }
          }
          if(this.hotel_s_total > 0) {
            const hotelSeq = await this.$api("/api/commSequences", {param : ['HOTCRAT','hotel_cart_id','7']});
            let data = {
              hotel_cart_id : hotelSeq[0].commSeq,
              cart_id : commSeq[0].commSeq,
              mem_id : this.user.mem_id,
              hotel_dtl_id : this.hotel_s_list.hotel_dtl_id,
              hotel_type_nm : this.hotel_s_list.hotel_type_nm,
              hotel_type : this.hotel_s_list.hotel_type,
              hotel_price :  this.hotel_s_list.origin_hotel_price,
              personnel_cnt : this.hotel_s_personnel,
              reg_date : this.$dateFormat('filedate')
            }
            await this.$api("/api/hotelCartInsert", {param : [data , data]})
          }
          if(this.hotel_d_total > 0) {
            const hotelSeq = await this.$api("/api/commSequences", {param : ['HOTCRAT','hotel_cart_id','7']});
            let data = {
              hotel_cart_id : hotelSeq[0].commSeq,
              cart_id : commSeq[0].commSeq,
              mem_id : this.user.mem_id,
              hotel_dtl_id : this.hotel_d_list.hotel_dtl_id,
              hotel_type_nm : this.hotel_d_list.hotel_type_nm,
              hotel_price :  this.hotel_d_list.origin_hotel_price,
              hotel_type : this.hotel_d_list.hotel_type,
              personnel_cnt : this.hotel_d_personnel,
              reg_date : this.$dateFormat('filedate')
            }
            await this.$api("/api/hotelCartInsert", {param : [data , data]})
          }
          if (error) {
            // console.error(error);
            return swal.fire({
                    title: this.$t("common.mycart_insert_failmycart_dupulicate"),
                    icon : 'warning',
                    timer: 1500, 
                    confirmButtonText: this.$t("common.common_close"),
                  })
          }
          let reqParam = {
            lan_tp : this.lanTp
          }
          this.$router.push({path: "/mycart", state : {reqParam : JSON.stringify(reqParam)}});
        }
      }
    },
    goPage() {
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.lanTp}`
      // this.$router.push({path : '/', query : {lan_tp : this.lanTp} })
    },
    async getCommentList() {
      // console.log("commentList");
      this.pencilFlag = false
      this.gubun = ""
      this.content = ""
      this.commentList = await this.$api('/api/commentList',{param:[this.resParam.prod_id, 'trip']});
      let like_sum_cnt = await this.$api('/api/commentLikeCnt',{param:[this.resParam.prod_id, 'trip']});
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
                            prod_id: this.resParam.prod_id,
                            user_email: this.user.mem_email,
                            user_img_path: this.user.mem_profile_path,
                            user_nick: this.user.mem_nick,
                            comment_type : 'trip'
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
      this.gubun = ""
      this.content = ""
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
    async snsMessage(type) {
      console.log("type :", type )
      let data = {}
      if(type == 'facebook') {
        data = {
          mem_sns_id : this.user.mem_sns_id,
          mem_token : this.user.mem_token
        }
      }
      this.$api('/snsFacebook', {data})
    },
  }
}
</script>
<style src="../../../../node_modules/@vueform/multiselect/themes/default.css"></style>
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

