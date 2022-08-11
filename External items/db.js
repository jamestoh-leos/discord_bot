var mysql = require('mysql');
var con = mysql.createConnection({
host     : 'localhost',
user     : 'root',
password : '',
database : 'music'
});

con.connect(error => {
if(error) throw error;
console.log("Connection to database successful!");
});