export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
export const GOOGLE_ANALITYCS = process.env.GOOGLE_ANALITYCS;
export const TOAST_AUTOCLOSE_DURATION = parseInt(process.env.TOAST_AUTOCLOSE_DURATION, 10) || 5000;
