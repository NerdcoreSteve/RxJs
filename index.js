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
                text: "Kernel Class smiles a gleefully evil grin. \"This time I have her!\" he shouts. \"Objects! object.attack()!!!\""
            })
        case 3:
            return res.json({
                text: "Back on the bridge of the good ship JavaScript, Captain Code commands \"Evasive manuvers!\""
            })
        case 4:
            return res.json({
                text: "But Captain Code needn't have bothered. The objects are acting strangely. Some are doing nothing, while others are attacking themselves or each other!!"
            })
        case 5:
            return res.json({
                text: "\"That's what happens when you have mutable state,\" says Captain Code as she moves her faster ship out of range, \"You never know what your code will do when you call the same function under the same circumstances!\""
            })
        case 6:
            return res.json({
                text: "And so, Kernel Class is left to debug his objects, not knowing where to start. And Captain Code flys off in search of more adventure!"
            })
        default:
            return res.status(400).send({ error: 'pageNumber not found' })
    }
})

app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')
})
