import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkImage } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { createGroup } from '../../redux/actions/groupAction';

const AddGroup = ({ setAddGroup }) => {
  const initState = {
    groupname: '',
    story: '',
  };
  const [groupData, setGroupData] = useState(initState);
  const { groupname, story } = groupData;

  const [avatar, setAvatar] = useState('');

  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createGroup({ groupData, avatar, auth }));
    console.log('groupData', groupData);
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err },
      });

    setAvatar(file);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  return (
    <div className="edit_profile">
      <button
        className="btn btn-danger btn_close"
        onClick={() => setAddGroup(false)}
      >
        Close
      </button>

      <form onSubmit={handleSubmit}>
        <div className="info_avatar">
          <img
            src={
              avatar
                ? URL.createObjectURL(avatar)
                : `/public/images/${auth.user.avatar}`
            }
            alt="avatar"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
          />
          <span>
            <i className="fas fa-camera" />
            <p>Change</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              onChange={changeAvatar}
            />
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="groupname">Group Name</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="groupname"
              name="groupname"
              value={groupname}
              onChange={handleInput}
            />
            <small
              className="text-danger position-absolute"
              style={{
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
              }}
            >
              {groupname.length}/25
            </small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="story">Story</label>
          <textarea
            name="story"
            value={story}
            cols="30"
            rows="4"
            className="form-control"
            onChange={handleInput}
          />

          <small className="text-danger d-block text-right">
            {story.length}/200
          </small>
        </div>

        <button className="btn btn-info w-100" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddGroup;
