import express from 'express'
import routes from "./routes";

const app = express()
const port = 3000

app.use(express.json())

app.use('/v1',routes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
