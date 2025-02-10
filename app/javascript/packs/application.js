import { createRoot } from 'react-dom/client'
import React from 'react'
import App from 'App.jsx'
import 'main.scss'

const container = document.getElementById('ReactApp')
const root = createRoot(container)
root.render(<App />)
