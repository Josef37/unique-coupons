import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { clamp, range } from "lodash";
import { appRoot } from "../configure-shadow-dom";
import { styled } from "@material-ui/core/styles";

const Paginated = ({ items, initialPage = 1, perPage = 10, getComponent }) => {
	const maxPage = Math.ceil(items.length / perPage) || 1;
	const getSafePage = (page) => clamp(page, 1, maxPage);
	const [page, setPage] = useState(initialPage);
	const setSafePage = (page) => setPage(getSafePage(page));

	if (getSafePage(page) !== page) setSafePage(page);

	const pages = range(1, maxPage + 1);
	const pageItems = items.slice((page - 1) * perPage, page * perPage);

	const pageSelect = (
		<Select
			value={page}
			onChange={(event) => setSafePage(event.target.value)}
			label="Page"
			MenuProps={{ container: appRoot }}
		>
			{pages.map((page) => (
				<MenuItem value={page} key={page}>
					{page}
				</MenuItem>
			))}
		</Select>
	);

	const arrowControls = (
		<>
			<ArrowLeftButton
				onClick={() => setSafePage(page - 1)}
				disabled={getSafePage(page - 1) === page}
			/>
			<ArrowRightButton
				onClick={() => setSafePage(page + 1)}
				disabled={getSafePage(page + 1) === page}
			/>
		</>
	);

	const paginationControls = (
		<Container>
			{arrowControls}
			<Label>
				Page {pageSelect} of {maxPage}
			</Label>
		</Container>
	);

	return (
		<>
			{getComponent(pageItems)}
			{paginationControls}
		</>
	);
};

const Container = styled("div")(({ theme }) => ({
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	padding: theme.spacing(1),
}));

const ArrowLeftButton = (props) => (
	<IconButton size="small" {...props}>
		<ArrowLeftIcon />
	</IconButton>
);
const ArrowRightButton = (props) => (
	<IconButton size="small" {...props}>
		<ArrowRightIcon />
	</IconButton>
);

const Label = styled(InputLabel)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	marginLeft: theme.spacing(2),
	gap: theme.spacing(1),
}));

export default Paginated;
