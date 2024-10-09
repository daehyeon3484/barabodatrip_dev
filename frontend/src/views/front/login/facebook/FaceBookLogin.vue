<template>
  <main class="mt-2">
      <div class="continer">
      <div class="row"> 
          <div class="col-md-12"> 
            <facebook ref="facebook">
              <a class="btn btn-block btn-social btn-facebook" @click="login" role="button">
                <img src="../../../../img/ico/facebook.png" style="border-radius: 8px;width:300px;padding: 0 0 0 0" alt="페이스북 로그인 버튼" />
              </a>
              <!-- <fb:login-button 
              scope="public_profile,email"
              onlogin="checkLoginState();">
              </fb:login-button> -->
              <!-- <a class="btn btn-block btn-social btn-facebook" href="/auth/facebook" role="button">
                <img src="../../../../img/ico/facebook.png" style="border-radius: 8px;width:300px;padding: 0 0 0 0" alt="페이스북 로그인 버튼" />
              </a> -->
            </facebook>
          </div>
      </div>
      </div>
  </main>
</template>
<script>
const fb = require('@/facebook');
import {generateSessionStorage} from '@/storage'
const sessionStorage = generateSessionStorage()
import {swal} from '@/alert'
export default {
  data() {
      return {
        
      }
  },
  computed : {
    user() {
      console.log("state.user : ",this.$store.state.user);
      return this.$store.state.user;
    }
  },
  mounted() {
    if(!window.FB) fb.Init();
  },
  unmounted() {
  },
  methods : {
    login() {
      window.FB.getLoginStatus(res => {
        window.FB.login(
          response => {
            console.log("response.status : ", response.status)
            if(response.status === 'connected') {
              const accessToken = response.authResponse.accessToken;
              console.log("accessToken : ", accessToken)
              window.FB.api('/me', {fields: 'id, name, email, picture'}, res=> {
                if(!res) this.loginFailure();
                console.log("Res :", res )
                const req_body = {
                  accessToken : accessToken,
                  id : res.id,
                  email : res.email,
                  name : res.name,
                  profileIMG : res.picture.data.url,
                  gubun : "facebook",
                  source : 'f'
                };
                this.social_login(req_body);
                // console.log("req_body : ",req_body);
              });
            } else {
              this.loginFailure();
            }
          },
          {scope: 'public_profile, email' },
        );
        console.log(res);
      });
    },
    loginFailure() {
      return swal.fire({
                          title: this.$t("common.login_fail_msg"),
                          icon : 'warning',
                          timer: 1500, 
                          confirmButtonText: this.$t("common.common_close"),
                        })
    },
    async social_login(info) {
      try {
        let resParam = await this.$api(`/faceCallBack`, {info})
        this.$store.commit("user", resParam);
        window.location.reload(true)
        window.location.href=`/?lan_tp=${sessionStorage.get('lan_tp')}`
        // this.$router.push({path: "/", query : {lan_tp : sessionStorage.get('lan_tp')} })
      } catch(err) {
        console.log(err);
      }
    },
    async logout() {
      console.log("facebook logout")
      window.FB.logout(function(response) {
        console.log(response);
        window.location.href = '/auth/logout'
      });
      // window.FB.getLoginStatus(response => {
      //   window.FB.logout(res => {
      //     console.log(res);
      //   });
      //   console.log(response);
      // });
    },
  },
}
</script>