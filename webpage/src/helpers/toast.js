import { toast } from 'react-toastify';

let options = {
    position: toast.POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    autoClose: 3000
};

export default {
    error: (content) => toast.error(content, options),
    success: (content) => toast.success(content, options)
};