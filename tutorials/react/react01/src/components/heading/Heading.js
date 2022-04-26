import React from 'react';
import './Heading.css';

class Heading extends React.Component {
    constructor() {
        super();
        this.state = { link1: "Link1" };
    }
    
    render() {
        return (
            <div>
                <nav>
                    <h2 style={{color: "lightblue", backgroundColor: "gray"}}>{ this.props.headerTitle }</h2>
                    <ul className="navigation">
                        <li>Home</li>
                        <li>Blog</li>
                        <li>Articles</li>
                        <li>{ this.state.link1 }</li>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default Heading;