import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root, { loader as rootLoader, action as rootAction } from './routes/root';
import ErrorPage from './error-page';
import Contact, { loader as contactLoader, action as contactActionFavorite } from './routes/contact';
import EditContact, { action as contactAction } from './routes/edit';
import { action as contactDestroy } from './routes/destroy'
import Index from './routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true, element: <Index />
          },
          {
            path: 'contacts/:contactId',
            element: <Contact />,
            action: contactActionFavorite,
            loader: contactLoader,
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            action: contactDestroy,
            errorElement: <div>Oops! There was an error.</div>,
          }
        ]
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
