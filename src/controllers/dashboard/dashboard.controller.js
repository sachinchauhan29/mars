
const dashboardView = async (req, res, next) => {
    res.render('account', { message: req.session.message });
}

const dashboardBackView = async (req, res, next) => {
    res.redirect('/dashboard');
}

module.exports = {
    dashboardView,
    dashboardBackView
}