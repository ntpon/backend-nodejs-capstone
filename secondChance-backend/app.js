import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import pinoLogger from './logger.js'
import path from 'path'

import connectToDatabase from './models/db.js'

dotenv.config()

const app = express()
app.use('*', cors())
const port = 3060

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
  pinoLogger.info('Connected to DB')
})
  .catch((e) => console.error('Failed to connect to DB', e))

app.use(express.json())

// Route files
import secondChanceRoutes from './routes/secondChanceItemsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import pinoHttp from 'pino-http'
import logger from './logger.js'

app.use(pinoHttp({ logger }))
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'public')))

// Use Routes
app.use('/api/secondchance/items', secondChanceRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/secondchance/search', searchRoutes)

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

app.get('/', (_req, res) => {
  res.send('Inside the server')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})