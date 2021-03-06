import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Glues react and redux together
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "antd/dist/antd.css";

import App from "./containers/App/App"; // index.js inside App folder in containers folder exports the default method in App.js. Now import App from "./containers/App" statement first looks for index.js inside the App folder and it will see that App.js is exported through index.js of that folder
import rootReducer from "./_reducers";

import * as serviceWorker from "./serviceWorker";
import { loadState, saveState } from "./_helpers/localStorage";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

const persistedState = loadState(); // To persist state on page refresh/rerender - https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
const middleware = [thunk, logger];

const store = createStore(rootReducer, persistedState, composeWithDevTools(applyMiddleware(...middleware)));

store.subscribe(() => {
  // To persist state on page refresh/rerender
  saveState(store.getState());
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      {/* Order of provider and browserrouter doesnt matter.
    Use Browser Router to route to different pages. */}
      <BrowserRouter>
        {/* NOTE Routes can also be switched between each other by using Switch, but in our case it is not working. So we use <div> */}
        <React.Fragment>
          <Route path="/" component={App} />
          {/* Here | is the OR operator which means that App component is for / and /signin route. Example /(home|main) means the same component for /home and /main */}
        </React.Fragment>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
