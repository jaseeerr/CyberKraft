const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')
const cart = require('../models/cart')
const banner = require('../models/bannerSchema')
const Featured = require('../models/featuredSchema')
const Wish = require('../models/wishlist')
const Coupon = require('../models/coupon')
const Address = require('../models/address')
const Order = require('../models/orderSchema')
const Offer = require('../models/offer')
const SSID = process.env.SSID
const twilio = require('twilio');
const TWILIO_ACCOUNT_SID = process.env.ASID
const TWILIO_AUTH_TOKEN = process.env.AUTH
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const razorpay = require('razorpay');
const coupon = require('../models/coupon')
const { resolve } = require('path')

var instance = new razorpay({key_id: process.env.keyID, key_secret: process.env.secretKey});


module.exports = {


    sendotp: (phone) => {

        return new Promise((resolve, reject) => {
            client.verify.services(SSID).verifications.create({to: `+91${phone}`, channel: 'sms'}).then(() => {
                resolve()

            })
        })


    },


    checknumber: (phoneid) => {
        return new Promise((resolve, reject) => {

            User.findOne({phone: phoneid}).then((data) => {


                if (data) {
                    let phone = data.phone
                    let name = data.uname
                    let err = false


                    client.verify.services(SSID).verifications.create({to: `+91${phoneid}`, channel: 'sms'}).then(() => {
                        resolve({err, phone, name})

                    })
                } else {
                    resolve({err: true})

                }
            })
        })

    },

    checkotp: (phone, otp) => {


        return new Promise((resolve, reject) => {
            client.verify.services(SSID).verificationChecks.create({to: `+91${phone}`, code: otp}).then((check) => {

                if (check.valid) {

                    User.findOne({phone: phone}).then((userdata) => {

                        resolve({err: false, userdata})
                    })
                } else {

                    resolve({err: true})
                }
            })

        })
    },

    checkotpforpass: (phone, otp) => {

        return new Promise((resolve, reject) => {
            client.verify.services(SSID).verificationChecks.create({to: `+91${phone}`, code: otp}).then((check) => {

                if (check.valid) {


                    resolve({err: false})

                } else {

                    resolve({err: true})
                }
            })

        })

    },

    updatepasssword: (id, password) => {

        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10).then((pass) => {

                User.findByIdAndUpdate(id, {
                    $set: {
                        password: pass

                    }
                }).then(() => {
                    resolve()
                })

            })
        })


    },

    addnewaddress: (data, uid) => {

        return new Promise((resolve, reject) => {


            const address = new Address({


                owner: uid,
                name: data.name,
                address: data.address,
                state: data.state,
                country: data.country,
                pincode: data.pincode,
                phone: data.phone,
                type: data.type

            })


            address.save().then(() => {
                resolve()
            })
        })


    },

    deleteaddress: (id) => {
        return new Promise((resolve, reject) => {

            Address.findByIdAndRemove(id).then(() => {

                let del = true

                resolve(del)
            })
        })

    },

    getaddressbyid: (uid) => {

        return new Promise((resolve, reject) => {

           
            Address.find({owner: uid}).then((data) => {


                resolve(data)

            })
        })


    },

    getoneaddress: (id) => {

        return new Promise((resolve, reject) => {

            Address.findById(id).then((data) => {
                resolve(data)
            })
        })

    },


    updateprofile: (id, update) => {
        return new Promise((resolve, reject) => {

            User.findByIdAndUpdate(id, {
                $set: {
                    uname: update.uname,
                    email: update.email,
                    phone: update.phone

                }
            }).then(() => {

                User.findById(id).then((data) => {

                    resolve({updated: true, data})

                })

            })

        })
    },


    forsignup: (userdata) => {


        return new Promise((resolve, reject) => {

            User.findOne({email: userdata.email}).then((echeck) => {
                if (echeck) {
                    resolve({exemail: true})
                } else {
                    User.findOne({phone: userdata.phone}).then((pcheck) => {
                        if (pcheck) {
                            resolve({exphone: true})
                        } else {
                            bcrypt.hash(userdata.password, 10).then((pass) => {

                                const user = new User({uname: userdata.uname, email: userdata.email, phone: userdata.phone, password: pass})

                                user.save().then(() => {
                                    resolve({existinguser: false, pass: true})
                                })
                            })
                        }
                    })
                }
            })


        })
    },

    forlogin: (userdata) => {
        return new Promise((resolve, reject) => {


            User.findOne({email: userdata.email}).then((echeck) => {

                if (echeck != null) {


                    bcrypt.compare(userdata.password, echeck.password).then((pass) => {
                        if (pass) {

                            let userdata = echeck


                            if (echeck.block) {
                                resolve({login: false, block: true})
                            } else {
                                resolve({login: true, userdata})
                            }
                        } else {
                            resolve({login: false})
                        }
                    })
                } else {

                    User.findOne({phone: userdata.email}).then((pcheck) => {

                        if (pcheck != null) {
                            bcrypt.compare(userdata.password, pcheck.password).then((pass) => {
                                if (pass) {
                                    let userdata = pcheck
                                    if (pcheck.block) {
                                        resolve({login: false, block: true})
                                    } else {
                                        resolve({login: true, userdata})
                                    }
                                } else {
                                    resolve({login: false})
                                }
                            })
                        } else {
                            resolve({login: false})
                        }
                    })
                }
            })


        })
    },

    getallproducts: () => {

        return new Promise((resolve, reject) => {
            Product.find({}).then((data) => {
                resolve(data)
            })
        })

    },

    getallbanners: () => {
        return new Promise((resolve, reject) => {

            banner.find({}).then((data) => {
                resolve(data)

            })

        })

    },

    getoneproduct: (id) => {

        return new Promise((resolve, reject) => {

            Product.findById(id).then((data) => {
                resolve(data)
            })
        })

    },

    getcategory: () => {

        return new Promise((resolve, reject) => {

            Category.find({}).then((cat) => {

                resolve(cat)
            })

        })
    },

    viewcart: (uid) => {
        
        return new Promise((resolve, reject) => {

            cart.find({owner: uid}).then((data) => {

                if (data.length == 0) {
                    resolve({empty: true})
                } else {
                    resolve({empty: false, data})
                }


            })
        })

    },

    stockchecker:(items)=>{
        let outofstock = []
        let i = 0 
        
        return new Promise((resolve, reject) => {
            let counter = 0
            
            items.forEach(element => {
                
                console.log("COunterrr "+counter);
                
                Product.findById(element.pid).then((data)=>{

                    if(data.stock==0)
                    {
                       
                        outofstock[i] = element._id
                        i++
                    }
                    
                    counter++
                }).then(()=>{
                    
                    
                       
                    if(counter==items.length)
                    {
                        console.log("CHEESE BURGER PIZZA");
                        console.log(items.length);
                        console.log(outofstock);
                        resolve(outofstock)
                    }
                    
                })

                
            });
        })



    },

    cartstockupdate:(outofstock)=>{

        return new Promise((resolve, reject) => {

            let counter = 0
            
            outofstock.forEach(element => {

                cart.findByIdAndUpdate(element, {
                    $set: {
                        stock: "0"

                    }
                }).then(()=>{
                    counter++
                    if(outofstock.length==counter)
                    {
                        resolve()
                    }
    
                })
                
            })
        })
    },


    cartupdate: (qty1, pid, uid) => {
        return new Promise((resolve, reject) => {
            console.log("PROMISE WORKED");

            cart.findOne({owner: uid, pid: pid}).then((cdata) => {
                let id = cdata._id

                console.log(id + "idddddddd");
                console.log(cdata);
                console.log(qty1);
                cart.findByIdAndUpdate(id, {
                    $set: {
                        qty: qty1

                    }
                }).then(() => {
                    console.log("resolved");

                    resolve()
                })
            })


        })

    },

    addtocart: (productid, userid, qty1, offer, offprice, pid) => {

        console.log(productid);

        return new Promise((resolve, reject) => {

            qty1 = Number(qty1)


            cart.findOne({owner: userid, pid: productid}).then((result) => {


                if (result) {
                    let outforcart = false
                    let id = result._id
                    let more = false
                    let qty2 = Number(result.qty) + Number(qty1)
                    if (qty2 > result.stock) {
                        more = true
                        qty2 = result.stock
                    }


                    cart.findByIdAndUpdate(id, {
                        $set: {
                            qty: qty2

                        }
                    }).then(() => {

                        resolve(more)
                    })


                } else {


                    if (offer == 1) {

                        Product.findById(pid).then((data) => {


                            let more = false
                            if (qty1 > data.stock) {
                                more = true
                                qty1 = data.stock
                            }


                            const cartitem = new cart({


                                owner: userid,
                                pid: data._id,
                                qty: qty1,
                                productTitle: data.productTitle,
                                description: data.description,
                                image: data.image[0],
                                price: offprice,
                                stock: data.stock,
                                category: data.category


                            })


                            cartitem.save().then(() => {
                                resolve(more)
                            })


                        })
                    } else {
                        Product.findById(productid).then((data) => {

                            console.log(data);


                            let more = false
                            if (qty1 > data.stock) {
                                more = true
                                qty1 = data.stock
                            }


                            const cartitem = new cart({


                                owner: userid,
                                pid: data._id,
                                qty: qty1,
                                productTitle: data.productTitle,
                                description: data.description,
                                image: data.image[0],
                                price: data.price,
                                stock: data.stock,
                                category: data.category


                            })


                            cartitem.save().then(() => {
                                resolve(more)
                            })


                        })
                    }


                }

            })


        })
    },


    addtocartfromwish: (pid, uid) => {

        console.log("PRODUCT IDDDDDDDD " + pid);

        return new Promise((resolve, reject) => {
            let exists = false

            cart.find({owner: uid, pid: pid}).then((cdata) => {

                console.log("PRODUCT IDDDDDDDD " + pid + " AND DATAAAAA!!");
                console.log(cdata);

                if (cdata.length != 0) {
                    console.log(cdata);
                    console.log("FROM CDATA");
                    exists = true
                    resolve(exists)
                } else {

                    Product.findById(pid).then((data) => {

                        console.log(data);


                        const cartitem = new cart({


                            owner: uid,
                            pid: pid,
                            qty: 1,
                            productTitle: data.productTitle,
                            description: data.description,
                            image: data.image[0],
                            price: data.price,
                            stock: data.stock,
                            category: data.category


                        })


                        cartitem.save().then(() => {
                            resolve()
                        })

                    })


                }
            })


        })


    },

    addtocartfromhome: (pid, uid) => {

        return new Promise((resolve, reject) => {
            cart.find({owner: uid, pid: pid}).then((cdata) => {

                if (cdata.length != 0) {
                    let exist = true
                    resolve(exist)
                } else {
                    let exist = false
                    Product.findById(pid).then((data) => {


                        const cartitem = new cart({


                            owner: uid,
                            pid: data._id,
                            qty: 1,
                            productTitle: data.productTitle,
                            description: data.description,
                            image: data.image[0],
                            price: data.price,
                            stock: data.stock,
                            category: data.category


                        })


                        cartitem.save().then(() => {
                            resolve(exist)
                        })


                    })

                }
            })
        })

    },

    deletecartitem: (id) => {

        return new Promise((resolve, reject) => {
            cart.findByIdAndRemove(id).then(() => {
                resolve()
            })
        })
    },

    clearcart: (id) => {
        return new Promise((resolve, reject) => {

            cart.deleteMany({owner: id}).then(() => {

                resolve()
            })
        })
    },

    addtowish: (id, userid) => {
        return new Promise((resolve, reject) => {
            Product.findById(id).then((data) => {

                console.log("/////addformoffer/////");
                if (data) {
                    console.log("SHIT IS HERE");
                    const list = new Wish({


                        owner: userid,
                        pid: data._id,
                        productTitle: data.productTitle,
                        description: data.description,
                        stock: data.stock,
                        qty: 1,
                        price: data.price,
                        image: data.image[0]


                    })


                    list.save().then(() => {
                        resolve()
                    })
                } else {
                    Offer.findById(id).then((data1) => {

                        let id1 = data1.pid

                        Product.findById(id1).then((data) => {

                            const list = new Wish({


                                owner: userid,
                                pid: data._id,
                                productTitle: data.productTitle,
                                description: data.description,
                                stock: data.stock,
                                qty: 1,
                                price: data.price,
                                image: data.image[0]


                            })


                            list.save().then(() => {
                                resolve()
                            })


                        })


                    })
                    console.log("SHIT IS'NT HERE");
                }
                console.log(data);


            })
        })

    },

    getwishlist: (uid) => {


        return new Promise((resolve, reject) => {

            Wish.find({owner: uid}).then((data) => {

                if (data.length == 0) {
                    resolve({empty: true})
                } else {
                    resolve({data, empty: false})
                }


            })
        })

    },

    updatewishliststock: (uid) => {


        return new Promise((resolve, reject) => {


            Wish.find({owner: uid}).then((data) => {


                if (data.length != 0) {
                    data.forEach(element => {
                        let wishid = element._id
                        let pid = element.pid

                        Product.findById(pid).then((data) => {


                            let newstock = data.stock


                            Wish.findByIdAndUpdate(wishid, {
                                $set: {
                                    stock: newstock

                                }
                            }).then(() => {
                                resolve()
                            })


                        })

                    })
                } else {
                    resolve()
                }


            })
        })

    },

    getonewish: (pid, oid) => {

        return new Promise((resolve, reject) => {

            Wish.findOne({pid: pid, owner: oid}).then((data) => {


                if (data) {

                    let found = true
                    let wishid = data._id
                    resolve({found, wishid})

                } else {
                    let found = false
                    resolve({found})
                }


            })


        })


    },

    deletewish: (id) => {

        return new Promise((resolve, reject) => {

            Wish.findByIdAndRemove(id).then(() => {

                resolve()
            })
        })

    },

    getfeatured: () => {
        return new Promise((resolve, reject) => {

            Featured.find({}).then((fdata) => {
                resolve(fdata)
            })
        })

    },

    getproductbycategory: (cat) => {
        return new Promise((resolve, reject) => {

            Product.find({category: cat}).then((data) => {
                resolve(data)
            })


        })
    },


    getofferbycategory: (cat) => {
        return new Promise((resolve, reject) => {

            Offer.find({category: cat}).then((data) => {
                resolve(data)
            })


        })

    },

    placeorder: (uid, product, adderss, payment, amount, coupon, code) => {


        return new Promise((resolve, reject) => {


            let currentDate = new Date();
            let date = currentDate.toDateString()

            console.log(date);

            // let options = {year: 'numeric', month: 'long', day: 'numeric'};
            // let date = new Intl.DateTimeFormat('en-US', options).format(currentDate);


            const order = new Order({


                owner: uid,
                date: currentDate.toDateString(),
                products: product,
                address: adderss,
                payment: payment,
                paymentStatus: "Pending",
                amount: amount,
                orderStatus: "Placed"

            })


            order.save().then((data) => {

                if (coupon) {
                    let id = data._id
                    Order.findByIdAndUpdate(id, {
                        $set: {
                            coupon: code

                        }
                    }).then(() => {
                        resolve(order)
                    })
                } else {
                    let id = data._id
                    Order.findByIdAndUpdate(id, {
                        $set: {
                            coupon: "No coupon applied"

                        }
                    }).then(() => {
                        resolve(order)
                    })
                }


                // for (let i = 0; i < product.length; i++) {
                //     let id = product[i]._id
                //     cart.findByIdAndRemove(id).then(() => {
                //         console.log("removed");
                //     })
                // }


            })


        })

    },


    generateRazorpay: (amount, oid) => {

        return new Promise((resolve, reject) => {

            //       let orders = await user.order.findOne({ userid: userId })
            //       console.log("before"+orders);
            //       let order = orders.orders.slice().reverse()
            //             console.log(order+"after");
            //           let orderId=order[0]._id

            // console.log(orderId+"+++++++++++++++++++++++++++");
            //       total = total * 100
            console.log(amount);
            let total = parseInt(amount)
            console.log(total);
            //       console.log(total);
            var options = {
                amount: total * 100,
                currency: "INR",
                receipt: "" + oid
            }
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('new order:', order);


                    resolve(order)
                    // console.log(order);
                }
            })

        })
    },


    verifyPayment: (details) => {
        console.log("rejecttttedd");
        return new Promise((resolve, reject) => {
            try {
                console.log('hlo');
                const crypto = require('crypto')
                let hmac = crypto.createHmac('sha256', "fkBIqrzC0EyHLwl8lQ3eR3kD")
                hmac.update(details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]'])
                hmac = hmac.digest('hex')
                if (hmac == details['payment[razorpay_signature]']) {
                    resolve()
                } else {
                    reject("not match")
                }
            } catch (err) {
                console.log(err)
            }
        })


    },

    getallcart: () => {

        return new Promise((resolve, reject) => {
            cart.find({}).then((data) => {
                resolve(data)
            })
        })

    },


    updatestock: (cart) => {


        return new Promise((resolve, reject) => {


            cart.forEach(element => {
                let id = element.pid
                let qty = element.qty


                Product.findById(id).then((data) => {


                    let newstock = data.stock - qty

                    let stockk = newstock.toString()


                    Product.findByIdAndUpdate(id, {
                        $set: {
                            stock: stockk

                        }
                    }).then(() => {
                        resolve()
                    })


                });


            })
        })
    },


    changePaymentStatus:(oid)=>{

       return new Promise((resolve, reject) => {
        Order.findByIdAndUpdate(oid, {
            $set: {
                paymentStatus: "Successful"

            }
        }).then(()=>{

            resolve()
        })
       })

    },


    // clearcart: (uid) => {

    //     return new Promise((resolve, reject) => {

    //         cart.find({owner: uid}).then((cdata) => {

    //             for (let i = 0; i < cdata.length; i++) {
    //                 let id = cdata[i]._id
    //                 cart.findByIdAndRemove(id).then(() => {})
    //             }

    //         }).then(() => {
    //             resolve()
    //         })
    //     })

    // },


    getorders: (uid) => {

        return new Promise((resolve, reject) => {

            Order.find({owner: uid}).then((data) => {


                resolve(data)
            })
        })
    },

    getorderbyid: (id) => {
        return new Promise((resolve, reject) => {

            Order.findById(id).then((data) => {
                resolve(data)
            })
        })
    },

    cancelorder: (id) => {
        return new Promise((resolve, reject) => {

            Order.findByIdAndUpdate(id, {
                $set: {
                    orderStatus: "Cancelled",
                    // paymentStatus: "Cancelled"

                }
            }).then((order) => {

                if(order.payment=="razorpay")
                {
                    Order.findByIdAndUpdate(id, {
                        $set: {
                            
                            paymentStatus: "refunded"
        
                        }
                    }).then(()=>{
                        resolve()
                    })
                }
                else
                {
                    
                    resolve()
                }
                
            })
        })
    },

    returnorder: (oid) => {

        return new Promise((resolve, reject) => {

            Order.findByIdAndUpdate(oid, {
                $set: {
                    orderStatus: "return requested"

                }
            }).then(() => {
                resolve()
            })
        })
    },


    getofferproducts: () => {

        return new Promise((resolve, reject) => {

            Offer.find({}).then((data) => {

                resolve(data)

            })
        })

    },


    getofferbyid: (id) => {

        return new Promise((resolve, reject) => {

            Offer.findById(id).then((data) => {
                resolve(data)
            })
        })
    },


    checkcoupon: (id, uid) => {

        return new Promise((resolve, reject) => {

            Coupon.findOne({code: id}).then((data) => {
                if (data) {
                    console.log("???????????????????HERE???????????????");
                    console.log(data);


                    let used = false
                    data.used.forEach(element => {

                        if (element == uid) {
                            used = true
                            console.log("???after resolve/????");
                        }


                    });

                    if (used) {
                        resolve({used: true, found: true})
                    } else {
                        resolve({used: false, data, found: true})
                    }

                } else {

                    resolve({found: false})
                }
            })


        })
    },

    couponuser: (code, uid) => {

        return new Promise((resolve, reject) => {

            Coupon.findOne({code: code}).then((data) => {

                if (data) {
                    console.log(data);
                    console.log("????codeeee////");

                    let id = data._id
                    let used = data.used
                    used.push(uid);
                    console.log(data.used.length);


                    Coupon.findByIdAndUpdate(id, {
                        $set: {
                            used: used

                        }
                    }).then((data1) => {

                        console.log(data1);
                        console.log("?????/////");
                        resolve()

                    })
                } else {
                    resolve()
                }
            })
        })
    },


    removeoutofstock:(uid)=>{

        return new Promise((resolve, reject) => {
            
            cart.find({owner:uid}).then((data)=>{
                let counter = 1
                console.log(data.length+"........//////////??");
                
                data.forEach(element => {

                    if(element.stock=="0")
                    {
                        cart.findByIdAndRemove(element._id).then(()=>{

                             counter++
                             if(counter>data.length)
                             {counter = data.length}
                             console.log("CAFE" + counter);
                        }).then(()=>{
                            if(counter==data.length)
                            {
                                resolve()
                            }
                            else
                            {
                                
                            }
                        })
                    }
                    
                });


            })
        })
    },


    changePaymentStatus1:(oid)=>{
        return new Promise((resolve, reject) => {

            Order.findById(oid).then((order)=>{

                if(order.paymentStatus=="Pending")
                {
                    Order.findByIdAndUpdate(oid, {
                        $set: {
                            paymentStatus: "Cancelled",
                            orderStatus: "Cancelled"
        
                        }
                    }).then(()=>{
                        resolve()
                    })
                }
                else
                {
                    console.log("DONT TOUCH THE CODE, ATLEAST IT WORKS!");
                }
            })
            
            
        })
    },


    finduser:(username)=>{

        return new Promise((resolve, reject) => {
            
            User.findOne({email:username}).then((user)=>{
                console.log(user);
                console.log("checker101");
                if(user==null)
                {
                    User.findOne({phone:username}).then((userdata)=>{

                      
                        resolve(userdata)

                    })

                }
                else
                {
                    resolve(user)
                }
            })
            
        })
    },

    search:(key)=>{

        return new Promise((resolve, reject) => {
            
            Product.find({productTitle:{$regex: new RegExp('^'+key+'.*','i')}
           
        
        }).then((data)=>{
                console.log(data);
                resolve(data)

            })
        })
    }


}
