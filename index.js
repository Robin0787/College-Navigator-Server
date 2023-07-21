const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3010;


app.use(express.json());
app.use(cors());





app.get('/', (req, res) => {
    res.send('Welcome to College Navigator Server');
})

app.listen(port, () => {
    console.log('Server is running on port 3010');
});