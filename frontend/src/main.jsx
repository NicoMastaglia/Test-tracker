import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/Theme/ThemeContext.jsx';
import { AuthProvider } from './context/Auth/AuthContext.jsx';
import { ProjectProvider } from './context/Project/ProjectContext';
import { UserProvider } from './context/User/UserContext';
import { ChecklistProvider } from './context/Checklist/ChecklistContext';
import { SessionProvider } from './context/Session/SessionContext';
import { TaskProvider } from './context/Task/TaskContext';
import { AuditProvider } from './context/Audit/AuditContext';
import ErrorBoundary from './utils/components/ErrorBoundary.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <ThemeProvider>
    <AuthProvider>
      <ProjectProvider>
        <UserProvider>
          <ChecklistProvider>
            <SessionProvider>
              <AuditProvider>
                <TaskProvider>

                <App/>

                
                </TaskProvider>
              </AuditProvider>
            </SessionProvider>
          </ChecklistProvider>
        </UserProvider>
      </ProjectProvider>
    </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
