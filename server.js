let port = process.env.PORT || 8000;
let googleImageAPI = require('google-images');
let express = require('express');
let morgan = require('morgan');
let dotenv = require('dotenv');

dotenv.config({ verbose: true });

let app = express();

app.locals.searches = [];

app.use(morgan('combined'));

app.set('view engine', 'ejs');

app.get('/search/:query', (request, response) => {
	var offset = request.query.offset || 10;
	var q = request.params.query || null;
	if(q === null || q === undefined) {
		return response.status(400).json('Undefined query');
	}
	var searchQuery = new googleImageAPI(process.env.googleId, process.env.apiKey);
	searchQuery.search(q, {
		page: offset
	}).then((images) => {
		app.locals.searches.push(request.url);
		return response.status(200).send(images);
	}).catch((err) => {
		return response.status(400).send(err);
	})
});

app.get('/latest', (request, response) => {
	if(app.locals.searches.length > 0){
		return response.status(200).json(app.locals.searches.reverse().slice(0, 10));
	}
	return response.status(400).json([]);
});

app.listen(port, () => console.log('Listening on port ' + port));