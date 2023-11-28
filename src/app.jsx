import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import style from 'graphiql/graphiql.min.css';
import { buildClientSchema, getIntrospectionQuery, isEnumType, isWrappingType, parse } from "graphql";
import GraphiQLExplorer from "graphiql-explorer";
import { useEffect, useRef, useState } from "preact/compat";

function unwrapOutputType(outputType) {
    let unwrappedType = outputType;
    while (isWrappingType(unwrappedType)) {
        unwrappedType = unwrappedType.ofType;
    }
    return unwrappedType;
}

export function makeDefaultArg(
    parentField,
    arg
) {
    return (arg.name === "first" || arg.name === "orderBy");

}

export function getDefaultScalarArgValue(
    parentField,
    arg,
    argType
) {
    const unwrappedType = unwrapOutputType(parentField.type);
    if (
        isEnumType(argType) &&
        unwrappedType.name.startsWith("GitHub") &&
        unwrappedType.name.endsWith("Connection")
    ) {
        if (
            arg.name === "direction" &&
            argType
                .getValues()
                .map(x => x.name)
                .includes("DESC")
        ) {
            return { kind: "EnumValue", value: "DESC" };
        } else if (
            arg.name === "field" &&
            argType
                .getValues()
                .map(x => x.name)
                .includes("CREATED_AT")
        ) {
            return { kind: "EnumValue", value: "CREATED_AT" };
        }
    }
    return GraphiQLExplorer.defaultValue(argType);
}

function fetchSchema(api, headers, excludeMutations, excludeSubscriptions){
    return fetch(
        api,
        {
            method: "POST",
            headers: {
                ...headers,
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"operationName":"IntrospectionQuery", "query": getIntrospectionQuery()})
        }
    )
        .then(function(response) {
            return response.json();
        })
        .then(result => {
            if (result.errors && result.errors.length > 0) {
                return undefined;
            }

            const clientSchema = buildClientSchema(result.data);

            if (excludeMutations) {
                delete clientSchema._mutationType;
            }

            if (excludeSubscriptions) {
                delete clientSchema._subscriptionType;
            }

            return clientSchema;
        });
}

const App = (props) => {
    if(!props.config || !props.config.api || !props.config.api.url) {
        return (<div>
                    <h2>GraphiQL-Webcomponent</h2>
                    <h4>Missing Config:</h4>
                        <code style="white-space: pre-wrap">
{`
    {
        api: {
            url: string;
            subscriptionUrl?: string;
            headers?: Record<string, string>
            wsConnectionParams?: Record<string, string | Record<string, string>>
        };
        defaultQuery?: string;
        disableExplorer?: boolean;
        editorTheme?: string;
        excludeSubscriptions?: boolean;
        excludeMutations?: boolean;
    }
`}
                        </code>
                </div>);
    }

    const [schema, setSchema] = useState();
    const [query, setQuery] = useState(props.config?.defaultQuery ?? '');
    const prevQuery = useRef(props.config?.defaultQuery ?? '');
    const [variables, setVariables] = useState(props.config?.defaultVariables ?? '');
    const prevVariables = useRef(props.config?.defaultVariables ?? '');
    const [explorerIsOpen, setExplorerIsOpen] = useState(!props.config?.disableExplorer ?? false);
    const graphiql = useRef(null);

    useEffect(() => {
        if (query !== prevQuery.current) {
            graphiql.current.dispatchEvent(new CustomEvent('QueryChange', {bubbles: true, composed: true, detail: {current: query, previous: prevQuery.current}}));
            prevQuery.current = query;
        }
    }, [query]);

    useEffect(() => {
        if (variables !== prevVariables.current) {
            graphiql.current.dispatchEvent(new CustomEvent('VariablesChange', {bubbles: true, composed: true, detail: {current: variables, previous: prevVariables.current}}));
            prevVariables.current = variables;
        }
    }, [variables]);

    useEffect(() => {
        if (props.query) {
            setQuery(props.query)
        }
    }, [props.query]);

    useEffect(() => {
        if (props.variables) {
            setVariables(props.variables)
        }
    }, [props.variables]);

    const fetcher = createGraphiQLFetcher({
        url: props.config.api.url,
        subscriptionUrl: props.config.api.subscriptionUrl,
        headers: props.config.api.headers || {},
        wsConnectionParams: props.config.api.wsConnectionParams || {}
    });
    let _graphiql;

    useEffect(() => {
        fetchSchema(props.config.api.url, props.config.api.headers || {}, props.config.excludeMutations ?? false, props.config.excludeSubscriptions ?? false)
            .then((schema) => {
                setSchema(schema);
            })
    }, [
        props.config.api.url,
        props.config.api.headers,
        props.config.api.subscriptionUrl,
        props.config.api.wsConnectionParams,
        props.config.excludeMutations,
        props.config.excludeSubscriptions
    ]);

    return (
        <div id="graphiql-webcomponent" style="height: 100%" ref={graphiql}>
            <style>{style}</style>
            <div className="graphiql-container" style="height: 100%">
                <GraphiQLExplorer
                    schema={schema}
                    query={query}
                    onEdit={setQuery}
                    onRunOperation={(operationName) => {
                            _graphiql.handleRunQuery(operationName);
                        }
                    }
                    explorerIsOpen={explorerIsOpen}
                    onToggleExplorer={() => setExplorerIsOpen(!explorerIsOpen)}
                    getDefaultScalarArgValue={getDefaultScalarArgValue}
                    makeDefaultArg={makeDefaultArg}
                />
                <GraphiQL
                    ref={(ref) => {_graphiql = ref}}
                    fetcher={fetcher}
                    schema={schema}
                    variables={variables}
                    onEditVariables={setVariables}
                    editorTheme={props.config.editorTheme || 'dracula'}
                    query={query}
                    onEditQuery={setQuery}
                    headerEditorEnabled={false}
                >
                    <GraphiQL.Toolbar>
                        <GraphiQL.Button
                            onClick={() => _graphiql.handlePrettifyQuery()}
                            label="Prettify"
                            title="Prettify Query (Shift-Ctrl-P)"
                        />
                        <GraphiQL.Button
                            onClick={() => _graphiql.handleToggleHistory()}
                            label="History"
                            title="Show History"
                        />
                        {
                            !props.config.disableExplorer &&
                            <GraphiQL.Button
                                onClick={() => setExplorerIsOpen(!explorerIsOpen)}
                                label="Explorer"
                                title="Toggle Explorer"
                            />
                        }

                    </GraphiQL.Toolbar>
                </GraphiQL>
            </div>
        </div>
    )
}

export default App;
