import Client from "../Client"
import { API_USER_LIKED_CONTENT } from "../configs"

export const ContentService = {
    getAllContent(){
        return Client.get(API_USER_LIKED_CONTENT)
    }
}