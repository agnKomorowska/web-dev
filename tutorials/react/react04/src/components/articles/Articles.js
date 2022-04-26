import React from 'react';
import {Link} from 'react-router-dom';

export default class Articles extends React.Component {
    render() {
        return (
            <div>
                <p>Articles component</p>
                <ul>
                    <li>
                        <Link to="/article?title=hello-world&time=1">Hello World article</Link>                        
                    </li>
                    <li>
                        <Link to="/article?title=second-article&time=10">Second article</Link>
                    </li>
                </ul>
            </div>
        );
    }
}