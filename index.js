const path = require('path')

const express = require('express')

const request = require('request')

const { config, engine } = require('express-edge');

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')

const Post = require('./database/models/Post')

const app = express();
app.use(fileUpload())
mongoose.connect('mongodb://localhost/easyblog',{ useNewUrlParser: true });

app.use(express.static('public'))

app.use(engine)

app.set('views', `${__dirname}/views`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async(req,res) =>{
	const posts = await Post.find({})
	res.render('index', {
		posts
	})
})


app.get('/about', (req,res) =>{
	res.render('about')
})

app.get('/post/:id', async (req, res)=>{
	const post = await Post.findById(req.params.id)
	res.render('post', {
		post
	})
})

app.get('/contact', (req, res)=>{
	res.render('contact')
})

app.get('/create', (req, res)=>{
	res.render('create')
})
app.post('/post/store',(req,res)=>{
	const {image} = req.files
	image.mv(path.resolve(__dirname, 'public/posts', image.name),(error)=>{
		Post.create({
			...req.body,
			image: `/posts/${image.name}`
		}, (error, post)=>{
		res.redirect('/')
	})
	
	})

})
    


app.listen(3000, () =>{
	console.log('App Listening on port:3000')
} )











