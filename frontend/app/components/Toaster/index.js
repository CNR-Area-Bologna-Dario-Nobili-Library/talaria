import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './style.scss';
import { TOAST_AUTOCLOSE_DURATION } from 'utils/constants';

const Toaster = (props) => {
    return  (
        <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            draggable={false}
            rtl={false}
            autoClose={TOAST_AUTOCLOSE_DURATION}
        />
    )
}

export default Toaster;
