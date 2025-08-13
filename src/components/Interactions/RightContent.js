import ByItemsSelect from './Select';
import { FiTrendingUp } from 'react-icons/fi';
import styled from 'styled-components';
import { getFanpageAvatar } from '../../helpers';
const ImageStyled = styled.div`
  img#img-trendding {
    width: 50px !important;
  }
`;
const RightContent = (props) => {
  const {
    onCategoriesSelected,
    childCategories,
    fanpages = [],
    selectedCategory,
  } = props;

  const onClickFanpage = (feed_id) => {
    const cateLink = `/danh-muc/${selectedCategory.cate_url}/${selectedCategory.cate_id}?fb_id=${feed_id}`;
    window.open(cateLink, '_self');
  };

  return (
    <div>
      <ByItemsSelect
        childCategories={childCategories}
        onCategoriesSelected={onCategoriesSelected}
        selectedCategory={selectedCategory}
      />
      <div className="mt-5 rounded-md p-3 bg-white shadow-smBlackShadow">
        <h2 className="text-base font-bold">Top Fanpage</h2>
        <div className="px-2">
          {fanpages.length > 0 &&
            fanpages.map((fanpage, index) => (
              <div className="mt-5 mb-5 border-b dashed" key={index}>
                <div
                  className="cursor-pointer"
                  onClick={() => onClickFanpage(fanpage?.feed_id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center">
                      <img
                        id="img-trendding"
                        className="w-16 h-16 rounded-md"
                        src={fanpage?.user_pic}
                      />
                      <p className="font-bold ml-2 text-left">
                        {fanpage?.user_screenname} (~ {fanpage?.posts_count} bài
                        viết)
                      </p>
                    </div>
                    <div className="hidden">
                      {fanpage?.posts_count > 0 && (
                        <div className="flex items-center gap-1">
                          <FiTrendingUp size={25} color="#16FF00" />
                          <span>{fanpage?.posts_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br className="clear-both" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightContent;
