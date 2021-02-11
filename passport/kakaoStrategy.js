/* 카카오로 로그인 */
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {//accessToken과 refreshToken은 실무에서 사용함
    //토큰으로 카카오한테 사용자 정보 달라 요청 하는 용도.
    console.log('kakao profile', profile);//여기서는 프로필만 받아 온다.
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' },
      });
      if (exUser) {
        done(null, exUser);//가입한 사람이 있으면 성공.
      } else {//가입 안 되어 있으면 가입시킨다음 로그인 시킴. 회원가입과 로그인이 동시에 일어남
        const newUser = await User.create({
          email: profile._json && profile._json.kakao_account_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};