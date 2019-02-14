type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};

// prettier-ignore
type PromiseReturnType<T extends (...args: any[]) => any> =
  ReturnType<T> extends Promise<infer U> ? U : T;
