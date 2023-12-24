import React from 'react'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserCard = ({children, group, border, handleClose, setShowFollowers, setShowFollowing, msg}) => {

    const { theme } = useSelector(state => state)

    const handleCloseAll = () => {
        if(handleClose) handleClose()
        if(setShowFollowers) setShowFollowers(false)
        if(setShowFollowing) setShowFollowing(false)
    }

    const showMsg = (group) => {
        return(
            <>
                <div style={{filter: theme ? 'invert(1)' : 'invert(0)'}}>
                    {group.text}
                </div>
                {
                    group.media.length > 0 && 
                    <div>
                        {group.media.length} <i className="fas fa-image" />
                    </div>
                }

            </>
        )
    }


    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <Link to={`/profile/${group._id}`} onClick={handleCloseAll}
                className="d-flex align-items-center">
                    
                    <Avatar src={group.avatar} size="big-avatar" />

                    <div className="ml-1" style={{transform: 'translateY(-2px)'}}>
                        <span className="d-block">{group.groupname}</span>
                        
                        <small style={{opacity: 0.7}}>
                            {
                                msg 
                                ? showMsg(group)
                                : ""
                            }
                        </small>
                    </div>
                </Link>
            </div>
            
            {children}
        </div>
    )
}

export default UserCard
