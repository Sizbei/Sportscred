const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/user');

const cookieExtractor = req => {
    let token = null;
    // check if the cookies in req is not empty
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
}

// authorizaion to protect the end point
passport.use(new jwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : "SportCredKey"
}, (payload, done) => {
    User.findById({_id : payload.sub})
        .then(User => {
            if (User) {
                return done(null, User);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, false));
}));

// authenticated using username and password
passport.use(new localStrategy((username, password, done) => {
    User.findOne({username : username})
        .then(User => {
            // if no user exists
            if (!User) {
                return done(null, false);
            // if the password given is not match with user's password
            } if (User.password !== password) {
                return done(null, false);
            } else {
                // pass the user in the done function
                done(null, User);
            }
        })
        .catch(err => done(err, false));
}));