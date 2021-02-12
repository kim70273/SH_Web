const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');//uploads 폴더가 없으면 새로 생성
  fs.mkdirSync('uploads');
}

const upload = multer({ //multer자체는 미들웨어가 아니다. 우선 multer 설정.
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/'); //uploads 폴더에 이미지 업로드.
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);//파일명(날짜와 확장자명 까지.)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },//5메가 바이트 제한
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {//로그인 한 사람이 요청 보냄.
    //form에서 img를 가져오고 이 미들웨어가 실행 됨.
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });//요청과 실제 주소가 다르다.(static을 app.js에서 사용.)
  //ulr은 다시 프론트로 보내줘서 이미지와 게시글을 엮어줌.
});
//이미지 업로드, 게시글 업로드 따로 하는 이유:
//이미지를 업로드 해서 서버에서 압축하는 동안 글을 작성하면 시간을 더 아낄 수 있다.

router.post('/', isLoggedIn, upload.none(), async(req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            img:req.body.url,
            UserId: req.userid,
        });
        res.redirect('/');
    }
    catch(error){
        console.error(error);
        next(error);
    }
});

// const upload2 = multer();
// router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
//   try {
//     const post = await Post.create({
//       content: req.body.content,
//       img: req.body.url,
//       UserId: req.user.id,
//     });
//     const hashtags = req.body.content.match(/#[^\s#]*/g);
//     if (hashtags) {
//       const result = await Promise.all(
//         hashtags.map(tag => {
//           return Hashtag.findOrCreate({
//             where: { title: tag.slice(1).toLowerCase() },
//           })
//         }),
//       );
//       await post.addHashtags(result.map(r => r[0]));
//     }
//     res.redirect('/');
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;