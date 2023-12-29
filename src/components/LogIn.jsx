import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { Modal } from "bootstrap";
export default function LogIn() {
    const [uname, setUname] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const auth = getAuth();

    const logIn = async (e) =>{
        try {
            if(uname.trim() === '' || password.trim() === ''){
                const missingFields = new Modal(document.getElementById('missingFields'));
                missingFields.show();
                return;
            }
            await signInWithEmailAndPassword(auth, uname, password);
            setTimeout(() => {
                const success = new Modal(document.getElementById('success'));
                success.show();
              
                setTimeout(() => {
                  success.hide();
                }, 1500);
                nav('/dashboard')
              }, 0);
        } catch (error) {
            console.log(error);
            const wrong = new Modal(document.getElementById('wrong'));
                wrong.show();
        }
        

    }

    return (
        <div className="jumbotron-fluid" id="login">
            <div className="container bg-primary" id="one">
                <span className="text-light h1">Admin</span>
            </div>
            <div className="container" id="two">
                 <form onSubmit={logIn}>
                <div className="container">
                    <input
                        type="text"
                        placeholder="Username"
                        value={uname}
                        onChange={(e)=>setUname(e.target.value)}
                        
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        
                    />
                    <button className="btn btn-primary" type="button" onClick={logIn}>
                        Log In
                    </button>
                </div>
            </form>
            </div>
            <div id="wrong" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-dark">
                            Log In Unsuccessful check email or password
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="success" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog  modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-dark">
                            Log In Successful
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="missingFields" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-dark">
                            Missing Fields
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}