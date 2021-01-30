/* 패키지들을 가져옴. */
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
/* 라우터 부분(나중에 따로 생성) */
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8001);
//기본적으로 8001번 포트를 쓰면서
//배포할때는 80번 또는 443번포트를 씀.(개발할때 배포할때 다르게 하기위해)
app.set('view engine', 'html');/* Nunjucks 설정 */
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync({force: false})//서버 연결하면서 시퀄라이즈 연결
.then(()=>{//force: true하면 테이블 수정 되면서 기존 데이터 날아갈 수 있음.
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.log(err);
});//시퀄라이즈 싱크는 프로미스이기때문에 then, catch 붙여주면 좋다.
//npm start하면 테이블들이 생성됨. 만약 생성안된다면 오타를 확인.

/* 6장 */
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

/* 페이지라우터 연결 */
app.use('/',pageRouter);
app.use('/auth',authRouter)

/* 찾는 것이 없을 때. 404처리 미들웨어   */
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);//에러 미들웨어로 넘겨줌
});

/* 에러 미들웨어(next를 안 쓰더라도 꼭 4개 쓰기.) */
app.use((err, req, res, next) =>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err :{};
    //배포 모드일때는 안보이도록.
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});