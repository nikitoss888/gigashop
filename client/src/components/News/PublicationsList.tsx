import { Publication } from "../../mock/Publications";
import { Box, Divider } from "@mui/material";
import styled from "@mui/material/styles/styled";
import PublicationItem from "./PublicationItem";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

type ListProps = {
	items: Publication[];
};
export default function PublicationsList({ items }: ListProps) {
	return (
		<BoxStyle>
			{items.map((item, index) => (
				<>
					<PublicationItem key={item.id.toString(16)} item={item} />
					{index !== items.length - 1 && <Divider sx={{ borderColor: "primary.main" }} />}
				</>
			))}
		</BoxStyle>
	);
}
