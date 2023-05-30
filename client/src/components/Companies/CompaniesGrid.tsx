import { Company } from "../../mock/Companies";
import { SxProps } from "@mui/material";
import Grid from "../CardsGrid/Grid";
import CompanyCard from "./CompanyCard";
import NotFoundBox from "../CardsGrid/NotFoundBox";

type GridProps = {
	companies: Company[];
	sx?: SxProps;
};
export default function CompaniesGrid({ companies, sx }: GridProps) {
	return (
		<Grid sx={sx}>
			{companies.map((company) => (
				<CompanyCard company={company} key={company.id.toString(16)} />
			))}
			{companies.length === 0 && <NotFoundBox text={"Компанії не знайдено"} />}
		</Grid>
	);
}
