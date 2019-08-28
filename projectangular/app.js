const Express=require('express');
var app=new Express();
var request=require('request');
var bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:'true'}));
app.use(Express.static(__dirname+"/public"));
// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.set('view engine','ejs');
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/message");
//mongoose.connect("mongodb+srv://mongodb:mongodb@mycluster-rfooj.mongodb.net/test?retryWrites=true&w=majority");
var MessageModel=mongoose.model('Message',{
    name:String,
    mailid:String,
    phone:String,
    message:String
});
app.get('/',(req,res)=>
{
    res.render('index');
});
app.get('/index',(req,res)=>
{
    res.render('index');
});
app.post('/readApi',(req,res)=>{
   var message=new MessageModel(req.body);
   message.save((error)=>
   {
       if(error)
       {
           throw error
       }
       else{
           res.send(message);
       }
   });
});

app.get('/viewApi',(req,res)=>
{
    MessageModel.find((error,data)=>{
        if(error)
        {
            throw error
        }
        else{
            res.send(data);
        }

    });
});
app.get('/view',(req,res)=>
{
    var viewlink="http://localhost:3000/viewApi";
  // var viewlink="https://angularmessage.herokuapp.com/viewApi";
    request(viewlink,(error,response,body)=>{
        var data=JSON.parse(body);
        res.render('viewmessage',{data:data});
    });
});
app.post('/searchApi',(req,res)=>{

  //  var phonear=req.params.ph;
  var phonear=req.body.phone;
    MessageModel.find({phone:phonear},(error,data)=>
    {
        if(error)
        {
            throw error;

        }
        else{
            res.send(data);
        }
    })

});
app.post('/search',(req,res)=>
{
    var phonearg=req.body.phone;
    var viewlink="http://localhost:3000/searchApi"+phonearg;
  // var viewlink="https://angularmessage.herokuapp.com/searchApi";
    request(viewlink,(error,response,body)=>{
        var data=JSON.parse(body);
        res.render('searchresult',{data:data});
    });
});
app.get('/searchform',(req,res)=>{
    res.render('searchform');
})

//DeleteApi
app.post('/delApi',(req,res)=>
{
    MessageModel.remove({_id:req.body[0]._id},(error,response)=>
    {
        if(error)
        {
            throw error;
        }
        else{
            res.send(response);
        }
    })
})
//UpdateApi
app.post('/updateApi',(req,res)=>
{
    console.log(req.body[0])
    MessageModel.findOneAndUpdate({_id:req.body[0]._id},req.body[0],(error,response)=>
    {
         if(error)
         {
             console.log(error);
             throw error;
         }
         else{
             res.send(response);
         }
    })
})


app.listen(process.env.PORT || 3002,()=>
{
    console.log("Server is running");
})