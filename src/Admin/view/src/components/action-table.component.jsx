import React, { useState } from "react";
import { styled } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import BasicRowContainer from "./row-container.component";

const ActionTable = ({
	ids,
	Row,
	BulkActions = (ids) => null,
	isFetching = false,
}) => {
	const [selectedIds, setSelectedIds] = useState([]);

	const isSelected = (id) => selectedIds.includes(id);

	const toggleRow = (id) =>
		setSelectedIds((selectedRows) =>
			isSelected(id)
				? selectedRows.filter((selectedId) => selectedId !== id)
				: selectedRows.concat(id)
		);

	const allIdsSelected = () => ids.length === selectedIds.length;
	const noIdsSelected = () => 0 === selectedIds.length;
	const indeterminateSelection = () => !allIdsSelected() && !noIdsSelected();

	const selectAllIds = () => setSelectedIds(ids);
	const deselectAllIds = () => setSelectedIds([]);
	const toggleAllIds = () =>
		allIdsSelected() ? deselectAllIds() : selectAllIds();

	const Header = (
		<HeaderRow>
			<Checkbox
				checked={allIdsSelected() && !noIdsSelected()}
				indeterminate={indeterminateSelection()}
				onChange={toggleAllIds}
				aria-label={(allIdsSelected() ? "deselect" : "select") + " all rows"}
			/>
			<BulkActions ids={selectedIds} />
		</HeaderRow>
	);

	const Body = (
		<>
			{isFetching ? <LoadingIndicatorRow /> : null}
			{ids.length === 0 ? (
				<NoEntriesRow />
			) : (
				ids.map((id) => (
					<RowContainer key={id}>
						<Checkbox checked={isSelected(id)} onChange={() => toggleRow(id)} />
						<Row id={id} />
					</RowContainer>
				))
			)}
		</>
	);

	return (
		<Paper square>
			{Header}
			{Body}
		</Paper>
	);
};

const LoadingIndicatorRow = () => (
	<RowContainer>
		<CircularProgress size={30} style={{ margin: "0 5px" }} />
		<Typography>Updating entries</Typography>
	</RowContainer>
);

const NoEntriesRow = () => (
	<RowContainer>
		<Typography>No entries</Typography>
	</RowContainer>
);

const rowStyles = {
	display: "flex",
	alignItems: "center",
	gap: "1em",
};

const RowContainer = styled(BasicRowContainer)(rowStyles);

const HeaderRow = styled("div")({
	...rowStyles,
	padding: "0.4em 1em",
	borderBottom: "1px solid #888",
});

export default ActionTable;
