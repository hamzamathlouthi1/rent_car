import { HttpInterceptorFn } from '@angular/common/http';

const API_MAP: [string, string][] = [
  ['/api/admin/cars', 'https://cars-service-r956.onrender.com/api/admin/cars'],
  ['/api/cars', 'https://cars-service-r956.onrender.com/api/cars'],
  ['/api/admin/reservations', 'https://reservations-service-72vt.onrender.com/api/admin/reservations'],
  ['/api/reservations', 'https://reservations-service-72vt.onrender.com/api/reservations'],
  ['/api/', 'https://user-service-0cvp.onrender.com/api/'],
];

function rewriteUrl(url: string): string {
  for (const [prefix, target] of API_MAP) {
    if (url.startsWith(prefix)) {
      return target + url.slice(prefix.length);
    }
  }
  return url;
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const rewritten = request.clone({ url: rewriteUrl(request.url) });
  const token = localStorage.getItem('fm_access_token');
  return next(token ? rewritten.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : rewritten);
};