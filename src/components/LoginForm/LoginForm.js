// @ts-nocheck
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  loginFBFunction,
  loginFunction,
  registerFunction,
} from '../../store/actions/user';
import { FormGroup, FormFeedback } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import ReactFacebookLogin from 'react-facebook-login';
import { toast } from 'react-toastify';
import CompleteInfo from './completeInfo';
import styled from 'styled-components';
 import logoCircel from '../../assets/images/Logintron.png';
const ButtonLoginFB = styled.div`
  .kep-login-facebook {
    border-radius: 30px !important;
    width: 100%;
  }
`;
const LoginForm = (props) => {
  const { isShowTermConditions, setIsShowTermConditions } = props;
  const REG = 'REGISTER';
  const LOGIN = 'LOGIN';
  const { loggedIn } = useSelector((state) => state.userReducer);
  const [typeForm, setTypeForm] = useState(LOGIN);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    criteriaMode: 'all',
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const registerSubmit = async (value) => {
    if (!value['remember']) {
      toast.error(' Vui lòng chấp nhận điều khoản sử dụng');
      return;
    }
    const { email, user_name, phone, password, password_confirmation } = value;
    const data = {
      email: email,
      user_name: user_name,
      first_name: user_name,
      last_name: user_name,
      phone: phone,
      password: password,
      password_confirmation: password_confirmation,
    };
    dispatch(registerFunction(data, setTypeForm, LOGIN, reset));
  };
  const submitLogin = useCallback(
    (dataSubmit) => {
      const data = {
        identifier: dataSubmit.identifier,
        password: dataSubmit.password,
        rememberMe: dataSubmit.remember,
      };
      dispatch(loginFunction(data));
    },
    [dispatch]
  );

  useEffect(() => {
    if (loggedIn === true) {
      history.push('/');
      window.location.reload();
    }
  }, [loggedIn, history]);

  /**
   * Handler on Submit event
   */
  const onSubmit = useCallback(
    (data, evt) => {
      submitLogin(data);
    },
    [submitLogin]
  );

  const responseFacebook = (response) => {
    const { error = null } = response;
    if (error) {
      toast.error('Đăng nhập không thành công');
    } else {
      dispatch(loginFBFunction(response, history));
    }
  };
  const changeType = () => {
    if (typeForm === LOGIN) setTypeForm(REG);
    else setTypeForm(LOGIN);
  };
  const remember = watch('remember');

  const onClickTermConditions = (e) => {
    e.preventDefault();
    setIsShowTermConditions(!isShowTermConditions);
  };

  return (
    <div className="w-full">
      <form
        className="w-full"
        onSubmit={
          typeForm === LOGIN
            ? handleSubmit(onSubmit)
            : handleSubmit(registerSubmit)
        }
        autoComplete="off"
      >
        <div className="flex justify-center">
           <img src={logoCircel} width={100} /> 
        </div>
        <h1 className="text-xl text-center font-bold mb-6 uppercase">
          {typeForm === LOGIN ? 'Đăng nhập' : 'Đăng ký'}{' '}
        </h1>
        <div>
          {typeForm === REG ? (
            <Fragment>
              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.user_name ? 'border border-red-500' : ''
                    }`}
                    type="text"
                    name="user_name"
                    id="user_name"
                    aria-invalid={errors.user_name ? 'true' : 'false'}
                    placeholder="Tên đăng nhập"
                    {...register('user_name', {
                      required: typeForm === REG,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/,
                        message: 'Tên đăng nhập không đúng định dạng !',
                      },
                    })}
                  />
                  {/* Error validate */}
                  {errors.user_name && (
                    <FormFeedback
                      className="text-red-500 pt-2"
                      invalid-feedback="true"
                    >
                      {errors.user_name.message}
                    </FormFeedback>
                  )}
                </FormGroup>
              </div>

              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.email ? 'border border-red-500' : ''
                    }`}
                    type="email"
                    name="email"
                    id="email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    placeholder="Email"
                    {...register('email', {
                      required: true,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Email không đúng định dạng !',
                      },
                    })}
                  />
                  {/* Error validate */}
                  {errors.email && (
                    <FormFeedback
                      className="text-red-500 pt-2"
                      invalid-feedback="true"
                    >
                      {errors.email.message}
                    </FormFeedback>
                  )}
                </FormGroup>
              </div>
              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.phone ? 'border border-red-500' : ''
                    }`}
                    type="text"
                    name="phone"
                    id="phone"
                    // aria-invalid={errors.phone ? 'true' : 'false'}
                    placeholder="Số điện thoại"
                    {...register('phone', {
                      required: typeForm === REG,
                      pattern: {
                        value: /^(\+)?\d{10,15}$/,
                        message: 'Số điện thoại không đúng định dạng!',
                      },
                    })}
                  />
                  {/* Error validate */}
                  {errors.phone && (
                    <FormFeedback
                      className="text-red-500 pt-2"
                      invalid-feedback="true"
                    >
                      {errors.phone.message}
                    </FormFeedback>
                  )}
                </FormGroup>
              </div>
              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.password ? 'border border-red-500' : ''
                    }`}
                    type="password"
                    name="password"
                    id="password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    placeholder="Mật khẩu"
                    {...register('password', {
                      required: true,
                      minLength: 8,
                    })}
                  />
                  {/* Error validate */}
                  {errors.password?.type === 'minLength' && (
                    <FormFeedback
                      className="text-red-500 pt-2"
                      invalid-feedback="true"
                    >
                      Mật khẩu tối thiểu 8 kí tự
                    </FormFeedback>
                  )}
                </FormGroup>
              </div>
              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.password_confirmation
                        ? 'border border-red-500'
                        : ''
                    }`}
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    aria-invalid={
                      errors.password_confirmation ? 'true' : 'false'
                    }
                    placeholder="Xác nhận mật khẩu"
                    {...register('password_confirmation', {
                      required: typeForm === REG,
                      validate: (val) => {
                        if (watch('password') != val) {
                          return 'Mật khẩu xác nhận không trùng khớp !';
                        }
                      },
                    })}
                  />
                  {/* Error validate */}
                  {errors.password_confirmation && (
                    <FormFeedback
                      className="text-red-500 pt-2"
                      invalid-feedback="true"
                    >
                      {errors.password_confirmation.message}
                    </FormFeedback>
                  )}
                </FormGroup>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.identifier ? 'border border-red-500' : ''
                    }`}
                    type="identifier"
                    name="identifier"
                    id="identifier"
                    aria-invalid={errors.identifier ? 'true' : 'false'}
                    placeholder="Email hoặc tài khoản"
                    {...register('identifier', {
                      required: true,
                    })}
                  />
                </FormGroup>
              </div>
              <div className="mb-4">
                <FormGroup>
                  <input
                    className={`block border border-solid border-gray-200 w-full h-12 px-6 outline-none rounded-full ${
                      errors.password ? 'border border-red-500' : ''
                    }`}
                    type="password"
                    name="password"
                    id="password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    placeholder="Mật khẩu"
                    {...register('password', {
                      required: true,
                      minLength: 8,
                    })}
                  />
                  {/* Error validate */}
                  {errors.password?.type === 'minLength' && (
                    <FormFeedback
                      className="text-red-500 pt-2"
                      invalid-feedback="true"
                    >
                      Mật khẩu tối thiểu 8 kí tự
                    </FormFeedback>
                  )}
                </FormGroup>
              </div>
            </Fragment>
          )}

          <div className="mb-4 px-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded-sm mr-2 cursor-pointer"
              id="remember"
              name="remember"
              defaultChecked={true}
              {...register('remember')}
            />
            {typeForm === LOGIN ? (
              <label htmlFor="remember" className="font-medium cursor-pointer">
                Ghi nhớ thông tin
              </label>
            ) : (
              <label htmlFor="remember" className="font-medium cursor-pointer">
                Bằng cách nhấn vào nút đăng ký, {'\n'} bạn đã đồng ý tới{' '}
                <span
                  className="underline"
                  onClick={(e) => onClickTermConditions(e)}
                >
                  điều khoản sử dụng
                </span>{' '}
                này
              </label>
            )}
          </div>
          <div className="flex flex-col gap-4 mb-10">
            <button
              className="block bg-red-700 text-white text-md font-medium w-full h-12 px-6 outline-none rounded-full hover:bg-gray-100 hover:text-black  hover:font-bold duration-200 transition-all disabled:opacity-75 enabled:opacity-100 "
              type="submit"
            >
              {typeForm === LOGIN ? 'Đăng nhập' : 'Đăng ký'}
            </button>
            <button
              className="block bg-gray-100 text-black-100 text-md font-medium w-full h-12 px-6 outline-none rounded-full hover:bg-red-700 hover:text-white hover:font-bold duration-200 transition-all"
              type="button"
              onClick={changeType}
            >
              {typeForm === REG ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>
          {typeForm === LOGIN && (
            <>
              <div className="px-2 relative">
                <div className="h-6 w-14 text-center rounded-full absolute -mt-3 text-xs leading-6 -ml-7 top-1/2 left-1/2 bg-white border border-solid border-gray-100">
                  hoặc
                </div>
                <div className="h-px w-full bg-gray-100 mb-10"></div>
              </div>
              <ButtonLoginFB>
                <ReactFacebookLogin
                  appId={`${process.env.FB_APP_ID}`}
                  autoLoad={false}
                  fields="name,email,picture"
                  scope={`${process.env.FB_APP_SCOPE}`}
                  // scope="public_profile,email,pages_read_engagement,pages_manage_posts,publish_to_groups,pages_show_list"
                  version={`${process.env.FB_APP_API_VERSION}`}
                  callback={responseFacebook}
                />
              </ButtonLoginFB>
              <div className="mt-2 text-red-500 italic text-sm">
                * Kingcontent là ứng dụng được Facebook chính thức cấp quyền
                hoạt động, tuy nhiên bạn có thể sử dụng tài khoản phụ để đăng
                nhập và tự chịu trách nhiệm bảo mật.
              </div>

              <ul className="list-disc mt-2">
                <li>
                  <a
                    href="https://kingcontent.pro/chinh-sach-bao-mat"
                    target="_blank"
                    className="underline"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="https://kingcontent.pro/huong-dan-su-dung"
                    target="_blank"
                    className="underline"
                  >
                    Hướng dẫn sử dụng
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </form>
      <CompleteInfo />
    </div>
  );
};

export default LoginForm;
