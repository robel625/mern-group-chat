import { GLOBALTYPES, DeleteData } from './globalTypes';
import { postDataAPI, getDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';

export const GROUP_TYPES = {
  ADD_GROUP: 'ADD_GROUP',
  ADD_GROUPMES: 'ADD_GROUPMES',
  GET_GROUPS: 'GET_GROUPS',
  GET_GROUPMESSAGES: 'GET_GROUPMESSAGES',
  UPDATE_GROUPMESSAGES: 'UPDATE_GROUPMESSAGES',
  DELETE_GROUPMESSAGES: 'DELETE_GROUPMESSAGES',
};

export const createGroup = ({ groupData, avatar, auth }) => async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      let media;
      if (avatar) media = await imageUpload([avatar]);

      const res = await postDataAPI( 'group',
        {
          ...groupData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );
      dispatch({ type: GROUP_TYPES.ADD_GROUP, payload: { message: res.data.msg } });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg },
      });
    }
  };

export const addGroup1 = ({ selectedgroup, groupmessage }) => (dispatch) => {
    console.log(selectedgroup, groupmessage)
    if(groupmessage.groups.every(item => item._id !== selectedgroup._id)){
      dispatch({type: GROUP_TYPES.ADD_GROUP, payload: {...selectedgroup, text: '', media:  []}})
    }

  };

export const addGroupmes = ({msg, auth, socket, id}) => async (dispatch) =>{
   console.log("addGroupmes",msg)
   dispatch({type: GROUP_TYPES.ADD_GROUPMES, payload: msg})
   
   const { _id, avatar, fullname, username } = auth.user

    const payload = {
      content: {...msg , sender: { _id, avatar, fullname, username } },
      to: id,
      sender: { _id, avatar, fullname, username },
      chatName: id,
      isChannel: true
    };
    socket.emit("send message", payload);

   try {
    const res = await postDataAPI( 'groupmes', msg, auth.token );
   } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg },
      });
    } 
}

export const getGroupConversations = ({auth, page = 1}) => async (dispatch) => {
  try {
      const res = await getDataAPI(`groupconversations?limit=${page * 9}`, auth.token)
      console.log(res)
      let newArr = [];
      res.data.groups.forEach(item => {
                  newArr.push({...item, text: item.text, media: item.media })
              }
      )

      console.log(newArr)

      dispatch({
          type: GROUP_TYPES.GET_GROUPS, 
          payload: {newArr, result: res.data.result}
      })

  } catch (err) {
      dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
  }
}

export const getGroupMessages = ({auth, id, page = 1}) => async (dispatch) => {
  try {
      const res = await getDataAPI(`groupmessage/${id}?limit=${page * 9}`, auth.token)
      
      const newData = {...res.data, groupmessages: res.data.groupmessages.reverse()}

     dispatch({type: GROUP_TYPES.GET_GROUPMESSAGES, payload: { ...newData, _id: id, page }})

  } catch (err) {
      dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
  }
}

export const loadMoreGroupMessages = ({auth, id, page = 1}) => async (dispatch) => {
  try {
      const res = await getDataAPI(`groupmessage/${id}?limit=${page * 9}`, auth.token)
      
      const newData = {...res.data, groupmessages: res.data.groupmessages.reverse()}

     dispatch({type: GROUP_TYPES.UPDATE_GROUPMESSAGES, payload: { ...newData, _id: id, page }})

  } catch (err) {
      dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
  }
}

export const deleteGroupMessages = ({msg, data, auth}) => async (dispatch) => {
  const newData = DeleteData(data, msg._id)
  dispatch({type: GROUP_TYPES.DELETE_GROUPMESSAGES, payload: {newData, _id: msg.recipient}})
  try {
      await deleteDataAPI(`groupmessage/${msg._id}`, auth.token)
  } catch (err) {
      dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
  }
}





