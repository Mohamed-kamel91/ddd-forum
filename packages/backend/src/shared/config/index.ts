type Environment =
  | 'development'
  | 'production'
  | 'test'
  | 'staging'
  | 'ci';

type Script =
  | 'start'
  | 'start:dev'
  | 'test:unit'
  | 'test:infra'
  | 'test:e2e';

export class Config {
  private readonly env: Environment;
  private readonly script: Script;

  constructor(script: Script) {
    this.env = (process.env.NODE_ENV as Environment) || 'development';
    this.script = script;
  }

  public getEnvironment() {
    return this.env;
  }

  public getScript() {
    return this.script;
  }
}
