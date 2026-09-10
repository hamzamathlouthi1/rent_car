import { CommonModule } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';

type CarCategory = 'Citadine' | 'SUV' | 'Berline' | 'Premium';
interface Car { id: number; name: string; category: CarCategory; price: number; image: string; images:string[]; seats: number; transmission: string; fuel: string; badge?: string; }

@Component({ selector: 'app-home', imports: [CommonModule, RouterLink], templateUrl: './home.html', styleUrl: './home.scss' })
export class Home {
  constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly destroyRef: DestroyRef, private readonly http: HttpClient, protected readonly auth: AuthService, private readonly router:Router) {
    afterNextRender(() => {
      this.auth.restoreSession().subscribe();
      this.http.get<Car[]>('/api/cars').subscribe({ next: cars => this.cars.set(cars), error: () => this.cars.set([]) });
      const heroVideo = this.elementRef.nativeElement.querySelector<HTMLVideoElement>('.hero-video');
      if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        const playVideo = () => heroVideo.play().catch(() => undefined);
        const restartVideo = () => { heroVideo.currentTime = 0; playVideo(); };
        const resumeWhenVisible = () => { if (!document.hidden && heroVideo.paused) playVideo(); };
        heroVideo.addEventListener('canplay', playVideo);
        heroVideo.addEventListener('ended', restartVideo);
        document.addEventListener('visibilitychange', resumeWhenVisible);
        document.addEventListener('pointerdown', playVideo, { once: true });
        heroVideo.load();
        playVideo();
        this.destroyRef.onDestroy(() => {
          heroVideo.removeEventListener('canplay', playVideo);
          heroVideo.removeEventListener('ended', restartVideo);
          document.removeEventListener('visibilitychange', resumeWhenVisible);
          document.removeEventListener('pointerdown', playVideo);
        });
      }
      const elements = this.elementRef.nativeElement.querySelectorAll(
        '.section, .about, .review, .cta, .car-card, .services article'
      );

      elements.forEach((element, index) => {
        element.classList.add('scroll-reveal');
        (element as HTMLElement).style.setProperty('--delay', `${(index % 4) * 90}ms`);
      });

      if (!('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
        { threshold: 0.12, rootMargin: '0px 0px -50px' }
      );

      elements.forEach(element => observer.observe(element));
    });
  }

  protected readonly menuOpen = signal(false);
  protected readonly selectedMaxPrice = signal<number | null>(null);
  protected readonly activeFaq = signal<number | null>(0);
  protected logout(): void { this.auth.logout(); }
  protected readonly cars = signal<Car[]>([]);
  protected readonly faqs = [
    { q: 'Quels documents dois-je présenter ?', a: 'Une pièce d’identité, un permis de conduire valide depuis au moins 2 ans et une carte bancaire au nom du conducteur principal.' },
    { q: 'Le kilométrage est-il limité ?', a: 'La majorité de nos formules incluent un kilométrage illimité. Les éventuelles exceptions sont indiquées avant la réservation.' },
    { q: 'Puis-je modifier ou annuler ma réservation ?', a: 'Oui, la modification est gratuite jusqu’à 48 heures avant le départ. Nos conseillers restent disponibles 7j/7.' },
    { q: 'Proposez-vous la livraison du véhicule ?', a: 'Oui, nous livrons votre voiture à l’aéroport, à l’hôtel ou à l’adresse de votre choix dans les principales villes tunisiennes.' }
  ];
  protected get maximumPrice(): number { return Math.max(0, ...this.cars().map(car => car.price)); }
  protected get filteredCars(): Car[] {
    const maximum = this.selectedMaxPrice();
    return maximum === null ? this.cars() : this.cars().filter(car => car.price <= maximum);
  }
  protected filterByPrice(event: Event): void {
    this.selectedMaxPrice.set(Number((event.target as HTMLInputElement).value));
  }
  protected clearPriceFilter(): void { this.selectedMaxPrice.set(null); }
  protected toggleFaq(index: number): void { this.activeFaq.set(this.activeFaq() === index ? null : index); }
  protected reserve(car: Car): void { this.router.navigate(['/reservation',car.id]); }
}
