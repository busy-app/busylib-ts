// Type compatibility of the new BusyBar with BusyBar-old, checked by `typecheck` (tsconfig.test.json); removed together with BusyBar-old.
import type { BusyBar as OldBusyBar } from 'BusyBar-old/index';
import type { BusyBar, ScreenFrameGetOptions } from 'BusyBar/index';

type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Assert<T extends true> = T;
// Fails with the offending names in the error: Type '"DisplayClear"' does not satisfy the constraint 'never'.
type AssertNone<T extends never> = T;

// Members of the class itself, not generated from the functions.
type Fixed = 'client' | 'addr' | 'apiSemver' | 'apiClient' | 'setToken' | 'setHTTPAccessPassword';
type Methods = Exclude<keyof BusyBar, Fixed>;

// Generic methods: OmitThisParameter drops their type parameters, so they are compared per instantiation below.
type Generic = 'DisplayScreenFrameGet';

// Old methods declare `this: BusyBar`, the new ones are plain methods.
type Mismatching<K extends keyof BusyBar & keyof OldBusyBar> = { [M in K]: Equals<OmitThisParameter<OldBusyBar[M]>, BusyBar[M]> extends true ? never : M }[K];

export type OnlyClientIsNew = Assert<Equals<Exclude<keyof BusyBar, keyof OldBusyBar>, 'client'>>;

export type SameMethods = AssertNone<Mismatching<Exclude<Methods, Generic>>>;

export type SameFixedMembers = AssertNone<Mismatching<'setToken' | 'setHTTPAccessPassword'>>;
export type SameAddr = Assert<Equals<OldBusyBar['addr'], BusyBar['addr']>>;
export type SameApiSemver = Assert<Equals<OldBusyBar['apiSemver'], BusyBar['apiSemver']>>;

// Instantiation expressions work on values only.
declare const oldBar: OldBusyBar;
declare const bar: BusyBar;

type ScreenFrame<T extends ScreenFrameGetOptions | undefined> = Equals<
  OmitThisParameter<typeof oldBar.DisplayScreenFrameGet<T>>,
  typeof bar.DisplayScreenFrameGet<T>
>;

export type SameScreenFrameGet = Assert<
  Equals<
    [
      ScreenFrame<undefined>,
      ScreenFrame<ScreenFrameGetOptions>,
      ScreenFrame<{ dataType: 'blob' }>,
      ScreenFrame<{ dataType: 'binary' }>,
      ScreenFrame<{ dataType: 'binary'; format: 'rgba' }>
    ],
    [true, true, true, true, true]
  >
>;
