// this file is created to require and work with the passport library
// 1st lets require passport

const passport = require('passport');

// now we need to require the passport local strategy.as per passport LocalStrategy is the required naming convention
const LocalStrategy = require('passport-local').Strategy;

// we neet to require user
const User = require('../models/users');

// now we need to create authentication function
// we need to tell passport to use the local.strategy that we created
// passport.use(new LocalStrategy)({
//     // usernameField is a synatx that is used by passport
//     usernameField : 'email'
//     // we are defining the usernameField as email which we are going to check on
// },
// // once we have defined it, now we wnned to define a call back function. done is an inbuilt to passport
// function(email, password, done){
// // now we need to find the user and establish its identity - the first email thats written in the next line is the email property that we have defined in the users.js file and the second one is the value that has been passed on from above
// User.findOne({email : email},
//     // if user is found
//     function(err, user){
//         if(err){
//             console.log('Error in finding user --> passport');
//             return done(err);
//             // done takes 2 arguments and since its js, we can define just one too

//         }
//         if(!user || user.password != password){
//             console.log('Invalid Username / Password');
//             return done(null, false);
//         }

//         return done(null, user);
//     }
//     );
// }
// );

// the above code is giving an error due to wrong parenthesis - correct code as below - also with async function

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function(email, password, done) {
    try {
        // Find the user based on the email provided
        const user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
            console.log('Invalid Username / Password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> passport');
        return done(err);
    }
}));

// we need to now serialize and de-serialize
// serializing the user to decide which key is to be kept in the cookies. 
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// de-serializing the user from the key in the cookies - the below code not working - therefore new code

// passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log('Error in finding User --> passport');
//             return done(err);
//         }
//         return done(null, user);
//     });
// });

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});


// check if the user is authenticated
passport.checkAuthentication = function (req, res, next){
    // if the user is signed in, then pass on the request to the next function(controllers action)
if(req.isAuthenticated()){
    return next();
}
// if user is not signed in
return res.redirect('/users/sign-in');
}

// set the user for the views
passport.setAuthenticatedUser = function (req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

// now we need to export the passport - not the passport local
module.exports = passport;