import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/progressApi";

export const appStore = configureStore({
  reducer: {
    auth: rootReducer,
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer, // Add courseApi reducer here
    [purchaseApi.reducerPath]: purchaseApi.reducer, // Add purchased cources reducer here
    [courseProgressApi.reducerPath]: courseProgressApi.reducer, // Add course progress reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware
    ),
});

const initializeApp = async () => {
  try {
    const result = await appStore.dispatch(
      authApi.endpoints.loadUser.initiate(
        {}, // Ensure that loadUser accepts an empty object as its argument
        {
          forceRefetch: true,
        }
      )
    );
    if (result.error) {
      throw result.error; // Handle API errors properly
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

initializeApp();
