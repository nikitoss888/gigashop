import { Box, Typography } from "@mui/material";
import List from "../../components/Admin/Items/List";
import Items from "../../mock/Items";

export default function AdminItems() {
	return (
		<Box>
			<Typography variant='h4' textAlign='center'>
				Список товарів
			</Typography>
			<List items={Items} />
		</Box>
	);
}
