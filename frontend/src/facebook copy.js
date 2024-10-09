

// const dotenv = require('dotenv');
// require('../.env')
// dotenv.config('../.env');
console.log(process.env.FACEBOOK_APP_ID,process.env.VUE_APP_I18N_LOCALE)
module.exports = {
    Init : function() {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId      : process.env.VUE_APP_FACEBOOK_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v19.0'
        });
        window.FB.AppEvents.logPageView();
      };
      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
  }
}

