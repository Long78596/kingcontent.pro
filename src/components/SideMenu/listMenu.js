import MenuIconList from '../../assets/images/icon/main-menu/menu-icon-list.png';
import MenuIconAdd from '../../assets/images/icon/main-menu/menu-icon-add.png';
// import MenuIconCreate from '../../assets/images/icon/main-menu/menu-icon-create.png';
import MenuIconSmile from '../../assets/images/icon/main-menu/menu-icon-smile.png';
import MenuIconAds from '../../assets/images/icon/main-menu/menu-icon-advertise.png';
import MenuIconStat from '../../assets/images/icon/main-menu/menu-icon-stat.png';
import MenuIconCalendar from '../../assets/images/icon/main-menu/menu-icon-calendar.png';
import MenuIconFavorite from '../../assets/images/icon/main-menu/menu-icon-favorite.png';
import MenuIconPros from '../../assets/images/icon/main-menu/menu-icon-pros-and-cons.png';
// import MenuIconPicture from '../../assets/images/icon/main-menu/menu-icon-picture.png';
// import MenuIconTeam from '../../assets/images/icon/main-menu/menu-icon-team.png';
// import MenuIconDollar from '../../assets/images/icon/main-menu/menu-icon-dollar.png';
import MenuIconTikTok from '../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import MenuIconThreads from '../../assets/images/icon/main-menu/threads.png';
import MenuIconInstagram from '../../assets/images/icon/main-menu/menu-icon-instagram.png';
import StarIcon from '../../assets/images/icon/main-menu/star.png';
import VideoGenIcon from '../../assets/images/icon/main-menu/menu-icon-videogen.png';
import videoEditorIcon from '../../assets/images/icon/video-editor.png';

export const mainMenu = [
  {
    link: '/bang-xep-hang',
    icon: StarIcon,
    iconClr: 'bg-pink-500',
    name: 'Bảng xếp hạng',
    blank: true,
  },
  {
    link: '/danh-muc-content',
    icon: MenuIconList,
    iconClr: 'bg-pink-500',
    name: 'Danh mục Content',
  },
  {
    link: '/tao-content',
    icon: MenuIconAdd,
    iconClr: 'bg-pink-500',
    name: 'Tạo content mới',
  },
  {
    link: '/text-to-video',
    icon: VideoGenIcon,
    iconClr: 'bg-green-700',
    name: 'AI - Text to Video',
  },
  {
    link: '/video-editor',
    icon: videoEditorIcon,
    iconClr: 'bg-green-700',
    name: 'Video Editor',
  },
  {
    link: '/content-da-thich',
    icon: MenuIconPros,
    iconClr: 'bg-yellow-600',
    name: 'Content đã thích',
  },
  {
    link: '/nhieu-tuong-tac',
    icon: MenuIconSmile,
    iconClr: 'bg-indigo-500',
    name: 'Nhiều tương tác',
  },
  {
    link: '/dang-chay-ads',
    icon: MenuIconAds,
    iconClr: 'bg-pink-500',
    name: 'Đang chạy Ads',
  },
  {
    link: '/dang-thinh-hanh',
    icon: MenuIconStat,
    iconClr: 'bg-indigo-500',
    name: 'Đang thịnh hành',
  },
  {
    id: 'tiktok',
    link: '/quan-ly-douyin',
    icon: MenuIconTikTok,
    iconClr: 'bg-green-700',
    name: 'Quản lý Douyin',
  },
  {
    id: 'tiktok',
    link: '/quan-ly-tiktok',
    icon: MenuIconTikTok,
    iconClr: 'bg-green-700',
    name: 'Quản lý Tiktok',
  },
  {
    id: 'threads',
    link: '/quan-ly-threads',
    icon: MenuIconThreads,
    iconClr: 'bg-green-700',
    name: 'Quản lý Threads',
  },
  {
    id: 'instagram',
    link: '/quan-ly-instagram',
    icon: MenuIconInstagram,
    iconClr: 'bg-green-700',
    name: 'Instagram',
  },
  {
    link: '/lich-dang-bai',
    icon: MenuIconCalendar,
    iconClr: 'bg-green-500',
    name: 'Lên lịch đăng bài',
  },
  {
    link: '/theo-doi-dac-biet',
    icon: MenuIconFavorite,
    iconClr: 'bg-green-500',
    name: 'Theo dõi đặc biệt',
  },
  /*{
    link: '/bo-suu-tap-content',
    icon: MenuIconPros,
    iconClr: 'bg-green-700',
    name: 'Bộ sưu tập',
  },
  {
    link: '/chinh-sua-anh',
    icon: MenuIconPicture,
    iconClr: 'bg-green-700',
    name: 'Chỉnh sửa ảnh',
  },
  {
    link: '/lam-viec-nhom',
    icon: MenuIconTeam,
    iconClr: 'bg-red-500 ',
    name: 'Làm việc nhóm',
  },
  {
    link: '/kiem-tien',
    icon: MenuIconDollar,
    iconClr: 'bg-green-700',
    name: 'Kiếm tiền',
  },*/
  {
    link: '/danh-sach-page',
    icon: MenuIconList,
    iconClr: 'bg-green-700',
    name: 'Danh sách fanpage',
  },
];
