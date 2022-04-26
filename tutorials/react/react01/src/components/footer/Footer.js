import React from 'react';
import './Footer.css';
import Copyright from '../copyright/Copyright'


const elements1 = ["Terms of Use", "FAQ", "About us"];
const items = [];
const elements2 = ["contact", "legal"];

for (const [index, value] of elements1.entries()) {
    items.push(<li>{value}</li>);
}

let isLogged = false;
let button;
if (isLogged) {
    button = <button>Logout</button>;
} else {
    button = <button>Login</button>;
}

function Footer(props) {
    return (
        <div>
            <footer>
                <ul>
                    {items}
                    <li>
                        Contact: {props.email}, {props.companyData.city}, {props.companyData.street} {props.companyData.number}
                    </li>
                    {elements2.map( (value, index) => {
                        return <li>{value}</li>;
                    })}
                </ul>
                <Copyright year="2022" />
                {button}
                {/*conditional rendering (btw this is a comment, lel)*/}
                {isLogged === true && 
                    <div>Check your email</div>
                }
                {isLogged 
                    ? <div>Check your notifications</div>
                    : <div>Log in to see notifications</div>
                }
            </footer>
        </div>
    );
}

export default Footer;