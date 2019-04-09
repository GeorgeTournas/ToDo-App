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
    console.log('Could not connect to database.');
    console.log(e);
};

const todoAPI = express();
const port = 3000;

todoAPI.use(express.static(__dirname + '/public'));
todoAPI.use(bodyParser.json());

todoAPI.listen(port, () => console.log(`ToDo app is running on port ${port}!`));

// get tasks from db
todoAPI.get('/tasks', (req,res)=>{
    dbConnect.query('SELECT * FROM tasks ORDER BY id DESC', (error,results)=>{
        if (error) return res.json({error: error});

        res.json(results);
    });
});

// post task to db
todoAPI.post('/add', (req, res) => {
    console.log('-- DATA SEND --');
    
    dbConnect.query('INSERT INTO tasks (task_name,task_description,task_date,task_status) VALUES (?,?,?,?)',
        [req.body.taskName, req.body.taskDescription, req.body.taskDate, req.body.taskStatus],
        (error, results) => {
            if (error) return res.json({ error: error });
            
            // get the id of the inserted task
            dbConnect.query('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
                if (error) return res.json({ error: error });

                //return inserted object as json
                res.json({
                    id: results[0]['LAST_INSERT_ID()'],
                    task_name: req.body.taskName,
                    task_description: req.body.taskDescription,
                    task_date: req.body.taskDate,
                    task_status: req.body.taskStatus
                });
            });

            console.log('-- DATA SUCCESFULLY INSERTED TO DATABASE --');
        });
});

// remove task from db
todoAPI.post('/tasks/:id/remove', (req, res) => {
    dbConnect.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (error, results) => {
        if (error) return res.json({ error: error });

        res.json({ task: 'DELETED' })
        console.log(results);
    })
})