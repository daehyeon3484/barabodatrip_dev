<template>
  <div class="continer">
    <h5 v-if="!isMobile" class="text-center bg-info text-light">{{$t("common.comment_customer_file_list")}}</h5>
    <h6 v-else class="text-center bg-info text-light">{{$t("common.comment_customer_file_list")}}</h6>
    <div class="row">
      <div v-if="fileList.length > 0"> 
        <div :key="i" v-for="(files, i) in fileList">
          <div v-if= "files.file_type == '1'"> 
            <img :src='`/download/PASSPORT/${files.file_path}/${files.prod_id}/${files.mem_id}/${files.cart_id}/${files.mem_type}/${files.file_type}/${files.sort_order}/${files.file_name}`' alt="">
            <hr>
          </div>
          <div v-else-if="files.file_type == '2'">
            <img :src='`/download/PASSPORT/${files.file_path}/${files.prod_id}/${files.mem_id}/${files.cart_id}/${files.mem_type}/${files.file_type}/${files.sort_order}/${files.file_name}`' alt="">
            <hr>
          </div>
          <div v-else>
            <img :src='`/download/PASSPORT/${files.file_path}/${files.prod_id}/${files.mem_id}/${files.cart_id}/${files.mem_type}/${files.file_type}/${files.sort_order}/${files.file_name}`' alt="">
            <hr>
          </div>
          <!-- <img :src='`/download/PASSPORT/${files.file_path}/${files.prod_id}/${files.mem_id}/${files.cart_id}/2/${files.sort_order}/${files.file_name}`' alt=""> -->
          <!-- <hr> -->
        </div>
      </div>
      <div v-if="evImgList.length > 0">
        <div :key="i" v-for="(files, i) in evImgList">
          <div v-if= "files.file_type == '1'"> 
            <img :src='`/download/EVENT/PASSPORT/${files.file_path}/${files.event_id}/${files.mem_id}/${files.file_type}/${files.sort_order}/${files.file_name}`' alt="">
            <hr>
          </div>
          <div v-else-if="files.file_type == '2'">
            <img :src='`/download/EVENT/PASSPORT/${files.file_path}/${files.event_id}/${files.mem_id}/${files.file_type}/${files.sort_order}/${files.file_name}`' alt="">
            <hr>
          </div>
          <!-- /${params.category}/${params.categoryType}/${params.filepath}/${params.event_id}/${params.mem_id}/${params.type}/${params.sort_seq} -->
          <div v-else>
            <img :src='`/download/EVENT/PASSPORT/${files.file_path}/${files.event_id}/${files.mem_id}/${files.file_type}/${files.sort_order}/${files.file_name}`' alt="">
            <hr>
          </div>
          <!-- <img :src='`/download/PASSPORT/${files.file_path}/${files.prod_id}/${files.mem_id}/${files.cart_id}/2/${files.sort_order}/${files.file_name}`' alt=""> -->
          <!-- <hr> -->
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
// import {isDEmpty} from '@/is';
let timer = null
export default {
  data() {
    return {
      mem_id: "",
      param_id: "",
      cart_id: "",
      fileList: [],
      resParam : {},
      event_id : "",
      evImgList : [],
      type : "",
      isMobile : false
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    // if (this.user.mem_id == undefined && this.user.adminYn != "Y") {
    //   this.$swal(this.$t("common.common_login_fail"));
    //   this.$router.push({ path: '/' });
    // }
    
  },
  unmounted() {
    clearTimeout(timer)
  },
  created() {
    this.mem_id = this.$route.query.mem_id
    this.param_id = this.$route.query.param_id
    this.cart_id = this.$route.query.cart_id
    this.event_id = this.$route.query.event_id
    this.type = this.$route.query.type
    this.isMobile = this.$isMobile()
    timer = setTimeout(() => {
      this.myInfoFileList();
    }, 1000);

    
    console.log(this.mem_id, this.prod_id);
  },
  methods: {
    async myInfoFileList() {
      if(this.type == 'product') {
        this.fileList = await this.$api("/api/passPortList", { param: [this.param_id, this.user.mem_id, this.cart_id] });
      } else {
        this.evImgList = await this.$api("/api/eventPassPortList", { param: [this.param_id, this.user.mem_id] });
      }

      
    },
  }
}
</script>

<style lang="scss" scoped>

</style>