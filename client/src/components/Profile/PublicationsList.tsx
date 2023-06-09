import { Divider, List } from "@mui/material";
import PublicationListItem from "./PublicationsListItem";
import { Publication } from "../../mock/Publications";

type ListProps = {
	publications: Publication[];
};
export default function PublicationsList({ publications }: ListProps) {
	return (
		<List
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				gap: "10px",
			}}
		>
			{publications.map((publication, index) => (
				<>
					<PublicationListItem publication={publication} key={publication.id.toString(16)} />
					{index < publications.length - 1 && <Divider sx={{ borderColor: "primary.main" }} />}
				</>
			))}
		</List>
	);
}
