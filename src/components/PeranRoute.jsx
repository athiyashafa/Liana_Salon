import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { bisa, resolvePeran } from '@/lib/peran';

export default function PeranRoute({ hak, children }) {
  const { user } = useAuth();
  if (!bisa(resolvePeran(user), hak)) return <Navigate to="/" replace />;
  return children;
}