const fs = require('fs');
const path = require("path");
const multer = require("multer");

const exphbs  = require('express-handlebars');


const express = require("express");

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
let data = JSON.parse(fs.readFileSync('public/data/data.json', 'utf8'));


  app.get('/add', function (req, res) {
    res.render('add');
  });


  const upload = multer({
    dest: "./public/data/images"
  });


  app.post('/upload',
  upload.single("image"),(req, res) => { 
      tempPath=req.file.path;
      extension=path.extname(req.file.originalname).toLowerCase();
      if (extension === ".png" || extension === ".jpg" ) {
        fs.rename(tempPath, tempPath+extension, err => {
          if (err) dettach(tempPath) ;
        });
      }else {
        dettach(tempPath)
      }
      console.log(tempPath)
      const nv = { name: req.body.name, characteristics: req.body.characteristics, photo: "data/images/"+path.basename(tempPath)+extension };
      data.push(nv)
      let jsonData=JSON.stringify(data)  
      fs.writeFile('public/data/data.json', jsonData, 'utf8', (err) =>{
        if (err) dettach(tempPath);
        res.redirect('/');
      }); 
  });

  const dettach=(tempPath)=>{
    fs.unlink(tempPath, err => {
      if (err) return ;
     });
  }

  app.get('/', function (req, res) {
    res.render('index',{jujutsu:data});
  });


  const port = process.env.PORT || 9005
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
  


