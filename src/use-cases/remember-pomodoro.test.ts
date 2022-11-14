import { PomodoroPhase, rememberPomodoroPhase } from './remember-pomodoro';

const MOCKED_NOW = new Date('2022-11-13T06:25:00.000Z');

jest.useFakeTimers();
jest.setSystemTime(MOCKED_NOW)

it('should save finished pomodoro phase info to storage', () => {
  const pomodoroPhase: PomodoroPhase = {
    type: 'work',
    startTime: new Date('2022-11-13T06:00:00.000Z')
  };
  const saveFn = jest.fn();

  rememberPomodoroPhase(saveFn, pomodoroPhase);

  expect(saveFn).toHaveBeenCalledWith({
    type: pomodoroPhase.type,
    startTime: pomodoroPhase.startTime,
    endTime: MOCKED_NOW,
  });
});
