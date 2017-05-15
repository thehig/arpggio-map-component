import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';

import reducer from './reducer';
// Build the middleware for intercepting and dispatching navigation actions
const middlewares = [createLogger({ collapsed: true })];

const masterReducer = combineReducers({
  data: reducer
});

// Link in with the Redux dev tools if available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //eslint-disable-line

const createStoreWithMiddleware = composeEnhancers(applyMiddleware(...middlewares))(createStore);

export const store = createStoreWithMiddleware(masterReducer);
//# sourceMappingURL=store.js.map