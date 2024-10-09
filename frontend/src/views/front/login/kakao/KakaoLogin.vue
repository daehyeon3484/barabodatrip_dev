<template>
  <div> 
    <kakao ref="kakao">
      <a class="btn col-12" role="button" @click="kakaoLogin">
        <img src="../../../../img/ico/kakao.png" alt="카카오 로그인 버튼" />
        <!-- <img src="../../../../img/ico/kakao.png" style="border-radius: 8px;width:300px;height: 57px;padding: 0 0 0 0" alt="카카오 로그인 버튼" /> -->
      </a>
    </kakao>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userChk :""  ,
      admChk :""  ,
      resParam : {}
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
    
  },
  methods: {
    async kakaoLogin() {
      window.location.href=`/auth/kakao`
    },
    
  }
}
</script>



