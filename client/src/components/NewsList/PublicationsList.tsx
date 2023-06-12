import { Publication } from "../../http/Publications";
import { Box, Divider } from "@mui/material";
import styled from "@mui/material/styles/styled";
import PublicationItem from "./PublicationItem";
import Pagination from "../Common/Pagination";
import NewsTopBox from "./NewsTopBox";
import { User } from "../../http/User";
import Typography from "@mui/material/Typography";

const BoxStyle = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

type ListProps = {
	publications?: (Publication & { AuthoredUser: User })[];
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
export default function PublicationsList({ publications, sorting, limitation, pagination }: ListProps) {
	return (
		<BoxStyle>
			<NewsTopBox sorting={sorting} limitation={limitation} pagination={pagination} />
			<BoxStyle>
				{publications ? (
					publications.map((publication, index) => (
						<>
							<PublicationItem key={publication.id.toString(16)} publication={publication} />
							{index !== publications.length - 1 && (
								<Divider key={`divider-${publication.id}`} sx={{ borderColor: "primary.main" }} />
							)}
						</>
					))
				) : (
					<Typography
						component='h6'
						variant='h6'
						sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
					>
						Публікацій не знайдено
					</Typography>
				)}
			</BoxStyle>
			<Pagination data={pagination} />
		</BoxStyle>
	);
}
