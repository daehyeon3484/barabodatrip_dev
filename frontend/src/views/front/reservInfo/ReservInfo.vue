<template>
  <main class="mt-1">
    <div class="container">
      <h5 v-if="!isMobile" class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("mycart.customer_info")}}</h5>
      <h6 v-else class="text-center bg-info bg-gradient text-light" style="margin: 0;">{{$t("mycart.customer_info")}}</h6>
      <!-- <loading-spinner v-if="isLoading"></loading-spinner> -->
      <table class="table table-bordered mt-1">
        <tbody>
          <tr class="table-dark text-white">
            <td align="center" valign="top" width="50%">
              <div> 
                <img :src="`/download/${products.file_path}/${products.prod_id}/1/${products.file_name}`" style="max-width:250px; min-width: 150px; height:150px " alt="" >
              </div> 
              <tr>
                <td class="text-start pt-2" width="50%"> 
                  <div class="text-start"><span class="text-white text-break span-font">{{products.prod_title}}</span></div>
                  <div class="text-start pt-1"><span class="text-white text-break span-font">{{ products.ymd_format }}</span></div>
                  <div class="text-start pt-1"><span class="text-info text-break span-font">{{ $t("common.prod_price") }}</span></div>
                  <div class="text-start pt-1"><span class="text-info text-break span-font">{{ getCurrencyFormat(products.prod_price) }} {{ products.prod_price_tp}}</span></div>
                </td>
              </tr>
            </td>
            <td width="50%"> 
              <div v-if="this.optionList.length > 0"> 
                <div class="text-start pt-1"><span class="text-info span-font-lg">[{{$t("product.paid_option")}}]</span></div>
                <div class="text-white text-start pt-1" :key="i" v-for="(opt,i) in this.optionList">
                  <span class="span-font"> {{opt.opt_name}} [{{ opt.participant_cnt }}]</span>
                </div>
                <div class="pt-1">
                  <button type="button" class="btn btn-sm btn-primary btn-st-sm" 
                    data-bs-toggle="modal" data-bs-target="#staticBackdrop" 
                    @click="modifyInfo('option', products)">{{ this.optionList.length > 0 ? $t('product.modify') : $t('common.paid_option_add')}}</button>
                </div>
              </div>
              <div>
                <!-- <div v-if="products.hotel_price != null"> 
                  <div class="text-start pt-1"><span class="text-info span-font">[{{ $t("common.common_participation") }}]</span></div>
                  <div :key="k" v-for="(hotels, k) in hotelCartList.filter(c=> c.cart_id == products.cart_id)"> 
                    <div class="text-start pt-1" >
                      <span class="span-font">{{ hotels.hotel_type_nm }} : {{ hotels.personnel_cnt }}</span>
                    </div>
                  </div>
                </div> -->
                <div class="text-start pt-1"><span class="text-info span-font-lg">[{{ $t("common.participation") }}]</span></div>
                <div v-if="products.adult_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.adult") }} : {{ products.adult_cnt }}</span></div>
                <div v-if="products.teen_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.teenager") }} : {{ products.teen_cnt }}</span></div>
                <div v-if="products.children_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.children") }} : {{ products.children_cnt }}</span></div>
                <div v-if="products.child_cnt > 0" class="text-start pt-1"><span class="span-font">{{ $t("common.child") }} : {{ products.child_cnt }}</span></div>
                <div v-if="products.package_cnt == 0" class="pt-1">
                  <button type="button" class="btn btn-sm btn-primary btn-st-sm" 
                    data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                    @click="modifyInfo('participant', products)">{{ $t('product.modify') }}</button>
                </div>
                <div v-if="products.option_price > 0" class="pt-2"> 
                  <div v-if="this.optionList.length > 0" class="text-start">
                    <div><span class="text-info span-font">{{$t("common.opt_total_price")}}</span></div>
                    <div class="pt-2"><span class="text-info span-font">{{getCurrencyFormat(products.option_price)}} {{products.prod_price_tp}}</span></div>
                  </div>
                </div>
                <div class="text-start pt-2">
                  <div><span class="fw-bold text-info span-font">[{{$t("product.total_product_price")}}]</span></div>
                  <!-- <div class="pt-2"><span class="fw-bold text-info span-font">{{getCurrencyFormat(products.cost_price + products.option_price + products.hotel_price)}} {{ products.prod_price_tp}}</span></div> -->
                  <div class="pt-2"><span class="fw-bold text-info span-font">{{getCurrencyFormat(products.cost_price + products.option_price)}} {{ products.prod_price_tp}}</span></div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="products.length < 1">
            <td colspan="3" class="text-center">{{ $t("common.mycart_product_no_date") }}</td>
          </tr> 
        </tbody>
      </table>
      
      <!-- 성인 -->
      <div v-if="this.adult_cnt > 0"> 
        <div class="text-info" :key="adult_idx" v-for="(k, adult_idx) in this.adult_cnt">
          <div class="mb-2 row">
            <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><span class="badge text-bg-danger">{{$t("common.adult")}}</span> <strong class="text-danger">*</strong> {{$t("order.name")}} [{{adult_idx+1}}] </label>
            <div class="col-md-8">
              <input type="text" class="form-control mobile-md" :ref="`adult_nm`" v-model.trim="userInfo.adult_nm_arr[adult_idx]" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_mem_nm_input")}}</span></div>
            </div>
          </div>
          <div v-if="adult_idx == 0"> 
            <div class="mb-3 row">
              <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.tel")}} [{{adult_idx+1}}]</label>
              <div class="col-md-8">
                <input type="text" class="form-control mobile-md" ref="adult_tel" v-model.trim="userInfo.adult_tel_arr" :placeholder="$t(`common.order_tel_input`)" :aria-label="$t(`common.order_tel_input`)">
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_tel_input")}}</span></div>
              </div>
            </div>
            <div class="mb-3 row">
              <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.email")}} [{{adult_idx+1}}]</label>
              <div class="col-md-8">
                <input type="text" class="form-control mobile-md" ref="adult_email" v-model.trim="userInfo.adult_email_arr" :placeholder="$t(`common.common_email_input`)" :aria-label="$t(`common.common_email_input`)">
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_email_input")}}</span></div>
              </div>
            </div>
            <div v-if="this.adultAirFlag == true && this.teenAirFlag == false" class="mb-3 row">
              <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.air_img")}} [{{ adult_idx+1 }}]</label>
              <div class="col-md-8">
                <div class="row">
                  <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${adult_idx+1}` && c.file_type == '4' && c.mem_type =='adult')">
                    <div class="position-relative admin-div text-start pb-1">
                      <div :id="`adultAirDiv${adult_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                    </div>
                  </div>
                </div>
                <input type="file" class="form-control mobile-md" ref="adultAirFile" accept="image/*" @change="uploadFile($event.target.files, 4,`${adult_idx+1}`, 'adult')" multiple>
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">* {{$t("common.common_air_noti")}}</span></div>
              </div>
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.passport_img")}} [{{ adult_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${adult_idx+1}` && c.file_type == '1' && c.mem_type =='adult')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`adultPassDiv${adult_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="adultPassFile" accept="image/*" @change="uploadFile($event.target.files, 1,`${adult_idx+1}`, 'adult')">
            </div>
          </div>
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md">* {{$t("order.visa_img")}} [{{ adult_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${adult_idx+1}` && c.file_type == '2' && c.mem_type =='adult')">
                  <div class="position-relative admin-div text-start pb-1">
                    <div :id="`adultVisaDiv${adult_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="adultVisaFile" accept="image/*" @change="uploadFile($event.target.files, 2,`${adult_idx+1}`, 'adult')">
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.birth_img")}} [{{ adult_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${adult_idx+1}` && c.file_type == '3' && c.mem_type =='adult')">
                  <div class="position-relative admin-div text-start pb-1">
                    <div :id="`adultBirthDiv${adult_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="adultBirthFile" accept="image/*" @change="uploadFile($event.target.files, 3,`${adult_idx+1}`, 'adult')">
            </div>
          </div> -->
          
          <hr>
        </div>
      </div>
      <!-- 청소년 -->
      <div v-if="this.teen_cnt > 0"> 
        <div class="text-info" :key="teen_idx" v-for="(k, teen_idx) in this.teen_cnt">
          <div class="mb-3 row">
            <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><span class="badge text-white text-bg-primary ">{{$t("common.teenager")}}</span> <strong class="text-danger">*</strong> {{$t("order.name")}} [{{teen_idx+1}}]</label>
            <div class="col-md-8">
              <input type="text" class="form-control mobile-md" :ref="`teen_nm`" v-model.trim="userInfo.teen_nm_arr[teen_idx]" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_mem_nm_input")}}</span></div>
            </div>
          </div>
          <div v-if="this.adult_cnt < 1"> 
            <div class="mb-3 row">
              <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.tel")}} [{{teen_idx+1}}]</label>
              <div class="col-md-8">
                <input type="text" class="form-control mobile-md" ref="teen_tel" v-model.trim="userInfo.teen_tel_arr" :placeholder="$t(`common.order_tel_input`)" :aria-label="$t(`common.order_tel_input`)">
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_tel_input")}}</span></div>
              </div>
            </div>
            <div class="mb-3 row">
              <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.email")}} [{{teen_idx+1}}]</label>
              <div class="col-md-8">
                <input type="text" class="form-control mobile-md" ref="teen_email" v-model.trim="userInfo.teen_email_arr" :placeholder="$t(`common.common_email_input`)" :aria-label="$t(`common.common_email_input`)">
                <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_email_input")}}</span></div>
              </div>
            </div>
            <!-- <div v-if="this.adultAirFlag == false" class="mb-3 row">
              <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.air_img")}} [{{ teen_idx+1 }}]</label>
              <div class="col-md-8">
                <div class="row">
                  <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${teen_idx+1}` && c.file_type == '4' && c.mem_type =='teen')">
                    <div class="position-relative   admin-div text-start pb-1">
                      <div :id="`teenAirDiv${teen_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                    </div>
                  </div>
                </div>
                <input type="file" class="form-control mobile-md" ref="teenAirFile" accept="image/*" @change="uploadFile($event.target.files, 4,`${teen_idx+1}`, 'teen')" multiple>
              </div>
            </div> -->
          </div>
          <div v-if="(this.adultAirFlag == false && this.teenAirFlag == true) && (teen_idx == 0)" class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.air_img")}} [{{ teen_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${teen_idx+1}` && c.file_type == '4' && c.mem_type =='teen')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`teenAirDiv${teen_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="teenAirFile" accept="image/*" @change="uploadFile($event.target.files, 4,`${teen_idx+1}`, 'teen')" multiple>
              <div class="mt-2 text-start"><span class="span-font-sm text-danger">* {{$t("common.common_air_noti")}}</span></div>
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.passport_img")}} [{{ teen_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${teen_idx+1}` && c.file_type == '1' && c.mem_type =='teen')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`teenPassDiv${teen_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="teenPassFile" accept="image/*" @change="uploadFile($event.target.files, 1,`${teen_idx+1}`, 'teen')">
            </div>
          </div>
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.visa_img")}} [{{ teen_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${teen_idx+1}` && c.file_type == '2' && c.mem_type =='teen')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`teenVisaDiv${teen_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="teenVisaFile" accept="image/*" @change="uploadFile($event.target.files, 2,`${teen_idx+1}`, 'teen')">
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.birth_img")}} [{{ teen_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${teen_idx+1}` && c.file_type == '3' && c.mem_type =='teen')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`teenBirthDiv${teen_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="teenBirthFile" accept="image/*" @change="uploadFile($event.target.files, 3,`${teen_idx+1}`, 'teen')">
            </div>
          </div> -->
          
          <hr>
        </div>
      </div>
      <!-- 어린이 -->
      <div v-if="this.children_cnt > 0"> 
        <div class="text-info" :key="children_idx" v-for="(k, children_idx) in this.children_cnt">
          <div class="mb-3 row">
            <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><span class="badge text-white text-bg-success">{{$t("common.children")}}</span> <strong class="text-danger">*</strong> {{$t("order.name")}} [{{children_idx+1}}]</label>
            <div class="col-md-8">
              <input type="text" class="form-control mobile-md" ref="children_nm" v-model.trim="userInfo.children_nm_arr[children_idx]" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_mem_nm_input")}}</span></div>
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.passport_img")}} [{{ children_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${children_idx+1}` && c.file_type == '1' && c.mem_type =='children')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childrenPassDiv${children_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childrenPassFile" accept="image/*" @change="uploadFile($event.target.files, 1,`${children_idx+1}`, 'children')">
            </div>
          </div>
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.visa_img")}} [{{ children_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${children_idx+1}` && c.file_type == '2' && c.mem_type =='children')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childrenVisaDiv${children_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childrenVisaFile" accept="image/*" @change="uploadFile($event.target.files, 2,`${children_idx+1}`, 'children')">
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.birth_img")}} [{{ children_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${children_idx+1}` && c.file_type == '3' && c.mem_type =='children')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childrenBirthDiv${children_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childrenBirthFile" accept="image/*" @change="uploadFile($event.target.files, 3,`${children_idx+1}`, 'children')">
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.air_img")}} [{{ children_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${children_idx+1}` && c.file_type == '4' && c.mem_type =='children')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childrenAirDiv${children_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childrenAirFile" accept="image/*" @change="uploadFile($event.target.files, 4,`${children_idx+1}`, 'children')">
            </div>
          </div> -->
          <hr>
        </div>
      </div>
      <!-- 영유아 -->
      <div v-if="this.child_cnt > 0"> 
        <div class="text-info" :key="child_idx" v-for="(k, child_idx) in this.child_cnt">
          <div class="mb-3 row">
            <label  class="col-md-4 col-form-label  fw-bold text-start font-md"><span class="badge text-white text-bg-info">{{$t("common.child")}}</span> <strong class="text-danger">*</strong> {{$t("order.name")}} [{{child_idx+1}}]</label>
            <div class="col-md-8">
              <input type="text" class="form-control mobile-md" ref="child_nm" v-model.trim="userInfo.child_nm_arr[child_idx]" :placeholder="$t(`common.order_name_input`)" :aria-label="$t(`common.order_name_input`)">
              <div class="mt-2 text-start"><span class="span-font-sm text-danger">{{$t("common.passport_mem_nm_input")}}</span></div>
            </div>
          </div>
          <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.passport_img")}} [{{ child_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${child_idx+1}` && c.file_type == '1' && c.mem_type =='child')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childPassDiv${child_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childPassFile" accept="image/*" @change="uploadFile($event.target.files, 1,`${child_idx+1}`, 'child')">
            </div>
          </div>
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.visa_img")}} [{{ child_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${child_idx+1}` && c.file_type == '2' && c.mem_type =='child')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childVisaDiv${child_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childVisaFile" accept="image/*" @change="uploadFile($event.target.files, 2,`${child_idx+1}`, 'child')">
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.birth_img")}} [{{ child_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${child_idx+1}` && c.file_type == '3' && c.mem_type =='child')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childBirthDiv${child_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childBirthFile" accept="image/*" @change="uploadFile($event.target.files, 3,`${child_idx+1}`, 'child')">
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-4 col-form-label fw-bold text-start font-md"><strong class="text-danger">*</strong> {{$t("order.air_img")}} [{{ child_idx+1 }}]</label>
            <div class="col-md-8">
              <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-2" :key="i" v-for="(m,i) in passImgList.filter(c=>c.sort_order==`${child_idx+1}` && c.file_type == '4' && c.mem_type =='child')">
                  <div class="position-relative   admin-div text-start pb-1">
                    <div :id="`childAirDiv${child_idx}`" class="text-info mobile-md">{{ m.origin_file_name }}</div>
                  </div>
                </div>
              </div>
              <input type="file" class="form-control mobile-md" ref="childAirFile" accept="image/*" @change="uploadFile($event.target.files, 4,`${child_idx+1}`, 'child')">
            </div>
          </div> -->
          <hr>
        </div> 
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button  type="button" :class="isMobile == true ? 'float-end btn btn-info btn-st-sm' : 'float-end btn btn-info btn-st-md'" @click="userInfoInsert">{{$t("common.common_reserv")}}</button>
        <button :class="isMobile == true ? 'float-end btn btn-danger  btn-sm btn-st-sm' : 'float-end btn btn-sm btn-danger btn-st-md'" type="button" @click="deleteCutomerInfo">{{$t("common.order_customer_info_delete")}}</button>
        <button :class="isMobile == true ? 'float-end btn btn-dark  btn-sm btn-st-sm' : 'float-end btn btn-sm btn-dark btn-st-md'" type="button" @click="goPage">{{$t("common.home")}}</button>
      </div>
    </div>
    <modalMyCart 
      :info="this.info" 
      @onPriceChange="receiveEmit">
    </modalMyCart>
    <div :style="isLoading == true ? 'display : none' : 'display : block'" :class="isMobile == true ? 'loader-mobile loader' : 'loader'"></div>
  </main>
</template>

<script>
import { isDEmpty } from '@/is';
import modalMyCart from '@/components/ModalMyCart.vue';
import {swalTost, swal} from '@/alert'
let timer = null
export default {
  components: { modalMyCart },
  props:{
    cartList : Array,
  },
  data() {
    return {
      file1 : "",
      index : 0,
      cnt : 0, 
      productTotal: 0,
      productList : {},
      total: 1,
      totalPrice: 0,
      trSeq : "",
      trTp : "",
      // allChecked: false,
      cart_seq : [],
      total_price_str : "",
      order_cnt : 0,
      phone_kind:"010",
      phone_number : "",
      tel_kind : "",
      email:"",
      email_domain : "",
      domain : "",
      email_addr : "",
      message: "",
      inputText : "",
      sortSeq : "",
      userInfo : {
        adult_nm_arr : [],
        adult_tel_arr : [],
        adult_email_arr : [],
        teen_nm_arr : [],
        teen_tel_arr : [],
        teen_email_arr : [],
        children_nm_arr : [],
        child_nm_arr : [],
      },
      
      memberInfo : {mem_id : ""},
      productImageList : [],
      passImgList : [
        {
          file_id : "",
          file_path : "",
          sort_order : "",
        }
      ],
      file_id_arr : [],
      file_path_arr : [],
      file_name_arr : [],
      
      type : "passport",
      msgType : "set",
      lanTp : "",
      resParam : {},
      products : {},
      reservInfoList : [],
      resType  : "REGISTER",
      optionList : [],
      optionPriceTotal : "",
      adult_cnt : 0,
      teen_cnt : 0,
      children_cnt : 0,
      child_cnt : 0,
      mem_type : "",
      loader : '',
      isLoading : false,
      disabledFlag : false,
      prod_price_tp : "",
      info : {},
      isMobile : false,
      hotelCartList : [],
      adultAirFlag : null,
      teenAirFlag : null,
      airFlag : null,
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
      this.$router.push({path:'/'});
    }
    this.$nextTick(() => {
      this.isLoading = false
    })
  },
  unmounted() {
    clearTimeout(timer)
  },
  created() {
    // console.log("domain1 : ",this.email_domain);
    this.resParam = JSON.parse(history.state.reqParam)
    this.cnt;
    console.log("this.resParam : ", this.resParam)
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.isLoading = true
      this.getProductList();
      this.getProductImage();
      this.getReservInfoList()
      this.getPassPortImgage();
    }, 1000);
  },
  methods: {
    modifyInfo(type, obj){
      console.log("obj : ",obj)
      this.info = {
        data_type : type,
        price_type : this.prod_price_tp ,
        prod_id : this.resParam.prod_id,
        mem_id : this.user.mem_id,
        cart_id : this.resParam.cart_id,
        lan_tp : this.resParam.lan_tp,
        iprice : obj.origin_price,
        prod_unit : this.resParam.prod_unit,
        deal_bas_r : this.resParam.deal_bas_r,
        pageType : 'reservInfo'
      }
      console.log("info : ", this.info)
    },
    async receiveEmit(obj) {
      console.log("receiveEmit obj : ", obj)
      console.log("receiveEmit obj : ", obj.length)
      if(obj.length > 0) {
        for(let temps of obj) {
          if(temps.page_type == 'reservInfo') {
            if(temps.mem_type == 'adult') {
              this.adult_cnt = temps.adult_cnt
              for(let i = temps.origin_adult_cnt ; i > temps.adult_cnt ; i--) {
                let imgs = await this.$api("/api/passPortDtl",{param : [this.resParam.cart_id,temps.mem_type, i]});     
                for(let j = 0; j < imgs.length; j++) {
                  let info = {
                    filepath : imgs[j].file_path,
                    category : 'PASSPORT',
                    prod_id : imgs[j].prod_id,
                    mem_id : imgs[j].mem_id,
                    cart_id : imgs[j].cart_id,
                    file_type : imgs[j].file_type,
                    mem_type : imgs[j].mem_type,
                    sort_order : imgs[j].sort_order,
                    file_name : imgs[j].file_name,
                    file_id : imgs[j].mem_file_id,
                    mod_type : 'select',
                  }
                  await this.$api(`/deleteFile/PASSPORT`, { info });
                  // await this.$api("/api/passportImgDelete",{param:[imgs[j].mem_file_id]});
                }
              }
            } else if(temps.mem_type == 'teen') {
              this.teen_cnt = temps.teen_cnt
              for(let i = temps.origin_teen_cnt; i > temps.teen_cnt ; i--) {
                let imgs = await this.$api("/api/passPortDtl",{param : [this.resParam.cart_id,temps.mem_type, i]});     
                for(let j = 0; j < imgs.length; j++) {
                  let info = {
                    filepath : imgs[j].file_path,
                    category : 'PASSPORT',
                    prod_id : imgs[j].prod_id,
                    mem_id : imgs[j].mem_id,
                    cart_id : imgs[j].cart_id,
                    file_type : imgs[j].file_type,
                    mem_type : imgs[j].mem_type,
                    sort_order : imgs[j].sort_order,
                    file_name : imgs[j].file_name,
                    file_id : imgs[j].mem_file_id,
                    mod_type : 'select',
                  }
                  await this.$api(`/deleteFile/PASSPORT`, { info });
                  // await this.$api("/api/passportImgDelete",{param:[imgs[j].mem_file_id]});
                }
              }
  
            } else if(temps.mem_type == 'children') {
              this.children_cnt = temps.children_cnt
              for(let i = temps.origin_children_cnt; i > temps.children_cnt ; i--) {
                let imgs = await this.$api("/api/passPortDtl",{param : [this.resParam.cart_id,temps.mem_type, i]});     
                for(let j = 0; j < imgs.length; j++) {
                  let info = {
                    filepath : imgs[j].file_path,
                    category : 'PASSPORT',
                    prod_id : imgs[j].prod_id,
                    mem_id : imgs[j].mem_id,
                    cart_id : imgs[j].cart_id,
                    file_type : imgs[j].file_type,
                    mem_type : imgs[j].mem_type,
                    sort_order : imgs[j].sort_order,
                    file_name : imgs[j].file_name,
                    file_id : imgs[j].mem_file_id,
                    mod_type : 'select',
                  }
                  await this.$api(`/deleteFile/PASSPORT`, { info });
                  // await this.$api("/api/passportImgDelete",{param:[imgs[j].mem_file_id]});
                }
              }
            } else {
              this.child_cnt = temps.child_cnt
              for(let i = temps.origin_child_cnt; i > temps.child_cnt ; i--) {
                let imgs = await this.$api("/api/passPortDtl",{param : [this.resParam.cart_id,temps.mem_type, i]});     
                for(let j = 0; j < imgs.length; j++) {
                  let info = {
                    filepath : imgs[j].file_path,
                    category : 'PASSPORT',
                    prod_id : imgs[j].prod_id,
                    mem_id : imgs[j].mem_id,
                    cart_id : imgs[j].cart_id,
                    file_type : imgs[j].file_type,
                    mem_type : imgs[j].mem_type,
                    sort_order : imgs[j].sort_order,
                    file_name : imgs[j].file_name,
                    file_id : imgs[j].mem_file_id,
                    mod_type : 'select',
                  }
                  await this.$api(`/deleteFile/PASSPORT`, { info });
                  // await this.$api("/api/passportImgDelete",{param:[imgs[j].mem_file_id]});
                }
              }
            }
          }
        }
      }
      this.getProductList()
      this.getPassPortImgage()
    },
    async getPassPortImgage() {
      let passImgList = await this.$api("/api/passPortList",{param : [this.resParam.prod_id, this.user.mem_id, this.resParam.cart_id]});
      
      
      this.passImgList = passImgList
      console.log("this.passImgList get : ", this.passImgList.length)
    },
    async getProductImage() {
      console.log("this.resParam.prod_id :" , this.resParam.prod_id)
      // this.productImageList = await this.$api("/api/imageList",{param:[this.resParam.prod_id]});
    },
    async getProductList() {
      let prod_unit = this.resParam.prod_unit
      let productList = await this.$api('/api/mycartList1', {param:[prod_unit,prod_unit, prod_unit, prod_unit,prod_unit,this.resParam.cart_id,this.resParam.lan_tp]});
      this.optionList = await this.$api("/api/optionDtl", {param:[prod_unit, this.user.mem_id, this.resParam.cart_id]});
      // this.hotelCartList = await this.$api("/api/hotelCartList", {param:[]});
      console.log(productList[0]);
      if(productList.length > 0) {
        this.products = productList[0]
        this.prod_price_tp = this.products.prod_price_tp
      }
      this.optionPriceTotal = 0
      this.optionPriceTotal = this.products.option_price
      this.totalPrice = this.products.cost_price
      this.adult_cnt = this.products.adult_cnt
      this.teen_cnt = this.products.teen_cnt
      this.children_cnt = this.products.children_cnt
      this.child_cnt = this.products.child_cnt
      this.productTotal = this.adult_cnt + this.teen_cnt + this.children_cnt + this.child_cnt
      console.log("this.adult_cnt111 : ", this.adult_cnt)
      if(isDEmpty(this.adultAirFlag) && isDEmpty(this.teenAirFlag)) {
        if(this.adult_cnt > 0 && this.teen_cnt > 0){
          this.adultAirFlag = true
          this.teenAirFlag = false
        } else if(this.adult_cnt > 0 && this.teen_cnt < 1){
          this.adultAirFlag = true
          this.teenAirFlag = false
        } else if(this.adult_cnt < 1 && this.teen_cnt > 0){
          this.adultAirFlag = false
          this.teenAirFlag = true
        }
      } else {
        let adultCnt = 0
        let teenCnt = 0
        this.passImgList.forEach(item => {
          if(item.mem_type == 'adult' && item.file_type == '4'){
            adultCnt++
            
          } else if(item.mem_type == 'teen' && item.file_type == '4'){
            teenCnt++
          }
        })
        if(this.adult_cnt > 0 && this.teen_cnt > 0) {
          if(adultCnt < 1 && teenCnt < 1) {
            this.adultAirFlag = true
            this.teenAirFlag = false
          } else if(adultCnt > 0 && teenCnt < 1) {
            this.adultAirFlag = true
            this.teenAirFlag = false
          }
        } else if(this.adult_cnt > 0 && this.teen_cnt < 1) {
          if(adultCnt > 0 && teenCnt < 1) {
            this.adultAirFlag = true
            this.teenAirFlag = false
          } else if(adultCnt < 1 && teenCnt < 1) {
            this.adultAirFlag = true
            this.teenAirFlag = false
          }
        } else if(this.adult_cnt < 1 && this.teen_cnt > 0) {
          if(adultCnt < 1 && teenCnt < 1) {
            this.adultAirFlag = false
            this.teenAirFlag = true
          } else if(adultCnt < 1 && teenCnt > 0) {
            this.adultAirFlag = false
            this.teenAirFlag = true
          }
        } 
      } 
    },
    
    async getReservInfoList() {
      // T : 임시저장 상태
      this.reservInfoList = await this.$api('/api/reservInfoList', {param : ['N','T',this.resParam.prod_id,this.user.mem_id,this.resParam.cart_id]})

      if(this.reservInfoList.length > 0) {
        this.regType = 'MODIFY'
        this.reservInfoList.forEach(item => {
          if(item.mem_type == 'adult') {
            this.userInfo.adult_nm_arr.push(item.mem_nm)
            this.userInfo.adult_tel_arr.push(item.tel)
            this.userInfo.adult_email_arr.push(item.email)
          } else if(item.mem_type == 'teen') {
            this.userInfo.teen_nm_arr.push(item.mem_nm)
            this.userInfo.teen_tel_arr.push(item.tel)
            this.userInfo.teen_email_arr.push(item.email)
            
          } else if(item.mem_type == 'children') {
            this.userInfo.children_nm_arr.push(item.mem_nm)
          } else {
            this.userInfo.child_nm_arr.push(item.mem_nm)
          }
          
        });
        console.log("this.userInfo : ", this.userInfo)
      }
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async goCancel(){
      let reqParam = {
        lan_tp : this.resParam.lan_tp
      }
      this.$router.push({path:'/', state  :{reqParam : JSON.stringify(reqParam)}});
    },
    async uploadFile(files, type,sort_order, mem_type) {
      this.pfiles = files;
      let filepath = "";
      let regType = 'REGISTER'
      let fileId = "nodata"
      // file_arry1 = null
      if(this.pfiles.length > 0) {
        if (files[0].type.indexOf('image') < 0) {
          return swal.fire({
                    title: this.$t("common.img_accept_fail"),
                    icon : 'warning',
                    timer: 1500, 
                    confirmButtonText: this.$t("common.common_close"),
                  })
        }
        console.log("this.passImgList.length222 : ", this.passImgList.length)
        if(this.passImgList.length > 0) {
          this.passImgList.forEach(item => {
            filepath = item.file_path
            if(item.sort_order == sort_order && item.file_type == type && item.mem_type == mem_type) {
              regType = 'MODIFY'
              fileId = item.mem_file_id
              let info = {
                filepath : item.file_path,
                category : 'PASSPORT',
                prod_id : item.prod_id,
                mem_id : item.mem_id,
                cart_id : item.cart_id,
                file_type : item.file_type,
                mem_type : item.mem_type,
                sort_order : item.sort_order,
                file_name : item.file_name,
                file_id : item.mem_file_id,
                mod_type : 'select',
              }
              this.$api(`/deleteFile/PASSPORT`, { info });
            }
          });
        } else {
          regType = 'REGISTER'
          filepath = this.$dateFormat('todate')
        }
        const formData = new FormData()
        
        for(let i=0; i < this.pfiles.length ; i++) {
          console.log(files[0].name)
          formData.append('img', files[i])
        }
        await this.$api(`/upload/PASSPORT/${filepath}/${this.resParam.prod_id}/${this.user.mem_id}/${this.resParam.cart_id}/${type}/${sort_order}/${regType}/${mem_type}/${fileId}`,  formData);
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
          await this.$api(`/deleteFile/PASSPORT/${obj.file_path}/${obj.prod_id}/${obj.mem_id}/${obj.cart_id}/${obj.mem_type}/${obj.file_type}/${obj.sort_order}/${obj.file_name}`, {  });
          await this.$api("/api/passportImgDelete",{param:[obj.mem_file_id]});
          this.getPassPortImgage();
        } 
      });
    },
    validationChk() {
      const regex = /^[0-9]+$/
      const regex1 = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      // 성인체크
      
      if(this.adult_cnt > 0) {
        for(let idx =0 ; idx <  this.adult_cnt; idx++) {
          if(isDEmpty(this.userInfo.adult_nm_arr[idx])){
            this.$refs.adult_nm[idx].focus();
            swal.fire({
              title: this.$t('common.adult') + this.$t('order.name')+[idx+1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          if(isDEmpty(this.userInfo.adult_tel_arr)) {
            this.$refs.adult_tel[0].focus();
            swal.fire({
              title: this.$t('common.adult') + this.$t('order.tel')+[idx+1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          } else {
            if (!regex.test(this.userInfo.adult_tel_arr)) {
                this.userInfo.adult_tel_arr = ''
                this.$refs.adult_tel[0].focus()
                swal.fire({
                  title: this.$t("common.common_tel_number"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
                return false
            }
          }
          if(isDEmpty(this.userInfo.adult_email_arr)) {
            this.userInfo.adult_email_arr = ''
            this.$refs.adult_email[0].focus();
            swal.fire({
              title: this.$t('common.adult') + this.$t('order.email')+[idx+1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          } else {
            if (!regex1.test(this.userInfo.adult_email_arr)) {
              this.userInfo.adult_email_arr = ''
              this.$refs.adult_email[0].focus()
              swal.fire({
                title: this.$t("common.common_login_email_validation"),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              return false
            }
          }
          if(this.adultAirFlag == true && this.teenAirFlag == false) {
            let adultAir = document.querySelector(`#adultAirDiv0`)
            if(isDEmpty(adultAir)) {
              this.$refs.adultAirFile[0].focus()
              swal.fire({
                title: this.$t('order.passport_img_fail'),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              return false
            } 
          }


          let adultPass = document.querySelector(`#adultPassDiv${idx}`)
          //let adultVisa = document.querySelector(`#adultVisaDiv${idx}`)
          // let adultBirth = document.querySelector(`#adultBirthDiv${idx}`)
          
          if(isDEmpty(adultPass)) {
            this.$refs.adultPassFile[idx].focus()
            swal.fire({
              title: this.$t('order.passport_img_fail'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          // if(isDEmpty(adultVisa)) {
          //   this.$refs.adultVisaFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
          // if(isDEmpty(adultBirth)) {
          //   this.$refs.adultBirthFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
          
        }
      }
      // 청소년 체크
      if(this.teen_cnt > 0) {
        for(let idx =0 ; idx <  this.teen_cnt; idx++) {
          // console.log("mem_nm_arr : ",this.userInfo.mem_nm_arr[idx], idx);
          if(isDEmpty(this.userInfo.teen_nm_arr[idx])){
            this.$refs.teen_nm[idx].focus();
            swal.fire({
              title: this.$t('common.teenager') + this.$t('order.name')+[idx+1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          if(isDEmpty(this.userInfo.teen_tel_arr)) {
            if(this.adult_cnt < 1) {
              this.$refs.teen_tel[0].focus();
              swal.fire({
                title: this.$t('common.teenager') + this.$t('order.tel')+[idx+1]+this.$t('order.sub_input_msg'),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              return false
            }
          } else {
            if(this.adult_cnt < 1) {
              if (!regex.test(this.userInfo.teen_tel_arr)) {
                  this.userInfo.teen_tel_arr = ''
                  this.$refs.teen_tel[0].focus()
                  swal.fire({
                    title: this.$t('common.teenager') + this.$t("common.common_tel_number"),
                    icon : 'warning',
                    timer: 1500, 
                    confirmButtonText: this.$t("common.common_close"),
                  })
                  return false
              }
            }
          }
          if(isDEmpty(this.userInfo.teen_email_arr)) {
            if(this.adult_cnt < 1) {
              this.$refs.teen_email[0].focus();
              swal.fire({
                title: this.$t('common.teenager') + this.$t('order.email')+[idx+1]+this.$t('order.sub_input_msg'),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              return false
            }
          } else {
            if(this.adult_cnt < 1) {
              if (!regex1.test(this.userInfo.teen_email_arr)) {
                this.userInfo.teen_email_arr = ''
                this.$refs.teen_email[0].focus()
                swal.fire({
                  title: this.$t('common.teenager') + this.$t("common.common_login_email_validation"),
                  icon : 'warning',
                  timer: 1500, 
                  confirmButtonText: this.$t("common.common_close"),
                })
                return false
              }
            }
          }
          let teenAir = document.querySelector(`#teenAirDiv0`)
          let teenPass = document.querySelector(`#teenPassDiv${idx}`)
          // let teenVisa = document.querySelector(`#teenVisaDiv${idx}`)
          // let teenBirth = document.querySelector(`#teenBirthDiv${idx}`)
          if(this.adultAirFlag == false && this.teenAirFlag == true) {
            if(isDEmpty(teenAir)) {
              this.$refs.teenAirFile[0].focus()
              swal.fire({
                title: this.$t('order.passport_img_fail'),
                icon : 'warning',
                timer: 1500, 
                confirmButtonText: this.$t("common.common_close"),
              })
              return false
            }
          }
          if(isDEmpty(teenPass)) {
            this.$refs.teenPassFile[idx].focus()
            swal.fire({
              title: this.$t('order.passport_img_fail'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          // if(isDEmpty(teenVisa)) {
          //   this.$refs.teenVisaFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
          // if(isDEmpty(teenBirth)) {
          //   this.$refs.teenBirthFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
          
        }
      }
      // 어린이 체크
      if(this.children_cnt > 0) {
        for(let idx =0 ; idx <  this.children_cnt; idx++) {
          if(isDEmpty(this.userInfo.children_nm_arr[idx])){
            this.$refs.children_nm[idx].focus();
            swal.fire({
              title: this.$t('common.children') + this.$t('order.name')+[idx+1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          let childrenPass = document.querySelector(`#childrenPassDiv${idx}`)
          // let childrenVisa = document.querySelector(`#childrenVisaDiv${idx}`)
          // let childrenBirth = document.querySelector(`#childrenBirthDiv${idx}`)
          if(isDEmpty(childrenPass)) {
            this.$refs.childrenPassFile[idx].focus()
            swal.fire({
              title: this.$t('order.passport_img_fail'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          // if(isDEmpty(childrenVisa)) {
          //   this.$refs.childrenVisaFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
          // if(isDEmpty(childrenBirth)) {
          //   this.$refs.childrenBirthFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
        }
      }
      // 영유아 체크
      if(this.child_cnt > 0) {
        for(let idx =0 ; idx <  this.child_cnt; idx++) {
          // console.log("mem_nm_arr : ",this.userInfo.mem_nm_arr[idx], idx);
          if(isDEmpty(this.userInfo.child_nm_arr[idx])){
            this.$refs.child_nm[idx].focus();
            swal.fire({
              title: this.$t('common.child') + this.$t('order.name')+[idx+1]+this.$t('order.sub_input_msg'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          let childPass = document.querySelector(`#childPassDiv${idx}`)
          // let childVisa = document.querySelector(`#childVisaDiv${idx}`)
          // let childBirth = document.querySelector(`#childBirthDiv${idx}`)
          if(isDEmpty(childPass)) {
            this.$refs.childPassFile[idx].focus()
            swal.fire({
              title: this.$t('order.passport_img_fail'),
              icon : 'warning',
              timer: 1500, 
              confirmButtonText: this.$t("common.common_close"),
            })
            return false
          }
          // if(isDEmpty(childVisa)) {
          //   this.$refs.childVisaFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
          // if(isDEmpty(childBirth)) {
          //   this.$refs.childBirthFile[idx].focus()
          //   swal.fire({
          //     title: this.$t('order.passport_img_fail'),
          //     icon : 'warning',
          //     timer: 1500, 
          //     confirmButtonText: this.$t("common.common_close"),
          //   })
          //   return false
          // }
        }
      }
      return true
    },
    userInfoInsert() {
      if(this.validationChk()) {
        let mem_nm = ""
        let mem_tel = ""
        let mem_email = ""
        if(this.adult_cnt > 0) {
          mem_nm = this.userInfo.adult_nm_arr[0]
          mem_tel = this.userInfo.adult_tel_arr
          mem_email = this.userInfo.adult_email_arr
        }
        if(this.adult_cnt < 1) {
          mem_nm = this.userInfo.teen_nm_arr[0]
          mem_tel = this.userInfo.teen_tel_arr
          mem_email = this.userInfo.teen_email_arr
        }
        let data = {
          prod_id : this.resParam.prod_id,
          mem_id : this.user.mem_id,
          cart_id : this.resParam.cart_id,
          txn_type : 'T',
          buyername : mem_nm,
          tel : mem_tel,
          email : mem_email,
          product : this.products.prod_title,
          pay_yn : 'N',
          use_yn : 'Y',
          del_yn : 'N',
        }
        let mData = {
          mem_id : this.user.mem_id,
          use_yn : 'Y',
        }
        let reqParam = {
          cart_id: this.resParam.cart_id,
          prod_id : this.resParam.prod_id,
          lan_tp : this.resParam.lan_tp,
          deal_bas_r : this.deal_bas_r,
          prod_unit : this.resParam.prod_unit
        }
        console.log("reqParam : ", reqParam)
        swalTost.fire({
            title : this.$t('common.common_reserv_confirm'),
            icon : 'question',
            confirmButtonText: this.$t('common.common_insert'),
            cancelButtonText : this.$t('common.common_cancel')
        }).then(async (result) => {
            if(result.isConfirmed) {
              this.isLoading = true
              if(this.reservInfoList.length < 1) {
                let orderId = await this.$api("/api/commSequences", {param : ['ORDER','order_id','9']})
                data = Object.assign(data, {order_id : orderId[0].commSeq})
                data = Object.assign(data, {reg_date : this.$dateFormat('filedate')})
                await this.$api("/api/reservInfoInsert" ,{param : [data]});
                if(this.adult_cnt > 0) {
                  for(let i = 0 ; i < this.adult_cnt; i++) {
                    let reservMemId = await this.$api("/api/commSequences", {param : ['RV_MEM','rv_mem_id','9']})
                    mData = Object.assign(mData, {rv_mem_id : reservMemId[0].commSeq})
                    mData = Object.assign(mData, {order_id : orderId[0].commSeq})
                    mData = Object.assign(mData, {mem_nm : this.userInfo.adult_nm_arr[i]})
                    mData = Object.assign(mData, {mem_type : 'adult'})
                    mData = Object.assign(mData, {reg_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoInsert" ,{param : [mData]});
                  }
                }
                if(this.teen_cnt > 0) {
                  for(let i = 0 ; i < this.teen_cnt; i++) {
                    let reservMemId = await this.$api("/api/commSequences", {param : ['RV_MEM','rv_mem_id','9']})
                    mData = Object.assign(mData, {rv_mem_id : reservMemId[0].commSeq})
                    mData = Object.assign(mData, {order_id : orderId[0].commSeq})
                    mData = Object.assign(mData, {mem_nm : this.userInfo.teen_nm_arr[i]})
                    mData = Object.assign(mData, {mem_type : 'teen'})
                    mData = Object.assign(mData, {reg_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoInsert" ,{param : [mData]});
                  }
                }
                if(this.children_cnt > 0) {
                  for(let i = 0 ; i < this.children_cnt; i++) {
                    let reservMemId = await this.$api("/api/commSequences", {param : ['RV_MEM','rv_mem_id','9']})
                    mData = Object.assign(mData, {rv_mem_id : reservMemId[0].commSeq})
                    mData = Object.assign(mData, {order_id : orderId[0].commSeq})
                    mData = Object.assign(mData, {mem_nm : this.userInfo.children_nm_arr[i]})
                    mData = Object.assign(mData, {mem_type : 'children'})
                    mData = Object.assign(mData, {reg_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoInsert" ,{param : [mData]});
                  }
                }
                if(this.child_cnt > 0) {
                  for(let i = 0 ; i < this.child_cnt; i++) {
                    let reservMemId = await this.$api("/api/commSequences", {param : ['RV_MEM','rv_mem_id','9']})
                    mData = Object.assign(mData, {rv_mem_id : reservMemId[0].commSeq})
                    mData = Object.assign(mData, {order_id : orderId[0].commSeq})
                    mData = Object.assign(mData, {mem_nm : this.userInfo.child_nm_arr[i]})
                    mData = Object.assign(mData, {mem_type : 'child'})
                    mData = Object.assign(mData, {reg_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoInsert" ,{param : [mData]});
                  }
                }
                this.isLoading = false
              } else {
                data = Object.assign(data, {mod_date : this.$dateFormat('filedate')})
                await this.$api("/api/reservInfoUpdate" ,{param : [data,this.reservInfoList[0].order_id]});
                
                if(this.adult_cnt > 0) {
                  for(let i = 0 ; i < this.adult_cnt; i++) {
                    mData = Object.assign(mData, {mem_nm : this.userInfo.adult_nm_arr[i]})
                    mData = Object.assign(mData, {mod_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoUpdate" ,{param : [mData, this.reservInfoList[i].rv_mem_id,]});
                  }
                }
                if(this.teen_cnt > 0) {
                  for(let i = 0 ; i < this.adult_cnt; i++) {
                    mData = Object.assign(mData, {mem_nm : this.userInfo.teen_nm_arr[i]})
                    mData = Object.assign(mData, {mod_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoUpdate" ,{param : [mData, this.reservInfoList[i].rv_mem_id,]});
                  }
                }
                if(this.children_cnt > 0) {
                  for(let i = 0 ; i < this.children_cnt; i++) {
                    mData = Object.assign(mData, {mem_nm : this.userInfo.children_nm_arr[i]})
                    mData = Object.assign(mData, {mod_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoUpdate" ,{param : [mData, this.reservInfoList[i].rv_mem_id,]});
                  }
                }
                if(this.child_cnt > 0) {
                  for(let i = 0 ; i < this.child_cnt; i++) {
                    mData = Object.assign(mData, {mem_nm : this.userInfo.child_nm_arr[i]})
                    mData = Object.assign(mData, {mod_date : this.$dateFormat('filedate')})
                    await this.$api("/api/reservMemberInfoUpdate" ,{param : [mData, this.reservInfoList[i].rv_mem_id,]});
                  }
                }
                this.isLoading = false
              } 
              await this.$api("/api/myCartUpdate" ,{param : [{txn_type : 'T', mod_date : this.$dateFormat('filedate')}, this.resParam.cart_id]});
              
              console.log("reqParam : ", reqParam)
              this.$router.push({path:'/order', state : {reqParam : JSON.stringify(reqParam)}});
              
            }
        })    
      }
    },
    async deleteCutomerInfo () {
        swalTost.fire({
          title: this.$t('common.order_customer_info_delete_msg') ,
          icon : 'question',
          confirmButtonText: this.$t('common.common_delete'),
          cancelButtonText: this.$t('common.common_cancel')
        }).then(async (result) => {
          if (result.isConfirmed) {
            // 파일삭제
            let imgs = await this.$api('/api/passPortGroupList', {param : [this.cart_id]});
            if(imgs.length > 0) {
              for(let item of imgs) {
                let info = {
                  filepath : item.file_path,
                  category : 'PASSPORT',
                  prod_id : item.prod_id,
                  mem_id : item.mem_id,
                  cart_id : item.cart_id,
                  mod_type : 'all',
                }
                await this.$api(`/deleteFile/PASSPORT`, {info});
              }
              // 파일 데이터 삭제
              await this.$api('/api/passportImgAllDelete', {param : [this.user.mem_id, this.resParam.prod_id, this.resParam.cart_id]})
            }
            if(this.reservInfoList.length > 0) {
              await this.$api('/api/reservInfoDelete', {param : [this.reservInfoList[0].order_id]})
              await this.$api('/api/reservMemberInfoDelete', {param : [this.reservInfoList[0].order_id]})
            }
            this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
          }
        });
    },
    goPage() {
      window.location.reload(true)
      window.location.href=`/?lan_tp=${this.resParam.lan_tp}`
      // this.$router.push({path : '/', query : {lan_tp : this.resParam.lan_tp} })
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