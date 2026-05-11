import { PuppeteerPageDriver } from '../driver';
import { NotificationsComponent } from '../components/notifications-component';
import { HeaderComponent } from '../layouts/header-component';
import { RegistrationPage } from './registration-page';

export type Components = {
  notifications: NotificationsComponent;
};

export type Layout = {
  header: HeaderComponent;
};

export type Pages = {
  registration: RegistrationPage;
};

export type App = {
  components: Components;
  layout: Layout;
  pages: Pages;
};

export const createAppPageObject = (
  pageDriver: PuppeteerPageDriver,
): App => {
  return {
    components: {
      notifications: new NotificationsComponent(pageDriver),
    },
    layout: {
      header: new HeaderComponent(pageDriver),
    },
    pages: {
      registration: new RegistrationPage(pageDriver),
    },
  };
};
