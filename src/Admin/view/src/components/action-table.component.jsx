import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'

const ActionTable = ({ ids, Row }) => {
	const [selectedIds, setSelectedIds] = useState(new Set())

	const isSelected = id => selectedIds.has(id)

	const toggleRow = id => setSelectedIds(selectedRows => {
		isSelected(id) ? selectedRows.delete(id) : selectedRows.add(id)
		return new Set(selectedRows)
	})

	const allIdsSelected = () => ids.length === selectedIds.size
	const noIdsSelected = () => 0 === selectedIds.size
	const indeterminateSelection = () => !allIdsSelected() && !noIdsSelected()

	const selectAllIds = () => setSelectedIds(new Set(ids))
	const deselectAllIds = () => setSelectedIds(new Set())
	const toggleAllIds = () => allIdsSelected() ? deselectAllIds() : selectAllIds()

	return ids.length === 0
		? null
		: <Box marginBottom={2}>
			<Paper>
				<HeaderRow>
					<Checkbox
						checked={allIdsSelected()}
						indeterminate={indeterminateSelection()}
						onChange={toggleAllIds}
						aria-label={(allIdsSelected() ? "deselect" : "select") + " all rows"}
					/>
				</HeaderRow>
				{ids.map(id => <RowContainer key={id}>
					<Checkbox
						checked={isSelected(id)}
						onChange={() => toggleRow(id)}
						aria-label={(isSelected(id) ? "deselect" : "select") + " this row"}
					/>
					<Row id={id} />
				</RowContainer>)}
			</Paper>
		</Box>
}

const rowStyles = {
	display: "flex",
	alignItems: "center",
	gap: "1em",
}

const RowContainer = styled("div")({
	...rowStyles,
	padding: "1em",
	"&:not(:last-child)": {
		borderBottom: "1px solid #ccc"
	},
	"&:hover": {
		background: "#eee"
	}
})

const HeaderRow = styled("div")({
	...rowStyles,
	padding: "0.4em 1em",
	borderBottom: "1px solid #888",
})

export default ActionTable
