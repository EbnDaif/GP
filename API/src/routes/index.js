const router=require("express").Router()
router.use("/auth", require("./authRoutes"))
router.use("/users", require("./userRoutes"))
router.use('/article', require('./article.route'));
router.use('/videos', require('./video.route'));
router.use('/sounds', require('./sleep_sounds.route'));
module.exports=router
