import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import style from 'graphiql/graphiql.min.css';
import {Fragment} from "react";

const App = (props) => {
    console.dir(props);
    if(!props.api) {
        return (<Fragment></Fragment>);
    }
    const fetcher = createGraphiQLFetcher({
        url: props.api,
        headers: props.headers || {}
    });

    return (
        <div id="graphiql-webcomponent" style="height: 100%">
            <style>{style}</style>
            <GraphiQL
                fetcher={fetcher}
                editorTheme={props.editorTheme || 'dracula'}
                defaultQuery={props.defaultQuery || ''}
            />
        </div>
    )
}

export default App;
