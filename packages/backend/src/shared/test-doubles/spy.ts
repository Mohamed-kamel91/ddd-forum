type MethodNames<T> = keyof T;

interface Call<T> {
  methodName: MethodNames<T>;
  args: any[];
  context?: any;
}

export abstract class Spy<T> {
  protected calls: Call<T>[];

  constructor() {
    this.calls = [];
  }

  protected addCall<MethodName extends MethodNames<T>>(
    methodName: MethodName,
    args: any[],
    context?: any,
  ) {
    const call: Call<T> = {
      methodName,
      args,
      context,
    };

    this.calls.push(call);
  }

  public getTimesMethodCalled<MethodName extends MethodNames<T>>(
    methodName: MethodName,
  ) {
    const calls = this.calls.filter(
      (call) => call.methodName === methodName,
    );

    return calls.length;
  }

  public getCalls() {
    return this.calls;
  }

  public reset() {
    this.calls = [];
  }
}
