import type { HomeView } from './features/welcome/WelcomeScreen';
import type { Space3DEntryOrigin } from './features/space3d/Space3DEntryDialog';

export type AppScreen = 'welcome' | 'workspace' | 'space3d';

export interface AppRoute {
  screen: AppScreen;
  welcomeView: HomeView;
  space3dOrigin: Space3DEntryOrigin;
}

const DEFAULT_ROUTE: AppRoute = { screen: 'welcome', welcomeView: 'home', space3dOrigin: 'standalone' };

const WELCOME_SURFACES: Readonly<Record<string, HomeView>> = {
  platform: 'home',
  solver2d: 'solver2d',
  projects: 'projects',
  templates: 'templates',
  library: 'library',
  classroom: 'classroom',
  import: 'import',
  solver3d: 'space3d',
};

const surfaceForRoute = (route: AppRoute): string => {
  if (route.screen === 'workspace') return 'workspace2d';
  if (route.screen === 'space3d') return 'workspace3d';
  return Object.entries(WELCOME_SURFACES).find(([, view]) => view === route.welcomeView)?.[0] ?? 'platform';
};

export const readAppRoute = (search: string): AppRoute => {
  const params = new URLSearchParams(search);
  const surface = params.get('surface');
  const space3dOrigin = params.get('origin') === 'workspace' ? 'workspace' : 'standalone';
  if (surface === 'workspace2d') return { ...DEFAULT_ROUTE, screen: 'workspace' };
  if (surface === 'workspace3d') return { ...DEFAULT_ROUTE, screen: 'space3d', space3dOrigin };
  const welcomeView = surface ? WELCOME_SURFACES[surface] : undefined;
  return welcomeView ? { ...DEFAULT_ROUTE, welcomeView } : DEFAULT_ROUTE;
};

export const writeAppRoute = (route: AppRoute, location: Location = window.location, history: History = window.history) => {
  const url = new URL(location.href);
  url.searchParams.set('surface', surfaceForRoute(route));
  if (route.screen === 'space3d' && route.space3dOrigin === 'workspace') url.searchParams.set('origin', 'workspace');
  else url.searchParams.delete('origin');
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
};
