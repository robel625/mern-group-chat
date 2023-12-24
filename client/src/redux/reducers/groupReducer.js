import { GROUP_TYPES } from '../actions/groupAction';
import { EditData, DeleteData } from '../actions/globalTypes'

const initialState = {
  groups: [],
  resultGroups: 0,
  data: [],
  firstLoad: false,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case GROUP_TYPES.ADD_GROUP:
      //if (state.groups.every((item) => item._id !== action.payload._id)) {
      return {
        ...state,
        groups: [action.payload, ...state.groups],
      };
    case GROUP_TYPES.ADD_GROUPMES:
        return {
          ...state,
          data: state.data.map(item => 
            item._id === action.payload.recipient 
            ? {
                ...item,
                groupmessages: [...item.groupmessages, action.payload],
                result: item.result + 1
            }
            : item
        ),
          groups:state.groups.map(group =>
                  group._id === action.payload.recipient
                  ?{...group, text: action.payload.text, media: action.payload.media}
                  : group
                  )
        };
    case GROUP_TYPES.GET_GROUPS:
          return {
               ...state,
               groups: action.payload.newArr,
               resultGroups: action.payload.result
          };
          
    case GROUP_TYPES.GET_GROUPMESSAGES:
            return {
                 ...state,
                 data: [...state.data, action.payload]
            };

    case GROUP_TYPES.UPDATE_GROUPMESSAGES:
       console.log("action.payload",action.payload)
              return {
                   ...state,
                   data: EditData(state.data, action.payload._id, action.payload)
              };
    
    case GROUP_TYPES.DELETE_GROUPMESSAGES:
                return {
                    ...state,
                    data: state.data.map(item => 
                        item._id === action.payload._id
                        ? {...item, groupmessages: action.payload.newData}
                        : item
                    )
                };

    default:
      return state;
  }
};

export default groupReducer;
