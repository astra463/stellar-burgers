import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import userReducer, {
  registerUser,
  loginUser,
  getUser,
  getUserOrders,
  updateUser,
  logout,
  setUser,
  TUserState,
} from './userSlice';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  getOrdersApi,
  updateUserApi,
  logoutApi,
} from '@api';
import { TUser, TOrder } from '@utils-types';

jest.mock('@api');
jest.mock('../utils/cookie');

const localStorageMock = (function () {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

const mockUserData: TUser = {
  email: 'test@example.com',
  name: 'Test User',
};

const mockOrderData: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
    number: 12345,
    ingredients: ['1', '2', '3'],
  },
];

describe('userSlice', () => {
  let store: EnhancedStore<{ user: TUserState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  it('должен вернуть начальное состояние', () => {
    const initialState: TUserState = {
      data: {
        email: '',
        name: '',
      },
      registerUserRequest: false,
      registerUserError: null,
      loginUserRequest: false,
      loginUserError: null,
      isAuthenticated: false,
      userOrders: [],
      userOrdersError: null,
      userOrdersLoading: false,
      updateUserRequest: false,
      updateUserErrors: null,
      logoutRequest: false,
      logoutError: null,
    };
    expect(store.getState().user).toEqual(initialState);
  });

  it('должен обрабатывать registerUser.pending', () => {
    store.dispatch({ type: registerUser.pending.type });
    const state = store.getState().user;
    expect(state.registerUserRequest).toBe(true);
  });

  it('должен обрабатывать registerUser.fulfilled', async () => {
    (registerUserApi as jest.Mock).mockResolvedValueOnce({
      user: mockUserData,
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
    });

    await store.dispatch(
      registerUser({ name: 'Test User', email: 'test@example.com', password: 'password' }) as any
    );

    const state = store.getState().user;
    expect(state.registerUserRequest).toBe(false);
    expect(state.data).toEqual(mockUserData);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен обрабатывать registerUser.rejected', async () => {
    (registerUserApi as jest.Mock).mockRejectedValueOnce(new Error('Registration error'));

    await store.dispatch(
      registerUser({ name: 'Test User', email: 'test@example.com', password: 'password' }) as any
    );

    const state = store.getState().user;
    expect(state.registerUserRequest).toBe(false);
  });

  it('должен обрабатывать loginUser.pending', () => {
    store.dispatch({ type: loginUser.pending.type });
    const state = store.getState().user;
    expect(state.loginUserRequest).toBe(true);
  });

  it('должен обрабатывать loginUser.fulfilled', async () => {
    (loginUserApi as jest.Mock).mockResolvedValueOnce({
      user: mockUserData,
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
    });

    await store.dispatch(
      loginUser({ email: 'test@example.com', password: 'password' }) as any
    );

    const state = store.getState().user;
    expect(state.loginUserRequest).toBe(false);
    expect(state.data).toEqual(mockUserData);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен обрабатывать loginUser.rejected', async () => {
    (loginUserApi as jest.Mock).mockRejectedValueOnce(new Error('Login error'));

    await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }) as any);

    const state = store.getState().user;
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toBe('Login error');
  });

  it('должен обрабатывать getUser.pending', () => {
    store.dispatch({ type: getUser.pending.type });
    const state = store.getState().user;
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен обрабатывать getUser.fulfilled', async () => {
    (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUserData });

    await store.dispatch(getUser() as any);

    const state = store.getState().user;
    expect(state.data).toEqual(mockUserData);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен обрабатывать getUser.rejected', async () => {
    (getUserApi as jest.Mock).mockRejectedValueOnce(new Error('Get user error'));

    await store.dispatch(getUser() as any);

    const state = store.getState().user;
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен обрабатывать getUserOrders.pending', () => {
    store.dispatch({ type: getUserOrders.pending.type });
    const state = store.getState().user;
    expect(state.userOrdersLoading).toBe(true);
  });

  it('должен обрабатывать getUserOrders.fulfilled', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockOrderData);

    await store.dispatch(getUserOrders() as any);

    const state = store.getState().user;
    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrders).toEqual(mockOrderData);
  });

  it('должен обрабатывать getUserOrders.rejected', async () => {
    (getOrdersApi as jest.Mock).mockRejectedValueOnce(new Error('Get orders error'));

    await store.dispatch(getUserOrders() as any);

    const state = store.getState().user;
    expect(state.userOrdersLoading).toBe(false);
    expect(state.userOrdersError).toBe('Get orders error');
  });

  it('должен обрабатывать updateUser.pending', () => {
    store.dispatch({ type: updateUser.pending.type });
    const state = store.getState().user;
    expect(state.updateUserRequest).toBe(true);
  });

  it('должен обрабатывать updateUser.fulfilled', async () => {
    (updateUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUserData });

    await store.dispatch(updateUser(mockUserData) as any);

    const state = store.getState().user;
    expect(state.updateUserRequest).toBe(false);
    expect(state.data).toEqual(mockUserData);
  });

  it('должен обрабатывать updateUser.rejected', async () => {
    (updateUserApi as jest.Mock).mockRejectedValueOnce(new Error('Update user error'));

    await store.dispatch(updateUser(mockUserData) as any);

    const state = store.getState().user;
    expect(state.updateUserRequest).toBe(false);
    expect(state.updateUserErrors).toBe('Update user error');
  });

  it('должен обрабатывать logout.pending', () => {
    store.dispatch({ type: logout.pending.type });
    const state = store.getState().user;
    expect(state.logoutRequest).toBe(true);
  });

  it('должен обрабатывать logout.fulfilled', async () => {
    (logoutApi as jest.Mock).mockResolvedValueOnce({});

    await store.dispatch(logout() as any);

    const state = store.getState().user;
    expect(state.logoutRequest).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.data).toBeNull();
  });

  it('должен обрабатывать logout.rejected', async () => {
    (logoutApi as jest.Mock).mockRejectedValueOnce(new Error('Logout error'));

    await store.dispatch(logout() as any);

    const state = store.getState().user;
    expect(state.logoutRequest).toBe(false);
    expect(state.logoutError).toBe('Logout error');
  });

  it('должен обрабатывать setUser', () => {
    store.dispatch(setUser(mockUserData));
    const state = store.getState().user;
    expect(state.data).toEqual(mockUserData);
    expect(state.isAuthenticated).toBe(true);
  });
});
