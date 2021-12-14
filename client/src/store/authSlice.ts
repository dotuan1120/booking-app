import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken } from "src/utils/setAuthToken";
import { apiUrl, LOCAL_STORAGE_TOKEN } from "./constants";
import { RootState, AppThunk } from "./store";
import RequestResponseType from "src/utils/ResponseType";

interface IAuthState {
  authLoading: boolean;
  isLoggedIn: boolean;
  token: string;
  user: any;
}

const initialState: IAuthState = {
  authLoading: false,
  isLoggedIn: false,
  token: "",
  user: null,
};

interface IExistingUser {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  _v: number;
}

interface ILoginForm {
  username: string;
  password: string;
}

interface IRegistrationForm {
  username: string;
  password: string;
  confirmedPassword: string;
  role: string;
}

export const loadUser = createAsyncThunk<
  RequestResponseType<IExistingUser> | null,
  void
>("auth/loadUser", async () => {
  if (localStorage[LOCAL_STORAGE_TOKEN]) {
    setAuthToken(localStorage[LOCAL_STORAGE_TOKEN]);
  }
  try {
    const response = await axios.get(`${apiUrl}/auth`);
    return response.data;
  } catch (error: any) {
    // remove token for future request
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    setAuthToken(null);
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

// return token when login successfully
export const login = createAsyncThunk<
  RequestResponseType<string> | null,
  ILoginForm
>("auth/login", async (loginForm: ILoginForm) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, loginForm);
    if (response.data.success)
      localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.data);
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const register = createAsyncThunk<
  RequestResponseType<string> | null,
  IRegistrationForm
>("auth/register", async (registrationForm: IRegistrationForm) => {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/register`,
      registrationForm
    );
    if (response.data.success)
      localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.data);
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const logout = (): AppThunk => (dispatch) => {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN);
  dispatch(
    setAuth({ authLoading: false, isLoggedIn: false, token: "", user: null })
  );
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<IAuthState>) => {
      state.authLoading = action.payload.authLoading;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        return {
          ...state,
          authLoading: true,
        };
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        if (payload) {
          return {
            ...state,
            authLoading: false,
            isLoggedIn: true,
            token: localStorage[LOCAL_STORAGE_TOKEN],
            user: payload.data,
          };
        }
        return state;
      })
      .addCase(loadUser.rejected, (state) => {
        return {
          ...state,
          authLoading: false,
          isLoggedIn: false,
          token: "",
          user: null,
        };
      });
  },
});

export const { setAuth } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectUsername = (state: RootState) => state.auth.user.username;
export const selectRole = (state: RootState) => state.auth.user.role;
export const selectAuthLoading = (state: RootState) => state.auth.authLoading;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;
