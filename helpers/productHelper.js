module.exports={
    productCheck:(req,res,next)=>{

            res.locals.allproducts = req.session.allproducts
            res.locals.cdata = req.session.categorynav
          
            if(req.session.start)
           {
            
            next()
           }
           else
           {
            req.session.start = true
            res.redirect('/')
           }
            
            
        
       
       
    }

}