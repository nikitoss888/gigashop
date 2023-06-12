import { Company } from "../../http/Companies";
import { Box, FormControl, InputLabel, MenuItem, Select, SxProps } from "@mui/material";
import Grid from "../CardsGrid/Grid";
import CompanyCard from "./CompanyCard";
import NotFoundBox from "../CardsGrid/NotFoundBox";
import Pagination from "../Common/Pagination";
import TopBox from "../CardsGrid/TopBox";

type GridProps = {
	companies?: Company[];
	sx?: SxProps;
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
export default function CompaniesGrid({ companies, sx, sorting, limitation, pagination }: GridProps) {
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
						<MenuItem value={"nameAsc"}>Назвою (за зростанням)</MenuItem>
						<MenuItem value={"nameDesc"}>Назвою (за спаданням)</MenuItem>
						<MenuItem value={"foundedAsc"}>Датою заснування (за зростанням)</MenuItem>
						<MenuItem value={"foundedDesc"}>Датою заснування (за спаданням)</MenuItem>
					</Select>
				</FormControl>
				<Pagination
					data={pagination}
					sx={{
						display: {
							xs: "none",
							md: "flex",
						},
					}}
				/>
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
				<Pagination
					data={pagination}
					sx={{
						display: {
							xs: "flex",
							md: "none",
						},
					}}
				/>
			</TopBox>
			<Grid sx={sx}>
				{companies &&
					companies.map((company) => <CompanyCard company={company} key={company.id.toString(16)} />)}
				{!companies || (companies.length === 0 && <NotFoundBox text={"Компанії не знайдено"} />)}
			</Grid>
			<Pagination data={pagination} />
		</Box>
	);
}
