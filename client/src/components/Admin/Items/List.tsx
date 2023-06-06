import { List as MuiList } from "@mui/material";
import ListItem from "./ListItem";
import { Item } from "../../../mock/Items";

type ListProps = {
	items?: Item[];
};
export default function List({ items }: ListProps) {
	return (
		<MuiList>
			{items?.map((item) => (
				<ListItem key={item.id.toString(16)} item={item} />
			))}
		</MuiList>
	);
}
