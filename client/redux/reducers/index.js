// import actions types
// import { GET_ALL_BOOKS } from '../actions/actionTypes'
import { GET_DETAILS } from '../actions/actionTypes'
// initial states

const InitialState = {
	books: [],
	details: {}
};

const rootReducer = (state = InitialState, action) => {
	switch (action.type) {
		// case GET_ALL_BOOKS: {
		//     return {
		//         ...state,
		//         books: action.payload
		//     }
		// }

		case GET_DETAILS: {
			return {
				...state,
				details: action.payload
			}
			
		}

		default: {
			return state;
		}
	}
};

export default rootReducer
