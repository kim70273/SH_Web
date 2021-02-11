const express = require('express');

const router = express.Router();

/* 팔로워/팔로잉 구현 때 쓸 부분. */
router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

/* 모두 /로 시작한다. */
router.get('/profile', (req, res) => {
    res.render('profile', {title: '내 정보 - SH_Web'});
});

router.get('/join', (req, res) => {
    res.render('join', {title: '회원가입 - SH_Web'});
});

//메인 페이지. 페이지들은 views에 만드렁 준다. (실무에서는 넌적스보단 리액트나 뷰 같은 것을 씀.)
//프론트에서 백엔드로 보내는 요청을 중심적으로 본다!
router.get('/', (req, res, next) =>{
    const twits = [];//메인 게시물 넣어줄 공간.
    res.render('main', {
        title: 'SH_Web',
        twits,
        user:req.user,//유저가 존재하면 존재할때 뜨는 html파일이 다름.
    });
});

module.exports = router;