const express = require('express')
const userController = require('../controllers/userController')
const profileController = require("../controllers/profileController")
const cartController = require("../controllers/cartController");
const router = express.Router()

router.get('/',(req, res)=>{res.render('../views/layout/main')})
router.get('/login',(req, res)=>{res.render('../views/auth/login')})
router.get('/register',(req, res)=>{res.render('../views/auth/register')})
router.get('/gallery',(req, res)=>{res.render('../views/gallery/gallery')})
router.get('/course',(req, res)=>{res.render('../views/layout/course')})
router.get('/teacher',(req, res)=>{res.render('../views/layout/teacher')})
router.get('/admin',(req, res)=>{res.render('../views/user/admin')})
router.get('/profile',(req, res)=>{res.render('../views/user/profile')})
router.get('/about',(req, res)=>{res.render('../views/layout/about')})


router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.post('/', profileController.profile)

// router.post("/:userId", cartController.addItemToCart)
// router.get("/:userId", cartController.getCart)
// router.patch("/:userId", cartController.decreaseQuantity)
// router.delete("/:userId", cartController.removeItem)

module.exports = router