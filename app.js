const express = require('express')
const cheerio = require('cheerio')
const path = require('path')
const request = require('request')


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'frontend')));

app.post('/scrapeData', (req, resp) => {
    resp.setHeader('Content-Type', 'application/json');
    let response = req.body;
    console.log("URL is here: ", response)
    // console.log("here", response)
    request(response.url, (err, res, htmlRes) => {
        if (err){
            console.error(err)
            resp.send({message:'Some Error Occured!'});
            return
        }
        var responseResult = {}
        responseResult = {},
            $ = cheerio.load(htmlRes),
            $title = $('head title').text(),
            $ogTitle = $('meta[property="og:title"]').attr('content'),
            $desc = $('meta[name="description"]').attr('content'),
            $ogDescription = $('meta[property="og:description"]').attr('content'),
            $images = $('img')
            
        
        if ($title){
            responseResult.title = $title
        }
        if ($ogTitle){
            responseResult.ogTitle = $ogTitle
        }
        if ($desc){
            responseResult.description = $desc
        }
        if ($ogDescription){
            responseResult.ogDescription = $ogDescription
        }
        if ($images && $images.length){
            responseResult.images = [];
            for (var i = 0; i < $images.length; i++) {
                responseResult.images.push($($images[i]).attr('src'));
            }
        }

        resp.send(JSON.stringify(responseResult));
    })
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running");
})
