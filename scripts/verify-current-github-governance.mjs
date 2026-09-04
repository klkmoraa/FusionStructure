import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)));
const defaultRoot = resolve(scriptDirectory, '..');
const repository = 'klkmoraa/FusionStructure';
const branch = 'main';
const requiredCheck = Object.freeze({
  context: 'Puerta de calidad',
  appId: 15368,
});
const expectedReviewArtifact = Object.freeze({
  id: 5106815679,
  url: 'https://github.com/klkmoraa/FusionStructure/pull/15#pullrequestreview-5106815679',
  reviewer: 'chatgpt-codex-connector[bot]',
  state: 'COMMENTED',
  commit: '9941ae8540bde4110d6820c3ffe6b76a51b2bd75',
});
const endpoints = Object.freeze({
  repository: `repos/${repository}`,
  branchProtection: `repos/${repository}/branches/${branch}/protection`,
  rulesets: `repos/${repository}/rulesets`,
  workflowRuns: `repos/${repository}/actions/workflows/ci.yml/runs?branch=${branch}&event=push&status=completed&per_page=1`,
  reviews: `repos/${repository}/pulls/15/reviews`,
});

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const verificationError = (message) => new Error(`Current GitHub governance verification failed: ${message}`);

const endpointLabel = (endpoint) => `GET /${endpoint}`;

const asRecord = (value, name) => {
  if (!isRecord(value)) throw verificationError(`${name} response is not an object`);
  return value;
};

const asArray = (value, name) => {
  if (!Array.isArray(value)) throw verificationError(`${name} response is not an array`);
  return value;
};

const expectBoolean = (value, expected, name) => {
  if (value !== expected) throw verificationError(`${name} must be ${expected}`);
};

const readCurrentGovernanceRecord = (root = defaultRoot) => {
  const path = resolve(root, 'migration', 'github-governance-current.json');
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error';
    throw verificationError(`could not read the static governance record: ${detail}`);
  }
};

const assertStaticRecordIsNonAuthorizing = (currentRecord) => {
  const record = asRecord(currentRecord, 'Static governance record');
  const repositorySplit = asRecord(record.repositorySplit, 'Static repositorySplit');
  if (repositorySplit.allowed !== false
    || repositorySplit.requiresFreshLiveVerification !== true
    || repositorySplit.liveVerificationCommand !== 'npm run migration:verify-governance') {
    throw verificationError('static governance evidence must not authorize a repository split');
  }

  const statusChecks = asRecord(
    asRecord(asRecord(record.enforcement, 'Static enforcement').branchProtection, 'Static branch protection').requiredStatusChecks,
    'Static required status checks',
  );
  const staticBinding = asArray(statusChecks.checks, 'Static required status checks.checks')
    .find((check) => isRecord(check) && check.context === requiredCheck.context && check.appId === requiredCheck.appId);
  if (!Array.isArray(statusChecks.contexts) || !statusChecks.contexts.includes(requiredCheck.context) || !staticBinding) {
    throw verificationError(`${requiredCheck.context} must be recorded with GitHub Actions app ${requiredCheck.appId}`);
  }

  const exception = asRecord(record.soleOwnerException, 'Static sole-owner exception');
  if (exception.authorizedWorkstream !== 'multi-repository migration governance'
    || exception.decisionRecord !== 'docs/adr/0002-sole-owner-governance-exception.md'
    || exception.enforceAdmins !== false
    || exception.ownerBypassRetained !== true) {
    throw verificationError('static sole-owner exception is incomplete');
  }

  const ownerBypassDecision = exception.ownerBypassDecision;
  if (!isRecord(ownerBypassDecision)
    || typeof ownerBypassDecision.recordedAt !== 'string'
    || ownerBypassDecision.decision !== 'Retain enforceAdmins:false for the sole-owner repository; this is a bypassable exception, not non-bypassable enforcement.') {
    throw verificationError('static owner-bypass decision is incomplete');
  }

  const controls = asRecord(exception.compensatingControls, 'Static compensating controls');
  const noDirectPushes = controls.noDirectPushes;
  if (!isRecord(noDirectPushes)
    || noDirectPushes.policy !== 'Routine changes to main are submitted through pull requests; direct pushes are prohibited by this workstream policy.'
    || noDirectPushes.remoteLimitation !== 'The sole owner can bypass branch protection because enforceAdmins is false.') {
    throw verificationError('static no-direct-push control is incomplete');
  }
  const pullRequest = controls.pullRequest;
  if (!isRecord(pullRequest)
    || pullRequest.required !== true
    || pullRequest.minimumApprovingReviews !== 1
    || pullRequest.dismissStaleReviews !== true
    || pullRequest.requireCodeOwnerReviews !== true
    || pullRequest.requireLastPushApproval !== true) {
    throw verificationError('static pull-request control is incomplete');
  }
  const currentCi = controls.currentCi;
  if (!isRecord(currentCi)
    || currentCi.workflow !== 'CI'
    || !isRecord(currentCi.requiredStatusCheck)
    || currentCi.requiredStatusCheck.context !== requiredCheck.context
    || currentCi.requiredStatusCheck.appId !== requiredCheck.appId) {
    throw verificationError('static current-CI control is incomplete');
  }

  const reviewArtifact = asRecord(
    controls.independentReviewArtifact,
    'Static independent review artifact',
  );
  if (reviewArtifact.kind !== 'pull-request-review'
    || reviewArtifact.url !== expectedReviewArtifact.url
    || reviewArtifact.reviewer !== expectedReviewArtifact.reviewer
    || reviewArtifact.state !== expectedReviewArtifact.state
    || reviewArtifact.commit !== expectedReviewArtifact.commit) {
    throw verificationError('static independent review artifact is incomplete');
  }

  return exception;
};

export const createGithubApiRequester = ({ spawn = spawnSync } = {}) => (endpoint) => {
  let result;
  try {
    result = spawn('gh', [
      'api',
      '--method',
      'GET',
      '-H',
      'Accept: application/vnd.github+json',
      endpoint,
    ], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
      shell: false,
      windowsHide: true,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error';
    throw new Error(`GitHub CLI (gh) could not start: ${detail}`);
  }

  if (result?.error) {
    if (result.error.code === 'ENOENT') throw new Error('GitHub CLI (gh) is unavailable');
    throw new Error(`GitHub CLI (gh) could not start: ${result.error.message}`);
  }
  if (!result || result.status !== 0) {
    throw new Error(`GitHub API request failed for ${endpoint} (exit ${result?.status ?? 'unknown'})`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`GitHub API returned invalid JSON for ${endpoint}`);
  }
};

const queryCurrentGithub = (requestJson, endpoint) => {
  try {
    return requestJson(endpoint);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error';
    throw new Error(`Current GitHub governance verification could not query ${endpointLabel(endpoint)}: ${detail}`);
  }
};

const verifyRepository = (response) => {
  const currentRepository = asRecord(response, 'Repository');
  if (currentRepository.full_name !== repository) throw verificationError(`repository must remain ${repository}`);
  expectBoolean(currentRepository.private, false, 'repository private');
  if (currentRepository.default_branch !== branch) throw verificationError(`default branch must remain ${branch}`);
  return {
    endpoint: endpointLabel(endpoints.repository),
    httpStatus: 200,
    fullName: repository,
    visibility: 'public',
    defaultBranch: branch,
  };
};

const verifyBranchProtection = (response) => {
  const protection = asRecord(response, 'Branch protection');
  const statusChecks = asRecord(protection.required_status_checks, 'required status checks');
  if (statusChecks.strict !== true) throw verificationError('required status checks must be strict');
  if (!Array.isArray(statusChecks.contexts) || !statusChecks.contexts.includes(requiredCheck.context)) {
    throw verificationError(`${requiredCheck.context} must remain a required status-check context`);
  }
  const appBinding = asArray(statusChecks.checks, 'required status checks.checks')
    .find((check) => isRecord(check) && check.context === requiredCheck.context && check.app_id === requiredCheck.appId);
  if (!appBinding) {
    throw verificationError(`${requiredCheck.context} must be bound to GitHub Actions app ${requiredCheck.appId}`);
  }

  const reviews = asRecord(protection.required_pull_request_reviews, 'required pull-request reviews');
  if (reviews.required_approving_review_count !== 1
    || reviews.dismiss_stale_reviews !== true
    || reviews.require_code_owner_reviews !== true
    || reviews.require_last_push_approval !== true) {
    throw verificationError('pull-request review protection is not current');
  }
  expectBoolean(asRecord(protection.required_conversation_resolution, 'required conversation resolution').enabled, true, 'conversation resolution');
  expectBoolean(asRecord(protection.required_linear_history, 'required linear history').enabled, true, 'linear history');
  expectBoolean(asRecord(protection.allow_force_pushes, 'allow force pushes').enabled, false, 'force pushes');
  expectBoolean(asRecord(protection.allow_deletions, 'allow deletions').enabled, false, 'deletions');
  expectBoolean(asRecord(protection.enforce_admins, 'enforce admins').enabled, false, 'enforceAdmins');

  return {
    endpoint: endpointLabel(endpoints.branchProtection),
    httpStatus: 200,
    enforced: true,
    requiredStatusChecks: {
      strict: true,
      contexts: [requiredCheck.context],
      checks: [requiredCheck],
    },
    requiredPullRequestReviews: {
      requiredApprovingReviewCount: 1,
      dismissStaleReviews: true,
      requireCodeOwnerReviews: true,
      requireLastPushApproval: true,
    },
    requiredConversationResolution: true,
    requiredLinearHistory: true,
    allowForcePushes: false,
    allowDeletions: false,
    enforceAdmins: false,
    ownerBypassRetained: true,
  };
};

const verifyRulesets = (response) => {
  const rulesets = asArray(response, 'Rulesets');
  if (rulesets.length !== 0) throw verificationError('ruleset evidence differs from the active branch-protection configuration');
  return {
    endpoint: endpointLabel(endpoints.rulesets),
    httpStatus: 200,
    activeRulesetCount: 0,
    activeEnforcement: 'branch-protection',
  };
};

const verifyCurrentCi = (response) => {
  const runs = asArray(asRecord(response, 'Workflow runs').workflow_runs, 'Workflow runs.workflow_runs');
  const latestRun = asRecord(runs[0], 'Latest completed CI workflow run');
  if (latestRun.name !== 'CI'
    || latestRun.event !== 'push'
    || latestRun.status !== 'completed'
    || latestRun.conclusion !== 'success'
    || latestRun.head_branch !== branch
    || typeof latestRun.id !== 'number'
    || typeof latestRun.html_url !== 'string') {
    throw verificationError('current CI does not have a successful completed main push run');
  }
  return {
    verified: true,
    workflow: 'CI',
    context: requiredCheck.context,
    appId: requiredCheck.appId,
    runId: latestRun.id,
    url: latestRun.html_url,
    headSha: latestRun.head_sha,
  };
};

const verifyIndependentReviewArtifact = (response) => {
  const reviews = asArray(response, 'Pull-request reviews');
  const artifact = reviews.find((review) => isRecord(review)
    && review.id === expectedReviewArtifact.id
    && review.state === expectedReviewArtifact.state
    && review.user?.login === expectedReviewArtifact.reviewer
    && review.commit_id === expectedReviewArtifact.commit
    && review.html_url === expectedReviewArtifact.url);
  if (!artifact) throw verificationError('Recorded independent review artifact is unavailable');
  return {
    verified: true,
    id: expectedReviewArtifact.id,
    url: expectedReviewArtifact.url,
    reviewer: expectedReviewArtifact.reviewer,
    state: expectedReviewArtifact.state,
    commit: expectedReviewArtifact.commit,
  };
};

export const verifyCurrentGithubGovernance = ({
  currentRecord = readCurrentGovernanceRecord(),
  now = () => new Date(),
  requestJson = createGithubApiRequester(),
} = {}) => {
  if (typeof requestJson !== 'function') throw verificationError('requestJson must be a function');
  const soleOwnerException = assertStaticRecordIsNonAuthorizing(currentRecord);
  const repositoryEvidence = verifyRepository(queryCurrentGithub(requestJson, endpoints.repository));
  const branchProtection = verifyBranchProtection(queryCurrentGithub(requestJson, endpoints.branchProtection));
  const rulesets = verifyRulesets(queryCurrentGithub(requestJson, endpoints.rulesets));
  const currentCi = verifyCurrentCi(queryCurrentGithub(requestJson, endpoints.workflowRuns));
  const independentReviewArtifact = verifyIndependentReviewArtifact(queryCurrentGithub(requestJson, endpoints.reviews));
  const verifiedAt = now();
  if (!(verifiedAt instanceof Date) || Number.isNaN(verifiedAt.getTime())) throw verificationError('now must return a valid Date');

  return {
    schemaVersion: 1,
    verifiedAt: verifiedAt.toISOString(),
    repository: repositoryEvidence,
    enforcement: {
      branchProtection,
      rulesets,
    },
    repositorySplit: {
      allowed: true,
      staticRecordAllowed: false,
      authorization: 'fresh-live-verification-only',
    },
    soleOwnerException: {
      authorizedWorkstream: soleOwnerException.authorizedWorkstream,
      decisionRecord: soleOwnerException.decisionRecord,
      ownerBypassDecision: soleOwnerException.ownerBypassDecision,
      enforceAdmins: false,
      ownerBypassRetained: true,
      enforcementNonBypassable: false,
      compensatingControls: {
        noDirectPushes: soleOwnerException.compensatingControls.noDirectPushes,
        pullRequestRequired: true,
        currentCi,
        independentReviewArtifact,
      },
    },
  };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw verificationError('this gate accepts no repository or branch override');
    const result = verifyCurrentGithubGovernance();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
