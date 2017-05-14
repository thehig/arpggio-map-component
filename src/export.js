import * as actions from './redux/common/actions';
import * as constants from './redux/common/constants';
import initialState from './redux/common/initialState';
import reducer from './redux/common/reducer';

const mapComponentExports = {
  actions,
  constants,
  initialState,
  reducer,
};

console.log("Map Component Exports", mapComponentExports);

export default mapComponentExports;
