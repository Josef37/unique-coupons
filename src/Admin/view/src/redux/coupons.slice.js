import {
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
	createSlice,
} from "@reduxjs/toolkit";
import _ from "lodash";
import WpRest from "../api/wp-rest";

export const addGroup = createAsyncThunk(
	"coupons/addGroup", //
	WpRest.addGroup
);

export const addCoupons = createAsyncThunk(
	"coupons/addCoupons",
	async ({ couponValues, expiresAt, groupId }) => {
		const couponIds = await WpRest.addCoupons({
			couponValues,
			expiresAt,
			groupId,
		});
		return {
			groupId,
			coupons: _.zipWith(couponIds, couponValues, (id, value) => ({
				id,
				value,
				expiresAt,
			})),
		};
	}
);

export const getGroups = createAsyncThunk(
	"coupons/getGroups",
	WpRest.getGroups
);

export const getCoupons = createAsyncThunk(
	"coupons/getCoupons",
	async (groupId) => ({
		groupId,
		coupons: await WpRest.getCoupons(groupId),
	})
);

export const editGroup = createAsyncThunk(
	"coupons/editGroup",
	async ({ groupId, ...changes }, { rejectWithValue }) => {
		const group = await WpRest.editGroup(groupId, changes);
		if (!_.isMatch(group, { id: groupId, ...changes })) {
			return rejectWithValue(group);
		}
		return group;
	}
);

export const deleteGroup = createAsyncThunk(
	"coupons/deleteGroup",
	WpRest.deleteGroup
);

export const couponBulkActionCreators = {
	activate: createAsyncThunk("coupons/activate", WpRest.activateCoupons),
	deactivate: createAsyncThunk("coupons/deactivate", WpRest.deactivateCoupons),
	delete: createAsyncThunk("coupons/delete", WpRest.deleteCoupons),
};

/* {
	id: 123,
	name: "Special Christmas Offer",
	description: "50 % before christmas on everything",
	template: "Get your 50% offer today: %coupon%",
	isActive: true,
	couponIds: [123, 124, 125]
} */
const couponGroupsAdapter = createEntityAdapter();

/* {
	id: 123,
	value: "coupon1234",
	expiresAt: 1619465322,
	status: "publish",
	userId: 54
} */
const couponsAdapter = createEntityAdapter();

const initialState = {
	couponGroups: couponGroupsAdapter.getInitialState(),
	coupons: couponsAdapter.getInitialState(),
};

const couponsSlice = createSlice({
	name: "coupons",
	initialState,
	reducers: {},
	extraReducers: {
		[addGroup.fulfilled]: (state, { payload: couponGroup }) => {
			couponGroupsAdapter.addOne(state.couponGroups, couponGroup);
		},
		[addCoupons.fulfilled]: (state, { payload: { groupId, coupons } }) => {
			addCouponsToState(state, groupId, coupons);
		},
		[getGroups.fulfilled]: (state, { payload: couponGroups }) => {
			couponGroupsAdapter.setAll(state.couponGroups, couponGroups);
		},
		[getCoupons.fulfilled]: (state, { payload: { groupId, coupons } }) => {
			removeCouponsInGroup(state, groupId);
			addCouponsToState(state, groupId, coupons);
		},
		// prettier-ignore
		[editGroup.pending]: (state, { meta: { arg: { groupId, ...changes } } }) => {
			couponGroupsAdapter.updateOne(state.couponGroups, { id: groupId, changes });
		},
		// prettier-ignore
		[editGroup.fulfilled]: (state, { payload: { id, ...changes } }) => {
			couponGroupsAdapter.updateOne(state.couponGroups, { id, changes });
		},
		[editGroup.rejected]: (state, { payload }) => {
			if (payload?.id) {
				const { id, ...changes } = payload;
				couponGroupsAdapter.updateOne(state.couponGroups, { id, changes });
			}
		},
		[deleteGroup.fulfilled]: (state, { payload: groupId }) => {
			couponGroupsAdapter.removeOne(state.couponGroups, groupId);
		},
		// prettier-ignore
		[couponBulkActionCreators.activate.fulfilled]: (state, { meta: { arg: couponIds } }) => {
			couponsAdapter.updateMany(state.coupons, couponIds.map(id => ({ id, changes: { status: "active" } })))
		},
		// prettier-ignore
		[couponBulkActionCreators.deactivate.fulfilled]: (state, { meta: { arg: couponIds } }) => {
			couponsAdapter.updateMany(state.coupons, couponIds.map(id => ({ id, changes: { status: "inactive" } })))
		},
		// prettier-ignore
		[couponBulkActionCreators.delete.fulfilled]: (state, { meta: { arg: couponIds } }) => {
			couponsAdapter.removeMany(state.coupons, couponIds)
		},
	},
});

export const {
	selectById: selectCouponGroupById,
	selectIds: selectCouponGroupsIds,
} = couponGroupsAdapter.getSelectors((state) => state.coupons.couponGroups);
export const { selectById: selectCouponById } = couponsAdapter.getSelectors(
	(state) => state.coupons.coupons
);
export const selectCouponsByStatus = createSelector(
	(state) => state.coupons.coupons,
	(state, groupId) => selectCouponGroupById(state, groupId),
	(coupons, group) =>
		_.groupBy(
			group.couponIds.map((id) => coupons.entities[id]),
			"status"
		)
);

export default couponsSlice.reducer;

function addCouponsToState(state, groupId, coupons) {
	addCouponsToGroup(state, groupId, coupons);
	couponsAdapter.addMany(state.coupons, coupons);
}

function addCouponsToGroup(state, groupId, coupons) {
	const newCouponsIds = _.map(coupons, "id");
	const currentCouponIds = state.couponGroups.entities[groupId].couponIds;
	const couponIds = _.union(currentCouponIds, newCouponsIds);

	couponGroupsAdapter.updateOne(state.couponGroups, {
		id: groupId,
		changes: { couponIds },
	});
}

function removeCouponsInGroup(state, groupId) {
	const couponIds = state.couponGroups.entities[groupId].couponIds;
	couponGroupsAdapter.updateOne(state.couponGroups, {
		id: groupId,
		changes: { couponIds: [] },
	});
	couponsAdapter.removeMany(state.coupons, couponIds);
}
