import {
	AspectRatio,
	Box,
	Button,
	HStack,
	Icon,
	Image,
	Link,
	Skeleton,
	Stack,
	Text,
	useBreakpointValue,
	useColorModeValue,
	Center,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	useToast,
} from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Rating } from './Rating';
import { FavouriteButton } from './FavouriteButton';
import {
	userAddFavorite,
	userGetFavorite,
	addToCart,
	userDeleteFavorite,
	userDelFavorite,
	userAddFavState,
	clearCart,
} from '../../../../redux/actions/index';
import { PriceTag } from './PriceTag';
import { Link as BuenLink } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const Book = (props) => {
	const { product, rootProps, isFav, setFavs } = props;

	const dispatch = useDispatch();
	const history = useHistory();

	const { userId, allFavourites, cart, books } = useSelector(
		(state) => state
	);
	const toast = useToast();
	const {
		title,
		authors,
		image,
		price,
		salePrice,
		rating,
		Comments,
		id,
		currency,
	} = product;

	const handleFavorite = (e, id) => {
		if (userId) {
			if (!isFav) {
				setFavs((favs) => {
					return {
						...favs,
						[id]: true,
					};
				});
				addFavorite(id);
			} else {
				setFavs((favs) => {
					return {
						...favs,
						[id]: false,
					};
				});
				deleteFavorite(id);
			}
		} else {
			history.push('/login');
			toast({
				title: 'You need to be logged in to add a book to Favourites',
				status: 'warning',
				isClosable: 'true',
				duration: '2000',
				position: 'top',
			});
		}
	};

	const addFavorite = (id) => {
		dispatch(userAddFavState(id));
		dispatch(userAddFavorite(userId, id));
	};

	const deleteFavorite = (id) => {
		dispatch(userDeleteFavorite(userId, id)); //userid, bookid
		dispatch(userDelFavorite(id));
	};

	const handleAddToCart = () => {
		dispatch(addToCart(id, userId));
		let flag = true;
		cart.map((e) => {
			if (e.id === id) flag = false;
		});
		if (flag) {
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Added to the cart successfully',
				showConfirmButton: false,
				timer: 900,
			});
		}
	};

	const handleQuickShop = () => {
		clearCart(userId);
		handleAddToCart(id);
	};

	const handleOnClick = () => {
		toast({
			title: 'You need to be logged in to Quick Shop',
			status: 'warning',
			isClosable: 'true',
			duration: '2000',
			position: 'top',
		});
	};

	return (
		<Stack
			maxW={'20vh'}
			spacing={useBreakpointValue({
				base: '4',
				md: '5',
				lg: '4',
			})}
			{...rootProps}>
			<Box position='relative'>
				<BuenLink to={`/book/${id}`}>
					<Link>
						<Image
							src={image}
							alt={title}
							draggable='false'
							fallback={<Skeleton />}
							boxSize={{
								base: 'min-content',
								md: 'md',
								lg: '60',
							}}
							borderRadius={useBreakpointValue({
								base: 'md',
								md: 'xl',
							})}
						/>
					</Link>
				</BuenLink>
				<FavouriteButton
					position='absolute'
					top='4'
					right='4'
					aria-label={`Add ${title} to your favourites`}
					id={id}
					onClick={(e) => handleFavorite(e, id)}
					userId={userId}
					allFavourites={allFavourites}
					isFav={isFav}
				/>
			</Box>
			<Stack>
				<Stack spacing='2'>
					<BuenLink to={`/book/${id}`}>
						<Link>
							<Text
								h='3rem'
								fontWeight='bold'
								color={useColorModeValue(
									'gray.700',
									'gray.400'
								)}>
								{title.length < 25
									? title
									: title.slice(0, 22) + '...'}
							</Text>
						</Link>
					</BuenLink>
					<Text
						h='2rem'
						mt={'16px'}
						fontWeight='medium'
						color={useColorModeValue('gray.700', 'gray.400')}>
						{authors}
					</Text>
					<PriceTag
						price={price}
						salePrice={salePrice}
						currency={currency}
					/>
				</Stack>
				<HStack display='flex'>
					<Rating defaultValue={rating} size='sm' />
					<HStack>
						<Text
							fontSize='sm'
							paddingLeft='16px'
							color={useColorModeValue('gray.600', 'gray.400')}>
							{Comments?.length}
						</Text>
						<Icon as={FaCommentDots} color='blue.500' />
					</HStack>
				</HStack>
			</Stack>
			<Stack align='center'>
				<Button colorScheme='blue' onClick={handleAddToCart} w='100%'>
					Add to cart
				</Button>
				{userId ? (
					<BuenLink to='/pay'>
						<Link
							textDecoration='underline'
							fontWeight='medium'
							color={useColorModeValue('gray.600', 'gray.400')}
							onClick={handleQuickShop}>
							Quick shop
						</Link>
					</BuenLink>
				) : (
					<BuenLink to='/login'>
						<Link
							textDecoration='underline'
							fontWeight='medium'
							onClick={() => handleOnClick()}
							color={useColorModeValue('gray.600', 'gray.400')}>
							Quick shop
						</Link>
					</BuenLink>
				)}
			</Stack>
		</Stack>
	);
};
