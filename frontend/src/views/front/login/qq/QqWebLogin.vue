<template>
  <div class=""> 
    <qq ref="qq">
      <a class="btn col-12" role="button" @click="qqLogin">
        <img src="../../../../img/ico/qq2.png"  alt="...">
      </a>
    </qq>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userChk :""  ,
      admChk :""  ,
      resParam : {},
    }
  },
  computed : {
    user() {
      console.log("state.user : ",this.$store.state.user);
      return this.$store.state.user;
    }
  },
  mounted() {
    // this.goAdminChk(this.user.email);
  },
  created(){
    // let lanTp = this.$route.query.lan_tp
  },
  methods: {
    async qqLogin() {
      if(this.$isMobile()) {
        window.location.href=`/auth/mobile/qq`
      } else {
      window.location.href=`/auth/web/qq`
      }
    },
    
  }
}
</script>



