
const LoginPage = () => {
    return (<>
        <div className="login-form">
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control-plaintext" id="staticEmail" value="email@example.com"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                    <input type="password" className="form-control" id="inputPassword" placeholder="Password"/>
                    </div>
                </div>
            </form>
        </div>
    </>);
}

export default LoginPage;