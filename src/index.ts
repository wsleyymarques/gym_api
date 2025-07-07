// src/index.ts
import express from 'express'

const app = express()
const port = 3000

app.use(express.json()) // ✅ Importante para req.body funcionar

// app.use(userRoutes) // ✅ Usar as rotas

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
