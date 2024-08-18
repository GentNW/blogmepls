import { Store } from "../../app/store"
import { blogsApiSlice } from "../blogs/blogsApiSlice"
import { usersApiSlice } from "../users/usersApiSlice"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

import React from 'react'

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing')
    Store.dispatch(blogsApiSlice.util.prefetch('getBlogs', 'blogsList', { force:true }))
    Store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force:true }))
    Store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force:true }))
    
  }, [])

  return <Outlet/>
}

export default Prefetch

