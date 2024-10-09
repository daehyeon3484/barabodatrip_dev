<template>
    <div> 
      <div class="d-grid gap-2 d-md-flex justify-content-md-end pt-2">
        <button type="button" class="btn  btn-info text-nowrap" data-bs-toggle="modal" data-bs-target="#staticBackdrop">QR</button>
      </div>
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">QR</h1>
                <button type="button" class="btn-close btn-st-sm" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!--<vue-qrcode :value="`${this.url}?mem_id=${this.mem_id}&cart_id=${this.cart_id}&prod_id=${this.param_id}&type=${this.type}`" ></vue-qrcode>-->
                <!-- <vue-qrcode value="https://barabodatrip.com/?company_type=barabodatrip" ></vue-qrcode> -->
                <vue-qrcode value="https://barabodatrip.com/?company_type=movemake20240602001" ></vue-qrcode>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary stn-st-sm" data-bs-dismiss="modal">{{ $t("common.common_close") }}</button>
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

      }
    },
    created() {
      
    },
    methods : {
      
    }
  }
  </script>
  
  <style>
  
  </style>