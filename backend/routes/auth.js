const express = require('express');
const jwt = require('jsonwebtoken');
// const kakaoAuth = require('../kakaoauth/kakaoAuth');
const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});
const router = express.Router();
const req = require('../model/database')
const axios = require("axios");
const app = express();
const qs = require('qs')
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const utils = require('../commonUtils');


app.use(session({
  secret : 'secret code',
  resave : false,
  saveUninitialized : false,
  store : new fileStore(),
  cookie : {
      secure : false,
      maxAge : 1000 * 60 * 60 // 쿠키 유효시간 1시간
  }
}));



router.get('/kakao', async (req, res) => {
  try{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_CALLBACK_URL}&response_type=code&scope=profile_nickname,profile_image,account_email`
    res.redirect(kakaoAuthURL);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
});

router.get('/kakao/callback', async(request,res)=>{
  // console.log("callback : ", req.url)
  console.log("callback : ", request)
  try{
    token = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers : {
        'Content-type':'application/x-www-form-urlencoded;charset=utf-8'
      },
      data:{//객체를 string 으로 변환
          grant_type: 'authorization_code',//특정 스트링
          client_id : process.env.VUE_APP_KAKAO_API_KEY,
          redirect_uri : process.env.VUE_APP_KAKAO_CALLBACK_URL,
          client_secret : process.env.VUE_APP_KAKAO_SECRET_KEY,
          code : request.query.code,
      }
    })
    // request.session.key = token.data.access_token
    
  }catch(err){
    res.json(err.data);
  }
  
  let user;
  try{
      user = await axios({
          method:'get',
          url:'https://kapi.kakao.com/v2/user/me',
          headers: {
            'Authorization': `Bearer ${token.data.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
      })
  }catch(e){
      res.json(e.data);
  }
  
  console.log("user1111111111111:",token.data);
  console.log("user11111111111112:",user.data);
  let resParam = {}
  const exUser = await req.db("memInfo", [{mem_email : user.data.kakao_account.email}]);
  if (!exUser[0]) {
    let memId = await req.db('commSequences', ['MEM','mem_id','10'])
    resParam = {
        mem_id : memId[0].commSeq,
        mem_sns_id : user.data.id,
        mem_nick : user.data.kakao_account.profile.nickname,
        mem_email: user.data.kakao_account.email,
        mem_nm : user.data.kakao_account.profile.nickname,
        mem_profile_path : user.data.kakao_account.profile.thumbnail_image_url,
        sns_type : 'kakao',
        mem_token : token.data.access_token,
        use_yn : 'Y',
        reg_date : utils.$dateFormat('filedate') 
      }
    
    await req.db('signUp', resParam)
  }
  const query = qs.stringify(resParam)
  // req.session.kakao = user.data; 
  // const session = request.session;
  // console.log("session : ",session)
  // for(let key in resParam) {
  //   request.session[key] = resParam[key]
  //   console.log(request.session[key])
  // }
  // request.session.save(function () {
    res.status(200).redirect(process.env.VUE_TRIP_WEB_URL)+'/loginResult?'+query;
  // });
})

router.get('/logout', async(request,res) => {
  await axios({
      method: 'post',
      url : 'https://kapi.kakao.com/v1/user/logout',
      headers : {
        'Authorization': `Bearer ${req.body.mem_token}`,
      }
  }).then(response => {

  }).catch (error => {
      console.log("catch error : ",error)        
  })
})


module.exports = router;