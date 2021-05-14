import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function HeaderItem(props) {
    let location = useLocation();

    return (
        (location.pathname === props.path)
            ? <Link to={props.path} className="item selected">{props.children}</Link>
            : <Link to={props.path} className="item">{props.children}</Link>
    );
}

export default HeaderItem;