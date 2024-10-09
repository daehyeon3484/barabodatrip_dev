const request = require('request');
const axios = require("axios");
module.exports = {
    async getAuthorize(){
      let url 
      await axios({
        url: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_SECRET_KEY}&response_type=code&scope=profile,account_email`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        method : 'GET'
      }).then(response => {
        response.status(200).redirect(url)
      }).catch(err => {
        err
      })
    }
}
