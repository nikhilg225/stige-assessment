const xpress=require('express');
const app=xpress();
var cookieParser = require('cookie-parser');


//Google Authentication
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID="254709854890-v2s316h9v631gr0h570js01096gio73g.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);



//MiddleWare
app.set('view engine', 'ejs');
app.use(xpress.json())
app.use(cookieParser())
// // app.use('/', index);
// app.use('/api/auth', require('./controllers/AuthController'));
// app.use('/api/v1/', projects);




app.post('/login',function(req,res){
    let token=req.body.token;
    // console.log(token);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify().then(()=>{
        res.cookie('session-token',token);
        res.send('success');
      }).catch(console.error);


})

app.get("/profile",checkAuthenticated,function(req,res){
    let user=req.user;
    // res.sendFile(__dirname+"/profile.html",{user});
    res.render('profile',{user});
});

app.get('/logout',function(req,res){
    res.clearCookie('session-token');
    res.redirect('/');
})


app.get('/',function(req,res){
    // res.sendFile(__dirname+'/login.html');
    res.render('login');
});


function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}






app.listen(8080,function(){
    console.log(__dirname);
});