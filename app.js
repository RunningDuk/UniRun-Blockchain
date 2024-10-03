const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis').default; // 세션을 매개변수로 전달해 호출
const redisClient = require('./config/redis-client'); // redisClient.js에서 가져옴

app.use(express.json());
app.use(cookieParser());

// 세션 설정
app.use(session({
    name: 'SESSIONID',
    store: new RedisStore({ client: redisClient }), // Redis 세션 저장소 사용
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 30
    }
}));

const {sequelize} = require('./models');
sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error(err));

// 토큰 라우터 설정
const tokenRouter = require('./routes/token-router');
app.use('/block-chain/token', tokenRouter);

// 서버 시작
app.listen(process.env.PORT || 3001, () => {
    console.log(`Unirun blockchain server: ${process.env.PORT || 3001} port`);
});