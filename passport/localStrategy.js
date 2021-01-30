const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', //req.body.email
    passwordField: 'password',//req,body.password
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      //이메일 가진 사람 있는지 확인.
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        //해시화된 비밀번호와 비교
        if (result) {
            //done은 3개의 인자 1번째는 서버에러
            //성공한 경우는 2번째 인자.
            //3번째는 로그인 실패 메시지
            //done 함수 호툴하면 
            //auth.js의 'local' , (authError, user, info ) 이쪽 함수로 감.
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });//이메일이 없을때.
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};