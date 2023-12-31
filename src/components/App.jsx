// import useAuth from "hooks/useAuth";
import React, { lazy } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { refreshUser } from 'redux/auth/authOperations';
import { RestrictedRoute } from './Routes/RestrictedRoute';
import { PrivateRoute } from './Routes/PrivateRoute';
import { Suspense } from 'react';
import { Loader } from './Loader/Loader';

import { CurrencyTable } from './Currencies/Currencies';

import { Diagram } from './DashBoard/Statistics/Diagram';

import Modal from './ModallAddTransaction/ModalAddTransaction';
import { useAuth } from 'hooks/useAuth';

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));

const RegistrationPage = lazy(() =>
  import('../pages/RegistrationPage/RegistrationPage')
);
const Header = lazy(() => import('./shared/Header'));
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage/DashboardPage')
);
const NotFound = lazy(() => import('../pages/NotFound/NotFoundPage'));

export const App = () => {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <b>Refreshing user...</b>
  ) : (
  // return(
    <div>
      <Suspense fallback={<Loader />}>
        {/* <Modal /> */}
        <Routes>
          <Route index element={<LoginPage />} />
          <Route
            path="/"
            element={
                <RestrictedRoute component={<LoginPage />} redirectTo="/home" />
            }
          />

          <Route
            path="/register"
          element={
              <RestrictedRoute
                redirectTo="/"
                component={<RegistrationPage />} />
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute
                component={<DashboardPage />}
                redirectTo="/"
              ></PrivateRoute>
            }
          >
            <Route path="diagram" element={<Diagram />} redirectTo="/"/>
            <Route path="currencies" element={<CurrencyTable redirectTo="/" />} />
            <Route path="*" redirectTo="/"/>
          </Route>
          <Route path="*" element={<NotFound />} redirectTo="/" />
          <Route path="/notfound" element={<NotFound />} redirectTo="/"/>
        </Routes>
      </Suspense>
    </div>
  );
};
