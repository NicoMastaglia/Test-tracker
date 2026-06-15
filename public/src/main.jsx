import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/Auth/AuthContext.jsx';
import { ProjectProvider } from './context/Project/ProjectContext';
import { UserProvider } from './context/User/UserContext';
import { ChecklistProvider } from './context/Checklist/ChecklistContext';
import { SessionProvider } from './context/Session/SessionContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProjectProvider>
        <UserProvider>
          <ChecklistProvider>
            <SessionProvider>
              <App/>
            </SessionProvider>
          </ChecklistProvider>
        </UserProvider>
      </ProjectProvider>
    </AuthProvider>
  </StrictMode>,
)
