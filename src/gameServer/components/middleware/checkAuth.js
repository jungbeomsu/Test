import jwt from 'jsonwebtoken';

const jwtSecret = "xmfpql!ajrmzjq!"; //TODO: server의 그것과 맞추기 + 나중에 .env에 넣기

export default function checkAuth(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];

    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({error: 'Authentication failed'});
      } else {
        console.log('-- checkAuth: ', decodedToken);
        res.locals.userId = decodedToken.UserId;
        next();
      }
    });
  } else {
    res.status(401).json({error: 'JWT Token not exist'});
  }
}
