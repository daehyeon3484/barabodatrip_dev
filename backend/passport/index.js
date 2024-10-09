const passport = require('passport');
const WeixinStrategy = require('passport-weixin').Strategy;
const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});
const req = require('../model/database')
const utils = require('../commonUtils');
const session = require('../filestorege/session')


module.exports = (app) => {
  app.use(passport.initialize()); // passport를 초기화 하기 위해서 passport.initialize 미들웨어 사용
  /**
   * weixin
   * web login  
   */
  let resParam = {}
  passport.use('loginByWeixin',new WeixinStrategy({
    clientID: process.env.VUE_APP_QQ_API_KEY,
    clientSecret: process.env.VUE_APP_QQ_SECRET,
    callbackURL: process.env.VUE_APP_QQ_CALLBACK_URL,
    requireState: false,
    scope: 'snsapi_login'
    //scope : 'snsapi_userinfo'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("profile11111111 : ", profile)
      resParam = {}
      const exUser = await req.db("memInfo", [{mem_sns_id : profile._json.openid}]);
      if (!exUser[0]) {
          let memId = await req.db('commSequences', ['MEM','mem_id','10'])
          resParam = {
              mem_id : memId[0].commSeq,
              mem_sns_id : profile._json.openid,
              mem_nick : profile._json.nickname,
              // mem_email: profile._json.nickname,
              mem_nm : profile._json.nickname,
              mem_profile_path : profile._json.headimgurl,
              sns_type : profile.provider,
              mem_token : accessToken,
              use_yn : 'Y',
              reg_date : utils.$dateFormat('filedate')
          }
        await req.db('signUp', resParam)
      } else {
          let memInfos = await req.db('memInfos', [{mem_sns_id : profile._json.openid}]);
          resParam = {
              mem_id : memInfos[0].mem_id,
              mem_sns_id : memInfos[0].mem_sns_id,
              mem_nick : memInfos[0].mem_nick,
              mem_email: memInfos[0].mem_email,
              mem_nm : memInfos[0].mem_nm,
              mem_profile_path : memInfos[0].mem_profile_path,
              sns_type : memInfos[0].sns_type,
              mem_token : memInfos[0].mem_token,
              use_yn : memInfos[0].use_yn,
              reg_date : memInfos[0].reg_date
          }
          console.log("resParam111 : ",resParam)
      }

      done(null, resParam);
    } catch (error) {
      console.error(error);
      done(error);
    }
    return resParam
  }));

  /**
   * weixin
   * mobile login  
   */
  passport.use('loginByWeixinClient',new WeixinStrategy({
    clientID: process.env.VUE_APP_QQ_API_KEY,
    clientSecret: process.env.VUE_APP_QQ_SECRET,
    callbackURL: process.env.VUE_APP_QQ_CALLBACK_URL,
    requireState: false,
    authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
    scope: 'snsapi_userinfo'
  }, async function(accessToken, refreshToken, profile, done){
    console.log("mobile profile : ", profile)
    try {
      resParam = {}
      const exUser = await req.db("memInfo", [{mem_sns_id : profile._json.openid}]);
      if (!exUser[0]) {
          let memId = await req.db('commSequences', ['MEM','mem_id','10'])
          resParam = {
              mem_id : memId[0].commSeq,
              mem_sns_id : profile._json.openid,
              mem_nick : profile._json.nickname,
              // mem_email: profile._json.nickname,
              mem_nm : profile._json.nickname,
              mem_profile_path : profile._json.headimgurl,
              sns_type : profile.provider,
              mem_token : accessToken,
              use_yn : 'Y',
              reg_date : utils.$dateFormat('filedate')
          }
        await req.db('signUp', resParam)
      } else {
          let memInfos = await req.db('memInfos', [{mem_sns_id : profile._json.openid}]);
          resParam = {
              mem_id : memInfos[0].mem_id,
              mem_sns_id : memInfos[0].mem_sns_id,
              mem_nick : memInfos[0].mem_nick,
              mem_email: memInfos[0].mem_email,
              mem_nm : memInfos[0].mem_nm,
              mem_profile_path : memInfos[0].mem_profile_path,
              sns_type : memInfos[0].sns_type,
              mem_token : memInfos[0].mem_token,
              use_yn : memInfos[0].use_yn,
              reg_date : memInfos[0].reg_date
          }
          console.log("resParam111 : ",resParam)
      }
  
      done(null, resParam);
    } catch (error) {
        console.error(error);
        done(error);
    }
    return resParam
  }));
  passport.serializeUser((user,done)=>{ 
      done(null,user);
  });
  passport.deserializeUser((user,done)=>{
      done(null,user);
  });
};