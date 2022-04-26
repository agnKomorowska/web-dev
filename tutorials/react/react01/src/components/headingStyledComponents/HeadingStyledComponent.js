import React from 'react';
import ListItem from './styled/ListItem';
import {BorderListItem} from './styled/ListItem';

class HeadingStyledComponent extends React.Component {

    render() {
        return (
            <div>
                <nav>
                    <ul>
                        <BorderListItem>Home</BorderListItem>
                        <ListItem>About me</ListItem>
                        <ListItem active>Articles</ListItem>
                        <ListItem>Contact</ListItem>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default HeadingStyledComponent;