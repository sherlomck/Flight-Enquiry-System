var express = require('express')
var pool = require('./pool')
var router = express.Router()
var upload = require('./multer')
const { array } = require('./multer')
const fs = require('fs');

router.get('/home',function(req,res){
    res.render('flight_interface', {msg:''})
})

router.get('/displaybyid',function(req,res){
    pool.query('select F.*,(select s.statename from states s where s.stateid=f.sourcestateid) as ss,(select s.statename from states s where s.stateid=f.destinationstateid) as ds,(select c.cityname from city c where c.cityid=f.sourcecityid) as sc,(select c.cityname from city c where c.cityid=f.destinationcityid) as dc from flights F where F.flightid=?',[req.query.fid],function(error,result){
        if(error){res.render(error)}
        else{
            res.render('display_byid',{data:result[0],msg:''})
        }
    })
})

router.get('/display',function(req,res){
    pool.query('select *,(select c.cityname from city c where c.cityid=f.sourcecityid) as sc,(select c.cityname from city c where c.cityid=f.destinationcityid) as dc from flights F',function(error,result){
        if(error){
            res.render(error)
        }
        else{
            res.render('display_all',{data:result})
        } 
    })
})
router.get('/fetch_states',function(req,res){
    pool.query('select * from states', function(error,result){
        if(error){
            res.status(500).json(error)

        }
        else{
            res.status(200).json(result)
        }
    })
})

router.get('/fetch_city',function(req,res){
    pool.query('select * from city where stateid=?', [req.query.stateid], function(error,result){
        if(error){
            res.status(500).json(error)
        }
        else{
            res.status(200).json(result)
        }
    })
})

router.get('/show_img',function(req,res){
    res.render('show_img',{flightid:req.query.flightid,companyname:req.query.companyname,boarding:req.query.boarding})
})

router.post('/add_record', upload.single('boarding'), function(req,res){
    var fclass
    if(Array.isArray(req.body.fclass)){
        fclass=req.body.fclass.join("#")
    }
    else(fclass=req.body.fclass)
    var days
    if(Array.isArray(req.body.days)){
        days=req.body.days.join("#")
    }
    else(days=req.body.days)
    console.log(days)
    pool.query('insert into flights values (?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.flightid,req.body.companyname,req.body.sourcestate,req.body.sourcecity,req.body.desstate,req.body.descity,req.body.status,fclass,req.body.sourcetime,req.body.destime,days,req.file.originalname], function(error,result){
        if(error){
            res.render('flight_interface',{msg:error})
        }
        else{
            res.render('flight_interface',{msg:'Record Submitted Successfully'})
        }
    })
})

router.post('/edit',function(req,res){
    if(req.body.btn=='Edit'){
        var fclass
        if(Array.isArray(req.body.fclass)){
            fclass=req.body.fclass.join('#')
        }
        else(fclass=req.body.fclass)
        var days
        if(Array.isArray(req.body.days)){
            days=req.body.days.join('#')
        }
        else(days=req.body.days)
        pool.query('update flights set companyname=?,sourcestateid=?,sourcecityid=?,destinationstateid=?,destinationcityid=?,status=?,flightclass=?,sourcetiming=?,destinationtiming=?,days=? where flightid=?',[req.body.companyname,req.body.sourcestate,req.body.sourcecity,req.body.desstate,req.body.descity,req.body.status,fclass,req.body.sourcetime,req.body.destime,days,req.body.flightid],function(error,result){
            console.log(result)
            if(error){res.redirect('/enquiry/display')} // do not res.render(error)
            else{
                res.redirect('/enquiry/display')
            }
        })
    }
    else{
        pool.query('delete from flights where flightid=?',[req.body.flightid],function(error,result){
            console.log(result)
            if(error){res.redirect('/enquiry/display')}
            else{
                res.redirect('/enquiry/display')
            }
        })
    }
})

router.post('/edit_img',upload.single('boarding'),function(req,res){
    pool.query('update flights set boarding=? where flightid=?',[req.file.originalname,req.body.flightid],function(error,result){
        if(error){
            console.log(error)
            res.redirect('/enquiry/display')
        }
        else{
            fs.unlinkSync('./public/images/'+req.body.oldlogo)
            res.redirect('/enquiry/display')
        }
    })
})

module.exports = router