import { Button } from 'flowbite-react';
import { useState } from 'react';
import { CalendarViewEnum } from '../../enums';
import { capitalizeWord } from '../../utils/functions';
import { FaAngleDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import WeeklyView from './Views/WeeklyView';
import { addDays, subDays, addMonths, subMonths, addYears, subYears, format } from 'date-fns';
import MonthlyView from './Views/MonthlyView';

const CalendarViewParent = () => {
  const [selectedView, setSelectedView] = useState<string>(
    localStorage.getItem('calendarView') || CalendarViewEnum.WEEK
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  // TODO: fix this so that the selected date persists across view changes!
  const [initialDisplayDate, setInitialDisplayDate] = useState(new Date());

  const handleViewSelection = (calendarView: CalendarViewEnum) => {
    localStorage.setItem('calendarView', calendarView);
    setSelectedView(calendarView);
    setIsDropdownOpen(false);
  };

  const leftArrowClickHandler = () => {
    switch (selectedView) {
      case CalendarViewEnum.DAY:
        setInitialDisplayDate(subDays(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.WEEK:
        setInitialDisplayDate(subDays(initialDisplayDate, 7));
        break;
      case CalendarViewEnum.MONTH:
        setInitialDisplayDate(subMonths(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.YEAR:
        setInitialDisplayDate(subYears(initialDisplayDate, 1));
        break;
      default:
        break;
    }
  };

  const rightArrowClickHandler = () => {
    switch (selectedView) {
      case CalendarViewEnum.DAY:
        setInitialDisplayDate(addDays(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.WEEK:
        setInitialDisplayDate(addDays(initialDisplayDate, 7));
        break;
      case CalendarViewEnum.MONTH:
        setInitialDisplayDate(addMonths(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.YEAR:
        setInitialDisplayDate(addYears(initialDisplayDate, 1));
        break;
      default:
        break;
    }
  };

  const horizontalDotsSVG = (
    <svg
      className="h-5 w-5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 3"
    >
      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );

  const renderView = () => {
    switch (selectedView) {
      case CalendarViewEnum.DAY:
        return 'Daily view';
      case CalendarViewEnum.WEEK:
        return <WeeklyView initialDisplayDate={initialDisplayDate} />;
      case CalendarViewEnum.MONTH:
        return <MonthlyView initialDisplayDate={initialDisplayDate} />;
      case CalendarViewEnum.YEAR:
        return 'Yearly view';
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-md border dark:border-slate-700">
        <header className="flex items-center justify-between border border-t-0 border-l-0 border-r-0 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-gray-800">
          <h1 className="text-md font-semibold">{format(initialDisplayDate, 'MMMM yyyy')}</h1>
          <div className="flex items-center gap-6">
            <Button.Group>
              <Button color="gray" onClick={leftArrowClickHandler}>
                <FaAngleLeft className="h-4" />
              </Button>
              <Button color="gray" size="sm" className="hidden md:block">
                <span className="px-3" onClick={() => setInitialDisplayDate(new Date())}>
                  Today
                </span>
              </Button>
              <Button color="gray" onClick={rightArrowClickHandler}>
                <FaAngleRight className="h-4" />
              </Button>
            </Button.Group>

            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hidden md:block"
                color="gray"
                size="sm"
              >
                {capitalizeWord(selectedView)} view
                <FaAngleDown className="ml-2 text-gray-500" />
              </Button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center rounded-lg p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
                type="button"
              >
                {horizontalDotsSVG}
              </button>
              {isDropdownOpen && (
                <div className="absolute top-12 right-0 z-50 w-36 rounded-lg bg-white py-1 shadow dark:bg-gray-700">
                  <ul className="text-sm text-gray-700 dark:divide-slate-600 dark:text-gray-200">
                    <li className="py-1 md:hidden">
                      <button className="w-full border-b border-b-gray-100 px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:border-b-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                        Create event
                      </button>
                    </li>
                    <li className="py-1 md:hidden">
                      <button className="w-full border-b border-b-gray-100 px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:border-b-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                        Today
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.DAY)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Day view
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.WEEK)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Week view
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.MONTH)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Month view
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.YEAR)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Year view
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Button size="sm" className="hidden md:block">
              Add event
            </Button>
          </div>
        </header>
        <main>{renderView()}</main>
      </div>
    </>
  );
};

export default CalendarViewParent;
