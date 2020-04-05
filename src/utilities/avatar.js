import emptyAvatar from '../images/empty-avatar-png-15-transparent.png';
import {s3} from '../constants/api'
export default function avatar(auth_id, user_id, auth_avatar, user_avatar) {
    // Check if avatar is for the logged in user and and that it exists else return the empty avatar
    auth_avatar = encodeKey(auth_avatar);
    user_avatar = encodeKey(user_avatar);
    let key = user_id === auth_id && auth_avatar? `${s3}/${auth_avatar}` : ( user_avatar? `${s3}/${user_avatar}` : emptyAvatar);

    return key
}

// encode the key in case it contains special characters
// (example karl+1@mail.com)
export function encodeKey(key) {
    if(key) {
        key = key.split('/').map((el) => {
            return encodeURIComponent(el)
        }).join('/');
    }
    return key;
};