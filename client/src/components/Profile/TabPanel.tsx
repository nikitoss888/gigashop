import { Box } from "@mui/material";

type TabPanelProps = {
	children?: React.ReactNode;
	index: number;
	value: number;
};
export default function TabPanel({ children, index, value, ...other }: TabPanelProps) {
	return (
		<Box
			role='tabpanel'
			hidden={value !== index}
			id={`profile-tabpanel-${index}`}
			aria-labelledby={`profile-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</Box>
	);
}
