import React from 'react'
import styles from './styles.module.css'
import './sassStyles.scss'

class Copyright extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className={styles.info + " copyrightBox"}>
                <span>Copyright &copy; { this.props.year } example.com
                All rights reserved. </span>
            </div>
        );
    }
}

export default Copyright