import { memo } from 'react';
import CountUp from 'react-countup';
import { numberWithCommas } from '../../utils/utilityFunc';

const Summary = (props) => {
  const {
    totalContents = Math.floor(Math.random() * 100000),
    totalFanpages = Math.floor(Math.random() * 100000),
    totalCollections = Math.floor(Math.random() * 100000),
    totalSuggestions = Math.floor(Math.random() * 100000),
  } = props;

  return (
    <div className="categoriesSummary grid grid-cols-4 gap-2 mb-5">
      <div className="totalContents bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group">
        <div className="text-center border-b">
          <CountUp
            start={0}
            end={totalContents}
            duration={2}
            separator="."
            decimal="."
            className="text-red-500 text-5xl mb-1"
          />
          <div className="uppercase font-bold p-2 text-base">Mẫu Contents</div>
        </div>
        <div className="text-left p-2">
          <span>Cập nhật 24h qua: </span>
          <span className="text-red-600 text-base">
            +{numberWithCommas(Math.floor(Math.random() * 10000))}
          </span>
        </div>
      </div>
      <div className="totalContents bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group">
        <div className="text-center border-b">
          <CountUp
            start={0}
            end={totalFanpages}
            duration={2}
            separator="."
            decimal="."
            className="text-blue-700 text-5xl mb-1"
          />
          <div className="uppercase font-bold p-2 text-base">Fanpages</div>
        </div>
        <div className="text-left p-2">
          <span>Cập nhật 24h qua: </span>
          <span className="text-red-600 text-base">
            +{numberWithCommas(Math.floor(Math.random() * 1000))}
          </span>
        </div>
      </div>
      <div className="totalContents bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group">
        <div className="text-center border-b">
          <CountUp
            start={0}
            end={totalCollections}
            duration={2}
            separator="."
            decimal="."
            className="text-editor-formular text-5xl mb-1"
          />
          <div className="uppercase font-bold p-2 text-base">Bộ sưu tập</div>
        </div>
        <div className="text-left p-2">
          <span>Cập nhật 24h qua: </span>
          <span className="text-red-600 text-base">
            +{numberWithCommas(Math.floor(Math.random() * 1000))}
          </span>
        </div>
      </div>
      <div className="totalContents bg-white shadow-smBlackShadow rounded-md overflow-hidden p-3 cursor-pointer group">
        <div className="text-center border-b">
          <CountUp
            start={0}
            end={totalSuggestions}
            duration={2}
            separator="."
            decimal="."
            className="text-green-500 text-5xl mb-1"
          />
          <div className="uppercase font-bold p-2 text-base">
            Kịch bản hệ thống
          </div>
        </div>
        <div className="text-left p-2">
          <span>Cập nhật 24h qua: </span>
          <span className="text-red-600 text-base">
            +{numberWithCommas(Math.floor(Math.random() * 1000))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Summary);
