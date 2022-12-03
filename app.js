const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();
app.use(express.static("public"));//this is used to access all static files
// for our html page like css file and images.//public is the folder name.
app.use(bodyparser.urlencoded({extended:true}));
app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
})
app.post("/",function(req,res)
{
    // console.log(req.body.first);
    // console.log(req.body.last);
    // console.log(req.body.mail);
    const first_name=req.body.first;
    const last_name=req.body.last;
    const email_a=req.body.mail;

    //this data we have to send to the mailchimp api.
    //so that will accept the data in a json file
    //so we will make javascript object then we will convert it into the json file.
    const data={
        members:[
            {
                email_address: email_a,
                status: "subscribed",
                merge_fields:{
                    FNAME:first_name,
                    LNAME:last_name
                }

            }
        ]

    };//here data is a object 
    //members is a array of objects
    //merge_fields is also a object
    const jsondata=JSON.stringify(data);//this will convert the file into the string type data.
    //res.send("hello ");
    const url="https://us18.api.mailchimp.com/3.0/lists/2177e5f4b9";
    const options={
        method:"POST",
        auth:"uttam1:b92ea4862a790297918c06d9f7c42ba3-us18"
    }
    
    const request=https.request(url,options,function(response)
    {
        
        console.log(response.statusCode);
        const status_code=response.statusCode;
        console.log(response.status_code);
        if(status_code==200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data)
        {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsondata);
    request.end();
    

});

app.post("/failure",function(req,res)
{
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
    console.log("server oon 3000");
})

//8bda8f6fb6a86c5e3f8a76206099454b-us18
//saae1ae8e7b45b60e632df98f30d7d4f0-us18
//2177e5f4b9.