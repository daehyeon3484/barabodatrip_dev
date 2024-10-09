const cors = require('cors');
const express = require('express');
const axios = require("axios");
const app = express();
const session = require('express-session');
const router = express.Router();
const fileStore = require('session-file-store')(session);
const dotenv = require("dotenv");
const utils = require('./commonUtils.js');
const bodyParser = require('body-parser');
const schedule = require('node-schedule')
const iconv = require('iconv-lite');
const testdate = utils.$dateFormat('filedate')
const passport = require('passport');
const WeixinStrategy = require('passport-weixin').Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const path = require("path");
const multer = require('multer');
const req = require('./model/database.js')
const jwt = require('jsonwebtoken');
const {generateSessionStorage} = require('./storage')
const sessionStorage = generateSessionStorage()
const qs = require('qs');
dotenv.config({path: './.server.env'});
app.use(express.static(path.join(process.env.VUE_APP_STATIC_FILE_PATH)));
const log = require('./config/logger.js')
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.text());
const StringDecoder = require('string_decoder').StringDecoder;
const http = require('http');
const querystring = require('node:querystring');
const nodemailer = require('nodemailer');
const requestIp = require("request-ip");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {GoogleAuth} = require('google-auth-library');
const sysdate = utils.$randomFile()
const headers = { //Post요청에 보낼 Header
    "Access-Control-Allow-Origin": '*',
    "Content-Type": "application/json"
}
// 서버 리스타트 안해도 되는 로직
const fs = require('fs');
/*
let corsOptions = {
	origin: "https://naver.com", // 출처 허용 옵션
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  };
*/
const corsOptions = {
  origin: true, // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
};

app.use(cors(corsOptions));
// 세션 정의 
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
app.use(function(request, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

// json 형식으로 파라미터 받는 로직
app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({ extended: true }));


const server = app.listen(3001,() => {
    console.log('Server client Started port 3001');
});

let sql = require('./sql.js');
const { URLSearchParams } = require('url');

// 서버 리스타트 안해도 되는 로직
fs.watchFile(__dirname + '/sql.js', (curr,prev) => {
    console.log('sql 변경시 재시작 없이 반영되도록 함.');
    delete require.cache[require.resolve('./sql.js')];
    sql = require('./sql.js');
});
const upload = multer({
    storage: multer.diskStorage({
        // 저장할 장소
        destination(req, file, cb) {
            const params = req.params
            console.log("params : ", req.params)
            let dir = process.env.VUE_APP_FILE_PATH+`\/${params.category}/${params.filepath}/${params.prod_id}/${params.mem_id}/${params.cart_id}/${params.mem_type}/${params.file_type}/${params.sort_order}`
            console.log("upload dir : ", dir)
            if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) 
            cb(null, dir);
        },
    // 저장할 이미지의 파일명
        filename(req, file, cb) {
            // console.log("file : ", file)
            const ext = path.extname(Buffer.from(file.originalname, 'latin1').toString('utf8')); // 파일의 확장자
            // 파일명이 절대 겹치지 않도록 해줘야한다.
            // 파일이름 + 현재시간밀리초 + 파일확장자명
            // const sysdate = utils.$dateFormat('filedate')
            const sysdate = utils.$randomFile()
            // console.log("sysdate : ", sysdate)
            // cb(null, path.basename(Buffer.from(file.originalname, 'latin1').toString('utf8'), ext)+"_" + sysdate + ext)
            cb(null, path.basename(sysdate + ext))
            console.log(Buffer.from(file.originalname, 'latin1').toString('utf8'))
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

const eventUpload = multer({
    storage: multer.diskStorage({
        // 저장할 장소
        destination(req, file, cb) {
            const params = req.params
            let dir = process.env.VUE_APP_FILE_PATH+`\/${params.category}/${params.categoryType}/${params.filepath}/${params.event_id}/${params.mem_id}/${params.type}/${params.sort_seq}`
            // let rogData = {
            //     sysnm : "이벤트 업로드",
            //     params : params,
            //     dir : dir,
            // }
            // log.info("[이벤트 업로드]", rogData)
            if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            cb(null, dir);
        },
    // 저장할 이미지의 파일명
        filename(req, file, cb) {
            const ext = path.extname(Buffer.from(file.originalname, 'latin1').toString('utf8')); // 파일의 확장자
            const sysdate = utils.$randomFile()
            cb(null, path.basename(sysdate + ext))
            console.log(Buffer.from(file.originalname, 'latin1').toString('utf8'))
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});
//========================================설정 부분================================================//


// passport 카카오톡 로그인
// ===================================카카오로그인 구현 스타트============================================/
let resParam = {}
let lanTp = ""
app.get('/auth/kakao', async (req, res) => {    	
    console.log("/auth/kakao")
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
  
  app.get('/auth/kakao/callback', async(request,res)=>{
    console.log("callback : ", request.query)
    let rogData = {
        sysnm : "kakao 카카오톡 로그인",
    }
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
      log.error("kakao error1 : ", {errnm : "kakao error1", err : err.data})
      res.json(err.data);
    }
    resParam = {}
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
	    log.error("kakao error2 : ", {errnm : "kakao error2", err : e.data})
      res.json(e.data);
    }
    const exUser = await req.db("memInfos", [user.data.kakao_account.email]);
    rogData = Object.assign(rogData, {memInfos : exUser[0]})    
    let ip = requestIp.getClientIp(request)
    let os_tp = utils.$MobileDetect(request.headers['user-agent'])
    let reg_date = utils.$dateFormat('filedate') 
    if (!exUser[0]){
        let memId = utils.$randomString1()
        console.log("token.data : ",token.data)
        resParam = {
            mem_id : memId,
            mem_nick : user.data.kakao_account.profile.nickname,
            mem_nm : user.data.kakao_account.profile.nickname,
            mem_profile_path : user.data.kakao_account.profile.thumbnail_image_url,
            sns_type : 'kakao',
            mem_token : token.data.access_token,
            use_yn : 'Y',
            ip : ip,
            admin_yn : user.data.kakao_account.email == "sky3662@nate.com" ? "Y" : "N",
            os_tp : os_tp == true ? 'mobile' : 'web',
            last_login_date : reg_date,
            reg_date : reg_date
        }
        let resTempParam = {
          mem_id : memId,
          mem_nick : user.data.kakao_account.profile.nickname,
          mem_nm : user.data.kakao_account.profile.nickname,
          mem_profile_path : user.data.kakao_account.profile.thumbnail_image_url,
          sns_type : 'kakao',
          mem_email: user.data.kakao_account.email,
          mem_sns_id : user.data.id,
          refresh_token : token.data.refresh_token,
          refresh_token_expires_in : token.data.refresh_token_expires_in,
          expires_in : token.data.expires_in,
          mem_token : token.data.access_token,
          use_yn : 'Y',
          ip : ip,
          admin_yn : user.data.kakao_account.email == "sky3662@nate.com" ? "Y" : "N",
          os_tp : os_tp == true ? 'mobile' : 'web',
          last_login_date : reg_date,
          reg_date : reg_date
        }
	      const {error} = await req.db('signUp', resTempParam)
        log.info("signUp : ", {signUp  : resTempParam})
        if(error) {
          log.info("kakao signUp error :", {error : error})
        }    
    } else {
      
      resParam = {
        mem_id : exUser[0].mem_id,
        mem_nick : exUser[0].mem_nick,
        mem_nm : exUser[0].mem_nm,
        mem_profile_path : exUser[0].mem_profile_path,
        sns_type : exUser[0].sns_type,
        mem_token : token.data.access_token,
        use_yn : exUser[0].use_yn,
        admin_yn : exUser[0].admin_yn,
        ip : ip,
        os_tp : os_tp == true ? 'mobile' : 'web',
        last_login_date : reg_date,
        reg_date : exUser[0].reg_date 
      }
    
      await req.db('loginHisUpdate', [
        {
          ip : ip, 
          os_tp : os_tp, 
          last_login_date : reg_date,
          refresh_token : token.data.refresh_token,
          refresh_token_expires_in : token.data.refresh_token_expires_in,
          expires_in : token.data.expires_in
        }, exUser[0].mem_email])
    }
    
    // resParam = Object.assign(resParam, { lan_tp: lanTp });
    const query = qs.stringify(resParam)
    console.log(query)
    let url = `${process.env.VUE_TRIP_WEB_URL}\/loginResult?${query}`
    
    request.session.user = {
        mem_id : resParam.mem_id,
        mem_nick : user.data.kakao_account.profile.nickname,
        mem_nm : user.data.kakao_account.profile.nickname,
        mem_profile_path : user.data.kakao_account.profile.thumbnail_image_url,
        sns_type : 'kakao',
        // mem_token : token.data.access_token,
        use_yn : 'Y',
        ip : ip,
        os_tp : os_tp == true ? 'mobile' : 'web',
        last_login_date : reg_date,
        reg_date : utils.$dateFormat('filedate') 
    }
    rogData = Object.assign(rogData, {resParam : resParam})
    log.info("[passport 카카오톡 로그인 완료]", rogData)
    //console.log("request.session key : ",request.session)
    request.session.save(function () {
        res.status(200).redirect(url);
    });
  })
  
//   router.get('/logout', async(request,res) => {
//     await axios({
//         method: 'post',
//         url : 'https://kapi.kakao.com/v1/user/logout',
//         headers : {
//           'Authorization': `Bearer ${req.body.mem_token}`,
//         }
//     }).then(response => {
  
//     }).catch (error => {
//         console.log("catch error : ",error)        
//     })
//   })
  
  
// ===================================카카오로그인 구현 끝============================================/

// ===================================QQ로그인 구현 스타트============================================/
/**
 * weixin
 * web login  
*/
passport.use('loginByWeixin',new WeixinStrategy({
    clientID: process.env.VUE_APP_QQ_API_KEY,
    clientSecret: process.env.VUE_APP_QQ_SECRET,
    callbackURL: process.env.VUE_APP_QQ_W_CALLBACK_URL,
    requireState: false, 
    scope: 'snsapi_login'
    //scope : 'snsapi_userinfo'
  }, async function(accessToken, refreshToken, profile, done){
    try {
      let rogData = {
        sysnm : "loginByWeixin 로그인",
      }
      resParam = {}
      const exUser = await req.db("memInfo", [profile._json.openid]);
      rogData = Object.assign(rogData, {memInfo : exUser[0]})	
      let reg_date = utils.$dateFormat('filedate')
      if (!exUser[0]) {
          // let memId = await req.db('commSequences', ['MEM','mem_id','10'])
          let memId = utils.$randomString1()
          resParam = {
              mem_id : memId,
              mem_sns_id : profile._json.openid,
              mem_nick : profile._json.nickname,
              // mem_email: profile._json.nickname,
              mem_nm : profile._json.nickname,
              mem_profile_path : profile._json.headimgurl,
              sns_type : profile.provider,
              mem_token : accessToken,
              use_yn : 'Y',
              last_login_date : reg_date,
              reg_date : reg_date
          }
	        const {error} = await req.db('signUp', resParam)
          if(error) {
            log.info("wexin signUp error :", {error : error})
          } else {
            log.info("signUp : ", {signUp  : resParam})
          }
       
      } else {
          resParam = {
              mem_id : exUser[0].mem_id,
              mem_sns_id : exUser[0].mem_sns_id,
              mem_nick : exUser[0].mem_nick,
              mem_email: exUser[0].mem_email,
              mem_nm : exUser[0].mem_nm,
              mem_profile_path : exUser[0].mem_profile_path,
              sns_type : exUser[0].sns_type,
              mem_token : exUser[0].mem_token,
              use_yn : exUser[0].use_yn,
              last_login_date : reg_date,
              reg_date : exUser[0].reg_date 
          }
      }
      resParam = Object.assign(resParam, { lan_tp: 'CHN' });
      rogData = Object.assign(rogData, {resParam : resParam})
      log.info("[wexin 로그인 완료]", rogData)
            
      done(null, resParam);
    } catch (error) {
        console.error(error);
        done(error);
    }
}));

/**
 * weixin
 * mobile login
 */
// passport.use('loginByWeixinClient',new WeixinStrategy({
//   clientID: process.env.VUE_APP_QQ_API_KEY,
//   clientSecret: process.env.VUE_APP_QQ_SECRET,
//   callbackURL: process.env.VUE_APP_QQ_M_CALLBACK_URL,
//   requireState: false,
//   authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
//   scope: 'snsapi_userinfo'
// }, async function(accessToken, refreshToken, profile, done){
//   try {
//     resParam = {}    
//     const exUser = await req.db("memInfo", [{mem_sns_id : profile._json.openid}]);
//     let reg_date = utils.$dateFormat('filedate')
//     if (!exUser[0]) {
//         let memId = await req.db('commSequences', ['MEM','mem_id','10'])
//         resParam = {
//             mem_id : memId[0].commSeq,
//             mem_sns_id : profile._json.openid,
//             mem_nick : profile._json.nickname,
//             // mem_email: profile._json.nickname,
//             mem_nm : profile._json.nickname,
//             mem_profile_path : profile._json.headimgurl,
//             sns_type : profile.provider,
//             mem_token : accessToken,
//             use_yn : 'Y',
//             last_login_date : reg_date,
//             reg_date : reg_date
//         }
//       await req.db('signUp', resParam)
//     } else {
//         let memInfos = await req.db('memInfos', [{mem_sns_id : profile._json.openid}]);
//         resParam = {
//             mem_id : memInfos[0].mem_id,
//             mem_sns_id : memInfos[0].mem_sns_id,
//             mem_nick : memInfos[0].mem_nick,
//             mem_email: memInfos[0].mem_email,
//             mem_nm : memInfos[0].mem_nm,
//             mem_profile_path : memInfos[0].mem_profile_path,
//             sns_type : memInfos[0].sns_type,
//             mem_token : memInfos[0].mem_token,
//             use_yn : memInfos[0].use_yn,
//             last_login_date : reg_date,
//             reg_date : memInfos[0].reg_date
//         }
//     }

//     done(null, resParam);
//   } catch (error) {
//       console.error(error);
//       done(error);
//   }
// }));

passport.serializeUser((user,done)=>{ 
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    done(null,user);
});

/**
 * weixin
 * web login
 */
app.get("/auth/web/qq", passport.authenticate('loginByWeixin'));

app.get('/auth/web/qq/callback', passport.authenticate('loginByWeixin', {
    failureRedirect : process.env.VUE_TRIP_WEB_URL+'/login',
    //successRedirect : (process.env.VUE_TRIP_WEB_URL+"/?"+query)
}), async(request, res) => {
  let ip = requestIp.getClientIp(request)
  let os_tp = utils.$MobileDetect(request.headers['user-agent'])
  resParam = Object.assign(resParam, {ip : ip})
  resParam = Object.assign(resParam, {os_tp : os_tp})
  const query = qs.stringify(resParam)
	request.session.user = {
      mem_id : resParam.mem_id,
      mem_sns_id : resParam.mem_sns_id,
      mem_nick : resParam.mem_nick,
      mem_email: resParam.mem_email,
      mem_nm : resParam.mem_nm,
      mem_profile_path : resParam.mem_profile_path,
      sns_type : resParam.sns_type,
      mem_token : resParam.mem_token,
      ip : ip,
      os_tp : os_tp == true ? 'mobile' : 'web',
      use_yn : 'Y',
      last_login_date : resParam.last_login_date,
      reg_date : resParam.reg_date
  }
  await req.db('loginUpdate', [{ip : ip,os_tp : os_tp, last_login_date : resParam.last_login_date}, resParam.mem_sns_id])
  console.log("request.session key : ",request.session)
  request.session.save(function () {
      res.status(200).redirect(process.env.VUE_TRIP_WEB_URL+'/loginResult?'+query);
  });

})


// ===================================QQ로그인 구현 끝============================================/

// ===================================google로그인 구현 끝============================================/

app.get('/auth/google', async (request, res) =>{
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
      url += `?client_id=${process.env.VUE_APP_GOOGLE_API_KEY}`
      url += `&redirect_uri=${process.env.VUE_APP_GOOGLE_REDIRECT_URL}`
      url += '&response_type=code'
      url += '&scope=email profile'
    res.redirect(url);
})

app.get('/oauth/google/callback', async (request, res) => {
  console.log("============================google callback=====================")
//  console.log("request :" , request.query.code)
//  console.log("request query : ", request.quest)
  const { code } = request.query;
  console.log("============================start===============================")
  console.log("code : ", code)
  const token = await axios.post(process.env.VUE_APP_GOOGLE_TOKEN_URL, {
       // x-www-form-urlencoded(body)
       code : request.query.code,
       client_id: process.env.VUE_APP_GOOGLE_API_KEY,
       client_secret: process.env.VUE_APP_GOOGLE_SECRET_KEY,
       redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URL,
       grant_type: 'authorization_code',
  });
        console.log("resp : ", token.data.access_token)

//  res.send('ok')

  const resp2 = await axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        headers: {
            Authorization: `Bearer ${token.data.access_token}`,
        },
  });
  const exUser = await req.db("memInfos", [resp2.data.email]);
  let ip = requestIp.getClientIp(request)
  let os_tp = utils.$MobileDetect(request.headers['user-agent'])
  let reg_date = utils.$dateFormat('filedate')
  if (!exUser[0]){
      // let memId = await req.db('commSequences', ['MEM','mem_id','10'])
      let memId = utils.$randomString1()
      resParam = {
        mem_id : memId,
        mem_nick : '',
        mem_nm : '',
        mem_profile_path : '',
        sns_type : 'google',
        mem_token : '',
        use_yn : 'Y',
        ip : ip,
        admin_yn : resp2.data.email == "barabodatrips@gmail.com" ? "Y" : "N",
        os_tp : os_tp == true ? 'mobile' : 'web',
        last_login_date : reg_date,
        reg_date : reg_date
      }
      console.log('resParam', resParam)
      let resTempParam = {
        mem_id : memId[0].commSeq,
//        mem_nick : user.data.kakao_account.profile.nickname,
//          mem_nm : user.data.kakao_account.profile.nickname,
//          mem_profile_path : user.data.kakao_account.profile.thumbnail_image_url,
          sns_type : 'google',
          mem_email: resp2.data.email,
          mem_sns_id : resp2.data.user_id,
//          refresh_token : token.data.refresh_token,
//          refresh_token_expires_in : token.data.refresh_token_expires_in,
          expires_in : resp2.data.expires_in,
          mem_token : token.data.access_token,
          use_yn : 'Y',
          ip : ip,
          admin_yn : resp2.data.email == "barabodatrips@gmail.com" ? "Y" : "N",
          os_tp : os_tp == true ? 'mobile' : 'web',
          last_login_date : reg_date,
          reg_date : reg_date
      }
      console.log('resTemp : ', resTempParam)
      const {error} = await req.db('signUp', resTempParam)

      if(error) {
        console.log("google signUp error :", error)
      }
  } else {
    resParam = {
      mem_id : exUser[0].mem_id,
      mem_nick : exUser[0].mem_nick,
      mem_nm : exUser[0].mem_nm,
      mem_profile_path : exUser[0].mem_profile_path,
      sns_type : exUser[0].sns_type,
      mem_token : token.data.access_token,
      use_yn : exUser[0].use_yn,
      admin_yn : exUser[0].admin_yn,
      ip : ip,
      os_tp : os_tp == true ? 'mobile' : 'web',
      last_login_date : reg_date,
      reg_date : exUser[0].reg_date
    }

    await req.db('loginHisUpdate', [
        {
          ip : ip,
          os_tp : os_tp,
          last_login_date : reg_date,
//          refresh_token : token.data.refresh_token,
//          refresh_token_expires_in : token.data.refresh_token_expires_in,
          expires_in : token.data.expires_in
        }, exUser[0].mem_email])
    }
    const query = qs.stringify(resParam)
    console.log(query)
    request.session.user = {
      mem_id : resParam.mem_id,
      mem_nick : resParam.mem_nick,
      mem_nm : resParam.mem_nm,
      mem_profile_path : resParam.mem_profile_path,
      sns_type : 'google',
      mem_token : token.data.access_token,
      use_yn : 'Y',
      ip : ip,
      os_tp : os_tp == true ? 'mobile' : 'web',
      last_login_date : reg_date,
      reg_date : utils.$dateFormat('filedate')
  }
  request.session.save(function () {
      res.status(200).redirect(process.env.VUE_TRIP_WEB_URL+'/loginResult?'+query);
  });
})
// ===================================google 로그인 끝 ============================================/
// ===================================facebodd 로그인 구현 ============================================/
app.post('/faceCallBack', async (request, res) =>{
  console.log("facebook login : ")
  let info = request.body.info
  let logData = {
    title : "facebook callback"
  }
  log.info('facebook callback', {title : 'facebook callback'})
  try {
    const exUser = await req.db("memInfos", [info.email])
    log.info("memInfos", exUser[0])
    logData = Object.assign(logData, {userInfo : exUser[0]})
    let resParam = {}
    let ip = requestIp.getClientIp(request)
    let os_tp = utils.$MobileDetect(request.headers['user-agent'])
    let reg_date = utils.$dateFormat('filedate')
    console.log("memInfos", exUser[0])
    if (!exUser[0]) {
      // let memId = await req.db('commSequences',  ['MEM','mem_id','10'])
      let memId = utils.$randomString1()
      resParam = {
        mem_id : memId,
        mem_sns_id : info.id,
        mem_nick : info.name,
        mem_email: info.email,
        mem_nm : info.name,
        mem_profile_path : info.profileIMG,
        sns_type : 'facebook',
        mem_token : info.accessToken,
        use_yn : 'Y',
        ip : ip,
        os_tp : os_tp == true ? 'mobile' : 'web',
        last_login_date : reg_date,
        reg_date : reg_date
      }
      await req.db('signUp', resParam)
    } else {
      console.log("memInfos", exUser[0].mem_id)
      resParam = {
        mem_id : exUser[0].mem_id,
        mem_sns_id : exUser[0].mem_sns_id,
        mem_nick : exUser[0].mem_nick,
        mem_email: exUser[0].mem_email,
        mem_nm : exUser[0].mem_nm,
        mem_profile_path : exUser[0].mem_profile_path,
        sns_type : exUser[0].sns_type,
        mem_token : info.accessToken,
        use_yn : exUser[0].use_yn,
        ip : ip,
        os_tp : os_tp == true ? 'mobile' : 'web',
        last_login_date : reg_date,
        reg_date : exUser[0].reg_date
      }
      console.log("loginHisUpdate", resParam)
      await req.db('loginHisUpdate', [{ip : ip, os_tp : os_tp, last_login_date : reg_date, mem_token : info.accessToken}, resParam.mem_email])
    }
    log.info("resParam", {result : resParam})
    logData = Object.assign(logData, {result : resParam})
    log.info("facebook callback end", {logData : logData})
    request.session.user = {
      mem_id : resParam.mem_id,
      mem_sns_id : resParam.mem_sns_id,
      mem_nick : resParam.mem_nick,
      mem_email: resParam.mem_email,
      mem_nm : resParam.mem_nm,
      mem_profile_path : resParam.mem_profile_path,
      sns_type : resParam.sns_type,
      mem_token : resParam.mem_token,
      ip : resParam.ip,
      os_tp : resParam.os_tp,
      use_yn : 'Y',
      last_login_date : reg_date,
      reg_date : resParam.reg_date
    }
    request.session.save(function () {
      res.status(200).send(resParam)
    });
  } catch (err) {
    log.error('facebook callback err', {title : 'facebook callback err', error : err})
    res.send({
        error: "DB access error"
    })
  }
});
// ===================================facebodd 로그인 구현 끝 ============================================//

// ===================================facebodd 메신져 구현 시작 ============================================//
app.post('/snsFacebook', async (request, res) =>{
  let info = request.body.data
  console.log("info : ",info)
  // let url = `https://graph.facebook.com/v19.0/${info.mem_id}/accounts?access_token=${info.mem_token}`
  let url = `https://graph.facebook.com/v19.0/134488499695800/accounts?access_token=EAALU0pedUZBUBOzhE1teZAXoxdqPrcBr7Xdobcj57bgdeTcsLk1fSLCQndF8MqSuNrpTz2V9CUlP7EhFuWMAlQH3ep4KFr4IG6OEDiDkYlby109aKiZAck9EheZBd4MTs9PTCxyDsZCnZB3TtH7fpXlqAXsafoZCdGCDkQncYboLJkl9ric32JPofaaTXOZBEk0pKheLdy8SURnxt0TDZBqdzQKcueAZDZD`
  let header = {
    "Content-Type" : "application/json"
  }
  await axios({
    method: 'get',
    url,
    header
}).then(response => {
  console.log("response : ", res.data)
  
}).catch(err => {
    err
})

})

// ===================================facebodd 메신져 구현 끝 ============================================//



// ===================================mobile 중국 로그인 구현 시작 ============================================//
app.post('/join', async (request, res) =>{
  let info = request.body.info
  let ip = requestIp.getClientIp(request)
  let os_tp = utils.$MobileDetect(request.headers['user-agent'])
  let reg_date = utils.$dateFormat('filedate')
  let logData = {
    title : "join callback",
    id : 'join',
    requestParam  :info,
  }
  try {
    console.log("info : ", info)
    // 암호화
    const { iv, encryptedData } = utils.$encrypt(info.mem_password, process.env.VUE_APP_JWT_SECRET)
    // 복호화
    // let decryptData = utils.$decrypt(encryptedData, process.env.VUE_APP_JWT_SECRET,iv)
    // console.log("decryptData : ",decryptData)
    logData = Object.assign(logData, {iv : iv, encryptedData : encryptedData})
    // let memId = await req.db('commSequences',  ['MEM','mem_id','10'])
    let memId = utils.$randomString1()
    
    let resParam = {
      mem_id : memId,
      mem_sns_id : "",
      mem_nick : info.mem_nm,
      mem_email: info.mem_email,
      mem_tel : info.mem_tel,
      mem_nm : info.mem_nm,
      mem_password : info.mem_password,
      mem_scpd : encryptedData,
      iv : iv,
      company_type : info.company_type,
      mem_profile_path : "",
      sns_type : 'join',
      mem_token : "",
      use_yn : "Y",
      ip : ip,
      os_tp : os_tp == true ? 'mobile' : 'web',
      last_login_date : reg_date,
      reg_date : reg_date
    }
    console.log("resParma : ", resParam)
    await req.db('signUp', resParam)
    logData = Object.assign(logData, {result : resParam})
    log.info(logData)
    res.status(200).send({msg : 'success'})
  } catch (err) {
    console.log("err : ", err)
    log.error('join callback err', {title : 'join callback err', error : err})
    res.send({
        error: "DB access error"
    })
  }
});
app.post('/memChk', async (request, res) =>{
  try {
    let info = request.body.info
    let logData = {
      title : 'id 중복체크',
      id : 'memChk',
      requestParam : info
    }
    let memInfo = await req.db('memChk', [info.mem_email, info.mem_password])
    let infos = memInfo[0]
    logData = Object.assign(logData, {memChk : infos})
    if(memInfo[0]) {
      let decryptData = utils.$decrypt(infos.mem_scpd, process.env.VUE_APP_JWT_SECRET,infos.iv)
      logData = Object.assign(decryptData, {decryptData : decryptData, mem_password : info.mem_password})
      log.info(logData)
      if(info.mem_password == decryptData) {
        res.status(200).send({msg : 'success'})
      } else {
        res.status(200).send({msg : 'fail'})
      }
    } else {
      res.status(200).send({msg : 'fail'})
    }
  } catch (err) {
    console.log("err : ", err)
    log.error('memChk err', {title : 'memChk err', error : err})
    res.send({
        error: "DB access error"
    })
  }
})
app.post('/memChk/join', async (request, res) =>{
  try {
    let info = request.body.info
    let logData = {
      title : 'id 중복체크',
      id : 'joinMemChk',
      requestParam : info
    }
    let memInfo = await req.db('joinMemChk', [info.mem_email])
    let infos = memInfo[0]
    console.log("memInfo : ", infos.memCnt)
    // logData = Object.assign(logData, {joinMemChk : infos})
    if(infos.memCnt < 1) {
      log.info(logData)
      res.status(200).send({msg : 'success'})
    } else {
      res.status(200).send({msg : 'duplication'})
    }
  } catch (err) {
    console.log("err : ", err)
    log.error('joinMemChk err', {title : 'joinMemChk err', error : err})
    res.send({
        error: "DB access error"
    })
  }
})
app.post('/loginCallback', async (request, res) =>{
  try {
    let info = request.body.info
    let logData = {
      title : "login callback",
      id : 'loginCallback',
      requestParam : info
    }
    let ip = requestIp.getClientIp(request)
    let os_tp = utils.$MobileDetect(request.headers['user-agent'])
    console.log("info : ", info)
    let loginInfo = await req.db('memInfos', [info.mem_email])
    let infos = loginInfo[0]
    let mod_date = utils.$dateFormat('filedate')
    logData = Object.assign(logData, {loginInfo : infos})
    
    let resParam = {
      mem_id : infos.mem_id,
      mem_sns_id : infos.mem_sns_id,
      mem_nick : infos.mem_nm,
      mem_email: infos.mem_email,
      mem_nm : infos.mem_nm,
      mem_profile_path : "",
      sns_type : infos.sns_type,
      company_type : infos.company_type,
      mem_token : "",
      use_yn : "Y",
      ip : ip,
      os_tp : os_tp == true ? 'mobile' : 'web',
      last_login_date : mod_date,
      mod_date : mod_date
    }
    
    console.log("resParma : ", resParam)
    await req.db('loginHisUpdate', [{ip : ip, os_tp : os_tp, company_type : info.company_type,last_login_date : mod_date}, infos.mem_email])
    logData = Object.assign(logData, {result : resParam})
    request.session.user = {
      mem_id : resParam.mem_id,
      mem_sns_id : resParam.mem_sns_id,
      mem_nick : resParam.mem_nick,
      mem_email: resParam.mem_email,
      mem_nm : resParam.mem_nm,
      mem_profile_path : resParam.mem_profile_path,
      sns_type : resParam.sns_type,
      mem_token : resParam.mem_token,
      ip : resParam.ip,
      os_tp : resParam.os_tp,
      use_yn : 'Y',
      last_login_date : mod_date,
      mod_date : resParam.mod_date
    }
    log.info(logData)
    request.session.save(function () {
      res.status(200).send(resParam)
    });
  } catch (err) {
    console.log("err : ", err)
    log.error('login callback err', {title : 'login callback err', error : err})
    res.send({
        error: "DB access error"
    })
  }
})
app.post('/findChk', async (request, res) =>{
  try {
    let info = request.body.info
    let logData = {
      title : 'id pw 찾기',
      id : 'findChk',
      requestParam : info
    }
    if(info.type == 'idchk') {
      let data = await req.db('idFind', [info.mem_nm, info.mem_tel])
      console.log(data.length, data[0])
      logData = Object.assign(logData, {idFind : data})
      let memInfo = data[0]
      let param = {}
      if(data.length > 0) {
        param = {
          resdata : memInfo.mem_email,
          msg : 'success'
        }
        console.log("param : ", param)
      } else {
        param = {
          resdata : "", msg : 'fail'
        }
      }
      logData = Object.assign(logData, {type : 'idchk',resParam : param})
      log.info(logData)
      res.status(200).send(param)
    } else {
      let data = await req.db('passwordFind', [info.mem_nm, info.mem_tel, info.mem_email])
      logData = Object.assign(logData, {passwordFind : data})
      let memInfo = data[0]
      if(data.length > 0) {
        param = {
          resdata : memInfo.mem_password,
          msg : 'success'
        }
      } else {
        param = {
          resdata : "", msg : 'fail'
        }
      }
      logData = Object.assign(logData, {type : 'pwChk',resParam : param})
      log.info(logData)
      res.status(200).send(param)
    }
  } catch (err) {
    console.log("err : ", err)
    log.error('findChk err', {title : 'findChk err', error : err})
    res.send({
        error: "DB access error"
    })
  }

})

// ===================================mobile 중국 로그인 구현 끝 ============================================//

app.get('/auth/logout', async (req, res) =>{
    req.session.destroy();
    res.status(200).redirect(process.env.VUE_TRIP_WEB_URL+'/loginout')
});

app.post('/auth/:snsType/logout', async (req, res) =>{
  let data = req.body.info
  await axios({
    method: 'post',
    url : 'https://kapi.kakao.com/v1/user/logout',
    headers : {
      'Authorization': `Bearer ${data.mem_token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
  }).then(response => {
    req.session.destroy();
    res.send("success")
  }).catch (error => {
      console.log("catch error : ",error)        
  })
});

app.post('/upload/:category/:categoryType/:filepath/:event_id/:mem_id/:type/:sort_seq/:regType/:fileId', eventUpload.single('img'), async (request, res) => {
    // 이벤트 파일 업로드
    // console.log('전달받은 파일', req.file);
    // console.log('저장된 파일의 이름', req.file.filename);

    // // 파일이 저장된 경로를 클라이언트에게 반환해준다.
    // /upload/:filepath/:prodId/:type/:fileId/:fileName
    const param = request.params
    console.log("param : ", param)
    
    let paramData = {
      event_mem_file_id : utils.$randomFile(),
      event_id: param.event_id,
      mem_id : param.mem_id,
      file_type: param.type,
      file_path: param.filepath,
      file_name: request.file.filename,
      origin_file_name: Buffer.from(request.file.originalname, 'latin1').toString('utf8'),
      sort_order : param.sort_seq,
      reg_date : utils.$dateFormat('filedate')
    }
    if(param.regType == "REGISTER") {
      const {error} = await req.db('eventPassPortIsert', [paramData]);
      if(error) {
        log.error("eventPassPortIsert : ", {title : "이벤트 파일 업로드", sysnm : "eventPassPortIsert", error : error, logData : logData})
      }
    } else {
      const {error} =await req.db("eventPassPortUpdate", [
                {
                  file_type : param.type,
                  file_path : param.filepath,
                  file_name: request.file.filename,
                  origin_file_name: Buffer.from(request.file.originalname, 'latin1').toString('utf8'),
                  mod_date : utils.$dateFormat('filedate')
                },
                param.fileId
      ]);
      if(error) {
        log.error("eventPassPortUpdate : ", {title : "이벤트 파일 업로드", sysnm : "eventPassPortUpdate", error : error})
      }
    }
    res.status(200).send('ok')
});
// app.post('/upload/:category/:filepath/:prod_id/:mem_id/:cart_id/:file_type/:sort_order/:reg_type/:mem_type/:file_id', upload.single('img'), async (request, res) => {
app.post('/upload/:category/:filepath/:prod_id/:mem_id/:cart_id/:file_type/:sort_order/:reg_type/:mem_type/:file_id', upload.array('img',10), async (request, res) => {
  let info = request.params
  for(const files of request.files) {
    let paramData = {
        mem_file_id : utils.$randomFile(),
        prod_id: info.prod_id,
        mem_id : info.mem_id,
        cart_id : info.cart_id,
        file_type: info.file_type,
        mem_type: info.mem_type,
        file_path: info.filepath,
        file_name: files.filename,
        origin_file_name: Buffer.from(files.originalname, 'latin1').toString('utf8'),
        sort_order : info.sort_order,
        reg_date : utils.$dateFormat('filedate')
    }
    // if(info.reg_type == "REGISTER") {
    const {error} = req.db('passportImageInsert', [paramData]);
    if(error) {
      log.error("passportImageInsert : ", {title : "이미지 업로드", sysnm : "passportImageInsert", error : error})
    }
  }
  res.status(200).send('ok')
})

// app.post('/upload/:category/:filepath/:prod_id/:mem_id/:cart_id/:type/:sort_seq/:reg_type/:file_id', upload.single('img'), async (request, res) => {
//     // app.post('/upload/:filepath/:prodId/:type/:category/', upload.single('img'), (req, res) => {
//     // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
//     // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
//     // console.log('전달받은 파일', req.file);
//     // console.log('저장된 파일의 이름', req.file.filename);
  
//     // // 파일이 저장된 경로를 클라이언트에게 반환해준다.
//     // /upload/:filepath/:prodId/:type/:fileId/:fileName
//     const param = request.params
//     let commSeq = ""
//     console.log("param : ", param)
//     commSeq = await req.db('commSequences', ['PASS','mem_file_id','7'])
//     let paramData = {
//         mem_file_id : commSeq[0].commSeq,
//         prod_id: param.prod_id,
//         mem_id : param.mem_id,
// 	cart_id : param.cart_id,
//         file_type: param.type,
//         // file_category: this.trTp,
//         file_path: param.filepath,
//         file_name: request.file.filename,
//         origin_file_name: Buffer.from(request.file.originalname, 'latin1').toString('utf8'),
//         sort_order : param.sort_seq,
//         reg_date : utils.$dateFormat('filedate')
//     }
//     if(param.reg_type == "REGISTER") {
// 	const {error} = req.db('passportImageInsert', [paramData]);
//         if(error) {
//           log.error("passportImageInsert : ", {title : "이미지 업로드", sysnm : "passportImageInsert", error : error})
//         }
       
//     } else {
// 	const {error} = req.db("passportImgUpdate", [
//               {
//               file_type : param.type,
//               file_path : param.filepath,
//               file_name: request.file.filename,
//               origin_file_name: Buffer.from(request.file.originalname, 'latin1').toString('utf8'),
//               mod_date : utils.$dateFormat('filedate')
//               },
//               param.file_id
              
//         ]);
//         if(error) {
//           log.error("passportImgUpdate : ", {title : "이미지 업로드", sysnm : "passportImgUpdate", error : error})
//         }
//     }
//     res.status(200).send('ok')
// });

app.get('/download/:filePath/:file_name', (request, res) => {
    console.log("에디터 다운로드")
    const {
        filePath,
        file_name
    } = request.params
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${file_name}`
    // const filepath = VUE_APP_ADMIN_URLprocess.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}/${fileType}/${fileName}`
    console.log(filepath)
    console.log(file_name.substring(file_name.lastIndexOf(".")))
    res.header('Content-Type', `image/${file_name.substring(file_name.lastIndexOf("."))}`)
    if (!fs.existsSync(filepath)) res.send(404, {
        error: 'Can not found file.'
      })
      else {
          fs.createReadStream(filepath).pipe(res)
      }
})

app.get('/download/:filePath/:prodId/:fileType/:fileName', (request, res) => {
    // console.log("상품다운로드")
    let logData = {title : "상품다운로드"}
    log.info("상품다운로드", {title : "상품다운로드"})
    const {
      filePath,
      fileName,
      prodId,
      fileType
    } = request.params;
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}/${fileType}/${fileName}`;
    log.info("filepath", {path : filepath})
    logData = Object.assign(logData, {path : filepath})
    // console.log(filepath)
    res.header('Content-Type', `image/${fileName.substring(fileName.lastIndexOf("."))}`);
    if (!fs.existsSync(filepath)) {
      log.error("상품다운로드 error : ", {title : "상품다운로드 error", error : 'Can not found file.'})
      log.error({logData : logData})
      res.send(404, {error: 'Can not found file.'});
    } else {
      log.info("상품다운로드 완료 : ", {logData : logData})
      fs.createReadStream(filepath).pipe(res);
    }
});

app.get('/download/:category/:filepath/:prod_id/:mem_id/:cart_id/:mem_type/:file_type/:sort_seq/:file_name', (request, res) => {
    // console.log("passport 다운로드")
    let logData = {title : "passport 다운로드"}
    log.info("passport 다운로드", {title : "passport 다운로드"})
    let reqParam = request.params;
    log.info("reqParam", {reqParam : reqParam})
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.filepath}/${reqParam.prod_id}/${reqParam.mem_id}/${reqParam.cart_id}/${reqParam.mem_type}/${reqParam.file_type}/${reqParam.sort_seq}/${reqParam.file_name}`;
    log.info("filepath", {path : filepath})
    logData = Object.assign(logData, {path : filepath})
    // console.log("filepath : ",filepath)
    // console.log(reqParam.file_name.substring(reqParam.file_name.lastIndexOf(".")))
    res.header('Content-Type', `image/${reqParam.file_name.substring(reqParam.file_name.lastIndexOf("."))}`)
    if (!fs.existsSync(filepath)) {
      log.error("passport error : ", {title : "passport error", error : 'Can not found file.'})
      log.error("passport error data : ", {logData : logData})
      res.send(404, {error: 'Can not found file.'});
    } else {
      log.info("passport 다운로드 완료 : ", {logData : logData})
      fs.createReadStream(filepath).pipe(res)
    }
});
// /download/EVENT/PASSPORT/${files.file_path}/${files.event_id}/${files.mem_id}/${files.file_type}/${files.sort_order}/${files.file_name}
app.get('/download/:category/:categoryType/:file_path/:event_id/:mem_id/:file_type/:sort_order/:file_name', (request, res) => {
  // console.log("event passport 다운로드")
  let logData = {title : "event passport 다운로드"}
  log.info("event passport 다운로드", {title : "event passport 다운로드"})
  let reqParam = request.params;
  log.info("reqParam", {reqParam : reqParam})
  const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.categoryType}/${reqParam.file_path}/${reqParam.event_id}/${reqParam.mem_id}/${reqParam.file_type}/${reqParam.sort_order}/${reqParam.file_name}`;
  log.info("filepath", {path : filepath})
  logData = Object.assign(logData, {path : filepath})
  // console.log("filepath : ",filepath)
  // console.log(reqParam.file_name.substring(reqParam.file_name.lastIndexOf(".")))
  res.header('Content-Type', `image/${reqParam.file_name.substring(reqParam.file_name.lastIndexOf("."))}`)
  if (!fs.existsSync(filepath)) {
    log.error("passport error : ", {title : "passport error", error : 'Can not found file.'})
    log.error("passport error data : ", {logData : logData})
    res.send(404, {error: 'Can not found file.'});
  } else {
    log.info("event passport 다운로드 완료 : ", {logData : logData})
    fs.createReadStream(filepath).pipe(res)
  }
});
app.get('/download/:category/:filePath/:infoSeq/:fileType/:fileName', (request, res) => {
    // console.log("Kpop소식 다운로드")
    let logData = {title : "Kpop소식 다운로드"}
    log.info("Kpop소식 다운로드", {title : "Kpop소식 다운로드"})
    const {
        filePath,
        category,
        fileName,
        infoSeq,
        fileType
    } = request.params
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${category}/${filePath}/${infoSeq}/${fileType}/${fileName}`
    log.info("filepath", {path : filepath})
    logData = Object.assign(logData, {path : filepath})
    // console.log("filepath : ",filepath)
    // console.log(fileName.substring(fileName.lastIndexOf(".")))
    res.header('Content-Type', `image/${fileName.substring(fileName.lastIndexOf("."))}`)
    if (!fs.existsSync(filepath)) {
      log.error("Kpop소식 다운로드 error : ", {title : "Kpop소식 다운로드 error", error : 'Can not found file.'})
      log.error("Kpop소식 다운로드 data : ", {logData : logData})
      res.send(404, {error: 'Can not found file.'});
    } else {
      log.info("Kpop소식 다운로드 완료 : ", {logData : logData})
      fs.createReadStream(filepath).pipe(res)
    }
})

app.post('/deleteFile/EVENT/PASSPORT', async (request, res) => {
    // console.log("event passport 이미지 단건/전체 삭제")
    let logData = {}
    log.info("event passport 이미지 단건/전체 삭제", {title : "event passport 이미지 단건/전체 삭제"})
    let reqParam = request.body.info
    console.log("reqParam : ", reqParam)
    log.info("reqParam :  ", {reqParam : reqParam})
    logData = Object.assign(logData, {reqParam : reqParam})
    if(reqParam.modType == 'all') {
      const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.categoryType}/${reqParam.filepath}/${reqParam.event_id}/${reqParam.mem_id}`;
      console.log("filepath : ", filepath)
      log.info("filepath :  ", {path : filepath})
      logData = Object.assign(logData, {path : filepath})
        fs.rmdir(filepath, { recursive: true }, (err) => {
          if (err) {
            log.error("event passport 이미지 전체 삭제 error : ", {title : "event passport 이미지 전체 삭제 error", error : err})
            log.error("event passport data : ", {logData : logData})
            res.send({err});
          } else {
            log.info("event passport 이미지 전체삭제 완료 : ", {title : "event passport 이미지 전체 삭제완료", logData : logData})
            res.send('ok');
          }
        });
    } else if(reqParam.modType == 'select'){
        const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.categoryType}/${reqParam.filepath}/${reqParam.event_id}/${reqParam.mem_id}/${reqParam.file_type}/${reqParam.sort_order}/${reqParam.file_name}`;
        console.log("filepath : ", filepath)
        log.info("filepath :  ", {path : filepath})
        logData = Object.assign(logData, {path : filepath})
        fs.unlink(filepath, (err) => {
          if (err) {
            log.error("event passport 이미지 단건 삭제 error : ", {title : "event passport 이미지 단건 삭제 error", error : err})
            log.error("event passport 이미지 단건 삭제 error data : ", {logData : logData})
            res.send({err});
          } else {
            log.info("event passport 이미지 단건 삭제 완료 : ", {title : "event passport 이미지 단건 삭제완료", logData : logData})
            res.send('ok');
          }
        });
    } 
    // else {
    //     console.log("reqParam : ", reqParam)
    // }
})
app.post('/deleteFile/PASSPORT', async (request, res) => {
  console.log("passport 이미지 다건/단건 삭제")
  let info = request.body.info
  let logData = {}
  log.info("passport 이미지 단건/전체 삭제", {title : "passport 이미지 단건/전체 삭제"})
  log.info("reqParam :  ", {info : info})
  logData = Object.assign(logData, {info : info})
  if(info.mod_type == 'all') {
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${info.category}/${info.filepath}/${info.prod_id}/${info.mem_id}/${info.cart_id}`;
    log.info("filepath :  ", {path : filepath})
    logData = Object.assign(logData, {path : filepath})
      fs.rmdir(filepath, { recursive: true }, (err) => {
        if (err) {
          log.error("passport 이미지 전체 삭제 error : ", {title : "passport 이미지 전체 삭제 error", error : err})
          log.error("passport data : ", {logData : logData})
          res.send({err});
        } else {
          log.info("passport 이미지 전체삭제 완료 : ", {title : "passport 이미지 전체 삭제완료", logData : logData})
          res.send('ok');
        }
      });
  } else if(info.mod_type == 'select'){
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${info.category}/${info.filepath}/${info.prod_id}/${info.mem_id}/${info.cart_id}/${info.mem_type}/${info.file_type}/${info.sort_order}/${info.file_name}`;
    console.log("filepath : ", filepath)
    log.info("filepath :  ", {path : filepath})
    logData = Object.assign(logData, {path : filepath})
    fs.unlink(filepath, (err) => {
      if (err) {
        log.error("passport 이미지 단건 삭제 error : ", {title : "passport 이미지 단건 삭제 error", error : err})
        log.error("passport 이미지 단건 삭제 error data : ", {logData : logData})
        res.send({err});
      } else {
        log.info("passport 이미지 단건 삭제 완료 : ", {title : "passport 이미지 단건 삭제완료", logData : logData})
        res.send('ok');
      }
    });
    const {error} = req.db('passportImgDelete', [info.file_id]);
    // const {error} = req.db('passportImageInsert', [paramData]);
  }
})

app.post('/deleteFile/:category/:filepath/:prod_id/:mem_id/:cart_id/:file_type/:sort_order/:file_name', async (request, res) => {
    // console.log("passport 이미지 단건 삭제")
    let logData = {title : "passport 이미지 단건 삭제"}
    let reqParam = request.params;
    // console.log("reqParam : ", reqParam)
    log.info("passport 이미지 단건 삭제", {title : "passport 이미지 단건 삭제"})
    log.info("reqParam : ", {reqParam : reqParam})
    logData = Object.assign(logData, {reqParam : reqParam})
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.filepath}/${reqParam.prod_id}/${reqParam.mem_id}/${reqParam.cart_id}/${reqParam.file_type}/${reqParam.sort_order}/${reqParam.file_name}`;
    log.info("filepath : ", {filepath : filepath})
    logData = Object.assign(logData, {path : filepath})
    fs.unlink(filepath, (err) => {
      if (err) {
        log.error("passport 이미지 단건 삭제 error : ", {error : err})
        log.error("passport 이미지 단건 삭제 error data : ", {logData : logData})
        res.send({err});
      } else {
        log.info("passport 이미지 단건 삭제 완료 : ", {logData : logData})
        res.send('ok');
      }
    });
    
});

app.post('/deleteFile/:category/:filepath/:prod_id/:mem_id/:cart_id', async (request, res) => {
    console.log("passport 파일 전체 삭제")
    let logData = {title : "passport 파일 전체 삭제"}
    log.info("passport 파일 전체 삭제", {title : "passport 파일 전체 삭제"})
    let reqParam = request.params;
    log.info("reqParam : ", {reqParam : reqParam})
    logData = Object.assign(logData, {reqParam : reqParam})
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.filepath}/${reqParam.prod_id}/${reqParam.mem_id}/${reqParam.cart_id}`;
    log.info("filepath : ", {filepath : filepath})
    logData = Object.assign(logData, {path : filepath})
    fs.rmdir(filepath, { recursive: true }, (err) => {
      if (err) {
        log.error("passport 파일 전체 삭제 error : ", {error : err})
        log.error("passport 파일 전체 삭제 error data : ", {logData : logData})
        res.send({err});
      } else {
        log.info("passport 파일 전체 삭제 완료 : ", {logData : logData})
        res.send('ok');
      }
    });
});

// 파일 상품번호로 전체 삭제
app.post('/deleteFile/:filePath/:prodId', async (request, res) => {
    // console.log("파일 전체 삭제")
    let logData = {title : "파일 전체 삭제"}
    log.info("파일 전체 삭제", {title : "파일 전체 삭제"})
    const {
        filePath,
        prodId
    } = request.params;
    // console.log("filePath : ",filePath);
    // console.log("prodId : ",prodId);
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}`;
    log.info("filepath : ", {filepath : filepath})
    logData = Object.assign(logData, {path : filepath})
    fs.rmdir(filepath, { recursive: true }, (err) => {
      if (err) {
        log.error("파일 전체 삭제 error : ", {error : err})
        log.error("파일 전체 삭제 error data : ", {logData : logData})
        res.send({err});
      } else {
        log.info("파일 전체 삭제 완료 : ", {logData : logData})
        res.send('ok');
      }
    });
});


app.post('/update/:product/:prod_id', async (request, res) => {
    console.log("update 들어온나")
    const {
        product,
        prod_id,
    } = request.params;
    await req.db('productUpdate', [
        {
            product
        },
        {
            prod_id : prod_id
        }
    ]);
});

// 결제시작
app.post('/payment/:payType', async (request, res) =>{
  console.log("payment 시작:");
  logData = {title : "payment 시작"}
  const {
      payType
  } = request.params;
  try {
	  let logData = {
      title : "payment"
    }
    let data = {}
    let orderInfo  = request.body.orderInfo
    console.log("orderInfo : ", orderInfo)
    log.info("orderInfo : ", {orderInfo : orderInfo})
	  logData = Object.assign(logData, {orderInfo : orderInfo})
    const refno = utils.$randomString()
    //console.log("refno : ", refno)
    log.info("refno : ", {refno : refno})
	  logData = Object.assign(logData, {refno : refno})
    let information = ""
    let serviceType = ""
    let reqCur = "CNY"
    if(payType == 'A') {
      serviceType = process.env.VUE_APP_ALIPAY_SERVICE_TYPE
      information = "{“business_type”:”4”,”goods_info”:”"+`${orderInfo.prodTitle}`+"^"+`${orderInfo.costPrice}`+"”,”total_quantity”:”1”}"
    } else if(payType == 'W') {
      serviceType = process.env.VUE_APP_WECHARPAY_SERVICE_TYPE
      information = `{ "goods_detail":[ {"wxpay_goods_id":"`+`${process.env.VUE_APP_WXPAY_GOODS_ID}`+`", "goods_name":"`+`${orderInfo.prodTitle}`+`","quantity":"`+`${orderInfo.costPrice}`+`"}]}`
    } else if(payType == 'P') {
      serviceType = process.env.VUE_APP_PAYPAL_SERVICE_TYPE
      reqCur = 'USD'
      information =`{"goods_detail":[{"name":"`+`${orderInfo.prodTitle}`+`","unit_amount": {"currency_code":"USD","value":"`+`${orderInfo.costPrice}`+`"},"quantity":"1"}],"shipping_detail": {"name": {"full_name":"`+`${orderInfo.buyername}`+`"},"address": {"admin_area_2":"`+`${orderInfo.buyr_area}`+`","country_code":"`+`${orderInfo.locale}`+`"}},"shipping": {"currency_code":"USD","value":"0"}}}`
    }
    if(payType != 'U') {
      data = {
        ver : 'V2',
        mid : process.env.VUE_APP_ALIPAY_MID,
        mname : 'barabodatrip',
        servicetype : serviceType,
        refno : refno,
        reqcur : reqCur,
        reqamt : orderInfo.costPrice,
        buyername : orderInfo.buyername, 
        tel : orderInfo.tel,
        email : orderInfo.email,
        product : orderInfo.prodTitle,
        trade_information : information,
        refer_url : process.env.VUE_TRIP_WEB_URL,
        returnurl:  process.env.VUE_APP_PAY_RETURN_URL,
        statusurl : process.env.VUE_APP_PAY_STATUS_URL+`${orderInfo.memId}/${orderInfo.prodId}/1/${orderInfo.inventoryCnt}/${orderInfo.cartId}/${payType}/${orderInfo.orderId}/${orderInfo.origin_total_price}/${orderInfo.lanTp}`,
        reqtype : orderInfo.reqType,
        restype : orderInfo.resType,
        expiretime : "12h",
      }
        console.log("payment_origin_data : ", data)
        log.info('payment_origin_data : ', { payment_origin_data : data})
        const fgkey = utils.$makeAllParam(data, process.env.VUE_APP_ALIPAY_SECRET_KEY)
        log.info('fgkey : ', {fgkey : fgkey})
        console.log('fgkey : ',fgkey)
        data = Object.assign(data, { fgkey: fgkey });
      } else {
        let orderDate = utils.$dateFormat('filedate')
        data = {
            SERVICE_ID : process.env.VUE_APP_UNIONPAY_MID,
            SERVICE_CODE : "0900",
            SERVICE_TYPE : "0000",
            ORDER_ID : refno,
            ORDER_DATE : orderDate,
            AMOUNT : orderInfo.total,
            RETURN_URL : process.env.VUE_APP_PAY_STATUS_URL+`${orderInfo.memId}/${orderInfo.prodId}/${orderInfo.participant_cnt}/${orderInfo.inventoryCnt}/${orderInfo.cartId}/${payType}/${orderInfo.orderId}/${orderInfo.lanTp}`,
            ITEM_CODE : orderInfo.prodId,
            ITEM_NAME : orderInfo.prodTitle,
            USER_ID : orderInfo.memId,
            USER_NAME : orderInfo.memNm,
            USER_EMAIL : orderInfo.email,
            WEBAPI_FLAG : "Y",
            USING_TYPE : "0001",
            CURRENCY : "0000",

        }
      }
      logData = Object.assign(logData, {payment : data})
      log.info('payment_data : ', logData)
      console.log("result data : ",data)
      res.send(data)
    } catch (err) {
      console.log("payment err : ",err);
      log.error("payment error : ", {title : "payment error", error : err})
      log.error("payment error data : ", {title : "payment error", logData : logData})
      res.send({
          error: err
      })
    }
});

// 결제 완료 후 callback 처리
// app.post('/paymentCallBack/:memId/:prodId/:costPrice/:inventoryCnt', async (request, res) => {
app.post('/paymentCallBack/:memId/:prodId/:participant_cnt/:inventoryCnt/:cartId/:payType/:orderId/:totalPrice/:lanTp', async(request,res) => {
    const {
      memId,
      prodId,
      participant_cnt,
      inventoryCnt,
      payType,
      cartId,
      orderId,
      lanTp,
      totalPrice
    } = request.params;
    try {
      let logData = {
        title : "paymentCallBack"
      }
      let body = ""
      // let orderId = await req.db("commSequences", ['ORDER','order_id','8'])
      if(payType != 'U') {
        request.on('data',async function(chunk) {
            body += chunk;
        });
        let rescode = ""
        request.on('end',async function() {
          console.log('there will be no more data.');
          let data = utils.$resultParam(body)
          // data = Object.assign(data, { order_id : orderId[0].commSeq })
          data = Object.assign(data, { prod_id : prodId })
          // data = Object.assign(data, { pay_type : data.servicetype == 'S000' ? 'A' : 'W' })
          data = Object.assign(data, { pay_type : payType })
          data = Object.assign(data, { pay_yn : data.rescode == '0000' ? 'Y' : 'N' })
          data = Object.assign(data, { mem_id : memId })
          data = Object.assign(data, { txn_type : 'P' })
          data = Object.assign(data, { origin_amt : totalPrice })
          data = Object.assign(data, { prod_total_cnt : participant_cnt })
		      data = Object.assign(data, { mod_date : data.transdt})
          rescode = data.rescode
          console.log("data : ", data)
		      await req.db('orderUpdate', [data, orderId])
          log.info("paymentCallBack : ", {title : "paymentcallback", sysnm : "orderUpdate", result : data})
          await req.db('productUpdate', [{inventory_cnt : Number(inventoryCnt - participant_cnt)},{prod_id : prodId}])
          log.info("productUpdate : ", {title : "paymentcallback", sysnm : "productUpdate", result : [{inventory_cnt : Number(inventoryCnt - participant_cnt)},{prod_id : prodId}]})
          await req.db('myCartUpdate', [
                    {pay_yn : 'Y', txn_type : 'P', mod_date : utils.$dateFormat('filedate')},
                    cartId
          ])
          logData = Object.assign(logData, { resData : data})
          log.info("payment end : ", {title : "paymentCallback end", logData : logData})
	        let info = await req.db('orderList', ['Y','P',prodId,memId,orderId])
          log.info("payment end : ", {title : "email", sysnm : "orderList", result : info[0]})
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.VUE_APP_EMAIL_ID,  // gmail 계정 아이디를 입력
              pass: process.env.VUE_APP_EMAIL_SECERT_KEY          // gmail 계정의 비밀번호를 입력
            }
          });
          let type = "" 
          let mailText = ""
          if(payType == 'A') {
            type = "Alipay"
          } else if(payType == 'W') {
            type = "Wechatpay"
          } else {
            type = "Paypal"
          }
          let subjectTxt = ""
          let subTxt = ""
          let msg = ""
          if(lanTp == 'CHN') {
            msg = "付款处理已成功完成。"
            mailText = `
              产品编号 : [${info[0].prod_id}]
              交易号: [${info[0].order_id}]
              产品名称 : ${info[0].product}
              付款方式 : ${type}
              付款金额 : ${info[0].reqamt_format}
              付款日期和时间 : ${info[0].transdt}
              付款人ID : ${info[0].mem_id}
              付款人姓名 : ${info[0].buyername}
              ${msg}
            `
            subjectTxt = 'Baraboda Trip 商品名'
            subTxt = '完成支付'

          } else if(lanTp == 'ENG') {
            msg = "Payment processing has been completed successfully."
            mailText = `
              Product No : [${info[0].prod_id}]                           
              transaction No : [${info[0].order_id}]
              product name : ${info[0].product}
              Payment type : ${type}
              Amount of payment : ${info[0].reqamt_format}
              Payment date and time : ${info[0].transdt}
              Member ID : ${info[0].mem_id}
              Member name : ${info[0].buyername}
              ${msg}
            `
            subjectTxt = 'Baraboda Trip Product Name'
            subTxt = 'Complete payment'		
          } else if(lanTp == 'JPN') {
            msg = "お支払い処理が正常に完了しましたi。"
            mailText = `
              商品番号: [${info[0].prod_id}]
              交易号 : [${info[0].order_id}]
              商品名: ${info[0].product}
              決済タイプ : ${type}
              決済金額 : ${info[0].reqamt_format}
              決済日時 : ${info[0].transdt}
              支払い者ID : ${info[0].mem_id}
              支払い者名 : ${info[0].buyername}
              ${msg}
            `
            subjectTxt = 'Baraboda Trip 商品名'
            subTxt = 'お支払い完了'
          } else {
            msg = "결제처리가 정상적으로 완료 되었습니다."
            mailText = `
              상품번호 : [${info[0].prod_id}]		            
              오더번호 : [${info[0].order_id}]
              상품명 : ${info[0].product}
              결제유형 : ${type}
              결제금액 : ${info[0].reqamt_format}
              결제일시 : ${info[0].transdt}
              결제자ID : ${info[0].mem_id}
              결제자명 : ${info[0].buyername}
              ${msg}
            `
            subjectTxt = '바라보다트립 상품명'
          }
          let mailOptions = {
            from: process.env.VUE_APP_EMAIL_ID,    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
            to: [process.env.VUE_APP_EMAIL_ID, info[0].email] ,                     // 수신 메일 주소
            subject: `${subjectTxt} ${info[0].product} ${type} ${subTxt}`,   // 제목
            text: mailText  // 내용
          };
          console.log("option  :",mailOptions)
          log.info("결제완료 메일전송 : ", {title : "결제완료 메일전송"})
          transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            log.error("결제완료 메일전송 error : ", {title : "결제완료 메일전송 error", error : error})
            log.error("결제완료 메일전송 error data : ", {mailOptions : mailOptions})
            console.log(error);
          } else {	                             
            log.info("결제완료 메일전송완료 : ", {title : "결제완료 메일전송완료", mailOptions : mailOptions})
            console.log('Email sent: ' + info.response);		         
          }
        });
        let emailId = await req.db("commSequences", ['EMAIL','email_id','8'])
        console.log("emailId : ",emailId)
        let emailData = {
          email_id : emailId[0].commSeq,
          email : info[0].email,
          prod_id : info[0].prod_id,
          order_id : info[0].order_id,
          prod_nm : info[0].product,
          pay_type : type,
          mem_id : info[0].mem_id,
          mem_nm : info[0].buyername,
          reqamt : info[0].reqamt,
          msg : msg,
          payment_date : info[0].transdt,
          txn_type : info[0].txn_type,
          user_cancel_type : info[0].txn_type,
          reg_date : utils.$dateFormat('filedate')                  
        }
        await req.db('emailInsert', [emailData])
        log.info("payment email 등록 :", {title : "payment email", emailData : emailData})
        console.log("emailData : ",emailData)
        res.status(200).send('SUCCESS')
        // res.status(200).redirect(`/orderResult?cart_id=${cartId}&rescode=${rescode}`)
      });                               
    } else {
      console.log("process.env.VUE_APP_UNIONPAY_DEV_API_URL : ", process.env.VUE_APP_API_UNIONPAY_URL)
      let url = process.env.VUE_APP_API_UNIONPAY_URL
      let result = request.body
      const headers = {
        "Content-Type" :"application/x-www-form-urlencoded;euc-kr",
        "Accept-Language" :"gx"
      }
      let data = {
        SERVICE_ID : result.SERVICE_ID,
        ORDER_ID : result.ORDER_ID,
        ORDER_DATE : result.ORDER_DATE,
        SERVICE_CODE : result.SERVICE_CODE,
        PAY_MESSAGE : result.PAY_MESSAGE
      }
      console.log("data : ", data)
      await axios({
          method: 'post',
          url,
          data,
          headers
      }).then(response => {
        let resdata = {
          service_code :  response.data.SERVICE_CODE,
          mid :  response.data.SERVICE_ID,
          command :  response.data.COMMAND,
          refno :  response.data.ORDER_ID,
          order_date :  response.data.ORDER_DATE,
          auth_date : response.data.AUTH_DATE,
          transid :  response.data.TRANSACTION_ID,
          rescode :  response.data.RESPONSE_CODE,
          resmsg :  response.data.RESPONSE_MESSAGE,
          detail_response_code :  response.data.DETAIL_RESPONSE_CODE,
          detail_response_message :  response.data.DETAIL_RESPONSE_MESSAGE,
          reqamt :  response.data.AUTH_AMOUNT,
          mem_id : memId,
          prod_id : prodId,
          pay_type : payType,
          // order_id :  response.data.ORDER_ID,
          pay_yn : 'Y',
          servicetype : process.env.VUE_APP_UNIONPAY_SERVICE_TYPE,
          auth_date :  response.data.AUTH_DATE,
          cancel_key :  response.data.CANCEL_KEY,
          order_id :  orderId,
          prod_total_cnt : total,
          use_yn : 'Y',
          del_yn : 'N'

        }
        console.log("resdata : ", resdata)
        console.log(resdata.rescode)
        const msg_code = resdata.rescode
        req.db('orderUpdate', [resdata, {order_id : orderId}])
        if(msg_code  == '0000') {
          req.db('productUpdate', [
                  {inventory_cnt : Number(inventoryCnt-1)},
                  {prod_id : prodId}
          ])
          req.db('myCartUpdate', [
                  {pay_yn : 'Y'},
                  {cart_id : cartId} 
          ])
        }
        res.status(200).redirect(`/orderUnionPayResult?cart_id=${cartId}`)
      }).catch(err => {
          err
      })
    }
  } catch (error) {
      console.log("catch error : ",error)        
  }
})

/*
wechatpay mobile 결제
*/
app.post('/wechatpayment', async(request,res) => {
  try {
    console.log("wechatpay mobile 결제")
    let logData = {
      title : "wechatpay mobile 결제"
    }
    let redirectUrl = ""
    log.info("wechatpay mobile 결제 : ", {title : "wechatpay mobile 결제"})
    const headers = {
      "Content-Type" : "application/x-www-form-urlencoded;utf-8"
    }
    log.info("wechatpay mobile 결제 : ", {headers : headers})
    let url = process.env.VUE_APP_ALIPAY_MOBILE_PAYMENT_URL
    let orderInfo  = request.body.orderInfo
    console.log("url : ", url)
    console.log("orderInfo : ", orderInfo)
    log.info("url : ", {url : url})
    log.info("orderInfo : ", {orderInfo : orderInfo})
    logData = Object.assign(logData, {url : url, orderInfo : orderInfo})
    let body = ""
    await axios({
      method: 'post',
      url,
      headers,
      data : {
        ver :orderInfo.ver,
        mid :orderInfo.mid,
        mname :orderInfo.mname,
        servicetype :orderInfo.servicetype,
        refno : orderInfo.refno,
        reqcur : orderInfo.reqcur,
        reqamt : orderInfo.reqamt,
        buyername : orderInfo.buyername,
        tel : orderInfo.tel,
        email : orderInfo.email,
        product : orderInfo.product,
        trade_information : orderInfo.trade_information,
        refer_url : orderInfo.refer_url,
        returnurl : orderInfo.returnurl,
        statusurl : orderInfo.statusurl,
        reqtype : orderInfo.reqtype,
        restype : orderInfo.restype,
        fgkey : orderInfo.fgkey,
        expiretime : orderInfo.expiretime
      },
      }).then(response => {   
        redirectUrl = decodeURIComponent(response.data.resmsg)
        let resultUrl = `${redirectUrl}&redirect_url=${orderInfo.returnurl}`
        console.log("redirectUrl :" ,resultUrl)
        log.info("redirectUrl : ", {redirectUrl : redirectUrl})
        log.info("wechatpay call end", {logData : logData})
        res.status(200).send(resultUrl)
    });
  } catch (error) {
      log.error("wechatpay error : ", {title : "wechatpay mobile error"})
      log.error("wechatpay error info : ", {error : error})
      console.log("catch error : ",error)        
  }
  
})
app.post('/smtp/email/test', async(request,res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.VUE_APP_EMAIL_ID,  // gmail 계정 아이디를 입력
      pass: process.env.VUE_APP_EMAIL_SECERT_KEY          // gmail 계정의 비밀번호를 입력
    }
  });
  let subjectText = `Baraboda Trip 이메일 테스트`
  let msg = "이메일 테스트"
  let mailText = `
    
    ${msg}
    `
  let mailOptions = {
    from: process.env.VUE_APP_EMAIL_ID,    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: 'ibmw3484@gmail.com',                     // 수신 메일 주소
    subject: subjectText,   // 제목
    text: mailText  // 내용
  };
  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      log.error("email error : ", {title : "email error"})
      log.error("email error data : ", {error : error})
      console.log(error);
    }
    else {
      console.log("info.email_type : ", "발송성공")
    }
    console.log('Email sent: ' + info.response);
  })
})

app.post('/smtp/email', async(request,res) => {
  console.log("email")
  log.info("email 발송 :", {title : "email 발송"})
  let emailInfo  = request.body.info
  console.log("info  :",emailInfo)
  let logData = {title : "email 발송"}
  log.info("email info :", {info : emailInfo})
  logData = Object.assign(logData, {info : emailInfo})
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.VUE_APP_EMAIL_ID,  // gmail 계정 아이디를 입력
      pass: process.env.VUE_APP_EMAIL_SECERT_KEY          // gmail 계정의 비밀번호를 입력
    }
  });
  
  let subjectText = ""
  let msg = ""
  let mailText = ""
  let emailTo = []
  console.log(emailInfo.email_type)
  if(emailInfo.email_type == 'payment_cancel') {
    subjectText = `[상품결제취소요청] 결제자 ${emailInfo.buyername} /${emailInfo.product}`
    msg = "결제취소 요청이 들어왔습니다."
    mailText = `
      상품번호 : [${emailInfo.prod_id}]
      오더번호 : [${emailInfo.order_id}]
      트렌젝션ID :[${emailInfo.transid}]
      상품명 : ${emailInfo.product}
      결제자ID : ${emailInfo.mem_id}
      결제자명 : ${emailInfo.buyername}
      결제유형 : ${emailInfo.pay_type_nm}
      결제금액 : ${emailInfo.reqamt_format}
      결제일시 : ${emailInfo.transdt}
      ${msg}
    `
    emailTo = [process.env.VUE_APP_EMAIL_ID]
    console.log("mailText : ",mailText)
    console.log("subjectText : ",subjectText)
    console.log("emailTo : ",emailTo)
  } else if(emailInfo.email_type == 'event_rv') {
    let reg_date_format = utils.$dateFormat('ymd')
    if(emailInfo.lan_tp == 'CHN') {
      subjectText = `【活动申请完成】 ${emailInfo.event_title}`
      msg = "活动申请已完成。"
      mailText = `
      活动名称 : ${emailInfo.product}
      活动日期和时间 : [${emailInfo.event_date}]
      申请人数 : ${emailInfo.event_date}
      申请日期 : ${reg_date_format}
        ${msg}
      `
    } else if(emailInfo.lan_tp == 'ENG') {
      subjectText = `[Event application complete] ${emailInfo.event_title}`
      msg = "Event application has been completed."
      mailText = `
        Event title : ${emailInfo.event_title}
        date : [${emailInfo.event_date}]
        Number of applicants : ${emailInfo.event_cnt}
        Application date : ${reg_date_format}
        ${msg}
      `
    } else if(emailInfo.lan_tp == 'JPN') {
      subjectText = `[イベント申請完了] ${emailInfo.event_title}`
      msg = "イベント申請が完了しました。"
      mailText = `
      イベント名 : ${emailInfo.event_title}
      一時 : [${emailInfo.event_date}]
      申請人数 : ${emailInfo.event_cnt}
      申請日 : ${reg_date_format}
        ${msg}
      `
    } else {
      subjectText = `[이벤트 신청완료] ${emailInfo.event_title}`
      msg = "이벤트 신청이 완료 되었습니다."
      mailText = `
        이벤트명 : ${emailInfo.event_title}
        일시 : [${emailInfo.event_date}]
        신청 인원수 : ${emailInfo.event_cnt}
        신청일 : ${reg_date_format}
        ${msg}
      `
    }
    emailTo = [process.env.VUE_APP_EMAIL_ID, emailInfo.email]
  }
  console.log("emailTo : ", emailTo)
  log.info("email 내용 : ", {subjectText : subjectText, mailText : mailText})
  logData = Object.assign(logData, {subjectText : subjectText, mailText : mailText})
  let mailOptions = {
    from: process.env.VUE_APP_EMAIL_ID,    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: emailTo,                     // 수신 메일 주소
    subject: subjectText,   // 제목
    text: mailText  // 내용
  };
  console.log("mailOptions :", mailOptions)
  log.info("logData : ", {logData : logData} )
  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      log.error("email error : ", {title : "email error"})
      log.error("email error data : ", {error : error})
      console.log(error);
    }
    else {
      console.log("info.email_type : ", emailInfo)
      if(emailInfo.email_type != 'event_rv') {
        req.db('emailUpdate', [{user_cancel_type : 'PR',mod_date : utils.$dateFormat('filedate')},emailInfo.order_id])
        req.db('reservInfoUpdate', [{txn_type : 'PR', mod_date : utils.$dateFormat('filedate')},emailInfo.order_id])
        console.log('Email sent: ' + info.response);
        res.status(200).send({msg : '결제취소요청'})
      } else {
        let emailId = await req.db("commSequences", ['EMAIL','email_id','8'])
        let emailData = {
          email_id : emailId[0].commSeq,
          email : emailInfo.email,
          prod_id : emailInfo.event_id,
          prod_nm : emailInfo.event_title,
          mem_id : emailInfo.mem_id,
          mem_nm : emailInfo.mem_nm,
          msg : msg,
          email_type : "event_rv",
          user_cancel_type : 'P',
          reg_date : utils.$dateFormat('filedate')                  
        }
        await req.db('emailInsert', [emailData])
        console.log('Email sent: ' + info.response);
        res.status(200).send({msg : '이벤트신청자 정보'})
      }
    }
  });
})

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [1, new schedule.Range(1,5)]
// // rule.hour = 11;
rule.minute = 60;
// rule.second = 4
// rule.tz = 'Asia/Seoul'
// const startTime = new Date(Date.now() + 1000 * 3600)
// const startTime = new Date(Date.now() + 5000)
// const endTime = new Date(startTime.getTime() + 1000 * 300)
// console.log("endTime : ", endTime)
// console.log("endTime : ", endTime)
// 환율 배치
const regularExec = schedule.scheduleJob(
  // {start : startTime, end : endTime, rule : '*/1 * * * * 1/5'}, async()=>{ // 매일 낮 12시 정각마다 실행
  // {start : startTime, end : endTime, rule : '* * * * * 1/5'}, async()=>{ // 매일 낮 12시 정각마다 실행
  rule, async()=>{ // 매일 낮 12시 정각마다 실행
  // rule, async()=>{ // 매일 낮 12시 정각마다 실행
    // req.db('exchangeDelete', {
	// )
    let ymdDate = utils.$dateFormat('ymddate')
    // let url = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey="+`${process.env.VUE_APP_API_EXCHANGE_KEY}`+"&searchdate="+`${ymdDate}`+"&data=AP01"
    let url = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey="+`${process.env.VUE_APP_API_EXCHANGE_KEY}`+"&searchdate="+`${ymdDate}`+"&data=AP01"
    console.log("환율배치 시작")
    await axios({
        method: 'post',
        url,
    }).then(res => {
        console.log("res : ",res.data)
        console.log("res : ",res.data.length)
        for(let resData of res.data) {
            console.log("res : ",resData.cur_unit.substring(0,3))
            let data = {
                result : resData.result,
                cur_unit : resData.cur_unit.substring(0,3),
                ttb : resData.ttb.replace(',',''),
                tts : resData.tts.replace(',',''),
                deal_bas_r : resData.deal_bas_r.replace(',',''),
                bkpr : resData.bkpr.replace(',',''),
                yy_efee_r : resData.yy_efee_r,
                ten_dd_efee_r : resData.ten_dd_efee_r,
                kftc_bkpr : resData.kftc_bkpr.replace(',',''),
                kftc_deal_bas_r : resData.kftc_deal_bas_r.replace(',',''),
                cur_nm : resData.cur_nm,
                reg_date : utils.$dateFormat('filedate')
            }
            req.db('exchangeInsert', [data, data])
        }
        res.redirect('302', '/')
        // res.send('ok')
        
    }).catch(err => {
        err
    })
})

app.post('/monitorHistory', async(request,res) => {
  console.log("monitorHistory")
  let info = request.body.info
  let ip = requestIp.getClientIp(request)
  info = Object.assign(info, {ip : ip})
  info = Object.assign(info, {reg_date : utils.$dateFormat('filedate')})
  console.log(requestIp.getClientIp(request));
  log.debug("접속정보 : ", 
    {
      title : '접속정보',
      os_type : info.os_type,
      locale : info.locale,
      company_type : info.company_type,
      ip : ip
    })
  await req.db('monitorHistory', [info])
  res.send('ok');
})


// 실제 db연결 후 실행하는 부분 로그인 필요할시 
// 예 : 상품등록, mypage 등
app.post('/apirole/:alias', async (request, res) => {
    if(!request.session.email) {
        return res.status(401).send({error:'You need to login'});
    }
    try {
        res.send(await req.db(request.params.alias, request.body.param));
    } catch (err) {
        res.status(500).send({
            error : err
        });
    }
});

// 로그인 필요 없을시
app.post('/api/:alias', async (request, res) => {
  try {
    let data = await req.db(request.params.alias, request.body.param)
    let logData = {
        sysnm : request.params.alias
    }
    logData = Object.assign(logData, { data : data})
    log.info('data : ', logData)
    
    res.send(data);
  } catch (err) {
    // res.status(500).send({
    //     error : err
    // });
    if(err.code != 'ER_DUP_ENTRY')
      logData = Object.assign(logData, { err_code : err.code, err : err})
      log.error("ER_DUP_ENTRY error  :", {logData : logData})
      console.log("logData : ", err)
    resolve({
        err
    });
  }
});
