import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";

export const appStore = configureStore({
  reducer: {
    auth: rootReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

const initializeApp = async () => {
  try {
    await appStore.dispatch(
      authApi.endpoints.loadUser.initiate(
        {},
        {
          forceRefetch: true,
        }
      )
    );
    console.log("User data loaded successfully.");
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

initializeApp();
