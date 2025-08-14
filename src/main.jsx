import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GUI from './login.jsx'
import CreateTrainGUI from './createtrain.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <CreateTrainGUI />
  </StrictMode>,
)
