import TopBox from "../CardsGrid/TopBox";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Pagination from "../Common/Pagination";

type TopBoxProps = {
	sorting: {
		value: string;
		setValue: (sortBy: string) => void;
	};
	limitation: {
		value: number;
		setValue: (limit: number) => void;
	};
	pagination?: {
		value: number;
		setValue: (page: number) => void;
		maxValue: number;
	};
};
export default function NewsTopBox({ sorting, limitation, pagination }: TopBoxProps) {
	return (
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
					<MenuItem value={"createdAtAsc"}>Датою (за зростанням)</MenuItem>
					<MenuItem value={"createdAtDesc"}>Датою (за спаданням)</MenuItem>
					<MenuItem value={"titleAsc"}>Назвою (за зростанням)</MenuItem>
					<MenuItem value={"titleDesc"}>Назвою (за спаданням)</MenuItem>
				</Select>
			</FormControl>
			{pagination && (
				<Pagination
					data={pagination}
					sx={{
						display: {
							xs: "none",
							md: "flex",
						},
					}}
				/>
			)}
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
			{pagination && (
				<Pagination
					data={pagination}
					sx={{
						display: {
							xs: "flex",
							md: "none",
						},
					}}
				/>
			)}
		</TopBox>
	);
}
