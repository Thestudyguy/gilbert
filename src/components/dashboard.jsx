import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, get, remove } from "firebase/database";
import { db } from "../dbcreds/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import {v4 as uuidv4} from "uuid";
import { CiLogout } from "react-icons/ci";
import { getAuth, signOut } from "firebase/auth";
export default function Dashboard() {
  const dbref = ref(db, 'Account');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  //const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');
  //const [reportFlag, setReportFlag] = useState(0);
  const [selectedUserAccount, setSelectedUserAccount] = useState(null);
  const [product, setProduct] = useState([]);
  const [modal, setModal] = useState(null);
  const nav = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = () => {
      onValue(dbref, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersArray = Object.entries(data).map(([key, value]) => ({
            key,
            ...value,
          }));
          setUsers(usersArray);
        } else {
          setUsers([]);
        }
      });
    };

    fetchData();

    return () => {
      onValue(dbref, () => {});
    };
  }, []);

  const handleViewClick = async (user) => {
    setSelectedUser(user);
  
    // Reference to the user's account
    const accountRef = ref(db, `Account/${user.key}`);
    onValue(accountRef, (accountSnapshot) => {
      const accountData = accountSnapshot.val();
      console.log("Account Data:", accountData);
      setSelectedUserAccount(accountData);
    });
  
    // Reference to the user's products under the Account node
    const productRef = ref(db, `Account/${user.key}/Product`);
  
    try {
      const productSnapshot = await get(productRef);
      const userProductData = productSnapshot.val();
      console.log("Products for this user", userProductData);
      setProduct(userProductData || []);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  
    const viewInfoModal = new Modal(document.getElementById("viewInfo"));
    viewInfoModal.show();
  };
  
  
  
  const ViewImages = (userProduct) => {
    setProduct(userProduct);
    const prodRef = ref(db, `Product/${userProduct.key}`);
    
    onValue(prodRef, (prodSnap) => {
      const UsersProduct = prodSnap.val();
      console.log('Products for this user', UsersProduct);
    });
  };
  //i comment lang kay magamit pa ang child node adding anis
  //const createAccount = (e) => {
  //  e.preventDefault();
  //  try {
  //    if (username.trim() === '' || password.trim() === '' || reportFlag.trim() === '') {
  //      const missingFields = new Modal(document.getElementById('missingFields'));
  //      missingFields.show();
  //      setTimeout(() => {
  //        missingFields.hide();
  //      }, 1500);
  //      return;
  //    }
//
  //    if (!selectedUser) {
  //      return;
  //    }
  //    const newUserId = selectedUser.key;
  //    push(ref(db, `Users/${newUserId}/Account`), {
  //      UserName: username,
  //      Password: password,
  //      ReportFlag: reportFlag,
  //    })
  //      .then(() => {
  //        setPassword('');
  //        setReportFlag(null);
  //        setUsername('');
  //        const viewInfo = new Modal(document.getElementById('viewInfo'));
  //        const success = new Modal(document.getElementById('success'));
  //        success.show();
  //        setTimeout(() => {
  //          success.hide();
  //          viewInfo.hide();
  //        }, 1000);
  //      })
  //      .catch((error) => {
  //        console.log(error);
  //      });
  //  } catch (error) {
  //    const errror = new Modal(document.getElementById('error'));
  //    errror.show();
  //  }
  //};
const account = () =>{
    nav('/accounts')
}
const admindashboard = ()=>{
  nav('/AdminDashboard');
}
const reportDashboard = ()=>{
  nav('/reports');
}
const ConfirmDelete =  (user) => {
  setSelectedUser(user);
  console.log('selected user: ', user);
  console.log('user key: ', user.key);
  const deleteModal = new Modal(document.getElementById('deleteModal'));
  deleteModal.show();
  setModal(deleteModal);
  console.log(selectedUser);
}
const deleteUser = async () => {
  try {
    if (!selectedUser) {
      console.log('No user selected');
      return;
    }

    const removeUserKey = ref(db, `Account/${selectedUser.key}`);
    await remove(removeUserKey);
    console.log(removeUserKey);
    const successModal = new Modal(document.getElementById('success'));
    successModal.show();
    modal.hide();
    setTimeout(() => {
      successModal.hide();
    }, 1500);
  } catch (error) {
    const errorText = document.getElementById('errorText');
    errorText.textContent = `Error: ${error.message || 'Unknown error'}`;
    const errorModal = new Modal(document.getElementById('error'));
    errorModal.show();
    console.log(error);
  }
};
const seller = () =>{
  nav('/seller');
}
const handleLogout = async () => {
  try {
    await signOut(auth);
    nav("/");
  } catch (error) {
    console.error("Error logging out: ", error);
  }
};
  return (
    <div className="container-fluid" id="dashboard">
      <div className="row">
        <div className="col-lg-3 p-5 bg-dark text-light">
          <span className="text-light">Shop Admin</span>
          <ul className="p-5">
            <li><button className="btn btn-transparent text-light" onClick={admindashboard}>Products</button></li>
            <li><button onClick={account} className="btn btn-transparent text-light">Pending Verifications</button></li>
            <li><button onClick={seller} className="btn btn-transparent text-light">Seller</button></li>
            <li><button className="btn btn-transparent text-light" onClick={reportDashboard}>Report Dashboard</button></li>
            <li><button className="btn btn-transparent text-light" onClick={handleLogout}><CiLogout style={{fontSize: '22px'}}></CiLogout>Log Out</button></li>
          </ul>
        </div>
        <div className="col-lg-9 p-5 text-light">
          <div className="card">
          <div className="card-header">
              <div className="card-title">Users</div>
            </div>
            <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Birthday</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Address</th>
                <th scope="col">Gender</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.key}>
                  <td>{user.BIRTHDAY}</td>
                  <td>{user.FNAME}</td>
                  <td>{user.LNAME}</td>
                  <td>{user.Haddress}</td>
                  <td>{user.GENDER}</td>
                  <td>{user.MAIL}</td>
                  <td>{user.PASSWORD}</td>
                  <td><button className="btn btn-danger" onClick={()=>ConfirmDelete(user)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </div>
            <div id="deleteModal" className="modal fade" data-bs-backdrop="static" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-dark">
                            Are you sure you want to delete <b>{selectedUser?.FNAME}'s</b> Account? Doing so will also delete this accounts Products
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button className="btn btn-danger" onClick={deleteUser}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="success" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-dark" id="errorText">
                          User Deleted
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="error" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body text-dark lead">
                          Something went wrong deleting user account!
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