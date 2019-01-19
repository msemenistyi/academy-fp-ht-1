const express = require('express');
const app = express();

app.use(express.static(__dirname));

const server = app.listen(7777, function(err) {
	if (err) {
		console.err(err);
	}
});