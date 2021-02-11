const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({//id는 생략 되어있음
      content: {
        type: Sequelize.STRING(140),//트위터 느낌으로
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),//이미지 1개만 올릴 수 있도록.
        //이미지 여러개 만들려면 이미지도 테이블로 만들어야 됨.(일대다 관계로)
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false, //게시글 삭제하면 하드 딜리트 됨.
      charset: 'utf8mb4',//이모티콘 사용가능하게 mb4
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });//다대다 관계
    //through: 'PostHashtag' 다대다 관계라 중간 테이블이 생김
  }
};