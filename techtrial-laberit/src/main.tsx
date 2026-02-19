import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { UsersProvider } from './context/UsersContext'
import UserList from './pages/UserList'
import UserDetail from './pages/UserDetail'
import UserForm from './pages/UserForm'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UsersProvider>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
        </Routes>
      </UsersProvider>
    </BrowserRouter>
  </StrictMode>
)