import './styles.css';
import './design-system/material.css';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { WelcomeScreen, type HomeView } from './features/welcome/WelcomeScreen';
import { ProjectProvider } from './store/ProjectContext';
import { useProject } from './store/ProjectContext';
import { ClassroomSessionProvider } from './store/ClassroomSessionContext';
import { useI18n } from './i18n/useI18n';
import { rememberLanguage } from './i18n/languagePreference';
import { Space3DEntryDialog, type Space3DEntryOrigin } from './features/space3d/Space3DEntryDialog';
import { onLaunchedFile } from './platform/launchedFile';
import { safeProjectFilename } from './utils/export';
import { decodeProjectFragment } from './utils/shareLink';
import { readAppRoute, writeAppRoute, type AppScreen } from './appRoute';
import {
  cancelPlanar2DToSpace3DHandoff,
  isExternal2DTo3DHandoffEnabled,
  preparePlanar2DToSpace3DHandoff,
  type Planar2DToSpace3DHandoffV1,
} from './integrations/planar2dToSpace3d';

const loadWorkspaceShell = () => import('./features/workspace/WorkspaceShell');
const WorkspaceShell = lazy(loadWorkspaceShell);
// Space 3D es la única superficie 3D del producto: su dominio, su worker y
// Three.js sólo entran en el grafo cuando el usuario abre la pantalla.
const loadSpace3DWorkspace = () => import('./features/space3d/Space3DWorkspace');
const Space3DWorkspace = lazy(loadSpace3DWorkspace);
const PwaUpdateNotice = lazy(() => import('./platform/PwaUpdateNotice').then((module) => ({ default: module.PwaUpdateNotice })));
const PortableImportCenter = lazy(() => import('./features/import-export/PortableImportCenter').then((module) => ({ default: module.PortableImportCenter })));

/**
 * De dónde se abrió Space 3D. Desde la mesa 2D se abre el proyecto actual
 * convertido al dominio espacial; desde Inicio, un modelo espacial propio.
 */
type Space3DOrigin = Space3DEntryOrigin;

interface Space3DEntryRequest {
  readonly origin: Space3DEntryOrigin;
  readonly handoff: Planar2DToSpace3DHandoffV1 | null;
}

const AppShell = () => {
  const [initialRoute] = useState(() => readAppRoute(window.location.search));
  const [screen, setScreen] = useState<AppScreen>(initialRoute.screen);
  const [welcomeInitialView, setWelcomeInitialView] = useState<HomeView>(initialRoute.welcomeView);
  const [space3dOrigin, setSpace3DOrigin] = useState<Space3DOrigin>(initialRoute.space3dOrigin);
  const [space3DEntryRequest, setSpace3DEntryRequest] = useState<Space3DEntryRequest | null>(null);
  const [space3DHandoff, setSpace3DHandoff] = useState<Planar2DToSpace3DHandoffV1 | null>(null);
  const [launchedFile, setLaunchedFile] = useState<File | null>(null);
  const { project, analysis, replaceProject } = useProject();
  const { t } = useI18n();

  const navigate = useCallback((next: AppScreen, view: HomeView = 'home', origin: Space3DOrigin = 'standalone') => {
    if (next === 'welcome') setWelcomeInitialView(view);
    if (next === 'space3d') setSpace3DOrigin(origin);
    else setSpace3DHandoff(null);
    setScreen(next);
    writeAppRoute({ screen: next, welcomeView: view, space3dOrigin: origin });
  }, []);

  useEffect(() => {
    document.documentElement.lang = project.settings.language;
    rememberLanguage(project.settings.language);
  }, [project.settings.language]);

  useEffect(() => {
    const preload = () => { void loadWorkspaceShell(); };
    const idleWindow = window as Window & { requestIdleCallback?: typeof window.requestIdleCallback };
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(preload, { timeout: 1800 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(preload, 700);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => onLaunchedFile(({ file }) => {
    setLaunchedFile(file);
    navigate('workspace');
  }), [navigate]);

  useEffect(() => {
    const receiveSharedProject = () => {
      const decoded = decodeProjectFragment(window.location.hash);
      if (!decoded.ok) return;
      // El enlace no sustituye el proyecto: se convierte en un archivo temporal
      // y entra al mismo importador con revisión y confirmación explícita.
      const name = `${safeProjectFilename(decoded.project.name)}.fusionstructure.json`;
      setLaunchedFile(new File([JSON.stringify(decoded.project)], name, { type: 'application/json' }));
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      navigate('workspace');
    };
    receiveSharedProject();
    window.addEventListener('hashchange', receiveSharedProject);
    return () => window.removeEventListener('hashchange', receiveSharedProject);
  }, [navigate]);
  const requestSpace3D = (origin: Space3DEntryOrigin) => {
    const handoff = origin === 'workspace' && isExternal2DTo3DHandoffEnabled()
      ? preparePlanar2DToSpace3DHandoff(project)
      : null;
    setSpace3DEntryRequest({ origin, handoff });
  };
  const proceedToSpace3D = () => {
    if (!space3DEntryRequest) return;
    const { origin, handoff } = space3DEntryRequest;
    setSpace3DHandoff(handoff);
    setSpace3DEntryRequest(null);
    navigate('space3d', 'home', origin);
  };
  const cancelSpace3DEntry = () => {
    if (space3DEntryRequest?.handoff) cancelPlanar2DToSpace3DHandoff(space3DEntryRequest.handoff);
    setSpace3DEntryRequest(null);
  };
  const routeHandoff = space3dOrigin === 'workspace' && isExternal2DTo3DHandoffEnabled()
    ? space3DHandoff ?? preparePlanar2DToSpace3DHandoff(project)
    : null;
  const space3DEntry = space3DEntryRequest ? <Space3DEntryDialog
    language={project.settings.language}
    origin={space3DEntryRequest.origin}
    projectName={project.name}
    handoff={space3DEntryRequest.handoff}
    onCancel={cancelSpace3DEntry}
    onProceed={proceedToSpace3D}
  /> : null;
  const launchedImport = launchedFile ? <Suspense fallback={null}><PortableImportCenter
    open
    initialFile={launchedFile}
    currentProjectName={project.name}
    onClose={() => setLaunchedFile(null)}
    onImported={(outcome) => {
      replaceProject({ ...outcome.project, settings: { ...outcome.project.settings, language: project.settings.language } }, outcome.restoredAnalysis);
      setLaunchedFile(null);
      navigate('workspace');
    }}
  /></Suspense> : null;

  if (screen === 'welcome') {
    return <><ClassroomSessionProvider projectId={project.id} analysisAvailable={analysis?.success === true}><WelcomeScreen
      onOpenWorkspace={() => navigate('workspace')}
      onOpenSpace3D={() => requestSpace3D('standalone')}
      onPreloadWorkspace={() => { void loadWorkspaceShell(); }}
      onViewChange={(view) => writeAppRoute({ screen: 'welcome', welcomeView: view, space3dOrigin: 'standalone' })}
      initialView={welcomeInitialView}
    /></ClassroomSessionProvider>{space3DEntry}{launchedImport}</>;
  }

  if (screen === 'space3d') {
    // Space 3D no se envuelve en ClassroomSessionProvider: su modelo no es el
    // proyecto 2D y el Modo Aula no lo evalúa.
    return <>
      <Suspense fallback={<div className="workspace-loading" role="status" aria-label={t('space3d.loading')}><strong>FusionStructure</strong><LoaderCircle className="spin" size={22} /></div>}>
        <Space3DWorkspace
          language={project.settings.language}
          handoff={routeHandoff}
          onOpenHome={() => navigate('welcome', 'space3d')}
          onOpen2D={() => navigate('welcome', 'solver2d')}
        />
      </Suspense>{launchedImport}
    </>;
  }

  return <ClassroomSessionProvider projectId={project.id} analysisAvailable={analysis?.success === true}>
    <Suspense fallback={<div className="workspace-loading" role="status" aria-label={t('workspace.loading')}><strong>FusionStructure</strong><LoaderCircle className="spin" size={22} /></div>}>
      <WorkspaceShell projectId={project.id} onOpenHome={() => navigate('welcome', 'solver2d')} onOpenSpace3D={() => requestSpace3D('workspace')} />
    </Suspense>{space3DEntry}{launchedImport}
  </ClassroomSessionProvider>;
};

export default function App() {
  return <ProjectProvider><AppShell /><Suspense fallback={null}><PwaUpdateNotice /></Suspense></ProjectProvider>;
}
