const passport = require('passport');
const local = require('./localStrategy'); //패스포트에는 로그인을 어떻게 할지 적어둔 '전략'(로그인 로직)이 있다.
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);//세션에 user의 id만 저장(서버 메모리가 한정 되어있으므로)
        //실무에서는 메모리에 저장하면 안됨. 사용자가 수억명이면 용량을 못 버팀
    });

    passport.deserializeUser((id, done) => {//(세션)id만 가지고있다가
        //필요할때 정보를 복구
        User.findOne({
            where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],//팔로잉과 팔로워 부분을 만들어줌.
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
    kakao();
};