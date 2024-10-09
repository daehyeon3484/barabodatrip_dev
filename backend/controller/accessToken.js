const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});

const startKakaoLogin = (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_CALLBACK_URL}&response_type=code&scope=profile_nickname,profile_image,account_email`
    // res.redirect(kakaoAuthURL);
    res.status(302).redirect(kakaoAuthURL);
};

module.exports = startKakaoLogin