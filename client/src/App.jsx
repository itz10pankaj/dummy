import Router from './router'
import Layout from './components/layout'
import { MetaTitleProvider } from './services/DynamicTitle';
import { HelmetProvider } from "react-helmet-async";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { login } from './redux/slices/authSlice';
import "./styles/global.scss"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setCourses } from './redux/slices/courseSlice';
function App({ initialData }) {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);

  useEffect(() => { 
    // console.log('Initial Data (Server):', initialData);
    // console.log('Initial Data (Client):', window.__INITIAL_DATA__);
  
    const cookieUser = (() => {
      try {
        const userCookie = document.cookie
          .split('; ')
          .find((c) => c.startsWith('user='));
        return userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
      } catch (e) {
        console.error('Cookie parse error:', e);
        return null;
      }
    })();

    if (!reduxUser && (initialData?.user || cookieUser)) {
      const alreadyLoggedOut = !initialData?.user && !cookieUser;

      if (!alreadyLoggedOut) {
        const userToSet = initialData?.user || cookieUser;
        console.log('🚀 Hydrating Redux with:', userToSet);
        dispatch(login(userToSet));
      }
    
    }
    if (initialData?.courses) {
      dispatch(setCourses(initialData.courses));
  }
  }, [reduxUser, dispatch, initialData]);

  return (
    <GoogleOAuthProvider clientId="739885106487-uqevo2bq9nms7uptck75n7ifpp2e8ped.apps.googleusercontent.com">
      <HelmetProvider>
        <MetaTitleProvider>
          <Layout initialUser={initialData?.user}>
            <Router initialData={initialData} />
          </Layout>
        </MetaTitleProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
