

const userHelper = require('../helpers/userHelper')





module.exports = {



    otplogin:(req,res)=>{

        if(req.session.user)
        {
            res.redirect('/')
        }
        else
        {
            let err = req.session.err
            req.session.err = false
    
    
            res.render('user/otplogin',{err})
        }

        

    },

    sendotp:(req,res)=>{

        let phone = req.session.userdata.phone

        userHelper.sendotp(phone).then(()=>{

            res.redirect('/changepassword')
        })

    },

    postnumber:(req,res)=>{

            

        if(req.session.user)
        {
            res.redirect('/')
        }
        else
        {
            userHelper.checknumber(req.body.phone).then((response)=>{

                if(response.err)
                {
                    req.session.err = true
                    res.redirect('/otplogin')
                }
                else
                {
                    req.session.phone = response.phone
                    req.session.uname = response.name
                    res.redirect('/otpcode')
                    
                    
                }
            })
        }

    },

    otpcode:(req,res)=>{

        if(req.session.user)
        {
            res.redirect('/')
        }
        else
        {
            let otperr = req.session.otperr
            let name = req.session.uname
            setTimeout(()=>{
                req.session.uname = ""
            },20000)
            
            req.session.otperr = false
    
          
            res.render('user/otpcode',{otperr,name})
        
        }







    },

    checkotpforpass:(req,res)=>{


        let otp = req.body.otp
        let phone = req.session.userdata.phone
 
         userHelper.checkotpforpass(phone,otp).then((status)=>{
             if(status.err)
             {
                 req.session.otperr = true
 
                 res.redirect('/changepassword')
             }
             else
             {
                req.session.otpverified = true
                 res.redirect('/newpassword')
                 
             }
         })



    },

    updatepassword:(req,res)=>{

        let uid = req.session.userdata._id

        userHelper.updatepasssword(uid,req.body.password).then(()=>{

          

            res.redirect('/logout')
        })

    },

    checkotp:(req,res)=>{

        if(req.session.user)
        {
            res.redirect('/')
        }
        else
        {
            let otp = req.body.otp
            let phone = req.session.phone
     
             userHelper.checkotp(phone,otp).then((response)=>{
                 if(response.err)
                 {
                     req.session.otperr = true
     
                     res.redirect('/otpcode')
                 }
                 else
                 {
                     req.session.userdata = response.userdata
                     req.session.user = true
                     res.redirect('/')
                 }
             })
        }
        
        
    },

    homepage:(req,res)=>{

        req.session.start = true

        userHelper.getallproducts().then((response)=>{
            let allproducts = response
            req.session.allproducts = allproducts
            req.session.start = true
            let userdata = req.session.userdata

            userHelper.getallbanners().then((responseb)=>{
                let banner = responseb

                userHelper.getfeatured().then((fdata)=>{

                    userHelper.getcategory().then((cdata)=>{

                        req.session.categorynav = cdata

                        res.render('user/index',{userdata,allproducts,banner,fdata,cdata})


                    })
                      

                    
                })

                
            })



     
            
        })
},

contact:(req,res)=>{
    if(req.session.user)
    {
        let userdata = req.session.userdata
        res.render('user/contact',{userdata})
    }
    else
    {
        res.render('user/contact')
    }

},

block:(req,res)=>{

    req.session.blockpage = false
    res.render('user/blocked')

},

userlogin:(req,res)=>{


 
  

    if(req.session.user)
    {

        res.redirect('/')
    }
    else
    {
        

            let loginerr = req.session.loginerr
            let block = req.session.userblock
        let signup = req.session.signup
        req.session.userblock = false
        req.session.loginerr = false
        req.session.signup = false
    
        
    
        if(loginerr && block!=true)
        {
            res.render('user/login',{loginerr})
        }
        else if(signup)
        {
            res.render('user/login',{signup})
        }
        else if(block)
        {
            res.render('user/login',{block})
        }
        else
        {
         
           
            res.render('user/login')
        }

    
       
       
    }
},

postuserlogin:(req,res)=>{
 


    userHelper.forlogin(req.body).then((response)=>{

        
        
        if(response.login)
        {
            const previousUrl = req.header('Referer');

            
            req.session.user = true
            req.session.userdata = response.userdata

           
            res.redirect(previousUrl)
            
                // res.redirect('/')
         
      
            
        }
        else
        {
            req.session.loginerr = true
            req.session.user = false
            if(response.block)
            {
                req.session.userblock = true
            }
            res.redirect('/login')
        }

    })
},

otp:(req,res)=>{


},

userlogout:(req,res)=>{

    req.session.user = false
    req.session.userdata = null
    res.redirect('/')
},



       usersignup:(req,res)=>{
        
        if(req.session.user)
        {
            res.redirect('/login')
        }
        else
        {
            let exphone = req.session.exphone
        let exemail = req.session.exemail
        req.session.exphone = false
        req.session.exemail = false

        if(exemail)
        {
            res.render('user/signup',{exemail})
        }
        else if(exphone)
        {
            res.render('user/signup',{exphone})
        }
        else
        {
            res.render('user/signup')
        }
        }


        
    },



    postusersignup:(req,res)=>{
        
    
        userHelper.forsignup(req.body).then((response)=>{
            if(response.exemail)
            {
                req.session.exemail = true
                res.redirect('/signup')
            }
            else if(response.exphone)
            {
                req.session.exphone = true
                res.redirect('/signup')
            }
            else
            {
                req.session.signup = true
                res.redirect('/login')
            }
            
        })
        
    },

    userprofile:(req,res)=>{



   
        let userdata = req.session.userdata
        let uid = req.session.userdata._id
        let update = req.session.updated
        let address = req.session.newaddress
        let del = req.session.addel
        req.session.addel = false
        req.session.newaddress = false
        req.session.updated = false

        userHelper.getaddressbyid(uid).then((data)=>{

            userHelper.getorders(uid).then((orders)=>{

                console.log(orders);

                orders = orders.reverse()

                res.render('user/profile',{userdata,update,address,data,del,orders})

            })

            

        })



        
  
   
},

changepassword:(req,res)=>{

    let err = req.session.otperr
    let userdata = req.session.userdata
    req.session.otperr = false

    userHelper.sendotp(req.session.userdata.phone).then(()=>{

        res.render('user/changepassword',{err,userdata})


    })


},

newpassword:(req,res)=>{


    if(req.session.otpverified)
    {
        
        res.render('user/newpassword')
    }
    else
    {
        res.redirect('/')
    }



    

},

addadress:(req,res)=>{

    const previousUrl = req.header('Referer');
    let uid = req.session.userdata._id

    userHelper.addnewaddress(req.body,uid).then(()=>{

        req.session.newaddress = true

        res.redirect(previousUrl)

    })


    

},

deleteaddress:(req,res)=>{

    const previousUrl = req.header('Referer');

    userHelper.deleteaddress(req.params.id).then(()=>{
        req.session.addel = true
        res.redirect(previousUrl)
    })


},

updateprofile:(req,res)=>{

    userHelper.updateprofile(req.params.id,req.body).then((response)=>{

        req.session.updated = response.updated
        req.session.userdata = response.data
        res.redirect('/profile')
    })

},

account:(req,res)=>{

    
        let userdata = req.session.userdata
        res.render('user/account',{userdata})
    

    

},

productdetails:(req,res)=>{
    let userdata 
    let uid 
    if(req.session.user)
    {
        userdata = req.session.userdata
        uid = req.session.userdata._id
    }
    else
    {
        
        uid = "null"
    }
    
    let itemadded = req.session.itemadded
    let more = req.session.more
    let wished = req.session.wished
    req.session.more = false
    req.session.wished = false
    req.session.itemadded = false


   



    userHelper.getcategory().then((cat)=>{

        


        
        userHelper.getoneproduct(req.params.id).then((data)=>{

            userHelper.getonewish(data._id,uid).then((response)=>{

                console.log(response.found+"//??//");
                let wishfound = response.found
                let wishid = response.wishid
                console.log(wishid);


                req.session.out = false
                let out = req.session.out
                if(data.stock==0)
                {
                    more = req.session.more = false
                    req.session.out = true
                    out = req.session.out
                }
    
                let pid1 = data._id
                console.log("/////////////////////////")
                console.log(data._id);
          
                res.render('user/product-details',{data,cat,userdata,itemadded,more,out,wished,wishfound,wishid})

            })

           
        })

    })
   
    

},


offerproductdetails:(req,res)=>{


    


    let userdata 
    let uid 
    if(req.session.user)
    {
        userdata = req.session.userdata
        uid = req.session.userdata._id
    }
    else
    {
        
        uid = "null"
    }
    
    let itemadded = req.session.itemadded
    let more = req.session.more
    let wished = req.session.wished
    req.session.more = false
    req.session.wished = false
    req.session.itemadded = false


   



    userHelper.getcategory().then((cat)=>{

        


        
        userHelper.getofferbyid(req.params.id).then((data)=>{

            userHelper.getonewish(data._id,uid).then((response)=>{

                console.log(response.found+"//??//");
                let wishfound = response.found
                let wishid = response.wishid
                console.log(wishid);


                req.session.out = false
                let out = req.session.out
                if(data.stock==0)
                {
                    more = req.session.more = false
                    req.session.out = true
                    out = req.session.out
                }
    
          
                res.render('user/offerProductDetails',{data,cat,userdata,itemadded,more,out,wished,wishfound,wishid})

            })

           
        })

    })
   
    
    
},

viewcart:(req,res)=>{

   
    let userdata = req.session.userdata

    userHelper.viewcart(userdata._id).then((response)=>{

        
        req.session.cartitems = response
        let cart = response.data
        let outforcart = req.session.outforcart

       
        if(response.empty)
        {
            res.render('user/cart',{userdata,empty:true})
        }
        else
        {
            res.render('user/cart',{userdata,cart,empty:false,outforcart})
        }

        
    })
    

    

   

},

cartupdate:(req,res)=>{

    console.log(req.body);

    let qty = req.body.qty
    let pid = req.body.pid
    let uid = req.session.userdata._id
    console.log(qty);


    userHelper.cartupdate(qty,pid,uid).then(()=>{

        res.redirect('/cart')
    })


},

addtocart:(req,res)=>{

    const previousUrl = req.header('Referer');
    console.log("//?????????/////");
    req.session.couponapplied = false
  
    let pid = req.body.pid
    let offer = req.body.offer
    let offprice = req.body.offprice
    let userid = req.session.userdata._id
let qty = req.body.qty
console.log(qty+"qtyyy");
    userHelper.addtocart(req.params.id,userid,qty,offer,offprice,pid).then((more)=>{

        
        if(more)
        {
            req.session.more = true
        }

        req.session.itemadded = true
        res.redirect(previousUrl)

    })
},

deletecartitem:(req,res)=>{

    userHelper.deletecartitem(req.params.id).then(()=>{

        res.redirect('/cart')


    })
},

clearcart:(req,res)=>{

    userHelper.clearcart(req.params.id).then(()=>{
       res.redirect('/cart')
    })
},

wishlist:(req,res)=>{

    console.log("???>>>>>>111");


    let userdata = req.session.userdata
    let uid = userdata._id

    let added = req.session.addtocart
    req.session.addtocart = false

    let exist = req.session.exist
    req.session.exist = false




    userHelper.updatewishliststock(uid).then(()=>{
        console.log("???>>>>>>");

        userHelper.getwishlist(uid).then((response)=>{
           
    
            if(response.empty)
            {
                let empty = response.empty
                res.render('user/wishlist',{empty,userdata})
            }
            else
            {

               
                let empty = response.empty
                let wish = response.data

               
               
                res.render('user/wishlist',{empty,wish,userdata,added,exist})

             
    
                
            }
            
    
        })

    })



    
    


    

},

addtocartfromwish:(req,res)=>{

    req.session.couponapplied =false
    let pid = req.params.id
    let uid = req.session.userdata._id

    userHelper.addtocartfromwish(pid,uid).then((exists)=>{

        if(exists)
        {
            req.session.exist = true
        }
        else
        {
            req.session.addtocart = true
        }

        
        res.redirect('/wishlist')
        
    })

},

addtocartfromshop:(req,res)=>{

    req.session.couponapplied = false
    let pid = req.params.id
    let uid = req.session.userdata._id

    const previousUrl = req.header('Referer');
    userHelper.addtocartfromhome(pid,uid).then((exist)=>{

        if(exist)
        {
            req.session.exist = true
        }
        else
        {
            req.session.itemadded = true
        }

        res.redirect(previousUrl)




    })


},

addtowish:(req,res)=>{
    let uid = req.session.userdata._id

    
    let pid = req.params.id
    

    const previousUrl = req.header('Referer');

    

     userHelper.addtowish(pid,uid).then((data)=>{
        req.session.wished = true
        res.redirect(previousUrl)

        
     })


},


addtowishlistfromcart:(req,res)=>{


    let uid = req.session.userdata._id
    let pid = req.params.id
    let qty = 1


    userHelper.addtocartfromwish(pid,uid,qty).then(()=>{

        res.redirect('/cart')
    })




},


deletewish:(req,res)=>{
    const previousUrl = req.header('Referer');

    userHelper.deletewish(req.params.id).then(()=>{
        res.redirect(previousUrl)
    })

},

shop:(req,res)=>{
    let userdata = req.session.userdata
    let added =  req.session.itemadded
    req.session.itemadded = false
    let exist = req.session.exist
    req.session.exist = false

    const currentUrl =req.originalUrl;
    console.log("//////////");
  console.log(currentUrl);

    userHelper.getallproducts().then((data)=>{

        userHelper.getcategory().then((cdata)=>{

            res.render('user/shopall',{data,cdata,userdata,added,exist})

        })

    })

},

bycategory:(req,res)=>{
    let userdata = req.session.userdata
    let cname = req.params.id
    let added =  req.session.itemadded
    req.session.itemadded = false
    let exist = req.session.exist

    req.session.exist = false
    

    userHelper.getproductbycategory(req.params.id).then((data)=>{

       

        userHelper.getcategory().then((cdata)=>{
            

            res.render('user/shop',{data,cdata,userdata,cname,added,exist})

        })

        



    })

    
},

offerbycategory:(req,res)=>{


    let userdata = req.session.userdata
    let cname = req.params.id
    let added =  req.session.itemadded
    req.session.itemadded = false
    let exist = req.session.exist

    req.session.exist = false

    userHelper.getofferbycategory(req.params.id).then((data)=>{

       
   
        console.log(data);
        userHelper.getcategory().then((cdata)=>{
            

            res.render('user/offercat',{data,cdata,userdata,cname,added,exist})

        })

        



    })

},


checkout:(req,res)=>{

    let found = req.session.found

    req.session.found = true

    let used = req.session.used
    req.session.used= false
    let userdata = req.session.userdata
    let uid = req.session.userdata._id

    let newtotal = req.session.newtotal
    
    let couponapplied = req.session.couponapplied 

    let couponvalue = req.session.couponvalue
   
    let expired = req.session.cexpired
    req.session.cexpired = false

    let minerr =  req.session.minerr
    req.session.minerr = false

    let minvalue = req.session.minvalue

    let code  = req.session.code1



    userHelper.viewcart(uid).then((response)=>{

        let items = response.data

        

        

        console.log(response);
        if(response.empty)
        {
            res.redirect('/')
        }
        else
        {
            userHelper.stockchecker(items).then((outofstock)=>{

                console.log("OUTOFSTOCKLENGTH"+outofstock.length);
    
                if(outofstock.length>0)
                {
    
                    
                    userHelper.cartstockupdate(outofstock).then(()=>{
    
    
                        console.log("CHEESE BURGER");
                    console.log(outofstock);
        
                    userHelper.getaddressbyid(uid).then((address)=>{
        
                        console.log("HERE");
                        let data = response.data
    
                       
            
            
                        res.render('user/checkout',{data,address,userdata,expired,newtotal,couponapplied,minerr,minvalue,couponvalue,used,found,code,reload:true})
            
                    })
        
        
                    })
                }
                else
                {
                    userHelper.getaddressbyid(uid).then((address)=>{
        
                        console.log("HERE");
                        let data = response.data
            
            
                        res.render('user/checkout',{data,address,userdata,expired,newtotal,couponapplied,minerr,minvalue,couponvalue,used,found,code,reload:false})
            
                    })
                }
    
    
                
    
            })
        }

        

        
        
       
    })

    

},

postVerifyPayment: (req, res) => {
    
    userHelper.verifyPayment(req.body).then(()=>{
        console.log("/////////................");
      console.log(req.body);

      res.json({status:true})

            }).catch((err)=>{
         console.log(err);
         res.json({status:false ,err})
  
    })

    
  },

placeorder:(req,res)=>{
    


    let uid = req.session.userdata._id
    let address = req.body.address
    let amount = req.body.amount
    let payment = req.body.payment_mode
    let coupon = false
    let code = req.session.code1
    if(req.session.couponapplied)
    {
        amount = req.body.newtotal
        coupon = true

    }

    if(payment=="razorpay")
    {

    }

    req.session.couponapplied = false
    req.session.couponvalue = 0

    req.session.newtotal = 0

    
    
    
    userHelper.viewcart(uid).then((response)=>{

        let cart = response.data

        userHelper.getoneaddress(address).then((address1)=>{


          let address2 = address1.name+","+address1.address+","+address1.state+","+address1.country+","+address1.pincode
          console.log(address2);

          

            userHelper.placeorder(uid,cart,address2,payment,amount,coupon,code).then((order)=>{


                   if(payment=="razorpay")
                   {
                    userHelper.generateRazorpay(order.amount, order._id).then((data)=>{



                        console.log("THIS DATA");
                        console.log(data);
                        console.log("THIS DATA");

                        req.session.razorpay = true
                        req.session.razororderId = order._id
    
                        let oid = order._id
                        

                        setTimeout(() => {
                            userHelper.changePaymentStatus1(oid)

                            
                        }, 120000);
                        // res.redirect('/clear')

                        res.json(data)

                        
    
                    })
                   }
                   else
                   {
                    req.session.razorpay = false
                    res.redirect('/clear')

                   }



                

                
                
               
                        

                




               
                
    
            })

            
        })

      


        

    })
},

clear:(req,res)=>{

    let uid = req.session.userdata._id

    let code = req.session.code

    userHelper.getallcart().then((cdata)=>{

        userHelper.updatestock(cdata).then(()=>{
            
            userHelper.clearcart(uid).then(()=>{

                userHelper.couponuser(code,uid).then(()=>{


                    if(req.session.razorpay)
                    {
                    
                        let oid = req.session.razororderId
                        userHelper.changePaymentStatus(oid).then(()=>{

                            res.redirect('/orderplaced')
                        })
                    }
                    else
                    {
                        res.redirect('/orderplaced')
                    }


                    


                })

                
            })
        })

    })

},

orderplaced:(req,res)=>{

    let userdata = req.session.userdata

    res.render('user/orderplaced',{userdata})
},

orderdetails:(req,res)=>{
    let userdata = req.session.userdata

    userHelper.getorderbyid(req.params.id).then((odata)=>{
        // console.log(order);

        res.render('user/orderdetails',{userdata,odata})

    })

   
},

cancelorder:(req,res)=>{


    const previousUrl = req.header('Referer');

    userHelper.cancelorder(req.params.id).then(()=>{
        res.redirect(previousUrl)
    })

    
},

returnorder:(req,res)=>{

    const previousUrl = req.header('Referer');

    userHelper.returnorder(req.params.id).then(()=>{

        res.redirect(previousUrl)

    })


},

getoffers:(req,res)=>{


    let userdata = req.session.userdata
    let added =  req.session.itemadded
    req.session.itemadded = false
    let exist = req.session.exist
    req.session.exist = false

    userHelper.getcategory().then((cdata)=>{

        userHelper.getofferproducts().then((data)=>{

            if(req.session.user)
            {
    
                let userdata = req.session.userdata
                res.render('user/offer',{data,userdata,cdata,added,exist})
            }
            else
            {
                res.render('user/offer',{data,cdata,added,cdata,exist})
            }
    
            
    
            
        })

    })

    

    
},

applycoupon:(req,res)=>{


    let uid = req.session.userdata._id
    let total = Number(req.body.total)
    

    let code = req.body.code
    req.session.code = code
    console.log(code);
    userHelper.checkcoupon(code,uid).then((response)=>{

        console.log(response);
        if(response.found)
        {
            console.log("////////INSIDE??????");
            if(!response.used)
            {
                
    
                let limit = response.data.limit
                let min = response.data.min
                let discount = response.data.discount
                let expire = response.data.expire
    
                if(total<min)
                {
                    req.session.minerr = true
                    req.session.minvalue = min
                    
                }
                else
                {
                    req.session.minerr = false
                }
                
    
                let today = new Date();
                let expire1 = new Date(expire)
    
                if(today>expire1)
                {
                    req.session.cexpired = true
                    res.redirect('/checkout')
                    
                }
                else if(req.session.minerr)
                {
                    res.redirect('/checkout')
                }
                else
                {
    
                    let off = (discount*total)/100
                    
                     if(off>limit)
                     {
                         off = limit
                     }
                     let total1 = total- off
    
                     req.session.newtotal = total1
                     req.session.couponapplied = true
                     req.session.couponvalue = off
                     req.session.code1 = code
    
                     res.redirect('/checkout')
    
                }
    
    
    
                
                
                
    
            }
            else if(!response.found)
            {
                req.session.found = response.found
                res.redirect('/checkout')
            }
            else
            {
                req.session.used = true
                res.redirect('/checkout')
            }
        }
        else
        {
            req.session.found = false
            res.redirect('/checkout')


        }
       

        // res.redirect('/checkout')


    })
},


removecoupon:(req,res)=>{

    req.session.couponapplied = false
    res.redirect('/checkout')

},

removeoutofstock:(req,res)=>{

    let uid = req.session.userdata._id


    userHelper.removeoutofstock(uid).then(()=>{


        console.log("HERE12465");
        res.redirect('/cart')

    })


},


forgotpassword:(req,res)=>{

    let usernotfound = req.session.usernotfound
    req.session.usernotfound = false


    res.render('user/forgotpassword',{usernotfound})
},


finduser:(req,res)=>{



    if(!req.session.user)
    {
        userHelper.finduser(req.body.username).then((userdata)=>{
                       console.log(userdata);
            if(userdata==null)
            {
                req.session.usernotfound = true
                res.redirect('/forgotpassword')
            }
            else
            {
                console.log("COMES TILL HERE");
                console.log(userdata);
                req.session.userdata = userdata
                let err = req.session.otperr
                req.session.otperr = false

                userHelper.sendotp(userdata.phone).then(()=>{
                    res.render('user/changepassword',{err})

                })
              
            }

            

            
        })
    }
    else
    {
        res.redirect('/')
    }
},


search:(req,res)=>{

    userHelper.search(req.body.search).then((data)=>{
        console.log(req.body.search);
let key = req.body.search
let empty = false
        console.log(data);

        if(data.length==0)
        {
            empty = true
        }
        else
        {
            empty = false
        }
        res.render('user/searchResults',{data,key,empty})
    })
}



}