<template>
    <div>
      <!-- Google 로그인 버튼 -->
      <!-- <google method="GET" action="/auth/google"> -->
      <google ref="google">
        <a class="btn btn-block btn-social btn-kakao" role="button" @click="googleLogin">
          <img src="../../../../img/ico/google.png" style="border-radius: 8px;width:300px;height: 57px;padding: 0 0 0 0" alt="카카오 로그인 버튼" />
        </a>
      </google>
      
    </div>
  </template>
  <script>
  
  export default {
    components: {},
    data() {
      return {
  
      };
    },
    mounted() {
     
    },
  
    methods: {
      googleLogin() {
        window.location.href="/auth/google"
      }
    },
  };
  </script>
  <style>
  
</style>
  