import { Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import ContentBox from "../components/Home/ContentBox";
import Link from "../components/Home/Link";

const PageDividerImage = styled("img")`
	width: 100%;
	max-height: 400px;
	object-position: center bottom;
	object-fit: cover;
`;

const ContentImage = styled("img")`
	flex: 1;
	max-height: 300px;
	object-position: center;
	object-fit: cover;
`;

export default function Home() {
	return (
		<Box
			sx={{
				mt: "30px",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				gap: "45px",
			}}
		>
			<Typography
				component='h2'
				variant='h3'
				sx={{
					textAlign: "center",
					marginInline: 5,
				}}
			>
				Ласкаво просимо до {process.env.REACT_APP_PROJECT_NAME}!
			</Typography>
			<Box>
				<PageDividerImage
					src='https://res.cloudinary.com/dnqlgypji/image/upload/v1686746153/gigashop/static/o7leaxa65llgmwpkxsdu.jpg'
					alt='home'
				/>
			</Box>
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "start",
					gap: "45px",
				}}
			>
				<ContentBox>
					<Typography
						component='p'
						variant='h6'
						sx={{
							textAlign: "justify",
							marginInline: 5,
						}}
					>
						{process.env.REACT_APP_PROJECT_NAME} спеціализується на продажу відеоігор та додаткових
						матеріалів до них. Ми пропонуємо великий вибір ігор для різних платформ від великих ігрових
						компаній.
					</Typography>
					<ContentImage
						src='https://res.cloudinary.com/dnqlgypji/image/upload/v1686748778/gigashop/static/z2cx9o7vqjgbfoha09cn.jpg'
						alt='fallout_image'
					/>
				</ContentBox>
				<ContentBox>
					<ContentImage
						src='https://res.cloudinary.com/dnqlgypji/image/upload/v1686748907/gigashop/static/grqqvcwsmqmwzhbntr0r.png'
						alt='map'
					/>
					<Typography
						component='p'
						variant='h6'
						sx={{
							textAlign: "justify",
							marginInline: 5,
						}}
					>
						Шукайте товари на нашому сайті на сторінці <Link to='/shop/items'>магазину</Link> з
						використанням детальних фільтрів, або перегляньте список товарів шукомих{" "}
						<Link to='/shop/genres'>жанрів</Link> чи <Link to='/shop/companies'>компаній</Link>. Каталог
						жанрів та компаній, асортмент товарів постійно оновлюються, тож ви завжди зможете знайти щось
						нове для себе.
					</Typography>
				</ContentBox>
				<ContentBox>
					<Typography
						component='p'
						variant='h6'
						sx={{
							textAlign: "justify",
							marginInline: 5,
						}}
					>
						Ставайте частиною спільноти {process.env.REACT_APP_PROJECT_NAME}! Шукайте та пишіть цікаві
						<Link to='/news'>публікації</Link> на окремій сторінці новин та коментуйте їх. Дізнавайтеся про
						нові ігри та події, що відбуваються в ігровому світі.
					</Typography>
					<ContentImage
						src='https://res.cloudinary.com/dnqlgypji/image/upload/v1686749469/gigashop/static/pemj9gkj8qrbsenasgyr.jpg'
						alt='community_and_coop'
					/>
				</ContentBox>
				<Typography variant='h5' textAlign='center'>
					{process.env.REACT_APP_PROJECT_NAME} - це магазин, спільнота та інформаційний ресурс для всіх
					геймерів України! Долучайтесь до нас, і Good Game!
				</Typography>
			</Container>
		</Box>
	);
}
