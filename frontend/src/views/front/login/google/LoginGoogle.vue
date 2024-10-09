<template>
  <div>
    <!-- Google 로그인 버튼 -->
    <!-- <google method="GET" action="/auth/google"> -->
    <google ref="google">
      <a class="btn col-12" role="button" @click="googleLogin">
        <img src="../../../../img/ico/google.png" alt="카카오 로그인 버튼" />
      </a>
    </google>
  </div>
</template>
<script>
import {swal} from '@/alert'
export default {
  components: {},
  data() {
    return {
      isMobile : false
    };
  },
  mounted() {
    this.isMobile = this.$isMobile()
  },

  methods: {
    googleLogin() {
      swal.fire({
        title: this.$t("common.common_login_ing"),
        icon : 'warning',
        timer: 3000, 
        confirmButtonText: this.$t("common.common_close"),
      })
      // window.location.href="/auth/google"
    }
  },
};
</script>
<style>

</style>
