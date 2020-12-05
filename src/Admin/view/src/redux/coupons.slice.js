import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { initialCouponGroups, initialCoupons } from "../data";

const couponGroupsAdapter = createEntityAdapter()
const couponsAdapter = createEntityAdapter()

const initialState = {
	couponGroups: couponGroupsAdapter.getInitialState(),
	coupons: couponsAdapter.getInitialState()
}

// Load dummy data in development mode.
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
		},
		addCoupons: (state, { payload: { groupId, coupons } }) => {
			addCouponsToGroup(state, groupId, coupons);
			couponsAdapter.addMany(state.coupons, coupons)
		},
		editGroup: (state, { payload: { groupId, ...changes } }) => {
			console.log({ id: groupId, changes })
			couponGroupsAdapter.updateOne(state.couponGroups, { id: groupId, changes })
		}
	}
});

export const {
	selectById: selectCouponGroupById,
	selectIds: selectCouponGroupsIds
} = couponGroupsAdapter.getSelectors(state => state.coupons.couponGroups)
export const { selectById: selectCouponById } = couponsAdapter.getSelectors(state => state.coupons.coupons)

export const { updateGroupTemplate, addCoupons, editGroup } = couponsSlice.actions

export default couponsSlice.reducer

/**
 * Updates the referenced coupon ids for the coupon group.
 */
function addCouponsToGroup(state, groupId, coupons) {
	const newCouponsIds = _.map(coupons, 'id');
	const currentCouponIds = state.couponGroups.entities[groupId].couponIds;
	const couponIds = _.union(currentCouponIds, newCouponsIds);

	couponGroupsAdapter.updateOne(state.couponGroups, {
		id: groupId,
		changes: { couponIds }
	});
}

