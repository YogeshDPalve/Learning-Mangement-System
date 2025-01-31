import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";

export const appStore = configureStore({
  reducer: {
    ...rootReducer, // Spread the rootReducer instead of hardcoding `auth`
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer, // 🔥 FIX: Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware
    ),
});

// Initialize the app by loading user data
const initializeApp = async () => {
  try {
    const result = await appStore.dispatch(
      authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
    if (result.error) {
      throw result.error; // Handle API errors properly
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

initializeApp();
