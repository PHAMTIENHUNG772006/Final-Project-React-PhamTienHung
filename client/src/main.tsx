import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers/routers.tsx';
import stores from './redux/stores/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={stores}>
      <RouterProvider router={router}>
     </RouterProvider>
    </Provider>
  </StrictMode>,
)
