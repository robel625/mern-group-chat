import React, { useState, useEffect, useRef } from 'react';
import UserCard from './UserCard';
import AddGroup from './AddGroup';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useHistory, useParams } from 'react-router-dom';
import {
  MESS_TYPES,
  getConversations,
} from '../../redux/actions/messageAction';
import {  addGroup1, getGroupConversations } from '../../redux/actions/groupAction';

const LeftSide = () => {
  const { auth, groupmessage , online } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [searchGroups, setSearchGroups] = useState([]);

  const [addGroup, setAddGroup] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSearchGroups([]);

    try {
      const res = await getDataAPI(
        `groupsearch?groupname=${search}`,
        auth.token
      );
      setSearchGroups(res.data.groups);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  const handleAddGroup = (selectedgroup) => {
    setSearch('');
    setSearchGroups([]);
    dispatch(addGroup1({ selectedgroup, groupmessage }))
    // dispatch({
    //   type: GROUP_TYPES.ADD_GROUP,
    //   payload: { ...selectedgroup, text: '', media: [] },
    // });
    // dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    console.log("add group repeat")
    return history.push(`/groupmessage/${selectedgroup._id}`);
  };


  useEffect(() => {
    if (groupmessage.firstLoad) return;
    dispatch(getGroupConversations({ auth }));
  }, [dispatch, auth, groupmessage.firstLoad]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  // useEffect(() => {
  //   if (message.resultUsers >= (page - 1) * 9 && page > 1) {
  //     dispatch(getConversations({ auth, page }));
  //   }
  // }, [message.resultUsers, page, auth, dispatch]);

  // // Check User Online - Offline
  // useEffect(() => {
  //   if (message.firstLoad) {
  //     dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
  //   }
  // }, [online, message.firstLoad, dispatch]);

  return (
    <>
      <button
        className="btn btn-outline-info"
        onClick={() => setAddGroup(true)}
      >
        Add Group
      </button>
      {addGroup && <AddGroup setAddGroup={setAddGroup} />}
      <form className="gmessage_header" onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          placeholder="Enter to Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit" style={{ display: 'none' }}>
          Search
        </button>
      </form>

      <div className="gmessage_chat_list">
        {searchGroups.length !== 0 ? (
          <>
            {searchGroups.map((selectedgroup) => (
              <div
                key={selectedgroup._id}
                className={`gmessage_user`}
                onClick={() => handleAddGroup(selectedgroup)}
              >
                <UserCard group={selectedgroup} />
              </div>
            ))}
          </>
        ) : (
          <>
            {groupmessage.groups.map((selectedgroup) => (
              <div
                key={selectedgroup._id}
                className={`gmessage_user `}
                onClick={() => handleAddGroup(selectedgroup)}
              >
                <UserCard group={selectedgroup} msg={true}></UserCard>
              </div>
            ))}
          </>
        )}

        <button ref={pageEnd} style={{ opacity: 0 }}>
          Load More
        </button>
      </div>
    </>
  );
};

export default LeftSide;
