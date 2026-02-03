"use client";
import Navbar from './components/navbar'
import React from 'react'
import { useAppSelector, selectCurrentUser, selectIsAuthenticated, logout, useAppDispatch } from '@repo/store';

const page = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  
  return (
    <>
    <Navbar />
    <h1>Documentation</h1>
    </>
  )
}

export default page