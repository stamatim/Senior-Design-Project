var express = require('express');
var fs = require('fs');
var ReadableData = require('stream').Readable;
var bodyParser = require('body-parser');
const QRReader = require('qrcode-reader');
const jimp = require('jimp');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/image', (req, res) => {
	var streamObj = new ReadableData();
	const imageBufferData = Buffer.from(req.body.image, 'base64');
	streamObj.push(imageBufferData);
	streamObj.push(null);
	streamObj.pipe(fs.createWriteStream('images/testImage.jpg'));
	try {
		run().catch((error) => console.error(error.stack));
		res.send('received!');
	} catch (err) {
		console.log(err);
	}
});

async function run() {
	await sleep(1000);

	const img = await jimp.read(fs.readFileSync('images/testImage.jpg'));

	const qr = new QRReader();
	const value = await new Promise((resolve, reject) => {
		qr.callback = (err, v) => (err != null ? reject(err) : resolve(v));
		qr.decode(img.bitmap);
	});
	console.log(value.result);
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

app.listen(3000, () => {
	console.log('Server is running on localhost: 3000');
});
