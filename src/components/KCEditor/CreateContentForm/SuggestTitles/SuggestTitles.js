import { useCallback } from 'react';
import { connect } from 'react-redux';
import { getContentSuggestions } from '../../../../store/actions/editor/createContentActions';

const listTitles = [
  {
    id: 1,
    color: 'manual',
    number: '01',
    text: 'Tạo tiêu đề',
    description_title: 'Bạn đang ở bước 1: Tạo tiêu đề',
    description_text:
      'Một tiêu đề xuất sắc quyết định tới 90% khả năng xem tiếp content của bạn. Hãy thể hiện một tiêu đề thật hoàn hảo nhé!',
    keywords: [],
  },
  {
    id: 2,
    color: 'formular',
    number: '02',
    text: 'Lợi ích sản phẩm',
    description_title: 'Bạn đang ở bước 2: Trình bày lợi ích sản phẩm',
    description_text:
      'Khách hàng chỉ mua những sản phẩm đem lại lợi ích hoặc thoả mãn nhu cầu của họ. Vì vậy hãy tập trung mô tả những thế mạnh nổi bật nhất trong sản phẩm của bạn!',
    keywords: ['giá', 'đt', '0', 'tại', 'http'],
  },
  {
    id: 3,
    color: 'feedback',
    number: '03',
    text: 'Cam kết mạnh',
    description_title: 'Bạn đang ở bước 3: Cam kết mạnh',
    description_text:
      'Khách hàng chỉ rút hầu bao khi họ tin tưởng bạn. Vì vậy hãy cam kết mạnh những lợi ích về sản phẩm, dịch vụ bạn mô tả tại bước 2, có được niềm tin của khách chính là có doanh số!',
    keywords: ['cam kết', 'hoàn tiền', 'đảm bảo'],
  },
  {
    id: 4,
    color: 'special',
    number: '04',
    text: 'Chiêu trò khuyến mãi',
    description_title: 'Bạn đang ở bước 4: Chiêu trò khuyến mãi',
    description_text:
      'Hãy tạo ra một lý do khuyến mãi đủ sức thuyết phục để khách hàng tin rằng họ đang thực sự có cơ hội sở hữu một món hời khi mua sản phẩm!',
    keywords: [
      'khuyến mãi',
      'giảm giá',
      'nay chỉ còn',
      'tặng ngay',
      'tặng kèm',
      'quà tặng',
      'giá chỉ',
    ],
  },
  {
    id: 5,
    color: 'trend',
    number: '05',
    text: 'Kêu gọi hành động',
    description_title: 'Bạn đang ở bước 5: Kêu gọi hành động',
    description_text:
      'Đừng để khách hàng có thêm bất kì giây phút chần chừ nào để quyết định mua hàng. Mỗi ngày trôi qua sẽ khiến tỷ lệ chốt đơn hàng giảm đi rõ rệt!',
    keywords: ['inbox', 'liên hệ', 'địa chỉ', 'nhanh tay', 'chỉ duy nhất'],
  },
];

const SuggestTitles = (props) => {
  const { selectedCatId, getContentSuggestions, setIsSearch } = props;

  const handleOnClickTitle = useCallback(
    (title) => {
      setIsSearch(true);
      const { id, keywords } = title;
      // will change to selectedCatId
      const currentCatId = '60ee76549d46428815950d39';
      switch (id) {
        case 1:
          break;

        case 2:
          getContentSuggestions(currentCatId, keywords, 1, true);
          break;

        default:
          getContentSuggestions(currentCatId, keywords, 1);
          break;
      }
    },
    [selectedCatId, getContentSuggestions]
  );

  return (
    <div className="suggestion-steps flex whitespace-nowrap flex-nowrap w-full gap-1">
      {listTitles.map((title, index) => {
        const { color, number, text, description_text, description_title } =
          title;
        const cls = index === 4 || index === 3 ? 'right-0' : 'left-0';
        return (
          <div
            key={index}
            className={`step relative cursor-pointer rounded-md flex flex-1 p-1 bg-editor-${color}`}
            onClick={() => handleOnClickTitle(title)}
          >
            <span className="number rounded-full bg-white text-black px-2 py-1">
              {number}
            </span>
            <span className="text text-white p-1">{text}</span>
            <div
              className={`desciption invisible z-9999 step-hover:block transition-all ease-out absolute top-full p-3 rounded-lg w-80 mt-0.5 bg-opacity-80 text-white bg-editor-${color} ${cls}`}
            >
              <p className="whitespace-pre-line font-bold text-base mb-2">
                {description_title}
              </p>
              <p className="whitespace-pre-line">{description_text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCatId: state.editor.selectedCatId,
  };
};

export default connect(mapStateToProps, {
  getContentSuggestions,
})(SuggestTitles);
