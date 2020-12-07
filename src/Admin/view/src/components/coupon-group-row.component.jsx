import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Checkbox from "@material-ui/core/Checkbox"
import { selectCouponGroupById } from '../redux/coupons.slice';

const CouponGroupsList = ({ groupId }) => {
	const { id, name, description, isActive, couponIds }
		= useSelector(state => selectCouponGroupById(state, groupId))

	return <Row isActive={isActive}>
		<Checkbox type="checkbox" />
		<Link to={`/group/${id}`}>
			<Title>{name}</Title>
		</Link>
		<Description>
			{description}
		</Description>
		<SizeDescription>{couponIds.length} coupons</SizeDescription>
	</Row>
}

const Row = styled.div`
	opacity: ${props => props.isActive ? 1 : 0.6};
	display: flex;
	align-items: center;
	gap: 2em;
	padding: 1em;
	border-bottom: 1px solid #ccc;
	&:hover {
		background: #eee;
	}
`
const Title = styled.h3`
	margin: 0;
`
const Description = styled.span`
	font-style: italic;
`
const SizeDescription = styled.span``

export default CouponGroupsList;
