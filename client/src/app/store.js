import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";

export const appStore = configureStore({
  reducer: {
    auth: rootReducer,
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer, // Add courseApi reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware),
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
