const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const pug = require('pug');
const User = require('./src/utils/User');
const querystring = require('querystring');
dotenv.config()

const {APP_PORT, APP_SERVER} = process.env

const filePath = path.join(__dirname, 'src','views','form.html');
const dataPath = path.join(__dirname, 'src', 'Data') 
const pugTemplatePath = path.join(__dirname, 'src','views', 'users.pug');
const assetsPath = path.join(__dirname, "src", "assets" , "css")


const renderPugTemplate = (templatePath, data) => {
    return pug.renderFile(templatePath, data);
};

const server = http.createServer(async(req, res) => {

    if (req.url === '/') {
        if(req.method === 'GET'){
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content);
                }
                });
                return;
        
        }

        if(req.method === 'POST'){
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString()
            })
            req.on("end", ()=>{
                const userInfo = querystring.parse(body)
                const user = new User(userInfo);
                
                if(user.name ===''){
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                      })
            
                    return res.end("Merci de saisir un nom d'utilisateur")
                }
                if (user.birth ===""){
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                      })
            
                    return res.end("Merci de saisir une date d'anniversaire")

                }
                user.addUser();
                res.writeHead(301, {
                    "Location": "/"
                })
                res.end()
        
            })
            return;
        }

    } 
    
    if (req.url === "/style") {
        const css = fs.readFileSync(path.join(assetsPath, "style.css"), {encoding: "utf8"})
        res.writeHead(200, {
          "Content-Type": "text/css"
        })
        return res.end(css)
      }
      
    
    if (req.url === '/users') {

        const all = fs.readFileSync(path.join(dataPath, "users.json"), {encoding: "utf8"})
        const users = JSON.parse(all)
        
        const html = renderPugTemplate(pugTemplatePath, { users: users });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);     

        return;
    }
    const splitUrl = req.url.split('/');
   
    if( splitUrl[1] ===  'delete') {
        const user = User.getUserFromID(splitUrl[2])
        user.deleteUser();
        res.writeHead(301, {
            "Location": "/users"
        })
        res.end()


        return;

    }
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
    
});


server.listen(APP_PORT, APP_SERVER, () => {
  console.log(`Server is listening at http://${APP_SERVER}:${APP_PORT}`);
});
