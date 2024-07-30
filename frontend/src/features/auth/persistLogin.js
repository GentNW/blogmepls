import { Outlet,Link } from "react-router-dom"
import { useEffect ,useRef,useState } from "react"
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"

const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)


    const [refresh,{
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect (() => {

        if(effectRan.current === true || process.env.NODE_ENV !== 'development'){

            const verifyRefreshToken = async () =>{
                console.log('verifying refresh token')
                try{
                    //const response =
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }catch(err){ 
                    console.error(err)
                }
            }
            if(!token && persist){
                verifyRefreshToken()   
            }
            
            
        }
        return () => effectRan.current = true
    },[])

    let content
    if(!persist) { // not persisting
        console.log('no persist')
        content = <Outlet />
    }else if(isLoading){ //Waiting for a token
        console.log('loading')
        content = <p>Loading...</p>
    }else if(isError){ //in case of refresh token expiration
        console.log('Error')
        content = (
            <p className="errmsg">
                {error?.data?.message}
                <Link to="/login">Please login again</Link>
            </p>
        )
    }else if(isSuccess && trueSuccess){ //having a token
        console.log('Success!')
        content= <Outlet />
    }else if(token && isUninitialized){
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}

export default PersistLogin