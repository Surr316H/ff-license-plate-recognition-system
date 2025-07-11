import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { ROUTES } from "./constants"
import { lazy, Suspense } from "react"
import { Loader } from "../components"
import { PrivateRoute } from "./private-route"

const AuthPage = lazy(() => import('../pages/auth-page'))
const StreamPage = lazy(() => import('../pages/stream-page'))

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path={ROUTES.AUTH_PAGE} 
          element={
            <Suspense fallback={<Loader fullscreen />}>
              <AuthPage />
            </Suspense>}
          />
        <Route 
          path={ROUTES.STREAM_PAGE} 
          element={
            <Suspense fallback={<Loader fullscreen />}>
              <PrivateRoute>
                <StreamPage />
              </PrivateRoute>
            </Suspense>
          }
        />
        
        <Route path="*" element={<Navigate to={ROUTES.AUTH_PAGE} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
