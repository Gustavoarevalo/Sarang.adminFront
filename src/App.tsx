import { useCallback, useEffect } from 'react'
import PrivateRoute from './routes/privateRoute';
import { useAuth } from './api/Controller/Seguridad/auth/authController';
import { useFillData } from './Hooks/useFilldata';
import LoginRoute from './routes/loginRoute';
import { PermisosGlobalStore } from './store/PermisosGlobalStore';
interface IDataApp {
  isLeido: boolean
  isLogin: boolean
}

const DataApp: IDataApp = {
  isLeido: false,
  isLogin: true
}

function App() {
  const auth = useAuth()
  const data = useFillData<IDataApp>(DataApp)
  const permisos = PermisosGlobalStore()

  const renderGetInfo = useCallback(async () => {
  
    try {
      const Inicio = auth.getLogin()
      if (Inicio) {

        const response = await auth.getPermisosUser()
        response.permisosCompany = [1]                                                              
        permisos.SetPermisosGlobal(response)
        data.updateData(false, 'isLogin')
      }
    } catch (e) {
      auth.removeLogin()
    }
    finally {
      data.updateData(true, 'isLeido')
    }
  }, [])

  useEffect(() => {
    renderGetInfo()
  }, [renderGetInfo]);

  return data.data.isLeido && (
    <>
      {data.data.isLogin ? (
        <>
          <LoginRoute />
        </>
      ) : (
        <>
          <PrivateRoute />
        </>
      )}
    </>
  )
}

export default App;
