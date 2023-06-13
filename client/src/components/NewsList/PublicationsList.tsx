import { Publication } from "../../http/Publications";
import { Box, Divider } from "@mui/material";
import styled from "@mui/material/styles/styled";
import PublicationItem from "./PublicationItem";
import Pagination from "../Common/Pagination";
import NewsTopBox from "./NewsTopBox";
import { User } from "../../http/User";
import NotFoundBox from "../CardsGrid/NotFoundBox";

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
				{publications && publications.length > 0 ? (
					publications.map((publication, index) => (
						<>
							<PublicationItem key={publication.id.toString(16)} publication={publication} />
							{index !== publications.length - 1 && (
								<Divider key={`divider-${publication.id}`} sx={{ borderColor: "primary.main" }} />
							)}
						</>
					))
				) : (
					<NotFoundBox text={"Публікацій не знайдено"} />
				)}
			</BoxStyle>
			{publications && publications.length > 0 && <Pagination data={pagination} />}
		</BoxStyle>
	);
}
