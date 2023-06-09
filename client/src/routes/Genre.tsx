import { useLoaderData } from "react-router-dom";
import { Genre as GenreType } from "../mock/Genres";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import ItemsGrid from "../components/Items/ItemsGrid";
import Items from "../mock/Items";
import styled from "@mui/material/styles/styled";
import ClientError from "../ClientError";
import { useState } from "react";
import { SortSwitch } from "./Items";

const ContainerStyle = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 5px 20px;
	margin-top: 15px;
	height: 100%;
`;

export default function Genre() {
	const { genre, error, totalCount } = useLoaderData() as {
		genre: GenreType;
		totalCount: number;
		error?: ClientError;
	};

	if (error) throw error;

	const initSortBy = "releaseDateAsc";
	const initLimit = 12;
	const initPage = 1;

	const [sortBy, setSortBy] = useState(initSortBy);
	const [limit, setLimit] = useState(initLimit);
	const [page, setPage] = useState(initPage);

	document.title = `Жанр "${genre.name}" — gigashop`;

	const [items, setItems] = useState(
		genre.items?.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || []
	);
	const [maxPage, setMaxPage] = useState(Math.ceil((totalCount || 0) / limit) || 1);

	const getItems = (sortBy: string, limit: number, page: number) => {
		const items =
			genre.items?.sort((a, b) => SortSwitch(sortBy, a, b)).slice((page - 1) * limit, page * limit) || [];
		setItems(items);
		setMaxPage(Math.ceil(Items.length / limit) || 1);
	};

	const sortByUpdate = (sortBy: string) => {
		getItems(sortBy, limit, page);
		setSortBy(sortBy);
	};

	const limitUpdate = (limit: number) => {
		getItems(sortBy, limit, page);
		setLimit(limit);
	};

	const pageUpdate = (page: number) => {
		let localPage = page;
		if (page < 1) localPage = 1;
		if (page > maxPage) localPage = maxPage;
		getItems(sortBy, limit, localPage);
		setPage(localPage);
	};

	return (
		<ContainerStyle>
			<Typography variant='h3' textAlign='center' mt={3}>
				Жанр {genre.name}
			</Typography>
			{genre.description && (
				<>
					<Typography variant='h4' textAlign='center'>
						Опис
					</Typography>
					<Typography variant='body1' textAlign='center'>
						{genre.description}
					</Typography>
				</>
			)}
			<Typography variant='h4' textAlign='center'>
				Товари, пов&apos;язані з жанром:
			</Typography>
			<ItemsGrid
				items={items}
				sorting={{
					value: sortBy,
					setValue: sortByUpdate,
				}}
				limitation={{
					value: limit,
					setValue: limitUpdate,
				}}
				pagination={{
					value: page,
					setValue: pageUpdate,
					maxValue: maxPage,
				}}
			/>
		</ContainerStyle>
	);
}
