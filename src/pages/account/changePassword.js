import React from 'react';
import { useState } from 'react';
import { userServices } from '../../services/users';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { OK } from '../../configs';

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });
  const [type, setType] = useState('password');
  const handleChnageType = () => {
    if (type === 'password') setType('text');
    else setType('password');
  };
  const handleChangepassword = async (data) => {
    confirmAlert({
      title: 'Thay đổi mật khẩu',
      message: (
        <span className="warning-content">
          Bạn có chắc chắn muốn thay đổi mật khẩu ?
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            try {
              const res = await userServices.changePassword(data);
              if (res.status === OK) {
                reset();
                toast.success('Thay đổi mật khẩu thành công !');
              }
            } catch (error) {
              toast.error(error.response.data.message);
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
    });
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-5">
      <div className="flex flex-col items-center justify-center mx-auto  lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            action="#"
            onSubmit={handleSubmit(handleChangepassword)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Mật khẩu cũ
              </label>
              <input
                type={type}
                name="old_password"
                id="old_password"
                className={`bg-gray-50 border ${
                  errors['old_password'] ? 'border-red-300' : 'border-gray-300'
                }  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="••••••••"
                required=""
                {...register('old_password', { required: true })}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Mật khẩu mới
              </label>
              <input
                type={type}
                name="new_password"
                id="new_password"
                placeholder="••••••••"
                className={`bg-gray-50 border ${
                  errors['new_password'] ? 'border-red-300' : 'border-gray-300'
                }  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                required=""
                {...register('new_password', { required: true })}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Xác nhận mật khẩu
              </label>
              <input
                type={type}
                name="new_password_confirmation"
                id="new_password_confirmation"
                placeholder="••••••••"
                className={`bg-gray-50 border ${
                  errors['new_password_confirmation']
                    ? 'border-red-300'
                    : 'border-gray-300'
                }  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                required=""
                {...register('new_password_confirmation', { required: true })}
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="newsletter"
                  onClick={handleChnageType}
                  aria-describedby="newsletter"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required=""
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="newsletter"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  Hiển thị mật khẩu
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
