import { useState, useEffect, useRef } from 'react';
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from '../../../redux/services/user/userService';
import { Dropdown } from 'flowbite-react';
import { User as UserType } from '../../../types';

function PersonalTab() {
  const { data, isLoading } = useGetUserInfoQuery('User');
  const [userInfo, setUserInfo] = useState<UserType | undefined>();

  const firstNameRef = useRef(document.createElement('input'));
  const lastNameRef = useRef(document.createElement('input'));
  const schoolRef = useRef(document.createElement('input'));
  const majorRef = useRef(document.createElement('input'));
  const birthdayRef = useRef(document.createElement('input'));
  const [gender, setGender] = useState<string | undefined>(userInfo?.gender);

  const saveHandler = () => {

    console.table([
      firstNameRef.current.value,
      lastNameRef.current.value,
      schoolRef.current.value,
      majorRef.current.value,
      birthdayRef.current.value,
      gender
    ]);

  };

  useEffect(() => {
    if (data && !isLoading) {
      setUserInfo(data[0]);
    }
  }, [data, isLoading]);
  return (
    <>
      {userInfo ? (
        <div className="flex flex-col gap-6 sm:gap-28">
          <form id="changes">
            <div className="grid gap-3 sm:grid-cols-2 sm:grid-rows-3">
              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  First name
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  id="first_name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.firstName}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last name
                </label>
                <input
                  ref={lastNameRef}
                  type="text"
                  id="last_name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.lastName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="school"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  School
                </label>
                <input
                  ref={schoolRef}
                  type="text"
                  id="school"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.school}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="Major"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Major
                </label>
                <input
                  ref={majorRef}
                  type="text"
                  id="Major"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.major}
                  required
                />
              </div>
              <div className="flex items-end">
                <Dropdown label={userInfo.gender} size="lg">
                  <Dropdown.Item onClick={() => setGender('Male')}>
                    Male
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setGender('Female')}>
                    Female
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setGender('Binary')}>
                    Binary
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setGender('Transgender')}>
                    Transgender
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setGender('Intersex')}>
                    Intersex
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setGender('Other')}>
                    Other
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setGender('I prefer not to say')}
                  >
                    I prefer not to say
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </label>
                <input
                  ref={birthdayRef}
                  type="date"
                  id="birthdate"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </form>
          <button
            type="button"
            onClick={saveHandler}
            form="changes"
            className="w-full rounded-full bg-blue-600 px-8 py-3 font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>User information not available.</div>
      )}
    </>
  );
}

export default PersonalTab;
