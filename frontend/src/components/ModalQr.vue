<template>
  <div :class="isMobile == true ? 'mobile-lg' : ''"> 
    <button class="float-end btn btn-outline-warning me-md-2 text-light" hidden type="button" id="modalQrBtn" data-bs-toggle="modal" data-bs-target="#staticQrBackdrop">test</button> 
    <!-- Modal -->
    <div class="modal fade modal-md" id="staticQrBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticQrBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div :class="isMobile == true ? 'mobile fw-bold text-start' : 'fw-bold text-start'" id="staticQrBackdropLabel">{{ $t("common.common_wechat_admin") }}</div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img src="../img/ico/qrcode_admin2.jpg" style="width:300px;height: 300px;">
          </div>
          <div class="modal-footer">
            <button id="modalQrClose" type="button" :class="isMobile == true ? 'btn btn-secondary mobile-ss btn-st-sm' : 'btn btn-secondary btn-sm btn-st-md'" data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>          
</template>
<script>
export default {
  data() {
    return {
      isMobile : false,
    }
  },
  created() {
    this.isMobile = this.$isMobile()
  }
}
</script>
