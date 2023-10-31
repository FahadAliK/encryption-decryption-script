#!/usr/bin/env node
const CryptoJS = require('crypto-js');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Define a secret key for AES encryption
const secretKey = 'YourSecretKeyHere';
// console.log(process.execPath);
// console.log(__dirname);

// Read the CSV file (for Node.js)
const csvFilePath = path.join(__dirname, 'data.csv'); // Replace with your file path
const file = fs.createReadStream(csvFilePath, 'utf8');
// Define a function to handle the parsed CSV data
function handleCSVData(results) {
	// This function will be called with the parsed data.
	// You can access the data as an array of objects.
	// For example, let's log the first row:
	// console.log('First row:', results.data[1]);
	// var decrypted = CryptoJS.AES.decrypt(results.data[1][0], secretKey).toString(
	// 	CryptoJS.enc.Utf8
	// );

	results.data[0].splice(2, 0, 'Email');
	results.data[0].splice(3, 0, 'Phone Number');
	for (let i = 1; i < results.data.length; i++) {
		// console.log(results.data[i]);
		var decryptedEmail = CryptoJS.AES.decrypt(results.data[i][0], secretKey).toString(CryptoJS.enc.Utf8);
		// results.data[i][0] = decryptedEmail;
		results.data[i].splice(2, 0, decryptedEmail);
		var decryptedPhone = CryptoJS.AES.decrypt(results.data[i][1], secretKey).toString(CryptoJS.enc.Utf8);
		// results.data[i][1] = decryptedPhone;
		results.data[i].splice(3, 0, decryptedPhone);
	}
	const csvString = Papa.unparse(results);
	const filePath = path.join(path.dirname(process.execPath), '/output.csv');
	fs.writeFile(filePath, csvString, { flag: 'w' }, (err) => {
		if (err) {
			console.error('Error writing CSV file:', err);
		} else {
			console.log(`CSV file written successfully`.yellow.bold);
		}
	});
}

// Parse the CSV file
Papa.parse(file, {
	header: false, // Treat the first row as a header
	dynamicTyping: true, // Automatically convert numbers and booleans
	complete: handleCSVData, // Callback function to handle the parsed data
	error: (error) => console.error('CSV parsing error:', error.message),
});
