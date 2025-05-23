import { StrictMode } from 'react'
import {  createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../src/config/i18n.js'
import { Provider } from "react-redux"
import store from './redux/store.js'
import { BrowserRouter } from 'react-router'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </BrowserRouter>
)

// hydrateRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <StrictMode>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </StrictMode>
//   </BrowserRouter>
// )
