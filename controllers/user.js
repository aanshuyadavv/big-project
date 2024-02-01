const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}


module.exports.signup = async (req, res) => {
    try {

        let { username, email, password } = req.body;
        let newUser = new User({ username, email })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)

        req.login(registeredUser, (err) => {           //req.login is a functionality provided by passport to login
            if (err) {
                return next(err)
            }

            req.flash("success", "Welcome to Wanderlust")
            res.redirect("/listings")

        })


    } catch (e) {
        // console.log(e.message)
        req.flash("error", e.message)
        res.redirect("/signup")
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")

}

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust")
    res.redirect("/listings")
}

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {            //req.logout is a functionality given by passport for logging out
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
}