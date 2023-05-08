import express from 'express'

export default function startServer() {
  const app = express()

  app.listen(3000)
}