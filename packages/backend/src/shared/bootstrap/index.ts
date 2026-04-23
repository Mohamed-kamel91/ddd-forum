import { CompositionRoot } from '../composition-root';
import { Config } from '../config';

const config = new Config('start');
const compositionRoot = CompositionRoot.createCompositionRoot(config);

export const webServer = compositionRoot.getWebServer();
export const database = compositionRoot.getDatabase();
export const app = webServer.getApp();

export async function bootstrap() {
  await database.connect();
  await webServer.start();
}
