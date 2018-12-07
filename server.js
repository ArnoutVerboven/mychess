const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mainDir = __dirname
app.use(express.static(mainDir))

app.get('/', (req, res) => res.redirect('/index'))
app.get('/index', (req, res) => res.sendFile(path.join(mainDir, 'index.html')))

app.listen(3000, () => console.log('App runnning on port 3000.'))
