import Client from '../Client';
import { API_SPECIAL_HASHTAG } from '../configs';

export const SpecialService = {
    getAllTag() {
        return Client.get(
            `${API_SPECIAL_HASHTAG}`
        );
    },
    creatTag(data){
        return Client.post(
            `${API_SPECIAL_HASHTAG}` , data
        );
    },
    editTag(id , data){
        return Client.put(
            `${API_SPECIAL_HASHTAG}/${id}` , data
        );
    },
    deleteTag(id , data){
        return Client.delete(
            `${API_SPECIAL_HASHTAG}/${id}` , data
        );
    }
}