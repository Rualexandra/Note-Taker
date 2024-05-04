const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(Express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.info(`Server Started on http://localhost:${PORT}`);

})