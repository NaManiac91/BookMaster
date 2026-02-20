import { Router } from '@angular/router';

export function readNavigationState<T extends Record<string, any>>(router: Router): T {
  const navigationState = router.getCurrentNavigation()?.extras?.state || {};
  const historyState = (window?.history?.state || {}) as Record<string, any>;

  return {
    ...historyState,
    ...navigationState
  } as T;
}
