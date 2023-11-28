# GraphiQL Webcomponent
A Webcomponent wrapper around [GraphiQL](https://github.com/graphql/graphiql) and [GraphiQL-Explorer](https://github.com/OneGraph/graphiql-explorer/).

## Usage
### Angular2
Add `import @ninjaneers/graphiql-webcomponent;` to your app.module.ts to register the Webcomponent in the browser.

Add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the modules where the Webcomponent will be used.

Now you can use the Webcomponent in your Angular templates like this:
```angular2html
    <div *ngIf="config$ | async as config">
        <graphiql-webcomponent #graphiql
          [config]="config"
           [query]="''"
           [variables]="{}"
        ></graphiql-webcomponent>
    </div>
```

```typescript
  export class ParentComponent implements AfterViewInit {
    
  public config$ = new BehaviorSubject({
    api: {
      url: 'http://localhost:8080/graphql',
    },
  })
  @ViewChild('graphiql')
  public graphiql: ElementRef;

  public ngAfterViewInit(): void {
    this.graphiql.nativeElement.addEventListener('QueryChange', (event) => console.dir(event));
    this.graphiql.nativeElement.addEventListener('VariablesChange', (event) => console.dir(event));  
  }
}


```

### React
Add `import @ninjaneers/graphiql-webcomponent;` to your index.(js/ts) to register the webcomponent in the browser.

Now you can use the Webcomponent in your (j/t)sx like this:

```jsx
const Parent = () => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('QueryChange', (event) => console.dir(event));
    ref.current.addEventListener('VariablesChange', (event) => console.dir(event));
  }, [ref]);
  return <graphiql-webcomponent ref={ref}
    config={config}
    query={""}
    variables={{}}
  ></graphiql-webcomponent>
}
```

## Config
```typescript
    type GraphiqlWebcomponentConfig = {
      api: {
        url: string;
        headers?: Record<string, string>;
        subscriptionUrl?: string;
        wsConnectionParams?: Record<string, string | Record<string, string>>;
      };
      defaultQuery?: string;
      disableExplorer?: boolean;
      editorTheme?: string;
      excludeMutations?: boolean;
      excludeSubscriptions?: boolean;
    };
```
- api; __required__; contains the configuration for your connection to your GraphQL server.
    - url; __required__; URL of the HTTP(S) endpoint of your GraphQL server. e.g. `http://localhost:3000/v1/graphql`.
    - headers; headers that might be required to make a connection to your server. e.g. `{"Authorization": "Bearer ..."}`.
    - subscriptionUrl; __required by default__ (see excludeSubscriptions); URL of the WS(S) endpoint of your GraphQL server. e.g. `ws://localhost:3000/v1/graphql`.
    - wsConnectionParams; websocket connection params. e.g. `{headers: {Authorization": "Bearer ...}}`.
- defaultQuery; the default query/message that will be shown in GraphiQL.
- disableExplorer; whether you want to use the [GraphiQL-Explorer](https://github.com/OneGraph/graphiql-explorer/) ot not. Defaults to `false`.
- editorTheme; the Theme for [GraphiQL](https://github.com/graphql/graphiql). Defaults to `"dracula"`.
- excludeMutations; will exclude mutations from [GraphiQL](https://github.com/graphql/graphiql). Defaults to `false`.
- excludeSubscriptions; will exclude mutations from [GraphiQL](https://github.com/graphql/graphiql). If false api.subscriptionUrl is __required__. Defaults to `false`.
