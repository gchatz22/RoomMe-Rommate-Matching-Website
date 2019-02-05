const passport = require('passport');
const request = require('request');
let GoogleStrategy = require('passport-google-oauth20').Strategy;
let img;


const User = require('./models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        'googleid': profile.id
    }, function (err, user) {

        if (err) return done(err);

            request('https://www.googleapis.com/plus/v1/people/'+profile.id+"?access_token="+accessToken, function (error, response, body){
                data = JSON.parse(body);
                img = data.image.url;
                if(!user) {
                    let space = profile.displayName.indexOf(' ');
                    let fName = profile.displayName.substring(0,space);
                    user = new User({
                        name: profile.displayName,
                        googleid: profile.id,
                        completed_form : false,
                        updatedQ: false,
                        image: img,
                        info: {firstName : fName,
                        lastName:"",
                        country:"",
                        state:"",
                        city:"",
                        gender:"",
                        age:"",
                        classYear:"",
                        dorm:"",
                        major:"",
                        description:"",
                        facebook:"",
                        instagram:"",
                        kerberos:""
                        },
                    });
    
                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
    
                } else {
                    if (user.altImage){
                        user.image = user.altImage;
                    }
                    else {
                        user.image = img;
                    }
                    user.save()
                    return done(err,user);
                }

            })
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  
module.exports = passport;
  