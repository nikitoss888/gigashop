import ItemCard from "./ItemCard";
import { Item } from "../../mock/Items";
import { Box, FormControl, InputLabel, MenuItem, Select, SxProps } from "@mui/material";
import Grid from "../CardsGrid/Grid";
import NotFoundBox from "../CardsGrid/NotFoundBox";
import styled from "@mui/material/styles/styled";
import Pagination from "./Pagination";

const SortAndLimitationBox = styled(Box)`
	display: grid;
	grid-template-columns: repeat(2, minmax(200px, 1fr));
	gap: 10px;
`;

type GridProps = {
	items: Item[];
	sx?: SxProps;
	sorting: {
		value: string;
		setValue: (sortBy: string) => void;
	};
	limitation: {
		value: number;
		setValue: (limit: number) => void;
	};
	pagination: {
		value: number;
		setValue: (page: number) => void;
		maxValue: number;
		recalculate?: () => void;
	};
};
export default function ItemsGrid({ items, sx, sorting, limitation, pagination }: GridProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<SortAndLimitationBox>
				<FormControl>
					<InputLabel id='sort-by-label'>Сортувати за</InputLabel>
					<Select
						labelId='sort-by-label'
						id='sort-by'
						value={sorting.value}
						label='Сортувати за'
						onChange={(event) => sorting.setValue(event.target.value as string)}
					>
						<MenuItem value={"name"}>Назвою</MenuItem>
						<MenuItem value={"price"}>Ціною</MenuItem>
						<MenuItem value={"releaseDate"}>Дата виходу</MenuItem>
					</Select>
				</FormControl>
				<FormControl>
					<InputLabel id='limit-label'>Показати</InputLabel>
					<Select
						labelId='limit-label'
						id='limit'
						value={limitation.value}
						label='Показати'
						onChange={(event) => {
							limitation.setValue(event.target.value as number);
							pagination.recalculate?.();
						}}
					>
						{/* 3 is for testing on low amount of data */}
						<MenuItem value={3}>3</MenuItem>
						<MenuItem value={12}>12</MenuItem>
						<MenuItem value={24}>24</MenuItem>
						<MenuItem value={48}>48</MenuItem>
					</Select>
				</FormControl>
			</SortAndLimitationBox>
			<Pagination data={pagination} />
			<Grid sx={sx}>
				{items.map((item) => (
					<ItemCard key={item.id.toString(16)} item={item} />
				))}
				{items.length === 0 && <NotFoundBox text={"Товари не знайдено"} />}
			</Grid>
			<Pagination data={pagination} sx={{ mt: "auto" }} />
		</Box>
	);
}
