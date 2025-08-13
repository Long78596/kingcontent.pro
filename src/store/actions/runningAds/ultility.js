import { isArrayEmpty } from "../../../configs"

export const getObjectTemplateCard = (item) =>{
   return {
       ...item,
        "post_header": item?.page_name,
        "user_screenname": item?.page_name,
        "user_link": `https://www.facebook.com/${item.page_id}`,
        image_url : item?.page_avatar,
        media_type : !isArrayEmpty(item.images) ? 'image' : 'video'
    }
}