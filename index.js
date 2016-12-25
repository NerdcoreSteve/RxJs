var express = require('express')  
var app = express()  
app.use(express.static('public'))  
app.set('view engine', 'pug')

app.get('/', function (req, res) {  
    res.render('index')
})

app.get('/ajax', function (req, res) {  
    res.json({
        message: 'This comes from an AJAX call!'
    })
})

app.get('/heroes', function (req, res) {  
    res.json({
        heroes: [
            {
                'id': 1,
                'name': 'Wonder Woman'
            },
            {
                'id': 2,
                'name': 'Superman'
            },
            {
                'id': 3,
                'name': 'Batman'
            },
            {
                'id': 4,
                'name': 'The Flying Squirrel'
            },
            {
                'id': 5,
                'name': 'The Red Panda'
            }
        ]
    })
})

app.get('/sidekicks/:heroid', function (req, res) {  
    switch(parseInt(req.params.heroid)) {
        case 3:
            return res.json({
                side_kicks: [
                    {
                        'id': 6,
                        'name': 'Robin',
                        'real_name': 'Dick Grayson'
                    },
                    {
                        'id': 7,
                        'name': 'Robin',
                        'real_name': 'Jason Todd'
                    },
                    {
                        'id': 8,
                        'name': 'Robin',
                        'real_name': 'Tim Drake'
                    },
                    {
                        'id': 9,
                        'name': 'Robin',
                        'real_name': 'Damian Wayne'
                    },
                    {
                        'id': 10,
                        'name': 'Robin',
                        'real_name': 'Stephanie Brown'
                    },
                    {
                        'id': 11,
                        'name': 'Robin',
                        'real_name': 'Carrie Kelly'
                    }
                ]
            })
        default:
            return res.status(400).send({ error: 'Hero id not found' })
    }
})

app.get('/firstappearance/:heroid', function (req, res) {  
    switch(parseInt(req.params.heroid)) {
        case 9:
            return res.json({
                'id': 9,
                'name': 'Robin',
                'real_name': 'Damian Wayne',
                'first_appearance': {
                    'title': 'Batman #655',
                    'year': 2006
                }
            })
        case 10:
            return res.json({
                'id': 10,
                'name': 'Robin',
                'real_name': 'Stephanie Brown',
                'first_appearance': {
                    'title': 'Detective Comics #647',
                    'year': 1992
                }
            })
        case 11:
            return res.json({
                'id': 11,
                'name': 'Robin',
                'real_name': 'Carrie Kelly',
                'first_appearance': {
                    'title': 'Batman: The Dark Knight Returns',
                    'year': 1986
                }
            })
        default:
            return res.status(400).send({ error: 'Hero id not found' })
    }
})

app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')
})
