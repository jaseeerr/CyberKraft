var express = require('express');
var router = express.Router();
const auth = require('../authentication/auth-admin')
const adminController = require('../controller/admin-controller')
const multer = require('../helpers/multerHelper')

/* GET ADMIN LOGIN. */
router.get('/test',adminController.test);

/* GET ADMIN LOGIN. */
router.get('/login',adminController.adminlogin);

/* GET ADMIN OTP LOGIN. */
router.get('/otplogin',adminController.otplogin);

/* POST ADMIN OTP LOGIN. */
router.post('/otp_submit',adminController.postotp);

/* GET ADMIN OTP RESENT. */
router.get('/resendotp',adminController.resendotp);

/* POST ADMIN LOGIN. */
router.post('/login_submit',adminController.postadminlogin);

/* GET ADMIN LOGOUT. */
router.get('/logout',adminController.adminlogout);

//session handler
router.use(auth.adminAuthentication) 

/* GET home page. */
router.get('/',adminController.admindashboard);

/* GET ADMIN VIEW PRODUCTS. */
router.get('/products',adminController.viewproducts);

/* GET ADMIN EDIT PRODUCTS. */
router.get('/editproducts/:id',adminController.editproducts);

/* POST ADMIN UPDATE PRODUCTS. */
router.post('/updateproduct/:id',multer.array('images'),adminController.updateproduct);

/* GET ADMIN DELETE PRODUCTS. */
router.get('/deleteproduct/:id',adminController.deleteproduct);

/* GET ADMIN ADD PRODUCT. */
router.get('/addproduct',adminController.addproduct);

/* POST ADMIN ADD PRODUCT. */
router.post('/add_product',multer.array('images',4),adminController.postaddproduct);

/* GET ADMIN ORDERS. */
router.get('/orders',adminController.orders);

/* GET ADMIN CATEGORY. */
router.get('/category',adminController.category);

/* POST ADMIN ADD CATEGORY. */
router.post('/addcategory',adminController.addcategory);

/* GET ADMIN EDIT CATEGORY. */
router.get('/editcategory/:id',adminController.editcategory);

/* GET ADMIN update CATEGORY. */
router.post('/updatecategory/:id',adminController.updatecategory);

/* GET ADMIN DELETE CATEGORY. */
router.get('/deletecategory/:id',adminController.deletecategory);

/* GET ADMIN USER INFO. */
router.get('/userinfo',adminController.userinfo);

/* GET ADMIN BLOCK USER. */
router.get('/blockuser/:id',adminController.blockuser);

/* GET ADMIN UNBLOCK USER. */
router.get('/unblockuser/:id',adminController.unblockuser);

/* GET ADMIN BANNER. */
router.get('/banner',adminController.banner);

/* GET ADMIN NEW BANNER. */
router.get('/newbanner',adminController.newbanner);

/* post ADMIN BANNER. */
router.post('/banner_submit',multer.single('image'),adminController.postbanner);

/* GET ADMIN NEW BANNER. */
router.get('/deletebanner/:id',adminController.deletebanner);

/* GET ADMIN VIEW FEATURED ITEM. */
router.get('/featured',adminController.featured);

/* GET ADMIN ADD FEATURED ITEM. */
router.get('/addfeatured',adminController.addfeatured);

/* POST ADMIN ADD FEATURED ITEM. */
router.post('/featured_submit',multer.single('image'),adminController.postfeatured);

/* GET ADMIN DELTE FEATURED ITEM. */
router.get('/deletefeatured/:id',adminController.deletefeatured);

/* GET ADMIN Orders. */
router.get('/orders',adminController.orders);

/* GET ADMIN Orders. */
router.get('/editorder/:id',adminController.editorder);

/* POST ADMIN  update Orders. */
router.post('/updateorder/:id',adminController.updateorder);

/* GET ADMIN offer. */
router.get('/offers',adminController.offer);

/* GET ADMIN add offer. */
router.get('/addoffers/:id',adminController.addoffers);

/* POST ADMIN add offer. */
router.post('/addoffer/:id',adminController.postaddoffer);

/* GET ADMIN add offer. */
router.get('/editoffer/:id',adminController.editoffer);

/* POST ADMIN add offer. */
router.post('/editoffer/:id',adminController.posteditoffer);

/* GET ADMIN delete offer. */
router.get('/deleteoffer/:id',adminController.deleteoffer);

/* GET ADMIN view coupon. */
router.get('/coupon',adminController.coupon);

/* POST ADMIN add coupon. */
router.post('/addcoupon',adminController.addcoupon);

/* GET ADMIN edit coupon. */
router.get('/deletecoupon/:id',adminController.deletecoupon);

/* GET ADMIN SALES REPORT DATE SELECTOR. */
router.get('/report',adminController.report);

/* GET ADMIN CUSTOM REPORT. */
router.post('/customreport',adminController.customreport);

/* GET ADMIN MONTHLY REPORT. */
router.post('/monthlyreport',adminController.monthlyreport);

/* GET ADMIN ANNUAL REPORT. */
router.post('/annualreport',adminController.annualreport);



module.exports = router;
