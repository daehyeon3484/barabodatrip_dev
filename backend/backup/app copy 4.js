// const uuidAPIKey = require('uuid-apikey');
// console.log(uuidAPIKey.create());
const cors = require('cors');
const express = require('express');
const axios = require("axios");
const app = express();
const session = require('express-session');
const router = express.Router();
const fileStore = require('session-file-store')(session);
const dotenv = require("dotenv");
const utils = require('../commonUtils.js');
// const FormData = require('form-data');
// const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');
const schedule = require('node-schedule')
const iconv = require('iconv-lite');
const testdate = utils.$dateFormat('filedate')
console.log(testdate)
const passport = require('passport');
// const qqStrategy = require('passport-qq').Strategy;
const WeixinStrategy = require('passport-weixin').Strategy;
// const KakaoStrategy = require('passport-kakao').Strategy;
const path = require("path");
const multer = require('multer');
const req = require('../model/database.js')
// const passportConfig = require('./passport');
// passportConfig(app);
// const userRouter = require('./routes/auth');
// app.use('/auth', [userRouter]);
const jwt = require('jsonwebtoken');

const qs = require('qs');
dotenv.config({path: './.server.env'});
//  dotenv.config({path: './.server.production.env'});
app.use(express.static(path.join(process.env.VUE_APP_STATIC_FILE_PATH)));
console.log(process.env.VUE_APP_KAKAO_CALLBACK_URL)
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.text());
const StringDecoder = require('string_decoder').StringDecoder;
const http = require('http');
const querystring = require('node:querystring');

const headers = { //Post요청에 보낼 Header
    "Access-Control-Allow-Origin": '*',
    "Content-Type": "application/json"
}
// 서버 리스타트 안해도 되는 로직
const fs = require('fs');
// console.log(process.env.VUE_APP_FACEBOOK_CALLBACK_URL);

let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  };
// app.use(multipart())
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

let sql = require('../sql.js');
const { URLSearchParams } = require('url');

// 서버 리스타트 안해도 되는 로직
fs.watchFile(__dirname + '/sql.js', (curr,prev) => {
    console.log('sql 변경시 재시작 없이 반영되도록 함.');
    delete require.cache[require.resolve('./sql.js')];
    sql = require('../sql.js');
});
const upload = multer({
    storage: multer.diskStorage({
        // 저장할 장소
        destination(req, file, cb) {
            const params = req.params
            let dir = process.env.VUE_APP_FILE_PATH+`\/${params.category}/${params.filepath}/${params.prod_id}/${params.mem_id}/${params.type}/${params.sort_seq}`
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
            cb(null, path.basename(Buffer.from(file.originalname, 'latin1').toString('utf8'), ext)+"_" + sysdate + ext)
            console.log(Buffer.from(file.originalname, 'latin1').toString('utf8'))
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});
//========================================설정 부분================================================//

let resParam = {}
// passport 카카오톡 로그인
// ===================================카카오로그인 구현 스타트============================================/
app.get('/auth/kakao', async (req, res) => {
    console.log("/auth/kakao")
    try{
      const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_CALLBACK_URL}&response_type=code&scope=profile_nickname,profile_image,account_email`
      res.redirect(kakaoAuthURL)
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.toString(),
      });
    }
  });
  
  app.get('/auth/kakao/callback', async(request,res)=>{
    // console.log("callback : ", req.url)
    
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
        res.json(e.data);
    }
    const exUser = await req.db("memInfos", [{mem_email : user.data.kakao_account.email}]);
    console.log("exUser : ", exUser[0])
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
    } else {
        // let memInfos = await req.db('memInfos', [{mem_email : user.data.kakao_account.email}])
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
            reg_date : exUser[0].reg_date 
        }
        console.log("resParam111 : ",resParam)
    }
    // const query = qs.stringify(resParam)
    const query = qs.stringify(resParam)
    console.log(query)
    request.session.user = {
        mem_id : resParam.mem_id,
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
    console.log("request.session key : ",request.session)
    console.log("process.env.VUE_TRIP_WEB_URL : ",process.env.VUE_TRIP_WEB_URL)
    request.session.save(function () {
        res.redirect(process.env.VUE_TRIP_WEB_URL+'/loginResult?'+query);
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
  console.log("profile11111111 : ", profile)
  try {
    resParam = {}
    const exUser = await req.db("memInfos", [{mem_sns_id : profile._json.openid}]);
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
}));

/**
 * weixin
 * mobile login  
 */
passport.use('loginByWeixinClient',new WeixinStrategy({
  clientID: process.env.VUE_APP_QQ_API_KEY,
  clientSecret: process.env.VUE_APP_QQ_SECRET,
  callbackURL: process.env.VUE_APP_QQ_M_CALLBACK_URL,
  requireState: false,
  authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  scope: 'snsapi_userinfo'
}, async function(accessToken, refreshToken, profile, done){
  console.log("profile11111111 : ", profile)
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
}));

passport.serializeUser((user,done)=>{
  done(null,user);
});
passport.deserializeUser((user,done)=>{
  done(null,user);
});

app.get("/auth/web/qq", passport.authenticate('loginByWeixin'));

app.get('/auth/qq/callback', (req, res) => { 
  passport.authenticate('loginByWeixin', {
    failureRedirect : process.env.VUE_TRIP_WEB_URL+'/login',
  //successRedirect : (process.env.VUE_TRIP_WEB_URL+"/?"+query)
}), (request, res) => {
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
    use_yn : 'Y',
    reg_date : resParam.reg_date
  }
  console.log("request.session key : ",request.session)
  request.session.save(function () {
    res.status(200).redirect(process.env.VUE_TRIP_WEB_URL+'/loginResult?'+query);
  });
}})

app.get("/auth/mobile/qq", passport.authenticate('loginByWeixinClient'));
app.get('/auth/qq/mobile/callback', (req, res) => { 
  passport.authenticate('loginByWeixinClient', {
    failureRedirect : process.env.VUE_TRIP_WEB_URL+'/login',
  //successRedirect : (process.env.VUE_TRIP_WEB_URL+"/?"+query)
}), (request, res) => {
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
    use_yn : 'Y',
    reg_date : resParam.reg_date
  }
  console.log("request.session key : ",request.session)
  request.session.save(function () {
    res.status(200).redirect(process.env.VUE_TRIP_WEB_URL+'/loginResult?'+query);
  });
}})

// ===================================QQ로그인 구현 끝============================================/


app.post('/api/login', async (request, res) =>{
//to-be 카카오톡 로그인
    // request.session['email'] = 'ibmw3484@gmail.com';
    // res.send('ok');
    try {
        // await req.db('signUp', request.body.param);
        if(request.body.param.length > 0) {
            for(let key in request.body.param[0]) request.session[key] = request.body.param[0][key];
            res.send({message : request.session[key]});
            console.log("session 들어온나");
            res.send(request.body.param[0]);
        } else {
            res.send({error:"Please try again or contact system manager"});
        }
    } catch (err) {
        res.send({
            error: "DB access error"
        })
    }
});

app.post('/auth/logout', async (req, res) =>{
    req.session.destroy();
    res.send('ok')
});

app.post('/upload/:category/:filepath/:prod_id/:mem_id/:sort_seq/:type/:reg_type/:file_id', upload.single('img'), async (request, res) => {
    // app.post('/upload/:filepath/:prodId/:type/:category/', upload.single('img'), (req, res) => {
    // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
    // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
    // console.log('전달받은 파일', req.file);
    // console.log('저장된 파일의 이름', req.file.filename);
  
    // // 파일이 저장된 경로를 클라이언트에게 반환해준다.
    // /upload/:filepath/:prodId/:type/:fileId/:fileName
    const param = request.params
    let commSeq = ""
    console.log("param : ", param)
    commSeq = await req.db('commSequences', ['PASS_File','mem_file_id','7'])
    let paramData = {
        mem_file_id : commSeq[0].commSeq,
        prod_id: param.prod_id,
        mem_id : param.mem_id,
        file_type: param.type,
        // file_category: this.trTp,
        file_path: param.filepath,
        file_name: request.file.filename,
        origin_file_name: Buffer.from(request.file.originalname, 'latin1').toString('utf8'),
        sort_order : param.sort_seq,
        reg_date : utils.$dateFormat('filedate')
    }
    if(param.reg_type == "REGISTER") {
        req.db('passportImageInsert', [paramData]);
    } else {
        req.db("passportImgUpdate", [
                {
                file_type : param.type,
                file_path : param.filepath,
                file_name: request.file.filename,
                origin_file_name: Buffer.from(request.file.originalname, 'latin1').toString('utf8'),
                mod_date : utils.$dateFormat('filedate')
                },
                {
                mem_file_id: param.file_id
                }
        ]);
    }
    res.status(200).send('ok')
});

app.get('/download/:filePath/:prodId/:fileType/:fileName', (request, res) => {
    console.log("상품다운로드")
    const {
        filePath,
        fileName,
        prodId,
        fileType
    } = request.params;
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}/${fileType}/${fileName}`;
    res.header('Content-Type', `image/${fileName.substring(fileName.lastIndexOf("."))}`);
    if (!fs.existsSync(filepath)) res.send(404, {
        error: 'Can not found file.'
      });
      else {
          fs.createReadStream(filepath).pipe(res);
      }
});

app.get('/download/:category/:filepath/:prod_id/:mem_id/:file_type/:sort_seq/:file_name', (request, res) => {
    console.log("passport 다운로드")
    let reqParam = request.params;
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.filepath}/${reqParam.prod_id}/${reqParam.mem_id}/${reqParam.file_type}/${reqParam.sort_seq}/${reqParam.file_name}`;
    console.log("filepath : ",filepath)
    console.log(reqParam.file_name.substring(reqParam.file_name.lastIndexOf(".")))
    res.header('Content-Type', `image/${reqParam.file_name.substring(reqParam.file_name.lastIndexOf("."))}`)
    if (!fs.existsSync(filepath)) res.send(404, {
        error: 'Can not found file.'
      })
      else {
          fs.createReadStream(filepath).pipe(res)
      }
});

app.get('/download/:category/:filePath/:infoSeq/:fileType/:fileName', (request, res) => {
    console.log("Kpop소식 다운로드")
    const {
        filePath,
        category,
        fileName,
        infoSeq,
        fileType
    } = request.params
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${category}/${filePath}/${infoSeq}/${fileType}/${fileName}`
    console.log("filepath : ",filepath)
    console.log(fileName.substring(fileName.lastIndexOf(".")))
    res.header('Content-Type', `image/${fileName.substring(fileName.lastIndexOf("."))}`)
    if (!fs.existsSync(filepath)) res.send(404, {
        error: 'Can not found file.'
      })
      else {
          fs.createReadStream(filepath).pipe(res)
      }
})

app.post('/deleteFile/:category/:filepath/:prod_id/:mem_id/:file_type/:sort_order/:file_name', async (request, res) => {
    console.log("passport 이미지 단건 삭제")
    let reqParam = request.params;
    console.log("reqParam : ", reqParam)
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.filepath}/${reqParam.prod_id}/${reqParam.mem_id}/${reqParam.file_type}/${reqParam.sort_order}/${reqParam.file_name}`;
    console.log("filepath : ", filepath)
    fs.unlink(filepath, (err) => {
        if(err) {
            res.send({
                err
            });
        } else {
            res.send('ok');
        }
    });
    
});

app.post('/deleteFile/:category/:filepath/:prod_id/:mem_id', async (request, res) => {
    console.log("passport 파일 전체 삭제")
    let reqParam = request.params;
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${reqParam.category}/${reqParam.filepath}/${reqParam.prod_id}/${reqParam.mem_id}`;
    fs.rmdir(filepath, { recursive: true }, (err) => {
        if (err) {
            res.send({
                err
            });
        } else {
            res.send('ok');
        }
    });
});

// 파일 상품번호로 전체 삭제
app.post('/deleteFile/:filePath/:prodId', async (request, res) => {
    console.log("파일 전체 삭제")
    const {
        filePath,
        prodId
    } = request.params;
    console.log("filePath : ",filePath);
    console.log("prodId : ",prodId);
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}`;
    fs.rmdir(filepath, { recursive: true }, (err) => {
        if (err) {
            res.send({
                err
            });
        } else {
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
    const {
        payType
    } = request.params;
    try {
        let data = {}
        let orderInfo  = request.body.orderInfo
        console.log("orderInfo : ", orderInfo)
        const refno = utils.$randomString()
        console.log("refno : ", refno)
        if(payType != 'U') {
            data = {
                ver : 'V2',
                mid : process.env.VUE_APP_ALIPAY_MID,
                mname : 'ddpstore',
                servicetype : payType == 'A' ? process.env.VUE_APP_ALIPAY_SERVICE_TYPE : process.env.VUE_APP_WECHARPAY_SERVICE_TYPE,
                refno : refno,
                reqcur : process.env.VUE_APP_CUR,
                reqamt : orderInfo.costPrice,
                buyername : orderInfo.buyername, 
                tel : orderInfo.tel,
                email : orderInfo.email,
                product : orderInfo.prodTitle,
                trade_information : payType == 'A' ? "{“business_type”:”4”,”goods_info”:”"+`${orderInfo.prodTitle}`+"^"+`${orderInfo.total}`+"”,”total_quantity”:"+`${orderInfo.total}`+"}" :  
                `{ "goods_detail":[ {"wxpay_goods_id":"`+`${process.env.VUE_APP_WXPAY_GOODS_ID}`+`", "goods_name":"`+`${orderInfo.prodTitle}`+`","quantity":"`+`${orderInfo.total}`+`"}]}`,
                refer_url : process.env.VUE_TRIP_WEB_URL,
                returnurl:  process.env.VUE_APP_PAY_RETURN_URL,
                statusurl : process.env.VUE_APP_PAY_STATUS_URL+`${orderInfo.memId}/${orderInfo.prodId}/${orderInfo.total}/${orderInfo.inventoryCnt}/${orderInfo.cartId}/${payType}`,
                reqtype : 'P',
                restype : 'PAGE',
                expiretime : "3h",
            }
            const fgkey = utils.$makeAllParam(data, process.env.VUE_APP_ALIPAY_SECRET_KEY)
            data = Object.assign(data, { fgkey: fgkey });
            console.log('fgkey : ', fgkey)
        } else {
            let orderDate = utils.$dateFormat('filedate')
            data = {
                SERVICE_ID : process.env.VUE_APP_UNIONPAY_MID,
                SERVICE_CODE : "0900",
                SERVICE_TYPE : "0000",
                ORDER_ID : refno,
                ORDER_DATE : orderDate,
                AMOUNT : orderInfo.total,
                RETURN_URL : process.env.VUE_APP_PAY_STATUS_URL+`${orderInfo.memId}/${orderInfo.prodId}/${orderInfo.total}/${orderInfo.inventoryCnt}/${orderInfo.cartId}/${payType}`,
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
        console.log("app data :", data)
        res.send(data)
    } catch (err) {
        console.log("err : ",err);
        res.send({
            error: err
        })
    }
});

// 결제 완료 후 callback 처리
// app.post('/paymentCallBack/:memId/:prodId/:total/:inventoryCnt', async (request, res) => {
app.post('/paymentCallBack/:memId/:prodId/:total/:inventoryCnt/:cartId/:payType', async(request,res) => {
    const {
        memId,
        prodId,
        total,
        inventoryCnt,
        payType,
        cartId
    } = request.params;
    try {
        
        let body = ""
        let orderId = await req.db("commSequences", ['ORDER','order_id','8'])
        if(payType != 'U') {
            request.on('data',async function(chunk) {
                body += chunk;
            });
            request.on('end',async function() {
                console.log('there will be no more data.');
                let data = utils.$resultParam(body)
                data = Object.assign(data, { order_id : orderId[0].commSeq })
                data = Object.assign(data, { prod_id : prodId })
                data = Object.assign(data, { pay_type : data.servicetype == 'S000' ? 'A' : 'W' })
                data = Object.assign(data, { pay_yn : data.rescode == '0000' ? 'Y' : 'N' })
                data = Object.assign(data, { mem_id : memId })
                data = Object.assign(data, { txn_type : 'P' })
                data = Object.assign(data, { prod_total_cnt : total })
                req.db('orderInsert', [data])
                if(data.rescode != '0000') {
                        res.status(200).redirect(`/orderIcbResultFail?result_code=${data.rescode}&cart_id=${cartId}&lan_tp=${lanTp}`)
                } else {
                        req.db('productUpdate', [
                                {inventory_cnt : Number(inventoryCnt-1)},
                                {prod_id : prodId}
                        ])
                        req.db('myCartUpdate', [
                                {pay_yn : 'Y'},
                                {cart_id : cartId}
                        ])
                        res.status(200).send('SUCCESS')
                }

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
                    order_id :  response.data.ORDER_ID,
                    pay_yn : 'Y',
                    servicetype : process.env.VUE_APP_UNIONPAY_SERVICE_TYPE,
                    auth_date :  response.data.AUTH_DATE,
                    cancel_key :  response.data.CANCEL_KEY,
                    order_id :  orderId[0].commSeq,
                    prod_total_cnt : total,
                    use_yn : 'Y',
                    del_yn : 'N'

                }

                console.log("resdata : ", resdata)
                console.log(resdata.rescode)
                const msg_code = resdata.rescode
                req.db('orderInsert', [resdata])
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
                res.status(200).redirect('/orderUnionPayResult?result_code='+msg_code+'&cart_id='+cartId+'&lan_tp='+lanTp)
            }).catch(err => {
                err
            })
        }
    } catch (error) {
        console.log("catch error : ",error)        
    }
})

const rule = new schedule.RecurrenceRule()
rule.hour = 4;
// 환율 배치
const regularExec = schedule.scheduleJob(rule, async()=>{ // 매일 낮 12시 정각마다 실행
    // req.db('exchangeDelete', {})
    let ymdDate = utils.$dateFormat('ymddate')
    let url = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey="+`${process.env.VUE_APP_API_EXCHANGE_KEY}`+"&searchdate="+`${ymdDate}`+"&data=AP01"
    console.log("환율배치 시작")
    await axios({
        method: 'post',
        url,
    }).then(res => {
        console.log("res : ",res.data)
        console.log("res : ",res.data.length)
        for(let resData of res.data) {
            let data = {
                result : resData.result,
                cur_unit : resData.cur_unit,
                ttb : resData.ttb,
                tts : resData.tts,
                deal_bas_r : resData.deal_bas_r,
                bkpr : resData.bkpr,
                yy_efee_r : resData.yy_efee_r,
                ten_dd_efee_r : resData.ten_dd_efee_r,
                kftc_bkpr : resData.kftc_bkpr,
                kftc_deal_bas_r : resData.kftc_deal_bas_r,
                cur_nm : resData.cur_nm,
            }
            req.db('exchangeInsert', [data, data])
        }
        res.redirect('302', '/')
        // res.send('ok')
        
    }).catch(err => {
        err
    })
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
        res.send(await req.db(request.params.alias, request.body.param));
        
    } catch (err) {
        // res.status(500).send({
        //     error : err
        // });
        if(err.code != 'ER_DUP_ENTRY')
            console.log("err  :",err);
        resolve({
            err
        });
    }
});