const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{//클래스가 모델이 된다.(mysql의 테이블)
    static init(sequelize){//정해진 형식.
        return super.init({//시퀄라이즈에서 id는 생략 되어있다.
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,//빈 값 2개는 같은거로 안침
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),//해시화 될때 길게 됨
                allowNull: true,//카카오 로그인등일 때 비밀번호가 없을 수도 있다.
            },
            provider:{
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',//무엇을통해 로그인 되었는지.
                //카카오 로그인만 추가로 제공될 거라 local 또는 카카오
            },
            snsId:{//카카오 네이버등 으로 로그인하면 snsId를 저장하고 id로 쓸수 있음
                type:Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,//생성일, 수정일
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,//생성일 수정일 삭제일이 기록됨.
            charset: 'utf8',//한글 지원되도록.
            collate: 'utf8_general_ci',
        });
    }

    /* 관계 부분 */
    static associate(db){
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignkey: 'followingId',
            as: 'Followers',//3번 followingId의 팔로워들을 가져올 수 있도록.
            through: 'Follow',//중간 테이블
        });
        db.User.belongsToMany(db.User, {
            foreignkey: 'followerId',//내 아이디로 검색해서 팔로잉을 알 수 있다.
            as: 'Followings',//foreignkey와 반대 
            through: 'Follow',
        });//사용자 테이블간의 관계. 팔로잉 팔로워 
        //foreignkey를 넣어주지않으면 둘다 유저아이디라 누가 팔로잉이고 팔로워인지
        //구분이 안됨.
    }
};