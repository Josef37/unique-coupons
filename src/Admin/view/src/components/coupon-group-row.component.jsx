import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch"
import { selectCouponGroupById, editGroup } from '../redux/coupons.slice';

const CouponGroupRow = ({ groupId }) => {
	const { id, name, description, isActive }
		= useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

	return <Row>
		<Switch
			checked={isActive}
			onChange={(event) => dispatch(
				editGroup({ groupId, isActive: event.target.checked })
			)}
			inputProps={{ "aria-label": "toggle group activation" }}
		/>
		<div>
			<Link to={`/group/${id}`}>
				<Title>{name}</Title>
			</Link>
			<Description>
				{description}
			</Description>
		</div>
	</Row>
}

const Row = styled("div")({
	display: "flex",
	alignItems: "center",
	gap: "1em",
})
const Title = styled("h3")({
	margin: 0,
})
const Description = styled("span")({
	fontStyle: "italic",
})

export default CouponGroupRow;
