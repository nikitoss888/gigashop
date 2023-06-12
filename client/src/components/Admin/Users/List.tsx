import { List as MuiList, Box } from "@mui/material";
import ListItem from "./ListItem";
import UsersTopBox from "./UsersTopBox";
import Pagination from "../../Common/Pagination";
import { User } from "../../../http/User";
import Typography from "@mui/material/Typography";

type ListProps = {
	users?: User[];
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
export default function List({ users, sorting, limitation, pagination }: ListProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<UsersTopBox sorting={sorting} limitation={limitation} />
			<Pagination data={pagination} />
			<MuiList>
				{users ? (
					users.map((item) => <ListItem key={item.id.toString(16)} user={item} />)
				) : (
					<Typography
						component='h6'
						variant='h6'
						sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
					>
						Користувачів не знайдено
					</Typography>
				)}
			</MuiList>
			<Pagination data={pagination} />
		</Box>
	);
}
