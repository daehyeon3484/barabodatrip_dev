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
const FormData = require('form-data');
// const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');
const schedule = require('node-schedule')
const iconv = require('iconv-lite');
const testdate = utils.$dateFormat('filedate')
console.log(testdate)
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const path = require("path");
const multer = require('multer');
// const passportConfig = require('./passport');
// passportConfig(app);
const req = require('../model/database.js')





// const form_data = multer();
// const bodyParser = require('body-parser');
// const cheerio = require('cheerio');
// const request = require('request');

const qs = require('qs');
dotenv.config({path: './.server.env'});
// dotenv.config({path: './.server.production.env'});
// let url = process.argv[2]
// request(url, function(error, response, html){
//     if (error) {throw error};

//     console.log (html);
// });
app.use(express.static(path.join(process.env.VUE_APP_STATIC_FILE_PATH)));
// const request = require('request')
// const http = require('http');
// http.createServer(function (req, res) {
//     console.log("req : ", req)
//     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//     res.write('<h1>들어온다</h1>')
//     res.end('<p>hello server</p>')
//     if (req.originalUrl === '/paymentCallBack/1/2/3/4') {
//         console.log("req2 : ", req)
//     }
    
// }).listen(3001,() => {
//     console.log('3003 포트에서 서버 대기중')
// })

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.text());
// app.use(bodyParser.text({ type: 'text/html' }))
// app.use(bodyParser.text({type: 'text/html' }));

// app.use(function (req, res) {
//     res.setHeader('Content-Type', 'text/html')
//     res.write('you posted:\n')
//     res.end(JSON.stringify(req.body, null, 2))
//   })
// bodyParser.text(['text/html'])
// app.use(bodyParser.text({type:"*/*"}));
// app.use(form_data.array());

const StringDecoder = require('string_decoder').StringDecoder;
const http = require('http');
const querystring = require('node:querystring');
// const httpServer = http.createServer((req, res) => {
//   const decoder = new StringDecoder('utf-8');
//   let buffer = '';

//   req.on('data', (chunk) => {
//     buffer += decoder.write(chunk);
//   });

//   req.on('end', () => {
//     buffer += decoder.end();
//     res.writeHead(200, 'OK', { 'Content-Type': 'text/html'});
//     res.write('the response:\n\n');
//     res.write(buffer + '\n\n');
//     res.end('End of message to browser');
//   });
// }).listen(3002, () => console.log('Listening on port 3002') )

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

// passport 카카오톡 로그인
// ===================================카카오로그인 구현 스타트============================================/
app.use(passport.initialize()); // passport를 초기화 하기 위해서 passport.initialize 미들웨어 사용

const newUser = ""
passport.use(
    new KakaoStrategy({
        clientID: process.env.VUE_APP_KAKAO_API_KEY, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: process.env.VUE_APP_KAKAO_CALLBACK_URL, // 카카오 로그인 Redirect URI 경로
    },
    // clientID에 카카오 앱 아이디 추가
    // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
    // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
    // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
    async (accessToken, refreshToken, profile, done) => {
        try {
            
            console.log('kakao 들어오냐?')
            const exUser = await req.db("memInfo", [{mem_email : profile._json.kakao_account.email}]);
            // 이미 가입된 카카오 프로필이면 성공
            console.log("exUser : ",exUser)
            if (exUser[0]) {
                done(null, exUser); // 로그인 인증 완료
            } else {
                // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                let memId = await req.db('commSequences', ['MEM','mem_id','10'])
                newUser = await req.db('signUp', {
                    mem_id : memId[0].commSeq,
                    mem_sns_id: profile.id,
                    mem_email: profile._json.kakao_account.email,
                    mem_nick: profile._json.properties.nickname,
                    mem_nm : profile.username,
                    mem_profile_path : profile._json.properties.thumbnail_image,
                    sns_type : profile.provider,
                    mem_token : accessToken,
                    use_yn : 'Y',
                    reg_date : utils.$dateFormat('filedate') 
                });
                // console.log("newUser11 : " , newUser)
                // console.log("done : ",done)
                done(null, newUser)
            }
            // for(let key in newUser) {
            //     session[key] = newUser[key]
            // }
            // session.save(function() {
            //     done(null, newUser); // 회원가입하고 로그인 인증 완료
            // })
        } catch (error) {
            console.error(error);
            done(error);
        }
    },
    ),
);
passport.serializeUser((user,done)=>{ 
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    done(null,user);
});

const userRouter = require('../routes/user.js');

app.use('/auth', [userRouter, newUser]);

// router.get('/auth/kakao', passport.authenticate('kakao'))

// router.get('/logout', (req,res) => {
//     // req.logout()
//     console.log(req,req)
//     req.session.destroy()
//     res.redirect(process.env.VUE_TRIP_WEB_URL)
// })

// router.get('/auth/kakao/callback', passport.authenticate('kakao', {
//     failureRedirect : process.env.VUE_TRIP_WEB_URL,
// }), (req, res) => {
//     console.log("kakao")
//     console.log("request.body.param[0] : ", request.body.param[0] )
//     // for(let key in request.body.param[0]) {
//     //     req.session[key] = req.body.param[0][key]
//     // }
//     // req.session.save(function() {
//     //     res.status(200).send('ok')
//     // })
//     // console.log("res : ", res)
//     // res.redirect(process.env.VUE_TRIP_WEB_URL)
// })
// ===================================카카오로그인 구현 끝============================================/



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

// app.post('/api/logout', async (request, res) =>{
//     request.session.destroy();
//     res.send('ok');
// });
// /upload/PASSPORT/${filepath}/${this.resParam.mem_id}/${this.resParam.prod_id}/${sortSeq}
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
// // 상품등록      
// app.post('/upload/:filepath/:prodId/:type/:fileId/:fileName', async (request, res) => {
//     let {
//         filepath,
//         prodId,
//         fileName,
//         type,
//         fileId
//     } = request.params;
//     console.log("upload 파일 1 : ", fileId,prodId, type);
//     let dir = "";
//     let param = {};
//     dir = process.env.VUE_APP_FILE_PATH+`\/${filepath}/${prodId}/${type}`;
//     // dir = `D:\\vueproject\\uploads\/${filepath}/${prodId}/${type}`;
//     const file = `${dir}/${fileName}`;
//     if(request.body.date) return fs.unlink(file, async (err) => res.send({
//       err  
//     }));
//     const data = request.body.data.slice(request.body.data.indexOf(';base64,') + 8);
//     if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     fs.writeFile(file, data, 'base64', async (error) => {
//         if(error) {
//             res.send({
//                 error
//             });
//         } else {
//             res.send('ok');
//         }
//     });
// });

app.get('/download/:filePath/:prodId/:fileType/:fileName', (request, res) => {
    console.log("상품다운로드")
    const {
        filePath,
        fileName,
        prodId,
        fileType
    } = request.params;
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}/${fileType}/${fileName}`;
    // const filepath = `D:\\vueproject\\uploads\/${filePath}/${prodId}/${fileType}/${fileName}`;
    // const filepath = `C:\\project\\uploads\/${filePath}/${prodId}/${fileType}/${fileName}`;
    
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
    // const filepath = `/var/www/html/uploads\/${filePath}/${prodId}`;
    const filepath = process.env.VUE_APP_FILE_PATH+`\/${filePath}/${prodId}`;
    // const filepath = `D:\\vueproject\\uploads\/${filePath}/${prodId}`;
    // const filepath = `C:\\project\\uploads\/${filePath}/${prodId}`;
    
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

app.post('/testResult', async(request,res) => {
    let url = process.env.VUE_APP_API_UNIONPAY_URL
    let result = request.body
    // const headers = {
    //     "Content-Type" :"application/x-www-form-urlencoded;euc-kr",
    //     "Accept-Language" :"gx"
    // }
    encoding: null
    console.log(res)
    let body = ""
    let decodedBody = ""
    res.on('data',async function(chunk) {
        body += chunk
    });
    console.log("body : ",iconv.decode(data, "UTF-8").toString())
    res.on('end',async function() {
        decodedBody = iconv.decode(body, 'win1252');
    })
    let data = utils.$resultUnionParam(decodedBody)
    // mem_id : memId,
        // prod_id : prodId,
        // pay_type : payType,
        // pay_yn : 'Y',
    console.log("result : ", data)
    res.status(200).send('ok')
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

// const req = {
//     async db(alias, param = [], where = '') {
//         return new Promise((resolve, reject) => 
//             dbPool.query(sql[alias].query + where, param, (error, rows) => {
//             if (error) {
//                 if(error.code != 'ER_DUP_ENTRY')
//                     console.log(error);
//                 resolve({
//                     error
//                 });
//             } else {
//                 resolve(rows) 
//                 console.log("alias : ", alias)
//                 console.log("param : ", param)
//             } 
//         }));
//     }
// };

