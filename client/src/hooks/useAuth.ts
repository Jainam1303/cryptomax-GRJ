import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../redux/thunks/authThunks';
import { RootState, AppDispatch } from '../redux/store';

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, user]);
  
  return { isAuthenticated, user, loading, error };
};

export default useAuth;