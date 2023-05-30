import { Box, Typography } from "@mui/material";

type BoxProps = {
	text: string;
};
export default function NotFoundBox({ text }: BoxProps) {
	return (
		<Box sx={{ gridColumn: "1 / -1" }}>
			<Typography variant='h5' textAlign='center'>
				{text}
			</Typography>
		</Box>
	);
}
