const Product = require('../models/productSchema')
const Admin = require('../models/adminSchema')
const Category = require('../models/categorySchema')
const User = require('../models/userSchema')
const Address = require('../models/address')
const Order = require('../models/orderSchema')
const Banner = require('../models/bannerSchema')
const Coupon = require('../models/coupon')
const Featured = require('../models/featuredSchema')
const Offer = require('../models/offer')
const SSID = "VAbfb922495b93e05597684ed8aa061ddf"


module.exports={


    sendotp:(phone)=>{
        User.find({phone:phone}).then((user)=>{
            if(user)
            {
                client.verify
                .services(SSID)
                .verifications
                .create({
                    to : `+91${phone}`,
                    channel :'sms'
                })
            .then(() => {
                req.session.otpsend = true
              res.render('admin/otplogin');
            })
            }
        })
    },

    addproduct:(product,filename)=>{

        return new Promise((resolve, reject) => {
      
    
        
            
            const item = new Product({
            
                productTitle:product.title,
                description:product.description,
                price:product.price,
                image:filename,
                stock:product.stock,
                category:product.category

                
                

            })
            // filename.forEach(element => {
            //     item.image.push(element.filename)                
            // });

            item.save().then((data)=>{
                
                
                resolve({added:true})
                
            })


        })
            
       
    },

    adminlogin:(data)=>{
        return new Promise((resolve, reject) => {

            
            
            Admin.findOne({uname:data.email}).then((valid)=>{
                if(valid)
                {
                    if(valid.password == data.password)
                    {
                        
                        resolve({adminlogin:true})
                    }
                    else
                    {
                        
                        resolve({adminlogin:false})
                    }
                }
                else
                {
                    
                    resolve({adminlogin:false})
                }
            })

             
            
        })

    },

    viewproducts:()=>{

        return new Promise((resolve, reject) => {
            
            Product.find({}).lean().then((data)=>{
               
                resolve(data)
             
            })
        })

    },
    getoneproduct:(id)=>{
       return new Promise((resolve, reject) => {
        Product.findById(id).then((data)=>{
            Category.find({}).then((cat)=>{
                resolve({data,cat})
            })
        })
       })

    },
//with image
    updateproduct:(id,update,filename)=>{
       
        return new Promise((resolve, reject) => {

            Product.findByIdAndUpdate(id,{
                $set:{
                    productTitle:update.title,
                    description:update.description,
                    price:update.price,
                    image:filename,
                    stock:update.stock,
                    category:update.category

                }
            }).then(()=>{
                
                resolve({updated:true})
            })

            
           
        })
    },
    //edit single image
    // updateproductsingle:(id,update,filename)=>{
   
    //     return new Promise((resolve, reject) => {

    //         Product.findByIdAndUpdate(id,{
    //             $set:{
    //                 productTitle:update.title,
    //                 description:update.description,
    //                 price:update.price,
    //                 image1:filename[0],
    //                 image2:filename[1],
    //                 image3:filename[2],
    //                 image4:filename[3],
    //                 stock:update.stock,
    //                 category:update.category

    //             }
    //         }).then(()=>{
                
    //             resolve({updated:true})
    //         })

            
           
    //     })
    // },
   //without image
    updateproduct1:(id,update)=>{
        return new Promise((resolve, reject) => {

         
            
              let stock1 = update.stock
            Product.findByIdAndUpdate(id,{
                $set:{
                    productTitle:update.title,
                    description:update.description,
                    price:update.price,
                    stock:update.stock,
                    category:update.category

                }
            }).then((data)=>{
               
                resolve({updated:true})
            })

            
           
        })
    },

    deleteproduct:(id)=>{
        return new Promise((resolve, reject) => {
            Product.findByIdAndRemove(id).then(()=>{
                resolve({del:true})

            })
        })
    },


    addcategory:(data)=>{

       return new Promise((resolve, reject) => {
        
  
       
        Category.find({name:data.name}).then((valid)=>{
        
          
    console.log(valid);

            if(valid.length==0)
            {
               
                const cat = new Category({
            
                            
                    name:data.name,
                    description:data.description
                    
                })
    
                cat.save().then(()=>{resolve({status:true})})            
            }
            else
            {
                resolve({status:false})
            }
            
           })
       })
            
        


    },


    getcategory:()=>{
        return new Promise((resolve, reject) => {
            
            Category.find({}).then((data)=>{
                
           
            

                resolve(data)
            })
        })
    },

    getcategorybyid:(id)=>{
        return new Promise((resolve, reject) => {
            Category.findById(id).then((data)=>{
                resolve(data)
            })
        })

    },

    updatecategory:(id,update)=>{
        return new Promise((resolve, reject) => {
            
            
            Category.findByIdAndUpdate(id,{
                $set:{
                    name:update.name,
                    description:update.description                    
                }
            }).then(()=>{
                resolve()
            })
        })

    },
    

    deletecategory:(id)=>{
        return new Promise((resolve, reject) => {
            
            Category.findByIdAndDelete(id).then(()=>{
                resolve({del:true})
            })
        })
    },

    userinfo:()=>{
        return new Promise((resolve, reject) => {
            User.find({}).then((data)=>{

                resolve(data)
            })
            
        })
    },

    blockuser:(id)=>{
        return new Promise((resolve, reject) => {
            
            User.findByIdAndUpdate(id,{
                $set:{
                    block:true
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    unblockuser:(id)=>{
        return new Promise((resolve, reject) => {
            
            User.findByIdAndUpdate(id,{
                $set:{
                    block:false
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    viewbanner:()=>{

        return new Promise((resolve, reject) => {
            Banner.find({}).then((data)=>{
                resolve(data)
            })
        })

    },


    addbanner:(filename,data)=>{

        return new Promise((resolve, reject) => {
            
        
            
            const banner = new Banner({
            
                title:data.title,
                line1:data.line1,
                line2:data.line2,
                line3:data.line3,
                button:data.button,
                link:data.link,
                image:filename

                
                

            })
            

            banner.save().then((data)=>{
             
                
                
                resolve({added:true,data})
                
            })


        })
            
       
    },

    deletebanner:(id)=>{
        return new Promise((resolve, reject) => {

            Banner.findByIdAndRemove(id).then(()=>{
                resolve({delete:true})
            })
            
        })
    },

    getfeatured:()=>{
       return new Promise((resolve, reject) => {
        
        Featured.find({}).then((data)=>{

            resolve(data)
        })
       })

    },


    addfeatured:(data,filename)=>{

        return new Promise((resolve, reject) => {

             
            const featured = new Featured({
            
                title:data.title,
               
                image:filename

                
                

            })
            

            featured.save().then((data)=>{
                
                
                resolve({added:true})
                
            })
            
        })
    },

    deletefeatured:(id)=>{
        return new Promise((resolve, reject) => {
            Featured.findByIdAndRemove(id).then(()=>{
                resolve({delete:true})
            })
        })
    },

    allorders:()=>{

        return new Promise((resolve, reject) => {
            
            Order.find({}).then((data)=>{

                resolve(data)
            })
        })
    },

    getorderbyid:(id)=>{

        return new Promise((resolve, reject) => {
            
            Order.findById(id).then((order)=>{
                resolve(order)
            })
        })
    },


    updateorder:(id,update)=>{

        return new Promise((resolve, reject) => {

            if(update.orderStatus=="Cancelled")
            {
                Order.findByIdAndUpdate(id,{
                    $set:{
                        orderStatus:update.orderStatus,
                        paymentStatus:update.orderStatus
                            
                    }
                }).then((order)=>{
    
                    
                    resolve()
                    
                })
            }
            else
            {
                Order.findByIdAndUpdate(id,{
                    $set:{
                        orderStatus:update.orderStatus,
                        paymentStatus:update.paymentStatus
                            
                    }
                }).then((order)=>{
    
                    
                    resolve()
                    
                })
            }
            

            
        })
    },

    addoffer:(data,offprice,stock)=>{

return new Promise((resolve, reject) => {
    
    
    const product = new Offer({
            
        pid:data._id,
        productTitle:data.productTitle,
        description:data.description,
        price:data.price,
        image:data.image,
        stock:stock,
        category:data.category,
        offprice:offprice

        
        

    })
    

    product.save().then((data)=>{
        
        
        resolve({added:true})
        
    })
})

        
    },

    getofferproducts:()=>{

        return new Promise((resolve, reject) => {
            
            Offer.find({}).then((data)=>{

                resolve(data)
            })
        })
    },

    getoneofferproduct:(id)=>{


        return new Promise((resolve, reject) => {
            
            Offer.findById(id).then((data)=>{
                resolve(data)
            })
        })
    },

    editoffer:(id,offprice,stock)=>{

        return new Promise((resolve, reject) => {
            
            Offer.findByIdAndUpdate(id,{
                $set:{

                    offprice:offprice,
                    stock:stock

                }
            }).then(()=>{
                resolve()
            })
        })
    },


    deleteoffer:(id)=>{

        return new Promise((resolve, reject) => {
            
            Offer.findByIdAndRemove(id).then(()=>{
                resolve()
            })
        })
    },


    addcoupon:(data)=>{

        return new Promise((resolve, reject) => {

            let err = false


            Coupon.find({code:data.code}).then((data1)=>{

                if(data1.length==0)
                {
                    const code = new Coupon({
            
                        code:data.code,
                        discount:data.discount,
                        limit:data.limit,
                        min:data.min,
                        expire:data.expire
                        
        
                        
                        
        
                    })
                
        
                    code.save().then((data)=>{
                        
                        
                        resolve(err)
                        
                    })
                }
                else
                {
                    err = true
                    resolve(err)
                }
            })


            
            
            

        })
    },

    getcoupons:()=>{

        return new Promise((resolve, reject) => {
            
            Coupon.find({}).then((data)=>{

                resolve(data)
            })
        })

    },

    getonecoupon:(id)=>{

        return new Promise((resolve, reject) => {
            
            Coupon.findById(id).then((data)=>{
                resolve(data)
            })
        })
    },

    deletecoupon:(id)=>{
        return new Promise((resolve, reject) => {
            
            Coupon.findByIdAndDelete(id).then(()=>{
                resolve()
            })
        })
    },

    monthlysales:()=>{

       return new Promise((resolve, reject) => {
        
        Order.find({}).then((orders)=>{
            let s = 0
            let counts = []
            orders.forEach(element => {
                let date = element.date
                

                let month = date.getMonth()
                
                
                    counts[s] = month
                

                
                s++;

            })
            
            let sales = [0,0,0,0,0,0,0,0,0,0,0,0]
            let p = 0
            let num = 0
                let data = 0 
            for(let i=0;i<counts.length;i++)
            {
                data = 0

                for(let j=0;j<counts.length;j++)
                {
                    if(counts[j]==num)
                    {
                        data++
                    }

                }
                sales[p] = data
                p++
                num++
            }

        
        
            resolve(sales)

        })
       })
    },

    paymentcount:()=>{

        return new Promise((resolve, reject) => {
            
            Order.find({}).then((orders)=>{

                let len = orders.length
                let cod = 0
                let online = 0

                for(let i=0;i<orders.length;i++)
                {
                    if(orders[i].payment=="COD")
                    {
                        cod++
                    }
                }


                online = len - cod
                
                resolve({online,cod,len})






            })
        })
    },


    customreport:(start,end)=>{

        return new Promise((resolve, reject) => {
            
            start = new Date(start);
            end = new Date(end);

            console.log(start);
            console.log(end);

            let data = []
           
            Order.find({}).then((orders)=>{

                for(let i=0;i<orders.length;i++)
                {
                    let y = orders[i].date
                    y.setHours(0, 0, 0, 0);
                    let x = new Date(y);
                    if(x >= start && x <= end )
                    {
                        
                        
                        data.push(orders[i])
                    }

                    let word = y+""
                    word = word.substring(0,16)
                    console.log(word);
                    let word1 = start+""
                    word1 = word1.substring(0,16)

                    if(word==word1)
                    {
                        data.push(orders[i])
                    }
                    
                }




            }).then(()=>{

             
                resolve(data)
            })
            

           
        })
    },

    monthlyreport:(start,end)=>{

        return new Promise((resolve, reject) => {

            
            
            console.log(start);
            console.log(end);

            let flag = false


            let data = []

            Order.find({}).then((orders)=>{

                orders.forEach(element => {

                    let x = element.date
                    
                    if(x >= start && x <= end)
                    {
                        data.push(element)
                    }

                    

                   
                    
                    
                });

            }).then(()=>{

                
                resolve(data)
            })
            
           
        })
    },


    annualreport:(start,end)=>{

        return new Promise((resolve, reject) => {


            let data = []
           

            start = Number(start)
            end = Number(end)

            console.log(start);
            console.log(end);

            Order.find({}).then((orders)=>{

                orders.forEach(element => {

                    let x = element.date + ""
                    x = x.substring(11,15)
                    
                    x = Number(x)
                    console.log(x);

                    if(x>=start && x<=end)
                    {
                        data.push(element)
                    }



                    
                    
                    
                });
            }).then(()=>{

                resolve(data)
            })
           
            

        })
    }

  

    



}