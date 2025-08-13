import { connect } from 'react-redux';

import { changeStateSelectedCat } from '../../../../store/actions/Schedules';

const CatItem = (props) => {
  const { category, changeStateSelectedCat, selectedCat } = props;
  const { id, name, image } = category;
  const baseURL = process.env.API_URL;
  const catThumbnail = image
    ? image.url
    : '/uploads/file_6257c2001ccf1_b0541a0021.jpg';
  const classSelected =
    selectedCat && id === selectedCat.id ? 'bg-primary text-white' : '';

  return (
    <div
      className="bg-white shadow-zenius rounded-zenius overflow-hidden p-3 cursor-pointer group shadow-lg mb-5"
      onClick={() => changeStateSelectedCat(category)}
    >
      <div className="rounded-zenius overflow-hidden mb-3 relative">
        <img
          className="object-cover h-40 w-full opacity-80 group-hover:transform group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 ease-linear"
          src={baseURL + catThumbnail}
        />
        <div className="text-center font-bold  text-sm text-gray-100 origin-center group-hover:text-white transition-all p-0.5 absolute z-10 top-0.5 w-full bg-darkBgOpacityClr">
          <h4>{name}</h4>
        </div>
      </div>
      <div className="text-center w-full">
        <button
          className={`w-10/12 self-center items-center inline-block rounded-md bg-gray-200 border text-center p-2 group-hover:bg-primary group-hover:text-white ${classSelected}`}
        >
          Chọn kịch bản
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCat: state.schedules.selectedCat,
  };
};

export default connect(mapStateToProps, { changeStateSelectedCat })(CatItem);
