import React from 'react';
import {Link} from 'react-router-dom';

export default class NotFound extends React.Component {
    render() {
        return (
            <div>
                <p>404 - Page Not Found</p>
                <Link to="/">Home</Link>
            </div>
        );
    }
}