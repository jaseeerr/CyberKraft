const adminHelper = require('../helpers/adminHelper')
const twilio = require('twilio');
const TWILIO_ACCOUNT_SID = "ACa894d7630e7613ecd6589044087c7e02"
const TWILIO_AUTH_TOKEN = "1d0e07b67e7ed3218b5a35b9ef4c78d3"
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


module.exports = {


    test: (req, res) => {

        adminHelper.paymentcount().then((response) => {

            let cod = response.cod
            let online = response.online
            let len = response.len

            cod = (cod / len) * 100
            online = (online / len) * 100

            cod = Math.round(cod * 100) / 100
            online = Math.round(online * 100) / 100


            res.render('user/blocked')
        })

    },


    admindashboard: (req, res) => {

        if (req.session.admin) {
            let data1
            adminHelper.monthlysales().then((data) => {

                data1 = data

            })

            let cod = 0
            let online = 0
            let len = 0

            let count = 0

            adminHelper.paymentcount().then((response) => {

                cod = response.cod
                online = response.online
                len = response.len

                cod = (cod / len) * 100
                online = (online / len) * 100

                cod = Math.round(cod * 100) / 100
                online = Math.round(online * 100) / 100


            })

            adminHelper.allorders().then((orders) => {

                adminHelper.viewproducts().then((products) => {

                    let productcount = products.length


                    orders.forEach(element => {


                        count = count + 1

                    });

                    let revenue = 0

                    console.log(count + "ORDERSS");
                    console.log(orders);

                    orders.forEach(element => {

                        if (element.paymentStatus == "Successful") {
                            revenue = revenue + Number(element.amount)

                            revenue = Math.round(revenue * 100) / 100;
                        }
                    });

                    revenue = revenue.toLocaleString('en-IN');

                    res.render('admin/index', {
                        revenue,
                        count,
                        productcount,
                        data1,
                        cod,
                        online
                    })

                })


            })

        } else {
            res.redirect('/admin/login')
        }


    },

    adminlogin: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin')
        } else {

            let loginerr = req.session.loginerr

            req.session.loginerr = false


            if (loginerr) {
                res.render('admin/login', {loginerr})
            } else {
                res.render('admin/login')
            }

        }

        // res.render('admin/login')
    },

    otplogin: (req, res) => {

        if (req.session.admin) {
            res.redirect('/admin')
        } else {
            if (req.session.otpsend) {
                res.render('admin/otplogin', {badotp: true})
            } else {


                client.verify.services("VAbfb922495b93e05597684ed8aa061ddf").verifications.create({to: `+917736444283`, channel: 'sms'}).then(() => {
                    req.session.otpsend = true
                    res.render('admin/otplogin');
                })

            }
        }


    },

    postotp: (req, res) => {
        let pass = req.session.otp

        client.verify.services("VAbfb922495b93e05597684ed8aa061ddf").verificationChecks.create({to: `+917736444283`, code: req.body.otp}).then((verifications) => {

            resolve(verifications)
        })

        // if(req.body.otp==pass)
        // {
        //     req.session.admin = true
        //         res.redirect('/admin')
        // }
        // else
        // {
        //     req.session.otperr = true
        //     res.redirect('/admin/otplogin')
        // }

    },

    resendotp: (req, res) => {

        if (req.session.admin) {
            res.redirect('/admin')
        } else {


            req.session.otpsend = false
            res.redirect('/admin/otplogin')
        }


    },


    postadminlogin: (req, res) => {

        adminHelper.adminlogin(req.body).then((response) => {
            if (response.adminlogin) {
                req.session.admin = true
                res.redirect('/admin')
            } else {

                req.session.admin = false
                req.session.loginerr = true
                res.redirect('/admin/login')
            }
        })

    },


    adminlogout: (req, res) => {

        req.session.admin = false
        req.session.otpsend = false
        res.redirect('/admin')
    },


    addproduct: (req, res) => {

        adminHelper.getcategory().then((data) => {


            if (req.session.added) {
                let added = req.session.added
                req.session.added = false
                res.render('admin/addproduct', {added, data})
            } else {
                res.render('admin/addproduct', {data})
            }
        })

    },


    postaddproduct: (req, res) => {

        let images = req.files.map(a => a.filename);

        // res.redirect('/admin/addproduct')
        adminHelper.addproduct(req.body, images).then((add) => {

            req.session.added = true
            res.redirect('/admin/products')

        })

    },

    viewproducts: (req, res) => {

        adminHelper.viewproducts().then((data) => {

            let del = req.session.del
            req.session.del = false
            let update = req.session.update
            let added = req.session.added
            req.session.added = false
            req.session.update = false


            res.render('admin/products', {data, update, added, del})

        })

    },

    editproducts: (req, res) => {

        adminHelper.getoneproduct(req.params.id).then((response) => {
            req.session.image1 = response.data.image[0]
            req.session.image2 = response.data.image[1]
            req.session.image3 = response.data.image[2]
            req.session.image4 = response.data.image[3]
            let data = response.data
            let cat = response.cat

            res.render('admin/editproducts', {data, cat})
        })


    },

    updateproduct: (req, res) => {

        let data = req.files


        if (data.length == 0) {
            adminHelper.updateproduct1(req.params.id, req.body).then((response) => {
                req.session.update = response.updated
                res.redirect('/admin/products')
            })

        } else {
            // console.log("/////////checkerimage");
            // console.log(req.body.img1);
            // console.log(req.body.img2);
            // console.log(req.body.img3);
            // console.log(req.body.img4);


            let images = req.files.map(a => a.filename);
            let changes = [req.session.image1, req.session.image2, req.session.image3, req.session.image4]
            let len = images.length
            // console.log("BEFORE CHANGES");
            // console.log(images);

            if (req.body.img1 == 0) {
                images[len] = req.session.image1
                len++
            }

            if (req.body.img2 == 0) {
                images[len] = req.session.image2
                len++
            }

            if (req.body.img3 == 0) {
                images[len] = req.session.image3
                len++
            }

            if (req.body.img4 == 0) {
                images[len] = req.session.image4
                len++
            }

            // console.log("AFTER CHANGES BRUH");
            // console.log(images);


            adminHelper.updateproduct(req.params.id, req.body, images).then((response) => {
                req.session.update = response.updated
                res.redirect('/admin/products')
            })
        }

    },

    deleteproduct: (req, res) => {

        adminHelper.deleteproduct(req.params.id).then((response) => {
            req.session.del = response.del
            res.redirect('/admin/products')
        })


    },

    orders: (req, res) => {

        adminHelper.allorders().then((orders) => {

            let orderupdate = req.session.orderupdate
            req.session.orderupdate = false

            orders = orders.reverse()
            res.render('admin/orders', {orders, orderupdate})
        })


    },


    category: (req, res) => {
        adminHelper.getcategory().then((data) => {


            let newcat = req.session.newcat
            let err = req.session.caterr
            let del = req.session.del

            req.session.newcat = false
            req.session.caterr = false
            req.session.del = false

            let category = data


            if (newcat) {
                res.render('admin/category', {newcat, category})
            } else if (err) {
                res.render('admin/category', {err, category})
            } else if (del) {
                res.render('admin/category', {del, category})
            } else {
                res.render('admin/category', {category})
            }


        })


    },

    addcategory: (req, res) => {

        let word = req.body.name
        word = word.charAt(0).toUpperCase() + word.slice(1);
        console.log(req.body);
        req.body.name = word
        console.log(req.body);

        adminHelper.addcategory(req.body).then((data) => {
            if (data.status) {
                req.session.newcat = true
                res.redirect('/admin/category')
            } else {
                req.session.caterr = true
                res.redirect('/admin/category')
            }
        })

    },

    editcategory: (req, res) => {

        adminHelper.getcategorybyid(req.params.id).then((response) => {
            let data = response


            res.render('admin/editcategory', {data})
        })

    },

    updatecategory: (req, res) => {


        adminHelper.updatecategory(req.params.id, req.body).then(() => {
            res.redirect('/admin/category')

        })

    },

    deletecategory: (req, res) => {

        let deletekey = req.params.id
        adminHelper.deletecategory(req.params.id, deletekey).then((response) => {
            req.session.del = response.del
            res.redirect('/admin/category')
        })
    },

    userinfo: (req, res) => {
        adminHelper.userinfo().then((data) => {

            res.render('admin/userinfo', {data})

        })
    },

    blockuser: (req, res) => {
        let block = true

        adminHelper.blockuser(req.params.id).then(() => {


            req.session.user = false
            req.session.userdata = null
            req.session.blockpage = true
            res.redirect('/admin/userinfo')
        })

    },

    unblockuser: (req, res) => {

        adminHelper.unblockuser(req.params.id).then(() => {

            res.redirect('/admin/userinfo')
        })

    },

    banner: (req, res) => {

        adminHelper.viewbanner().then((banner) => {
            let data = banner
            let del = req.session.deleted
            req.session.deleted = false

            res.render('admin/banner', {del, data})

        })


    },

    newbanner: (req, res) => {
        let banneradded = req.session.banneradded
        req.session.banneradded = false


        res.render('admin/addbanner', {banneradded})

    },

    postbanner: (req, res) => {


        adminHelper.addbanner(req.file.filename, req.body).then((response) => {
            req.session.banneradded = response.added
            req.session.banner = response.data
            res.redirect('/admin/newbanner')
        })


    },

    deletebanner: (req, res) => {

        adminHelper.deletebanner(req.params.id).then((response) => {
            req.session.deleted = response.delete

            res.redirect('/admin/banner')
        })

    },

    featured: (req, res) => {
        let added = req.session.added
        let del = req.session.del
        req.session.added = false
        req.session.del = false

        adminHelper.getfeatured().then((data) => {

            res.render('admin/featured', {added, data, del})
        })


    },


    addfeatured: (req, res) => {


        res.render('admin/addfeatured')
    },

    postfeatured: (req, res) => {

        adminHelper.addfeatured(req.body, req.file.filename).then((response) => {

            req.session.added = response.added
            res.redirect('/admin/featured')

        })
    },

    deletefeatured: (req, res) => {

        adminHelper.deletefeatured(req.params.id).then((response) => {

            req.session.del = response.delete
            res.redirect('/admin/featured')

        })
    },


    editorder: (req, res) => {

        adminHelper.getorderbyid(req.params.id).then((order) => {

            res.render('admin/editorder', {order})
        })


    },

    updateorder: (req, res) => {


        adminHelper.updateorder(req.params.id, req.body).then(() => {

            req.session.orderupdate = true
            res.redirect('/admin/orders')
        })


    },

    offer: (req, res) => {

        let offeradded = req.session.offeradded
        req.session.offeradded = false
        let edit = req.session.offeredit
        req.session.offeredit = false
        let del = req.session.deleted
        req.session.deleted = false


        adminHelper.getofferproducts().then((data) => {

            res.render('admin/offproducts', {offeradded, data, edit, del})

        })


    },

    addoffers: (req, res) => {


        adminHelper.getoneproduct(req.params.id).then((data) => {

            res.render('admin/addoffer', data)

        })

    },


    postaddoffer: (req, res) => {

        adminHelper.getoneproduct(req.params.id).then((response) => {

            let data = response.data


            adminHelper.addoffer(data, req.body.offprice, req.body.stock).then(() => {


                req.session.offeradded = true
                res.redirect('/admin/offers')


            })

        })


    },

    editoffer: (req, res) => {

        adminHelper.getoneofferproduct(req.params.id).then((data) => {

            res.render('admin/editoffer', {data})

        })
    },

    posteditoffer: (req, res) => {

        let offprice = req.body.offprice
        let stock = req.body.stock
        let name = req.body.title


        adminHelper.editoffer(req.params.id, offprice, stock).then(() => {

            req.session.offeredit = true
            res.redirect('/admin/offers')
        })


    },


    deleteoffer: (req, res) => {

        adminHelper.deleteoffer(req.params.id).then(() => {

            req.session.deleted = true

            res.redirect('/admin/offers')
        })


    },

    coupon: (req, res) => {

        let cadded = req.session.cadded
        req.session.cadded = false
        let cdel = req.session.coupondel
        req.session.coupondel = false
        let cerr = req.session.couponerr
        req.session.couponerr = false


        adminHelper.getcoupons().then((coupons) => {

            res.render('admin/coupon', {cadded, coupons, cdel, cerr})

        })


    },

    addcoupon: (req, res) => {


        let word = req.body.code

        word = word.toUpperCase()

        req.body.code = word


        adminHelper.addcoupon(req.body).then((err) => {

            if (err) {
                req.session.couponerr = true
                req.session.cadded = false

            } else {
                req.session.cadded = true
                req.session.couponerr = false
            }


            res.redirect('/admin/coupon')
        })


    },

    deletecoupon: (req, res) => {

        adminHelper.deletecoupon(req.params.id).then(() => {

            req.session.coupondel = true

            res.redirect('/admin/coupon')
        })


    },


    report: (req, res) => {

        res.render('admin/salesReport')
    },


    customreport: (req, res) => {

        adminHelper.customreport(req.body.start, req.body.end).then((data) => {

            console.log("DONE");

            res.render('admin/salesReportTable', {data})
        })
    },

    monthlyreport: (req, res) => {


        let start = new Date(req.body.start)
        let end = new Date(req.body.end)
        end.setDate(1); // set the day to the first of the month
        end.setMonth(end.getMonth() + 1); // increment the month by 1
        end.setDate(0);


        adminHelper.monthlyreport(start, end).then((data) => {




            res.render('admin/salesReportTable', {data})
        })


    },


    annualreport:(req,res)=>{

        let start = req.body.start
        let end = req.body.end

        adminHelper.annualreport(start,end).then((data)=>{

            res.render('admin/salesReportTable', {data})

            
        })
    }


}
