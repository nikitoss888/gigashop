import { Box, FormControl, InputLabel, MenuItem, Select, List as MuiList, Divider } from "@mui/material";
import ListItem from "./ListItem";
import TopBox from "../../CardsGrid/TopBox";
import Pagination from "../../Common/Pagination";
import { ItemRate } from "../../../http/Items";
import { User } from "../../../http/User";
import NotFoundBox from "../../CardsGrid/NotFoundBox";

type ListProps = {
	rates?: (ItemRate & {
		User: User;
	})[];
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
	linkToItem?: boolean;
	linkToUser?: boolean;
};
export default function List({ rates, sorting, limitation, pagination, linkToItem, linkToUser }: ListProps) {
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
						<MenuItem value={"createdAtAsc"}>Датою (за зростанням)</MenuItem>
						<MenuItem value={"createdAtDesc"}>Датою (за спаданням)</MenuItem>
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
				{rates && rates.length > 0 ? (
					rates.map((comment, index: number) => (
						<>
							<ListItem
								key={comment.id.toString(16)}
								comment={comment}
								linkToItem={linkToItem}
								linkToUser={linkToUser}
							/>
							{index !== rates.length - 1 && (
								<Divider key={`divider-${comment.id}`} sx={{ borderColor: "primary.main" }} />
							)}
						</>
					))
				) : (
					<NotFoundBox text='Оцінок немає' />
				)}
			</MuiList>
			{rates && rates.length > 0 && <Pagination data={pagination} />}
		</Box>
	);
}
