import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TopBox from "../../CardsGrid/TopBox";

type TopBoxProps = {
	sorting: {
		value: string;
		setValue: (sortBy: string) => void;
	};
	limitation: {
		value: number;
		setValue: (limit: number) => void;
	};
};
export default function ItemsTopBox({ sorting, limitation }: TopBoxProps) {
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
					<MenuItem value={"createdAt"}>Датою реєстраці (за зростанням)</MenuItem>
					<MenuItem value={"createdAtDesc"}>Датою реєстраці (за спаданням)</MenuItem>
					<MenuItem value={"loginAsc"}>Логіном (за зростанням)</MenuItem>
					<MenuItem value={"loginDesc"}>Логіном (за спаданням)</MenuItem>
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
	);
}
