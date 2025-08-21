import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GUI from './login.jsx'
import CreateTrainGUI from './createtrain.jsx'
import EditTrain from './edittrain.jsx'
import StartTraining from './training.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <StartTraining />
  </StrictMode>,
)
