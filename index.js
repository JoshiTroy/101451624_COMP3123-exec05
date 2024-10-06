const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');


app.use(express.json());


router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});


router.get('/profile', (req, res) => {
    fs.readFile(path.join(__dirname, 'user.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Server Error" });
        }
        res.json(JSON.parse(data));
    });
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', req.body); 

    
    if (!username || !password) {
        return res.status(400).json({ status: false, message: "Username and password are required" });
    }

    fs.readFile(path.join(__dirname, 'user.json'), 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading user.json:', err); 
            return res.status(500).json({ message: "Server Error" });
        }

   
        let users;
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError); 
            return res.status(500).json({ message: "Error parsing user data" });
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.json({ status: false, message: "User Name is invalid" });
        }

        if (user.password !== password) {
            return res.json({ status: false, message: "Password is invalid" });
        }

        res.json({ status: true, message: "User is valid" });
    });
});


router.get('/logout/:username', (req, res) => {
    const { username } = req.params;
    res.send(`<b>${username} successfully logged out.</b>`);
});


app.use((err, req, res, next) => {
    console.error(err); 
    res.status(500).send("Server Error");
});


app.use('/', router);


app.listen(process.env.PORT || 8081, () => {
    console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});