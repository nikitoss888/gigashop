import { Box, FormControl, InputLabel, MenuItem, Select, List as MuiList, Divider } from "@mui/material";
import { Genre } from "../../../http/Genres";
import ListItem from "./ListItem";
import TopBox from "../../CardsGrid/TopBox";
import Pagination from "../../Common/Pagination";
import NotFoundBox from "../../CardsGrid/NotFoundBox";

type ListProps = {
	genres?: Genre[];
	onDelete: (id: number) => void;
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
	};
};
export default function List({ genres, onDelete, sorting, limitation, pagination }: ListProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<TopBox>
				<FormControl>
					<InputLabel id='sort-by-label'>Сортувати за</InputLabel>
					<Select
						labelId='sort-by-label'
						id='sort-by'
						value={sorting.value}
						label='Сортувати за'
						onChange={(event) => sorting.setValue(event.target.value as string)}
					>
						<MenuItem value={"nameAsc"}>Назвою (за зростанням)</MenuItem>
						<MenuItem value={"nameDesc"}>Назвою (за спаданням)</MenuItem>
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
						}}
					>
						{/* 3 is for testing on low amount of data */}
						<MenuItem value={3}>3</MenuItem>
						<MenuItem value={12}>12</MenuItem>
						<MenuItem value={24}>24</MenuItem>
						<MenuItem value={48}>48</MenuItem>
					</Select>
				</FormControl>
			</TopBox>
			<Pagination data={pagination} />
			<MuiList>
				{genres && genres.length > 0 ? (
					genres.map((genre, index: number) => (
						<>
							<ListItem key={genre.id.toString(16)} genre={genre} onDelete={onDelete} />
							{index !== genres.length - 1 && (
								<Divider key={`divider-${genre.id}`} sx={{ borderColor: "primary.main" }} />
							)}
						</>
					))
				) : (
					<NotFoundBox text='Жанри не знайдено' />
				)}
			</MuiList>
			{genres && genres.length > 0 && <Pagination data={pagination} />}
		</Box>
	);
}
