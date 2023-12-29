import React, {useEffect, useState} from "react";
import { db } from "../dbcreds/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { Modal } from "bootstrap";
import {GoArrowLeft} from 'react-icons/go'
import { useNavigate } from "react-router-dom";
export default function Seller(){
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);
    const dbref = ref(db, 'Verified');
    const nav = useNavigate();
    useEffect(()=>{
        const getSeller = () => {
            onValue(dbref, (snapshot)=>{
            const seller = snapshot.val();
            if(seller){
                const sellerData = Object.entries(seller).map(([key, value])=>({
                    key, ...value
                }));
                setData(sellerData); 
            }else{
                setData([]);
            }
            })
        }
        getSeller();
        return () =>{
            onValue(dbref,()=>{});

        }
    },[]);
    const deleteMOdal = (user) =>{
    setUser(user);
    const modalDelete = new Modal(document.getElementById('deleteModal'));
    modalDelete.show();
    setModal(modalDelete);
    }
    const back = () =>{
        nav(-1);
    }
    return(
        <div className="container-fuid">
            <GoArrowLeft style={{cursor: 'pointer'}} className="m-2 lead" onClick={back}></GoArrowLeft>
            <div className="lead p-3">Seller</div>
            <div className="container p-5">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((seller) => (
                            <tr key={data.key}>
                                <td>{seller.MAIL}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div id="deleteModal" className="modal fade" data-bs-backdrop="static" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h5">Delete Record: {user?.MAIL}</div>
                        </div>
                        <div className="modal-body text-dark">
                            Are you sure you want to delete <b>{user?.MAIL}'s</b> Account? Doing so will also delete this accounts Products
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}