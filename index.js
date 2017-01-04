var express = require('express')  
var app = express()  
app.use(express.static('public'))  
app.set('view engine', 'pug')

app.get('/', function (req, res) {  
    res.render('index')
})

app.get('/story/:pageNumber', function (req, res) {
    switch(parseInt(req.params.pageNumber)) {
        case 1:
            return res.json({
                text: "This time we meet Captain Code in the middle of another adventure! Piloting the airship JavaScript, she comes under attack by Kernel Class and his fleet of flying object-oriented objects!"
            })
        case 2:
            return res.json({
                text: "2"
            })
        case 3:
            return res.json({
                text: "3"
            })
        case 4:
            return res.json({
                text: "4"
            })
        case 5:
            return res.json({
                text: "5"
            })
        default:
            return res.status(400).send({ error: 'pageNumber not found' })
    }
})

app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')
})
