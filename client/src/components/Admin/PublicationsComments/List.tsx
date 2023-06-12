import { Box, FormControl, InputLabel, MenuItem, Select, List as MuiList, Divider } from "@mui/material";
import ListItem from "./ListItem";
import TopBox from "../../CardsGrid/TopBox";
import Pagination from "../../Common/Pagination";
import { Comment, Publication } from "../../../http/Publications";
import { User } from "../../../http/User";
import Typography from "@mui/material/Typography";

type ListProps = {
	comments?: (Comment & { User: User; Publication: Publication })[];
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
	linkToPublication?: boolean;
	linkToUser?: boolean;
};
export default function List({ comments, sorting, limitation, pagination, linkToPublication, linkToUser }: ListProps) {
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
				{comments ? (
					comments.map((company, index: number) => (
						<>
							<ListItem
								key={company.id.toString(16)}
								comment={company}
								linkToPublication={linkToPublication}
								linkToUser={linkToUser}
							/>
							{index !== comments.length - 1 && (
								<Divider key={`divider-${company.id}`} sx={{ borderColor: "primary.main" }} />
							)}
						</>
					))
				) : (
					<Typography
						component='h6'
						variant='h6'
						sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
					>
						Коментарів не знайдено
					</Typography>
				)}
			</MuiList>
			<Pagination data={pagination} />
		</Box>
	);
}
