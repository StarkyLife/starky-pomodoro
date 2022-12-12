import * as O from 'fp-ts/Option';
import { constant, identity, pipe } from 'fp-ts/function';
import { combine, sample, split } from 'effector';

import { phasesStorage } from '../devices/phases-storage';
import { timerWorkerGatewayFactory } from '../devices/timer';
import { notificationService } from '../devices/notification-service';
import {
  nextPhaseInitiated,
  pomodoroInitialized,
  pomodoroPhaseFinished,
  pomodoroPhaseStarted,
  pomodoroPhaseStopped,
  restTimeChanged,
  timerClicked,
  timerTicked,
  workTimeChanged,
} from './events';
import {
  initializePomodoroFx,
  startPomodoroFx,
  stopPomodoroPhaseFx,
  finishPomodoroFx,
} from './effects';
import {
  $pomodoroPhase,
  $phaseStartTime,
  $remainingTime,
  $workTimeConfig,
  $restTimeConfig,
  $config,
} from './stores';

$pomodoroPhase.on(nextPhaseInitiated, (_, nextPhase) => O.some(nextPhase));
$pomodoroPhase.on(initializePomodoroFx.doneData, (_, phase) => O.some(phase));

$phaseStartTime.on(pomodoroPhaseStarted, () => O.some(new Date()));
$phaseStartTime.reset(nextPhaseInitiated);

$remainingTime.on($pomodoroPhase, (_, phase) =>
  pipe(
    phase,
    O.fold(constant(0), ({ countDown }) => countDown),
  ),
);
$remainingTime.on(timerTicked, (_, remainingTime) => remainingTime);

$workTimeConfig.on(workTimeChanged, (_, newTime) => newTime);
$restTimeConfig.on(restTimeChanged, (_, newTime) => newTime);

const timerGateway = timerWorkerGatewayFactory();
timerGateway.subscribeToFinish(pomodoroPhaseFinished)();
timerGateway.subscribeToTicks(timerTicked)();

sample({
  clock: $config,
  source: $phaseStartTime,
  filter: O.isNone,
  target: pomodoroInitialized,
});
sample({
  clock: pomodoroInitialized,
  source: $config,
  target: initializePomodoroFx,
});

split({
  clock: timerClicked,
  source: combine([$pomodoroPhase, $remainingTime]),
  match: ([phase, remainingTime]) =>
    pipe(
      phase,
      O.map(({ countDown }) => (countDown > remainingTime ? 'stop' : 'start')),
      O.fold(constant('skip'), identity),
    ),
  cases: {
    start: pomodoroPhaseStarted,
    stop: pomodoroPhaseStopped,
  },
});

sample({
  clock: pomodoroPhaseStarted,
  source: $pomodoroPhase,
  filter: O.isSome,
  fn: (phase) =>
    pipe(
      phase,
      O.fold(constant(0), ({ countDown }) => countDown),
      (countDown) => ({ countDown, startTimer: timerGateway.start }),
    ),
  target: startPomodoroFx,
});

sample({
  clock: pomodoroPhaseStopped,
  source: combine([$pomodoroPhase, $config]),
  fn: ([currentPhase, config]) => ({
    stopTimer: timerGateway.stop,
    currentPhase,
    config,
  }),
  target: stopPomodoroPhaseFx,
});
sample({
  source: stopPomodoroPhaseFx.doneData,
  filter: Boolean,
  target: nextPhaseInitiated,
});

sample({
  clock: pomodoroPhaseFinished,
  source: combine([$pomodoroPhase, $phaseStartTime, $config]),
  fn: ([phase, startTime, config]) => ({
    savePhase: phasesStorage.save,
    notify: notificationService.notify,
    phase,
    startTime,
    config,
  }),
  target: finishPomodoroFx,
});
sample({
  source: finishPomodoroFx.doneData,
  filter: Boolean,
  target: nextPhaseInitiated,
});
