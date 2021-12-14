import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import RequestResponseType from "src/utils/ResponseType";
import { apiUrl } from "./constants";
import { RootState, AppThunk, AppDispatch } from "./store";

interface IUser {
  _id: string;
  username: string;
}

export interface INewBooking {
  type: string;
  location: string;
  proposedDate1: string;
  proposedDate2: string;
  proposedDate3: string;
  status: string;
}

export interface IExistingBooking {
  _id: string;
  type: string;
  location: string;
  date: string;
  status: string;
  proposedDate1: string;
  proposedDate2: string;
  proposedDate3: string;
  selectedProposedDate: string;
  rejectedReason: string;
  user: IUser;
}

interface IBookingState {
  booking: IExistingBooking | null;
  bookings: IExistingBooking[] | any; //TODO: Check why need any
  bookingsLoading: boolean;
}

const initialState: IBookingState = {
  booking: null,
  bookings: [],
  bookingsLoading: true,
};

export const getBookings = createAsyncThunk<
  RequestResponseType<IExistingBooking[]> | null,
  void
>("bookings/get", async () => {
  try {
    const response = await axios.get<RequestResponseType<IExistingBooking[]>>(
      `${apiUrl}/bookings`
    );
    console.log(response);
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const createBooking = createAsyncThunk<
  RequestResponseType<IExistingBooking> | null,
  INewBooking,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: AxiosError;
  }
>("bookings/create", async (newBooking: INewBooking) => {
  try {
    const response = await axios.post(`${apiUrl}/bookings`, newBooking);
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const deleteBooking = createAsyncThunk<
  RequestResponseType<IExistingBooking> | null,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: AxiosError;
  }
>("bookings/delete", async (bookingId: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/bookings/${bookingId}`);
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const updateBooking = createAsyncThunk<
  RequestResponseType<IExistingBooking> | null,
  IExistingBooking
>("bookings/update", async (updatedBooking: IExistingBooking) => {
  try {
    const response = await axios.put<RequestResponseType<IExistingBooking>>(
      `${apiUrl}/bookings/${updatedBooking._id}`,
      updatedBooking
    );
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const findBooking =
  (bookingId: string): AppThunk =>
  (dispatch, getState) => {
    const bookings = selectBookings(getState());
    const booking = bookings?.find(
      (booking: IExistingBooking) => booking._id === bookingId
    );
    if (booking) {
      dispatch(chooseBooking(booking));
    }
  };

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    chooseBooking: (state, action: PayloadAction<IExistingBooking>) => {
      state.booking = action.payload;
    },
    removeSelectedBooking: (state) => {
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookings.pending, (state) => {
        return {
          ...state,
          bookingsLoading: true,
        };
      })
      .addCase(getBookings.fulfilled, (state, { payload }) => {
        if (payload !== null) {
          return {
            ...state,
            bookings: payload.data,
            bookingsLoading: false,
          };
        }
      })
      .addCase(getBookings.rejected, (state) => {
        return {
          ...state,
          bookingsLoading: false,
          bookings: [],
        };
      })
      .addCase(createBooking.fulfilled, (state, { payload }) => {
        if (payload !== null && payload.data !== null && state) {
          return {
            ...state,
            bookingsLoading: false,
            bookings: [...state.bookings, payload.data],
          };
        }
      })
      .addCase(deleteBooking.fulfilled, (state, { payload }) => {
        if (payload !== null && payload.data !== null) {
          return {
            ...state,
            bookings: state.bookings?.filter(
              (booking: IExistingBooking) => booking._id !== payload.data?._id
            ),
          };
        }
      })
      .addCase(updateBooking.fulfilled, (state, { payload }) => {
        if (payload !== null && payload.data !== null) {
          return {
            ...state,
            bookings: state.bookings?.map((booking: IExistingBooking) =>
              booking._id === payload.data?._id ? payload.data : booking
            ),
          };
        }
      });
  },
});

export const { chooseBooking, removeSelectedBooking } = bookingSlice.actions;

export const selectBooking = (state: RootState) => state.booking.booking;
export const selectBookings = (state: RootState) => state.booking.bookings;
export const selectBookingsLoading = (state: RootState) =>
  state.booking.bookingsLoading;

export default bookingSlice.reducer;
