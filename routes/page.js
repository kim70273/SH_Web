const express = require('express');
const {Post, User} = require('../models');
const router = express.Router();

/* 팔로워/팔로잉 구현 때 쓸 부분. */
router.use((req, res, next) => {
    res.locals.user = req.user; //모두 req.user들어가도록
    //같은 변수를 모든 라우터에 다 넣는 경우.
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
router.get('/', async (req, res, next) =>{
    try {
        const posts = await Post.findAll({
          include: {
            model: User,
            attributes: ['id', 'nick'],
          },
          order: [['createdAt', 'DESC']],
        });
        res.render('main', {
          title: 'NodeBird',
          twits: posts,
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
});

module.exports = router;