const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
	const { firstName, lastName, email } = req.body;
	const data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);
	const url = 'https://us7.api.mailchimp.com/3.0/lists/b9cdd1e1e4';
	const options = {
		method: 'POST',
		auth: 'JoanR99:7ac72fad7268680a57c38d56618be107-us7',
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + '/success.html');
		} else {
			res.sendFile(__dirname + '/failure.html');
		}
		response.on('data', (data) => {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.post('/failure', (req, res) => {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('server is running on port 3000');
});

// api key
// 7ac72fad7268680a57c38d56618be107-us7

// list id
// b9cdd1e1e4
