import { PlusIcon } from '@heroicons/react/outline';

const ColumnNew = (props) => {
  const { type } = props;
  return (
    <div className="flex items-center justify-center mt-5 mb-5 cursor-pointer">
      <span className="rounded-full p-1 bg-primary text-white">
        <PlusIcon className="w-6 h-6" />
      </span>
    </div>
  );
};

export default ColumnNew;
