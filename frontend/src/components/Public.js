import { Link } from "react-router-dom";

const Public = () => {
    
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">blogmepls!</span></h1>
            </header>
            <main className="public__main">
                <p>life is something and stuff, lorem ipsum and whatnot.</p>
                <address className="public__addr">
                    something <br/>
                    3423 drive <br/>
                    something city <br/>
                </address>
                <br/>
                <p>Owner: Zeyad Medhat</p>
            </main>
            <footer>
                <Link to="/login">Employee login</Link>   
            </footer>  
        </section>
    )
    return content
}

export default Public
