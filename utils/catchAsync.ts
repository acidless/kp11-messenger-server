import { Dispatch } from 'redux';
import {
  AppActions,
  CreateMessage,
} from '../../src/store/reducers/App/AppReducer';

type Thunk = (dispatch: Dispatch<any>, getState: any) => void;

export default function catchAsync(fn: Thunk, onEnd: Function = () => {}) {
  return async function (dispatch, getState) {
    try {
      await fn(dispatch, getState);
    } catch (e) {
      dispatch(CreateMessage(e.response.data.message || 'Произошла ошибка'));
    }

    dispatch(AppActions.setLoading(false));
    onEnd(dispatch, getState);
  };
}
