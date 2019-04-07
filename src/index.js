const express = require('express');
const bodyParser = require('body-parser');
const mySQL = require('mysql2');

const dbConnect = mySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
});

try {
    dbConnect.connect()
 } catch (e) {
    //console.log('Could not connect to database.');
    console.log(e);
}


const todoAPI = express();
const port = 3000;

todoAPI.use(express.static(__dirname + '/public'));
todoAPI.use(bodyParser.json());

todoAPI.listen(port, () => console.log(`ToDO app is running on port ${port}!`));

todoAPI.post('/add', (req, res) => {
    console.log(req.body);
    dbConnect.query('INSERT INTO tasks (task_name,task_description,task_date,task_status) VALUES (?,?,?,?)',
        [req.body.taskName, req.body.taskDescription, req.body.taskDate, req.body.taskStatus],
        (error, results) => {
            if (error) return res.json({ error: error });

            dbConnect.query('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
                if (error) return res.json({ error: error });

                console.log(results);
            })
    })
})