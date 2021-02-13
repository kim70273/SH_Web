//팔로잉, 팔오워는 사용자에 관련된 것이니. 사용자관련 라우터 생성
const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

//POST user/1/follow
//내가 1번 사용자인지, 내가 1번 사용자를 팔로우 하는것 인지는 정해줘야됨.
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {//로그인이 되어 있어야 팔로우 가능
  try {
    const user = await User.findOne({ where: { id: req.user.id } });//내가 누군지 찾기.
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));//내가 ㅁ번 사용자를 팔로잉, 관계에서 as로 이름 설정해준것.
      //setFollowings는 수정 하는것.(set을 쓰면 기존것을 통째로 대체하는것이니 주의.)
      //removeFollowings는 제거. / 가져오는것은 getFollowings
      //Followings로 복수니까 여러개가 들어갈 수 있어서. 배열로 복수개 넣을 수 있음.
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;