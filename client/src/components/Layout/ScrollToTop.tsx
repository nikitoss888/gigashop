import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useCallback } from "react";
import { Box, Fab, Zoom } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

export default function ScrollToTop() {
	const trigger = useScrollTrigger({ threshold: 100, disableHysteresis: true });

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<Zoom in={trigger}>
			<Box
				role='presentation'
				sx={{
					position: "fixed",
					bottom: 32,
					right: 32,
					zIndex: 1,
				}}
			>
				<Fab onClick={scrollToTop} color='primary' size='small' aria-label='Scroll back to top'>
					<KeyboardArrowUp
						fontSize='large'
						sx={{
							color: "accent.main",
						}}
					/>
				</Fab>
			</Box>
		</Zoom>
	);
}
