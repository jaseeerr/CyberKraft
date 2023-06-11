var express = require('express');
var router = express.Router();
const userController = require('../controller/user-controller')

const auth = require('../authentication/auth-user')
const productHelper = require('../helpers/productHelper')
//SESSION HANDLER
router.use(productHelper.productCheck)



/* GET users homepage. */
router.get('/',userController.homepage);

/* GET offers . */
router.get('/offer',userController.getoffers);

/* GET users contact. */
router.get('/contact',userController.contact);


/* GET users contact. */
router.get('/blocked',userController.block);

/* GET users login. */
router.route('/login')
.get(userController.userlogin)
.post(userController.postuserlogin)


/* GET users logout. */
router.get('/logout',userController.userlogout);

/* GET users signup. */
router.get('/signup',userController.usersignup);

/* POST users signup. */
router.post('/signup_submit',userController.postusersignup);

/* GET users product details. */
router.get('/product/:id',userController.productdetails);


/* GET users product details. */
router.get('/offerproduct/:id',userController.offerproductdetails);

/* GET users otp login details. */
router.get('/otplogin',userController.otplogin)

/* POST users otp login phone. */
router.post('/postnumber',userController.postnumber)

/* GET users otp code. */
router.get('/otpcode',userController.otpcode)

/* POST check otp code. */
router.post('/checkotp',userController.checkotp)

/* GET all products . */
router.get('/shop',userController.shop)

/* GET product by category. */
router.get('/shop/:id',userController.bycategory)

/* GET offer by category. */
router.get('/offer/:id',userController.offerbycategory)

/* GET FORGOT PASSWORD. */
router.get('/forgotpassword',userController.forgotpassword)

/* POST FORGOT PASSWORD. */
router.post('/forgot_password',userController.finduser)


/* POST SEARCH. */
router.post('/search',userController.search)














//SESSION HANDLER
// router.use(auth.userAuthentication)

/* GET users profile. */
router.get('/profile',auth.userAuthentication,userController.userprofile);

/* GET users new password. */
router.get('/changepassword',userController.changepassword);

/* POST users check password. */
router.post('/checkotpforpass',userController.checkotpforpass);

/* POST users check password. */
router.post('/updatepassword',userController.updatepassword);

/* GET users new password. */
router.get('/newpassword',userController.newpassword);

/* GET users sent otp. */
router.get('/sendotp',userController.sendotp);

/* GET delete address. */
router.get('/deladdress/:id',auth.userAuthentication,userController.deleteaddress);

/* POST add address. */
router.post('/addaddress',auth.userAuthentication,userController.addadress);

/* POST update profile. */
router.post('/updateprofile/:id',auth.userAuthentication,userController.updateprofile);

/* GET users account. */
router.get('/account',auth.userAuthentication,userController.account);

/* GET users cart. */
router.get('/cart',auth.userAuthentication,userController.viewcart);

/* POST users account. */
router.post('/cartupdate',auth.userAuthentication,userController.cartupdate);


/* POST users ADD TO CART. */
router.post('/addtocart/:id',auth.userAuthentication,userController.addtocart);

/* GET users delete cart item. */
router.get('/deletecartitem/:id',auth.userAuthentication,userController.deletecartitem);

/* GET users clear cart. */
router.get('/clearcart/:id',auth.userAuthentication,userController.clearcart);

/* GET wishlist. */
router.get('/wishlist',auth.userAuthentication,userController.wishlist);

/* POST add to wishlist. */
router.post('/addtowish/:id',auth.userAuthentication,userController.addtowish);

/* GET remove wish. */
router.get('/deletewish/:id',auth.userAuthentication,userController.deletewish);

/* GET add to cart from  wish. */
router.get('/addtocartfromwish/:id',auth.userAuthentication,userController.addtocartfromwish);

/* GET add to cart from  wish. */
router.get('/addtocartfromshop/:id',auth.userAuthentication,userController.addtocartfromshop);

/* GET checkout. */
router.get('/checkout',auth.userAuthentication,userController.checkout);

/* GET verify razorpay. */
router.post('/verifypayment',auth.userAuthentication,userController.postVerifyPayment);

/* POST Place order. */
router.post('/placeorder',auth.userAuthentication,userController.placeorder);

/* GET clear . */
router.get('/clear',auth.userAuthentication,userController.clear);

/* GET order placed. */
router.get('/orderplaced',auth.userAuthentication,userController.orderplaced);

/* GET order placed. */
router.get('/orderdetails/:id',auth.userAuthentication,userController.orderdetails);

/* GET cancel order . */
router.get('/cancelorder/:id',auth.userAuthentication,userController.cancelorder);

/* GET Return order . */
router.get('/returnorder/:id',auth.userAuthentication,userController.returnorder);

/* POST apply coupon. */
router.post('/applycoupon',userController.applycoupon)

/* GET Remove coupon. */
router.get('/removecoupon',auth.userAuthentication,userController.removecoupon);

/* GET Remove outofstock. */
router.get('/removeoutofstock',auth.userAuthentication,userController.removeoutofstock)


















module.exports = router;
