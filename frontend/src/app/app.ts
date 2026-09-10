import { afterNextRender, Component, DestroyRef, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({ selector: 'app-root', imports: [RouterOutlet], templateUrl: './app.html', styleUrl: './app.scss' })
export class App {
  protected readonly loading = signal(true);
  protected readonly leaving = signal(false);

  constructor(destroyRef: DestroyRef) {
    afterNextRender(() => {
      const startedAt = performance.now();
      let closeTimer = 0;
      const hideLoader = () => {
        const remaining = Math.max(0, 900 - (performance.now() - startedAt));
        closeTimer = window.setTimeout(() => {
          this.leaving.set(true);
          closeTimer = window.setTimeout(() => this.loading.set(false), 480);
        }, remaining);
      };
      const fallbackTimer = window.setTimeout(hideLoader, 2400);
      if (document.readyState === 'complete') hideLoader();
      else window.addEventListener('load', hideLoader, { once: true });
      destroyRef.onDestroy(() => {
        window.clearTimeout(fallbackTimer);
        window.clearTimeout(closeTimer);
        window.removeEventListener('load', hideLoader);
      });
    });
  }
}
