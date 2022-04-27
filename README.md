# GraphiQL Webcomponent
A webcomponent wrapper around [GraphiQL](https://github.com/graphql/graphiql) and [GraphiQL-Explorer](https://github.com/OneGraph/graphiql-explorer/).

## Usage
### Angular2
Add `import @ninjaneers/graphiql-webcomponent;` to your app.module.ts to register the webcomponent in the browser.

Add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the modules where the webcomponent will be used.

Now you can use the webcomponent in your angular templates like this:
```angular2html
    <div *ngIf="config$ | async as config">
        <graphiql-webcomponent
                [config]="config"
        ></graphiql-webcomponent>
    </div>
```

### React
Add `import @ninjaneers/graphiql-webcomponent;` to your index.(js/ts) to register the webcomponent in the browser.

Now you can use the webcomponent in your (j/t)sx like this:
```jsx
        <graphiql-webcomponent
                config={config}
        ></graphiql-webcomponent>
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
