import React from 'react';
import './Header.css';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            link: "home",
            linkClicked: false
        };
    }

    toggle = (event) => {
        console.log("Link id: " + event.target.id + " clicked!");
        this.setState( (state) => {
            return {
                linkClicked: !state.linkClicked
            };
        } );
    }

    render () {
        return (
            <div>
                <ul>
                    <li className={this.state.linkClicked ? "clicked" : ""}>
                        <a href="#" id="link1" onClick={this.toggle}>
                            {this.state.link}
                        </a>
                        <p>{this.state.linkClicked ? "clicked" : "not clicked"}</p>
                    </li>
                </ul>
            </div>
        );
    }
}