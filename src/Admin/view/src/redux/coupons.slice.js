import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import * as WP_Rest from "../api/wp-rest";

/** @todo remove */
import { initialCouponGroups, initialCoupons } from "../data";

export const addGroup = createAsyncThunk(
	'coupons/addGroup',
	async (couponGroup, thunkAPI) => {
		return WP_Rest.addGroup(couponGroup)
	}
)

const couponGroupsAdapter = createEntityAdapter()
const couponsAdapter = createEntityAdapter()

const initialState = {
	couponGroups: couponGroupsAdapter.getInitialState(),
	coupons: couponsAdapter.getInitialState()
}

/** @todo remove: Load dummy data in development mode. */
if (process.env.NODE_ENV === 'development') {
	initialState.couponGroups = initialCouponGroups
	initialState.coupons = initialCoupons
}

const couponsSlice = createSlice({
	name: 'coupons',
	initialState,
	reducers: {
		addCoupons: (state, { payload: { groupId, coupons } }) => {
			addCouponsToGroup(state, groupId, coupons);
			couponsAdapter.addMany(state.coupons, coupons)
		},
		editGroup: (state, { payload: { groupId, ...changes } }) => {
			couponGroupsAdapter.updateOne(state.couponGroups, { id: groupId, changes })
		}
	},
	extraReducers: {
		[addGroup.fulfilled]: (state, { payload: couponGroup }) => {
			couponGroupsAdapter.addOne(state.couponGroups, couponGroup)
		}
	}
});

export const {
	selectById: selectCouponGroupById,
	selectIds: selectCouponGroupsIds
} = couponGroupsAdapter.getSelectors(state => state.coupons.couponGroups)
export const { selectById: selectCouponById } = couponsAdapter.getSelectors(state => state.coupons.coupons)

export const { addCoupons, editGroup } = couponsSlice.actions

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

