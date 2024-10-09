const request = require('request');
const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});
module.exports = {
  // getAuthorize(){
  //   return new Promise((resolve, reject) => {
  //     request( 
  //       {
  //         headers: {
  //           // 'Authorization': `Bearer ${accessToken}`,
  //           'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  //         },
  //         url: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_SECRET_KEY}&response_type=code&scope=profile,account_email`,
  //         method: 'get',
  //       },
  //       (error, response, body) => {
  //         if (!error && response.statusCode === 200) {
  //           resolve(response);
  //         }
  //         reject(error);
  //       }
  //     );
  //   });
  // },
  // getAccessToken() {
  //   return new Promise((resolve, reject) => {
  //     request( 
  //       {
  //         headers: {
  //           // 'Authorization': `Bearer ${accessToken}`,
  //           'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  //         },
  //         url: `https://kauth.kakao.com/oauth/token`,
  //         data : {
  //           grant_type : authorization_code,
  //           client_id : process.env.VUE_APP_KAKAO_API_KEY,
  //           redirect_uri : process.env.VUE_APP_KAKAO_SECRET_KEY,
  //           // code : 
  //         },
  //         // ?client_id=${process.env.VUE_APP_KAKAO_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_SECRET_KEY}&response_type=code&scope=profile,account_email`,
  //         method: 'post',
  //       },
  //       (error, response, body) => {
  //         if (!error && response.statusCode === 200) {
  //           resolve(response);
  //         }
  //         reject(error);
  //       }
  //     );
  //   });
  // },
  getProfile(accessToken) {
    return new Promise((resolve, reject) => {
      request( 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          url: 'https://kapi.kakao.com/v2/user/me',
          method: 'GET',
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            resolve(body);
          }
          reject(error);
        }
      );
    });
  },
}