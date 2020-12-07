import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Switch from "@material-ui/core/Switch"
import styled from 'styled-components';
import { selectCouponGroupById, editGroup } from '../redux/coupons.slice';

const CouponGroupRow = ({ groupId }) => {
	const { id, name, description, isActive }
		= useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

	return <Row isActive={isActive}>
		<Switch
			checked={isActive}
			onChange={() => dispatch(editGroup({ groupId, isActive: !isActive }))}
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

const Row = styled.div`
	display: flex;
	align-items: center;
	gap: 1em;
`
const Title = styled.h3`
	margin: 0;
`
const Description = styled.span`
	font-style: italic;
`

export default CouponGroupRow;
