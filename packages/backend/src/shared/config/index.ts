type Environment =
  | 'development'
  | 'production'
  | 'test'
  | 'staging'
  | 'ci';

type Script = 'start' | 'test:unit' | 'test:infra' | 'test:e2e';

export class Config {
  public env: Environment;
  public script: Script;

  constructor(script: Script) {
    this.env = (process.env.NODE_ENV as Environment) || 'development';
    this.script = script;
  }
}
