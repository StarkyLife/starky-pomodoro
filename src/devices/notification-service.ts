import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/function';
import { NotifyFn } from '../use-cases/dependencies/notification';
import notificationMusicUrl from './notification.mp3';

type NotificationService = {
  notify: NotifyFn;
};

const initialize =
  Notification.permission === 'default'
    ? pipe(
        TE.tryCatch(() => Notification.requestPermission(), E.toError),
        TE.map(constVoid)
      )
    : TE.of<Error, void>(constVoid());

initialize();

const audio = new Audio(notificationMusicUrl);

const notify = (text: string) =>
  pipe(
    IO.Do,
    IO.map(() =>
      pipe(
        Notification.permission,
        O.fromPredicate((permission) => permission === 'granted'),
        O.map(() => new Notification(text)),
        O.fold(constVoid, constVoid)
      )
    ),
    IO.map(() => audio.play())
  );

export const notificationService: NotificationService = {
  notify,
};
