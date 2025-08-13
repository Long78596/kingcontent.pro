import { useCallback, useEffect, useState } from 'react';
import ColumnTitle from './ColumnTitle';
import ColumnSearchCreated from './ColumnSearchCreated';
import ColumnContents from './ColumnContents';
import ColumnNew from './ColumnNew';

const Column = (props) => {
  const { totalContent, type, title, contents } = props.column;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (contents && contents.length > 0) setData(contents);
  }, [contents]);

  const onSearchCreatedContents = useCallback((value) => {
    if (value) {
      const filterData = contents.filter((item) => {
        if (item.content.toLowerCase().includes(value))
          return true;
        return false;
      });
      setData(filterData);
    } else { setData(contents); }
  },[contents]); 

  return (
    <>
      <div
        className={`w-96 min-w-editor flex-1 rounded border border-editor-${type} editor-column column-${type}`}
      >
        <ColumnTitle totalContent={totalContent} type={type} title={title} />
        <ColumnSearchCreated
          type={type}
          onSearchCreatedContents={onSearchCreatedContents}
        />        
        <ColumnContents contents={data} />
        <ColumnNew type={type} />
      </div>
    </>
  );
};

export default Column;