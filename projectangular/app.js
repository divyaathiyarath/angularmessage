const Express=require('express');
var app=new Express();
var request=require('request');
var bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:'true'}));
app.use(Express.static(__dirname+"/public"));
app.set('view engine','ejs');
var mongoose=require('mongoose');
//mongoose.connect("mongodb://localhost:27017/message");
mongoose.connect("mongodb+srv://mongodb:mongodb@mycluster-rfooj.mongodb.net/test?retryWrites=true&w=majority");
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
   // var viewlink="http://localhost:3000/viewApi";
   var viewlink="https://angularmessage.herokuapp.com/viewApi";
    request(viewlink,(error,response,body)=>{
        var data=JSON.parse(body);
        res.render('viewmessage',{data:data});
    });
});
app.post('/searchApi',(req,res)=>{
    var phone=req.body.phone;
    MessageModel.find({phone:phone},(error,data)=>
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
app.get('/search',(req,res)=>
{
   // var viewlink="http://localhost:3000/viewApi";
   var viewlink="https://angularmessage.herokuapp.com/searchApi";
    request(viewlink,(error,response,body)=>{
        var data=JSON.parse(body);
        res.render('searchresult',{data:data});
    });
});


app.listen(process.env.PORT || 3000,()=>
{
    console.log("Server is running");
})