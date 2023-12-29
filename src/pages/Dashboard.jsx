import React, { useState, useEffect } from "react";
import { ref, onValue, remove } from 'firebase/database';
import { db } from "../dbcreds/firebaseConfig";
import { Modal } from "bootstrap";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const dbref = ref(db, 'Account');
  const [SellerProducts, setSellerProducts] = useState([]);
  const [UserProduct, setUserProduct] = useState(null);
  const [Products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [modal, setModal] = useState(null);
  const [modalSucessful, setModalSuccessful] = useState(null);
  const nav = useNavigate();
  useEffect(() => {
    const sellerProducts = () => {
      onValue(dbref, (productSnapshot) => {
        const products = productSnapshot.val();
        if (products) {
          const productArray = Object.entries(products).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setSellerProducts(productArray);
        } else {
          setSellerProducts([]);
        }
      });
    };

    sellerProducts();
    return () => {
      onValue(dbref, () => { });
    };
  }, []);

  const viewProducts = (userProduct) => {
    setUserProduct(userProduct);
    console.log('asd');
    const modalImages = new Modal(document.getElementById('ModalImages'));
    modalImages.show();
    setModal(modalImages);
    const productRef = ref(db, `Account/${userProduct.id}/Product`);

    onValue(productRef, (productSnapshot) => {
      const productContent = productSnapshot.val();
      if (productContent) {
        // Convert the products object to an array
        const productArray = Object.entries(productContent).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setProducts(productArray);
      } else {
        setProducts([]);
      }
    });
  };

  const deleteProduct = (productId) => {
    // Fetch the details of the product to delete
    const selectedProduct = Products.find(product => product.id === productId);
    // Set the selected product for deletion
    setProductToDelete(selectedProduct);
    if (modal) {
      modal.hide();
    }
    const deleteConfirmationModal = new Modal(document.getElementById('DeleteConfirmation'));
    deleteConfirmationModal.show();
    setModalSuccessful(deleteConfirmationModal);
  };
  const confirmDelete = () => {
    console.log(productToDelete);
    console.log(UserProduct);
    if (productToDelete) {
      const productRef = ref(db, `Account/${UserProduct.id}/Product/${productToDelete.id}`);
      remove(productRef)
        .then(() => {
          console.log('Product deleted successfully');
          if (modalSucessful) {
            modalSucessful.hide();
            const successModal = new Modal(document.getElementById('successModal'));
            successModal.show();
            setTimeout(() => {
              successModal.hide();
            }, 1500);
          }
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
          const errorText = document.getElementById('errorText');
          errorText.textContent = `Error: ${error.message || 'Unknown error'}`;
          const errorModal = new Modal(document.getElementById('error'));
          errorModal.show();
        })
        .finally(() => {
          const removeModal = new Modal(document.getElementById('DeleteConfirmation'));
          removeModal.hide();
        });
    }
  };

  const back = () =>{
    nav(-1);
}
  return (
    <div className="container-fluid p-5" id="sellerImages">
      <GoArrowLeft style={{cursor: 'pointer'}} className="m-2 lead" onClick={back}></GoArrowLeft>
      <div className="lead h3">Seller</div>
      <div className="container p-5">
        <table className="table table-stripped">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {SellerProducts.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.FNAME}</td>
                <td>{prod.LNAME}</td>
                <td>{prod.MAIL}</td>
                <td><button className="btn btn-primary" onClick={() => viewProducts(prod)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="ModalImages" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body text-dark">
              {Products && Products.length > 0 ? (
                Products.map((product) => (
                  <div className="col">
                    <ul>
                      <li>Product Description: <b><i>{product.ProductDesc}</i></b></li>
                      <li>Product Name: <b><i>{product.ProductName}</i></b></li>
                      <li>Product Price: <b><i>{product.ProductPrice}</i></b></li>
                      <li>Product Quantity: <b><i>{product.ProductQuantity}</i></b></li>
                      <li className="lead text-danger">Report Flag Count:   </li>
                    </ul>
                    <div className="mainImage">
                      <center>
                        <img src={product.Imagae_1_link} width='50%' alt="" />
                        <div className="images"><a href={product.Imagae_1_link} target="_blank" rel="noopener noreferrer">Full Screen</a></div>
                      </center>
                    </div>
                    <div id="supportImages">
                      <div className="images"><a href={product.image1} target="_blank" rel="noopener noreferrer">Supporting Image 1</a></div>
                      <div className="images"><a href={product.image2} target="_blank" rel="noopener noreferrer">Supporting Image 2</a></div>
                      <div className="images"><a href={product.image3} target="_blank" rel="noopener noreferrer">Supporting Image 3</a></div>
                    </div>
                    <div id="supportImages">
                      <div className="images"><a href={product.image4} target="_blank" rel="noopener noreferrer">Supporting Image 4</a></div>
                      <div className="images"><a href={product.image5} target="_blank" rel="noopener noreferrer">Supporting Image 5</a></div>
                      <div className="images"><a href={product.image6} target="_blank" rel="noopener noreferrer">Supporting Image 6</a></div>
                    </div>
                    <button className="btn btn-danger mt-3" onClick={() => deleteProduct(product.id)}>Disable</button>
                    <hr />
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="DeleteConfirmation" data-bs-backdrop="static" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <b className="text-danger text-uppercase">Are you sure you want to delete this Product?</b>
            </div>
            <div className="modal-body text-dark">
              {productToDelete && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <ul>
                    <li>Product Description: <b><i>{productToDelete.ProductDesc}</i></b></li>
                    <li>Product Name: <b><i>{productToDelete.ProductName}</i></b></li>
                    <li>Product Price: <b><i>{productToDelete.ProductPrice}</i></b></li>
                    <li>Product Quantity: <b><i>{productToDelete.ProductQuantity}</i></b></li>
                  </ul>
                  <div className="mainImage">
                    <center>
                      <img src={productToDelete.Imagae_1_link} width='50%' alt="" />
                      <div className="images"><a href={productToDelete.Imagae_1_link} target="_blank" rel="noopener noreferrer">Full Screen</a></div>
                    </center>
                  </div>
                  <div id="supportImages" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <div className="images"><a href={productToDelete.image1} target="_blank" rel="noopener noreferrer">Supporting Image 1</a></div>
                    <div className="images"><a href={productToDelete.image2} target="_blank" rel="noopener noreferrer">Supporting Image 2</a></div>
                    <div className="images"><a href={productToDelete.image3} target="_blank" rel="noopener noreferrer">Supporting Image 3</a></div>
                  </div>
                  <div id="supportImages" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <div className="images"><a href={productToDelete.image4} target="_blank" rel="noopener noreferrer">Supporting Image 4</a></div>
                    <div className="images"><a href={productToDelete.image5} target="_blank" rel="noopener noreferrer">Supporting Image 5</a></div>
                    <div className="images"><a href={productToDelete.image6} target="_blank" rel="noopener noreferrer">Supporting Image 6</a></div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div id="successModal" data-bs-backdrop="static" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-dark">
              <b className="text-success">Product Deleted</b>
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
            <div className="modal-body text-dark">
              <b className="text-success" id="errorText">Product Deleted</b>
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
