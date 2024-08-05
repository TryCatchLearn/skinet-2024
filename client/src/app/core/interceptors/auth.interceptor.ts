import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let clonedRequest = req.clone({
    withCredentials: true
  })

  return next(clonedRequest);
};
