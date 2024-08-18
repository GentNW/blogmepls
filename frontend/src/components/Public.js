import { Link } from "react-router-dom";

const Public = () => {
    
    const content = (
        <section className="public">
            <header>
                <div className={`dash-header__container`}>
                    <h1 className='dash-header__title'>Welcome to blogmepls!</h1>
                    <nav className='dash-header__nav'>
                        <span className=""><Link to="/login">Login</Link></span>
                        <span classname=""><Link to="/register">Sign up</Link></span>
                    </nav>
                </div>
            </header>

            <main className="public__main">
                <p className="title_text">Your station for self expression!</p>
            </main>
            <footer>
            <p>Made by: Zeyad Medhat</p>
            </footer>  
        </section>
    )
    return content
}

export default Public
