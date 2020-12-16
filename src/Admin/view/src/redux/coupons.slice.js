import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import WP_Rest from "../api/wp-rest";

/** @todo remove */
import { initialCouponGroups, initialCoupons } from "../data";

export const addGroup = createAsyncThunk(
	'coupons/addGroup',
	async (couponGroup, thunkApi) => {
		return WP_Rest.addGroup(couponGroup)
	}
)

export const addCoupons = createAsyncThunk(
	'coupons/addCoupons',
	async ({ couponValues, expiresAt, groupId }, thunkApi) => {
		const couponIds = await WP_Rest.addCoupons({ couponValues, expiresAt, groupId })
		return {
			groupId,
			coupons: _.zipWith(couponIds, couponValues, (id, value) => ({ id, value, expiresAt }))
		}
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
		editGroup: (state, { payload: { groupId, ...changes } }) => {
			couponGroupsAdapter.updateOne(state.couponGroups, { id: groupId, changes })
		}
	},
	extraReducers: {
		[addGroup.fulfilled]: (state, { payload: couponGroup }) => {
			couponGroupsAdapter.addOne(state.couponGroups, couponGroup)
		},
		[addCoupons.fulfilled]: (state, { payload: { groupId, coupons } }) => {
			addCouponsToGroup(state, groupId, coupons);
			couponsAdapter.addMany(state.coupons, coupons)
		},
	}
});

export const {
	selectById: selectCouponGroupById,
	selectIds: selectCouponGroupsIds
} = couponGroupsAdapter.getSelectors(state => state.coupons.couponGroups)
export const { selectById: selectCouponById } = couponsAdapter.getSelectors(state => state.coupons.coupons)

export const { editGroup } = couponsSlice.actions

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

