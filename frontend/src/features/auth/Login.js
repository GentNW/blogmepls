import { useRef, useState, useEffect } from "react"
import {useNavigate, Link} from 'react-router-dom'

import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"

import usePersist from "../../hooks/usePersist"

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [errMsg,setErrMsg] = useState('')
  const [persist,setPersist] = usePersist()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, {isLoading}] = useLoginMutation()

  useEffect(()=>{
    //userRef.current.focus()
  })


  //clears error once the user has correctly entered their credentials
  useEffect(()=>{
    setErrMsg('')
  }, [username, password])

  const errClass = errMsg ? 'errmsg' : "offscreen"

  if(isLoading){
    <p>Loading...</p>
  }

  const handleSubmit  = async (e) => {
    e.preventDefault()
    try{
      const { accessToken } = await login({ username,password}).unwrap()
      //console.log({accessToken})
      dispatch(setCredentials({ accessToken }))
      
      setUsername('')
      setPassword('')
      navigate('/dash')

    }catch(err){
      if(!err.status){
        setErrMsg('No Server Response')
      } else if(err.status === 400){
        setErrMsg('Missing Username or Password')
      } else if (err.status === 401){
        setErrMsg('Unauthorized')
      } else{
        setErrMsg(err?.data?.message)
      }
      errRef.current.focus()
    }
  }

  
  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handlePersistToggle = (e) => setPersist(prev =>!prev)


  const content = (
    <section className="public">
      <header>
        <h1>Blogger Login</h1>
      </header>
      <main className="login">
      <p ref={errRef} className={errClass} aria-live = "assertive">{errMsg}</p>
        <form>
          <label htmlFor="username">Username:</label>
          <input 
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
              className="form__input"
              type="password"
              id="password"
              onChange={handlePwdInput}
              value={password}
              autoComplete="off"
              required
            />
            <button className="form__submit-button" onClick={handleSubmit}>Sign In</button>

            <label htmlFor="persist" className="form__persist">
              <input 
                type="checkbox"
                className="form__checkbox"
                id="persist"
                onChange={handlePersistToggle}
                checked={persist}
              />
              Trust this device
            </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  )

  return content
}

export default Login
