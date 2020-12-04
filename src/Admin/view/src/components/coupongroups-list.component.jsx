import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { selectCouponGroupById } from '../redux/coupons.slice';

const CouponGroupsList = ({ groupId }) => {
	const { id, name, description, isActive, couponIds }
		= useSelector(state => selectCouponGroupById(state, groupId))

	return <DisplayActive isActive={isActive}>
		<Checkbox type="checkbox" />
		<Link to={`/group/${id}`}>
			<Title>{name}</Title>
		</Link>
		<Description>
			{description}
		</Description>
		<SizeDescription>{couponIds.length} coupons</SizeDescription>
	</DisplayActive>
}

const DisplayActive = styled.div`
	opacity: ${props => props.isActive ? 1 : 0.6};
	display: flex;
	gap: 2em;
	margin: 1em 3em;
`
const Checkbox = styled.input.attrs({ type: "checkbox" })``
const Title = styled.h3`
	margin: 0;
`
const Description = styled.span``

const SizeDescription = styled.span``

export default CouponGroupsList;
