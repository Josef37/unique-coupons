import { configureStore } from "@reduxjs/toolkit";
import couponsReducer from "./coupons.slice"

const store = configureStore({
	reducer: {
		coupons: couponsReducer
	}
})

export default store
