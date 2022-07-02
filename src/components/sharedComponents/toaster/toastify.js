import {toast, ToastContainer} from "react-toastify";


const CustomToaster = ({}) => {
    return (
        <ToastContainer position="top-right"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
        />
    );
};

export const successToast = (message = "") => {
    const successMessage = "🎉  " + message;
    toast.success(successMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const errorToast = (message = "An unexpected error occurred !") => {
    toast.error(message, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export default CustomToaster;
