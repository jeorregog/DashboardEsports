export default class RedirectResolver {
  // Only same-site absolute paths are accepted, which prevents open redirects.
  public static resolve(redirect: unknown): string {
    if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }

    return '/';
  }
}
