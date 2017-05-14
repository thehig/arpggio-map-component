import * as actions from './redux/common/actions';
import * as constants from './redux/common/constants';
import initialState from './redux/common/initialState';
import reducer from './redux/common/reducer';

import PanZoomDemo from './components/PanZoomDemo';
import ReduxPanZoomDemo from './components/ReduxPanZoomDemo';

const mapComponentExports = {
  redux: {
    actions,
    constants,
    initialState,
    reducer,
  },
  components: {
    PanZoomDemo,
    ReduxPanZoomDemo,
  },
};

export default mapComponentExports;
