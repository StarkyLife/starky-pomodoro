import { cn, createBEM } from './classnames';

it('should combine classNames', () => {
  expect(cn('form')).toEqual('form');
  expect(cn('form', 'second', 'third')).toEqual('form second third');
  expect(cn('form', 'second', 'third')).toEqual('form second third');
});

it('should create BEM classNames', () => {
  expect(createBEM('form')('hidden', 'red')).toEqual('form form--hidden form--red');
  expect(createBEM('form__input')('hidden')).toEqual('form__input form__input--hidden');
});
