const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');//직접 만든 미들웨어 가져다 씀.
const User = require('../models/user');

const router = express.Router();//라우터 생성

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    //회원 가입은 isNotLoggedIn을 통과(로그안 안한 상태라 next 호출 )해야됨(로그인 안한 사람들만.)
    const {email, nick, password} = req.body; //프론트에서 보내주는것.
    try{
        const exUser = await User.findOne({ where: {email}});
        //기존에 그 이메일로 가입한 사람이 있는지 검사
        if(exUser){
            return res.redirect('/join?error=exist');
            //이미 가입한 이메일
            //error=exist를 보고 프론트에서 판단.
        }
        const hash = await bcrypt.hash(password, 12);
        //해시에 들어간 12는 얼마나 복잡하게 해시를한건지 나타낸것.(복잡하면 더 오래걸림) - 1초정도 걸리게 해놓음
        //비밀번호는 해시화 해서 저장해야됨
        await User.create({
            email,
            nick,
            password: hash,//비밀 번호는 해시화 해서 저장
        });//유저를 생성 후.
        return res.redirect('/');//메인 페이지로(회원가입 완료.)
    } catch(error){
        console.error(error);
        return next(error);//
    }
});

//로그인 할때는 카카오 로그인 할때랑 이메일/비밀번호로 로그인 할때랑
//달라짐 . (세션문제도 있음) 로직이 복잡해질 수 있으니 간편하게 하기위해 passport라는 
//라이브러리를 사용. (코드가 깔끔 해짐.)

router.post('/login', isNotLoggedIn, (req, res, next) => {
    //passport.authenticate도 미들웨어다.
    passport.authenticate('local', (authError, user, info) => {//(done함수 호출되면 다시 여기로옴!!)
        //local이 실행 되면 패스포트가 localStrategy를 찾는다.
        //passport 폴더안에 local을 localStrategy로 등록해놨음.
        //done을 호출했을때 실행 됨.
        if(authError){//서버 에러
            console.error(authError);
            return next(authError);
        }
        if(!user){//로그인 실패 3번째 메시지를 프론트로 돌려보냄
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            //req.login으로 '사용자 객체'를 넣어줌
            //passport index의 serializeUser가 실행됨
            //다시 'done'되면 다시 여기로 돌아와서/
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');//로그인 성공하면 메인 페이지로
            // 여기서 '세션 쿠키'를 브라우저로 보내줌. redirect로 돌아간 순간 세션쿠키가 브라우저로 저장됨
            //로그인된 상태가 되어 서버가 누가 요청 했는지 알게 됨.
        });
    })(req, res, next);//미들웨어를 확장하는 패턴
});

router.get('/logout', isLoggedIn, (req, res) => {//로그인 한 사람만 로그 아웃 할 수 있도록.
    req.logout();//세션 쿠키가 사라짐. -> 로그인이 풀린것
    req.session.destroy();
    res.redirect('/');//로그아웃이된 상태.
});

router.get('/kakao', passport.authenticate('kakao'));
//카카오 로그인 하기 (/auth/kakao)누르면 passport.authenticate('kakao')가 실행됨
// -> kakaoStrategy로 감.
//실행되는 순간 카카오 홈페이지로가서 카카오 로그인을 하게되고,
//로그인 성공하면 카카오가 /kakao/callback 여기로 요청을 보내준다.
//그리고 kakaoStrategy로 가서 검사 쭉 하고 로그인 성공 or 실패 

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {//kakaoStrategy에서 done하면 이쪽으로 옴
  res.redirect('/');
});

module.exports = router;