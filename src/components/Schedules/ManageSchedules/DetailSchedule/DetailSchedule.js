import { FaAngleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { manageGetScheduleContents, manageSetCurrentSchedule } from "../../../../store/actions/Schedules";
import { useEffect, useState } from "react";
import ListContents from "./ListContents";
import LoadingApp from "../../../LoadingApp";
import SearchBox from "./SeachBox";
import ScheduleActions from "./ScheduleActions";

const DetailSchedule = (props) => {
  const {
    manageCurrentSchedule = null,
    manageScheduleContents = null,
    manageIsLoadingContents = false,
  } = useSelector((state) => state.schedules);

  const [filteredContents, setFilteredContents] = useState([]);
  const [listSelected, setListSelected] = useState([]);
  
  const dispatch = useDispatch();

  const handleClickGoBack = () => {
    dispatch(manageSetCurrentSchedule(null));
  }
  
  useEffect(() => {
    dispatch(manageGetScheduleContents(manageCurrentSchedule?.id));
  }, [manageCurrentSchedule, dispatch]);

  useEffect(() => {
    if(manageScheduleContents){
      setFilteredContents(manageScheduleContents);
    }
  }, [manageScheduleContents]);

  return (
    <div className="detailSchedule">
      <div className="flex gap-3">
        <div className="flex gap-2 items-center">
          <button
            className="flex gap-1 border-2 rounded-md p-2"
            onClick={(e) => {
              handleClickGoBack();
            }}
          >
            <FaAngleLeft fontSize={20} />
            <span>Quay lại</span>
          </button>
        </div>
        {listSelected && listSelected.length > 0 && <ScheduleActions listSelected={listSelected} contents={filteredContents} />}
        <SearchBox 
          contents={manageScheduleContents}
          filteredContents={filteredContents}
          setFilteredContents={setFilteredContents}
          listSelected={listSelected}
          setListSelected={setListSelected}
        />
      </div>
      <div className="mt-2">
        {manageIsLoadingContents ? (
          <div className="flex justify-center items-center w-full">
            <LoadingApp />
          </div>
        ) : (
          <ListContents
            contents={filteredContents}
            listSelected={listSelected}
            setListSelected={setListSelected}
          />
        )}
      </div>
    </div>
  );
}

export default DetailSchedule;