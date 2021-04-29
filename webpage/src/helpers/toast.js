import { toast as _toast } from 'react-toastify';

let options = {
    position: _toast.POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    autoClose: 3000
};


export let toast = {
    error: (content) => _toast.error(content, options),
    success: (content) => _toast.success(content, options)
};

export default toast;