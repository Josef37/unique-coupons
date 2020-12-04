import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { initialCouponGroups, initialCoupons } from "../data";

const couponGroupsAdapter = createEntityAdapter()
const couponsAdapter = createEntityAdapter()

const initialState = {
	couponGroups: couponGroupsAdapter.getInitialState(),
	coupons: couponsAdapter.getInitialState()
}

if (process.env.NODE_ENV === 'development') {
	initialState.couponGroups = initialCouponGroups
	initialState.coupons = initialCoupons
}

const couponsSlice = createSlice({
	name: 'coupons',
	initialState,
	reducers: {
		updateGroupTemplate: (state, { payload: { groupId, template } }) => {
			couponGroupsAdapter.updateOne(
				state.couponGroups,
				{
					id: groupId,
					changes: { template }
				}
			)
		}
	}
});

export const { selectById: selectCouponGroupById } = couponGroupsAdapter.getSelectors(state => state.coupons.couponGroups)
export const { selectById: selectCouponById } = couponsAdapter.getSelectors(state => state.coupons.coupons)
export const { updateGroupTemplate } = couponsSlice.actions
export default couponsSlice.reducer
