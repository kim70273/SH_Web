const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];//설정파일 개발용(development)가져오는것. 객체를 config안에 담아 둠
//env가 따로 값을 설정하지 않으면 development

/* 만들어야할 모델들  */
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);//설정들을 연결

db.sequelize = sequelize;
db.User = User; //팔로잉 팔로워 다대다 관계(사용자와 사용자간의 관계.)
db.Post = Post;//사용자와 게시글은 일대다/ 게시글과 해시태그는 다대다 관계
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;