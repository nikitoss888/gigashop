import { Publication } from "../../mock/Publications";
import { Box, Divider } from "@mui/material";
import styled from "@mui/material/styles/styled";
import PublicationItem from "./PublicationItem";
import Pagination from "../Common/Pagination";
import NewsTopBox from "./NewsTopBox";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

type ListProps = {
	items: Publication[];
	sorting: {
		value: string;
		setValue: (value: string) => void;
	};
	limitation: {
		value: number;
		setValue: (value: number) => void;
	};
	pagination: {
		value: number;
		setValue: (value: number) => void;
		maxValue: number;
	};
};
export default function PublicationsList({ items, sorting, limitation, pagination }: ListProps) {
	return (
		<BoxStyle>
			<NewsTopBox sorting={sorting} limitation={limitation} pagination={pagination} />
			<BoxStyle>
				{items.map((item, index) => (
					<>
						<PublicationItem key={item.id.toString(16)} item={item} />
						{index !== items.length - 1 && (
							<Divider key={`divider-${item.id}`} sx={{ borderColor: "primary.main" }} />
						)}
					</>
				))}
			</BoxStyle>
			<Pagination data={pagination} />
		</BoxStyle>
	);
}
