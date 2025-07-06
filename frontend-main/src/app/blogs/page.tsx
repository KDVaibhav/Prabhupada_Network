"use client"

import { BlogEditor } from '@/components/ui/BlogEditor'
import React from 'react'
import { useSelector } from 'react-redux';
const page = () => {
  const { isAuthenticated } = useSelector(
    (state: {
      auth: { isAuthenticated: boolean; user: any; windowSize: number };
    }) => state.auth
  );
  return (
    <div>
      {isAuthenticated && <BlogEditor/>}

    </div>
  )
}

export default page