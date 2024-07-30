import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"
import Login from '../features/auth/Login';
import useAuth from '../hooks/useAuth';
const DashFooter = () => {

    const {username, status} = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')
    const onLoginClicked = () => navigate('/login')


    let goHomeButton = null

    if(pathname !== '/dash'){
        goHomeButton = (
            <button 
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}>
                <FontAwesomeIcon icon={faHouse}/>
            </button>
        )
    }

    let loginButton = null

    if(pathname !== '/dash'){
        loginButton = (
            <button
                className='dash-footer__button icon-button'
                title="Login"
                onClick={onLoginClicked}
            />
        )
    }

    const content= (
        <footer className="dash-footer">
            {goHomeButton}
            {loginButton}
            <p>Current User: {username}</p>
            <p>Status:{status}</p>
        </footer>
    )
    return content
}

export default DashFooter
