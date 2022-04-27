import './index.css'
import register from 'preact-custom-element';
import App from "./app";

register(App, 'graphiql-webcomponent', ['config'], {shadow: true});
