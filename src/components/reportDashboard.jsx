import React, { useEffect, useState } from "react";
import { db } from "../dbcreds/firebaseConfig";
import "bootstrap/dist/css/bootstrap.css";
import { ref, onValue } from 'firebase/database';
import { Modal } from "bootstrap";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
export default function ReportDashboard() {
    const [reports, setReports] = useState([]);
    const [dataToGrab, setDataToGrab] = useState({});
    const [modal, setModal] = useState(null);
    const dbref = ref(db, 'Reported');
    const nav = useNavigate();
    useEffect(() => {
        const fetchReports = () => {
            onValue(dbref, (reportSnapshot) => {
                const reportData = reportSnapshot.val();
                if (reportData) {
                    const reportedSeller = Object.entries(reportData).map(([key, value]) => ({
                        key, ...value
                    }));
                    setReports(reportedSeller);
                } else {
                    setReports([])
                }
            });
        };

        fetchReports();

        return () => {
            onValue(dbref, () => { });
        }
    }, []);

    const reportDetails = (reportDetail) => {
        const reportModal = new Modal(document.getElementById('reportDetails'));
        reportModal.show();
        setModal(reportModal);
        
        setDataToGrab({
            reportMail: reportDetail.MAIL,
            reporterEmail: reportDetail.ReporterEmail,
            reportMessage: reportDetail.Message,
            reportProductName: reportDetail.ProductName,
            reportProductPrice: reportDetail.ProductPrice,
            reportImage: reportDetail.image1
        });

        console.log(String(reportDetail.image1));
    }
    const back = () =>{
        nav(-1);
    }
    return (
        <div className="container-fluid p-5">
            <GoArrowLeft style={{cursor: 'pointer'}} className="m-2 lead" onClick={back}></GoArrowLeft>
            <div className="container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Reported Seller</th>
                            <th scope="col">Reporter</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.key}>
                                <td>{report.MAIL}</td>
                                <td>{report.ReporterEmail}</td>
                                <td><button className="btn btn-primary" onClick={() => reportDetails(report)}>View Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div id="reportDetails" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title lead">
                                Report Details
                            </div>
                        </div>
                        <div className="modal-body text-dark">
                            {dataToGrab.reportMessage}
                            {dataToGrab.reportProductName}
                            {dataToGrab.reportProductPrice}
                            <a href={dataToGrab.reportImage} target="_blank" rel="noopener noreferrer">image</a>

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
