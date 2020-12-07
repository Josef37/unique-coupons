import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { selectCouponGroupById } from '../redux/coupons.slice';

const CouponGroupRow = ({ groupId }) => {
	const { id, name, description, isActive }
		= useSelector(state => selectCouponGroupById(state, groupId))

	return <Row isActive={isActive}>
		<Link to={`/group/${id}`}>
			<Title>{name}</Title>
		</Link>
		<Description>
			{description}
		</Description>
	</Row>
}

const Row = styled.div`
	opacity: ${props => props.isActive ? 1 : 0.6};
`
const Title = styled.h3`
	margin: 0;
`
const Description = styled.span`
	font-style: italic;
`

export default CouponGroupRow;
