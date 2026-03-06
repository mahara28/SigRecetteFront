import {AuthGuard, PendingChangesGuard} from './auth.guard';
import {NonAuthGuard} from './non-auth.guard';

export const Guards = [
    AuthGuard,
    NonAuthGuard,
    PendingChangesGuard
];
