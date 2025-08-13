import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SingleCategory from './SingleCategory';
import CategoriesTitle from './CategoriesTitle';
import Filtering from './Filtering';
import Summary from './Summary';
import CategoriesChart from '../../components/Interactions/Chart';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { getChildCategories } from '../../store/actions/categories';
import {
  getTotalContents,
  getTotalFanpages,
} from '../../store/actions/Contents/contentActions';
import { shuffleArray } from '../../utils/utilityFunc';
import { DEFAULT_TAKE_CARE_CAT } from '../../configs';

const Categories = () => {
  const dispatch = useDispatch();

  const {
    childCategories,
    totalFanpages,
    totalContents,
  } = useSelector((state) => state.categories);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [cateType, setCateType] = useState('all');

  const [chartData, setChartData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(childCategories);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataSets, setChartDataSets] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handlePopupToggle = (categoryId) => {
    setActiveCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
  };

  useEffect(() => {
    dispatch(getChildCategories());
    dispatch(getTotalFanpages());
    dispatch(getTotalContents());
  }, [dispatch]);

  useEffect(() => {
    if (childCategories) {
      let filteredCats = [...childCategories];
      if (cateType !== 'all') {
        if (cateType === 'takeCare') {
          // search all categories that have parent category is TakeCare
          filteredCats = childCategories.reduce((acc, cat) => {
            if (parseInt(cat?.parent_id) === DEFAULT_TAKE_CARE_CAT) {
              acc.push(cat);
              // get child category from current category
              const childCats = childCategories.filter(
                (item) => item.parent_id === cat.cate_id
              );
              if (childCats?.length) {
                acc.push(...childCats);
              }
            }
            return acc;
          }, []);
        } else {
          // search all categories that have parent category is not TakeCare
          filteredCats = childCategories.reduce((acc, cat) => {
            if (parseInt(cat?.parent_id) === parseInt(cateType)) {
              acc.push(cat);
              if (cat?.childs?.length) {
                acc.push(...cat.childs);
              }
            }
            return acc;
          }, []);
        }
      }
      if (filterKeyword) {
        filteredCats = filteredCats.reduce((acc, cat) => {
          let { cate_name = '', parent = null } = cat;
          if (cate_name.toLowerCase().includes(filterKeyword)) {
            acc.push(cat);
            if (parent) {
              // get parent category from child childCategories
              const parentCat = [...childCategories].find(
                (item) => item.cate_id === parent.cate_id
              );
              if (parentCat && !acc.includes(parentCat)) {
                acc.push(parentCat);
              }
            }
          }
          return acc;
        }, []);
        setFilteredCategories(filteredCats);
      }
      setFilteredCategories(filteredCats);
    } else {
      setFilteredCategories([]);
    }
  }, [childCategories, filterKeyword, cateType]);

  const onFilterCategories = (evt) => {
    const kw = evt.target.value;
    setFilterKeyword(kw);
  };

  useEffect(() => {
    if (childCategories && childCategories.length) {
      const shuffleCategories = shuffleArray(childCategories);
      // get first 14 items
      const sliceCategories = shuffleCategories.slice(0, 14);
      setCategoriesData(sliceCategories);
    }
  }, [childCategories]);

  useEffect(() => {
    if (categoriesData && categoriesData.length) {
      let newLabels = [];
      let newDatasets = [];
      categoriesData.forEach((item) => {
        let { name, countContents } = item;
        if (countContents == 0)
          countContents = Math.floor(Math.random() * 100000);
        newLabels.push(name);
        newDatasets.push(countContents);
      });
      setChartLabels(newLabels);
      setChartDataSets(newDatasets);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (
      chartLabels &&
      chartLabels.length &&
      chartDataSets &&
      chartDataSets.length
    ) {
      const newData = {
        labels: chartLabels,
        datasets: [
          {
            label: '',
            data: chartDataSets,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: '#1e88e5',
          },
        ],
      };
      setChartData(newData);
    }
  }, [chartLabels, chartDataSets]);

  return (
    <div className="categories">
      <CategoriesTitle
        totalContents={totalContents}
        totalFanpages={totalFanpages}
      />

      {chartData && false && <CategoriesChart chartData={chartData} />}

      <Summary totalContents={totalContents} totalFanpages={totalFanpages} />

      <Filtering
        onFilterCategories={onFilterCategories}
        keyword={filterKeyword}
        cateType={cateType}
        setCateType={setCateType}
      />

      <div className="pb-5">
        <div className="w-full grid grid-cols-3 gap-4 pt-2">
          {filteredCategories.length > 0 &&
            filteredCategories.map((category, i) => {
              return (
                <Fragment key={i}>
                  <SingleCategory
                    category={category}
                    isActive={activeCategoryId === category.cate_id}
                    onTogglePopup={() => handlePopupToggle(category.cate_id)}
                  />
                </Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
