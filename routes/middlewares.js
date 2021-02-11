//직접 만든 미들웨어(req, res, next가 있는 함수) 2개.
exports.isLoggedIn = (req, res, next) => { //로그인 했는지 판단.
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');//next가 없으나 안 넘어감.
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {//로그인 안 한지 판단.
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
  };