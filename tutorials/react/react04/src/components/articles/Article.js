import React from 'react';
import { useLocation } from 'react-router-dom';

function Article() {

    const query = new URLSearchParams(useLocation().search);
    const title = query.get("title");
    const time = query.get("time");

    return (
        <div>
            <p>Article: {title}</p>
            <div>time: {time}</div>
        </div>
    );
}

export default Article;