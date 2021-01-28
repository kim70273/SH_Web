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

router.get('/', (req, res, next) =>{
    const twits = [];//메인 게시물 넣어줄 공간.
    res.render('main', {
        title: 'SH_Web',
        twits,
    });
});

module.exports = router;