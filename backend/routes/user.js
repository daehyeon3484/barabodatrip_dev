const express = require('express');
const router = express.Router();
const passport = require('passport');
const dotenv = require("dotenv");
dotenv.config({path: '../.server.env'});
const jwt = require('jsonwebtoken');
const kakaoAuth = require('../kakaoauth/kakaoAuth');

// router.get('/kakao', passport.authenticate('kakao'), (request,res) => {
//     console.log("res :", res)
//     console.log("request :", request)
// });
// router.get('/kakao', passport.authenticate('kakao'))

// router.get('/kakao', async (req, res) => {
//     try{
//       let userEmail = "";
//       let userNickName = "";
//       if (req.body.access_token) {
//       //초기 로그인
//         const result = await kakaoAuth.getProfile(req.body.access_token);
//         const kakaoUser = JSON.parse(result).kakao_account;
//         userEmail = kakaoUser.email;
//         userNickName = kakaoUser.profile.nickname;
//       } else {
//       //자동 로그인
//         const user = jwt.verify(req.headers.authorization, process.env.VUE_APP_JWT_SECRET, {
//           ignoreExpiration: true,
//         });
//         userEmail = user.email;
//       }
//       let memId = await req.db('commSequences', ['MEM','mem_id','10'])
//       const newUser = await req.db('signUp', {
//           mem_id : memId[0].commSeq,
//           mem_sns_id: profile.id,
//           mem_email: profile._json.kakao_account.email,
//           mem_nick: profile._json.properties.nickname,
//           mem_nm : profile.username,
//           mem_profile_path : profile._json.properties.thumbnail_image,
//           sns_type : profile.provider,
//           mem_token : accessToken,
//           use_yn : 'Y',
//           reg_date : utils.$dateFormat('filedate') 
//       });
  
//       let responseData = {
//         success: true,
//         user,
//       };
  
//       if (req.body.access_token) {
//         const token = jwt.sign({
//           id: user.id,
//           email: userEmail,
//         }, process.env.JWT_SECRET, {
//           issuer: 'bbangsoon',
//         });
//         responseData.jwt = token;
//       }
  
//       return res.status(created? 201: 200).json(responseData);
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         error: err.toString(),
//       });
//     }
//   });

// router.post('/kakao', async (req, res) => {
//     // req.logout()
//     console.log(req,req)
//     req.session.destroy()
//     res.redirect('/')
// })

// router.get('/kakao/callback', passport.authenticate('kakao', [{
//     failureRedirect : process.env.VUE_TRIP_WEB_URL,
    
// }]), (req, res) => {
//     console.log("kakao")
//     // console.log("res : ", req)
//     res.redirect(process.env.VUE_TRIP_WEB_URL)
// })

module.exports = router;